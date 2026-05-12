import { useEffect, useMemo, useState } from "react";

import { getDailySummary } from "../../../../src/domains/plans/selectors/daily-summary";
import { getMonthlyCalendarStatus } from "../../../../src/domains/plans/selectors/monthly-calendar-status";
import { getMonthlyMotivationSummary } from "../../../../src/domains/plans/selectors/monthly-motivation-summary";
import { getRecoveryContributionSummary } from "../../../../src/domains/plans/selectors/recovery-contribution-summary";
import {
  buildPlannerSummary,
  canTogglePlanStatus,
  getCurrentPlanSnapshot
} from "../../../../src/features/planner/core/planner-core-view-model";
import {
  findActiveEndRecoveryReminder,
  findActiveStartReminder,
  isEndRecoveryReminderDismissed,
  isStartReminderDismissed
} from "../../../../src/features/planner/core/planner-reminder-rules";
import { createExpoAsyncPlansStore } from "../providers/plans/expo-async-plans-store";
import { createExpoAsyncPlannerRecordsStore } from "../providers/plans/expo-async-planner-records-store";
import { createExpoStartReminderProvider } from "../providers/reminders/expo-start-reminder-provider";
import {
  buildExpoTodayPlanItems,
  getExpoCurrentPlanTimeText
} from "./expo-planner-preview-presentation";
import { buildExpoMergedPlannerRecords } from "./expo-monthly-records";
import {
  defaultExpoPlanFormState,
  useExpoPlannerState
} from "./use-expo-planner-state";
import type { ExpoPlannerShellModel } from "./expo-planner-shell-model";
import { getExpoPlannerDateKey, getExpoPlannerMonthKey, toExpoDateRecord } from "./expo-planner-preview-seed";
import { useExpoAppBootstrap } from "./use-expo-app-bootstrap";
import { useExpoPlannerActions } from "./use-expo-planner-actions";

