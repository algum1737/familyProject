"use client";

import { useEffect, useState } from "react";

import {
  findNextAvailableTimeSlot,
  markMissedPlans,
  minuteToTimeString,
  sortPlans,
  validatePlanner
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import {
  buildPlannerFormValues,
  RESCHEDULE_UNAVAILABLE_MESSAGE,
  savePlannerReflection,
  startPlannerReschedule,
  submitPlannerPlan,
  togglePlannerPlanStatus
} from "@/features/planner/core/planner-state-transitions";
import type { PlansStore } from "@/providers/plans/plans-store";
import { demoPlans } from "@/ui/planner/planner-demo-data";
import { PLAN_COLORS } from "@/ui/planner/planner-colors";

export type PlanFormState = {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  colorMode: string;
};

export const defaultFormState: PlanFormState = {
  title: "",
  startTime: "08:00",
  endTime: "09:00",
  color: PLAN_COLORS[0].value,
  colorMode: PLAN_COLORS[0].value
};
const OBSERVATION_SAMPLE_DURATION_MINUTES = 30;

type RecoveryMode = "reflection" | "reschedule" | null;
export type StartReschedulingResult = "started" | "maxed" | "unavailable";

function getColorModeForColor(color: string): string {
  return PLAN_COLORS.some((paletteColor) => paletteColor.value === color)
    ? color
    : "custom";
}

function getInitialPlans(plansStore: PlansStore) {
  const storedPlans = plansStore.load();

  return sortPlans(storedPlans ?? validatePlanner(demoPlans));
}

export function usePlannerState(plansStore: PlansStore) {
  const [plans, setPlans] = useState<DailyPlan[]>(() => getInitialPlans(plansStore));
  const [form, setForm] = useState<PlanFormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>(null);
  const [recoveryPlanId, setRecoveryPlanId] = useState<string | null>(null);
  const [reflectionNoteDraft, setReflectionNoteDraft] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, [plansStore]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    plansStore.save(plans);
  }, [isHydrated, plans, plansStore]);

  function submitPlan() {
    setPlans(
      submitPlannerPlan({
        createId: () => crypto.randomUUID(),
        editingPlanId,
        form,
        plans,
        recoveryMode,
        recoveryPlanId
      })
    );
    setForm(defaultFormState);
    setEditingPlanId(null);
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);
  }

  function updateForm(values: Partial<PlanFormState>) {
    setForm((currentForm) => ({ ...currentForm, ...values }));
  }

  function togglePlanStatus(id: string) {
    setPlans((currentPlans) => togglePlannerPlanStatus(currentPlans, id));
  }

  function syncPlanStatuses(currentMinute: number) {
    setPlans((currentPlans) => {
      const nextPlans = markMissedPlans(currentPlans, currentMinute);

      return JSON.stringify(nextPlans) === JSON.stringify(currentPlans) ? currentPlans : nextPlans;
    });
  }

  function startReflection(plan: DailyPlan) {
    setRecoveryMode("reflection");
    setRecoveryPlanId(plan.id);
    setReflectionNoteDraft(plan.reflectionNote ?? "");
    setEditingPlanId(null);
    setError(null);
  }

  function saveReflection() {
    if (!recoveryPlanId) {
      return;
    }

    setPlans((currentPlans) =>
      savePlannerReflection(currentPlans, recoveryPlanId, reflectionNoteDraft)
    );
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);
  }

  function startRescheduling(plan: DailyPlan, currentMinute: number | null) {
    const result = startPlannerReschedule({
      currentMinute,
      plan,
      plans
    });

    if (result.kind === "maxed") {
      setError(result.error);
      return "maxed" satisfies StartReschedulingResult;
    }

    if (result.kind === "unavailable") {
      setError(result.error);
      return "unavailable" satisfies StartReschedulingResult;
    }

    setRecoveryMode("reschedule");
    setRecoveryPlanId(plan.id);
    setEditingPlanId(null);
    setForm({
      ...result.formValues,
      colorMode: getColorModeForColor(plan.color)
    });
    setReflectionNoteDraft("");
    setError(null);
    return "started" satisfies StartReschedulingResult;
  }

  function cancelRecovery() {
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);
    setForm(defaultFormState);
  }

  function deletePlan(id: string) {
    if (editingPlanId === id) {
      setEditingPlanId(null);
      setForm(defaultFormState);
    }

    setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== id));
  }

  function startEditingPlan(plan: DailyPlan) {
    setEditingPlanId(plan.id);
    setForm({
      title: plan.title,
      startTime: minuteToTimeString(plan.startMinute),
      endTime: minuteToTimeString(plan.endMinute),
      color: plan.color,
      colorMode: getColorModeForColor(plan.color)
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingPlanId(null);
    setForm(defaultFormState);
    setError(null);
  }

  function createObservationSamplePlan(currentMinute: number | null) {
    const suggestedSlot = findNextAvailableTimeSlot(
      plans,
      OBSERVATION_SAMPLE_DURATION_MINUTES,
      Math.max(0, Math.min(23 * 60, (currentMinute ?? 0) + 10))
    );

    if (!suggestedSlot) {
      setError("관찰 표본용으로 추가할 수 있는 미래 빈 시간이 없습니다.");
      return null;
    }

    const nextSampleNumber =
      plans.filter((plan) => plan.title.startsWith("관찰 표본")).length + 1;
    const nextPlan: DailyPlan = {
      id: crypto.randomUUID(),
      title: `관찰 표본 ${nextSampleNumber}`,
      color: PLAN_COLORS[0].value,
      startMinute: suggestedSlot.startMinute,
      endMinute: suggestedSlot.endMinute,
      rescheduleCount: 0,
      status: "pending"
    };
    const nextPlans = sortPlans(
      validatePlanner([...plans, nextPlan], {
        focusPlanId: nextPlan.id
      })
    );

    setPlans(nextPlans);
    setForm({
      title: nextPlan.title,
      startTime: minuteToTimeString(nextPlan.startMinute),
      endTime: minuteToTimeString(nextPlan.endMinute),
      color: nextPlan.color,
      colorMode: getColorModeForColor(nextPlan.color)
    });
    setEditingPlanId(null);
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);

    return nextPlan;
  }

  return {
    plans,
    form,
    error,
    editingPlanId,
    setError,
    updateForm,
    submitPlan,
    togglePlanStatus,
    syncPlanStatuses,
    recoveryMode,
    recoveryPlanId,
    reflectionNoteDraft,
    setReflectionNoteDraft,
    startReflection,
    saveReflection,
    startRescheduling,
    cancelRecovery,
    deletePlan,
    startEditingPlan,
    cancelEditing,
    createObservationSamplePlan
  };
}
