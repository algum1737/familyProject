import type { DatedPlanRecord } from "@/domains/plans/types";
import { getDatedPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";

export type DailySummary = {
  date: string;
  plannedCount: number;
  completedCount: number;
  missedCount: number;
  completionRate: number;
  rescheduledCount: number;
  completedAfterRescheduleCount: number;
  reflectionCount: number;
};

export function getDailySummary(plans: DatedPlanRecord[]): DailySummary | null {
  if (plans.length === 0) {
    return null;
  }

  const performance = getDatedPlannerPerformanceSummary(plans);
  const plannedCount = performance.totalCount;
  const completedCount = performance.completedCount;
  const missedCount = performance.missedCount;
  const rescheduledCount = plans.filter((plan) => plan.rescheduleCount > 0).length;
  const completedAfterRescheduleCount = performance.completedAfterRescheduleCount;
  const reflectionCount = plans.filter((plan) => Boolean(plan.reflectionNote?.trim())).length;

  return {
    date: plans[0].date,
    plannedCount,
    completedCount,
    missedCount,
    completionRate: plannedCount === 0 ? 0 : Math.round((completedCount / plannedCount) * 100),
    rescheduledCount,
    completedAfterRescheduleCount,
    reflectionCount
  };
}
