import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

function Note({ title, visible }) {
  // const [visible, setVisible] = React.useState(false);

  // const onToggleSnackBar = () => setVisible(!visible);

  // const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      {/* <Button onPress={onToggleSnackBar}>{visible ? "Hide" : "Show"}</Button> */}
      <Snackbar
        visible={visible}
        // onDismiss={onDismissSnackBar}
        // action={{
        //   label: "Undo",
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
      >
        {title}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 100,
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
    zIndex: 1000,
  },
});

export default Note;
// import React, { useEffect } from "react";
// import { View } from "react-native";
// import { Snackbar, Text } from "react-native-paper";

// function Note({ title, visible, onDismiss }) {
//   useEffect(() => {
//     if (visible && typeof onDismiss === "function") {
//       const timer = setTimeout(() => {
//         onDismiss();
//       }, 15000); // Auto dismiss after 3 seconds
//       return () => clearTimeout(timer); // Cleanup the timer on unmount
//     }
//   }, [visible, onDismiss]);

//   return (
//     <View>
//       <Snackbar
//         visible={visible}
//         onDismiss={onDismiss}
//         duration={Snackbar.DURATION_SHORT}
//         style={{ backgroundColor: "black" }}
//       >
//         <Text style={{ color: "white" }}>{title}</Text>
//       </Snackbar>
//     </View>
//   );
// }

// export default Note;
