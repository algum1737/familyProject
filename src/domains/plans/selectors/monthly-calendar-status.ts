import type { PlannerRecordMap } from "@/domains/plans/types";
import { getPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";

export type CalendarDayTone = "good" | "mid" | "watch";

export type MonthlyCalendarDay = {
  date: string;
  dayOfMonth: number;
  tone: CalendarDayTone;
  completionRate: number;
};

export function getMonthlyCalendarStatus(
  monthKey: string,
  records: PlannerRecordMap
): MonthlyCalendarDay[] {
  return Object.entries(records)
    .filter(([date]) => date.startsWith(`${monthKey}-`))
    .map(([date, plans]) => {
      const performance = getPlannerPerformanceSummary(plans);
      const completionRate =
        performance.totalCount === 0
          ? 0
          : Math.round((performance.completedCount / performance.totalCount) * 100);
      const tone: CalendarDayTone =
        completionRate >= 70 ? "good" : completionRate >= 30 ? "mid" : "watch";

      return {
        date,
        dayOfMonth: Number(date.slice(-2)),
        tone,
        completionRate
      };
    });
}
