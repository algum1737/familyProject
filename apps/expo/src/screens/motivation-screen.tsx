import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type {
  MonthlyCalendarDay
} from "../../../../src/domains/plans/selectors/monthly-calendar-status";
import type {
  MonthlyMotivationSummary
} from "../../../../src/domains/plans/selectors/monthly-motivation-summary";
import type {
  RecoveryContributionSummary
} from "../../../../src/domains/plans/selectors/recovery-contribution-summary";
import { expoTheme } from "../app-shell/expo-theme";

type ExpoMotivationScreenProps = {
  calendarDays: MonthlyCalendarDay[];
  recoverySummary: RecoveryContributionSummary | null;
  summary: MonthlyMotivationSummary | null;
};

export function ExpoMotivationScreen({
  calendarDays,
  recoverySummary,
  summary
}: ExpoMotivationScreenProps) {
  const completedCount = summary?.completedCount ?? 0;
  const completionRate = summary?.completionRate ?? 0;
  const missedCount = summary?.missedCount ?? 0;
  const recoveredCount = recoverySummary?.completedAfterRescheduleCount ?? 0;
  const reflectionDays = recoverySummary?.reflectionDays ?? 0;

  function getCalendarToneStyle(tone: MonthlyCalendarDay["tone"]) {
    switch (tone) {
      case "good":
        return [expoTheme.motivationCalendarDay, expoTheme.motivationCalendarDayGood];
      case "mid":
        return [expoTheme.motivationCalendarDay, expoTheme.motivationCalendarDayMid];
      default:
        return [expoTheme.motivationCalendarDay, expoTheme.motivationCalendarDayWatch];
    }
  }

  function getCalendarRateStyle(tone: MonthlyCalendarDay["tone"]) {
    switch (tone) {
      case "good":
        return expoTheme.motivationCalendarRateGood;
      case "mid":
        return expoTheme.motivationCalendarRateMid;
      default:
        return expoTheme.motivationCalendarRateWatch;
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
          <Text style={expoTheme.todayHeaderTitle}>동기</Text>
          <Text style={expoTheme.todayHeaderSubtitle}>
            한 달 동안 얼마나 꾸준히 해냈는지, 놓친 일을 얼마나 회복했는지 한 화면에서 봅니다.
          </Text>
        </View>

        <View style={expoTheme.todayPlannerCard}>
          <View style={expoTheme.todaySectionHeader}>
            <Text style={expoTheme.todaySectionTitle}>이달 요약</Text>
            <Text style={expoTheme.todaySectionHeadline}>
              {summary ? `${summary.monthKey} 체인 완료 ${completedCount}개` : "기록 준비 중"}
            </Text>
            <Text style={expoTheme.todaySectionBody}>
              {summary
                ? `회복 완료까지 포함한 체인 기준 성과를 월 단위로 집계합니다.`
                : "아직 월간 기록이 없습니다."}
            </Text>
          </View>
          <View style={expoTheme.motivationHeroGrid}>
            <View style={expoTheme.statTile}>
              <Text style={expoTheme.bodyText}>체인 완료</Text>
              <Text style={expoTheme.statTileStrong}>{summary ? `${completedCount}개` : "-"}</Text>
            </View>
            <View style={expoTheme.statTile}>
              <Text style={expoTheme.bodyText}>완료율</Text>
              <Text style={expoTheme.statTileStrong}>{summary ? `${completionRate}%` : "-"}</Text>
            </View>
            <View style={expoTheme.statTile}>
              <Text style={expoTheme.bodyText}>회복 완료</Text>
              <Text style={expoTheme.statTileStrong}>{recoveredCount}개</Text>
            </View>
          </View>
          <View style={expoTheme.motivationSummaryStrip}>
            <View style={expoTheme.motivationSummaryChip}>
              <Text style={expoTheme.bodyText}>놓침</Text>
              <Text style={expoTheme.motivationSummaryChipValue}>{missedCount}개</Text>
            </View>
            <View style={expoTheme.motivationSummaryChip}>
              <Text style={expoTheme.bodyText}>회고 일수</Text>
              <Text style={expoTheme.motivationSummaryChipValue}>{reflectionDays}일</Text>
            </View>
          </View>
        </View>

        <View style={expoTheme.routeSectionCard}>
          <Text style={expoTheme.sectionTitle}>회복 기여</Text>
          <View style={expoTheme.motivationMetricGrid}>
            <View style={expoTheme.motivationMetricCard}>
              <Text style={expoTheme.motivationMetricLabel}>회복 완료</Text>
              <Text style={expoTheme.motivationMetricValue}>{recoveredCount}</Text>
              <Text style={expoTheme.bodyText}>다시 지정한 일을 끝까지 마친 횟수</Text>
            </View>
            <View style={expoTheme.motivationMetricCard}>
              <Text style={expoTheme.motivationMetricLabel}>회고 일수</Text>
              <Text style={expoTheme.motivationMetricValue}>{reflectionDays}</Text>
              <Text style={expoTheme.bodyText}>메모를 남긴 날짜 수</Text>
            </View>
          </View>
        </View>

        <View style={expoTheme.routeSectionCard}>
          <Text style={expoTheme.sectionTitle}>월간 캘린더</Text>
          <Text style={expoTheme.bodyText}>
            각 날짜는 회복 완료를 포함한 체인 기준 완료율로 색이 정해집니다.
          </Text>
          <View style={expoTheme.motivationLegendRow}>
            <View style={expoTheme.motivationLegendItem}>
              <View
                style={[
                  expoTheme.motivationLegendSwatch,
                  expoTheme.motivationCalendarDayGood
                ]}
              />
              <Text style={expoTheme.bodyText}>좋음</Text>
            </View>
            <View style={expoTheme.motivationLegendItem}>
              <View
                style={[expoTheme.motivationLegendSwatch, expoTheme.motivationCalendarDayMid]}
              />
              <Text style={expoTheme.bodyText}>보통</Text>
            </View>
            <View style={expoTheme.motivationLegendItem}>
              <View
                style={[
                  expoTheme.motivationLegendSwatch,
                  expoTheme.motivationCalendarDayWatch
                ]}
              />
              <Text style={expoTheme.bodyText}>주의</Text>
            </View>
          </View>
          <View style={expoTheme.motivationCalendarGrid}>
            {calendarDays.map((day) => (
              <View key={day.date} style={getCalendarToneStyle(day.tone)}>
                <Text style={expoTheme.motivationCalendarDayNumber}>{day.dayOfMonth}</Text>
                <Text style={getCalendarRateStyle(day.tone)}>{day.completionRate}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
