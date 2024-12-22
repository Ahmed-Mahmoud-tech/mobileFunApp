import { Stack, useNavigation } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import Wrapper from "@/components/Wrapper/Wrapper"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { store } from "@/store/store"
import { Provider } from "react-redux"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"

// const lightTheme = {
// colors: {
// backdrop: "rgba(50, 47, 55, 0.4)",
// background: "rgba(255, 251, 254, 1)",
// elevation: {
//   level0: "transparent",
//   level1: "rgb(247, 243, 249)",
//   level2: "rgb(243, 237, 246)",
//   level3: "rgb(238, 232, 244)",
//   level4: "rgb(236, 230, 243)",
//   level5: "rgb(233, 227, 241)",
// },
// error: "rgba(179, 38, 30, 1)",
// errorContainer: "rgba(249, 222, 220, 1)",
// inverseOnSurface: "rgba(244, 239, 244, 1)",
// inversePrimary: "rgba(208, 188, 255, 1)",
// inverseSurface: "rgba(49, 48, 51, 1)",
// onBackground: "rgba(28, 27, 31, 1)",
// onError: "rgba(255, 255, 255, 1)",
// onErrorContainer: "rgba(65, 14, 11, 1)",
// onPrimary: "rgba(255, 255, 255, 1)",
// onPrimaryContainer: "rgba(33, 0, 93, 1)",
// onSecondary: "rgba(255, 255, 255, 1)",
// onSecondaryContainer: "rgba(29, 25, 43, 1)",
// onSurface: "rgba(28, 27, 31, 1)",
// onSurfaceDisabled: "rgba(28, 27, 31, 0.38)",
// onSurfaceVariant: "rgba(73, 69, 79, 1)",
// onTertiary: "rgba(255, 255, 255, 1)",
// onTertiaryContainer: "rgba(49, 17, 29, 1)",
// outline: "rgba(121, 116, 126, 1)",
// outlineVariant: "rgba(202, 196, 208, 1)",
// primary: "rgba(103, 80, 164, 1)",
// primaryContainer: "rgba(234, 221, 255, 1)",
// scrim: "rgba(0, 0, 0, 1)",
// secondary: "rgba(98, 91, 113, 1)",
// secondaryContainer: "rgba(232, 222, 248, 1)",
// shadow: "rgba(0, 0, 0, 1)",
// surface: "rgba(255, 251, 254, 1)",
// surfaceDisabled: "rgba(28, 27, 31, 0.12)",
// surfaceVariant: "rgba(231, 224, 236, 1)",
// tertiary: "rgba(125, 82, 96, 1)",
// tertiaryContainer: "rgba(255, 216, 228, 1)",
// }

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Load fonts
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <PaperProvider>
      <Provider store={store}>
        <Wrapper>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </Wrapper>
      </Provider>
    </PaperProvider>
  )
}
