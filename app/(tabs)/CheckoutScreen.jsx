import React, { useState, useEffect } from "react"
import { StyleSheet, View, FlatList, ScrollView } from "react-native"
import {
  TextInput,
  Button,
  Text,
  Card,
  SegmentedButtons,
  useTheme,
} from "react-native-paper"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import useRequest from "@/axios/useRequest"
import { useSelector } from "react-redux"
import { utcToLocal } from "@/common/time"
import { calculateTimeDifference } from "@/common/timeDifference"
import RenderCheckOutHeader from "@/components/RenderCheckOutHeader/RenderCheckOutHeader"
import Popup from "@/components/Popup/Popup"

let firstLoadSession = 1
let firstLoadPurchase = 1
const CheckoutScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)
  const {
    getPurchases,
    updatePurchases,
    getSessions,
    updateSessions,
    getGames,
    getRooms,
    getItems,
  } = useRequest()
  const user = useSelector((state) => state.user.userInfo)

  const [sessions, setSessions] = useState([])
  const [purchases, setPurchases] = useState([])
  const [games, setGames] = useState()
  const [rooms, setRooms] = useState()
  const [items, setItems] = useState()
  const [updateSessionRender, setUpdateSessionRender] = useState(0)
  const [updatePurchasesRender, setUpdatePurchasesRender] = useState(false)
  const [debouncedPlayerId, setDebouncedPlayerId] = useState("")
  const [visible, setVisible] = useState("")
  const [totalPayment, setTotalPayment] = useState()
  const [filters, setFilters] = useState({
    status: "All",
    playerId: "",
    day: new Date(),
  })

  const [datePickerVisible, setDatePickerVisible] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlayerId(filters.playerId) // Update debounced value after 2 seconds
    }, 1000)
    // Cleanup the timeout if user types again before 2 seconds
    return () => clearTimeout(handler)
  }, [filters.playerId])

  useEffect(() => {
    ;(async () => {
      const { status, day, playerId } = filters

      // Build query parameters dynamically
      const params = {}
      if (playerId) params.playerId = debouncedPlayerId
      if (status) params.status = status == "All" ? "" : status
      if (day)
        params.startDate = new Date(new Date(day).toDateString()).getTime()

      const sessionResponse = await getSessions({ params })

      setSessions(sessionResponse.data)
      if (firstLoadSession == 1) {
        const gameResponse = await getGames()
        const games = {}
        gameResponse.data.map((item) => (games[item.id] = item))
        setGames(games)

        const roomResponse = await getRooms()
        const rooms = {}
        roomResponse.data.map((item) => (rooms[item.id] = item))
        setRooms(rooms)
        firstLoadSession++
      }
    })()
  }, [updateSessionRender, debouncedPlayerId, filters.status, filters.day])

  const handleSessionCheckout = async (sessionId, price) => {
    await updateSessions(sessionId, { amount: price, status: "paid" })
    setUpdateSessionRender(updateSessionRender + 1)
  }
  const handleSessionCancel = async (sessionId) => {
    await updateSessions(sessionId, { amount: null, status: "notPaid" })
    setUpdateSessionRender(updateSessionRender + 1)
  }
  const handlePurchaseCheckout = async (purchaseId) => {
    await updatePurchases(purchaseId, { status: "paid" })
    setUpdatePurchasesRender(updatePurchasesRender + 1)
  }
  const handlePurchaseCancel = async (purchaseId) => {
    await updatePurchases(purchaseId, { status: "notPaid" })
    setUpdatePurchasesRender(updatePurchasesRender + 1)
  }

  const showDatePicker = () => {
    setDatePickerVisible(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }

  const handleConfirmDate = (selectedDate) => {
    setFilters((prev) => ({
      ...prev,
      day: selectedDate,
    }))
    hideDatePicker()
  }

  const calculatePrice = (item) => {
    const price =
      item.type == "single"
        ? games[item.gameId].singlePrice
        : games[item.gameId].multiPrice

    const time = calculateTimeDifference(
      item.startTime,
      item.endTime || new Date()
    )

    return (parseFloat(price) / 60) * parseFloat(time)
  }

  useEffect(() => {
    ;(async () => {
      const { status, day, playerId } = filters

      // Build query parameters dynamically
      const params = {}
      if (playerId) params.playerId = debouncedPlayerId
      if (status) params.status = status == "All" ? "" : status
      if (day)
        params.createdAt = new Date(new Date(day).toDateString()).getTime()

      const purchasesResponse = await getPurchases({ params })
      setPurchases(purchasesResponse.data)
      if (firstLoadPurchase == 1) {
        const itemsResponse = await getItems()

        const items = {}
        itemsResponse.data.map((item) => (items[item.id] = item))
        setItems(items)

        firstLoadPurchase++
      }
    })()
  }, [updatePurchasesRender, debouncedPlayerId, filters.status, filters.day])

  const handleCheckoutAll = async () => {
    const purchasesPromises = purchases.map(
      (purchase) =>
        purchases.status == "notPaid" &&
        updatePurchases(purchase.id, { status: "paid" })
    )
    const sessionsPromises = sessions.map((session) =>
      updateSessions(session.id, {
        amount: calculatePrice(session),
        status: "paid",
      })
    )
    await Promise.all([...purchasesPromises, ...sessionsPromises])
    setUpdatePurchasesRender(updatePurchasesRender + 1)
    setUpdateSessionRender(updateSessionRender + 1)
    setVisible(false)
  }

  useEffect(() => {
    if ((sessions.length > 0 || purchases.length > 0) && filters.playerId) {
      const total =
        sessions.reduce(
          (sum, item) =>
            parseFloat(sum) +
            (item.status == "notPaid" ? calculatePrice(item) : 0),
          0
        ) +
        purchases.reduce(
          (sum, purchase) =>
            parseFloat(sum) +
            (purchase.status == "notPaid"
              ? parseFloat(items[purchase.item].price) *
                parseFloat(purchase.count)
              : 0),
          0
        )

      setTotalPayment(total)
    }
  }, [sessions, purchases, filters.playerId])

  const renderSessionItem = ({ item }) =>
    games &&
    rooms && (
      <>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.itemName}>{games[item.gameId].name}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Room ID: {rooms[item.sectionId].sectionName}</Text>
            <Text>Start: {utcToLocal(item.startTime)}</Text>
            <Text>End: {item.endTime ? utcToLocal(item.endTime) : "N/A"}</Text>
            <Text>Player ID: {item.playerId}</Text>
            <Text>
              Status: {item.status == "notPaid" ? "Not Paid" : "Paid"}
            </Text>
            <Text>
              Price:
              {item.amount ? parseFloat(item.amount) : calculatePrice(item)}
            </Text>
          </Card.Content>
          <Card.Actions>
            {item.status == "notPaid" ? (
              <Button
                onPress={() =>
                  handleSessionCheckout(item.id, calculatePrice(item))
                }
              >
                Checkout
              </Button>
            ) : (
              <Button onPress={() => handleSessionCancel(item.id)}>
                Cancel
              </Button>
            )}
          </Card.Actions>
        </Card>
      </>
    )

  const renderPurchaseItem = ({ item }) =>
    games &&
    rooms && (
      <>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.itemName}>{items[item.item].name}</Text>
            <Text>
              Status: {item.status == "notPaid" ? "Not Paid" : "Paid"}
            </Text>
            <Text>Count: {item.count}</Text>
            <Text>Player ID: {item.playerId}</Text>
            <Text>
              Total Price:
              {+items[item.item].price * +item.count}
            </Text>
          </Card.Content>
          <Card.Actions>
            {item.status == "notPaid" ? (
              <Button onPress={() => handlePurchaseCheckout(item.id)}>
                Checkout
              </Button>
            ) : (
              <Button onPress={() => handlePurchaseCancel(item.id)}>
                Cancel
              </Button>
            )}
          </Card.Actions>
        </Card>
      </>
    )

  return (
    <ScrollView style={styles.container}>
      <Popup
        title={`Are you sure to checkout all purchases and sessions for player ID ${filters.playerId} ?`}
        description={"The total payment is " + totalPayment}
        handleYes={() => handleCheckoutAll()}
        handleNo={() => setVisible(false)}
        visible={visible}
        yes={"Confirm"}
        no={"Cancel"}
      />

      <RenderCheckOutHeader
        filters={filters}
        setFilters={setFilters}
        showDatePicker={showDatePicker}
      />
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              margin: 5,
              marginBottom: 10,
            }}
          >
            Sessions
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No session found!</Text>
        }
      />
      <FlatList
        data={purchases}
        renderItem={renderPurchaseItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              margin: 5,
              marginBottom: 10,
            }}
          >
            Purchases
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No purchases found!</Text>
        }
      />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        date={filters.day}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      {/* Checkout All Button */}
      {parseFloat(totalPayment) ? (
        <Button
          mode="contained"
          onPress={() => {
            setVisible(true)
          }}
          style={styles.checkoutAll}
        >
          Checkout All ({totalPayment})
        </Button>
      ) : null}
    </ScrollView>
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
    card: {
      marginBottom: 16,
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
    emptyText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
    },
    checkoutAll: {
      marginTop: 16,
      padding: 10,
    },
    segmentedButtons: {
      marginBottom: 16,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
  })
}

export default CheckoutScreen
