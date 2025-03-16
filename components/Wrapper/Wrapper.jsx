import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header/Header";
import MainDrawer from "@/components/MainDrawer/MainDrawer";
// import { Stack, useNavigation } from "expo-router"
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "react-native-paper";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "../Translation/i18n";
import { getData, removeData, saveData } from "@/common/localStorage";
import useRequest from "@/axios/useRequest";
import { setStoredUser } from "@/store/slices/user";
import { useFocusEffect, useRootNavigationState, useRouter } from "expo-router";
import { io } from "socket.io-client";
import { BACKEND_URL } from "@/constants/main";
import {
  setStoredLastNotification,
  setUnReadCount,
} from "@/store/slices/notification";
import Popup from "../Popup/Popup";
import Note from "../Note/Note";
import Loading from "../Loading/Loading";
import { Audio } from "expo-av";
import useNotification from "../../hooks/useNotification";

import * as Notifications from "expo-notifications";

function Wrapper({ children }) {
  // const { scheduleNotification } = useNotification();
  const backToLogin = useSelector((state) => state.mainConfig.backToLogin);
  const preloader = useSelector((state) => state.mainConfig.preloader);
  const router = useRouter();
  const { routes } = useRootNavigationState();
  const dispatch = useDispatch();
  const { getUserInfo, getNotificationCount, expoRegister } = useRequest();
  const theme = useTheme();
  const [first, setFirst] = useState(false);
  const [newNote, setNewNote] = useState("");
  const menuStatus = useSelector((state) => state.mainConfig.menuStatus);
  const user = useSelector((state) => state.user.userInfo);
  const currentToken = useSelector((state) => state.user.currentToken);
  const { t, i18n } = useTranslation();
  const styles = themeStyles(theme, i18n.language === "ar");
  const [sound, setSound] = useState();

  // Initialize height with an animated value
  const height = useMemo(() => new Animated.Value(0), []); // Start with height of 0
  // Function to animate the height value
  const animateHeight = () => {
    Animated.timing(height, {
      toValue: menuStatus ? 0 : 300, // Toggle between 0 (hidden) and 300 (expanded height)
      duration: first ? 500 : 0, // Animation duration
      useNativeDriver: false, // Cannot use native driver for `height`
    }).start();
    setFirst(true);
  };

  // Trigger animation on menuStatus change
  useEffect(() => {
    animateHeight();
  }, [menuStatus]);

  const notAuth = ["LoginScreen", "MainInfoScreen", "index"];

  async function playSound(soundUrl) {
    console.log("Loading Sound");
    let theSound;
    if (soundUrl == "endTime") {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sound/endTime.wav")
      );
      theSound = sound;
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sound/notification.wav")
      );
      theSound = sound;
    }
    console.log(theSound, "444444444");

    setSound(theSound);
    await theSound.playAsync();
  }
  // async function playSound(soundUrl) {
  //   console.log("Loading Sound");
  //   let theSound;
  //   if (soundUrl == "endTime") {
  //     const { sound } = await Audio.Sound.createAsync(
  //       require("../../assets/sound/endTime.wav")
  //     );
  //     theSound = sound;
  //   } else {
  //     const { sound } = await Audio.Sound.createAsync(
  //       require("../../assets/sound/notification.wav")
  //     );
  //     theSound = sound;
  //   }
  //   console.log(theSound, "444444444");

  //   setSound(theSound);
  //   await sound.playAsync();
  // }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // async function playSound(path) {
  //   const sound = new Audio.Sound();
  //   try {
  //     await sound.loadAsync(require(path));
  //     await sound.playAsync();
  //   } catch (error) {
  //     console.error("Error playing sound:", error);
  //   }
  // }

  const userCheck = (user, route) => {
    if (!user?.type && !notAuth.includes(route)) {
      router.push("/MainInfoScreen");
    } else if (user?.type && notAuth.includes(route)) {
      user?.type == "employee"
        ? router.push("/EmployeeProfileScreen")
        : router.push("/OwnerProfileScreen");
    }
  };

  const realRoute = routes[0].name.split("/")[1];
  useEffect(() => {
    (async () => {
      const logout = await getData("logout");

      if (logout == "true") {
        router.push("/LoginScreen");
        return;
      }
      const userId = await getData("userId");

      if (userId && realRoute) {
        if (!user?.email) {
          const userInfo = await getUserInfo(userId);
          if (userInfo) {
            console.log(userInfo.data, "userInfo.data");

            dispatch(setStoredUser(userInfo.data));

            userCheck(userInfo.data, realRoute);
            userInfo.data.token &&
              (await saveData("token", userInfo.data.token));
          }
        } else {
          userCheck(user, realRoute);
        }
        // } else {
        //   if (user?.type) {
        //     user?.type == "employee"
        //       ? router.push("/EmployeeProfileScreen")
        //       : router.push("/OwnerProfileScreen");
        // } else if (!notAuth.includes(realRoute)) {
        //   router.push("/LoginScreen");
        // }
      }
    })();
  }, [currentToken]);

  const myNotification = async () => {
    const response = await getNotificationCount(user.id);
    dispatch(setUnReadCount(response.data.count));
  };
  useEffect(() => {
    (async () => {
      if (user?.type) {
        await myNotification();
        const newSocket = io(`${BACKEND_URL}/`, {
          transports: ["websocket"],
        });

        newSocket.on(user?.id, async (data) => {
          // await playSound("notification");
          // await scheduleNotification("title", "body");
          // Alert.alert("title", "body");
          // console.log("xxxxxxxxxxxxxxxxxxxxx");

          if (data.message == "Session_end") {
            await playSound("endTime");
            setNewNote(data.message);
          } else {
            dispatch(setStoredLastNotification(data));
            await myNotification();
            setNewNote("You_have_new_notification");

            setTimeout(() => {
              setNewNote("");
            }, 2000);
          }
        });
        return () => newSocket.disconnect();
      }
    })();
  }, [user?.type]);

  useEffect(() => {
    (async () => {
      if (backToLogin == true) {
        // await removeData("token");
        // await removeData("userId");
        // router.push("/LoginScreen");
      }
    })();
  }, [backToLogin]);
  // useEffect(() => {
  //   (async () => {
  //     await playSound("notification");
  //     await scheduleNotification("title", "body");
  //   })();
  // }, []);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      console.log("kkkkkkkkkkkkkk000000");
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("kkkkkkkkkkkkkk0000001");
      if (status !== "granted") {
        alert("You need to enable permissions for notifications!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("kkkkkkkkkkkkkk0000002", token);
      console.log("Push token:", token);

      // Send the token to your backend server
      const response = await expoRegister({ token });
      console.log(response, "kkkkkkkkkkkkkk");
    };

    registerForPushNotifications();
  }, []);
  return (
    <I18nextProvider>
      {preloader && <Loading />}

      {newNote && (
        <View style={{ direction: i18n.dir() }}>
          <Note visible={!!newNote} title={t(newNote)} />
        </View>
      )}

      <View
        style={{
          ...styles.wrapperContainer,
          writingDirection: i18n.dir(),
        }}
      >
        {user?.type && (
          <View style={styles.header}>
            <Header userName={user.username} />
          </View>
        )}
        {first && user?.type && (
          <View style={styles.drawerContainer}>
            <Animated.View
              style={[
                styles.drawer,
                {
                  height: height,
                },
              ]}
            >
              <MainDrawer />
            </Animated.View>
          </View>
        )}
        {(user?.type || notAuth.includes(realRoute) || backToLogin) && (
          <View style={styles.childrenContainer}>{children}</View>
        )}
      </View>
    </I18nextProvider>
  );
}

function themeStyles(theme, isRTL) {
  return StyleSheet.create({
    wrapperContainer: {
      flex: 1,
      writingDirection: isRTL ? "rtl" : "ltr",
      fontFamily:
        "-apple-system, BlinkMacSystemFont,  Roboto, Helvetica, Arial, sans-serif",
    },
    header: {
      zIndex: 10,
    },
    drawerContainer: {
      width: "100%",
      zIndex: 1,
    },
    drawer: {
      width: "100%",
      backgroundColor: theme.colors.background,
      overflow: "hidden", // Ensures content is hidden when height is reduced
    },
    childrenContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors.elevation.level3,
    },
  });
}

export default Wrapper;
