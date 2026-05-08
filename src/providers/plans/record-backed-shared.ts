import type { DailyPlan } from "@/domains/plans/types";
export {
  addPlanDate,
  getCarryoverPlansForDate,
  getPlanDateKey,
  getPreviousPlanDateKey,
  MINUTES_PER_DAY,
  PLANNER_DAY_START_HOUR,
  stripPlanDate
} from "@/shared/time/planner-day";

export function resetPlansForNextDay(plans: DailyPlan[]): DailyPlan[] {
  return plans
    .filter((plan) => !plan.sourcePlanId)
    .map((plan) => ({
      ...plan,
      reflectionNote: undefined,
      rescheduleCount: 0,
      sourcePlanId: undefined,
      status: "pending"
    }));
}
