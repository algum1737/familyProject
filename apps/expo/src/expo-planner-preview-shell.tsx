import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { renderExpoPlannerScreen } from "./app-shell/expo-planner-screen-registry";
import { FLOW_TABS, type ScreenKey } from "./app-shell/flow-tabs";
import { useExpoPlannerFlow } from "./app-shell/use-expo-planner-flow";
import { useExpoPlannerPreviewModel } from "./app-shell/use-expo-planner-preview-model";
import { useExpoTheme } from "./app-shell/expo-theme-provider";
import { ExpoFlowTabBar } from "./components/expo-flow-tab-bar";

export function ExpoPlannerPreviewShell() {
  const model = useExpoPlannerPreviewModel();
  const { theme } = useExpoTheme();
  const flow = useExpoPlannerFlow(model);
  const screen: ScreenKey = flow.currentScreen;
  const activeTab = useMemo(
    () => FLOW_TABS.find((tab) => tab.key === flow.activeTab) ?? FLOW_TABS[0],
    [flow.activeTab]
  );

  return (
    <SafeAreaView edges={["top"]} style={theme.appShellSafeArea}>
      <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>오늘 다 했니</Text>
          <Text style={theme.title}>오늘 계획 흐름</Text>
          <Text style={theme.subtitle}>
            오늘 할 일을 만들고, 놓친 일은 회고하거나 다시 지정할 수 있습니다.
          </Text>
          <View style={theme.activeChipRow}>
            <View style={theme.activeChip}>
              <Text style={theme.activeChipText}>ACTIVE</Text>
            </View>
            <Text style={theme.activeLabel}>{activeTab.label}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={theme.content} showsVerticalScrollIndicator={false}>
          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>오늘 할 일</Text>
            <Text style={theme.bodyText}>
              계획을 추가하면 오늘 화면과 월간 동기 화면에 바로 반영됩니다.
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>알림 준비</Text>
            <Text style={theme.bodyText}>
              시작 전 알림과 종료 전 확인을 받을 수 있습니다.
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>오늘 요약</Text>
            <Text style={theme.bodyText}>
              계획 {model.dailySummary?.plannedCount ?? 0}개 · 회고{" "}
              {model.dailySummary?.reflectionCount ?? 0}개
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>현재 리마인드</Text>
            <Text style={theme.bodyText}>
              시작 전 알림: {model.activeReminder?.title ?? "없음"}{"\n"}
              종료 전 확인: {model.activeEndRecoveryReminder?.title ?? "없음"}
            </Text>
          </View>

          {renderExpoPlannerScreen({ flow, model, screen })}
        </ScrollView>

        <ExpoFlowTabBar onSelect={flow.selectTab} screen={flow.activeTab} />
      </View>
    </SafeAreaView>
  );
}
