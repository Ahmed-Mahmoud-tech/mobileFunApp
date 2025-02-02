import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const CustomSegmentedButtons = ({ value, onValueChange, buttons }) => {
  const theme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <></>
        // <TouchableOpacity
        //   key={button.value}
        //   style={[
        //     styles.button,
        //     value === button.value && styles.selectedButton,
        //   ]}
        //   onPress={() => onValueChange(button.value)}
        // >
        //   <Text
        //     style={[
        //       styles.buttonText,
        //       value === button.value && styles.selectedButtonText,
        //     ]}
        //   >
        //     {button.label}
        //   </Text>
        // </TouchableOpacity>
      ))}
    </View>
  );
};

const themeStyles = (theme) =>
  StyleSheet.create({
    container: {
      //   flexDirection: "row-reverse",
      //   direction: "ltr",
      //   display: "none",
      //   borderRadius: 5,
      //   overflow: "hidden",
      //   borderWidth: 1,
      //   borderColor: theme.colors.primary,
    },
    button: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    selectedButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      color: theme.colors.text,
    },
    selectedButtonText: {
      color: theme.colors.onPrimary,
    },
  });

export default CustomSegmentedButtons;
