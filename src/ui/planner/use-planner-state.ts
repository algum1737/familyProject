"use client";

import { useEffect, useState } from "react";

import {
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

function getColorModeForColor(color: string): string {
  return PLAN_COLORS.some((paletteColor) => paletteColor.value === color)
    ? color
    : "custom";
}

export function usePlannerState(plansStore: PlansStore) {
  const [plans, setPlans] = useState<DailyPlan[]>(() => validatePlanner(demoPlans));
  const [form, setForm] = useState<PlanFormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  useEffect(() => {
    const storedPlans = plansStore.load();

    if (storedPlans) {
      setPlans(sortPlans(storedPlans));
    }

    setIsHydrated(true);
  }, [plansStore]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    plansStore.save(plans);
  }, [isHydrated, plans, plansStore]);

  function submitPlan() {
    const nextPlan: DailyPlan = {
      id: editingPlanId ?? crypto.randomUUID(),
      title: form.title.trim(),
      color: form.color,
      startMinute: timeStringToMinute(form.startTime),
      endMinute: timeStringToMinute(form.endTime),
      status: "pending"
    };
    const basePlans =
      editingPlanId === null ? plans : plans.filter((plan) => plan.id !== editingPlanId);
    const previousPlan = plans.find((plan) => plan.id === editingPlanId);
    const nextPlans = sortPlans(
      validatePlanner(
        [
          ...basePlans,
          {
            ...nextPlan,
            status: previousPlan?.status ?? "pending"
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
            ? { ...plan, status: plan.status === "done" ? "pending" : "done" }
            : plan
        )
      )
    );
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
    deletePlan,
    startEditingPlan,
    cancelEditing
  };
}
