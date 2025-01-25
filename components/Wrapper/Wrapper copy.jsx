import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header/Header";
import MainDrawer from "@/components/MainDrawer/MainDrawer";
// import { Stack, useNavigation } from "expo-router"

import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "react-native-paper";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "../Translation/i18n";
import { getData, saveData } from "@/common/localStorage";
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
import { useCheckApiError } from "@/hooks/useCheckApiError";

function Wrapper({ children }) {
  // useCheckApiError();
  const router = useRouter();
  const backToLogin = useSelector((state) => state.mainConfig.backToLogin);

  // const backToLogin = useSelector((state) => state.mainConfig.backToLogin);
  // const router = useRouter();
  const { routes } = useRootNavigationState();
  const dispatch = useDispatch();
  const { getUserInfo, getNotificationCount } = useRequest();
  const theme = useTheme();
  const styles = themeStyles(theme);
  const [first, setFirst] = useState(false);
  const [newNote, setNewNote] = useState(false);
  const menuStatus = useSelector((state) => state.mainConfig.menuStatus);
  const user = useSelector((state) => state.user.userInfo);
  const currentToken = useSelector((state) => state.user.currentToken);
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
      router.push("/MainInfoScreen");
    } else if (user?.type && notAuth.includes(route)) {
      user?.type == "employee"
        ? router.push("/EmployeeProfileScreen")
        : router.push("/OwnerProfileScreen");
    }
  };

  const realRoute = routes[0].name.split("/")[1];
  useEffect(() => {
    // const params = routes[0].params;
    // console.log(realRoute, "=====", params);
    // router.push("/ddd");

    (async () => {
      const userId = await getData("userId");
      if (userId) {
        if (!user?.email) {
          const userInfo = await getUserInfo(userId);
          console.log(userInfo, "userInfo");

          if (userInfo) {
            dispatch(setStoredUser(userInfo.data));
            userCheck(userInfo.data, realRoute);
            userInfo.data.token &&
              (await saveData("token", userInfo.data.token));
          }
        } else {
          userCheck(user, realRoute);
        }
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
          console.log(data, "6666666666666666666");

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

  // useEffect(() => {
  //   console.log("555555555555555555555599", backToLogin);
  //   // if (backToLogin == true) router.push("/LoginScreen");
  // }, [backToLogin]);

  return (
    <I18nextProvider i18n={i18n}>
      {<Note visible={newNote} title="You have new notification" />}
      <View style={styles.wrapperContainer}>
        {user?.type && (
          <View style={styles.header}>
            <Header userName={user.username} />
          </View>
        )}
        {first && (
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

function themeStyles(theme) {
  return StyleSheet.create({
    wrapperContainer: {
      flex: 1,
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
