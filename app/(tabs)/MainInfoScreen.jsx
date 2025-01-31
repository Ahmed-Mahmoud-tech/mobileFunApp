import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Alert } from "react-native";
import * as Linking from "expo-linking";
import {
  TextInput,
  Button,
  Card,
  Switch,
  useTheme,
  Title,
  Text,
  IconButton,
} from "react-native-paper";
import { removeData, saveData } from "@/common/localStorage";
import useRequest from "@/axios/useRequest";
import { useTranslation } from "react-i18next";
import { useLogoutFun } from "@/hooks/useLogoutFun";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentToken, setStoredUser } from "@/store/slices/user";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const MainInfoScreen = ({}) => {
  const [phone, setPhone] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState("");
  const { t, i18n } = useTranslation();
  const logoutFun = useLogoutFun();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const styles = themeStyles(theme, i18n.language === "ar");
  const { googleLogOut, updateUser } = useRequest();
  const route = useRoute();
  const params = route.params;
  const user = useSelector((state) => state.user.userInfo);

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      phoneNumber: phone,
      type: isOwner ? "owner" : "employee",
      roomName,
      location: "location",
    };
    await updateUser(user.id, data);
    if (isOwner) {
      dispatch(setStoredUser({ ...user, type: "owner" }));
      router.push("/OwnerProfileScreen");
    } else {
      dispatch(setStoredUser({ ...user, type: "employee" }));
      router.push("/EmployeeProfileScreen");
    }
    setLoading(false);
  };

  //   const openMap = async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync()
  //     if (status !== "granted") {
  //       alert("Permission to access location was denied.")
  //       return
  //     }

  //     const userLocation = await Location.getCurrentPositionAsync({})
  //     setLocation({
  //       latitude: userLocation.coords.latitude,
  //       longitude: userLocation.coords.longitude,
  //     })

  //     setIsMapVisible(true)
  //   }

  //   const handleLocationSelect = (e) => {
  //     const { latitude, longitude } = e.nativeEvent.coordinate
  //     setLocation({ latitude, longitude })
  //   }

  const _handleLanguage = () => {
    i18n.language == "en"
      ? i18n.changeLanguage("ar")
      : i18n.changeLanguage("en");
  };

  useEffect(() => {
    if (params && params?.token) {
      // Alert.alert("Token", JSON.stringify(params?.token));
      console.log(params);
      saveData("token", params.token);
      saveData("userId", params.userId);
      dispatch(setCurrentToken(params.token));
    }
  }, [params?.token]);

  return (
    <View style={styles.container}>
      <IconButton
        icon="translate"
        size={24}
        onPress={_handleLanguage}
        style={styles.iconButton}
      />
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("required_info")}</Title>

          <TextInput
            label={t("phone_number")}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={15}
          />
          <View style={styles.switchContainer}>
            <Text>{t("owner")}</Text>
            <Switch value={isOwner} onValueChange={setIsOwner} />
          </View>

          {isOwner && (
            <>
              <TextInput
                label={t("room_name")}
                value={roomName}
                onChangeText={setRoomName}
                style={styles.input}
              />

              {/* Location Picker */}
              {/* <TouchableOpacity onPress={openMap} style={styles.mapPicker}>
                <Text style={styles.mapPickerText}>
                  {location
                    ? `Location: (${location.latitude.toFixed(
                        2
                      )}, ${location.longitude.toFixed(2)})`
                    : "Pick Location"}
                </Text>
              </TouchableOpacity> */}
            </>
          )}

          {/* submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={!phone || (isOwner && !roomName)}
            style={styles.button}
          >
            <Text>{t("submit")}</Text>
          </Button>

          {/* Links
          <View style={styles.linksContainer}>
            <TouchableOpacity
              onPress={() => router.push("/ForgetPasswordScreen")}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
              <Text style={styles.linkText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View> */}
        </Card.Content>
      </Card>
      <Text
        onPress={() => {
          logoutFun();
        }}
        style={{
          ...styles.logoutText,
          // fontFamily:
          //   '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        }}
      >
        {t("logout")}
      </Text>
      {/* Map Modal */}
      {/* <Modal visible={isMapVisible} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location ? location.latitude : 37.7749,
            longitude: location ? location.longitude : -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleLocationSelect}
        >
          {location && (
            <Marker
              draggable
              coordinate={location}
              onDragEnd={handleLocationSelect} // Allow dragging to change location
            />
          )}
        </MapView>
        <Button
          mode="text"
          onPress={() => setIsMapVisible(false)}
          style={{ marginBottom: 10 }}
        >
          <Text>Confirm Location</Text>
        </Button>
      </Modal> */}
    </View>
  );
};

function themeStyles(theme, isRTL) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: theme.colors.elevation.level3,
      padding: 20,
    },
    card: {
      padding: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    input: {
      marginBottom: 15,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    mapPicker: {
      padding: 15,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 5,
      marginBottom: 15,
    },
    mapPickerText: {
      textAlign: "center",
      color: theme.colors.onPrimaryContainer,
    },
    button: {
      marginTop: 10,
    },
    linksContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    linkText: {
      marginTop: 10,
    },
    logoutText: {
      marginTop: 25,
      marginStart: "auto",
      fontWeight: "bold",
      fontSize: 15,
      color: theme.colors.onPrimaryContainer,
      textAlign: isRTL ? "right" : "left",
    },
  });
}

export default MainInfoScreen;
