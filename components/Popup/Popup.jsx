import React from "react"
import { View } from "react-native"
import { Button, Dialog, Portal, Text } from "react-native-paper"

function Popup({
  title,
  description,
  handleYes,
  handleNo,
  visible,
  yes = "Yes",
  no = "No",
}) {
  console.log(handleYes, "This is the title")
  return (
    <View>
      <Portal>
        {/* <Dialog visible={visible} onDismiss={handleNo}> */}
        <Dialog visible={visible}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {handleNo && <Button onPress={handleNo}>{no}</Button>}
            <Button onPress={handleYes}>{yes}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default Popup
