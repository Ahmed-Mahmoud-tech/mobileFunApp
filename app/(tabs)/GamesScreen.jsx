import React, { useEffect, useState } from "react";
import useRequest from "@/axios/useRequest";
import Popup from "@/components/Popup/Popup";
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
import { useTranslation } from "react-i18next";

const GamesScreen = () => {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const theme = useTheme();
  const styles = themeStyles(theme);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameName, setGameName] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [multiPrice, setMultiPrice] = useState("");
  const [gameId, setGameId] = useState("");
  const [updateGameRender, setUpdateGameRender] = useState("");
  const [visible, setVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState();
  const [messageDescription, setMessageDescription] = useState();
  const [handleYes, setHandleYes] = useState(null);
  const [handleNo, setHandleNo] = useState(null);
  const [yesWord, setYesWord] = useState(t("yes"));
  const [noWord, setNoWord] = useState(t("no"));

  const user = useSelector((state) => state.user.userInfo);

  const { postGame, getGames, updateGame, deleteGame } = useRequest();

  const openDialog = (game = null) => {
    setCurrentGame(game);
    if (game) {
      setGameName(game.name);
      setSinglePrice(game.singlePrice.toString());
      setMultiPrice(game.multiPrice.toString());
    } else {
      setGameName("");
      setSinglePrice("");
      setMultiPrice("");
    }
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setGameName("");
    setSinglePrice("");
    setMultiPrice("");
  };

  const handleSave = async () => {
    const newGame = {
      name: gameName,
      singlePrice: singlePrice,
      multiPrice: multiPrice,
    };

    if (currentGame) {
      await updateGame(currentGame.id, { ...currentGame, ...newGame });
    } else {
      await postGame(newGame);
    }

    setUpdateGameRender(updateGameRender + 1);
    closeDialog();
  };

  useEffect(() => {
    (async () => {
      const data = await getGames();
      setGames(data.data);
    })();
  }, [updateGameRender]);

  const confirmDeleteGame = async (id) => {
    await deleteGame(id);
    setVisible(false);
    setUpdateGameRender(updateGameRender + 1);
  };

  const handleRemoveGame = (id) => {
    setHandleYes(() => () => confirmDeleteGame(id));
    setHandleNo(() => () => setVisible(false));
    setMessageTitle(t("confirm"));
    setMessageDescription(t("confirm_delete_game"));
    setYesWord(t("confirm"));
    setNoWord(t("no"));
    setVisible(true);
  };

  const renderGame = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.gameName}>{item.name}</Text>
        <Text style={{ marginBottom: 5 }}>
          {t("single_price")}: ${item.singlePrice}
        </Text>
        <Text style={{ marginBottom: 5 }}>
          {t("multi_price")}: ${item.multiPrice}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.gameActions}>
          <IconButton
            icon="pencil"
            onPress={() => {
              openDialog(item);
            }}
          />
          <IconButton icon="delete" onPress={() => handleRemoveGame(item.id)} />
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
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("no_games_added_yet")}</Text>
        }
      />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>
            {currentGame ? t("edit_game") : t("add_game")}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t("game_name")}
              value={gameName}
              onChangeText={setGameName}
              style={styles.input}
            />
            <TextInput
              label={t("single_price")}
              value={singlePrice}
              onChangeText={setSinglePrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label={t("multi_price")}
              value={multiPrice}
              onChangeText={setMultiPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>{t("cancel")}</Button>
            <Button
              onPress={handleSave}
              disabled={!gameName || !singlePrice || !multiPrice}
            >
              {t("save")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openDialog()}
        label={t("add_game")}
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
    gameName: {
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
      color: theme.colors.onBackground,
    },
    gameActions: {
      flexDirection: "row",
      alignGames: "center",
    },
  });
}
export default GamesScreen;
