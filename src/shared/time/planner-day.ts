import type { DailyPlan, DatedPlanRecord, PlanDateKey, PlannerRecordMap } from "@/domains/plans/types";

export const PLANNER_DAY_START_HOUR = 5;
export const MINUTES_PER_DAY = 24 * 60;

function getPlannerBusinessDate(date: Date) {
  const normalized = new Date(date);

  if (normalized.getHours() < PLANNER_DAY_START_HOUR) {
    normalized.setDate(normalized.getDate() - 1);
  }

  return normalized;
}

export function getPlanDateKey(date: Date): PlanDateKey {
  const businessDate = getPlannerBusinessDate(date);
  const year = businessDate.getFullYear();
  const month = String(businessDate.getMonth() + 1).padStart(2, "0");
  const day = String(businessDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getPreviousPlanDateKey(date: Date): PlanDateKey {
  const businessDate = getPlannerBusinessDate(date);
  businessDate.setDate(businessDate.getDate() - 1);

  return getPlanDateKey(businessDate);
}

export function getCurrentMinuteOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function addPlanDate(
  date: PlanDateKey,
  plans: DailyPlan[]
): DatedPlanRecord[] {
  return plans.map((plan) => ({
    ...plan,
    date
  }));
}

export function stripPlanDate(plans: DatedPlanRecord[]): DailyPlan[] {
  return plans.map(({ date: _date, ...plan }) => plan);
}

export function getCarryoverPlansForDate(
  records: PlannerRecordMap,
  now: Date,
  currentDate: PlanDateKey
): DailyPlan[] {
  const previousDate = getPreviousPlanDateKey(now);
  const previousPlans = records[previousDate] ?? [];
  const currentMinute = getCurrentMinuteOfDay(now);

  if (previousDate === currentDate) {
    return [];
  }

  return previousPlans
    .filter(
      (plan) =>
        !plan.sourcePlanId &&
        plan.status === "pending" &&
        plan.endMinute > MINUTES_PER_DAY &&
        currentMinute < plan.endMinute - MINUTES_PER_DAY
    )
    .map(({ date: _date, ...plan }) => plan);
}
