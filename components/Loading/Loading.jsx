import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const Loading = ({ message = "Loading" }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = themeStyles(theme);
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={theme.colors.primary}
      />
      {message && <Text style={styles.message}>{t(message)}</Text>}
    </View>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

const themeStyles = (theme) =>
  StyleSheet.create({
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.elevation.level5,
      opacity: 0.8,
      zIndex: 1000, // Ensure it appears above other components
    },
    message: {
      marginTop: 20,
      fontSize: 18,
      color: theme.colors.secondary,
    },
  });

export default Loading;
