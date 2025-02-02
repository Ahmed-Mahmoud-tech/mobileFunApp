import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

function Popup({
  title,
  description,
  handleYes,
  handleNo,
  visible,
  yes = "Yes",
  no = "No",
}) {
  const { t } = useTranslation();
  console.log(handleYes, "This is the title");
  return (
    <View>
      <Portal>
        {/* <Dialog visible={visible} onDismiss={handleNo}> */}
        <Dialog visible={visible}>
          <Dialog.Title>{t(title)}</Dialog.Title>
          <Dialog.Content>
            <Text>{t(description)}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {handleNo && <Button onPress={handleNo}>{t(no)}</Button>}
            <Button onPress={handleYes}>{t(yes)}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

export default Popup;
