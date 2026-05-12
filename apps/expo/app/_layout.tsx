import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { EXPO_ROUTE_SEGMENTS } from "../src/app-shell/expo-router-contract";
import { ExpoRouterAppProvider } from "../src/app-shell/expo-router-app-provider";
import { ExpoThemeProvider, useExpoTheme } from "../src/app-shell/expo-theme-provider";

function ThemedRouterStack() {
  const { statusBarStyle } = useExpoTheme();

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <ExpoRouterAppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name={EXPO_ROUTE_SEGMENTS.tabsGroup} />
          <Stack.Screen
            name={EXPO_ROUTE_SEGMENTS.editor}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name={EXPO_ROUTE_SEGMENTS.reflection}
            options={{ presentation: "modal" }}
          />
        </Stack>
      </ExpoRouterAppProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ExpoThemeProvider>
        <ThemedRouterStack />
      </ExpoThemeProvider>
    </SafeAreaProvider>
  );
}
