import React, { useState } from "react"
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native"
import {
  TextInput,
  Button,
  Card,
  Switch,
  useTheme,
  Title,
  Text,
} from "react-native-paper"
// import MapView, { Marker } from "react-native-maps"
// import * as Location from "expo-location"
import { useRouter } from "expo-router"

const RegisterScreen = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [roomName, setRoomName] = useState("")
  //   const [location, setLocation] = useState(null) // Stores latitude and longitude
  //   const [isMapVisible, setIsMapVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const styles = themeStyles(theme)

  const handleRegister = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log({ email, password, isOwner, roomName }) //, location
      alert("Registered successfully!")
      // router.push("/login")
    }, 1500)
  }

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

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Register</Title>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          {/* Owner/Employee Switch */}
          <View style={styles.switchContainer}>
            <Text>Owner ? </Text>
            <Switch value={isOwner} onValueChange={setIsOwner} />
          </View>

          {/* Additional Fields for Owner */}
          {isOwner && (
            <>
              <TextInput
                label="Room Name"
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

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={
              !email || !password || (isOwner && !roomName) // || !location
            }
            style={styles.button}
          >
            Register
          </Button>

          {/* Links */}
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
          </View>
        </Card.Content>
      </Card>

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
          Confirm Location
        </Button>
      </Modal> */}
    </View>
  )
}

function themeStyles(theme) {
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
      color: theme.colors.onPrimaryContainer,
    },
  })
}

export default RegisterScreen
