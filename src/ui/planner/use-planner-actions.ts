"use client";

import type { DailyPlan } from "@/domains/plans/types";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { usePlannerObservationLog } from "@/ui/planner/use-planner-observation-log";
import type { usePlannerState } from "@/ui/planner/use-planner-state";

type PlannerStateActions = Pick<
  ReturnType<typeof usePlannerState>,
  "deletePlan" | "startReflection" | "startRescheduling" | "togglePlanStatus"
>;

type ObservationActions = Pick<
  ReturnType<typeof usePlannerObservationLog>,
  | "recordEndRecoveryContinue"
  | "recordReminderCompleted"
  | "recordReminderDismissed"
  | "recordRescheduleUnavailable"
>;

type UsePlannerActionsOptions = {
  activeReminder: DailyPlan | null;
  currentMinute: number | null;
  dismissEndRecoveryReminder(plan: DailyPlan): void;
  dismissReminder(plan: DailyPlan): void;
  plannerState: PlannerStateActions;
  plans: DailyPlan[];
  reminderProvider: ReminderProvider;
} & ObservationActions;

export function usePlannerActions({
  activeReminder,
  currentMinute,
  dismissEndRecoveryReminder,
  dismissReminder,
  plannerState,
  plans,
  recordEndRecoveryContinue,
  recordReminderCompleted,
  recordReminderDismissed,
  recordRescheduleUnavailable,
  reminderProvider
}: UsePlannerActionsOptions) {
  function togglePlanStatus(planId: string) {
    const plan = plans.find((item) => item.id === planId);

    if (!plan) {
      return;
    }

    plannerState.togglePlanStatus(planId);
    dismissReminder(plan);

    if (activeReminder?.id === plan.id && plan.status === "pending") {
      recordReminderCompleted(plan);
    }

    void reminderProvider.cancel(planId);
  }

  function deletePlan(planId: string) {
    plannerState.deletePlan(planId);
    const plan = plans.find((item) => item.id === planId);

    if (plan) {
      dismissReminder(plan);
    }

    void reminderProvider.cancel(planId);
  }

  function dismissActiveReminder(planId: string) {
    const plan = plans.find((item) => item.id === planId);

    if (plan) {
      dismissReminder(plan);
      recordReminderDismissed(plan);
    }

    void reminderProvider.cancel(planId);
  }

  function dismissActiveEndRecoveryReminder(planId: string) {
    const plan = plans.find((item) => item.id === planId);

    if (!plan) {
      return;
    }

    dismissEndRecoveryReminder(plan);
    recordEndRecoveryContinue(plan);
  }

  function startReflection(plan: DailyPlan) {
    plannerState.startReflection(plan);
  }

  function startRescheduling(plan: DailyPlan) {
    const result = plannerState.startRescheduling(plan, currentMinute);

    if (result === "unavailable") {
      recordRescheduleUnavailable(plan);
    }

    return result;
  }

  return {
    deletePlan,
    dismissActiveEndRecoveryReminder,
    dismissActiveReminder,
    startReflection,
    startRescheduling,
    togglePlanStatus
  };
}
