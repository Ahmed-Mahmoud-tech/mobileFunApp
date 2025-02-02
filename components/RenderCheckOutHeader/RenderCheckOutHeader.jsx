import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  Text,
} from "react-native-paper";
// Render filters above the FlatList
const RenderCheckOutHeader = ({ filters, setFilters, showDatePicker }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.filters}>
      <TextInput
        label={t("Player_ID")}
        value={filters.playerId}
        onChangeText={(value) =>
          setFilters((prev) => ({ ...prev, playerId: value }))
        }
        keyboardType="numeric"
        style={styles.input}
      />

      <SegmentedButtons
        value={filters.status}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, status: value }))
        }
        buttons={[
          {
            value: "paid",
            label: t("Paid"),
            style: filters.status === "Paid" ? styles.selectedButton : {},
          },
          {
            value: "notPaid",
            label: t("Not_Paid"),
            style: filters.status === "Not Paid" ? styles.selectedButton : {},
          },
          {
            value: "All",
            label: "All",
            style: filters.status === "All" ? styles.selectedButton : {},
          },
        ]}
        style={{ direction: "ltr" }}
      />

      <Button
        mode="outlined"
        onPress={showDatePicker}
        style={styles.datePicker}
      >
        {t("Filter_Day")}: {filters.day.toLocaleDateString()}
      </Button>
    </View>
  );
};

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.elevation.level3,
      padding: 10,
    },
    filters: {
      flexDirection: "column",
      padding: 10,
    },
    filterInput: {
      marginBottom: 10,
    },
    datePicker: {
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: 50,
      marginVertical: 10,
      justifyContent: "center",
    },
    datePickerText: {
      fontSize: 16,
      color: theme.colors.secondary,
    },
    listContainer: {
      paddingBottom: 100,
    },
    card: {
      marginBottom: 10,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    input: {
      marginBottom: 10,
    },
    inputRow: {
      marginBottom: 10,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 20,
    },
    itemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
}

export default RenderCheckOutHeader;
