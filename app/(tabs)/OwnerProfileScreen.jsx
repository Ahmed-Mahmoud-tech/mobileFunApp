import React, { useEffect, useState } from "react"
import { StyleSheet, ScrollView, View, Alert } from "react-native"
import {
  TextInput,
  Button,
  Text,
  Card,
  List,
  IconButton,
  Divider,
  useTheme,
  Checkbox,
  Chip,
} from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useSelector } from "react-redux"
import useRequest from "@/axios/useRequest"
import { utcToLocal } from "@/common/time"
import Popup from "@/components/Popup/Popup"
const OwnerProfile = () => {
  const user = useSelector((state) => state.user.userInfo)
  const [phone, setPhone] = useState(user.phoneNumber || "")
  const [name, setName] = useState(user.username || "")
  const [roomName, setRoomName] = useState(user.roomName || "")
  const [location, setLocation] = useState(user.location || "")
  const [newEmployeePhone, setNewEmployeePhone] = useState("")
  const [visible, setVisible] = useState(false)
  const [messageTitle, setMessageTitle] = useState()
  const [handleYes, setHandleYes] = useState(null)
  const [handleNo, setHandleNo] = useState(null)
  const [yesWord, setYesWord] = useState("Yes")
  const [noWord, setNoWord] = useState("No")
  const [messageDescription, setMessageDescription] = useState()
  const [update, setUpdate] = useState(0)
  const [updateRoomsRender, setUpdateRoomsRender] = useState(0)
  // const [birthdate, setBirthdate] = useState(new Date())
  const {
    updateUser,
    postRequest,
    getRequest,
    deleteRequest,
    postRoom,
    getRooms,
    updateRoom,
    deleteRoom,
  } = useRequest()
  const [notificationPreferences, setNotificationPreferences] = useState({
    employeeRequest: user.employeeRequest,
    reservation: user.reservation,
    session: user.session,
    purchasesItems: user.purchasesItems,
    playersPurchases: user.playersPurchases,
    checkout: user.checkout,
  })
  const [employees, setEmployees] = useState([])
  const [rooms, setRooms] = useState([
    { id: 1, name: "Main Hall" },
    { id: 2, name: "VIP Room" },
  ])
  const [editMode, setEditMode] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [editedRoodId, setEditedRoodId] = useState("")
  const [editingRoom, setEditingRoom] = useState(null)

  const theme = useTheme()
  const styles = themeStyles(theme)

  const handleAddOrSaveRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert("Validation", "Please enter a room name.")
      return
    }
    const newRoom = {
      sectionName: newRoomName.trim(),
    }

    if (editingRoom) {
      await updateRoom(editingRoom.id, { ...editingRoom, ...newRoom })
      setEditingRoom(null) // Exit editing mode
    } else {
      await postRoom(newRoom)
    }

    setUpdateRoomsRender(updateRoomsRender + 1)
    setNewRoomName("") // Reset input field
  }

  const handleEditRoom = (room) => {
    setNewRoomName(room.sectionName) // Populate input with the selected room name
    setEditingRoom(room) // Set editing mode
  }

  const handleCancelEdit = () => {
    setNewRoomName("") // Clear input
    setEditingRoom(null) // Exit editing mode
  }

  const handleRemoveRoom = (id) => {
    setHandleYes(() => () => confirmDeleteRoom(id))
    setHandleNo(() => () => setVisible(false))
    setMessageTitle("Confirm")
    setMessageDescription("Are you sure you want to delete this room?")
    setVisible(true)
    setYesWord("Confirm")
    setNoWord("No")

    // Alert.alert("Remove Room", "Are you sure you want to remove this room?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Remove",
    //     onPress: () => {
    //       setRooms(rooms.filter((room) => room.id !== id))
    //       Alert.alert("Room Removed", "The room has been removed.")
    //     },
    //   },
    // ])
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
    if (editMode == true) {
      const data = {
        phoneNumber: phone,
        userName: name,
        roomName,
        location,
      }
      updateUser(user.id, data)
    }
  }

  const togglePreference = (key) => {
    setNotificationPreferences((prev) => {
      console.log(key, !prev[key])
      const data = { [key]: !prev[key] }
      updateUser(user.id, data)
      return {
        ...prev,
        [key]: !prev[key],
      }
    })
  }

  const handleSendRequest = async () => {
    try {
      if (!newEmployeePhone.trim()) {
        Alert.alert("Validation", "Please enter an phone.")
        return
      }
      Alert.alert("Request Sent", `Request sent to ${newEmployeePhone}.`)
      const data = {
        phone: newEmployeePhone,
        userId: user.id,
      }
      const postResult = await postRequest(data)
      setUpdate(update + 1)
    } catch (error) {
      if (
        error.response.data.error ==
        "Employee not found with the provided phone number"
      ) {
        setVisible(true)
        setYesWord("Ok")
        setMessageDescription(
          "Employee not found with the provided phone number"
        )
        setMessageTitle("Error")
        setHandleYes(() => () => setVisible(false))
        setHandleNo(null)
      } else if (
        error.response.data.error == "This employee has already been requested."
      ) {
        setVisible(true)
        setYesWord("Ok")
        setMessageDescription("This employee has already been requested.")
        setMessageTitle("Error")
        setHandleYes(() => () => setVisible(false))
        setHandleNo(null)
      }
    }
  }

  // const handleRemoveOwner = () => {
  //   Alert.alert("Remove Owner", "Are you sure you want to remove the owner?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Remove",
  //       onPress: () => {
  //         setNewEmployeePhone("")
  //         setRequestStatus("")
  //         Alert.alert("Owner Removed")
  //       },
  //     },
  //   ])
  // }

  // const handleNo = () => {
  //   console.log("no")
  //   setVisible(false)
  // }

  useEffect(() => {
    ;(async () => {
      const data = await getRequest()
      setEmployees(data.data)
    })()
  }, [update])

  const confirmDeleteRequest = async (id) => {
    await deleteRequest(id)
    setVisible(false)
    setUpdate(update + 1)
  }
  const confirmDeleteRoom = async (id) => {
    await deleteRoom(id)
    setVisible(false)
    setUpdateRoomsRender(updateRoomsRender + 1)
  }

  const deleteRequestCheck = (id) => {
    setHandleYes(() => () => confirmDeleteRequest(id))
    setHandleNo(() => () => setVisible(false))
    setMessageTitle("Confirm")
    setMessageDescription("Are you sure you want to delete this request?")
    setVisible(true)
    setYesWord("Confirm")
    setNoWord("No")
  }

  useEffect(() => {
    ;(async () => {
      const data = await getRooms()
      setRooms(data.data)
    })()
  }, [updateRoomsRender])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Popup
        title={messageTitle}
        description={messageDescription}
        handleYes={handleYes}
        handleNo={handleNo}
        visible={visible}
        yes={yesWord}
        no={noWord}
      />
      {/* Owner Information Section */}
      <Card style={styles.card}>
        <Card.Title title="Owner Profile" />
        <Card.Content>
          {/* <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
            disabled={!editMode}
          >
            Birthdate: {birthdate.toLocaleDateString()}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={handleBirthdateChange}
            />
          )} */}
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label="Room Name"
            value={roomName}
            onChangeText={setRoomName}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            editable={editMode}
          />
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleEditToggle}
            style={styles.button}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Card.Actions>
      </Card>
      {/* Owner Request Section */}
      {/* <Card style={styles.card}>
        <Card.Title title="Employee Request" />
        <Card.Content>
          <TextInput
            label="employee's phone"
            value={newEmployeePhone}
            onChangeText={setNewEmployeePhone}
            style={styles.input}
            roomholder="Enter owner's phone"
          />
          {requestStatus ? (
            <Chip mode="outlined" style={styles.input}>
              Request Status: {requestStatus}
            </Chip>
          ) : null}
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleSendRequest}
            style={styles.button}
          >
            Send Request
          </Button>
          <Button
            mode="contained"
            onPress={handleRemoveOwner}
            style={styles.button}
          >
            Remove Owner
          </Button>
        </Card.Actions>
      </Card> */}
      {/* Employee List Section */}
      <Card style={styles.card}>
        <Card.Title title="Employees List" />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          <TextInput
            label="employee's phone"
            keyboardType="phone-pad"
            value={newEmployeePhone}
            onChangeText={setNewEmployeePhone}
            style={{ ...styles.input, marginBottom: 0 }}
            roomholder="Enter owner's phone"
          />
          <Button
            mode="contained"
            onPress={handleSendRequest}
            style={styles.button}
          >
            Send Request
          </Button>

          {employees.length > 0 ? (
            employees.map((employee) => (
              <List.Item
                key={employee.id}
                title={employee.toUserInfo.username}
                description={
                  <>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        alignContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {employee.toUserInfo.phoneNumber}
                      </Text>
                      <Chip style={{ margin: 10, fontsize: 10 }}>
                        {employee.status}
                      </Chip>
                    </View>
                    <View>
                      <Text>{utcToLocal(employee.updatedAt)}</Text>
                    </View>
                  </>
                }
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => {
                      deleteRequestCheck(employee.id)
                    }}
                  />
                )}
              />
            ))
          ) : (
            <Text style={{ margin: 10 }}>No employees found.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Rooms List Section */}
      <Card style={styles.card}>
        <Card.Title title="Rooms List" />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          <TextInput
            label={editingRoom ? "Edit Room Name" : "Add Room Name"}
            value={newRoomName}
            onChangeText={setNewRoomName}
            style={styles.input}
          />
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleAddOrSaveRoom}
              style={styles.button}
            >
              {editingRoom ? "Save" : "Add"}
            </Button>
            {editingRoom && (
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={styles.button}
              >
                Cancel
              </Button>
            )}
          </View>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <List.Item
                key={room.id}
                title={room.sectionName}
                right={(props) => (
                  <View style={styles.roomActions}>
                    <IconButton
                      {...props}
                      icon="pencil"
                      onPress={() => handleEditRoom(room)}
                    />
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleRemoveRoom(room.id)}
                    />
                  </View>
                )}
              />
            ))
          ) : (
            <Text style={{ margin: 10 }}>No rooms found.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Notification Preferences */}
      <Card style={styles.card}>
        <Card.Title title="Notification Preferences" />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          {Object.keys(notificationPreferences).map((key) => (
            <View key={key} style={styles.checkboxRow}>
              <Checkbox
                status={notificationPreferences[key] ? "checked" : "unchecked"}
                onPress={() => togglePreference(key)}
              />
              <Text>{key.replace(/([A-Z])/g, " $1").trim()}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
    },
    card: {
      marginBottom: 16,
    },
    input: {
      // marginBottom: 0,
    },
    button: {
      marginTop: 8,
    },
    roomActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
  })
}
export default OwnerProfile
