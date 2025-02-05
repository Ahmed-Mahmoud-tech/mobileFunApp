import { useTranslation } from "react-i18next";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  Text,
} from "react-native-paper";
// Render filters above the FlatList
const SessionRenderHeader = ({ filters, setFilters, showDatePicker }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = themeStyles(theme);

  return (
    <>
      <TextInput
        label={t("Player_ID")}
        value={filters.playerId}
        onChangeText={(value) =>
          setFilters((prev) => ({ ...prev, playerId: value }))
        }
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.filters}>
        <SegmentedButtons
          value={filters.sessionType}
          style={{ ...styles.input, direction: "ltr" }}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sessionType: value }))
          }
          buttons={[
            {
              value: "single",
              label: t("Single"),
              style:
                filters.sessionType === "Single" ? styles.selectedButton : {},
            },
            {
              value: "multi",
              label: t("Multi"),
              style:
                filters.sessionType === "Multi" ? styles.selectedButton : {},
            },
            {
              value: "All",
              label: t("All"),
              style: filters.sessionType === "All" ? styles.selectedButton : {},
            },
          ]}
        />
        <SegmentedButtons
          value={filters.status}
          style={{ ...styles.input, direction: "ltr" }}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
          buttons={[
            {
              value: "paid",
              label: t("Paid"),
              style: filters.status === "payed" ? styles.selectedButton : {},
            },
            {
              value: "notPaid",
              label: t("Not_Paid"),
              style: filters.status === "Not Paid" ? styles.selectedButton : {},
            },
            {
              value: "All",
              label: t("All"),
              style: filters.status === "All" ? styles.selectedButton : {},
            },
          ]}
        />

        <Button
          mode="outlined"
          onPress={() => showDatePicker("startDate")}
          style={styles.datePicker}
        >
          {t("Filter_Start_Date")}: {filters.startDate.toLocaleDateString()}
        </Button>
      </View>
    </>
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
      writingDirection: "ltr",
    },
    filterInput: {
      marginBottom: 10,
    },
    datePicker: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: 50,
      marginBottom: 10,
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

export default SessionRenderHeader;
