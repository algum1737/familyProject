import type { DailyPlan } from "../../../../src/domains/plans/types";

import type { ExpoPlannerShellModel } from "./expo-planner-shell-model";
import {
  EXPO_ROUTE_PATHS,
  type EditorRouteMode
} from "./expo-router-contract";

type ExpoRouteRouter = {
  push: (href: { params?: Record<string, string>; pathname: string }) => void;
  replace: (href: string) => void;
};

type RouteModel = Pick<
  ExpoPlannerShellModel,
  | "cancelEditing"
  | "cancelRecovery"
  | "reflectionNoteDraft"
  | "recoveryPlan"
  | "saveReflection"
  | "setReflectionNoteDraft"
  | "startCreatePlan"
  | "startEditingPlan"
  | "startReflection"
  | "startRescheduling"
  | "submitPlan"
  | "todayPlans"
>;

function findPlanById(plans: DailyPlan[], planId: string) {
  return plans.find((plan) => plan.id === planId) ?? null;
}

export function getTodayReminderText(options: {
  activeEndRecoveryReminder: DailyPlan | null;
  activeReminder: DailyPlan | null;
  canCompleteActiveReminder: boolean;
}) {
  if (options.activeReminder) {
    return `${options.activeReminder.title} · ${
      options.canCompleteActiveReminder ? "지금 완료 가능" : "곧 시작"
    }`;
  }

  if (options.activeEndRecoveryReminder) {
    return `${options.activeEndRecoveryReminder.title} · 종료 전 확인`;
  }

  return null;
}

export function openCreatePlanRoute(model: RouteModel, router: ExpoRouteRouter) {
  model.startCreatePlan();
  router.push({
    pathname: EXPO_ROUTE_PATHS.editor,
    params: { mode: "create" }
  });
}

export function openUpdatePlanRoute(
  model: RouteModel,
  router: ExpoRouteRouter,
  planId: string
) {
  const plan = findPlanById(model.todayPlans, planId);

  if (!plan) {
    return;
  }

  model.startEditingPlan(plan);
  router.push({
    pathname: EXPO_ROUTE_PATHS.editor,
    params: { mode: "edit", planId }
  });
}

export function openReflectionRoute(
  model: RouteModel,
  router: ExpoRouteRouter,
  planId: string
) {
  const plan = findPlanById(model.todayPlans, planId);

  if (!plan) {
    return;
  }

  model.startReflection(plan);
  router.push({
    pathname: EXPO_ROUTE_PATHS.reflection,
    params: { planId }
  });
}

export function openRescheduleRoute(
  model: RouteModel,
  router: ExpoRouteRouter,
  planId: string
) {
  const plan = findPlanById(model.todayPlans, planId);

  if (!plan) {
    return;
  }

  const result = model.startRescheduling(plan);

  if (result !== "started") {
    return;
  }

  router.push({
    pathname: EXPO_ROUTE_PATHS.editor,
    params: { mode: "reschedule", planId }
  });
}

export function initializeEditorRoute(options: {
  mode: EditorRouteMode;
  model: RouteModel;
  planId: string | null;
  router: ExpoRouteRouter;
}) {
  const { mode, model, planId, router } = options;

  if (mode === "create") {
    model.startCreatePlan();
    return;
  }

  if (!planId) {
    router.replace(EXPO_ROUTE_PATHS.today);
    return;
  }

  const plan = findPlanById(model.todayPlans, planId);

  if (!plan) {
    router.replace(EXPO_ROUTE_PATHS.today);
    return;
  }

  if (mode === "edit") {
    model.startEditingPlan(plan);
    return;
  }

  if (model.startRescheduling(plan) !== "started") {
    router.replace(EXPO_ROUTE_PATHS.today);
  }
}

export function cancelEditorRoute(
  model: RouteModel,
  router: ExpoRouteRouter,
  mode: EditorRouteMode
) {
  if (mode === "reschedule") {
    model.cancelRecovery();
  } else {
    model.cancelEditing();
  }

  router.replace(EXPO_ROUTE_PATHS.today);
}

export function submitEditorRoute(model: RouteModel, router: ExpoRouteRouter) {
  if (model.submitPlan()) {
    router.replace(EXPO_ROUTE_PATHS.today);
  }
}

export function initializeReflectionRoute(options: {
  model: RouteModel;
  planId: string | null;
  router: ExpoRouteRouter;
}) {
  const { model, planId, router } = options;

  if (!planId) {
    router.replace(EXPO_ROUTE_PATHS.today);
    return;
  }

  const plan = findPlanById(model.todayPlans, planId);

  if (!plan) {
    router.replace(EXPO_ROUTE_PATHS.today);
    return;
  }

  model.startReflection(plan);
}

export function cancelReflectionRoute(model: RouteModel, router: ExpoRouteRouter) {
  model.cancelRecovery();
  router.replace(EXPO_ROUTE_PATHS.today);
}

export function saveReflectionRoute(model: RouteModel, router: ExpoRouteRouter) {
  model.saveReflection();
  router.replace(EXPO_ROUTE_PATHS.today);
}
