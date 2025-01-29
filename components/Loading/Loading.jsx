import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";

const Loading = ({ message }) => {
  const theme = useTheme();
  const styles = themeStyles(theme);
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={theme.colors.primary}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: "Loading...",
};

const themeStyles = (theme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      top: 0,
      position: "fixed",
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.elevation.level5,
      opacity: 0.8,
    },
    message: {
      marginTop: 20,
      fontSize: 18,
      color: theme.colors.text,
    },
  });

export default Loading;
