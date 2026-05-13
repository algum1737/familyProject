import { describe, expect, it, vi } from "vitest";

import { EXPO_ROUTE_PATHS } from "../apps/expo/src/app-shell/expo-router-contract";
import {
  cancelEditorRoute,
  cancelReflectionRoute,
  getTodayReminderText,
  initializeEditorRoute,
  initializeReflectionRoute,
  openCreatePlanRoute,
  openReflectionRoute,
  openRescheduleRoute,
  openUpdatePlanRoute,
  saveReflectionRoute,
  submitEditorRoute
} from "../apps/expo/src/app-shell/expo-router-route-actions";

function createPlan(overrides: Partial<any> = {}) {
  return {
    color: "#767676",
    endMinute: 540,
    id: "plan-1",
    rescheduleCount: 0,
    startMinute: 480,
    status: "pending" as const,
    title: "아침 계획",
    ...overrides
  };
}

function createModel(overrides: Partial<any> = {}) {
  return {
    cancelEditing: vi.fn(),
    cancelRecovery: vi.fn(),
    reflectionNoteDraft: "",
    recoveryPlan: null,
    saveReflection: vi.fn(),
    setReflectionNoteDraft: vi.fn(),
    startCreatePlan: vi.fn(),
    startEditingPlan: vi.fn(),
    startReflection: vi.fn(),
    startRescheduling: vi.fn(() => "started" as const),
    submitPlan: vi.fn(() => true),
    todayPlans: [createPlan()],
    ...overrides
  };
}

function createRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn()
  };
}

