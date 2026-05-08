import { useEffect, useMemo, useState } from "react";

import { getDailySummary } from "../../../../src/domains/plans/selectors/daily-summary";
import { getMonthlyCalendarStatus } from "../../../../src/domains/plans/selectors/monthly-calendar-status";
import { getMonthlyMotivationSummary } from "../../../../src/domains/plans/selectors/monthly-motivation-summary";
import { getRecoveryContributionSummary } from "../../../../src/domains/plans/selectors/recovery-contribution-summary";
import type { DailyPlan, PlannerRecordMap } from "../../../../src/domains/plans/types";
import {
  buildPlannerSummary,
  canTogglePlanStatus,
  getCurrentPlanSnapshot
} from "../../../../src/features/planner/core/planner-core-view-model";
import {
  findActiveEndRecoveryReminder,
  findActiveStartReminder
} from "../../../../src/features/planner/core/planner-reminder-rules";
import {
  createExpoAsyncPlansStore
} from "../providers/plans/expo-async-plans-store";
import {
  createExpoAsyncPlannerRecordsStore
} from "../providers/plans/expo-async-planner-records-store";
import {
  createExpoStartReminderProvider
} from "../providers/reminders/expo-start-reminder-provider";
import {
  defaultExpoPlanFormState,
  useExpoPlannerState
} from "./use-expo-planner-state";
import { useExpoPlannerActions } from "./use-expo-planner-actions";
import {
  buildExpoTodayPlanItems,
  getExpoCurrentPlanTimeText
} from "./expo-planner-preview-presentation";
import {
  createExpoDemoRecords,
  getExpoPlannerDateKey,
  getExpoPlannerMonthKey,
  toExpoDateRecord
} from "./expo-planner-preview-seed";

export function useExpoPlannerPreviewModel() {
  const [now, setNow] = useState(() => new Date());
  const [timeDisplayFormat, setTimeDisplayFormat] = useState<"12h" | "24h">("24h");
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const currentDate = getExpoPlannerDateKey(now);
  const monthKey = getExpoPlannerMonthKey(now);
  const recordsStore = useMemo(() => createExpoAsyncPlannerRecordsStore(), []);
  const reminderProvider = useMemo(() => createExpoStartReminderProvider(), []);
  const plansStore = useMemo(
    () => createExpoAsyncPlansStore({ recordsStore, timeSource: { now: () => new Date() } }),
    [recordsStore]
  );
  const [records, setRecords] = useState<PlannerRecordMap | null>(null);
  const [seedPlans, setSeedPlans] = useState<DailyPlan[]>([]);
  const plannerState = useExpoPlannerState({
    currentDate,
    currentMinute,
    initialPlans: seedPlans,
    plansStore,
    recordsStore
  });
  const plannerActions = useExpoPlannerActions(plannerState);

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

  useEffect(() => {
    let active = true;

    async function load() {
      let loadedRecords = await recordsStore.loadAll();

      if (Object.keys(loadedRecords).length === 0) {
        loadedRecords = createExpoDemoRecords(now);
        await recordsStore.seed(loadedRecords);
      }

      const loadedPlans = await plansStore.load();

      if (!active) {
        return;
      }

      setRecords(loadedRecords);
      setSeedPlans(
        loadedPlans.length > 0
          ? loadedPlans
          : loadedRecords[currentDate]?.map(({ date: _date, ...plan }) => plan) ?? []
      );
    }

    void load();

    return () => {
      active = false;
    };
  }, [currentDate, now, plansStore, recordsStore]);

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
    activeReminderRaw && !plannerState.dismissedReminderIds.includes(activeReminderRaw.id)
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
    !plannerState.dismissedEndRecoveryIds.includes(activeEndRecoveryRaw.id)
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
  const mergedRecords = useMemo(() => {
    const baseRecords = records ?? {};
    return {
      ...baseRecords,
      [currentDate]: toExpoDateRecord(currentDate, plannerState.plans)
    };
  }, [currentDate, plannerState.plans, records]);
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

  return {
    activeEndRecoveryReminder,
    activeReminder,
    canCompleteActiveReminder:
      activeReminder !== null && canTogglePlanStatus(activeReminder, currentMinute),
    currentMinute,
    currentPlan: currentPlanSnapshot.currentPlan,
    currentPlanTimeText: getExpoCurrentPlanTimeText(
      currentPlanSnapshot.currentPlan,
      timeDisplayFormat
    ),
    dailySummary,
    deletePlan: plannerActions.deletePlan,
    error: plannerState.error,
    fieldErrors: plannerState.fieldErrors,
    focusField: plannerState.focusField,
    focusRequest: plannerState.focusRequest,
    form: plannerState.form,
    monthlyCalendar,
    monthlySummary,
    planTitleMaxLength: plannerState.planTitleMaxLength,
    plansStore,
    recoveryMode: plannerState.recoveryMode,
    recoveryPlan: plannerState.recoveryPlan,
    recoverySummary,
    reflectionNoteDraft: plannerState.reflectionNoteDraft,
    reminderProvider,
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
    updateForm: plannerState.updateForm,
    dismissReminder: plannerActions.dismissReminder,
    dismissEndRecovery: plannerActions.dismissEndRecovery,
    saveReflection: plannerState.saveReflection,
    cancelRecovery: plannerActions.cancelRecovery,
    cancelEditing: plannerActions.cancelEditing,
    setReflectionNoteDraft: plannerState.setReflectionNoteDraft,
    defaultFormState: defaultExpoPlanFormState
  };
}
