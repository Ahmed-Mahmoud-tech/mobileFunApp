import React, { useState } from "react"
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native"
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
} from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"

const PlayersPurchasesScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)

  const [purchases, setPurchases] = useState([
    {
      id: 1,
      purchasesItemName: "Item A",
      count: 2,
      playerId: 1,
      status: "not paid",
      date: new Date().toDateString(),
    },
    {
      id: 2,
      purchasesItemName: "Item B",
      count: 1,
      playerId: 2,
      status: "paid",
      date: new Date().toDateString(),
    },
  ])

  const [filters, setFilters] = useState({
    playerId: "",
    status: "all",
    date: new Date().toDateString(),
  })

  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState(null)
  const [purchasesItemName, setPurchasesItemName] = useState("")
  const [count, setCount] = useState("")
  const [playerId, setPlayerId] = useState("")
  const [status, setStatus] = useState("not paid") // Track status in the popup

  const openDialog = (purchase = null) => {
    setCurrentPurchase(purchase)
    if (purchase) {
      setPurchasesItemName(purchase.purchasesItemName)
      setCount(purchase.count.toString())
      setPlayerId(purchase.playerId.toString())
      setStatus(purchase.status) // Initialize status with current value
    } else {
      setPurchasesItemName("")
      setCount("")
      setPlayerId("")
      setStatus("not paid") // Default status
    }
    setDialogVisible(true)
  }

  const closeDialog = () => {
    setDialogVisible(false)
    setPurchasesItemName("")
    setCount("")
    setPlayerId("")
    setStatus("not paid")
  }

  const handleSave = () => {
    if (currentPurchase) {
      // Edit existing purchase
      setPurchases((prevPurchases) =>
        prevPurchases.map((item) =>
          item.id === currentPurchase.id
            ? {
                ...item,
                purchasesItemName,
                count: +count,
                playerId: +playerId,
                status,
              }
            : item
        )
      )
    } else {
      // Add new purchase
      const newPurchase = {
        id: purchases.length ? purchases[purchases.length - 1].id + 1 : 1,
        purchasesItemName,
        count: +count,
        playerId: +playerId,
        status,
        date: filters.date,
      }
      setPurchases((prevPurchases) => [...prevPurchases, newPurchase])
    }
    closeDialog()
  }

  const handleStatusFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }))
  }

  const filteredPurchases = purchases.filter(
    (purchase) =>
      (filters.status === "all" || purchase.status === filters.status) &&
      (filters.playerId
        ? purchase.playerId.toString() === filters.playerId
        : true) &&
      (filters.date ? purchase.date === filters.date : true)
  )

  const renderPurchaseItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{item.purchasesItemName}</Text>
        <Text>Count: {item.count}</Text>
        <Text>Player ID: {item.playerId}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Date: {item.date}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openDialog(item)}>Edit</Button>
      </Card.Actions>
    </Card>
  )

  // Render filters above the FlatList
  const renderHeader = () => (
    <View style={styles.filters}>
      <TextInput
        label="Player ID"
        value={filters.playerId}
        onChangeText={(text) =>
          setFilters((prev) => ({ ...prev, playerId: text }))
        }
        style={[styles.filterInput, styles.inputRow]}
      />
      <View style={[styles.filterInput, styles.inputRow]}>
        <SegmentedButtons
          value={filters.status}
          onValueChange={handleStatusFilterChange} // Update the status filter
          buttons={[
            {
              value: "all",
              label: "All",
              style: filters.status === "all" ? styles.selectedButton : {},
            },
            {
              value: "paid",
              label: "Paid",
              style: filters.status === "paid" ? styles.selectedButton : {},
            },
            {
              value: "not paid",
              label: "Not Paid",
              style: filters.status === "not paid" ? styles.selectedButton : {},
            },
          ]}
        />
      </View>
      <TouchableOpacity
        style={[styles.datePicker, styles.inputRow]}
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={styles.datePickerText}>{filters.date}</Text>
      </TouchableOpacity>
      <Button
        mode="outlined"
        onPress={() =>
          setFilters({
            playerId: "",
            status: "all",
            date: new Date().toDateString(),
          })
        }
        style={styles.resetButton}
      >
        Show All
      </Button>
    </View>
  )

  return (
    <View style={styles.container}>
      {isDatePickerVisible && (
        <DateTimePicker
          mode="date"
          value={new Date(filters.date)}
          onChange={(event, selectedDate) => {
            setDatePickerVisible(false)
            if (selectedDate) {
              setFilters((prev) => ({
                ...prev,
                date: selectedDate.toDateString(),
              }))
            }
          }}
        />
      )}

      <FlatList
        data={filteredPurchases}
        renderItem={renderPurchaseItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No purchases found!</Text>
        }
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>
            {currentPurchase ? "Edit Purchase" : "Add Purchase"}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Purchase Item Name"
              value={purchasesItemName}
              onChangeText={setPurchasesItemName}
              style={[styles.input, styles.inputRow]}
            />
            <TextInput
              label="Count"
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
              style={[styles.input, styles.inputRow]}
            />
            <TextInput
              label="Player ID"
              value={playerId}
              onChangeText={setPlayerId}
              keyboardType="numeric"
              style={[styles.input, styles.inputRow]}
            />
            <View style={styles.inputRow}>
              <SegmentedButtons
                value={status}
                onValueChange={setStatus} // Update the status in the popup
                buttons={[
                  { value: "paid", label: "Paid" },
                  { value: "not paid", label: "Not Paid" },
                ]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button
              onPress={handleSave}
              disabled={!purchasesItemName || !count || !playerId}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openDialog()}
        label="Add Purchase"
      />
    </View>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.elevation.level3,
      padding: 10,
    },
    filters: {
      flexDirection: "column",
      padding: 10,
    },
    inputRow: {
      marginBottom: 10,
    },
    filterInput: {
      marginBottom: 10,
    },
    datePicker: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: 50,
      marginBottom: 10,
      justifyContent: "center",
    },
    datePickerText: {
      fontSize: 16,
      color: theme.colors.secondary,
    },
    listContainer: {
      paddingBottom: 100,
    },
    card: {
      marginBottom: 10,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    resetButton: {
      marginTop: 10,
    },
    input: {
      marginBottom: 10,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 20,
    },
  })
}
export default PlayersPurchasesScreen
