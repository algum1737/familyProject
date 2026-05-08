import { Pressable, Text, View } from "react-native";

import { expoTheme } from "../app-shell/expo-theme";
import { APP_TABS, type AppTabKey } from "../app-shell/flow-tabs";

type ExpoFlowTabBarProps = {
  onSelect: (screen: AppTabKey) => void;
  screen: AppTabKey;
};

export function ExpoFlowTabBar({ onSelect, screen }: ExpoFlowTabBarProps) {
  return (
    <View style={expoTheme.tabBar}>
      {APP_TABS.map((tab) => {
        const active = tab.key === screen;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[expoTheme.tabButton, active ? expoTheme.tabButtonActive : null]}
          >
            <View style={[expoTheme.tabBadge, active ? expoTheme.tabBadgeActive : null]}>
              <Text
                style={[
                  expoTheme.tabBadgeText,
                  active ? expoTheme.tabBadgeTextActive : null
                ]}
              >
                {tab.badge}
              </Text>
            </View>
            <Text style={[expoTheme.tabLabel, active ? expoTheme.tabLabelActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
