export type PlannerStatusLabelKey = "current" | "pending" | "done" | "missed";
export type PlannerActionLabelKey = "completeNow" | "reflection" | "reschedule";
export const PLANNER_LABEL_MAX_LENGTH = 10;

export type PlannerLabelSettings = {
  actionLabels: Record<PlannerActionLabelKey, string>;
  statusLabels: Record<PlannerStatusLabelKey, string>;
};

export type PlannerLabelSettingsStore = {
  load(): PlannerLabelSettings | null;
  save(settings: PlannerLabelSettings): void;
};

export const defaultPlannerLabelSettings: PlannerLabelSettings = {
  actionLabels: {
    completeNow: "지금 완료",
    reflection: "회고",
    reschedule: "다시 지정"
  },
  statusLabels: {
    current: "지금",
    pending: "대기",
    done: "완료",
    missed: "놓침"
  }
};

function normalizeLabel(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim().slice(0, PLANNER_LABEL_MAX_LENGTH);

  return trimmed.length === 0 ? fallback : trimmed;
}

export function normalizePlannerLabelSettings(value: unknown): PlannerLabelSettings {
  const input = typeof value === "object" && value !== null ? value : {};
  const statusLabels =
    "statusLabels" in input && typeof input.statusLabels === "object" && input.statusLabels !== null
      ? input.statusLabels
      : {};
  const actionLabels =
    "actionLabels" in input && typeof input.actionLabels === "object" && input.actionLabels !== null
      ? input.actionLabels
      : {};

  return {
    actionLabels: {
      completeNow: normalizeLabel(
        (actionLabels as Record<string, unknown>).completeNow,
        defaultPlannerLabelSettings.actionLabels.completeNow
      ),
      reflection: normalizeLabel(
        (actionLabels as Record<string, unknown>).reflection,
        defaultPlannerLabelSettings.actionLabels.reflection
      ),
      reschedule: normalizeLabel(
        (actionLabels as Record<string, unknown>).reschedule,
        defaultPlannerLabelSettings.actionLabels.reschedule
      )
    },
    statusLabels: {
      current: normalizeLabel(
        (statusLabels as Record<string, unknown>).current,
        defaultPlannerLabelSettings.statusLabels.current
      ),
      pending: normalizeLabel(
        (statusLabels as Record<string, unknown>).pending,
        defaultPlannerLabelSettings.statusLabels.pending
      ),
      done: normalizeLabel(
        (statusLabels as Record<string, unknown>).done,
        defaultPlannerLabelSettings.statusLabels.done
      ),
      missed: normalizeLabel(
        (statusLabels as Record<string, unknown>).missed,
        defaultPlannerLabelSettings.statusLabels.missed
      )
    }
  };
}

export function sanitizePlannerLabelSettings(
  settings: PlannerLabelSettings
): PlannerLabelSettings {
  return normalizePlannerLabelSettings(settings);
}
