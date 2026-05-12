import { useMemo, useState } from "react";

import type { AppTabKey, OverlayScreenKey, ScreenKey } from "./flow-tabs";
import type { ExpoPlannerShellModel } from "./expo-planner-shell-model";

function findPlanById(plans: ExpoPlannerShellModel["todayPlans"], planId: string) {
  return plans.find((plan) => plan.id === planId) ?? null;
}

export function useExpoPlannerFlow(model: ExpoPlannerShellModel) {
  const [activeTab, setActiveTab] = useState<AppTabKey>("today");
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreenKey | null>(null);

  const activeRecoveryTitle = useMemo(
    () => model.todayPlanItems.find((item) => item.recoveryLabel)?.title ?? null,
    [model.todayPlanItems]
  );
  const currentScreen: ScreenKey = overlayScreen ?? activeTab;

  const reminderText = useMemo(() => {
    if (model.activeReminder) {
      return `${model.activeReminder.title} · ${
        model.canCompleteActiveReminder ? "지금 완료 가능" : "곧 시작"
      }`;
    }

    if (model.activeEndRecoveryReminder) {
      return `${model.activeEndRecoveryReminder.title} · 종료 전 확인`;
    }

    return null;
  }, [model.activeEndRecoveryReminder, model.activeReminder, model.canCompleteActiveReminder]);

  function openCreatePlan() {
    model.startCreatePlan();
    setOverlayScreen("editor");
  }

  function openUpdatePlan(planId: string) {
    const plan = findPlanById(model.todayPlans, planId);

    if (!plan) {
      return;
    }

    model.startEditingPlan(plan);
    setOverlayScreen("editor");
  }

  function openReflection(planId: string) {
    const plan = findPlanById(model.todayPlans, planId);

    if (!plan) {
      return;
    }

    model.startReflection(plan);
    setOverlayScreen("reflection");
  }

  function openReschedule(planId: string) {
    const plan = findPlanById(model.todayPlans, planId);

    if (!plan) {
      return;
    }

    const result = model.startRescheduling(plan);

    if (result === "started") {
      setOverlayScreen("editor");
    }
  }

  function cancelEditingAndReturn() {
    model.cancelEditing();
    setOverlayScreen(null);
  }

  function submitPlanAndReturn() {
    if (model.submitPlan()) {
      setOverlayScreen(null);
    }
  }

  function cancelRecoveryAndReturn() {
    model.cancelRecovery();
    setOverlayScreen(null);
  }

  function saveReflectionAndReturn() {
    model.saveReflection();
    setOverlayScreen(null);
  }

  function selectTab(tab: AppTabKey) {
    setActiveTab(tab);
    setOverlayScreen(null);
  }

  return {
    activeTab,
    activeRecoveryTitle,
    cancelEditingAndReturn,
    cancelRecoveryAndReturn,
    currentScreen,
    overlayScreen,
    openCreatePlan,
    openReflection,
    openReschedule,
    openUpdatePlan,
    reminderText,
    saveReflectionAndReturn,
    selectTab,
    submitPlanAndReturn
  };
}
