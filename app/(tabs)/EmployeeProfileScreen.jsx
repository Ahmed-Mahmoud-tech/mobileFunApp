import React, { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import {
  TextInput,
  Button,
  Text,
  Chip,
  Card,
  SegmentedButtons,
  useTheme,
} from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"

const EmployeeProfileScreen = () => {
  const [email, setEmail] = useState("employee@example.com")
  const [name, setName] = useState("John Doe")
  const [birthdate, setBirthdate] = useState(new Date())
  const [gender, setGender] = useState("Male")
  const [editMode, setEditMode] = useState(false)

  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleBirthdateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setBirthdate(selectedDate)
    }
  }

  const handleEditToggle = () => setEditMode(!editMode)
  const theme = useTheme()
  const styles = themeStyles(theme)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Personal Info Section */}
      <Card style={styles.card}>
        <Card.Title title="Personal Information" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            editable={editMode}
          />
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
            disabled={!editMode}
          >
            Birthdate: {birthdate.toLocaleDateString()}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={handleBirthdateChange}
            />
          )}
          <SegmentedButtons
            value={gender}
            onValueChange={setGender}
            buttons={[
              {
                value: "Male",
                label: "Male",
                style: gender === "Male" ? styles.selectedButton : {},
              },
              {
                value: "Female",
                label: "Female",
                style: gender === "Female" ? styles.selectedButton : {},
              },
            ]}
            disabled={!editMode}
            style={styles.segmentedButtons}
          />
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleEditToggle}
            style={styles.button}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  )
}

function themeStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.elevation.level3,
    },
    card: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
    },
    segmentedButtons: {
      marginBottom: 16,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
  })
}
export default EmployeeProfileScreen
