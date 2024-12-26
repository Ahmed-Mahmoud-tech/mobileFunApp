import Dropdown from "@/components/Dropdown/Dropdown"
import React, { useState } from "react"
import { StyleSheet, ScrollView, View, Alert } from "react-native"
import {
  TextInput,
  Button,
  Checkbox,
  Card,
  List,
  IconButton,
  Divider,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper"

const NotificationPage = () => {
  const [notificationPreferences, setNotificationPreferences] = useState({
    employeeRequest: false,
    reservation: false,
    play: false,
    purchasesItems: false,
    playersPurchases: false,
    checkout: false,
  })
  const theme = useTheme()
  const styles = themeStyles(theme)

  const [filters, setFilters] = useState({
    notificationType: "all",
    date: new Date().toISOString().split("T")[0], // Default to today
    email: "",
  })

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Employee Request",
      body: "Alice Smith has requested to join your company.",
      author: "Alice Smith",
      time: "2024-12-08 10:30 AM",
      type: "employeeRequest",
      actions: {
        accept: true,
        reject: true,
      },
    },
    {
      id: 2,
      title: "New Reservation",
      body: "Reservation made for VIP Room on 2024-12-08 02:00 PM.",
      author: "John Doe",
      time: "2024-12-08 09:15 AM",
      type: "reservation",
      actions: {
        accept: false,
        reject: false,
      },
    },
  ])

  const togglePreference = (key) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNotificationAction = (id, action) => {
    Alert.alert(
      `Notification Action`,
      `You chose to ${action} for notification ID ${id}.`
    )
    // Add logic for handling accept/reject actions
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType =
      filters.notificationType === "all" ||
      notification.type === filters.notificationType
    const matchesEmail =
      !filters.email ||
      notification.author.toLowerCase().includes(filters.email.toLowerCase())
    const matchesDate =
      !filters.date || notification.time.startsWith(filters.date)

    return matchesType && matchesEmail && matchesDate
  })

  const notificationType = (value) => {
    handleFilterChange("notificationType", value)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filters */}
      <Card style={styles.card}>
        <Card.Title title="Filters" />
        <Divider />
        <Card.Content>
          <Dropdown
            data={{
              all: "All",
              employeeRequest: "Employee Request",
              reservation: "Reservation",
              play: "Play",
              purchasesItems: "Purchases Items",
              playersPurchases: "Players Purchases",
              checkout: "Checkout",
            }}
            onSelect={notificationType} // Pass handleSelect function to handle selection
            roomholder="Choose a Game"
          />

          {/* Date Filter */}
          <TextInput
            label="Filter by Date"
            value={filters.date}
            onChangeText={(value) => handleFilterChange("date", value)}
            style={styles.input}
            mode="outlined"
          />

          {/* Email Filter */}
          <TextInput
            label="Filter by Email"
            value={filters.email}
            onChangeText={(value) => handleFilterChange("email", value)}
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>

      {/* Notification List */}
      <Card style={styles.card}>
        <Card.Title title="Notifications" />
        <Divider />
        <Card.Content>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <View key={notification.id}>
                <List.Item
                  title={notification.title}
                  description={`${notification.body}\nBy: ${notification.author}\nAt: ${notification.time}`}
                />
                {notification.actions.accept || notification.actions.reject ? (
                  <View style={styles.actions}>
                    {notification.actions.accept && (
                      <Button
                        mode="contained"
                        onPress={() =>
                          handleNotificationAction(notification.id, "accept")
                        }
                        style={styles.actionButton}
                      >
                        Accept
                      </Button>
                    )}
                    {notification.actions.reject && (
                      <Button
                        mode="outlined"
                        onPress={() =>
                          handleNotificationAction(notification.id, "reject")
                        }
                        style={styles.actionButton}
                      >
                        Reject
                      </Button>
                    )}
                  </View>
                ) : null}
                <Divider style={styles.spaceTop} />
              </View>
            ))
          ) : (
            <Text style={styles.notFound}>No notifications found.</Text>
          )}
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
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    actionButton: {
      marginLeft: 8,
    },
    notFound: {
      marginTop: 10,
    },
    spaceTop: {
      marginTop: 10,
    },
  })
}
export default NotificationPage
