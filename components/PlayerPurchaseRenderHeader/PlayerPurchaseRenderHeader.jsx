import { StyleSheet, View, TouchableOpacity } from "react-native"
import {
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  Text,
} from "react-native-paper"
// Render filters above the FlatList
const PlayerPurchaseRenderHeader = ({
  filters,
  setFilters,
  setDatePickerVisible,
}) => {
  const theme = useTheme()
  const styles = themeStyles(theme)

  const handleStatusFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }))
  }

  return (
    <View style={styles.filters}>
      <TextInput
        label="Player ID"
        value={filters.playerId}
        onChangeText={(text) =>
          setFilters((prev) => ({ ...prev, playerId: text }))
        }
        style={[styles.filterInput, styles.inputRow]}
      />
      <View style={[styles.filterInput, styles.inputRow]}>
        <SegmentedButtons
          value={filters.status}
          onValueChange={handleStatusFilterChange} // Update the status filter
          buttons={[
            {
              value: "all",
              label: "All",
              style: filters.status === "all" ? styles.selectedButton : {},
            },
            {
              value: "paid",
              label: "Paid",
              style: filters.status === "paid" ? styles.selectedButton : {},
            },
            {
              value: "notPaid",
              label: "Not Paid",
              style: filters.status === "notPaid" ? styles.selectedButton : {},
            },
          ]}
        />
      </View>
      <TouchableOpacity
        style={[styles.datePicker, styles.inputRow]}
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={styles.datePickerText}>{filters.createdAt}</Text>
      </TouchableOpacity>
      <Button
        mode="outlined"
        onPress={() =>
          setFilters({
            playerId: "",
            status: "all",
            createdAt: new Date().toDateString(),
          })
        }
        style={styles.resetButton}
      >
        Show All
      </Button>
    </View>
  )
}

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
  })
}

export default PlayerPurchaseRenderHeader
