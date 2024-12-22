import React, { useState } from "react"
import { StyleSheet, ScrollView, View } from "react-native"
import { Colors } from "@/constants/Colors"
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  useTheme,
  HelperText,
} from "react-native-paper"

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const theme = useTheme()
  const styles = themeStyles(theme)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = () => {
    setLoading(true)
    setError("")

    // Simulate login API
    setTimeout(() => {
      setLoading(false)

      if (validateEmail(email)) {
        if (onLogin) {
          onLogin(email)
        }
      } else {
        setError("Invalid email address")
      }
    }, 1500)
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome Back!</Title>
          <Paragraph style={styles.subtitle}>
            Please sign in to continue
          </Paragraph>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={!!error}
            theme={{
              colors: {
                error: theme.error,
              },
            }}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
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
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 10,
    },
  })
}

export default LoginScreen
