import React, { useState } from "react"
import { StyleSheet, View, FlatList, Alert } from "react-native"
import {
  TextInput,
  Button,
  Dialog,
  Portal,
  Card,
  FAB,
  useTheme,
  Text,
} from "react-native-paper"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Dropdown from "@/components/Dropdown/Dropdown"

const ReservationScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)
  const [reservations, setReservations] = useState([])
  const [filters, setFilters] = useState({
    playersId: "",
    day: new Date(),
  })
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentReservation, setCurrentReservation] = useState(null)

  const [playersId, setPlayersId] = useState("")
  const [roomId, setRoomId] = useState("")
  const [startDateTime, setStartDateTime] = useState(new Date())
  const [endDateTime, setEndDateTime] = useState(
    new Date(new Date().getTime() + 3600000)
  )

  const [datePickerVisible, setDatePickerVisible] = useState({
    start: false,
    end: false,
  })

  // Open Dialog to Add/Edit Reservation
  const openDialog = (reservation = null) => {
    setCurrentReservation(reservation)
    if (reservation) {
      setPlayersId(
        reservation.playersId ? reservation.playersId.toString() : ""
      )
      setRoomId(reservation.roomId ? reservation.roomId.toString() : "")
      setStartDateTime(new Date(reservation.startDateTime))
      setEndDateTime(new Date(reservation.endDateTime))
    } else {
      resetForm()
    }
    setDialogVisible(true)
  }

  const resetForm = () => {
    setPlayersId("")
    setRoomId("")
    setStartDateTime(new Date())
    setEndDateTime(new Date(new Date().getTime() + 3600000))
  }

  const closeDialog = () => {
    setDialogVisible(false)
    resetForm()
  }

  // Validate Reservation Overlap
  const isTimeOverlap = (newReservation) => {
    return reservations.some((reservation) => {
      return (
        reservation.roomId === newReservation.roomId &&
        ((new Date(newReservation.startDateTime) >=
          new Date(reservation.startDateTime) &&
          new Date(newReservation.startDateTime) <
            new Date(reservation.endDateTime)) ||
          (new Date(newReservation.endDateTime) >
            new Date(reservation.startDateTime) &&
            new Date(newReservation.endDateTime) <=
              new Date(reservation.endDateTime)))
      )
    })
  }

  // Save the Reservation Data
  const handleSave = () => {
    if (!roomId) {
      Alert.alert("Invalid Room ID", "Room ID is required.")
      return
    }
    if (startDateTime <= new Date()) {
      Alert.alert("Invalid Start Time", "Start time must be in the future.")
      return
    }
    if (endDateTime <= startDateTime) {
      Alert.alert("Invalid Time", "End time must be after start time.")
      return
    }

    const newReservation = {
      id: currentReservation
        ? currentReservation.id
        : reservations.length
        ? reservations[reservations.length - 1].id + 1
        : 1,
      playersId: playersId ? +playersId : null,
      roomId: roomId ? +roomId : null,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    }

    if (isTimeOverlap(newReservation)) {
      Alert.alert(
        "Time Overlap",
        "Another reservation exists for this room during the selected time."
      )
      return
    }

    if (currentReservation) {
      setReservations((prevReservations) =>
        prevReservations.map((item) =>
          item.id === currentReservation.id ? newReservation : item
        )
      )
    } else {
      setReservations((prevReservations) => [
        ...prevReservations,
        newReservation,
      ])
    }
    closeDialog()
  }

  const applyFilters = () => {
    return reservations.filter((reservation) => {
      const matchesPlayerId =
        !filters.playersId ||
        reservation.playersId.toString() === filters.playersId
      const matchesDay =
        filters.day.toDateString() ===
        new Date(reservation.startDateTime).toDateString()
      return matchesPlayerId && matchesDay
    })
  }

  const filteredReservations = applyFilters()

  const renderReservationItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>Player ID: {item.playersId}</Text>
        <Text>Room ID: {item.roomId}</Text>
        <Text>Start: {new Date(item.startDateTime).toLocaleString()}</Text>
        <Text>End: {new Date(item.endDateTime).toLocaleString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openDialog(item)}>Edit</Button>
      </Card.Actions>
    </Card>
  )

  const handleDateConfirm = (date, type) => {
    if (type === "start") {
      setStartDateTime(date)
    } else if (type === "end") {
      setEndDateTime(date)
    }
    setDatePickerVisible((prev) => ({ ...prev, [type]: false }))
  }

  // Render filters above the FlatList
  const renderHeader = () => (
    <>
      {/* Filters */}
      <View style={styles.filters}>
        <TextInput
          label="Player ID"
          value={filters.playersId}
          onChangeText={(value) =>
            setFilters((prev) => ({ ...prev, playersId: value }))
          }
          keyboardType="numeric"
          style={styles.input}
        />
        <Button
          mode="outlined"
          onPress={() =>
            setDatePickerVisible((prev) => ({ ...prev, filter: true }))
          }
          style={styles.datePicker}
        >
          Filter Day: {filters.day.toLocaleDateString()}
        </Button>
        <DateTimePickerModal
          isVisible={datePickerVisible.filter}
          mode="date"
          onConfirm={(date) => {
            setFilters((prev) => ({ ...prev, day: date }))
            setDatePickerVisible((prev) => ({ ...prev, filter: false }))
          }}
          onCancel={() =>
            setDatePickerVisible((prev) => ({ ...prev, filter: false }))
          }
        />
      </View>
    </>
  )
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredReservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
      />

      {/* Add/Edit Reservation Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={closeDialog}
          style={styles.dialogContainer}
        >
          <Dialog.Title>
            {currentReservation ? "Edit Reservation" : "Add Reservation"}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Player ID"
              value={playersId}
              onChangeText={setPlayersId}
              keyboardType="numeric"
              style={styles.input}
            />
            {/* <TextInput
              label="Room ID"
              value={roomId}
              onChangeText={setRoomId}
              keyboardType="numeric"
              style={styles.input}
            /> */}
            <Dropdown
              data={{
                roomId1: "room 1",
                roomId2: "room 2",
                roomId3: "room 3",
              }}
              onSelect={setRoomId} // Pass handleSelect function to handle selection
              placeholder="Choose a Room"
            />

            <Button
              onPress={() =>
                setDatePickerVisible((prev) => ({ ...prev, start: true }))
              }
              style={styles.dialogDate}
            >
              Start Time: {startDateTime.toLocaleString()}
            </Button>
            <Button
              onPress={() =>
                setDatePickerVisible((prev) => ({ ...prev, end: true }))
              }
              style={styles.dialogDate}
            >
              End Time: {endDateTime.toLocaleString()}
            </Button>
            <DateTimePickerModal
              isVisible={datePickerVisible.start}
              mode="datetime"
              onConfirm={(date) => handleDateConfirm(date, "start")}
              onCancel={() =>
                setDatePickerVisible((prev) => ({ ...prev, start: false }))
              }
            />
            <DateTimePickerModal
              isVisible={datePickerVisible.end}
              mode="datetime"
              onConfirm={(date) => handleDateConfirm(date, "end")}
              onCancel={() =>
                setDatePickerVisible((prev) => ({ ...prev, end: false }))
              }
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Reservation FAB */}
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
      // backgroundColor: theme.colors.elevation.level1,
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
    dialogDate: {
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderStyle: "solid",
      marginBottom: 10,
      // backgroundColor: "red",
    },
    dialogContainer: { backgroundColor: theme.colors.elevation.level1 },
  })
}

export default ReservationScreen
