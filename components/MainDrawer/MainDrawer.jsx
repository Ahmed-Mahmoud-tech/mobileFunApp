import * as React from "react"
import { Drawer, useTheme } from "react-native-paper"
import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { changeRoute } from "@/store/slices/mainConfig"
import { useLogoutFun } from "@/hooks/useLogoutFun"
const MainDrawer = () => {
  const dispatch = useDispatch()

  const [active, setActive] = React.useState("")
  const theme = useTheme()
  const styles = themeStyles(theme)
  const router = useRouter()
  const logoutFun = useLogoutFun()

  const changeRouteFun = (route) => {
    dispatch(changeRoute(route))
    router.push(`/${route}`)
    setActive(route)
  }
  const user = useSelector((state) => state.user.userInfo)

  const employeeMenu = {
    EmployeeProfileScreen: (
      <Drawer.Item
        label="Employee Profile"
        active={active === "EmployeeProfileScreen"}
        onPress={() => {
          changeRouteFun("EmployeeProfileScreen")
        }}
      />
    ),
    PurchaseItemsScreen: (
      <Drawer.Item
        label="Purchases Items"
        active={active === "PurchaseItemsScreen"}
        onPress={() => {
          changeRouteFun("PurchaseItemsScreen")
        }}
      />
    ),
    PlayersPurchasesScreen: (
      <Drawer.Item
        label="Players Purchases"
        active={active === "PlayersPurchasesScreen"}
        onPress={() => {
          changeRouteFun("PlayersPurchasesScreen")
        }}
      />
    ),
    SessionScreen: (
      <Drawer.Item
        label="Session"
        active={active === "SessionScreen"}
        onPress={() => {
          changeRouteFun("SessionScreen")
        }}
      />
    ),
    CheckoutScreen: (
      <Drawer.Item
        label="Checkout"
        active={active === "CheckoutScreen"}
        onPress={() => {
          changeRouteFun("CheckoutScreen")
        }}
      />
    ),
    // Reservations: (
    //   <Drawer.Item
    //     label="Reservations"
    //     active={active === "ReservationsScreen"}
    //     onPress={() => {
    //       changeRouteFun("ReservationsScreen")
    //     }}
    //   />
    // ),
    LoginScreen: (
      <Drawer.Item
        label="Logout"
        active={active === "LoginScreen"}
        onPress={() => {
          logoutFun("LoginScreen")
        }}
      />
    ),
  }

  const realEmployeeMenu = {
    EmployeeProfileScreen: (
      <Drawer.Item
        label="Employee Profile"
        active={active === "EmployeeProfileScreen"}
        onPress={() => {
          changeRouteFun("EmployeeProfileScreen")
        }}
      />
    ),
    LoginScreen: (
      <Drawer.Item
        label="Logout"
        active={active === "LoginScreen"}
        onPress={() => {
          logoutFun("LoginScreen")
        }}
      />
    ),
  }

  const ownerMenu = {
    OwnerProfileScreen: (
      <Drawer.Item
        label="Owner Profile"
        active={active === "OwnerProfileScreen"}
        onPress={() => {
          changeRouteFun("OwnerProfileScreen")
        }}
      />
    ),
    PurchaseItemsScreen: (
      <Drawer.Item
        label="Purchases Items"
        active={active === "PurchaseItemsScreen"}
        onPress={() => {
          changeRouteFun("PurchaseItemsScreen")
        }}
      />
    ),
    PlayersPurchasesScreen: (
      <Drawer.Item
        label="Players Purchases"
        active={active === "PlayersPurchasesScreen"}
        onPress={() => {
          changeRouteFun("PlayersPurchasesScreen")
        }}
      />
    ),
    GamesScreen: (
      <Drawer.Item
        label="Games"
        active={active === "GamesScreen"}
        onPress={() => {
          changeRouteFun("GamesScreen")
        }}
      />
    ),
    SessionScreen: (
      <Drawer.Item
        label="Session"
        active={active === "SessionScreen"}
        onPress={() => {
          changeRouteFun("SessionScreen")
        }}
      />
    ),
    CheckoutScreen: (
      <Drawer.Item
        label="Checkout"
        active={active === "CheckoutScreen"}
        onPress={() => {
          changeRouteFun("CheckoutScreen")
        }}
      />
    ),
    // Reservations: (
    //   <Drawer.Item
    //     label="Reservations"
    //     active={active === "ReservationsScreen"}
    //     onPress={() => {
    //       changeRouteFun("ReservationsScreen")
    //     }}
    //   />
    // ),
    LoginScreen: (
      <Drawer.Item
        label="Logout"
        active={active === "LoginScreen"}
        onPress={() => {
          logoutFun("LoginScreen")
        }}
      />
    ),
  }

  const menu = {
    owner: ownerMenu,
    employee: employeeMenu,
    realEmployeeMenu,
  }

  return (
    <ScrollView style={styles.container}>
      <Drawer.Section>
        {user?.type &&
          Object.values(
            user.owner ? menu[user.type] : menu.realEmployeeMenu
          ).map((item, index) => <View key={index}>{item}</View>)}
        {/* <Drawer.Item
          label="Login"
          active={active === "LoginScreen"}
          onPress={() => {
            changeRouteFun("LoginScreen")
          }}
        />
        <Drawer.Item
          label="Main Info"
          active={active === "MainInfoScreen"}
          onPress={() => {
            changeRouteFun("MainInfoScreen")
          }}
        />
        <Drawer.Item
          label="Register"
          active={active === "RegisterScreen"}
          onPress={() => {
            changeRouteFun("RegisterScreen")
          }}
        />
        <Drawer.Item
          label="Verify Email Screen"
          active={active === "VerifyEmailScreen"}
          onPress={() => {
            changeRouteFun("VerifyEmailScreen")
          }}
        />
        <Drawer.Item
          label="Forgot Password"
          active={active === "ForgotPasswordScreen"}
          onPress={() => {
            changeRouteFun("ForgotPasswordScreen")
          }}
        /> */}

        {/* <Drawer.Item
          label="Notification"
          active={active === "NotificationScreen"}
          onPress={() => {
            changeRouteFun("NotificationScreen")
          }}
        /> */}
      </Drawer.Section>
    </ScrollView>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      paddingVertical: 10,
      backgroundColor: theme.colors.elevation.level2,
    },
  })
}

export default MainDrawer
