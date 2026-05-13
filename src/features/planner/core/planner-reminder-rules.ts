import { getComparableCurrentMinute } from "@/domains/plans/service/planner";
import type { DailyPlan, DatedPlanRecord } from "@/domains/plans/types";

export type StartReminderState = {
  planId: string;
  visible: boolean;
  canComplete: boolean;
} | null;

export type EndRecoveryReminderState = {
  planId: string;
  visible: boolean;
} | null;

export const REMINDER_LEAD_MINUTES = 5;
export const REMINDER_LINGER_MINUTES = 10;
export const END_RECOVERY_LEAD_MINUTES = 5;

export function getReminderInstanceKey(plan: Pick<DailyPlan, "id" | "startMinute">) {
  return `${plan.id}:${plan.startMinute}`;
}

export function getEndRecoveryInstanceKey(plan: Pick<DailyPlan, "id" | "endMinute">) {
  return `${plan.id}:${plan.endMinute}`;
}

export function isStartReminderDismissed(
  dismissedKeys: string[],
  plan: Pick<DailyPlan, "id" | "startMinute">
) {
  return dismissedKeys.includes(getReminderInstanceKey(plan));
}

export function isEndRecoveryReminderDismissed(
  dismissedKeys: string[],
  plan: Pick<DailyPlan, "id" | "endMinute">
) {
  return dismissedKeys.includes(getEndRecoveryInstanceKey(plan));
}

type ReminderPlan = Pick<DailyPlan, "id" | "status" | "startMinute" | "endMinute">;

function resolveCurrentMinute(now: Date) {
  return now.getHours() * 60 + now.getMinutes();
}

export function findActiveStartReminder<T extends ReminderPlan>(
  plans: T[],
  currentMinute: number | null
): T | null {
  if (currentMinute === null) {
    return null;
  }

  return (
    plans.find(
      (plan) => {
        const comparableMinute = getComparableCurrentMinute(plan, currentMinute);

        return (
          plan.status === "pending" &&
          comparableMinute >= plan.startMinute - REMINDER_LEAD_MINUTES &&
          comparableMinute <= plan.startMinute + REMINDER_LINGER_MINUTES
        );
      }
    ) ?? null
  );
}

export function findActiveEndRecoveryReminder<T extends ReminderPlan>(
  plans: T[],
  currentMinute: number | null
): T | null {
  if (currentMinute === null) {
    return null;
  }

  return (
    plans.find(
      (plan) => {
        const comparableMinute = getComparableCurrentMinute(plan, currentMinute);

        return (
          plan.status === "pending" &&
          comparableMinute >= plan.endMinute - END_RECOVERY_LEAD_MINUTES &&
          comparableMinute < plan.endMinute
        );
      }
    ) ?? null
  );
}

export function getStartReminderState(
  plans: DatedPlanRecord[],
  now: Date
): StartReminderState {
  const currentMinute = resolveCurrentMinute(now);
  const activeReminder = findActiveStartReminder(plans, currentMinute);

  if (!activeReminder) {
    return null;
  }

  return {
    planId: activeReminder.id,
    visible: true,
    canComplete: currentMinute >= activeReminder.startMinute
  };
}

export function getEndRecoveryReminderState(
  plans: DatedPlanRecord[],
  now: Date
): EndRecoveryReminderState {
  const currentMinute = resolveCurrentMinute(now);
  const activeReminder = findActiveEndRecoveryReminder(plans, currentMinute);

  if (!activeReminder) {
    return null;
  }

  return {
    planId: activeReminder.id,
    visible: true
  };
}
