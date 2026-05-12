"use client";

import { useMemo } from "react";

import { buildPlannerRecordMapForDate, useMotivationScreenViewModel } from "@/features/planner/app/use-motivation-screen-view-model";
import { usePlannerRecordSync } from "@/features/planner/app/use-planner-record-sync";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { TimeSource } from "@/providers/time/time-source";
import { usePlannerState } from "@/ui/planner/use-planner-state";

type UseConnectedMotivationScreenOptions = {
  recordsStore: PlannerRecordsStore;
  plansStore: PlansStore;
  timeSource: TimeSource;
};

export function useConnectedMotivationScreen({
  recordsStore,
  plansStore
  ,
  timeSource
}: UseConnectedMotivationScreenOptions) {
  const plannerState = usePlannerState(plansStore);
  const { dateKey } = usePlannerRecordSync({
    plans: plannerState.plans,
    recordsStore,
    timeSource
  });
  const monthKey = dateKey.slice(0, 7);
  const records = useMemo(
    () => ({
      ...recordsStore.loadAll(),
      ...buildPlannerRecordMapForDate(dateKey, plannerState.plans)
    }),
    [dateKey, plannerState.plans, recordsStore]
  );
  const viewModel = useMotivationScreenViewModel({
    monthKey,
    records
  });

  return {
    motivationScreenProps: {
      calendarDays: viewModel.calendarDays,
      monthKey: viewModel.monthKey,
      recoverySummary: viewModel.recoverySummary,
      summary: viewModel.summary
    }
  };
}
