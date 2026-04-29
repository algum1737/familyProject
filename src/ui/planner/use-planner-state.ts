"use client";

import { useEffect, useState } from "react";

import {
  findNextAvailableTimeSlot,
  markMissedPlans,
  minuteToTimeString,
  sortPlans,
  timeStringToMinute,
  validatePlanner
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
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
    const previousPlan =
      plans.find((plan) => plan.id === editingPlanId) ??
      plans.find((plan) => plan.id === recoveryPlanId);
    const isRescheduling = recoveryMode === "reschedule" && recoveryPlanId !== null;
    const nextPlan: DailyPlan = {
      id: isRescheduling ? crypto.randomUUID() : editingPlanId ?? crypto.randomUUID(),
      title: form.title.trim(),
      color: form.color,
      startMinute: timeStringToMinute(form.startTime),
      endMinute: timeStringToMinute(form.endTime),
      rescheduleCount: isRescheduling ? (previousPlan?.rescheduleCount ?? 0) + 1 : previousPlan?.rescheduleCount ?? 0,
      sourcePlanId:
        isRescheduling && previousPlan
          ? previousPlan.sourcePlanId ?? previousPlan.id
          : previousPlan?.sourcePlanId,
      reflectionNote: previousPlan?.reflectionNote,
      status: "pending"
    };
    const basePlans =
      editingPlanId === null || isRescheduling
        ? plans
        : plans.filter((plan) => plan.id !== editingPlanId);
    const nextPlans = sortPlans(
      validatePlanner(
        [
          ...basePlans,
          {
            ...nextPlan,
            status: isRescheduling ? "pending" : previousPlan?.status ?? "pending"
          }
        ],
        {
          focusPlanId: nextPlan.id
        }
      )
    );

    setPlans(nextPlans);
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
    setPlans((currentPlans) =>
      sortPlans(
        currentPlans.map((plan) =>
          plan.id === id
            ? {
                ...plan,
                status: plan.status === "done" ? "pending" : plan.status === "pending" ? "done" : "missed"
              }
            : plan
        )
      )
    );
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
      currentPlans.map((plan) =>
        plan.id === recoveryPlanId
          ? {
              ...plan,
              reflectionNote: reflectionNoteDraft.trim() || undefined
            }
          : plan
      )
    );
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);
  }

  function startRescheduling(plan: DailyPlan, currentMinute: number | null) {
    if (plan.rescheduleCount >= 3) {
      setError("이 일정은 다시 지정 최대 3회를 모두 사용했습니다.");
      return "maxed" satisfies StartReschedulingResult;
    }

    const duration = plan.endMinute - plan.startMinute;
    const suggestedSlot = findNextAvailableTimeSlot(
      plans.filter((item) => item.id !== plan.id),
      duration,
      Math.max(currentMinute ?? plan.endMinute, plan.endMinute)
    );

    if (!suggestedSlot) {
      setError("오늘 남은 빈 시간에 다시 지정할 수 있는 구간이 없습니다.");
      return "unavailable" satisfies StartReschedulingResult;
    }

    setRecoveryMode("reschedule");
    setRecoveryPlanId(plan.id);
    setEditingPlanId(null);
    setForm({
      title: plan.title,
      startTime: minuteToTimeString(suggestedSlot.startMinute),
      endTime: minuteToTimeString(suggestedSlot.endMinute),
      color: plan.color,
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
    cancelEditing
  };
}
