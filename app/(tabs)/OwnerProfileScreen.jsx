import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Alert, I18nManager } from "react-native";
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
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "@/axios/useRequest";
import { utcToLocal } from "@/common/time";
import Popup from "@/components/Popup/Popup";
import { useTranslation } from "react-i18next";
import { setStoredUser } from "@/store/slices/user";

let start = 0;
const OwnerProfile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [name, setName] = useState(user?.username || "");
  const [placeName, setPlaceName] = useState(user?.placeName || "");
  const [location, setLocation] = useState(user?.location || "");
  const [newEmployeePhone, setNewEmployeePhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState();
  const [handleYes, setHandleYes] = useState(null);
  const [handleNo, setHandleNo] = useState(null);
  const [yesWord, setYesWord] = useState("Yes");
  const [noWord, setNoWord] = useState("No");
  const [messageDescription, setMessageDescription] = useState();
  const [update, setUpdate] = useState(0);
  const [updateRoomsRender, setUpdateRoomsRender] = useState(0);
  // const [birthdate, setBirthdate] = useState(new Date())
  const {
    updateUser,
    postRequest,
    getOwnerRequest,
    deleteRequest,
    postRoom,
    getRooms,
    updateRoom,
    deleteRoom,
  } = useRequest();
  const notificationText = {
    session: "Session",
    purchasesItems: "Purchases_Items",
    playersPurchases: "Players_Purchases",
    checkout: "Checkout",
  };
  const dispatch = useDispatch();
  const [notificationPreferences, setNotificationPreferences] = useState({
    // employeeRequest: user?.employeeRequest,
    // reservation: user.reservation,
    session: user?.session,
    purchasesItems: user?.purchasesItems,
    playersPurchases: user?.playersPurchases,
    checkout: user?.checkout,
  });
  const [employees, setEmployees] = useState([]);

  const lastNotification = useSelector(
    (state) => state.notification.notification
  );
  const [rooms, setRooms] = useState([
    { id: 1, name: "Main Hall" },
    { id: 2, name: "VIP Room" },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [editedRoodId, setEditedRoodId] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);

  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const styles = themeStyles(theme, i18n.language === "ar");

  const handleAddOrSaveRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert(t("Validation"), t("Please_enter_a_room_name"));
      return;
    }
    const newRoom = {
      sectionName: newRoomName.trim(),
    };

    if (editingRoom) {
      await updateRoom(editingRoom.id, { ...editingRoom, ...newRoom });
      setEditingRoom(null); // Exit editing mode
    } else {
      await postRoom(newRoom);
    }

    setUpdateRoomsRender(updateRoomsRender + 1);
    setNewRoomName(""); // Reset input field
  };

  const handleEditRoom = (room) => {
    setNewRoomName(room.sectionName); // Populate input with the selected room name
    setEditingRoom(room); // Set editing mode
  };

  const handleCancelEdit = () => {
    setNewRoomName(""); // Clear input
    setEditingRoom(null); // Exit editing mode
  };

  const handleRemoveRoom = (id) => {
    setHandleYes(() => () => confirmDeleteRoom(id));
    setHandleNo(() => () => setVisible(false));
    setMessageTitle("Confirm");
    setMessageDescription("Are_you_sure_you_want_to_delete_this_room");
    setVisible(true);
    setYesWord("Confirm");
    setNoWord("No");

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
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode == true) {
      const data = {
        phoneNumber: phone,
        userName: name,
        placeName: placeName,
        location,
      };
      updateUser(user.id, data);
    }
  };

  const togglePreference = (key) => {
    setNotificationPreferences((prev) => {
      console.log(key, !prev[key]);
      const data = { [key]: !prev[key] };
      updateUser(user.id, data);
      dispatch(setStoredUser({ ...user, ...data }));
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleSendRequest = async () => {
    try {
      if (!newEmployeePhone.trim()) {
        Alert.alert(t("Validation"), t("Please_enter_an_phone"));
        return;
      }
      Alert.alert(
        t("request_sent"),
        t("request_sent_to", { phone: newEmployeePhone })
      );
      const data = {
        phone: newEmployeePhone,
        userId: user.id,
        ownerName: user.username,
      };
      const postResult = await postRequest(data);
      setUpdate(update + 1);
    } catch (error) {
      if (
        error.response.data.error ==
        "Employee_not_found_with_the_provided_phone_number"
      ) {
        setVisible(true);
        setYesWord("Ok");
        setMessageDescription(
          "Employee_not_found_with_the_provided_phone_number"
        );
        setMessageTitle("Error");
        setHandleYes(() => () => setVisible(false));
        setHandleNo(null);
      } else if (
        error.response.data.error == "This_employee_has_already_been_requested"
      ) {
        setVisible(true);
        setYesWord("Ok");
        setMessageDescription("This_employee_has_already_been_requested");
        setMessageTitle("Error");
        setHandleYes(() => () => setVisible(false));
        setHandleNo(null);
      }
    }
  };

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
    (async () => {
      if (
        (lastNotification?.body?.type == "employeeRejectOwnerRequest" ||
          lastNotification?.body?.type == "employeeAcceptOwnerRequest") &&
        start > 0
      ) {
        const data = await getOwnerRequest();
        setEmployees(data.data);
      } else {
        start++;
      }
    })();
  }, [lastNotification?.body?.type]);

  useEffect(() => {
    (async () => {
      const data = await getOwnerRequest();
      setEmployees(data.data);
    })();
  }, [update]);

  const confirmDeleteRequest = async (requestEmployee) => {
    const query = `ownerId=${user.id}&ownerName=${user.username}&requestId=${requestEmployee.id}&employeeId=${requestEmployee.toUserInfo.id}`;
    await deleteRequest(query);
    setVisible(false);
    setUpdate(update + 1);
  };
  const confirmDeleteRoom = async (id) => {
    await deleteRoom(id);
    setVisible(false);
    setUpdateRoomsRender(updateRoomsRender + 1);
  };

  const deleteRequestCheck = (requestEmployee) => {
    setHandleYes(() => () => confirmDeleteRequest(requestEmployee));
    setHandleNo(() => () => setVisible(false));
    setMessageTitle("Confirm");
    setMessageDescription("Are_you_sure_you_want_to_delete_this_request");
    setVisible(true);
    setYesWord("Confirm");
    setNoWord("No");
  };

  useEffect(() => {
    (async () => {
      const data = await getRooms(user.owner);
      setRooms(data.data);
    })();
  }, [updateRoomsRender]);

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
        <Card.Title title={t("owner_profile")} />
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
            label={t("name")}
            value={name}
            onChangeText={setName}
            style={styles.input}
            editable={editMode}
            direction="rtl"
          />
          <TextInput
            label={t("phone")}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label={t("place_name")}
            value={placeName}
            onChangeText={setPlaceName}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label={t("location")}
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
            {editMode ? t("Save") : t("Edit")}
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
            placeholder="Enter owner's phone"
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
        <Card.Title title={t("employees_list")} />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          <TextInput
            label={t("employee_phone")}
            keyboardType="phone-pad"
            value={newEmployeePhone}
            onChangeText={setNewEmployeePhone}
            style={{ ...styles.input, marginBottom: 0 }}
            placeholder={t("enter_employee_phone")}
          />
          <Button
            mode="contained"
            onPress={handleSendRequest}
            style={styles.button}
          >
            {t("send_request")}
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
                        {t(employee.status)}
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
                      deleteRequestCheck(employee);
                    }}
                  />
                )}
              />
            ))
          ) : (
            <Text style={{ margin: 10 }}>{t("No_employees_found")}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Rooms List Section */}
      <Card style={styles.card}>
        <Card.Title title={t("rooms_list")} />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          <TextInput
            label={editingRoom ? t("Edit_room_name") : t("Add_room_name")}
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
              {editingRoom ? t("Save") : t("Add")}
            </Button>
            {editingRoom && (
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={styles.button}
              >
                {t("Cancel")}
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
            <Text style={{ margin: 10 }}>{t("No_rooms_found")}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Notification Preferences */}
      <Card style={styles.card}>
        <Card.Title title={t("Notification_preferences")} />
        <Divider style={{ marginBottom: 10 }} />
        <Card.Content>
          {Object.keys(notificationPreferences).map((key) => (
            <View key={key} style={styles.checkboxRow}>
              <Checkbox
                status={notificationPreferences[key] ? "checked" : "unchecked"}
                onPress={() => togglePreference(key)}
              />
              <Text>{t(notificationText[key])}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

function themeStyles(theme, isRTL) {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
      direction: isRTL ? "rtl" : "ltr",
    },
    card: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      direction: isRTL ? "rtl" : "ltr",
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
  });
}

export default OwnerProfile;
