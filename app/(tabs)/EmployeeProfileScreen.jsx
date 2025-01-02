import useRequest from "@/axios/useRequest"
import { saveData } from "@/common/localStorage"
import { utcToLocal } from "@/common/time"
import React, { useEffect, useState } from "react"
import { StyleSheet, ScrollView, View } from "react-native"
import {
  TextInput,
  Button,
  Card,
  useTheme,
  List,
  Text,
  Chip,
  IconButton,
} from "react-native-paper"
import { useSelector } from "react-redux"

const EmployeeProfileScreen = () => {
  const user = useSelector((state) => state.user.userInfo)
  const [name, setName] = useState(user.username || "")
  const [editMode, setEditMode] = useState(false)
  const [phone, setPhone] = useState(user.phoneNumber || "")
  const [ownerRequests, setOwnerRequests] = useState([])
  const [update, setUpdate] = useState(0)
  const { updateUser, getEmployeeRequest, updateRequest } = useRequest()

  const handleEditToggle = async () => {
    if (editMode == true) {
      const data = {
        phoneNumber: phone,
        username: name,
      }
      await updateUser(user.id, data)
    }
    setEditMode(!editMode)
  }

  const theme = useTheme()
  const styles = themeStyles(theme)

  const updateRequestAction = async (id, status, fromUser) => {
    const response = await updateRequest(id, { status, fromUser })
    saveData("token", response.data.token)
    setUpdate(update + 1)
  }

  useEffect(() => {
    ;(async () => {
      const data = await getEmployeeRequest()
      setOwnerRequests(data.data)
    })()
  }, [update])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Personal Info Section */}
      <Card style={styles.card}>
        <Card.Title title="Personal Information" />
        <Card.Content>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
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
            {editMode ? "Save" : "Open edit mode"}
          </Button>
        </Card.Actions>
      </Card>
      <Card>
        <Card.Content>
          {ownerRequests.length > 0 ? (
            ownerRequests.map((request) => (
              <List.Item
                key={request.id}
                title={request.fromUserInfo.username}
                description={
                  <>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        alignContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {request.fromUserInfo.phoneNumber}
                      </Text>
                      <Chip style={{ margin: 10, fontsize: 10 }}>
                        {request.status}
                      </Chip>
                    </View>
                    <View>
                      <Text>{utcToLocal(request.updatedAt)}</Text>
                    </View>
                  </>
                }
                right={() =>
                  request.status == "pending" ? (
                    <View style={styles.roomActions}>
                      <Button
                        mode="outlined"
                        onPress={() =>
                          updateRequestAction(
                            request.id,
                            "rejected",
                            request.fromUser
                          )
                        }
                        style={styles.button}
                      >
                        Reject
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() =>
                          updateRequestAction(
                            request.id,
                            "accepted",
                            request.fromUser
                          )
                        }
                        style={styles.button}
                      >
                        Accept
                      </Button>
                    </View>
                  ) : (
                    <></>
                  )
                }
              />
            ))
          ) : (
            <Text style={{ margin: 10 }}>No requests found.</Text>
          )}
        </Card.Content>
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
    // input: {
    //   marginBottom: 16,
    // },
    button: {
      marginTop: 8,
      marginInlineStart: 5,
    },
    segmentedButtons: {
      marginBottom: 16,
    },
    selectedButton: {
      backgroundColor: theme.colors.primaryContainer, // Active color
    },
    roomActions: {
      flexDirection: "row",
      alignItems: "center",
    },
  })
}
export default EmployeeProfileScreen
