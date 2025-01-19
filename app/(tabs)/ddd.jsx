import { BACKEND_URL } from "@/constants/main";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const notification = [];
const setNotification = (data) => notification.push(data);
const App = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const newSocket = io(`${BACKEND_URL}/`, {
      transports: ["websocket"],
    });

    // Listen for notifications
    newSocket.on(user?.id, ({ data }) => {
      console.log("Notification received:", data);
      setNotification(data);
      console.log(notification);
    });

    // Set up the socket instance
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => newSocket.disconnect();
  }, []);

  //   const registerUser = () => {
  //     if (socket && userId) {
  //       socket.emit("register", { userId });
  //       console.log(`Registered with userId: ${userId}`);
  //     }
  //   };

  //   const sendNotification = () => {
  //     if (socket && toUserId && message) {
  //       socket.emit("sendNotification", { toUserId, message });
  //       console.log(`Notification sent to ${toUserId}: ${message}`);
  //     }
  //   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user?.id}</Text>
      {notification.length > 0 &&
        notification.map((item, index) => (
          <Text key={index} style={styles.notification}>
            {`Notification: ${item.title} - ${item.body}`}
          </Text>
        ))}
    </View>
  );
};

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
