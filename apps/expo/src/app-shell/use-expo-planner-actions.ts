"use client";

import { minuteToTimeString } from "../../../../src/domains/plans/service/planner";
import type { DailyPlan } from "../../../../src/domains/plans/types";
import {
  getEndRecoveryInstanceKey,
  getReminderInstanceKey
} from "../../../../src/features/planner/core/planner-reminder-rules";
import {
  buildPlannerFormValues,
  startPlannerReschedule
} from "../../../../src/features/planner/core/planner-state-transitions";
import {
  defaultExpoPlanFormState,
  type useExpoPlannerState
} from "./use-expo-planner-state";

type ExpoPlannerState = ReturnType<typeof useExpoPlannerState>;

export function useExpoPlannerActions(plannerState: ExpoPlannerState) {
  function buildCurrentTimeForm() {
    const startMinute = plannerState.currentMinute;
    const endMinute = startMinute + 60;

    return {
      ...defaultExpoPlanFormState,
      startTime: minuteToTimeString(startMinute),
      endTime: minuteToTimeString(endMinute)
    };
  }

  function resetRecoveryState() {
    plannerState.setRecoveryMode(null);
    plannerState.setRecoveryPlanId(null);
    plannerState.setReflectionNoteDraft("");
  }

  function startCreatePlan() {
    plannerState.setEditingPlanId(null);
    resetRecoveryState();
    plannerState.setForm(buildCurrentTimeForm());
    plannerState.setError(null);
  }

  function startEditingPlan(plan: DailyPlan) {
    plannerState.setEditingPlanId(plan.id);
    resetRecoveryState();
    plannerState.setForm(buildPlannerFormValues(plan));
    plannerState.setError(null);
  }

  function cancelEditing() {
    plannerState.setEditingPlanId(null);
    plannerState.setForm(defaultExpoPlanFormState);
    plannerState.setError(null);
  }

  function dismissReminder(planId: string) {
    const plan = plannerState.plans.find((item) => item.id === planId);

    if (!plan) {
      return;
    }

    plannerState.markReminderDismissed(getReminderInstanceKey(plan));
  }

  function dismissEndRecovery(planId: string) {
    const plan = plannerState.plans.find((item) => item.id === planId);

    if (!plan) {
      return;
    }

    plannerState.markEndRecoveryDismissed(getEndRecoveryInstanceKey(plan));
  }

  function deletePlan(planId: string) {
    plannerState.deletePlan(planId);
  }

  function startReflection(plan: DailyPlan) {
    plannerState.setRecoveryMode("reflection");
    plannerState.setRecoveryPlanId(plan.id);
    plannerState.setReflectionNoteDraft(plan.reflectionNote ?? "");
    plannerState.setEditingPlanId(null);
    plannerState.setError(null);
  }

  function cancelRecovery() {
    resetRecoveryState();
    plannerState.setError(null);
  }

  function startRescheduling(plan: DailyPlan) {
    const result = startPlannerReschedule({
      currentMinute: plannerState.currentMinute,
      plan,
      plans: plannerState.plans
    });

    if (result.kind === "maxed") {
      plannerState.setError(result.error);
      return "maxed" as const;
    }

    if (result.kind === "unavailable") {
      plannerState.setError(result.error);
      return "unavailable" as const;
    }

    plannerState.setRecoveryMode("reschedule");
    plannerState.setRecoveryPlanId(plan.id);
    plannerState.setEditingPlanId(null);
    plannerState.setForm(result.formValues);
    plannerState.setReflectionNoteDraft("");
    plannerState.setError(null);
    return "started" as const;
  }

  return {
    cancelEditing,
    cancelRecovery,
    deletePlan,
    dismissEndRecovery,
    dismissReminder,
    startCreatePlan,
    startEditingPlan,
    startReflection,
    startRescheduling
  };
}
