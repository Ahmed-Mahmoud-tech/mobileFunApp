import React, { useState } from "react"
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
} from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useSelector } from "react-redux"
import useRequest from "@/axios/useRequest"

const OwnerProfile = () => {
  const user = useSelector((state) => state.user.userInfo)
  const [phone, setPhone] = useState(user.phoneNumber || "")
  const [name, setName] = useState(user.username || "")
  const [placeName, setPlaceName] = useState(user.placeName || "")
  const [location, setLocation] = useState(user.location || "")
  // const [birthdate, setBirthdate] = useState(new Date())
  const { updateUser } = useRequest()
  const [notificationPreferences, setNotificationPreferences] = useState({
    employeeRequest: user.employeeRequest,
    reservation: user.reservation,
    session: user.session,
    purchasesItems: user.purchasesItems,
    playersPurchases: user.playersPurchases,
    checkout: user.checkout,
  })
  const [employees, setEmployees] = useState([
    { id: 1, name: "Alice Smith", phone: "alice@example.com" },
    { id: 2, name: "Bob Johnson", phone: "bob@example.com" },
  ])
  const [places, setPlaces] = useState([
    { id: 1, name: "Main Hall" },
    { id: 2, name: "VIP Room" },
  ])
  const [editMode, setEditMode] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [newPlaceName, setNewPlaceName] = useState("")
  const [editingPlace, setEditingPlace] = useState(null)

  const theme = useTheme()
  const styles = themeStyles(theme)

  const handleAddOrSavePlace = () => {
    if (!newPlaceName.trim()) {
      Alert.alert("Validation", "Please enter a place name.")
      return
    }

    if (editingPlace) {
      // Save edited place
      setPlaces(
        places.map((place) =>
          place.id === editingPlace.id
            ? { ...place, name: newPlaceName }
            : place
        )
      )
      Alert.alert("Place Updated", `Place "${newPlaceName}" has been updated.`)
      setEditingPlace(null) // Exit editing mode
    } else {
      // Add new place
      const newPlace = {
        id: Date.now(),
        name: newPlaceName.trim(),
      }
      setPlaces([...places, newPlace])
      Alert.alert("Place Added", `Place "${newPlaceName}" has been added.`)
    }

    setNewPlaceName("") // Reset input field
  }

  const handleEditPlace = (place) => {
    setNewPlaceName(place.name) // Populate input with the selected place name
    setEditingPlace(place) // Set editing mode
  }

  const handleCancelEdit = () => {
    setNewPlaceName("") // Clear input
    setEditingPlace(null) // Exit editing mode
  }

  // const handleBirthdateChange = (event, selectedDate) => {
  //   setShowDatePicker(false)
  //   if (selectedDate) {
  //     setBirthdate(selectedDate)
  //   }
  // }

  const handleAddPlace = () => {
    if (!newPlaceName.trim()) {
      Alert.alert("Validation", "Please enter a place name.")
      return
    }
    const newPlace = {
      id: Date.now(),
      name: newPlaceName.trim(),
    }
    setPlaces([...places, newPlace])
    setNewPlaceName("")
    Alert.alert("Place Added", `Place "${newPlaceName}" has been added.`)
  }

  // const handleEditPlace = (id, newName) => {
  //   setPlaces(
  //     places.map((place) =>
  //       place.id === id ? { ...place, name: newName } : place
  //     )
  //   )
  //   Alert.alert("Place Updated", `Place name has been updated to "${newName}".`)
  // }

  const handleRemovePlace = (id) => {
    Alert.alert("Remove Place", "Are you sure you want to remove this place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => {
          setPlaces(places.filter((place) => place.id !== id))
          Alert.alert("Place Removed", "The place has been removed.")
        },
      },
    ])
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
    if (editMode == true) {
      const data = {
        phoneNumber: phone,
        userName: name,
        placeName,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            label="Place Name"
            value={placeName}
            onChangeText={setPlaceName}
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

      {/* Employee List Section */}
      <Card style={styles.card}>
        <Card.Title title="Employees List" />
        <Divider />
        <Card.Content>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <List.Item
                key={employee.id}
                title={employee.name}
                description={employee.phone}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() =>
                      Alert.alert("Remove Employee", `Remove ${employee.name}?`)
                    }
                  />
                )}
              />
            ))
          ) : (
            <Text>No employees found.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Places List Section */}
      <Card style={styles.card}>
        <Card.Title title="Places List" />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          <TextInput
            label={editingPlace ? "Edit Place Name" : "Add Place Name"}
            value={newPlaceName}
            onChangeText={setNewPlaceName}
            style={styles.input}
          />
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleAddOrSavePlace}
              style={styles.button}
            >
              {editingPlace ? "Save" : "Add"}
            </Button>
            {editingPlace && (
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={styles.button}
              >
                Cancel
              </Button>
            )}
          </View>
          {places.length > 0 ? (
            places.map((place) => (
              <List.Item
                key={place.id}
                title={place.name}
                right={(props) => (
                  <View style={styles.placeActions}>
                    <IconButton
                      {...props}
                      icon="pencil"
                      onPress={() => handleEditPlace(place)}
                    />
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleRemovePlace(place.id)}
                    />
                  </View>
                )}
              />
            ))
          ) : (
            <Text>No places found.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Notification Preferences */}
      <Card style={styles.card}>
        <Card.Title title="Notification Preferences" />
        <Divider />
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
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
    },
    placeActions: {
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
