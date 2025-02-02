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

function Wrapper({ children }) {
  const backToLogin = useSelector((state) => state.mainConfig.backToLogin);
  const preloader = useSelector((state) => state.mainConfig.preloader);
  const router = useRouter();
  const { routes } = useRootNavigationState();
  const dispatch = useDispatch();
  const { getUserInfo, getNotificationCount } = useRequest();
  const theme = useTheme();
  const [first, setFirst] = useState(false);
  const [newNote, setNewNote] = useState(false);
  const menuStatus = useSelector((state) => state.mainConfig.menuStatus);
  const user = useSelector((state) => state.user.userInfo);
  const currentToken = useSelector((state) => state.user.currentToken);
  const { t, i18n } = useTranslation();
  const styles = themeStyles(theme, i18n.language === "ar");

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

  const userCheck = (user, route) => {
    if (!user?.type && !notAuth.includes(route)) {
      // Alert.alert("Error7");
      router.push("/MainInfoScreen");
    } else if (user?.type && notAuth.includes(route)) {
      // Alert.alert(user?.type, "Error8", notAuth.includes(route));
      user?.type == "employee"
        ? router.push("/EmployeeProfileScreen")
        : router.push("/OwnerProfileScreen");
      // } else {
      //   Alert.alert("Error9");
    }
  };

  const realRoute = routes[0].name.split("/")[1];
  useEffect(() => {
    (async () => {
      const userId = await getData("userId");

      if (userId && realRoute) {
        if (!user?.email) {
          const userInfo = await getUserInfo(userId);
          if (userInfo) {
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
  }, [currentToken, realRoute, user?.type]);

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
          dispatch(setStoredLastNotification(data));
          await myNotification();
          setNewNote(true);
          setTimeout(() => {
            setNewNote(false);
          }, 2000);
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

  return (
    <I18nextProvider>
      {preloader && <Loading />}
      {<Note visible={newNote} title={t("You_have_new_notification")} />}
      <View style={{ ...styles.wrapperContainer, direction: i18n.dir() }}>
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
      direction: isRTL ? "rtl" : "ltr",
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