export function useExpoAppModel(): ExpoPlannerShellModel & {
  bootstrapError: string | null;
  bootstrapSource: "empty" | "legacy-migrated" | "records-restored" | null;
  bootstrapStatus: "error" | "loading" | "ready";
} {
  const [now, setNow] = useState(() => new Date());
  const [timeDisplayFormat, setTimeDisplayFormat] = useState<"12h" | "24h">("24h");
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const currentDate = getExpoPlannerDateKey(now);
  const monthKey = getExpoPlannerMonthKey(now);
  const recordsStore = useMemo(() => createExpoAsyncPlannerRecordsStore(), []);
  const reminderProvider = useMemo(() => createExpoStartReminderProvider(), []);

  useEffect(() => {
    const syncNow = () => {
      setNow(new Date());
    };

    syncNow();
    const timer = window.setInterval(syncNow, 10_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);
  const plansStore = useMemo(
    () => createExpoAsyncPlansStore({ recordsStore, timeSource: { now: () => new Date() } }),
    [recordsStore]
  );
  const bootstrap = useExpoAppBootstrap({
    currentDate,
    plansStore,
    recordsStore
  });
  const persistenceToken = useMemo(() => {
    if (bootstrap.status !== "ready") {
      return null;
    }

    return JSON.stringify({
      currentDate,
      plans: bootstrap.initialPlans,
      source: bootstrap.source
    });
  }, [bootstrap.initialPlans, bootstrap.source, bootstrap.status, currentDate]);
  const plannerState = useExpoPlannerState({
    currentDate,
    currentMinute,
    initialPlans: bootstrap.initialPlans,
    persistenceToken,
    plansStore,
    recordsStore
  });
  const plannerActions = useExpoPlannerActions(plannerState);

  const summary = useMemo(() => buildPlannerSummary(plannerState.plans), [plannerState.plans]);
  const currentPlanSnapshot = useMemo(
    () => getCurrentPlanSnapshot(plannerState.plans, currentMinute),
    [currentMinute, plannerState.plans]
  );
  const activeReminderRaw = useMemo(
    () => findActiveStartReminder(plannerState.plans, currentMinute),
    [currentMinute, plannerState.plans]
  );
  const activeReminder =
    activeReminderRaw &&
    !isStartReminderDismissed(plannerState.dismissedReminderIds, activeReminderRaw)
      ? activeReminderRaw
      : null;
  const activeEndRecoveryRaw = useMemo(
    () =>
      activeReminder === null
        ? findActiveEndRecoveryReminder(plannerState.plans, currentMinute)
        : null,
    [activeReminder, currentMinute, plannerState.plans]
  );
  const activeEndRecoveryReminder =
    activeEndRecoveryRaw &&
    !isEndRecoveryReminderDismissed(
      plannerState.dismissedEndRecoveryIds,
      activeEndRecoveryRaw
    )
      ? activeEndRecoveryRaw
      : null;
  const todayPlanItems = useMemo(
    () => buildExpoTodayPlanItems(plannerState.plans, currentMinute, timeDisplayFormat),
    [currentMinute, plannerState.plans, timeDisplayFormat]
  );
  const dailySummary = useMemo(
    () => getDailySummary(toExpoDateRecord(currentDate, plannerState.plans)),
    [currentDate, plannerState.plans]
  );
  const mergedRecords = useMemo(
    () =>
      buildExpoMergedPlannerRecords({
        currentDate,
        currentPlans: plannerState.plans,
        records: bootstrap.records
      }),
    [bootstrap.records, currentDate, plannerState.plans]
  );
  const monthlySummary = useMemo(
    () => getMonthlyMotivationSummary(monthKey, mergedRecords),
    [mergedRecords, monthKey]
  );
  const monthlyCalendar = useMemo(
    () => getMonthlyCalendarStatus(monthKey, mergedRecords),
    [mergedRecords, monthKey]
  );
  const recoverySummary = useMemo(
    () => getRecoveryContributionSummary(monthKey, mergedRecords),
    [mergedRecords, monthKey]
  );

  useEffect(() => {
    void reminderProvider.sync(plannerState.plans, now);
  }, [now, plannerState.plans, reminderProvider]);

  return {
    activeEndRecoveryReminder,
    activeReminder,
    bootstrapError: bootstrap.error,
    bootstrapSource: bootstrap.source,
    bootstrapStatus: bootstrap.status,
    canCompleteActiveReminder:
      activeReminder !== null && canTogglePlanStatus(activeReminder, currentMinute),
    cancelEditing: plannerActions.cancelEditing,
    cancelRecovery: plannerActions.cancelRecovery,
    currentMinute,
    currentPlan: currentPlanSnapshot.currentPlan,
    currentPlanTimeText: getExpoCurrentPlanTimeText(
      currentPlanSnapshot.currentPlan,
      timeDisplayFormat
    ),
    dailySummary,
    defaultFormState: defaultExpoPlanFormState,
    deletePlan: plannerActions.deletePlan,
    dismissEndRecovery: plannerActions.dismissEndRecovery,
    dismissReminder: plannerActions.dismissReminder,
    error: plannerState.error,
    fieldErrors: plannerState.fieldErrors,
    focusField: plannerState.focusField,
    focusRequest: plannerState.focusRequest,
    form: plannerState.form,
    monthlyCalendar,
    monthlySummary,
    planTitleMaxLength: plannerState.planTitleMaxLength,
    recoveryMode: plannerState.recoveryMode,
    recoveryPlan: plannerState.recoveryPlan,
    recoverySummary,
    reflectionNoteDraft: plannerState.reflectionNoteDraft,
    saveReflection: plannerState.saveReflection,
    setReflectionNoteDraft: plannerState.setReflectionNoteDraft,
    setTimeDisplayFormat,
    startCreatePlan: plannerActions.startCreatePlan,
    startEditingPlan: plannerActions.startEditingPlan,
    startReflection: plannerActions.startReflection,
    startRescheduling: plannerActions.startRescheduling,
    submitPlan: plannerState.submitPlan,
    summary,
    timeDisplayFormat,
    todayPlanItems,
    todayPlans: plannerState.plans,
    togglePlanStatus: plannerState.togglePlanStatus,
    updateForm: plannerState.updateForm
  };
}
