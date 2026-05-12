import type { PlannerRecordMap } from "@/domains/plans/types";
import { getPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";

export type RecoveryContributionSummary = {
  monthKey: string;
  completedAfterRescheduleCount: number;
  reflectionDays: number;
};

export function getRecoveryContributionSummary(
  monthKey: string,
  records: PlannerRecordMap
): RecoveryContributionSummary {
  const plans = Object.values(records)
    .flat()
    .filter((plan) => plan.date.startsWith(`${monthKey}-`));
  const reflectionDays = new Set(
    plans.filter((plan) => Boolean(plan.reflectionNote?.trim())).map((plan) => plan.date)
  ).size;
  const performance = getPlannerPerformanceSummary(plans);

  return {
    monthKey,
    completedAfterRescheduleCount: performance.completedAfterRescheduleCount,
    reflectionDays
  };
}
