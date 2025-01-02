import useRequest from "@/axios/useRequest"
import Popup from "@/components/Popup/Popup"
import React, { useEffect, useState } from "react"
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
  IconButton,
} from "react-native-paper"
import { useSelector } from "react-redux"

const PurchaseItemsScreen = () => {
  const [items, setItems] = useState([])
  const theme = useTheme()
  const styles = themeStyles(theme)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [itemName, setItemName] = useState("")
  const [updateItemRender, setUpdateItemRender] = useState("")
  const [visible, setVisible] = useState(false)
  const [price, setPrice] = useState("")
  const [messageTitle, setMessageTitle] = useState()
  const [messageDescription, setMessageDescription] = useState()
  const [handleYes, setHandleYes] = useState(null)
  const [handleNo, setHandleNo] = useState(null)
  const [yesWord, setYesWord] = useState("Yes")
  const [noWord, setNoWord] = useState("No")

  const { postItem, getItems, updateItem, deleteItem } = useRequest()

  const user = useSelector((state) => state.user.userInfo)

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

  const handleSave = async () => {
    const newItem = {
      name: itemName,
      price: price,
      ownerId: user.type == "owner" ? user.id : user.owner,
    }
    if (currentItem) {
      await updateItem(currentItem.id, { ...currentItem, ...newItem })
    } else {
      await postItem(newItem)
    }

    setUpdateItemRender(updateItemRender + 1)
    closeDialog()
  }

  useEffect(() => {
    ;(async () => {
      const data = await getItems()
      // const data = await getItems(user.type == "owner" ? user.id : user.owner)
      setItems(data.data)
    })()
  }, [updateItemRender])

  const confirmDeleteItem = async (id) => {
    await deleteItem(id)
    setVisible(false)
    setUpdateItemRender(updateItemRender + 1)
  }

  const handleRemoveItem = (id) => {
    setHandleYes(() => () => confirmDeleteItem(id))
    setHandleNo(() => () => setVisible(false))
    setMessageTitle("Confirm")
    setMessageDescription("Are you sure you want to delete this item?")
    setYesWord("Confirm")
    setNoWord("No")
    setVisible(true)
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Price: {item.price}</Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.itemActions}>
          <IconButton
            icon="pencil"
            onPress={() => {
              openDialog(item)
            }}
          />
          <IconButton icon="delete" onPress={() => handleRemoveItem(item.id)} />
        </View>
      </Card.Actions>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Popup
        title={messageTitle}
        description={messageDescription}
        handleYes={handleYes}
        handleNo={handleNo}
        visible={visible}
        yes={yesWord}
        no={noWord}
      />

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
    itemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
  })
}
export default PurchaseItemsScreen

// currentPurchase
// purchasesItem
