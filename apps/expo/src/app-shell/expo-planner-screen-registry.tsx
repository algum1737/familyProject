import type { ReactNode } from "react";

import { getRescheduleFailureGuidance } from "../../../../src/features/planner/core/reschedule-failure-guidance";
import { ExpoMotivationScreen } from "../screens/motivation-screen";
import { ExpoPlanEditorScreen } from "../screens/plan-editor-screen";
import { ExpoReflectionScreen } from "../screens/reflection-screen";
import { ExpoTodayScreen } from "../screens/today-screen";
import type { ScreenKey } from "./flow-tabs";
import type { ExpoPlannerShellModel } from "./expo-planner-shell-model";
import type { useExpoPlannerFlow } from "./use-expo-planner-flow";

type ExpoPlannerFlow = ReturnType<typeof useExpoPlannerFlow>;

export function renderExpoPlannerScreen(options: {
  flow: ExpoPlannerFlow;
  model: ExpoPlannerShellModel;
  screen: ScreenKey;
}): ReactNode {
  const { flow, model, screen } = options;
  const rescheduleFailureGuidance = getRescheduleFailureGuidance(model.error);

  const screens: Record<ScreenKey, ReactNode> = {
    editor: (
      <ExpoPlanEditorScreen
        error={model.error}
        fieldErrors={model.fieldErrors}
        focusField={model.focusField}
        focusRequest={model.focusRequest}
        form={model.form}
        onCancel={flow.cancelEditingAndReturn}
        onSubmit={flow.submitPlanAndReturn}
        onUpdateForm={model.updateForm}
        planTitleMaxLength={model.planTitleMaxLength}
        plannedCount={model.todayPlans.length}
        rescheduleFailureGuidance={rescheduleFailureGuidance}
        timeDisplayFormat={model.timeDisplayFormat}
        title={model.recoveryMode === "reschedule" ? "다시 지정" : "계획 편집"}
      />
    ),
    motivation: (
      <ExpoMotivationScreen
        calendarDays={model.monthlyCalendar}
        recoverySummary={model.recoverySummary}
        summary={model.monthlySummary}
      />
    ),
    reflection: (
      <ExpoReflectionScreen
        activeRecoveryTitle={flow.activeRecoveryTitle}
        note={model.reflectionNoteDraft}
        onCancel={flow.cancelRecoveryAndReturn}
        onChangeNote={model.setReflectionNoteDraft}
        onSave={flow.saveReflectionAndReturn}
      />
    ),
    today: (
      <ExpoTodayScreen
        currentMinute={model.currentMinute}
        currentPlanTimeText={model.currentPlanTimeText}
        currentPlanTitle={model.currentPlan?.title ?? null}
        endRecoveryPlanId={model.activeEndRecoveryReminder?.id ?? null}
        error={model.error}
        exactAlarmAccessState={model.exactAlarmAccessState}
        onChangeTimeDisplayFormat={model.setTimeDisplayFormat}
        onCompletePlan={model.togglePlanStatus}
        onDeletePlan={model.deletePlan}
        onDismissEndRecovery={model.dismissEndRecovery}
        onDismissReminder={model.dismissReminder}
        onOpenExactAlarmSettings={model.openExactAlarmSettings}
        onOpenCreatePlan={flow.openCreatePlan}
        onOpenReflection={flow.openReflection}
        onOpenReschedule={flow.openReschedule}
        onOpenUpdatePlan={flow.openUpdatePlan}
        plans={model.todayPlans}
        planItems={model.todayPlanItems}
        reminderPlanId={model.activeReminder?.id ?? null}
        reminderText={flow.reminderText}
        rescheduleFailureGuidance={rescheduleFailureGuidance}
        summary={model.summary}
        timeDisplayFormat={model.timeDisplayFormat}
      />
    )
  };

  return screens[screen] ?? screens.today;
}
