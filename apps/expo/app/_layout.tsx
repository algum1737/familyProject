import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { EXPO_ROUTE_SEGMENTS } from "../src/app-shell/expo-router-contract";
import { ExpoRouterAppProvider } from "../src/app-shell/expo-router-app-provider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
