import { Text, View } from "react-native";

import { expoTheme } from "../app-shell/expo-theme";

type ExpoRouteDraftScreenProps = {
  body: string;
  route: string;
  title: string;
};

export function ExpoRouteDraftScreen({
  body,
  route,
  title
}: ExpoRouteDraftScreenProps) {
  return (
    <View style={expoTheme.page}>
      <View style={expoTheme.heroCard}>
        <Text style={expoTheme.eyebrow}>Expo Router Draft</Text>
        <Text style={expoTheme.title}>{title}</Text>
        <Text style={expoTheme.subtitle}>{body}</Text>
      </View>

      <View style={expoTheme.surfaceCard}>
        <Text style={expoTheme.sectionTitle}>Route</Text>
        <Text style={expoTheme.bodyText}>{route}</Text>
      </View>

      <View style={expoTheme.surfaceCard}>
        <Text style={expoTheme.sectionTitle}>상태</Text>
        <Text style={expoTheme.bodyText}>
          이 파일은 `expo-router` 실제 전환 전 파일 구조와 route 계약을 고정하기 위한 초안입니다.
          현재 기본 런타임은 여전히 `ExpoAppShell`을 사용합니다.
        </Text>
      </View>
    </View>
  );
}
