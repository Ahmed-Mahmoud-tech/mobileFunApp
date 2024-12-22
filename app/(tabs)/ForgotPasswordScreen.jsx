import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { TextInput, Button, useTheme, Text } from "react-native-paper"
import { useRouter } from "expo-router"

const ForgotPasswordScreen = () => {
  const theme = useTheme()
  const styles = themeStyles(theme)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleResetPassword = () => {
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.")
      return
    }

    setLoading(true)

    // Simulate password reset API call
    setTimeout(() => {
      setLoading(false)
      setMessage("If this email exists, a reset link has been sent!")
    }, 2000)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address, and we'll send you a link to reset your
        password.
      </Text>

      {/* Email Input */}
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Reset Password Button */}
      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        disabled={!email}
        style={styles.button}
      >
        Send Reset Link
      </Button>

      {/* Success/Error Message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Back to Login Link */}
      <Text style={styles.backLink} onPress={() => router.push("/login")}>
        Back to Login
      </Text>
    </View>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.elevation.level3,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: theme.colors.onBackground,
    },
    input: {
      marginBottom: 20,
    },
    button: {
      marginTop: 10,
    },
    message: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 14,
      color: theme.colors.error,
    },
    backLink: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 14,
      color: theme.colors.onSecondaryContainer,
      // textDecorationLine: "underline",
    },
  })
}
export default ForgotPasswordScreen
