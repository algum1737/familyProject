import { ActivityIndicator, Text, View } from "react-native";
import { createContext, type ReactNode, useContext } from "react";

import { expoTheme } from "./expo-theme";
import { useExpoAppModel } from "./use-expo-app-model";

type ExpoRouterAppModel = ReturnType<typeof useExpoAppModel>;

const ExpoRouterAppContext = createContext<ExpoRouterAppModel | null>(null);

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

export function ExpoRouterAppProvider({ children }: { children: ReactNode }) {
  const model = useExpoAppModel();

  if (model.bootstrapStatus === "loading") {
    return (
      <View style={expoTheme.page}>
        <View style={expoTheme.heroCard}>
          <Text style={expoTheme.eyebrow}>Expo Router</Text>
          <Text style={expoTheme.title}>앱 데이터를 불러오는 중</Text>
          <Text style={expoTheme.subtitle}>
            저장된 날짜 기록, legacy today plans, 빈 상태 초기화 순서로 앱 시작 경로를
            준비합니다.
          </Text>
        </View>
        <View style={expoTheme.surfaceCard}>
          <ActivityIndicator color="#f07c61" />
          <Text style={expoTheme.bodyText}>
            PlannerRecordMap 복구와 마이그레이션을 확인 중입니다.
          </Text>
        </View>
      </View>
    );
  }

  if (model.bootstrapStatus === "error") {
    return (
      <View style={expoTheme.page}>
        <View style={expoTheme.heroCard}>
          <Text style={expoTheme.eyebrow}>Expo Router</Text>
          <Text style={expoTheme.title}>앱 시작 경로 오류</Text>
          <Text style={expoTheme.subtitle}>
            preview seed 없이 실제 저장소 복구만으로 앱을 시작하려는 경로에서 오류가 발생했습니다.
          </Text>
        </View>
        <View style={expoTheme.surfaceCard}>
          <Text style={expoTheme.sectionTitle}>오류 내용</Text>
          <Text style={expoTheme.bodyText}>{model.bootstrapError ?? "알 수 없는 오류"}</Text>
        </View>
        <View style={expoTheme.surfaceCard}>
          <Text style={expoTheme.sectionTitle}>부트스트랩 소스</Text>
          <Text style={expoTheme.bodyText}>{getBootstrapSourceLabel(model.bootstrapSource)}</Text>
        </View>
      </View>
    );
  }

  return (
    <ExpoRouterAppContext.Provider value={model}>
      {children}
    </ExpoRouterAppContext.Provider>
  );
}

export function useExpoRouterAppModel() {
  const context = useContext(ExpoRouterAppContext);

  if (!context) {
    throw new Error("useExpoRouterAppModel must be used within ExpoRouterAppProvider");
  }

  return context;
}
