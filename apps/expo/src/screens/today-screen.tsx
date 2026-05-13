import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import type { TimeDisplayFormat } from "../../../../src/domains/plans/service/planner";
import type { RescheduleFailureGuidance } from "../../../../src/features/planner/core/reschedule-failure-guidance";

import { ExpoCircularPlanner } from "../components/expo-circular-planner";
import { useExpoTheme } from "../app-shell/expo-theme-provider";

type ExpoTodayScreenProps = {
  currentMinute: number | null;
  currentPlanTimeText: string;
  currentPlanTitle: string | null;
  error: string | null;
  onChangeTimeDisplayFormat: (next: TimeDisplayFormat) => void;
  onCompletePlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onDismissEndRecovery: (planId: string) => void;
  onDismissReminder: (planId: string) => void;
  onOpenCreatePlan: () => void;
  onOpenReflection: (planId: string) => void;
  onOpenReschedule: (planId: string) => void;
  onOpenUpdatePlan: (planId: string) => void;
  plans: Array<{
    color: string;
    endMinute: number;
    id: string;
    reflectionNote?: string;
    rescheduleCount: number;
    sourcePlanId?: string;
    startMinute: number;
    status: "pending" | "done" | "missed";
    title: string;
  }>;
  planItems: Array<{
    canReschedule: boolean;
    canToggleStatus: boolean;
    id: string;
    recoveryLabel: string | null;
    rescheduleActionState: "enabled" | "blocked" | "hidden";
    rescheduleBlockedReason: string | null;
    statusLabel: string;
    statusTone: "current" | "pending" | "done" | "missed";
    timeText: string;
    title: string;
  }>;
  reminderPlanId: string | null;
  endRecoveryPlanId: string | null;
  reminderText: string | null;
  rescheduleFailureGuidance: RescheduleFailureGuidance | null;
  summary: {
    completed: number;
    completionRate: number;
    total: number;
  };
  timeDisplayFormat: TimeDisplayFormat;
};

