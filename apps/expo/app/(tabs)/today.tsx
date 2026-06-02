import { useRouter } from "expo-router";

import { getRescheduleFailureGuidance } from "../../../../src/features/planner/core/reschedule-failure-guidance";
import { ExpoTodayScreen } from "../../src/screens/today-screen";
import { useExpoRouterAppModel } from "../../src/app-shell/expo-router-app-provider";
import {
  getTodayReminderText,
  openCreatePlanRoute,
  openReflectionRoute,
  openRescheduleRoute,
  openUpdatePlanRoute
} from "../../src/app-shell/expo-router-route-actions";

export default function TodayRoute() {
  const model = useExpoRouterAppModel();
  const router = useRouter();
  const rescheduleFailureGuidance = getRescheduleFailureGuidance(model.error);

  return (
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
      onOpenCreatePlan={() => openCreatePlanRoute(model, router)}
      onOpenReflection={(planId) => openReflectionRoute(model, router, planId)}
      onOpenReschedule={(planId) => openRescheduleRoute(model, router, planId)}
      onOpenUpdatePlan={(planId) => openUpdatePlanRoute(model, router, planId)}
      plans={model.todayPlans}
      planItems={model.todayPlanItems}
      reminderPlanId={model.activeReminder?.id ?? null}
      reminderText={getTodayReminderText(model)}
      rescheduleFailureGuidance={rescheduleFailureGuidance}
      summary={model.summary}
      timeDisplayFormat={model.timeDisplayFormat}
    />
  );
}
