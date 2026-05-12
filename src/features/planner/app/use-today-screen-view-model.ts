"use client";

import { useMemo } from "react";

import type { DailyPlan } from "@/domains/plans/types";
import {
  buildPlannerPlanItemCoreModels,
  buildPlannerSummary,
  canTogglePlanStatus,
  getCurrentPlanSnapshot
} from "@/features/planner/core/planner-core-view-model";
import {
  findActiveEndRecoveryReminder,
  findActiveStartReminder
} from "@/features/planner/core/planner-reminder-rules";
import {
  buildPlannerPlanItemPresentation,
  getCurrentPlanTimeText,
  getPlanTimeText
} from "@/features/planner/web/planner-web-presentation";
import {
  defaultPlannerLabelSettings,
  type PlannerLabelSettings
} from "@/providers/labels/planner-label-settings";

type UseTodayScreenViewModelOptions = {
  currentMinute?: number | null;
  labelSettings?: PlannerLabelSettings;
  plans?: DailyPlan[];
};

export function useTodayScreenViewModel({
  currentMinute = null,
  labelSettings = defaultPlannerLabelSettings,
  plans = []
}: UseTodayScreenViewModelOptions) {
  const summary = useMemo(() => buildPlannerSummary(plans), [plans]);
  const currentPlanSnapshot = useMemo(
    () => getCurrentPlanSnapshot(plans, currentMinute),
    [currentMinute, plans]
  );
  const activeReminder = useMemo(
    () => findActiveStartReminder(plans, currentMinute),
    [currentMinute, plans]
  );
  const activeEndRecoveryReminder = useMemo(
    () =>
      activeReminder === null ? findActiveEndRecoveryReminder(plans, currentMinute) : null,
    [activeReminder, currentMinute, plans]
  );
  const planItems = useMemo(
    () =>
      buildPlannerPlanItemCoreModels(plans, currentMinute).map((item) =>
        buildPlannerPlanItemPresentation(item, labelSettings)
      ),
    [currentMinute, labelSettings, plans]
  );
  const highlightedRecoveryItem = useMemo(
    () => planItems.find((item) => item.recoveryHighlight) ?? null,
    [planItems]
  );

  return {
    activeEndRecoveryReminder,
    activeReminder,
    canCompleteActiveReminder:
      activeReminder !== null && canTogglePlanStatus(activeReminder, currentMinute),
    currentPlan: currentPlanSnapshot.currentPlan,
    currentPlanTimeText: getCurrentPlanTimeText(
      currentPlanSnapshot.currentPlan,
      currentPlanSnapshot.isCurrentMinuteReady
    ),
    highlightedRecoveryItem,
    planItems,
    reminderTimeText: activeReminder
      ? getPlanTimeText(activeReminder.startMinute, activeReminder.endMinute)
      : null,
    summary,
    endRecoveryReminderTimeText: activeEndRecoveryReminder
      ? getPlanTimeText(
          activeEndRecoveryReminder.startMinute,
          activeEndRecoveryReminder.endMinute
        )
      : null
  };
}
