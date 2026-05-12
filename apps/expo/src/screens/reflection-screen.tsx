import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useExpoTheme } from "../app-shell/expo-theme-provider";

type ExpoReflectionScreenProps = {
  activeRecoveryTitle: string | null;
  note: string;
  onCancel: () => void;
  onChangeNote: (note: string) => void;
  onSave: () => void;
};

export function ExpoReflectionScreen({
  activeRecoveryTitle,
  note,
  onCancel,
  onChangeNote,
  onSave
}: ExpoReflectionScreenProps) {
  const { theme: expoTheme, themeKey } = useExpoTheme();

  return (
    <SafeAreaView edges={["top"]} style={expoTheme.routeSafeArea}>
      <ScrollView
        contentContainerStyle={expoTheme.routeScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={expoTheme.routeScroll}
      >
        <View style={expoTheme.todayHeader}>
          <Text style={expoTheme.todayHeaderTitle}>회고</Text>
          <Text style={expoTheme.todayHeaderSubtitle}>
            놓친 이유와 다시 해볼 방식을 짧게 남겨 다음 선택을 더 쉽게 만듭니다.
          </Text>
        </View>

        <View style={expoTheme.routeSectionCard}>
          <Text style={expoTheme.sectionTitle}>회고 대상</Text>
          <View style={expoTheme.reflectionTargetCard}>
            <Text style={expoTheme.reflectionTargetLabel}>현재 일정</Text>
            <Text style={expoTheme.reflectionTargetTitle}>
              {activeRecoveryTitle ?? "선택된 일정 없음"}
            </Text>
          </View>
        </View>

        <View style={expoTheme.routeSectionCard}>
          <Text style={expoTheme.sectionTitle}>메모</Text>
          <Text style={expoTheme.bodyText}>
            어떤 이유로 놓쳤는지, 다음에는 무엇을 바꿔볼지 한두 문장으로 남기면 충분합니다.
          </Text>
          <TextInput
            multiline
            onChangeText={onChangeNote}
            placeholder="예: 이동 시간이 길어져 시작을 놓쳤다. 다음에는 20분 먼저 알림을 켠다."
            placeholderTextColor={themeKey === "night-ink" ? "#7f8aa8" : "#a0a5b2"}
            style={expoTheme.reflectionTextarea}
            textAlignVertical="top"
            value={note}
          />
          <Text style={expoTheme.bodyText}>현재 {note.trim().length}자</Text>
          <View style={expoTheme.formActionRow}>
            <Pressable onPress={onCancel} style={expoTheme.secondaryButton}>
              <Text style={expoTheme.secondaryButtonText}>취소</Text>
            </Pressable>
            <Pressable onPress={onSave} style={expoTheme.primaryButton}>
              <Text style={expoTheme.primaryButtonText}>회고 저장</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
