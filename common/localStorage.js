const {
  default: AsyncStorage,
} = require("@react-native-async-storage/async-storage")

export const getData = async (key, setState) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      // console.log("Retrieved value:", value)
      setState && setState(value)
      return value
    } else {
      // console.log(`No value found for key: ${key}`)
      return null // Explicitly return null for clarity
    }
  } catch (error) {
    console.error("Error retrieving data:", error)
  }
}

export const saveData = async (key, value, setState) => {
  try {
    await AsyncStorage.setItem(key, value)
    setState && setState(value)
    // console.log("Data saved successfully")
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
    // console.log("Data removed successfully")
  } catch (error) {
    console.error("Error removing data:", error)
  }
}
