import { Tabs } from "expo-router";
import { Text } from "react-native";

import { EXPO_ROUTE_SEGMENTS } from "../../src/app-shell/expo-router-contract";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#f5f2eb"
        },
        tabBarStyle: {
          backgroundColor: "#fffdf9",
          borderTopColor: "#ebe5dc"
        }
      }}
    >
      <Tabs.Screen
        name={EXPO_ROUTE_SEGMENTS.today}
        options={{
          title: "오늘",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18, fontWeight: "700" }}>◷</Text>
        }}
      />
      <Tabs.Screen
        name={EXPO_ROUTE_SEGMENTS.motivation}
        options={{
          title: "동기",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18, fontWeight: "700" }}>✦</Text>
        }}
      />
    </Tabs>
  );
}
