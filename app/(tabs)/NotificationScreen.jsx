import Dropdown from "@/components/Dropdown/Dropdown";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
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
} from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";
import { notificationTypes } from "@/constants/notification";
import { utcToLocal } from "@/common/time";
import useRequest from "@/axios/useRequest";

const NotificationPage = () => {
  const { getNotification } = useRequest();
  const unReadCount = useSelector((state) => state.notification.unReadCount);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState([]);
  const theme = useTheme();
  const styles = themeStyles(theme);
  const [filters, setFilters] = useState({
    notificationType: "all",
    date: new Date().toISOString().split("T")[0], // Default to today
    email: "",
  });

  const user = useSelector((state) => state.user.userInfo);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const notificationType = (value) => {
    handleFilterChange("notificationType", value);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getNotification(user?.id);
        setNotification(response.data);
      } catch (error) {
        console.log("Error", error.message);
      }
    })();
  }, [unReadCount]);

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
            placeholder="Choose a Game"
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
        <Card.Title title="Notifications" titleStyle={styles.cardTitle} />
        <Divider />
        <Card.Content>
          {notification.length > 0 ? (
            notification.map((notification, index) => {
              const notificationType = notificationTypes(notification.body)[
                notification.body.type
              ];
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: !notification.is_read
                      ? theme.colors.elevation.level5
                      : "",
                  }}
                >
                  <List.Item
                    titleStyle={{
                      ...styles.notificationTitle,
                    }}
                    title={notificationType.title}
                    descriptionNumberOfLines={null}
                    description={notificationType.body}
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={(props) => <List.Icon {...props} icon="read" />}
                  />
                  <Text style={styles.notificationTime}>
                    {utcToLocal(notificationType.time)}
                  </Text>

                  <Divider style={styles.spaceTop} />
                </View>
              );
            })
          ) : (
            <Text style={styles.notFound}>No notifications found.</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontWeight: "bold",
      marginBottom: -8,
    },
    input: {
      marginBottom: 16,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    notificationTime: {
      textAlign: "center",
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
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
  });
}
export default NotificationPage;
