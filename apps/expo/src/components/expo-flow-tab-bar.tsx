import { Pressable, Text, View } from "react-native";

import { useExpoTheme } from "../app-shell/expo-theme-provider";
import { APP_TABS, type AppTabKey } from "../app-shell/flow-tabs";

type ExpoFlowTabBarProps = {
  onSelect: (screen: AppTabKey) => void;
  screen: AppTabKey;
};

export function ExpoFlowTabBar({ onSelect, screen }: ExpoFlowTabBarProps) {
  const { theme } = useExpoTheme();

  return (
    <View style={theme.tabBar}>
      {APP_TABS.map((tab) => {
        const active = tab.key === screen;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[theme.tabButton, active ? theme.tabButtonActive : null]}
          >
            <View style={[theme.tabBadge, active ? theme.tabBadgeActive : null]}>
              <Text
                style={[
                  theme.tabBadgeText,
                  active ? theme.tabBadgeTextActive : null
                ]}
              >
                {tab.badge}
              </Text>
            </View>
            <Text style={[theme.tabLabel, active ? theme.tabLabelActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
