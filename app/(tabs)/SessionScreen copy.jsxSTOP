import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Alert, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Dialog,
  Portal,
  Card,
  FAB,
  SegmentedButtons,
  useTheme,
  Text,
  IconButton,
} from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dropdown from "@/components/Dropdown/Dropdown";
import useRequest from "@/axios/useRequest";
import { useSelector } from "react-redux";
import Popup from "@/components/Popup/Popup";
import { utcToLocal } from "@/common/time";
import SessionRenderHeader from "@/components/SessionRenderHeader/SessionRenderHeader";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
const SessionsScreen = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({
    sessionType: "All",
    status: "All",
    startDate: new Date(),
    playerId: "",
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const theme = useTheme();
  const styles = themeStyles(theme);
  const [game, setGame] = useState("");
  const [roomDropDown, setRoomDropDown] = useState({});
  const [gameDropDown, setGameDropDown] = useState({});
  const [sessionType, setSessionType] = useState("single");
  const [updateSessionRender, setUpdateSessionRender] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [players, setPlayers] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [debouncedPlayerId, setDebouncedPlayerId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 3600000)
  );
  const [status, setStatus] = useState("notPaid");
  const [datePickerType, setDatePickerType] = useState(null);
  const [visible, setVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState();
  const [messageDescription, setMessageDescription] = useState();
  const [handleYes, setHandleYes] = useState(null);
  const [handleNo, setHandleNo] = useState(null);
  const [yesWord, setYesWord] = useState("Yes");
  const [noWord, setNoWord] = useState("No");
  const [showEndTime, setShowEndTime] = useState(false);

  const {
    playerIdList,
    getGames,
    getRooms,
    postSessions,
    getSessions,
    updateSessions,
    deleteSessions,
  } = useRequest();
  const user = useSelector((state) => state.user.userInfo);
  const router = useRouter();
  // Open Dialog to Add/Edit Session
  const openDialog = async (session = null) => {
    const playersList = await playerIdList();
    setNewPlayer(Math.max(...playersList.data.playerIds));

    const playersObject = {};
    playersList.data.playerIds.map((id) => (playersObject[id] = id));
    setPlayers(playersObject);

    if (session) {
      setCurrentSession(session);
      setGame(session.gameId);
      setSessionType(session.type == "single" ? "single" : "multi");
      setRoomId(session.sectionId ? session.sectionId.toString() : "");
      setStartTime(new Date(session.startTime));
      setEndTime(new Date(session.endTime || new Date()));
      session.endTime ? setShowEndTime(true) : setShowEndTime(false);
      setPlayerId(session.playerId ? session.playerId.toString() : "");
      setStatus(session.status == "notPaid" ? "notPaid" : "paid");
    } else {
      resetForm();
    }
    setDialogVisible(true);
  };

  const resetForm = () => {
    setCurrentSession(null);
    setGame("");
    setSessionType("single");
    setRoomId("");
    setStartTime(new Date());
    setEndTime(new Date(new Date().getTime() + 3600000));
    setPlayerId("");
    setStatus("notPaid");
  };

  // Close Dialog
  const closeDialog = () => {
    setDialogVisible(false);
    resetForm();
  };

  // Save the Session Data
  const handleSave = async () => {
    // if (checkReservationConflict(roomId, startTime)) {
    //   return
    // }
    const newSession = {
      gameId: parseInt(game),
      type: sessionType,
      sectionId: roomId ? roomId : null,
      startTime: startTime.toISOString(),
      endTime: showEndTime ? endTime.toISOString() : null,
      playerId: playerId ? playerId : null,
      status: status,
      // status: status == "notPaid" ? "notPaid" : "paid",
      isFromEmployee: user.type,
      ownerId: user.owner,
      username: user.username,
      sectionName: roomDropDown[roomId],
    };

    if (currentSession) {
      await updateSessions(currentSession.id, {
        ...newSession,
      });
    } else {
      await postSessions(newSession);
    }

    setUpdateSessionRender(updateSessionRender + 1);
    closeDialog();
  };

  const renderSessionItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{gameDropDown[item.gameId]}</Text>
        <Text>
          {t("Type")}: {item.type == "single" ? t("Single") : t("Multi")}
        </Text>
        <Text>
          {t("Room_ID")}: {roomDropDown[item.sectionId]}
        </Text>
        <Text>
          {t("Start")}: {utcToLocal(item.startTime)}
        </Text>
        <Text>
          {t("End")}: {item.endTime ? utcToLocal(item.endTime) : t("Not_Set")}
        </Text>
        <Text>
          {t("Player_ID")}: {item.playerId}
        </Text>
        <Text>
          {t("Status")}: {item.status == "notPaid" ? t("Not_Paid") : t("Paid")}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.itemActions}>
          <IconButton
            icon="pencil"
            onPress={() => {
              openDialog(item);
            }}
          />
          <IconButton icon="delete" onPress={() => handleRemoveSession(item)} />
        </View>
      </Card.Actions>
    </Card>
  );

  const showDatePicker = (type) => {
    setDatePickerType(type);
  };

  const hideDatePicker = () => {
    setDatePickerType(null);
  };

  const handleConfirmDate = (selectedDate) => {
    if (datePickerType === "startTime") {
      setStartTime(selectedDate);
    } else if (datePickerType === "endTime") {
      setEndTime(selectedDate);
    } else if (datePickerType === "startDate") {
      setFilters((prev) => ({ ...prev, startDate: selectedDate }));
    }
    hideDatePicker();
  };

  useEffect(() => {
    (async () => {
      const games = await getGames();
      const rooms = await getRooms(user.owner);
      const gamesObject = {};
      games.data.map((game) => {
        gamesObject[game.id] = game.name;
      });
      const roomsObject = {};
      rooms.data.map((room) => {
        roomsObject[room.id] = room.sectionName;
      });
      setGameDropDown(gamesObject);
      setRoomDropDown(roomsObject);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // const { status, createdAt, playerId } = filters
        const { sessionType, status, startDate, playerId } = filters;
        // Build query parameters dynamically
        const params = {};
        if (playerId) params.playerId = debouncedPlayerId;
        if (startDate)
          params.startDate = new Date(
            new Date(startDate).toDateString()
          ).getTime();
        if (sessionType)
          params.sessionType = sessionType == "All" ? null : sessionType;
        if (status) params.status = status == "All" ? null : status;

        const data = await getSessions({ params });
        setSessions(data.data);
        // setError("")
      } catch (err) {
        // setError(err.response?.data?.error || "An error occurred")
        // setSessions([])
      }
    })();
  }, [
    updateSessionRender,
    debouncedPlayerId,
    filters.status,
    filters.sessionType,
    filters.startDate,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlayerId(filters.playerId); // Update debounced value after 2 seconds
    }, 1000);
    // Cleanup the timeout if user types again before 2 seconds
    return () => clearTimeout(handler);
  }, [filters.playerId]);

  const confirmDeleteSession = async (item) => {
    const deletedQuery = {
      startTime: new Date(item?.startTime).toISOString(),
      sectionId: item.sectionId,
      ownerId: item.ownerId,
      sectionName: roomDropDown[item.sectionId],
      id: item.id,
      isFromEmployee: user.type,
      username: user.username,
    };

    console.log(deletedQuery, "deletedQuery", item);
    const queryString = `startTime=${deletedQuery.startTime}&sectionId=${deletedQuery.sectionId}&ownerId=${deletedQuery.ownerId}&sectionName=${deletedQuery.sectionName}&id=${deletedQuery.id}&isFromEmployee=${deletedQuery.isFromEmployee}&username=${deletedQuery.username}`;
    await deleteSessions(queryString);
    setVisible(false);
    setUpdateSessionRender(updateSessionRender + 1);
  };

  const handleRemoveSession = (item) => {
    setHandleYes(() => () => confirmDeleteSession(item));
    setHandleNo(() => () => setVisible(false));
    setMessageTitle("Confirm");
    setMessageDescription(t("Are_you_sure_you_want_to_delete_this_Session"));
    setYesWord("Confirm");
    setNoWord("No");
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Popup
        title={messageTitle}
        description={messageDescription}
        handleYes={handleYes}
        handleNo={handleNo}
        visible={visible}
        yes={yesWord}
        no={noWord}
      />
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("No_session_yet")}</Text>
        }
        ListHeaderComponent={
          <SessionRenderHeader
            filters={filters}
            setFilters={setFilters}
            showDatePicker={showDatePicker}
          />
        }
      />

      <DateTimePickerModal
        isVisible={!!datePickerType}
        mode={datePickerType === "startDate" ? "date" : "datetime"}
        date={
          datePickerType === "startTime"
            ? startTime
            : datePickerType === "endTime"
            ? endTime
            : filters.startDate
        }
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      {/* Add Session Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={closeDialog}
          style={styles.dialogContainer}
        >
          <Dialog.Title>
            {currentSession ? t("Edit_Session") : t("Add_Session")}
          </Dialog.Title>
          <Dialog.Content>
            <Dropdown
              data={gameDropDown}
              onSelect={setGame} // Pass handleSelect function to handle selection
              placeholder={t("Choose_a_Game")}
              style={styles.input}
              selected={currentSession?.gameId?.toString()}
              noData={
                <Text
                // onClick={() => {
                //   router.push("/GamesScreen");
                //   closeDialog();
                // }}
                >
                  {t("Create_a_Game_please")}
                </Text>
              }
            />
            <SegmentedButtons
              value={sessionType}
              onValueChange={setSessionType}
              buttons={[
                {
                  value: "single",
                  label: t("Single"),
                  style: sessionType === "single" ? styles.selectedButton : {},
                },
                {
                  value: "multi",
                  label: t("Multi"),
                  style: sessionType === "multi" ? styles.selectedButton : {},
                },
              ]}
              style={{ ...styles.input, direction: "ltr" }}
            />
            <Dropdown
              data={roomDropDown}
              onSelect={setRoomId} // Pass handleSelect function to handle selection
              placeholder={t("Choose_a_Room")}
              selected={currentSession?.sectionId?.toString()}
              noData={<Text>{t("Create_a_room_please")}</Text>}
            />

            <Button
              mode="outlined"
              onPress={() => showDatePicker("startTime")}
              style={styles.input}
            >
              {t("Start_DateTime")}: {startTime.toLocaleString()}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowEndTime(!showEndTime)}
              style={styles.input}
            >
              {showEndTime ? t("Clear_End_Time") : t("Add_End_Time")}
            </Button>
            {showEndTime && (
              <Button
                mode="outlined"
                onPress={() => showDatePicker("endTime")}
                style={styles.input}
              >
                {t("End_DateTime")}: {endTime.toLocaleString()}
              </Button>
            )}
            <Dropdown
              data={players}
              onSelect={setPlayerId} // Pass handleSelect function to handle selection
              placeholder={t("Choose_a_PlayerId")}
              flag={newPlayer}
              selected={currentSession?.playerId?.toString()}
            />
            <View>
              <SegmentedButtons
                value={status}
                onValueChange={setStatus}
                buttons={[
                  {
                    value: "paid",
                    label: t("Paid"),
                    style: status === "Paid" ? styles.selectedButton : {},
                  },
                  {
                    value: "notPaid",
                    label: t("Not_Paid"),
                    style: status === "notPaid" ? styles.selectedButton : {},
                  },
                ]}
                style={{ ...styles.input, direction: "ltr" }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>{t("Cancel")}</Button>
            <Button onPress={handleSave}>{t("Save")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Session FAB */}
      <FAB style={styles.fab} icon="plus" onPress={() => openDialog()} />
    </View>
  );
};

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
    },
    filters: { marginBottom: 16 },
    listContainer: { paddingBottom: 80 },
    card: {
      marginBottom: 16,
      // backgroundColor: theme.colors.elevation.level3,
      borderRadius: 8,
      elevation: 4,
    },
    itemName: {
      fontWeight: "bold",
      fontSize: 16,
    },
    input: {
      marginBottom: 12,
    },
    datePicker: {
      marginBottom: 16,
    },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
      backgroundColor: theme.colors.elevation.level1,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
    FilterSegmentedButtons: {
      paddingBottom: 100,
    },
    dialogContainer: { backgroundColor: theme.colors.elevation.level1 },
    itemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
}

export default SessionsScreen;
