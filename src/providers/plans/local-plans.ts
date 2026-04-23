import { validatePlanner } from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";

const STORAGE_KEY = "today-did-you-finish:plans";

export function loadPlans(): DailyPlan[] | null {
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

export function savePlans(plans: DailyPlan[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

