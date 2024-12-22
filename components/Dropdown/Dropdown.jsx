import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native"
import { Text, useTheme } from "react-native-paper"

const Dropdown = ({ data, onSelect, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false) // Controls dropdown visibility
  const [selectedItem, setSelectedItem] = useState(null) // Stores the selected item
  const theme = useTheme()
  const styles = themeStyles(theme)
  // Function to toggle visibility of the dropdown
  const toggleDropdown = () => setIsVisible(!isVisible)

  // Function to handle selection of an item
  const handleSelectItem = (item) => {
    setSelectedItem(data[item]) // Set the selected item
    setIsVisible(false) // Close the dropdown
    if (onSelect) {
      onSelect(item) // Pass the selected item to the parent component
    }
  }

  // Function to render each dropdown item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectItem(item)}
      style={styles.item}
    >
      <Text style={styles.itemText}>{data[item]}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Dropdown button */}
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={styles.buttonText}>
          {selectedItem ? selectedItem : placeholder || "Select an option"}
        </Text>
      </TouchableOpacity>

      {/* Modal for dropdown options */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)} // Close modal on request close
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={Object.keys(data)}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    dropdownButton: {
      padding: 10,
      marginTop: 10,
      backgroundColor: theme.colors.elevation.level3,
      borderRadius: 0,
      alignItems: "center",
      width: "100%",
    },
    buttonText: {
      color: theme.colors.onSurfaceDisabled,
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.onSurfaceDisabled,
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      width: 200,
      maxHeight: 400,
      padding: 10,
    },
    item: {
      padding: 10,
    },
    itemText: {
      fontSize: 16,
    },
  })
}
export default Dropdown
