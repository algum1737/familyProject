"use client";

import { useMemo } from "react";

import type { DailyPlan } from "@/domains/plans/types";

type UseReflectionScreenViewModelOptions = {
  reflectionNoteDraft: string;
  recoveryPlan: DailyPlan | null;
};

export function useReflectionScreenViewModel({
  reflectionNoteDraft,
  recoveryPlan
}: UseReflectionScreenViewModelOptions) {
  return useMemo(
    () => ({
      placeholder: "왜 놓쳤는지, 다음에는 어떻게 바꿀지 적어두세요.",
      recoveryPlanTitle: recoveryPlan?.title ?? "회고 대상 없음",
      reflectionNoteDraft
    }),
    [recoveryPlan?.title, reflectionNoteDraft]
  );
}
