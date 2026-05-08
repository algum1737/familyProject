import { SafeAreaView, StatusBar } from "react-native";

import { ExpoAppShell } from "./src/expo-app-shell";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#10131a" }}>
      <StatusBar barStyle="light-content" />
      <ExpoAppShell />
    </SafeAreaView>
  );
}
