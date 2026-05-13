"use client";

import { useMemo } from "react";

import { sortPlans } from "@/domains/plans/service/planner";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { TimeSource } from "@/providers/time/time-source";
import { usePlannerRecordSync } from "@/features/planner/app/use-planner-record-sync";
import { usePlannerState } from "@/ui/planner/use-planner-state";
import { useReflectionScreenViewModel } from "@/features/planner/app/use-reflection-screen-view-model";

type UseConnectedReflectionScreenOptions = {
  recordsStore?: PlannerRecordsStore;
  plansStore: PlansStore;
  timeSource: TimeSource;
};

export function useConnectedReflectionScreen({
  recordsStore = localPlannerRecordsStore,
  plansStore,
  timeSource
}: UseConnectedReflectionScreenOptions) {
  const plannerState = usePlannerState(plansStore);
  usePlannerRecordSync({
    plans: plannerState.plans,
    recordsStore,
    timeSource
  });
  const sortedPlans = useMemo(() => sortPlans(plannerState.plans), [plannerState.plans]);
  const recoveryPlan =
    plannerState.recoveryPlanId === null
      ? null
      : sortedPlans.find((plan) => plan.id === plannerState.recoveryPlanId) ?? null;
  const viewModel = useReflectionScreenViewModel({
    recoveryPlan,
    reflectionNoteDraft: plannerState.reflectionNoteDraft
  });

  return {
    reflectionScreenProps: {
      onCancel: plannerState.cancelRecovery,
      onChangeNote: plannerState.setReflectionNoteDraft,
      onSave: plannerState.saveReflection,
      placeholder: viewModel.placeholder,
      recoveryPlanTitle: viewModel.recoveryPlanTitle,
      reflectionNoteDraft: viewModel.reflectionNoteDraft
    }
  };
}
