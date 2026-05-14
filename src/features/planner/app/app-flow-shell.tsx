"use client";

import { useEffect, useMemo, useState } from "react";

import { sortPlans } from "@/domains/plans/service/planner";
import { PlanEditorScreen } from "@/features/planner/app/screens/plan-editor-screen";
import { MotivationScreen } from "@/features/planner/app/screens/motivation-screen";
import { ReflectionScreen } from "@/features/planner/app/screens/reflection-screen";
import { TodayScreen } from "@/features/planner/app/screens/today-screen";
import { useMotivationScreenViewModel } from "@/features/planner/app/use-motivation-screen-view-model";
import { usePlanEditorScreenViewModel } from "@/features/planner/app/use-plan-editor-screen-view-model";
import { useReflectionScreenViewModel } from "@/features/planner/app/use-reflection-screen-view-model";
import { useTodayScreenViewModel } from "@/features/planner/app/use-today-screen-view-model";
import { useCurrentMinute, usePlannerRuntimeSync } from "@/features/planner/core/use-planner-runtime";
import { localPlannerLabelSettingsStore } from "@/providers/labels/local-planner-label-settings";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { createRecordBackedPlansStore } from "@/providers/plans/record-backed-plans";
import { noopReminderProvider } from "@/providers/reminders/noop-reminder-provider";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";
import { usePlannerActions } from "@/ui/planner/use-planner-actions";
import { useEndRecoveryBanner } from "@/ui/planner/use-end-recovery-banner";
import { usePlannerLabelSettings } from "@/ui/planner/use-planner-label-settings";
import { usePlannerObservationLog } from "@/ui/planner/use-planner-observation-log";
import { useReminderBanner } from "@/ui/planner/use-reminder-banner";
import { usePlannerState } from "@/ui/planner/use-planner-state";
import { usePlannerRecordSync } from "@/features/planner/app/use-planner-record-sync";

type ScreenKey = "today" | "editor" | "reflection" | "motivation";

const FLOW_TABS: Array<{
  eyebrow: string;
  key: ScreenKey;
  label: string;
}> = [
  { key: "today", label: "오늘", eyebrow: "T" },
  { key: "editor", label: "편집", eyebrow: "P" },
  { key: "reflection", label: "회고", eyebrow: "R" },
  { key: "motivation", label: "동기", eyebrow: "M" }
];

function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

type AppFlowShellProps = {
  labelSettingsStore?: PlannerLabelSettingsStore;
  recordsStore?: PlannerRecordsStore;
  plansStore?: PlansStore;
  reminderProvider?: ReminderProvider;
  timeSource?: TimeSource;
};

