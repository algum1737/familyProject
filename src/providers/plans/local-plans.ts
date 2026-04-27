import { validatePlanner } from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import type { PlansStore } from "@/providers/plans/plans-store";

export const STORAGE_KEY = "today-did-you-finish:plans";

function loadPlansFromLocalStorage(): DailyPlan[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return validatePlanner(JSON.parse(raw) as DailyPlan[]);
  } catch {
    return null;
  }
}

function savePlansToLocalStorage(plans: DailyPlan[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export const localPlansStore: PlansStore = {
  load: loadPlansFromLocalStorage,
  save: savePlansToLocalStorage
};
