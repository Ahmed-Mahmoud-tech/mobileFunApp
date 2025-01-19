import React from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

function Note({ title, visible }) {
  return (
    <View>
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Title style={{ textAlign: "center", marginTop: 15 }}>
            {title}
          </Dialog.Title>
        </Dialog>
      </Portal>
    </View>
  );
}

export default Note;
