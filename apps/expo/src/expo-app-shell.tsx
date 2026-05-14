import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useExpoTheme } from "./app-shell/expo-theme-provider";
import { FLOW_TABS, type ScreenKey } from "./app-shell/flow-tabs";
import { renderExpoPlannerScreen } from "./app-shell/expo-planner-screen-registry";
import { useExpoAppModel } from "./app-shell/use-expo-app-model";
import { useExpoPlannerFlow } from "./app-shell/use-expo-planner-flow";
import { ExpoFlowTabBar } from "./components/expo-flow-tab-bar";

function getBootstrapSourceLabel(source: "empty" | "legacy-migrated" | "records-restored" | null) {
  switch (source) {
    case "records-restored":
      return "저장된 계획을 불러왔습니다";
    case "legacy-migrated":
      return "이전 계획을 불러왔습니다";
    case "empty":
      return "저장된 계획이 없습니다";
    default:
      return "확인 중";
  }
}

export function ExpoAppShell() {
  const model = useExpoAppModel();
  const { theme } = useExpoTheme();
  const flow = useExpoPlannerFlow(model);
  const screen: ScreenKey = flow.currentScreen;
  const activeTab = useMemo(
    () => FLOW_TABS.find((tab) => tab.key === flow.activeTab) ?? FLOW_TABS[0],
    [flow.activeTab]
  );

  if (model.bootstrapStatus === "loading") {
    return (
      <SafeAreaView edges={["top"]} style={theme.appShellSafeArea}>
        <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>오늘 다 했니</Text>
          <Text style={theme.title}>앱 데이터를 불러오는 중</Text>
          <Text style={theme.subtitle}>
            저장된 계획과 회고 기록을 확인하고 있습니다. 잠시만 기다려 주세요.
          </Text>
        </View>
        <View style={theme.surfaceCard}>
          <ActivityIndicator color="#f07c61" />
          <Text style={theme.bodyText}>오늘 화면을 준비하고 있습니다.</Text>
        </View>
        </View>
      </SafeAreaView>
    );
  }

  if (model.bootstrapStatus === "error") {
    return (
      <SafeAreaView edges={["top"]} style={theme.appShellSafeArea}>
        <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>오늘 다 했니</Text>
          <Text style={theme.title}>앱을 시작하지 못했습니다</Text>
          <Text style={theme.subtitle}>
            저장된 계획을 불러오는 중 문제가 발생했습니다. 앱을 다시 열어 주세요.
          </Text>
        </View>
        <View style={theme.surfaceCard}>
          <Text style={theme.sectionTitle}>오류 내용</Text>
          <Text style={theme.bodyText}>{model.bootstrapError ?? "알 수 없는 오류"}</Text>
        </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={theme.appShellSafeArea}>
      <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>오늘 다 했니</Text>
          <Text style={theme.title}>오늘 계획</Text>
          <Text style={theme.subtitle}>
            오늘 할 일과 흐름을 한눈에 확인합니다.
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
            <Text style={theme.sectionTitle}>불러오기 상태</Text>
            <Text style={theme.bodyText}>{getBootstrapSourceLabel(model.bootstrapSource)}</Text>
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
