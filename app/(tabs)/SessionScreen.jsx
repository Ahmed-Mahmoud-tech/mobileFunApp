import React, { useState, useEffect } from "react"
import { StyleSheet, View, FlatList, Alert, ScrollView } from "react-native"
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
} from "react-native-paper"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Dropdown from "@/components/Dropdown/Dropdown"
import useRequest from "@/axios/useRequest"
import { useSelector } from "react-redux"
import Popup from "@/components/Popup/Popup"
import { utcToLocal } from "@/common/time"
import SessionRenderHeader from "@/components/SessionRenderHeader/SessionRenderHeader"

const SessionsScreen = () => {
  const [sessions, setSessions] = useState([])
  const [filters, setFilters] = useState({
    sessionType: "All",
    status: "All",
    startDate: new Date(),
    playerId: "",
  })

  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const theme = useTheme()
  const styles = themeStyles(theme)
  const [game, setGame] = useState("")
  const [roomDropDown, setRoomDropDown] = useState({})
  const [gameDropDown, setGameDropDown] = useState({})
  const [sessionType, setSessionType] = useState("Single")
  const [updateSessionRender, setUpdateSessionRender] = useState(0)
  const [roomId, setRoomId] = useState("")
  const [startTime, setStartTime] = useState(new Date())
  const [players, setPlayers] = useState("")
  const [newPlayer, setNewPlayer] = useState("")
  const [debouncedPlayerId, setDebouncedPlayerId] = useState("")
  const [playerId, setPlayerId] = useState("")
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 3600000)
  )
  const [status, setStatus] = useState("Not Paid")
  const [datePickerType, setDatePickerType] = useState(null)
  const [visible, setVisible] = useState(false)
  const [messageTitle, setMessageTitle] = useState()
  const [messageDescription, setMessageDescription] = useState()
  const [handleYes, setHandleYes] = useState(null)
  const [handleNo, setHandleNo] = useState(null)
  const [yesWord, setYesWord] = useState("Yes")
  const [noWord, setNoWord] = useState("No")

  const {
    playerIdList,
    getGames,
    getRooms,
    postSessions,
    getSessions,
    updateSessions,
    deleteSessions,
  } = useRequest()
  const user = useSelector((state) => state.user.userInfo)

  // Open Dialog to Add/Edit Session
  const openDialog = async (session = null) => {
    const playersList = await playerIdList()
    setNewPlayer(Math.max(...playersList.data.playerIds))
    const playersObject = {}
    playersList.data.playerIds.map((id) => (playersObject[id] = id))
    setPlayers(playersObject)

    if (session) {
      setCurrentSession(session)
      setGame(session.gameId)
      setSessionType(session.type == "single" ? "Single" : "Multi")
      setRoomId(session.sectionId ? session.sectionId.toString() : "")
      setStartTime(new Date(session.startTime))
      setEndTime(new Date(session.endTime))
      setPlayerId(session.playerId ? session.playerId.toString() : "")
      setStatus(session.status == "notPaid" ? "Not Paid" : "paid")
    } else {
      resetForm()
    }
    setDialogVisible(true)
  }

  const resetForm = () => {
    setCurrentSession(null)
    setGame("")
    setSessionType("Single")
    setRoomId("")
    setStartTime(new Date())
    setEndTime(new Date(new Date().getTime() + 3600000))
    setPlayerId("")
    setStatus("Not Paid")
  }

  // Close Dialog
  const closeDialog = () => {
    setDialogVisible(false)
    resetForm()
  }

  // Save the Session Data
  const handleSave = async () => {
    // if (checkReservationConflict(roomId, startTime)) {
    //   return
    // }
    const newSession = {
      gameId: parseInt(game),
      type: sessionType.toLowerCase(),
      sectionId: roomId ? roomId : null,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      playerId: playerId ? playerId : null,
      status: status == "Not Paid" ? "notPaid" : "paid",
    }

    if (currentSession) {
      await updateSessions(currentSession.id, {
        ...newSession,
      })
    } else {
      await postSessions(newSession)
    }

    setUpdateSessionRender(updateSessionRender + 1)
    closeDialog()
  }

  const renderSessionItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{gameDropDown[item.gameId]}</Text>
        <Text>Type: {item.type == "single" ? "Single" : "Multi"}</Text>
        <Text>Room ID: {item.id}</Text>
        <Text>Start: {utcToLocal(item.startTime)}</Text>
        <Text>End: {utcToLocal(item.endTime)}</Text>
        <Text>Player ID: {item.playerId}</Text>
        <Text>Status: {item.status == "notPaid" ? "Not Paid" : "Paid"}</Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.itemActions}>
          <IconButton
            icon="pencil"
            onPress={() => {
              openDialog(item)
            }}
          />
          <IconButton
            icon="delete"
            onPress={() => handleRemoveSession(item.id)}
          />
        </View>
      </Card.Actions>
    </Card>
  )

  const showDatePicker = (type) => {
    setDatePickerType(type)
  }

  const hideDatePicker = () => {
    setDatePickerType(null)
  }

  const handleConfirmDate = (selectedDate) => {
    if (datePickerType === "startTime") {
      setStartTime(selectedDate)
    } else if (datePickerType === "endTime") {
      setEndTime(selectedDate)
    } else if (datePickerType === "startDate") {
      setFilters((prev) => ({ ...prev, startDate: selectedDate }))
    }
    hideDatePicker()
  }

  useEffect(() => {
    ;(async () => {
      const games = await getGames()
      const rooms = await getRooms()
      const gamesObject = {}
      games.data.map((game) => {
        gamesObject[game.id] = game.name
      })
      const roomsObject = {}
      rooms.data.map((room) => {
        roomsObject[room.id] = room.sectionName
      })
      setGameDropDown(gamesObject)
      setRoomDropDown(roomsObject)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        // const { status, createdAt, playerId } = filters
        const { sessionType, status, startDate, playerId } = filters
        // Build query parameters dynamically
        const params = {}
        if (playerId) params.playerId = debouncedPlayerId
        if (startDate)
          params.startDate = new Date(
            new Date(startDate).toDateString()
          ).getTime()
        if (sessionType)
          params.sessionType = sessionType == "All" ? null : sessionType
        if (status) params.status = status == "All" ? null : status

        const data = await getSessions({ params })
        setSessions(data.data)
        // setError("")
      } catch (err) {
        // setError(err.response?.data?.error || "An error occurred")
        // setSessions([])
      }
    })()
  }, [
    updateSessionRender,
    debouncedPlayerId,
    filters.status,
    filters.sessionType,
    filters.startDate,
  ])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlayerId(filters.playerId) // Update debounced value after 2 seconds
    }, 1000)
    // Cleanup the timeout if user types again before 2 seconds
    return () => clearTimeout(handler)
  }, [filters.playerId])

  const confirmDeleteSession = async (id) => {
    await deleteSessions(id)
    setVisible(false)
    setUpdateSessionRender(updateSessionRender + 1)
  }

  const handleRemoveSession = (id) => {
    setHandleYes(() => () => confirmDeleteSession(id))
    setHandleNo(() => () => setVisible(false))
    setMessageTitle("Confirm")
    setMessageDescription("Are you sure you want to delete this Session?")
    setYesWord("Confirm")
    setNoWord("No")
    setVisible(true)
  }

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
          <Text style={styles.emptyText}>No session yet!</Text>
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
            {currentSession ? "Edit Session" : "Add Session"}
          </Dialog.Title>
          <Dialog.Content>
            <Dropdown
              data={gameDropDown}
              onSelect={setGame} // Pass handleSelect function to handle selection
              placeholder="Choose a Game"
              style={styles.input}
              selected={currentSession?.gameId?.toString()}
            />
            <SegmentedButtons
              value={sessionType}
              onValueChange={setSessionType}
              buttons={[
                {
                  value: "Single",
                  label: "Single",
                  style: sessionType === "Single" ? styles.selectedButton : {},
                },
                {
                  value: "Multi",
                  label: "Multi",
                  style: sessionType === "Multi" ? styles.selectedButton : {},
                },
              ]}
              style={styles.input}
            />
            <Dropdown
              data={roomDropDown}
              onSelect={setRoomId} // Pass handleSelect function to handle selection
              placeholder="Choose a Room"
              selected={currentSession?.sectionId?.toString()}
            />

            <Button
              mode="outlined"
              onPress={() => showDatePicker("startTime")}
              style={styles.input}
            >
              Start DateTime: {startTime.toLocaleString()}
            </Button>
            <Button
              mode="outlined"
              onPress={() => showDatePicker("endTime")}
              style={styles.input}
            >
              End DateTime: {endTime.toLocaleString()}
            </Button>
            <Dropdown
              data={players}
              onSelect={setPlayerId} // Pass handleSelect function to handle selection
              placeholder="Choose a PlayerId"
              flag={newPlayer}
              selected={currentSession?.playerId?.toString()}
            />

            <SegmentedButtons
              value={status}
              onValueChange={setStatus}
              buttons={[
                {
                  value: "paid",
                  label: "Paid",
                  style: status === "Paid" ? styles.selectedButton : {},
                },
                {
                  value: "notPaid",
                  label: "Not Paid",
                  style: status === "Not Paid" ? styles.selectedButton : {},
                },
              ]}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Session FAB */}
      <FAB style={styles.fab} icon="plus" onPress={() => openDialog()} />
    </View>
  )
}

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
  })
}
export default SessionsScreen
