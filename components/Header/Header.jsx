import React, { useState } from "react"
import { Appbar, Badge, Text, useTheme } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"
import { ChangeMenuStatus, changeRoute } from "@/store/slices/mainConfig"
import { Image, StyleSheet, View } from "react-native"
import { I18nextProvider, useTranslation } from "react-i18next"
import { useRouter } from "expo-router"

const Header = ({ userName }) => {
  const theme = useTheme()
  const styles = themeStyles(theme)
  const router = useRouter()

  const menuStatus = useSelector((state) => state.mainConfig.menuStatus)
  const dispatch = useDispatch()
  const menuChange = () => {
    dispatch(ChangeMenuStatus(!menuStatus))
  }
  const notificationPage = () => {
    router.push(`/NotificationScreen`)
    dispatch(changeRoute("NotificationScreen"))
  }

  const [notificationCount, setNotificationCount] = useState(3) // Example notification count
  const { t, i18n } = useTranslation()
  console.log(i18n)

  const _handleLanguage = () => {
    i18n.language == "en"
      ? i18n.changeLanguage("ar")
      : i18n.changeLanguage("en")
  }

  return (
    <Appbar.Header style={styles.container}>
      {/* <Appbar.Content title={t("welcome")} /> */}
      <Image source={require("@/assets/images/fun.png")} style={styles.logo} />

      <Appbar.Content title={userName} />
      <View>
        <Appbar.Action icon="bell" onPress={notificationPage} />
        {notificationCount > 0 && (
          <Badge size={16} style={styles.badge}>
            {notificationCount}
          </Badge>
        )}
      </View>
      <Appbar.Action icon="translate" onPress={_handleLanguage} />
      <Appbar.Action icon="dots-vertical" onPress={menuChange} />
    </Appbar.Header>
  )
}

export default Header

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.elevation.level1,
    },
    badge: {
      position: "absolute",
      top: 9,
      right: 9,
      backgroundColor: "red",
      color: "white",
    },
    logo: {
      width: 90, // Adjust the width as needed
      height: 40, // Adjust the height as needed
      marginRight: 20, // Add some space to the right of the logo
      marginLeft: 10,
    },
  })
}
