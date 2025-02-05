import Dropdown from "@/components/Dropdown/Dropdown";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  I18nManager,
  TouchableOpacity,
} from "react-native";
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
import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import { notificationTypes } from "@/constants/notification";
import { utcToLocal } from "@/common/time";
import useRequest from "@/axios/useRequest";
import { useTranslation } from "react-i18next";

const NotificationPage = () => {
  const { getNotification, updateNotification } = useRequest();
  const unReadCount = useSelector((state) => state.notification.unReadCount);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState([]);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const styles = themeStyles(theme, i18n.language === "ar");
  const [filters, setFilters] = useState({
    notificationType: "all",
    date: new Date().toISOString().split("T")[0], // Default to today
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
        const date = new Date(new Date(filters.date).toDateString()).getTime();
        const response = await getNotification(
          `${user?.id}?startDate=${date}&&notificationType=${filters.notificationType}`
        );
        response.data && setNotification(response.data);
      } catch (error) {
        console.log("Error", error.message);
      }
    })();
  }, [unReadCount, filters.notificationType, filters.date]);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const unreadNotificationIds = notification
          .map((item) => (item.is_read == false ? item.id : null))
          .filter((id) => id !== null);
        if (unreadNotificationIds.length > 0) {
          await updateNotification({ ids: unreadNotificationIds });
        }
      } catch (error) {
        console.log("Error", error.message);
      }
    })();
  }, [notification]);

  return (
    <ScrollView style={styles.container}>
      {/* Filters */}
      <Card style={styles.card}>
        {/* <Card.Title title={t("Filters")} /> */}
        <Card.Content>
          {user.id == user.owner && (
            <Dropdown
              data={{
                all: t("All"),
                employmentRequest: t("Employee_Request"),
                sessions: t("Sessions"),
                purchasesItems: t("Purchases_Items"),
                playersPurchases: t("Players_Purchases"),
                checkout: t("Checkout"),
              }}
              onSelect={notificationType} // Pass handleSelect function to handle selection
              placeholder={t("Choose_the_notification_type")}
            />
          )}

          {isDatePickerVisible && (
            <DateTimePicker
              mode="date"
              value={new Date(filters.date)}
              onChange={(event, selectedDate) => {
                setDatePickerVisible(false);
                if (selectedDate) {
                  setFilters((prev) => ({
                    ...prev,
                    date: selectedDate.toDateString(),
                  }));
                }
              }}
            />
          )}
          <TouchableOpacity
            style={[styles.datePicker]}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text style={styles.datePickerText}>{filters.date}</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Notification List */}
      <Card style={styles.card}>
        <Card.Title title={t("notifications")} titleStyle={styles.cardTitle} />
        <Divider />
        <Card.Content>
          {console.log(notification, "notification")}
          {notification?.length > 0 ? (
            notification.map((notification, index) => {
              const notificationType = notificationTypes(t, notification.body)[
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
            <Text style={styles.notFound}>{t("no_notifications_found")}</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

function themeStyles(theme, isRTL) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontWeight: "bold",
    },
    input: {
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    datePickerText: {
      fontSize: 16,
      color: theme.colors.secondary,
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
    datePicker: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: 50,
      justifyContent: "center",
    },
  });
}
export default NotificationPage;
