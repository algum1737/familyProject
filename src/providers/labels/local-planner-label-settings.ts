import {
  normalizePlannerLabelSettings,
  type PlannerLabelSettings,
  type PlannerLabelSettingsStore
} from "@/providers/labels/planner-label-settings";

export const LABEL_SETTINGS_STORAGE_KEY = "today-did-you-finish:label-settings";

function loadLabelSettingsFromLocalStorage(): PlannerLabelSettings | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LABEL_SETTINGS_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return normalizePlannerLabelSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

function saveLabelSettingsToLocalStorage(settings: PlannerLabelSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LABEL_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export const localPlannerLabelSettingsStore: PlannerLabelSettingsStore = {
  load: loadLabelSettingsFromLocalStorage,
  save: saveLabelSettingsToLocalStorage
};
