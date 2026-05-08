"use client";

import { useMemo } from "react";

import { RESCHEDULE_UNAVAILABLE_MESSAGE } from "@/features/planner/core/planner-state-transitions";
import type { PlannerLabelSettings } from "@/providers/labels/planner-label-settings";
import type { PlanFormState } from "@/ui/planner/use-planner-state";
import {
  getComposerTitle,
  getSubmitButtonLabel
} from "@/features/planner/web/planner-web-presentation";

type UsePlanEditorScreenViewModelOptions = {
  editingPlanId: string | null;
  error: string | null;
  form: PlanFormState;
  labelSettings?: PlannerLabelSettings;
  recoveryMode: "reflection" | "reschedule" | null;
};

export function usePlanEditorScreenViewModel({
  editingPlanId,
  error,
  form,
  recoveryMode
}: UsePlanEditorScreenViewModelOptions) {
  const composerTitle = useMemo(
    () => getComposerTitle({ editingPlanId, recoveryMode }),
    [editingPlanId, recoveryMode]
  );
  const submitButtonLabel = useMemo(
    () => getSubmitButtonLabel({ editingPlanId, recoveryMode }),
    [editingPlanId, recoveryMode]
  );

  return {
    composerTitle,
    form,
    showRescheduleUnavailableGuidance: error === RESCHEDULE_UNAVAILABLE_MESSAGE,
    submitButtonLabel
  };
}
