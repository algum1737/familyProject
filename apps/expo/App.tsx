import { SafeAreaView, StatusBar } from "react-native";

import { ExpoThemeProvider, useExpoTheme } from "./src/app-shell/expo-theme-provider";
import { ExpoAppShell } from "./src/expo-app-shell";

function ThemedExpoApp() {
  const { statusBarStyle, theme } = useExpoTheme();

  return (
    <SafeAreaView style={theme.appShellSafeArea}>
      <StatusBar barStyle={statusBarStyle} />
      <ExpoAppShell />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpoThemeProvider>
      <ThemedExpoApp />
    </ExpoThemeProvider>
  );
}
