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
      return "기존 날짜 기록 복구";
    case "legacy-migrated":
      return "legacy today plans 마이그레이션";
    case "empty":
      return "빈 상태 초기화";
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
          <Text style={theme.eyebrow}>Expo App</Text>
          <Text style={theme.title}>앱 데이터를 불러오는 중</Text>
          <Text style={theme.subtitle}>
            저장된 날짜 기록, legacy today plans, 빈 상태 초기화 순서로 앱 시작 경로를
            준비합니다.
          </Text>
        </View>
        <View style={theme.surfaceCard}>
          <ActivityIndicator color="#f07c61" />
          <Text style={theme.bodyText}>PlannerRecordMap 복구와 마이그레이션을 확인 중입니다.</Text>
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
          <Text style={theme.eyebrow}>Expo App</Text>
          <Text style={theme.title}>앱 시작 경로 오류</Text>
          <Text style={theme.subtitle}>
            preview seed 없이 실제 저장소 복구만으로 앱을 시작하려는 경로에서 오류가 발생했습니다.
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
          <Text style={theme.eyebrow}>Expo App</Text>
          <Text style={theme.title}>실제 앱 부트스트랩 경로</Text>
          <Text style={theme.subtitle}>
            preview seed 없이 저장된 날짜 기록과 migration 경로만으로 앱을 시작하는 실제 root
            셸입니다.
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
            <Text style={theme.sectionTitle}>부트스트랩 소스</Text>
            <Text style={theme.bodyText}>{getBootstrapSourceLabel(model.bootstrapSource)}</Text>
          </View>

          <View style={theme.surfaceCard}>
            <Text style={theme.sectionTitle}>현재 계획 연결</Text>
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
