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
          <Text style={theme.eyebrow}>Expo Runtime</Text>
          <Text style={theme.title}>실제 앱 런타임 뼈대</Text>
          <Text style={theme.subtitle}>
            브라우저 프리뷰 다음 단계로, React Native/Expo에서 같은 흐름을 실제 화면 계층으로
            옮길 준비를 시작합니다.
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
            <Text style={theme.sectionTitle}>현재 준비 상태</Text>
            <Text style={theme.bodyText}>
              Expo 앱은 이제 화면 파일과 provider 초안이 분리된 상태입니다. 다음 단계에서는
              공용 selector를 실제 React Native 화면과 연결하고, `AsyncStorage`와 로컬
              리마인드를 운영 흐름에 붙입니다.
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>연결된 provider 초안</Text>
            <Text style={theme.bodyText}>
              plans store: {model.plansStore.load.name || "async-load"}{"\n"}
              reminder provider: {model.reminderProvider.scheduleStartReminder.name || "schedule"}
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>공용 계산 연결</Text>
            <Text style={theme.bodyText}>
              daily summary: {model.dailySummary?.plannedCount ?? 0}개 계획 · 회고{" "}
              {model.dailySummary?.reflectionCount ?? 0}개
            </Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>현재 상태 전이</Text>
            <Text style={theme.bodyText}>
              recovery mode: {model.recoveryMode ?? "none"}{"\n"}
              active reminder: {model.activeReminder?.title ?? "없음"}{"\n"}
              active end recovery: {model.activeEndRecoveryReminder?.title ?? "없음"}{"\n"}
              overlay screen: {flow.overlayScreen ?? "none"}
            </Text>
          </View>

          {renderExpoPlannerScreen({ flow, model, screen })}
        </ScrollView>

        <ExpoFlowTabBar onSelect={flow.selectTab} screen={flow.activeTab} />
      </View>
    </SafeAreaView>
  );
}
