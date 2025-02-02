import useRequest from "@/axios/useRequest";
import Popup from "@/components/Popup/Popup";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
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
} from "react-native-paper";
import { useSelector } from "react-redux";

const PurchaseItemsScreen = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const theme = useTheme();
  const styles = themeStyles(theme);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [updateItemRender, setUpdateItemRender] = useState("");
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [messageTitle, setMessageTitle] = useState();
  const [messageDescription, setMessageDescription] = useState();
  const [handleYes, setHandleYes] = useState(null);
  const [handleNo, setHandleNo] = useState(null);
  const [yesWord, setYesWord] = useState("Yes");
  const [noWord, setNoWord] = useState("No");

  const { postItem, getItems, updateItem, deleteItem } = useRequest();

  const user = useSelector((state) => state.user.userInfo);

  const openDialog = (item = null) => {
    setCurrentItem(item);
    if (item) {
      setItemName(item.name);
      setPrice(item.price.toString());
    } else {
      setItemName("");
      setPrice("");
    }
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setItemName("");
    setPrice("");
  };

  const handleSave = async () => {
    const newItem = {
      name: itemName,
      price: price,
      ownerId: user.owner,
      isFromEmployee: user.type,
      username: user.username,
    };
    if (currentItem) {
      await updateItem(currentItem.id, { ...currentItem, ...newItem });
    } else {
      await postItem(newItem);
    }

    setUpdateItemRender(updateItemRender + 1);
    closeDialog();
  };

  useEffect(() => {
    (async () => {
      const data = await getItems();
      setItems(data.data);
    })();
  }, [updateItemRender]);

  const confirmDeleteItem = async (item) => {
    console.log(item, "item");

    const query = `id=${item.id}&&ownerId=${user.owner}&&isFromEmployee=${
      user.type
    }&&username=${user.username}&&name=${item.name}&&price=${
      item.price
    }&&updatedAt=${new Date(item.updatedAt).toISOString()}`;
    await deleteItem(query);
    setVisible(false);
    setUpdateItemRender(updateItemRender + 1);
  };

  const handleRemoveItem = (item) => {
    setHandleYes(() => () => confirmDeleteItem(item));
    setHandleNo(() => () => setVisible(false));
    setMessageTitle("Confirm");
    setMessageDescription("Are_you_sure_you_want_to_delete_this_item");
    setYesWord("Confirm");
    setNoWord("No");
    setVisible(true);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>
          {t("Price")} : {item.price}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.itemActions}>
          <IconButton
            icon="pencil"
            onPress={() => {
              openDialog(item);
            }}
          />
          <IconButton icon="delete" onPress={() => handleRemoveItem(item)} />
        </View>
      </Card.Actions>
    </Card>
  );

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
          <Text style={styles.emptyText}>{t("No_items_added_yet")}</Text>
        }
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>
            {currentItem ? t("Edit_Item") : t("Add_Item")}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t("Item_Name")}
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />
            <TextInput
              label={t("Price")}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>{t("Cancel")}</Button>
            <Button onPress={handleSave} disabled={!itemName || !price}>
              {t("Save")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openDialog()}
        label={t("Add_Item")}
      />
    </View>
  );
};

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
  });
}
export default PurchaseItemsScreen;

// currentPurchase
// purchasesItem
