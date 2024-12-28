// import React, { useState } from "react"
// import { View, FlatList, StyleSheet } from "react-native"
// import { Button, Menu, TextInput } from "react-native-paper"

// const FilterableDropdown = ({ data, placeholder, onSelect }) => {
//   const [visible, setVisible] = useState(false)
//   const [filterText, setFilterText] = useState("")
//   const [selectedValue, setSelectedValue] = useState(null)

//   const filteredOptions = Object.values(data).filter((option) =>
//     option.toLowerCase().includes(filterText.toLowerCase())
//   )

//   return (
//     <View style={styles.container}>
//       <Button onPress={() => setVisible(true)} mode="outlined">
//         {selectedValue ? selectedValue : "Select an option"}
//       </Button>
//       {visible && (
//         <View style={styles.dropdownContainer}>
//           <TextInput
//             placeholder={placeholder}
//             style={styles.input}
//             value={filterText}
//             onChangeText={setFilterText}
//           />

//           <FlatList
//             data={filteredOptions}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <Menu.Item
//                 onPress={() => {
//                   setSelectedValue(item)
//                   setVisible(false)
//                   onSelect(item) // Call the onSelect function
//                 }}
//                 title={item}
//               />
//             )}
//           />
//         </View>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   dropdownContainer: {
//     position: "absolute",
//     top: 50,
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     elevation: 4,
//     borderRadius: 4,
//     maxHeight: 200,
//   },
//   input: {
//     marginBottom: 10,
//   },
// })

// export default FilterableDropdown

import React, { useState } from "react"
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { Button, Menu, TextInput } from "react-native-paper"

const FilterableDropdown = ({ data, placeholder, onSelect, value }) => {
  const [visible, setVisible] = useState(false)
  const [filterText, setFilterText] = useState("")

  const filteredOptions = data.filter((option) => {
    return option.name.toLowerCase().includes(filterText.toLowerCase())
  })

  const handleSelect = (item) => {
    setVisible(false)
    console.log(item, "00000000000000000000000name1")

    onSelect(item) // Call the onSelect function
  }

  const handleOverlayPress = () => {
    setVisible(false)
    setFilterText("") // Optionally clear the filter text
  }

  return (
    <View style={styles.container}>
      <Button onPress={() => setVisible(true)} mode="outlined">
        {value.name ? value.name : "Select an option"}
      </Button>

      {visible && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {visible && (
        <View style={styles.dropdownContainer}>
          <TextInput
            placeholder={placeholder}
            style={styles.input}
            value={filterText}
            onChangeText={setFilterText}
          />
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Menu.Item onPress={() => handleSelect(item)} title={item.name} />
            )}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: "relative",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    zIndex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 4,
    borderRadius: 4,
    maxHeight: 200,
    zIndex: 2,
  },
  input: {
    marginBottom: 10,
  },
})

export default FilterableDropdown
