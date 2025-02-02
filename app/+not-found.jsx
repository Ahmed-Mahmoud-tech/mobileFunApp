import { Link, router, Stack, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Alert, DevSettings, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

export default function NotFoundScreen() {
  const user = useSelector((state) => state.user.userInfo);
  const theme = useTheme();
  const styles = themeStyles(theme);

  useEffect(() => {
    setTimeout(() => {
      router.push("/LoginScreen");
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.link}>not found</Text>
    </View>
  );
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.elevation.level3,
    },
    link: {
      color: theme.colors.onPrimaryContainer,
    },
  });
}
