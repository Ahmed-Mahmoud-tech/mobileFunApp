import { useEffect, useMemo, useState } from "react"
import Header from "@/components/Header/Header"
import MainDrawer from "@/components/MainDrawer/MainDrawer"
import * as Linking from "expo-linking"
// import { Stack, useNavigation } from "expo-router"

import { Alert, Animated, StyleSheet, View } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "react-native-paper"
import { I18nextProvider, useTranslation } from "react-i18next"
import i18n from "../Translation/i18n"
import { getData, saveData } from "@/common/localStorage"
import useRequest from "@/axios/useRequest"
import { setStoredUser } from "@/store/slices/user"
import { useFocusEffect, useRootNavigationState, useRouter } from "expo-router"
import { changeRoute } from "@/store/slices/mainConfig"

function Wrapper({ children }) {
  const router = useRouter()
  // const navigation = useNavigation()
  const { routes } = useRootNavigationState()
  const dispatch = useDispatch()
  const { getUserInfo } = useRequest()
  const theme = useTheme()
  const styles = themeStyles(theme)
  const [first, setFirst] = useState(false)
  const menuStatus = useSelector((state) => state.mainConfig.menuStatus)
  const route = useSelector((state) => state.mainConfig.route)
  const user = useSelector((state) => state.user.userInfo)
  const currentToken = useSelector((state) => state.user.currentToken)

  // Initialize height with an animated value
  const height = useMemo(() => new Animated.Value(0), []) // Start with height of 0

  // Function to animate the height value
  const animateHeight = () => {
    Animated.timing(height, {
      toValue: menuStatus ? 0 : 300, // Toggle between 0 (hidden) and 300 (expanded height)
      duration: first ? 500 : 0, // Animation duration
      useNativeDriver: false, // Cannot use native driver for `height`
    }).start()
    setFirst(true)
  }

  // Trigger animation on menuStatus change
  useEffect(() => {
    animateHeight()
  }, [menuStatus])

  const url = Linking.useURL()
  const { hostname, path, queryParams } = Linking.parse(url)

  // if (url) {
  //   const { hostname, path, queryParams } = Linking.parse(url)
  //   Alert.alert(
  //     `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
  //       queryParams
  //     )}`
  //   )

  const notAuth = ["LoginScreen", "MainInfoScreen"]

  const userCheck = (user, route) => {
    if (!user?.type && !notAuth.includes(route)) {
      router.push("/MainInfoScreen")
    } else if (user?.type && notAuth.includes(route)) {
      user?.type == "employee"
        ? router.push("/EmployeeProfileScreen")
        : router.push("/OwnerProfileScreen")
    }
  }

  useEffect(() => {
    !route && dispatch(changeRoute(path))
    const realRoute = routes[0].name.split("/")[1]
    ;(async () => {
      const localToken = await getData("token")
      const userId = await getData("userId")
      // console.log(
      //   realRoute,
      //   user,
      //   "999999999999999999",
      //   userId,
      //   !user && userId,
      //   route,
      //   path
      // )
      if ((queryParams.token || localToken) && (route || realRoute)) {
        console.log("000000000000000000000")
        if (!user && userId) {
          const userInfo = await getUserInfo(userId)
          if (userInfo) {
            dispatch(setStoredUser(userInfo.data))
            userCheck(userInfo.data, path)
            userInfo.data.token && saveData("token", userInfo.data.token)
          } else {
            // if ((route || realRoute) != "LoginScreen") {
            //   dispatch(changeRoute("LoginScreen"))
            //   router.push("/LoginScreen")
            // }
          }
        } else {
          userCheck(user, path)
        }
      } else {
        // route && path != "LoginScreen" && router.push("/LoginScreen")
      }
      // console.log(
      //   route,
      //   "0000000000000000",
      //   navigation.getCurrentRoute().name.split("/")[1]
      // )
    })()
  }, [user, route, currentToken])

  return (
    <I18nextProvider i18n={i18n}>
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
                  height: height, // Apply animated height value
                },
              ]}
            >
              <MainDrawer />
            </Animated.View>
          </View>
        )}
        {console.log(
          route,
          "4564656",
          path,
          user?.type || notAuth.includes(path)
        )}
        {(user?.type || notAuth.includes(route || path)) && (
          <View style={styles.childrenContainer}>{children}</View>
        )}
      </View>
    </I18nextProvider>
  )
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
  })
}

export default Wrapper
