import type { DailyPlan, DatedPlanRecord, PlannerRecordMap } from "@/domains/plans/types";

export const DEFAULT_PLAN_COLOR = "#767676";

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidPlanColor(value: string) {
  return HEX_COLOR_PATTERN.test(value.trim());
}

export function normalizePlanColor(value: string) {
  const normalized = value.trim();

  return isValidPlanColor(normalized) ? normalized : DEFAULT_PLAN_COLOR;
}

export function normalizeDailyPlanColor<T extends DailyPlan>(plan: T): T {
  return {
    ...plan,
    color: normalizePlanColor(plan.color)
  };
}

export function normalizeDailyPlans<T extends DailyPlan>(plans: T[]): T[] {
  return plans.map((plan) => normalizeDailyPlanColor(plan));
}

export function normalizeDatedPlans<T extends DatedPlanRecord>(plans: T[]): T[] {
  return plans.map((plan) => normalizeDailyPlanColor(plan));
}

export function normalizePlannerRecordMap(records: PlannerRecordMap): PlannerRecordMap {
  return Object.fromEntries(
    Object.entries(records).map(([date, plans]) => [date, normalizeDatedPlans(plans)])
  );
}
