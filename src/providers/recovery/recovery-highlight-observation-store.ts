import type { DailyPlan } from "@/domains/plans/types";

export const RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY =
  "today-did-you-finish:recovery-highlight-observations";

export type RecoveryHighlightObservationType =
  | "reflection_prompt"
  | "end_recovery_prompt"
  | "end_recovery_continue"
  | "reschedule_prompt"
  | "reschedule_unavailable"
  | "followup_scheduled"
  | "followup_soon"
  | "followup_active";

export type RecoveryHighlightObservation = {
  currentMinute: number | null;
  id: string;
  occurredAt: string;
  planId: string;
  planTitle: string;
  type: RecoveryHighlightObservationType;
};

let recoveryObservationSequence = 0;

function getObservationDedupKey(observation: RecoveryHighlightObservation) {
  return [
    observation.planId,
    observation.type,
    observation.occurredAt.slice(0, 16)
  ].join(":");
}

function normalizeRecoveryHighlightObservations(
  observations: RecoveryHighlightObservation[]
) {
  const normalized = new Map<string, RecoveryHighlightObservation>();

  observations.forEach((observation) => {
    normalized.set(getObservationDedupKey(observation), observation);
  });

  return [...normalized.values()].slice(-50);
}

function persistRecoveryHighlightObservations(
  observations: RecoveryHighlightObservation[]
) {
  if (typeof window === "undefined") {
    return observations;
  }

  const normalized = normalizeRecoveryHighlightObservations(observations);
  window.localStorage.setItem(
    RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY,
    JSON.stringify(normalized)
  );

  return normalized;
}

function createRecoveryObservationId() {
  recoveryObservationSequence += 1;

  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${crypto.randomUUID()}-${recoveryObservationSequence}`;
  }

  return `recovery-${Date.now()}-${recoveryObservationSequence}-${Math.random().toString(16).slice(2)}`;
}

export function loadRecoveryHighlightObservations(): RecoveryHighlightObservation[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as RecoveryHighlightObservation[];
    const observations = Array.isArray(parsed)
      ? normalizeRecoveryHighlightObservations(parsed)
      : [];

    if (JSON.stringify(parsed) !== JSON.stringify(observations)) {
      window.localStorage.setItem(
        RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY,
        JSON.stringify(observations)
      );
    }

    return observations;
  } catch {
    return [];
  }
}

export function appendRecoveryHighlightObservation({
  currentMinute,
  plan,
  time,
  type
}: {
  currentMinute: number | null;
  plan: DailyPlan;
  time: Date;
  type: RecoveryHighlightObservationType;
}): RecoveryHighlightObservation[] {
  const nextObservation: RecoveryHighlightObservation = {
    currentMinute,
    id: createRecoveryObservationId(),
    occurredAt: time.toISOString(),
    planId: plan.id,
    planTitle: plan.title,
    type
  };

  return persistRecoveryHighlightObservations([
    ...loadRecoveryHighlightObservations(),
    nextObservation
  ]);
}

export function clearRecoveryHighlightObservations() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY);
}