export function AppFlowShell({
  labelSettingsStore = localPlannerLabelSettingsStore,
  recordsStore = localPlannerRecordsStore,
  plansStore,
  reminderProvider = noopReminderProvider,
  timeSource = systemTimeSource
}: AppFlowShellProps) {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<ScreenKey>("today");
  const resolvedPlansStore = useMemo(
    () =>
      plansStore ??
      createRecordBackedPlansStore({
        fallbackStore: localPlansStore,
        recordsStore,
        timeSource
      }),
    [plansStore, recordsStore, timeSource]
  );
  const plannerState = usePlannerState(resolvedPlansStore);
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
  const todayViewModel = useTodayScreenViewModel({
    currentMinute,
    labelSettings,
    plans: sortedPlans
  });
  const observationLog = usePlannerObservationLog({
    activeEndRecoveryReminder,
    activeReminder,
    currentMinute,
    recoveryHighlightItems: todayViewModel.planItems.map((item) => ({
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
    recordEndRecoveryContinue: observationLog.recordEndRecoveryContinue,
    recordReminderCompleted: observationLog.recordReminderCompleted,
    recordReminderDismissed: observationLog.recordReminderDismissed,
    recordRescheduleUnavailable: observationLog.recordRescheduleUnavailable,
    reminderProvider
  });
  const recoveryPlan =
    plannerState.recoveryPlanId === null
      ? null
      : sortedPlans.find((plan) => plan.id === plannerState.recoveryPlanId) ?? null;
  const editorViewModel = usePlanEditorScreenViewModel({
    editingPlanId: plannerState.editingPlanId,
    error: plannerState.error,
    form: plannerState.form,
    recoveryMode: plannerState.recoveryMode
  });
  const reflectionViewModel = useReflectionScreenViewModel({
    recoveryPlan,
    reflectionNoteDraft: plannerState.reflectionNoteDraft
  });
  const motivationViewModel = useMotivationScreenViewModel({
    monthKey: getMonthKey(timeSource.now()),
    records: recordsStore.loadAll()
  });

  usePlannerRuntimeSync({
    currentMinute,
    plans: sortedPlans,
    reminderProvider,
    syncPlanStatuses: plannerState.syncPlanStatuses,
    timeSource
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return (
    <main className="shell app-flow-shell">
      <section className="app-flow-header">
        <p className="app-screen-eyebrow">오늘 다 했니</p>
        <h1>오늘 계획 흐름</h1>
        <p className="app-screen-subtitle">
          오늘 계획을 만들고, 놓친 일은 회고하거나 다시 지정할 수 있습니다.
        </p>
        <div className="app-flow-context">
          <span className="app-flow-context-chip">Active</span>
          <strong>{FLOW_TABS.find((tab) => tab.key === screen)?.label ?? "오늘"}</strong>
        </div>
      </section>

      <section className="app-flow-stage">
        <div className="app-flow-stage-body">
          {screen === "today" ? (
            <TodayScreen
              currentMinute={currentMinute}
              labelSettings={labelSettings}
              onContinueEndRecovery={plannerActions.dismissActiveEndRecoveryReminder}
              onDismissReminder={plannerActions.dismissActiveReminder}
              onOpenReflection={(planId) => {
                const plan = sortedPlans.find((item) => item.id === planId);

                if (!plan) {
                  return;
                }

                plannerActions.startReflection(plan);
                setScreen("reflection");
              }}
              onOpenReschedule={(planId) => {
                const plan = sortedPlans.find((item) => item.id === planId);

                if (!plan) {
                  return;
                }

                const result = plannerActions.startRescheduling(plan);

                if (result === "started") {
                  setScreen("editor");
                }
              }}
              onTogglePlanStatus={plannerActions.togglePlanStatus}
              plans={sortedPlans}
            />
          ) : null}

          {screen === "editor" ? (
            <PlanEditorScreen
              composerTitle={editorViewModel.composerTitle}
              error={plannerState.error}
              form={editorViewModel.form}
              onCancel={() => {
                if (plannerState.recoveryMode === "reschedule") {
                  plannerState.cancelRecovery();
                } else {
                  plannerState.cancelEditing();
                }

                setScreen("today");
              }}
              onSubmit={() => {
                plannerState.submitPlan();
                setScreen("today");
              }}
              onUpdateForm={plannerState.updateForm}
              rescheduleFailureGuidance={editorViewModel.rescheduleFailureGuidance}
              submitButtonLabel={editorViewModel.submitButtonLabel}
            />
          ) : null}

          {screen === "reflection" ? (
            <ReflectionScreen
              onCancel={() => {
                plannerState.cancelRecovery();
                setScreen("today");
              }}
              onChangeNote={plannerState.setReflectionNoteDraft}
              onSave={() => {
                plannerState.saveReflection();
                setScreen("today");
              }}
              placeholder={reflectionViewModel.placeholder}
              recoveryPlanTitle={reflectionViewModel.recoveryPlanTitle}
              reflectionNoteDraft={reflectionViewModel.reflectionNoteDraft}
            />
          ) : null}

          {screen === "motivation" ? (
            <MotivationScreen
              calendarDays={motivationViewModel.calendarDays}
              monthKey={motivationViewModel.monthKey}
              recoverySummary={motivationViewModel.recoverySummary}
              summary={motivationViewModel.summary}
            />
          ) : null}
        </div>

        <div className="app-flow-tabs" role="tablist" aria-label="App flow screens">
          {FLOW_TABS.map((tab) => (
            <button
              aria-selected={screen === tab.key}
              className={`app-flow-tab${screen === tab.key ? " app-flow-tab-active" : ""}`}
              key={tab.key}
              onClick={() => setScreen(tab.key)}
              type="button"
            >
              <span className="app-flow-tab-badge">{tab.eyebrow}</span>
              <span className="app-flow-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
