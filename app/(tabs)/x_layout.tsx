import { Tabs } from "expo-router"
import React from "react"
import { Platform, StyleSheet, View, Text } from "react-native"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarStyle: [
          Platform.select({
            ios: {
              position: "absolute", // Enables blur effect on iOS
              backgroundColor: "transparent",
            },
            android: {
              elevation: 10, // Adds shadow for Android
            },
          }),
          styles.tabBarStyle,
        ],
        headerShown: false,
      }}
    >
      <View style={styles.tabsContainer}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>📡</Text>
            ),
          }}
        />
      </View>
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    width: "100%",
    overflowX: "auto",
    height: 60,
    borderTopWidth: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent for light themes
  },
  tabIcon: {
    fontSize: 24,
    width: 100,
  },
  tabsContainer: {
    width: 1000,
  },
})
