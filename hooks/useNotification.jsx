import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function useNotification() {
  useEffect(() => {
    // Request permissions
    Notifications.requestPermissionsAsync();

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Set notification channel (Android)
    Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "notification.wav",
    });
  }, []);

  const scheduleNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "notification.wav",
      },
      trigger: {
        seconds: 5, // Show notification after 5 seconds
      },
    });
  };

  return { scheduleNotification };
}
