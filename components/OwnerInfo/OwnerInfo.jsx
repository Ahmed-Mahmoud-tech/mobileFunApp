import { StyleSheet, ScrollView, View, Alert, I18nManager } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  List,
  IconButton,
  Divider,
  useTheme,
  Checkbox,
  Chip,
} from "react-native-paper";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const OwnerInfo = ({ styles, updateUser }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userInfo);
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [name, setName] = useState(user?.username || "");
  const [placeName, setPlaceName] = useState(user?.placeName || "");
  const [location, setLocation] = useState(user?.location || "");

  const [editMode, setEditMode] = useState(false);

  const validateFields = () => {
    if (
      !phone.trim() ||
      !name.trim() ||
      !placeName.trim() ||
      !location.trim()
    ) {
      Alert.alert(t("Validation"), t("Please_fill_all_fields"));
      return false;
    }
    return true;
  };

  const handleEditToggle = () => {
    if (editMode) {
      if (!validateFields()) return;
      const data = {
        phoneNumber: phone,
        userName: name,
        placeName: placeName,
        location,
      };
      updateUser(user.id, data);
    }
    setEditMode(!editMode);
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={t("owner_profile")} />
      <Card.Content>
        {/* <Button
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
      )} */}

        <TextInput
          label={t("name")}
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={editMode}
          direction="rtl"
        />
        <TextInput
          label={t("phone")}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          editable={editMode}
        />
        <TextInput
          label={t("place_name")}
          value={placeName}
          onChangeText={setPlaceName}
          style={styles.input}
          editable={editMode}
        />
        <TextInput
          label={t("location")}
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          editable={editMode}
        />
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={handleEditToggle}
          style={styles.button}
        >
          {editMode ? t("Save") : t("Edit")}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default OwnerInfo;
