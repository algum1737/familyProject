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
    );
  }

  if (providerView === "error") {
    return (
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
        <View style={theme.surfaceCard}>
          <Text style={theme.sectionTitle}>불러오기 상태</Text>
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
