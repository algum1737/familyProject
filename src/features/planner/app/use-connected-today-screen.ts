"use client";

import { useMemo } from "react";

import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { TimeSource } from "@/providers/time/time-source";
import { useCurrentMinute, usePlannerRuntimeSync } from "@/features/planner/core/use-planner-runtime";
import { usePlannerActions } from "@/ui/planner/use-planner-actions";
import { useEndRecoveryBanner } from "@/ui/planner/use-end-recovery-banner";
import { usePlannerLabelSettings } from "@/ui/planner/use-planner-label-settings";
import { usePlannerObservationLog } from "@/ui/planner/use-planner-observation-log";
import { useReminderBanner } from "@/ui/planner/use-reminder-banner";
import { usePlannerState } from "@/ui/planner/use-planner-state";
import { sortPlans } from "@/domains/plans/service/planner";
import { useTodayScreenViewModel } from "@/features/planner/app/use-today-screen-view-model";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { usePlannerRecordSync } from "@/features/planner/app/use-planner-record-sync";

type UseConnectedTodayScreenOptions = {
  labelSettingsStore: PlannerLabelSettingsStore;
  plansStore: PlansStore;
  recordsStore?: PlannerRecordsStore;
  reminderProvider: ReminderProvider;
  timeSource: TimeSource;
};

export function useConnectedTodayScreen({
  labelSettingsStore,
  plansStore,
  recordsStore = localPlannerRecordsStore,
  reminderProvider,
  timeSource
}: UseConnectedTodayScreenOptions) {
  const plannerState = usePlannerState(plansStore);
  const { labelSettings } = usePlannerLabelSettings(labelSettingsStore);
  const currentMinute = useCurrentMinute(timeSource);
  const sortedPlans = useMemo(() => sortPlans(plannerState.plans), [plannerState.plans]);
  usePlannerRecordSync({
    plans: sortedPlans,
    recordsStore,
    timeSource
  });
  const { activeReminder, dismissReminder } = useReminderBanner(sortedPlans, currentMinute);
  const { activeEndRecoveryReminder, dismissEndRecoveryReminder } = useEndRecoveryBanner(
    sortedPlans,
    currentMinute
  );
  const viewModel = useTodayScreenViewModel({
    currentMinute,
    labelSettings,
    plans: sortedPlans
  });
  const observationLog = usePlannerObservationLog({
    activeEndRecoveryReminder,
    activeReminder,
    currentMinute,
    recoveryHighlightItems: viewModel.planItems.map((item) => ({
      plan: item.plan,
      recoveryHighlightLabel: item.recoveryHighlight?.label ?? null
    })),
    timeSource
  });
  const actions = usePlannerActions({
    activeReminder,
    currentMinute,
    dismissEndRecoveryReminder,
    dismissReminder,
    plannerState,
    plans: sortedPlans,
    recordEndRecoveryContinue: observationLog.recordEndRecoveryContinue,
    recordReminderCompleted: observationLog.recordReminderCompleted,
    recordReminderDismissed: observationLog.recordReminderDismissed,
    recordRescheduleUnavailable: observationLog.recordRescheduleUnavailable,
    reminderProvider
  });

  usePlannerRuntimeSync({
    currentMinute,
    plans: sortedPlans,
    reminderProvider,
    syncPlanStatuses: plannerState.syncPlanStatuses,
    timeSource
  });

  return {
    currentMinute,
    labelSettings,
    plans: sortedPlans,
    todayScreenProps: {
      currentMinute,
      labelSettings,
      onContinueEndRecovery: actions.dismissActiveEndRecoveryReminder,
      onDismissReminder: actions.dismissActiveReminder,
      onOpenReflection: (planId: string) => {
        const plan = sortedPlans.find((item) => item.id === planId);

        if (plan) {
          actions.startReflection(plan);
        }
      },
      onOpenReschedule: (planId: string) => {
        const plan = sortedPlans.find((item) => item.id === planId);

        if (plan) {
          actions.startRescheduling(plan);
        }
      },
      onTogglePlanStatus: actions.togglePlanStatus,
      plans: sortedPlans
    }
  };
}
