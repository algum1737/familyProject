"use client";

import { useMemo } from "react";

import { sortPlans } from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import type { PlansStore } from "@/providers/plans/plans-store";
import { type ReminderObservation } from "@/providers/reminders/reminder-observation-store";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { TimeSource } from "@/providers/time/time-source";
import {
  buildPlannerPlanItemCoreModels,
  buildPlannerSummary,
  getCurrentPlanSnapshot
} from "@/features/planner/core/planner-core-view-model";
import {
  useCurrentMinute,
  usePlannerRuntimeSync
} from "@/features/planner/core/use-planner-runtime";
import {
  getRecoveryObservationListItems,
  getRecoveryObservationHint,
  getRecoveryObservationPolicyStatus,
  getRecoveryObservationRecommendation,
  getRecoveryObservationSummaryItems,
  getRecoveryObservationWindowText,
  getReminderObservationListItems,
  getReminderObservationHint,
  getReminderObservationPolicyStatus,
  getReminderObservationSummaryItems,
  getReminderObservationWindowText,
  type ObservationPolicyStatus,
  type ObservationSummaryItem
} from "@/features/planner/web/planner-web-observation";
import {
  buildPlannerPlanItemPresentation,
  getComposerTitle,
  getCurrentPlanTimeText,
  getListCurrentTimeText,
  getPlanTimeText,
  getSubmitButtonLabel
} from "@/features/planner/web/planner-web-presentation";
import { useEndRecoveryBanner } from "@/ui/planner/use-end-recovery-banner";
import { usePlannerActions } from "@/ui/planner/use-planner-actions";
import { usePlannerLabelSettings } from "@/ui/planner/use-planner-label-settings";
import { usePlannerObservationLog } from "@/ui/planner/use-planner-observation-log";
import { useReminderBanner } from "@/ui/planner/use-reminder-banner";
import { usePlannerState } from "@/ui/planner/use-planner-state";

type UsePlannerViewModelOptions = {
  labelSettingsStore: PlannerLabelSettingsStore;
  plansStore: PlansStore;
  reminderProvider: ReminderProvider;
  timeSource: TimeSource;
};

type PlannerListItem = {
  canToggleStatus: boolean;
  canReschedule: boolean;
  isCurrent: boolean;
  plan: DailyPlan;
  recoveryBadges: string[];
  rescheduleBlockedReason: string | null;
  recoveryHighlight: {
    detail: string;
    label: string;
    tone: "active" | "review" | "watch";
  } | null;
  reflectionPreview: string | null;
  statusLabel: string;
  timeText: string;
};

type ReminderObservationSummaryItem = ObservationSummaryItem;
type ReminderPolicyStatus = ObservationPolicyStatus;
type RecoveryObservationSummaryItem = ObservationSummaryItem;
type RecoveryObservationPolicyStatus = ObservationPolicyStatus;

