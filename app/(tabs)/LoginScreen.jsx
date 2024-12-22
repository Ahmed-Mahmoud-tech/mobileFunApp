import React from "react"
import { Linking } from "react-native"
import { Button, Card, Title, useTheme } from "react-native-paper"

import { StyleSheet, View } from "react-native"
import { BACKEND_URL } from "@/constants/main"

const LoginScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)

  const handleGoogleLogin = async () => {
    try {
      const url = `${BACKEND_URL}/api/auth/google`
      // Open the authentication URL
      await Linking.openURL(url)
    } catch (error) {
      console.error("Error opening Google login:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome Back!</Title>
          {/* <Paragraph style={styles.subtitle}>
            Please sign in to continue
          </Paragraph> */}

          <Button
            onPress={() => handleGoogleLogin()}
            mode="contained"
            style={{ margin: 10 }}
          >
            Login with Google
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.elevation.level3,
      padding: 20,
    },
    card: {
      width: "100%",
      padding: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
      color: "gray",
    },
  })
}

export default LoginScreen
