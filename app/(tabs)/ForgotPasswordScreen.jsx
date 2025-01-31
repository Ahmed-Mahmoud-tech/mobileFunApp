import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button, useTheme, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = themeStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = () => {
    if (!email.includes("@")) {
      setMessage(t("please_enter_valid_email"));
      return;
    }

    setLoading(true);

    // Simulate password reset API call
    setTimeout(() => {
      setLoading(false);
      setMessage(t("reset_link_sent"));
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("forgot_password")}</Text>
      <Text style={styles.subtitle}>{t("enter_email_reset_password")}</Text>

      {/* Email Input */}
      <TextInput
        label={t("email_address")}
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
        {t("send_reset_link")}
      </Button>

      {/* Success/Error Message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Back to Login Link */}
      <Text style={styles.backLink} onPress={() => router.push("/login")}>
        {t("back_to_login")}
      </Text>
    </View>
  );
};

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
  });
}
export default ForgotPasswordScreen;