export function ExpoTodayScreen({
  currentMinute,
  currentPlanTimeText,
  currentPlanTitle,
  error,
  onChangeTimeDisplayFormat,
  onCompletePlan,
  onDeletePlan,
  onDismissEndRecovery,
  onDismissReminder,
  onOpenCreatePlan,
  onOpenReflection,
  onOpenReschedule,
  onOpenUpdatePlan,
  plans,
  planItems,
  reminderPlanId,
  endRecoveryPlanId,
  reminderText,
  rescheduleFailureGuidance,
  summary,
  timeDisplayFormat
}: ExpoTodayScreenProps) {
  const [isTimeDisplayMenuOpen, setIsTimeDisplayMenuOpen] = useState(false);
  const {
    setThemeKey,
    theme: expoTheme,
    themeKey,
    themeOptions
  } = useExpoTheme();

  function getStatusToneStyle(
    tone: "current" | "pending" | "done" | "missed"
  ) {
    switch (tone) {
      case "current":
        return [expoTheme.statusPill, expoTheme.statusPillCurrent];
      case "done":
        return [expoTheme.statusPill, expoTheme.statusPillDone];
      case "missed":
        return [expoTheme.statusPill, expoTheme.statusPillMissed];
      default:
        return [expoTheme.statusPill, expoTheme.statusPillPending];
    }
  }

  function getStatusTextStyle(
    tone: "current" | "pending" | "done" | "missed"
  ) {
    switch (tone) {
      case "current":
        return [expoTheme.statusPillText, expoTheme.statusPillTextCurrent];
      case "done":
        return [expoTheme.statusPillText, expoTheme.statusPillTextDone];
      case "missed":
        return [expoTheme.statusPillText, expoTheme.statusPillTextMissed];
      default:
        return [expoTheme.statusPillText, expoTheme.statusPillTextPending];
    }
  }

  function getToggleButtonLabel(tone: "current" | "pending" | "done" | "missed") {
    return tone === "done" ? "완료 취소" : "완료 전환";
  }

  function getDisabledToggleButtonLabel(tone: "current" | "pending" | "done" | "missed") {
    if (tone === "done") {
      return "완료됨";
    }

    return "시작 전";
  }

  function getThemeSwatchColor(nextThemeKey: "mint" | "night-ink" | "sand") {
    switch (nextThemeKey) {
      case "mint":
        return "#2f9d8f";
      case "night-ink":
        return "#7c91ff";
      default:
        return "#ea765a";
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={expoTheme.routeSafeArea}>
      <ScrollView
        contentContainerStyle={expoTheme.routeScrollContent}
        showsVerticalScrollIndicator={false}
        style={expoTheme.routeScroll}
      >
        <View style={expoTheme.todayHeader}>
          <View style={expoTheme.todayHeaderTopRow}>
            <Text style={expoTheme.todayHeaderTitle}>오늘 다 했니</Text>
            <View style={expoTheme.settingsStack}>
              <Pressable
                onPress={() => setIsTimeDisplayMenuOpen((current) => !current)}
                style={expoTheme.settingsButton}
              >
                <Text style={expoTheme.settingsButtonText}>⚙</Text>
              </Pressable>
              {isTimeDisplayMenuOpen ? (
                <View style={expoTheme.settingsMenu}>
                  <Text style={expoTheme.settingsMenuSectionTitle}>시간 표시</Text>
                  <Pressable
                    onPress={() => {
                      onChangeTimeDisplayFormat("24h");
                      setIsTimeDisplayMenuOpen(false);
                    }}
                    style={[
                      expoTheme.settingsMenuItem,
                      timeDisplayFormat === "24h" ? expoTheme.settingsMenuItemActive : null
                    ]}
                  >
                    <Text style={expoTheme.settingsMenuText}>
                      {timeDisplayFormat === "24h" ? "✓ " : ""}24시간
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onChangeTimeDisplayFormat("12h");
                      setIsTimeDisplayMenuOpen(false);
                    }}
                    style={[
                      expoTheme.settingsMenuItem,
                      timeDisplayFormat === "12h" ? expoTheme.settingsMenuItemActive : null
                    ]}
                  >
                    <Text style={expoTheme.settingsMenuText}>
                      {timeDisplayFormat === "12h" ? "✓ " : ""}12시간
                    </Text>
                  </Pressable>
                  <View style={expoTheme.settingsMenuSection}>
                    <Text style={expoTheme.settingsMenuSectionTitle}>테마</Text>
                    {themeOptions.map((option) => (
                      <Pressable
                        key={option.key}
                        onPress={() => {
                          setThemeKey(option.key);
                          setIsTimeDisplayMenuOpen(false);
                        }}
                        style={[
                          expoTheme.settingsMenuItem,
                          themeKey === option.key ? expoTheme.settingsMenuItemActive : null
                        ]}
                      >
                        <View style={expoTheme.settingsMenuThemeRow}>
                          <View
                            style={[
                              expoTheme.settingsMenuThemeSwatch,
                              { backgroundColor: getThemeSwatchColor(option.key) }
                            ]}
                          />
                          <Text style={expoTheme.settingsMenuText}>
                            {themeKey === option.key ? "✓ " : ""}
                            {option.label}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <Text style={expoTheme.todayHeaderSubtitle}>
            오늘 할 계획과 흐름을 한눈에 확인합니다.
          </Text>
        </View>

        <View style={expoTheme.todayPlannerCard}>
          <View style={expoTheme.todaySectionHeader}>
            <Text style={expoTheme.todaySectionTitle}>현재 계획</Text>
            <Text style={expoTheme.todaySectionHeadline}>
              {currentPlanTitle ?? "현재 계획 없음"}
            </Text>
            <Text style={expoTheme.todaySectionBody}>{currentPlanTimeText}</Text>
          </View>
          <View style={expoTheme.statRow}>
            <View style={expoTheme.statTile}>
              <Text style={expoTheme.bodyText}>완료</Text>
              <Text style={expoTheme.statTileStrong}>
                {summary.completed}/{summary.total}
              </Text>
            </View>
            <View style={expoTheme.statTile}>
              <Text style={expoTheme.bodyText}>완료율</Text>
              <Text style={expoTheme.statTileStrong}>{summary.completionRate}%</Text>
            </View>
          </View>
          <ExpoCircularPlanner
            currentMinute={currentMinute}
            currentPlanTitle={currentPlanTitle}
            plans={plans}
          />
          {reminderText ? <Text style={expoTheme.bodyText}>리마인드: {reminderText}</Text> : null}
          {error ? (
            <View style={expoTheme.errorBanner}>
              <Text style={expoTheme.bodyTextError}>{error}</Text>
            </View>
          ) : null}
          {rescheduleFailureGuidance ? (
            <View style={expoTheme.warningCard}>
              <Text style={expoTheme.warningCardTitle}>{rescheduleFailureGuidance.title}</Text>
              <Text style={expoTheme.warningCardText}>
                {rescheduleFailureGuidance.description}
              </Text>
            </View>
          ) : null}
          <Pressable onPress={onOpenCreatePlan} style={expoTheme.primaryButton}>
            <Text style={expoTheme.primaryButtonText}>새 계획 추가</Text>
          </Pressable>
        </View>

        <View style={expoTheme.routeSectionCard}>
          <Text style={expoTheme.sectionTitle}>오늘 계획</Text>
          <View style={expoTheme.content}>
            {planItems.map((item) => (
              <View key={item.id} style={expoTheme.todayPlanItem}>
                <View style={expoTheme.todayPlanMetaRow}>
                  <View style={getStatusToneStyle(item.statusTone)}>
                    <Text style={getStatusTextStyle(item.statusTone)}>{item.statusLabel}</Text>
                  </View>
                  {item.recoveryLabel ? (
                    <View style={expoTheme.statusPillPending}>
                      <Text style={expoTheme.statusPillTextPending}>{item.recoveryLabel}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={expoTheme.todayPlanTitle}>{item.title}</Text>
                <Text style={expoTheme.bodyText}>{item.timeText}</Text>
                {item.statusTone === "missed" && item.rescheduleBlockedReason ? (
                  <Text style={expoTheme.todayPlanMetaText}>
                    {item.rescheduleBlockedReason}
                  </Text>
                ) : null}
                <View style={expoTheme.formActionRow}>
                  {item.statusTone !== "missed" ? (
                    <Pressable
                      disabled={!item.canToggleStatus}
                      onPress={() => onCompletePlan(item.id)}
                      style={
                        item.canToggleStatus
                          ? expoTheme.primaryButton
                          : expoTheme.primaryButtonDisabled
                      }
                    >
                      <Text style={expoTheme.primaryButtonText}>
                        {item.canToggleStatus
                          ? getToggleButtonLabel(item.statusTone)
                          : getDisabledToggleButtonLabel(item.statusTone)}
                      </Text>
                    </Pressable>
                  ) : null}
                  {item.statusTone !== "missed" ? (
                    <Pressable
                      onPress={() => onOpenUpdatePlan(item.id)}
                      style={expoTheme.secondaryButton}
                    >
                      <Text style={expoTheme.secondaryButtonText}>편집</Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={() => onDeletePlan(item.id)}
                    style={expoTheme.secondaryButton}
                  >
                    <Text style={expoTheme.secondaryButtonText}>삭제</Text>
                  </Pressable>
                </View>
                <View style={expoTheme.formActionRow}>
                  {item.statusTone === "missed" ? (
                    <Pressable
                      onPress={() => onOpenReflection(item.id)}
                      style={expoTheme.tertiaryButton}
                    >
                      <Text style={expoTheme.tertiaryButtonText}>회고</Text>
                    </Pressable>
                  ) : null}
                  {item.rescheduleActionState === "enabled" ? (
                    <Pressable
                      onPress={() => onOpenReschedule(item.id)}
                      style={expoTheme.tertiaryButton}
                    >
                      <Text style={expoTheme.tertiaryButtonText}>다시 지정</Text>
                    </Pressable>
                  ) : null}
                  {item.rescheduleActionState === "blocked" ? (
                    <Pressable
                      disabled
                      style={[expoTheme.tertiaryButton, expoTheme.tertiaryButtonDisabled]}
                    >
                      <Text style={expoTheme.tertiaryButtonTextDisabled}>다시 지정</Text>
                    </Pressable>
                  ) : null}
                  {reminderPlanId === item.id ? (
                    <Pressable
                      onPress={() => onDismissReminder(item.id)}
                      style={expoTheme.tertiaryButton}
                    >
                      <Text style={expoTheme.tertiaryButtonText}>리마인드 닫기</Text>
                    </Pressable>
                  ) : null}
                  {endRecoveryPlanId === item.id ? (
                    <Pressable
                      onPress={() => onDismissEndRecovery(item.id)}
                      style={expoTheme.tertiaryButton}
                    >
                      <Text style={expoTheme.tertiaryButtonText}>계속 진행</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
