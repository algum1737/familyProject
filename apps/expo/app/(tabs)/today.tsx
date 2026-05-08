import { useRouter } from "expo-router";

import { ExpoTodayScreen } from "../../src/screens/today-screen";
import { EXPO_ROUTE_PATHS } from "../../src/app-shell/expo-router-contract";
import { useExpoRouterAppModel } from "../../src/app-shell/expo-router-app-provider";

export default function TodayRoute() {
  const model = useExpoRouterAppModel();
  const router = useRouter();

  return (
    <ExpoTodayScreen
      currentMinute={model.currentMinute}
      currentPlanTimeText={model.currentPlanTimeText}
      currentPlanTitle={model.currentPlan?.title ?? null}
      endRecoveryPlanId={model.activeEndRecoveryReminder?.id ?? null}
      onChangeTimeDisplayFormat={model.setTimeDisplayFormat}
      onCompletePlan={model.togglePlanStatus}
      onDeletePlan={model.deletePlan}
      onDismissEndRecovery={model.dismissEndRecovery}
      onDismissReminder={model.dismissReminder}
      onOpenCreatePlan={() => {
        model.startCreatePlan();
        router.push({
          pathname: EXPO_ROUTE_PATHS.editor,
          params: { mode: "create" }
        });
      }}
      onOpenReflection={(planId) => {
        const plan = model.todayPlans.find((item) => item.id === planId);

        if (!plan) {
          return;
        }

        model.startReflection(plan);
        router.push({
          pathname: EXPO_ROUTE_PATHS.reflection,
          params: { planId }
        });
      }}
      onOpenReschedule={(planId) => {
        const plan = model.todayPlans.find((item) => item.id === planId);

        if (!plan) {
          return;
        }

        const result = model.startRescheduling(plan);

        if (result === "started") {
          router.push({
            pathname: EXPO_ROUTE_PATHS.editor,
            params: { mode: "reschedule", planId }
          });
        }
      }}
      onOpenUpdatePlan={(planId) => {
        const plan = model.todayPlans.find((item) => item.id === planId);

        if (!plan) {
          return;
        }

        model.startEditingPlan(plan);
        router.push({
          pathname: EXPO_ROUTE_PATHS.editor,
          params: { mode: "edit", planId }
        });
      }}
      plans={model.todayPlans}
      planItems={model.todayPlanItems}
      reminderPlanId={model.activeReminder?.id ?? null}
      reminderText={
        model.activeReminder
          ? `${model.activeReminder.title} · ${
              model.canCompleteActiveReminder ? "지금 완료 가능" : "곧 시작"
            }`
          : model.activeEndRecoveryReminder
            ? `${model.activeEndRecoveryReminder.title} · 종료 전 확인`
            : null
      }
      summary={model.summary}
      timeDisplayFormat={model.timeDisplayFormat}
    />
  );
}
