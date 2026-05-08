"use client";

import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { TimeSource } from "@/providers/time/time-source";
import { usePlannerRecordSync } from "@/features/planner/app/use-planner-record-sync";
import { useCurrentMinute } from "@/features/planner/core/use-planner-runtime";
import { usePlannerLabelSettings } from "@/ui/planner/use-planner-label-settings";
import { usePlannerState } from "@/ui/planner/use-planner-state";
import { usePlanEditorScreenViewModel } from "@/features/planner/app/use-plan-editor-screen-view-model";

type UseConnectedPlanEditorScreenOptions = {
  labelSettingsStore: PlannerLabelSettingsStore;
  plansStore: PlansStore;
  recordsStore?: PlannerRecordsStore;
  timeSource: TimeSource;
};

export function useConnectedPlanEditorScreen({
  labelSettingsStore,
  plansStore,
  recordsStore = localPlannerRecordsStore,
  timeSource
}: UseConnectedPlanEditorScreenOptions) {
  const plannerState = usePlannerState(plansStore);
  const { labelSettings } = usePlannerLabelSettings(labelSettingsStore);
  useCurrentMinute(timeSource);
  usePlannerRecordSync({
    plans: plannerState.plans,
    recordsStore,
    timeSource
  });
  const viewModel = usePlanEditorScreenViewModel({
    editingPlanId: plannerState.editingPlanId,
    error: plannerState.error,
    form: plannerState.form,
    labelSettings,
    recoveryMode: plannerState.recoveryMode
  });

  return {
    planEditorScreenProps: {
      composerTitle: viewModel.composerTitle,
      error: plannerState.error,
      form: viewModel.form,
      onCancel:
        plannerState.recoveryMode === "reschedule"
          ? plannerState.cancelRecovery
          : plannerState.cancelEditing,
      onSubmit: plannerState.submitPlan,
      onUpdateForm: plannerState.updateForm,
      showRescheduleUnavailableGuidance: viewModel.showRescheduleUnavailableGuidance,
      submitButtonLabel: viewModel.submitButtonLabel
    }
  };
}
