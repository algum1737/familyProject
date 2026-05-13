"use client";

import { useMemo } from "react";

import { getRescheduleFailureGuidance } from "@/features/planner/core/reschedule-failure-guidance";
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
  const rescheduleFailureGuidance = useMemo(
    () => getRescheduleFailureGuidance(error),
    [error]
  );

  return {
    composerTitle,
    form,
    rescheduleFailureGuidance,
    submitButtonLabel
  };
}
