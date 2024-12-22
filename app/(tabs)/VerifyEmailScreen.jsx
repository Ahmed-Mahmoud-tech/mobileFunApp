import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import {
  TextInput,
  Button,
  useTheme,
  Text,
  Paragraph,
} from "react-native-paper"
import { useRouter } from "expo-router"

const VerifyEmailScreen = () => {
  const router = useRouter()
  const [emailCode, setEmailCode] = useState("")
  const [resendTimer, setResendTimer] = useState(30)
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const styles = themeStyles(theme)

  // Start countdown for resend timer
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [resendTimer])

  const handleVerify = () => {
    setLoading(true)

    // Simulate verification API
    setTimeout(() => {
      setLoading(false)
      if (emailCode === "123456") {
        alert("Email verified successfully!")
        router.push("/dashboard") // Navigate to another screen on success
      } else {
        alert("Invalid verification code!")
      }
    }, 1500)
  }

  const handleResendCode = () => {
    if (resendTimer === 0) {
      setResendTimer(30) // Reset timer
      alert("A new verification code has been sent to your email!")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Paragraph style={styles.subtitle}>
        Please enter the 6-digit code sent to your email.
      </Paragraph>

      {/* Email Code Input */}
      <TextInput
        label="Verification Code"
        value={emailCode}
        onChangeText={setEmailCode}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
      />

      {/* Verify Button */}
      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        disabled={emailCode.length !== 6}
        style={styles.button}
      >
        Verify Code
      </Button>

      {/* Resend Code */}
      <Text style={styles.resendText}>
        Didn’t receive a code?{" "}
        <Text
          style={resendTimer === 0 ? styles.resendLink : styles.resendDisabled}
          onPress={handleResendCode}
          disabled={resendTimer !== 0}
        >
          Resend {resendTimer > 0 && `in ${resendTimer}s`}
        </Text>
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
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: theme.colors.secondary,
    },
    input: {
      marginBottom: 20,
    },
    button: {
      marginTop: 10,
    },
    resendText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 14,
    },
    resendLink: {
      color: theme.colors.secondary,
      textDecorationLine: "underline",
    },
    resendDisabled: {
      color: theme.colors.onSurfaceVariant,
    },
  })
}

export default VerifyEmailScreen
