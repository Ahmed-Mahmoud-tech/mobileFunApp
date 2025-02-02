import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { TextInput, Button, Text, Card, useTheme } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useRequest from "@/axios/useRequest";
import { useSelector } from "react-redux";
import { utcToLocal } from "@/common/time";
import { calculateTimeDifference } from "@/common/timeDifference";
import RenderCheckOutHeader from "@/components/RenderCheckOutHeader/RenderCheckOutHeader";
import Popup from "@/components/Popup/Popup";
import { useTranslation } from "react-i18next";

let firstLoadSession = 1;
let firstLoadPurchase = 1;
const CheckoutScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = themeStyles(theme, i18n.language === "ar");
  const {
    getPurchases,
    updatePurchases,
    getSessions,
    updateSessions,
    getGames,
    getRooms,
    getItems,
  } = useRequest();
  const user = useSelector((state) => state.user.userInfo);

  const [sessions, setSessions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [games, setGames] = useState();
  const [rooms, setRooms] = useState();
  const [items, setItems] = useState();
  const [updateSessionRender, setUpdateSessionRender] = useState(0);
  const [updatePurchasesRender, setUpdatePurchasesRender] = useState(false);
  const [debouncedPlayerId, setDebouncedPlayerId] = useState("");
  const [visible, setVisible] = useState("");
  const [totalPayment, setTotalPayment] = useState();
  const [filters, setFilters] = useState({
    status: "All",
    playerId: "",
    day: new Date(),
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlayerId(filters.playerId); // Update debounced value after 2 seconds
    }, 1000);
    // Cleanup the timeout if user types again before 2 seconds
    return () => clearTimeout(handler);
  }, [filters.playerId]);

  useEffect(() => {
    (async () => {
      const { status, day, playerId } = filters;

      // Build query parameters dynamically
      const params = {};
      if (playerId) params.playerId = debouncedPlayerId;
      if (status) params.status = status == "All" ? "" : status;
      if (day)
        params.startDate = new Date(new Date(day).toDateString()).getTime();

      const sessionResponse = await getSessions({ params });

      setSessions(sessionResponse.data);
      // if (firstLoadSession == 1) {
      if (!rooms) {
        const gameResponse = await getGames();
        const games = {};
        gameResponse.data.map((item) => (games[item.id] = item));
        setGames(games);

        const roomResponse = await getRooms(user.owner);
        const rooms = {};
        roomResponse.data.map((item) => (rooms[item.id] = item));
        setRooms(rooms);
        // firstLoadSession++;
      }
    })();
  }, [updateSessionRender, debouncedPlayerId, filters.status, filters.day]);

  const handleSessionCheckout = async (sessionId, data) => {
    await updateSessions(sessionId, data);
    setUpdateSessionRender(updateSessionRender + 1);
  };
  const handleSessionCancel = async (sessionId, data) => {
    await updateSessions(sessionId, data);
    setUpdateSessionRender(updateSessionRender + 1);
  };
  const handlePurchaseCheckout = async (purchaseId, body) => {
    await updatePurchases(purchaseId, body);
    setUpdatePurchasesRender(updatePurchasesRender + 1);
  };
  const handlePurchaseCancel = async (purchaseId, body) => {
    await updatePurchases(purchaseId, body);
    setUpdatePurchasesRender(updatePurchasesRender + 1);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setFilters((prev) => ({
      ...prev,
      day: selectedDate,
    }));
    hideDatePicker();
  };

  const calculatePrice = (item) => {
    const price =
      item.type == "single"
        ? games[item.gameId].singlePrice
        : games[item.gameId].multiPrice;

    const time = calculateTimeDifference(
      item.startTime,
      item.endTime || new Date()
    );

    return (parseFloat(price) / 60) * parseFloat(time);
  };

  useEffect(() => {
    (async () => {
      const { status, day, playerId } = filters;

      // Build query parameters dynamically
      const params = {};
      if (playerId) params.playerId = debouncedPlayerId;
      if (status) params.status = status == "All" ? "" : status;
      if (day)
        params.createdAt = new Date(new Date(day).toDateString()).getTime();

      const purchasesResponse = await getPurchases({ params });
      setPurchases(purchasesResponse.data);
      // if (firstLoadPurchase == 1) {
      if (!items) {
        const itemsResponse = await getItems();

        const items = {};
        itemsResponse.data.map((item) => (items[item.id] = item));
        setItems(items);

        // firstLoadPurchase++;
      }
    })();
  }, [updatePurchasesRender, debouncedPlayerId, filters.status, filters.day]);

  const handleCheckoutAll = async () => {
    const purchasesPromises = purchases.map(
      (purchase) =>
        purchases.status == "notPaid" &&
        updatePurchases(purchase.id, { status: "paid" })
    );
    const sessionsPromises = sessions.map((session) =>
      updateSessions(session.id, {
        amount: calculatePrice(session),
        status: "paid",
      })
    );
    await Promise.all([...purchasesPromises, ...sessionsPromises]);
    setUpdatePurchasesRender(updatePurchasesRender + 1);
    setUpdateSessionRender(updateSessionRender + 1);
    setVisible(false);
  };

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
        );

      setTotalPayment(total);
    }
  }, [sessions, purchases, filters.playerId]);

  const renderSessionItem = ({ item }) =>
    games &&
    rooms && (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.itemName}>{games[item.gameId].name}</Text>
          <Text>
            {t("type")}: {item.type}
          </Text>
          <Text>
            {t("room_id")}: {rooms[item.sectionId].sectionName}
          </Text>
          <Text>
            {t("start")}: {utcToLocal(item.startTime)}
          </Text>
          <Text>
            {t("end")}: {item.endTime ? utcToLocal(item.endTime) : t("n/a")}
          </Text>
          <Text>
            {t("player_id")}: {item.playerId}
          </Text>
          <Text>
            {t("status")}:{" "}
            {item.status == "notPaid" ? t("not_paid") : t("paid")}
          </Text>
          <Text>
            {t("price")}:
            {item.amount ? parseFloat(item.amount) : calculatePrice(item)}
          </Text>
        </Card.Content>
        <Card.Actions>
          {item.status == "notPaid" ? (
            <Button
              onPress={() =>
                handleSessionCheckout(item.id, {
                  amount: calculatePrice(item),
                  author: user.username,
                  sectionName: rooms[item.sectionId].sectionName,
                  playerId: item.playerId,
                  status: "paid",
                  isFromEmployee: user.type === "employee" ? "employee" : "",
                  ownerId: user.owner,
                })
              }
            >
              {t("Checkout")}
            </Button>
          ) : (
            <Button
              onPress={() =>
                handleSessionCancel(item.id, {
                  amount: null,
                  author: user.username,
                  sectionName: rooms[item.sectionId].sectionName,
                  playerId: item.playerId,
                  status: "notPaid",
                  isFromEmployee: user.type === "employee" ? "employee" : "",
                  ownerId: user.owner,
                })
              }
            >
              {t("Cancel")}
            </Button>
          )}
        </Card.Actions>
      </Card>
    );

  const renderPurchaseItem = ({ item }) =>
    games &&
    rooms && (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.itemName}>{items[item.item].name}</Text>
          <Text>
            {t("status")}:{" "}
            {item.status == "notPaid" ? t("not_paid") : t("paid")}
          </Text>
          <Text>
            {t("count")}: {item.count}
          </Text>
          <Text>
            {t("player_id")}: {item.playerId}
          </Text>
          <Text>
            {t("total_price")}:{+items[item.item].price * +item.count}
          </Text>
        </Card.Content>
        <Card.Actions>
          {item.status == "notPaid" ? (
            <Button
              onPress={() =>
                handlePurchaseCheckout(item.id, {
                  amount: +items[item.item].price * +item.count,
                  count: item.count,
                  author: user.username,
                  itemName: items[item.item].name,
                  playerId: item.playerId,
                  status: "paid",
                  isFromEmployee: user.type === "employee" ? "employee" : "",
                  ownerId: user.owner,
                })
              }
            >
              {t("Checkout")}
            </Button>
          ) : (
            <Button
              onPress={() =>
                handlePurchaseCancel(item.id, {
                  count: item.count,
                  author: user.username,
                  itemName: items[item.item].name,
                  playerId: item.playerId,
                  status: "notPaid",
                  isFromEmployee: user.type === "employee" ? "employee" : "",
                  ownerId: user.owner,
                })
              }
            >
              {t("cancel")}
            </Button>
          )}
        </Card.Actions>
      </Card>
    );

  return (
    <View style={styles.container}>
      <Popup
        title={t("checkout_all_confirmation", { playerId: filters.playerId })}
        description={t("total_payment", { totalPayment })}
        handleYes={() => handleCheckoutAll()}
        handleNo={() => setVisible(false)}
        visible={visible}
        yes={t("Confirm")}
        no={t("Cancel")}
      />
      {/* <Text>{JSON.stringify([...sessions, ...purchases, games, rooms])}</Text> */}
      <FlatList
        data={[...sessions, ...purchases]}
        renderItem={({ item }) =>
          item.gameId
            ? renderSessionItem({ item })
            : renderPurchaseItem({ item })
        }
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <RenderCheckOutHeader
              filters={filters}
              setFilters={setFilters}
              showDatePicker={showDatePicker}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                margin: 5,
                marginBottom: 10,
                textAlign: i18n.language === "ar" ? "left" : "right",
              }}
            >
              {t("sessions_and_purchases")}
            </Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("no_session_found")}</Text>
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
            setVisible(true);
          }}
          style={styles.checkoutAll}
        >
          {t("checkout_all")} ({totalPayment})
        </Button>
      ) : null}
    </View>
  );
};

function themeStyles(theme, isRTL) {
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
  });
}

export default CheckoutScreen;
