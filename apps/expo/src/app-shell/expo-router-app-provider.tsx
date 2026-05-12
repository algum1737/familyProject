import { ActivityIndicator, Text, View } from "react-native";
import { createContext, type ReactNode, useContext } from "react";

import { useExpoTheme } from "./expo-theme-provider";
import {
  getBootstrapSourceLabel,
  getExpoRouterProviderView
} from "./expo-router-provider-state";
import { useExpoAppModel } from "./use-expo-app-model";

type ExpoRouterAppModel = ReturnType<typeof useExpoAppModel>;

const ExpoRouterAppContext = createContext<ExpoRouterAppModel | null>(null);

export function ExpoRouterAppProvider({ children }: { children: ReactNode }) {
  const model = useExpoAppModel();
  const { theme } = useExpoTheme();
  const providerView = getExpoRouterProviderView(model.bootstrapStatus);

  if (providerView === "loading") {
    return (
      <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>Expo Router</Text>
          <Text style={theme.title}>앱 데이터를 불러오는 중</Text>
          <Text style={theme.subtitle}>
            저장된 날짜 기록, legacy today plans, 빈 상태 초기화 순서로 앱 시작 경로를
            준비합니다.
          </Text>
        </View>
        <View style={theme.surfaceCard}>
          <ActivityIndicator color="#f07c61" />
          <Text style={theme.bodyText}>
            PlannerRecordMap 복구와 마이그레이션을 확인 중입니다.
          </Text>
        </View>
      </View>
    );
  }

  if (providerView === "error") {
    return (
      <View style={theme.page}>
        <View style={theme.heroCard}>
          <Text style={theme.eyebrow}>Expo Router</Text>
          <Text style={theme.title}>앱 시작 경로 오류</Text>
          <Text style={theme.subtitle}>
            preview seed 없이 실제 저장소 복구만으로 앱을 시작하려는 경로에서 오류가 발생했습니다.
          </Text>
        </View>
        <View style={theme.surfaceCard}>
          <Text style={theme.sectionTitle}>오류 내용</Text>
          <Text style={theme.bodyText}>{model.bootstrapError ?? "알 수 없는 오류"}</Text>
        </View>
        <View style={theme.surfaceCard}>
          <Text style={theme.sectionTitle}>부트스트랩 소스</Text>
          <Text style={theme.bodyText}>{getBootstrapSourceLabel(model.bootstrapSource)}</Text>
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
