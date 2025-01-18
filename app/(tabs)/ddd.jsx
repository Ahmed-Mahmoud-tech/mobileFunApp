import { BACKEND_URL } from "@/constants/main";
import io from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [message, setMessage] = useState("");

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    // Connect to the backend Socket.IO server
    const newSocket = io(`${BACKEND_URL}/`, {
      transports: ["websocket"],
    });

    // Listen for notifications
    newSocket.on("receiveNotification", ({ message }) => {
      console.log("Notification received:", message);
      setNotification(message);
    });

    // Set up the socket instance
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const registerUser = () => {
    if (socket && userId) {
      socket.emit("register", { userId });
      console.log(`Registered with userId: ${userId}`);
    }
  };

  const sendNotification = () => {
    if (socket && toUserId && message) {
      socket.emit("sendNotification", { toUserId, message });
      console.log(`Notification sent to ${toUserId}: ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Socket.IO Example</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your User ID"
        value={userId}
        onChangeText={setUserId}
      />
      <Button title="Register" onPress={registerUser} />

      <TextInput
        style={styles.input}
        placeholder="Enter recipient User ID"
        value={toUserId}
        onChangeText={setToUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Notification" onPress={sendNotification} />

      {notification && (
        <Text style={styles.notification}>Notification: {notification}</Text>
      )}

      <Text>
        {" "}
        ------------------------------------------------------------------{" "}
      </Text>

      <View style={styles.container}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={styles.notificationContainer}>
          <Text>
            Title: {notification?.request?.content?.title || "No Notification"}
          </Text>
          <Text>
            Body: {notification?.request?.content?.body || "No Notification"}
          </Text>
        </View>
        <Button
          title="Send Test Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
    </View>
  );
};

// Function to send push notifications (test example)
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Test Notification",
    body: "This is a test message!",
    data: { extraData: "Some extra data" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  Alert.alert("Test Notification sent!");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notification: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },
});

export default App;