export function usePlannerViewModel({
  labelSettingsStore,
  plansStore,
  reminderProvider,
  timeSource
}: UsePlannerViewModelOptions) {
  const plannerState = usePlannerState(plansStore);
  const { labelSettings, resetLabelSettings, saveLabelSettings } = usePlannerLabelSettings(
    labelSettingsStore
  );
  const currentMinute = useCurrentMinute(timeSource);
  const sortedPlans = useMemo(() => sortPlans(plannerState.plans), [plannerState.plans]);
  const { currentPlan, isCurrentMinuteReady, resolvedCurrentMinute } = getCurrentPlanSnapshot(
    sortedPlans,
    currentMinute
  );
  const summary = buildPlannerSummary(plannerState.plans);
  const { activeReminder, dismissReminder } = useReminderBanner(sortedPlans, currentMinute);
  const { activeEndRecoveryReminder, dismissEndRecoveryReminder } = useEndRecoveryBanner(
    sortedPlans,
    currentMinute
  );
  const planItemCoreModels = useMemo(
    () => buildPlannerPlanItemCoreModels(sortedPlans, currentMinute),
    [currentMinute, sortedPlans]
  );

  const planItems = useMemo<PlannerListItem[]>(
    () =>
      planItemCoreModels.map((item) =>
        buildPlannerPlanItemPresentation(item, labelSettings)
      ),
    [labelSettings, planItemCoreModels]
  );
  const {
    clearRecoveryObservationLog,
    clearReminderObservationLog,
    recordEndRecoveryContinue,
    recordReminderCompleted,
    recordReminderDismissed,
    recordRescheduleUnavailable,
    recoveryHighlightObservations,
    reminderObservations
  } = usePlannerObservationLog({
    activeEndRecoveryReminder,
    activeReminder,
    currentMinute,
    recoveryHighlightItems: planItems.map((item) => ({
      plan: item.plan,
      recoveryHighlightLabel: item.recoveryHighlight?.label ?? null
    })),
    timeSource
  });
  const plannerActions = usePlannerActions({
    activeReminder,
    currentMinute,
    dismissEndRecoveryReminder,
    dismissReminder,
    plannerState,
    plans: sortedPlans,
    recordEndRecoveryContinue,
    recordReminderCompleted,
    recordReminderDismissed,
    recordRescheduleUnavailable,
    reminderProvider
  });
  const currentPlanTimeText = getCurrentPlanTimeText(currentPlan, isCurrentMinuteReady);
  const reminderTimeText = activeReminder
    ? getPlanTimeText(activeReminder.startMinute, activeReminder.endMinute)
    : null;
  const endRecoveryReminderTimeText = activeEndRecoveryReminder
    ? getPlanTimeText(activeEndRecoveryReminder.startMinute, activeEndRecoveryReminder.endMinute)
    : null;
  const canCompleteActiveReminder =
    activeReminder !== null &&
    currentMinute !== null &&
    currentMinute >= activeReminder.startMinute;
  const composerTitle = getComposerTitle({
    editingPlanId: plannerState.editingPlanId,
    recoveryMode: plannerState.recoveryMode
  });
  const submitButtonLabel = getSubmitButtonLabel({
    editingPlanId: plannerState.editingPlanId,
    recoveryMode: plannerState.recoveryMode
  });
  const listCurrentTimeText = getListCurrentTimeText(currentMinute, resolvedCurrentMinute);
  const recoveryPlan =
    plannerState.recoveryPlanId === null
      ? null
      : sortedPlans.find((plan) => plan.id === plannerState.recoveryPlanId) ?? null;
  usePlannerRuntimeSync({
    currentMinute,
    plans: sortedPlans,
    reminderProvider,
    syncPlanStatuses: plannerState.syncPlanStatuses,
    timeSource
  });

  const reminderObservationItems = useMemo(
    () => getReminderObservationListItems(reminderObservations),
    [reminderObservations]
  );
  const reminderObservationWindowText = useMemo(
    () => getReminderObservationWindowText(reminderObservations),
    [reminderObservations]
  );
  const reminderObservationSummaryItems = useMemo<ReminderObservationSummaryItem[]>(
    () => getReminderObservationSummaryItems(reminderObservations),
    [reminderObservations]
  );
  const reminderPolicyStatus = useMemo<ReminderPolicyStatus>(
    () => getReminderObservationPolicyStatus(reminderObservations),
    [reminderObservations]
  );
  const reminderObservationHint = useMemo(
    () => getReminderObservationHint(reminderObservations),
    [reminderObservations]
  );
  const recoveryHighlightObservationItems = useMemo(
    () => getRecoveryObservationListItems(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationSummaryItems = useMemo<RecoveryObservationSummaryItem[]>(
    () => getRecoveryObservationSummaryItems(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationWindowText = useMemo(
    () => getRecoveryObservationWindowText(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationPolicyStatus = useMemo<RecoveryObservationPolicyStatus>(
    () => getRecoveryObservationPolicyStatus(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationHint = useMemo(
    () => getRecoveryObservationHint(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationRecommendation = useMemo(
    () => getRecoveryObservationRecommendation(recoveryHighlightObservations),
    [recoveryHighlightObservations]
  );

  return {
    ...plannerState,
    activeEndRecoveryReminder,
    activeReminder,
    clearObservationLog: clearReminderObservationLog,
    canCompleteActiveReminder,
    composerTitle,
    currentMinute,
    isCurrentMinuteReady,
    currentPlan,
    currentPlanTimeText,
    deletePlan: plannerActions.deletePlan,
    dismissActiveEndRecoveryReminder: plannerActions.dismissActiveEndRecoveryReminder,
    dismissActiveReminder: plannerActions.dismissActiveReminder,
    endRecoveryReminderTimeText,
    labelSettings,
    listCurrentTimeText,
    planItems,
    recoveryPlan,
    recoveryHighlightObservationHint,
    recoveryHighlightObservationItems,
    recoveryHighlightObservationPolicyStatus,
    recoveryHighlightObservationRecommendation,
    recoveryHighlightObservationSummaryItems,
    recoveryHighlightObservationWindowText,
    reminderObservationHint,
    reminderObservationItems,
    reminderObservationWindowText,
    reminderObservationSummaryItems,
    reminderPolicyStatus,
    resolvedCurrentMinute,
    reminderTimeText,
    resetLabelSettings,
    clearRecoveryObservationLog,
    saveReflection: plannerState.saveReflection,
    sortedPlans,
    startReflection: plannerActions.startReflection,
    startRescheduling: plannerActions.startRescheduling,
    submitButtonLabel,
    summary,
    togglePlanStatus: plannerActions.togglePlanStatus,
    saveLabelSettings,
  };
}
