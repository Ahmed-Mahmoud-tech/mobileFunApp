import React, { useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import {
  TextInput,
  Button,
  Dialog,
  Portal,
  Card,
  FAB,
  Text,
  useTheme,
} from "react-native-paper"

const PurchaseItemsScreen = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", price: 20 },
    { id: 2, name: "Item 2", price: 30 },
  ])
  const theme = useTheme()
  const styles = themeStyles(theme)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")

  const openDialog = (item = null) => {
    setCurrentItem(item)
    if (item) {
      setItemName(item.name)
      setPrice(item.price.toString())
    } else {
      setItemName("")
      setPrice("")
    }
    setDialogVisible(true)
  }

  const closeDialog = () => {
    setDialogVisible(false)
    setItemName("")
    setPrice("")
  }

  const handleSave = () => {
    if (currentItem) {
      // Edit existing item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === currentItem.id
            ? { ...item, name: itemName, price: +price }
            : item
        )
      )
    } else {
      // Add new item
      const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name: itemName,
        price: +price,
      }
      setItems((prevItems) => [...prevItems, newItem])
    }
    closeDialog()
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Price: ${item.price}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openDialog(item)}>Edit</Button>
      </Card.Actions>
    </Card>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items added yet!</Text>
        }
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>{currentItem ? "Edit Item" : "Add Item"}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />
            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleSave} disabled={!itemName || !price}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openDialog()}
        label="Add Item"
      />
    </View>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.elevation.level3,
      paddingBottom: 80,
    },
    listContainer: {
      padding: 20,
    },
    card: {
      marginBottom: 15,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    input: {
      marginBottom: 15,
    },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#666",
    },
  })
}
export default PurchaseItemsScreen
