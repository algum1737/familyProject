import type { DatedPlanRecord, PlannerRecordMap } from "@/domains/plans/types";
import { getPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";

export type MonthlyMotivationSummary = {
  monthKey: string;
  completedCount: number;
  completionRate: number;
  missedCount: number;
  completedAfterRescheduleCount: number;
  streakDays: number;
};

function flattenRecords(records: PlannerRecordMap): DatedPlanRecord[] {
  return Object.values(records).flat();
}

export function getMonthlyMotivationSummary(
  monthKey: string,
  records: PlannerRecordMap
): MonthlyMotivationSummary {
  const plans = flattenRecords(records).filter((plan) => plan.date.startsWith(`${monthKey}-`));
  const performance = getPlannerPerformanceSummary(plans);

  return {
    monthKey,
    completedCount: performance.completedCount,
    completionRate:
      performance.totalCount === 0
        ? 0
        : Math.round((performance.completedCount / performance.totalCount) * 100),
    missedCount: performance.missedCount,
    completedAfterRescheduleCount: performance.completedAfterRescheduleCount,
    streakDays: 0
  };
}