describe("expo router route actions", () => {
  it("opens create, edit, reflection, and reschedule routes from today context", () => {
    const plan = createPlan({ id: "missed-1", status: "missed" });
    const model = createModel({ todayPlans: [plan] });
    const router = createRouter();

    openCreatePlanRoute(model, router);
    expect(model.startCreatePlan).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenNthCalledWith(1, {
      pathname: EXPO_ROUTE_PATHS.editor,
      params: { mode: "create" }
    });

    openUpdatePlanRoute(model, router, plan.id);
    expect(model.startEditingPlan).toHaveBeenCalledWith(plan);
    expect(router.push).toHaveBeenNthCalledWith(2, {
      pathname: EXPO_ROUTE_PATHS.editor,
      params: { mode: "edit", planId: plan.id }
    });

    openReflectionRoute(model, router, plan.id);
    expect(model.startReflection).toHaveBeenCalledWith(plan);
    expect(router.push).toHaveBeenNthCalledWith(3, {
      pathname: EXPO_ROUTE_PATHS.reflection,
      params: { planId: plan.id }
    });

    openRescheduleRoute(model, router, plan.id);
    expect(model.startRescheduling).toHaveBeenCalledWith(plan);
    expect(router.push).toHaveBeenNthCalledWith(4, {
      pathname: EXPO_ROUTE_PATHS.editor,
      params: { mode: "reschedule", planId: plan.id }
    });
  });

  it("keeps today route in place when target plan is missing or reschedule cannot start", () => {
    const router = createRouter();
    const missingPlanModel = createModel();

    openUpdatePlanRoute(missingPlanModel, router, "missing");
    openReflectionRoute(missingPlanModel, router, "missing");
    openRescheduleRoute(missingPlanModel, router, "missing");

    expect(router.push).not.toHaveBeenCalled();

    const blockedPlan = createPlan({ id: "blocked-1", status: "missed" });
    const blockedModel = createModel({
      startRescheduling: vi.fn(() => "unavailable" as const),
      todayPlans: [blockedPlan]
    });

    openRescheduleRoute(blockedModel, router, blockedPlan.id);

    expect(blockedModel.startRescheduling).toHaveBeenCalledWith(blockedPlan);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("initializes editor route for create, edit, invalid params, and blocked reschedule", () => {
    const plan = createPlan();

    const createModelState = createModel();
    const createRouteRouter = createRouter();
    initializeEditorRoute({
      mode: "create",
      model: createModelState,
      planId: null,
      router: createRouteRouter
    });
    expect(createModelState.startCreatePlan).toHaveBeenCalledTimes(1);
    expect(createRouteRouter.replace).not.toHaveBeenCalled();

    const editModel = createModel({ todayPlans: [plan] });
    const editRouter = createRouter();
    initializeEditorRoute({
      mode: "edit",
      model: editModel,
      planId: plan.id,
      router: editRouter
    });
    expect(editModel.startEditingPlan).toHaveBeenCalledWith(plan);
    expect(editRouter.replace).not.toHaveBeenCalled();

    const missingParamModel = createModel({ todayPlans: [plan] });
    const missingParamRouter = createRouter();
    initializeEditorRoute({
      mode: "edit",
      model: missingParamModel,
      planId: null,
      router: missingParamRouter
    });
    expect(missingParamRouter.replace).toHaveBeenCalledWith(EXPO_ROUTE_PATHS.today);

    const blockedModel = createModel({
      startRescheduling: vi.fn(() => "unavailable" as const),
      todayPlans: [plan]
    });
    const blockedRouter = createRouter();
    initializeEditorRoute({
      mode: "reschedule",
      model: blockedModel,
      planId: plan.id,
      router: blockedRouter
    });
    expect(blockedModel.startRescheduling).toHaveBeenCalledWith(plan);
    expect(blockedRouter.replace).toHaveBeenCalledWith(EXPO_ROUTE_PATHS.today);
  });

  it("cancels or submits editor route and returns to today", () => {
    const router = createRouter();
    const editModel = createModel();
    cancelEditorRoute(editModel, router, "edit");
    expect(editModel.cancelEditing).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(1, EXPO_ROUTE_PATHS.today);

    const rescheduleModel = createModel();
    cancelEditorRoute(rescheduleModel, router, "reschedule");
    expect(rescheduleModel.cancelRecovery).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(2, EXPO_ROUTE_PATHS.today);

    const submitModel = createModel();
    submitEditorRoute(submitModel, router);
    expect(submitModel.submitPlan).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(3, EXPO_ROUTE_PATHS.today);

    const failedSubmitModel = createModel({
      submitPlan: vi.fn(() => false)
    });
    submitEditorRoute(failedSubmitModel, router);
    expect(failedSubmitModel.submitPlan).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledTimes(3);
  });

  it("initializes reflection route and handles save or cancel redirects", () => {
    const plan = createPlan();
    const router = createRouter();
    const model = createModel({ todayPlans: [plan] });

    initializeReflectionRoute({ model, planId: plan.id, router });
    expect(model.startReflection).toHaveBeenCalledWith(plan);
    expect(router.replace).not.toHaveBeenCalled();

    const invalidModel = createModel({ todayPlans: [plan] });
    initializeReflectionRoute({ model: invalidModel, planId: null, router });
    expect(router.replace).toHaveBeenCalledWith(EXPO_ROUTE_PATHS.today);

    cancelReflectionRoute(model, router);
    expect(model.cancelRecovery).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(2, EXPO_ROUTE_PATHS.today);

    saveReflectionRoute(model, router);
    expect(model.saveReflection).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(3, EXPO_ROUTE_PATHS.today);
  });

  it("builds today reminder text from provider state", () => {
    const activeReminder = createPlan({ title: "영어 공부" });
    const endRecovery = createPlan({ title: "집중 작업" });

    expect(
      getTodayReminderText({
        activeEndRecoveryReminder: null,
        activeReminder,
        canCompleteActiveReminder: false
      })
    ).toBe("영어 공부 · 곧 시작");
    expect(
      getTodayReminderText({
        activeEndRecoveryReminder: null,
        activeReminder,
        canCompleteActiveReminder: true
      })
    ).toBe("영어 공부 · 지금 완료 가능");
    expect(
      getTodayReminderText({
        activeEndRecoveryReminder: endRecovery,
        activeReminder: null,
        canCompleteActiveReminder: false
      })
    ).toBe("집중 작업 · 종료 전 확인");
    expect(
      getTodayReminderText({
        activeEndRecoveryReminder: null,
        activeReminder: null,
        canCompleteActiveReminder: false
      })
    ).toBeNull();
  });
});
