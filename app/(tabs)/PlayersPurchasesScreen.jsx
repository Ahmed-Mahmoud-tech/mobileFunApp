import React, { useState, useEffect } from "react"
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
  IconButton,
} from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import useRequest from "@/axios/useRequest"
import { useSelector } from "react-redux"
import FilterableDropdown from "@/components/FilterableDropDown/FilterableDropDown"
import { utcToLocal } from "@/common/time"
import Popup from "@/components/Popup/Popup"
import PlayerPurchaseRenderHeader from "@/components/PlayerPurchaseRenderHeader/PlayerPurchaseRenderHeader"
import Dropdown from "@/components/Dropdown/Dropdown"

const PlayersPurchasesScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)

  const [purchases, setPurchases] = useState([])

  const [filters, setFilters] = useState({
    playerId: "",
    status: "all",
    createdAt: new Date().toDateString(),
  })

  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState(null)
  const [purchasesItem, setPurchasesItem] = useState({})
  const [count, setCount] = useState("")
  const [playerId, setPlayerId] = useState("")
  const [players, setPlayers] = useState("")
  const [newPlayer, setNewPlayer] = useState("")
  const [debouncedPlayerId, setDebouncedPlayerId] = useState("")
  const [status, setStatus] = useState("notPaid") // Track status in the popup
  const [itemsDropdown, setItemsDropdown] = useState([])
  const [updatePurchaseRender, setUpdatePurchaseRender] = useState("")
  const [visible, setVisible] = useState(false)
  const [messageTitle, setMessageTitle] = useState()
  const [messageDescription, setMessageDescription] = useState()
  const [handleYes, setHandleYes] = useState(null)
  const [handleNo, setHandleNo] = useState(null)
  const [yesWord, setYesWord] = useState("Yes")
  const [noWord, setNoWord] = useState("No")

  const {
    getItems,
    getPurchases,
    postPurchases,
    updatePurchases,
    deletePurchases,
    playerIdList,
  } = useRequest()

  const user = useSelector((state) => state.user.userInfo)

  const openDialog = async (purchase = null) => {
    const playersList = await playerIdList(
      user.type == "owner" ? user.id : user.owner
    )

    setNewPlayer(Math.max(...playersList.data.playerIds))
    const playersObject = {}
    playersList.data.playerIds.map((id) => (playersObject[id] = id))
    setPlayers(playersObject)
    if (purchase) {
      setCurrentPurchase(purchase)
      setPurchasesItem(itemsDropdown.find((item) => item.id === purchase.item))
      setCount(purchase.count.toString())
      setPlayerId(purchase.playerId.toString())
      setStatus(purchase.status) // Initialize status with current value
    } else {
      setCurrentPurchase()
      setPurchasesItem({})
      setCount("")
      setPlayerId("")
      setStatus("notPaid") // Default status
    }
    setDialogVisible(true)
  }

  const closeDialog = () => {
    setDialogVisible(false)
    setPurchasesItem({})
    setCount("")
    setPlayerId("")
    setStatus("notPaid")
  }

  const handleSave = async () => {
    const newPurchase = {
      item: purchasesItem.id,
      count: count,
      playerId: playerId,
      status,
      ownerId: user.type == "owner" ? user.id : user.owner,
      // item:
    }

    if (currentPurchase) {
      await updatePurchases(currentPurchase.id, {
        // ...currentPurchase,
        ...newPurchase,
      })
    } else {
      await postPurchases(newPurchase)
    }

    setUpdatePurchaseRender(updatePurchaseRender + 1)
    closeDialog()
  }

  useEffect(() => {
    ;(async () => {
      const data = await getItems()
      // const data = await getItems(user.type == "owner" ? user.id : user.owner)
      setItemsDropdown(data.data)
    })()
  }, [])

  // useEffect(() => {
  //   ;(async () => {
  //     const data = await getPurchases(
  //       user.type == "owner" ? user.id : user.owner
  //     )
  //     setPurchases(data.data)
  //   })()
  // }, [updatePurchaseRender])
  useEffect(() => {
    ;(async () => {
      try {
        const { status, createdAt, playerId } = filters

        // Build query parameters dynamically
        const params = {}
        if (playerId) params.playerId = debouncedPlayerId
        if (status) params.status = status == "all" ? "" : status
        if (createdAt) params.createdAt = new Date(createdAt).getTime()

        const data = await getPurchases({ params })
        setPurchases(data.data)
        // setError("")
      } catch (err) {
        // setError(err.response?.data?.error || "An error occurred")
        // setPurchases([])
      }
    })()
  }, [
    updatePurchaseRender,
    debouncedPlayerId,
    filters.status,
    filters.createdAt,
  ])

  // Debounce the playerId value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlayerId(filters.playerId) // Update debounced value after 2 seconds
    }, 1000)

    // Cleanup the timeout if user types again before 2 seconds
    return () => clearTimeout(handler)
  }, [filters.playerId])

  const confirmDeletePurchase = async (id) => {
    await deletePurchases(id)
    setVisible(false)
    setUpdatePurchaseRender(updatePurchaseRender + 1)
  }

  const handleRemovePurchase = (id) => {
    setHandleYes(() => () => confirmDeletePurchase(id))
    setHandleNo(() => () => setVisible(false))
    setMessageTitle("Confirm")
    setMessageDescription("Are you sure you want to delete this Purchase?")
    setYesWord("Confirm")
    setNoWord("No")
    setVisible(true)
  }

  const renderPurchaseItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>
          {itemsDropdown.find((dropItem) => dropItem.id === item.item).name}
        </Text>
        <Text>Count: {item.count}</Text>
        <Text>Player ID: {item.playerId}</Text>
        <Text>Status: {item.status == "notPaid" ? "Not Paid" : "Paid"}</Text>
        <Text>Date: {utcToLocal(item.createdAt)} </Text>
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
            onPress={() => handleRemovePurchase(item.id)}
          />
        </View>
      </Card.Actions>
    </Card>
  )

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

      {isDatePickerVisible && (
        <DateTimePicker
          mode="date"
          value={new Date(filters.createdAt)}
          onChange={(event, selectedDate) => {
            setDatePickerVisible(false)
            if (selectedDate) {
              setFilters((prev) => ({
                ...prev,
                createdAt: selectedDate.toDateString(),
              }))
            }
          }}
        />
      )}

      <FlatList
        data={purchases}
        renderItem={renderPurchaseItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <PlayerPurchaseRenderHeader
            filters={filters}
            setFilters={setFilters}
            setDatePickerVisible={setDatePickerVisible}
          />
        }
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
            <View style={{ zIndex: 10 }}>
              <FilterableDropdown
                data={itemsDropdown}
                onSelect={setPurchasesItem} // Pass handleSelect function to handle selection
                placeholder="Choose an Item"
                value={purchasesItem}
              />
            </View>
            <TextInput
              label="Count"
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
              style={[styles.input, styles.inputRow]}
            />
            <Dropdown
              data={players}
              onSelect={setPlayerId} // Pass handleSelect function to handle selection
              placeholder="Choose a PlayerId"
              flag={newPlayer}
              selected={currentPurchase?.playerId?.toString()}
            />
            <View style={styles.inputRow}>
              <SegmentedButtons
                value={status}
                onValueChange={setStatus} // Update the status in the popup
                buttons={[
                  { value: "paid", label: "Paid" },
                  { value: "notPaid", label: "Not Paid" },
                ]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button
              onPress={handleSave}
              disabled={!purchasesItem.name || !count || !playerId}
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
    input: {
      marginBottom: 10,
    },
    inputRow: {
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
    itemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
  })
}
export default PlayersPurchasesScreen
