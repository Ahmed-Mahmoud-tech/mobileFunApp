import React, { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { Button, Card, Text, Title, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { BACKEND_URL } from "@/constants/main";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getData } from "@/common/localStorage";
import { router } from "expo-router";

const LoginScreen = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userInfo);
  const currentToken = useSelector((state) => state.user.currentToken);
  const theme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const handleGoogleLogin = async () => {
    try {
      const url = `${BACKEND_URL}/api/auth/google`;
      // Open the authentication URL
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening Google login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("welcome_back")}</Title>

          {/* <Text>
            {token +
              "token" +
              userId +
              "userId" +
              JSON.stringify(user) +
              "userInfo" +
              currentToken}
          </Text> */}
          <Button
            onPress={() => handleGoogleLogin()}
            mode="contained"
            style={{ margin: 10 }}
          >
            {t("login_with_google")}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

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
  });
}

export default LoginScreen;
