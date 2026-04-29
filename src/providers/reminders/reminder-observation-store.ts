import type { DailyPlan } from "@/domains/plans/types";

export const REMINDER_OBSERVATIONS_KEY = "today-did-you-finish:reminder-observations";

export type ReminderObservationEventType = "shown" | "dismissed" | "completed";

export type ReminderObservation = {
  id: string;
  currentMinute: number | null;
  occurredAt: string;
  planId: string;
  planTitle: string;
  startMinute: number;
  type: ReminderObservationEventType;
};

let reminderObservationSequence = 0;

function getObservationDedupKey(observation: ReminderObservation) {
  return [
    observation.planId,
    observation.startMinute,
    observation.type,
    observation.occurredAt.slice(0, 16)
  ].join(":");
}

function normalizeReminderObservations(observations: ReminderObservation[]) {
  const normalized = new Map<string, ReminderObservation>();

  observations.forEach((observation) => {
    normalized.set(getObservationDedupKey(observation), observation);
  });

  return [...normalized.values()].slice(-50);
}

function persistReminderObservations(observations: ReminderObservation[]) {
  if (typeof window === "undefined") {
    return observations;
  }

  const normalized = normalizeReminderObservations(observations);
  window.localStorage.setItem(REMINDER_OBSERVATIONS_KEY, JSON.stringify(normalized));

  return normalized;
}

function createReminderObservationId() {
  reminderObservationSequence += 1;

  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${crypto.randomUUID()}-${reminderObservationSequence}`;
  }

  return `reminder-${Date.now()}-${reminderObservationSequence}-${Math.random().toString(16).slice(2)}`;
}

export function loadReminderObservations(): ReminderObservation[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(REMINDER_OBSERVATIONS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as ReminderObservation[];
    const observations = Array.isArray(parsed) ? normalizeReminderObservations(parsed) : [];

    if (JSON.stringify(parsed) !== JSON.stringify(observations)) {
      window.localStorage.setItem(REMINDER_OBSERVATIONS_KEY, JSON.stringify(observations));
    }

    return observations;
  } catch {
    return [];
  }
}

export function appendReminderObservation({
  currentMinute,
  plan,
  time,
  type
}: {
  currentMinute: number | null;
  plan: DailyPlan;
  time: Date;
  type: ReminderObservationEventType;
}): ReminderObservation[] {
  const nextObservation: ReminderObservation = {
    id: createReminderObservationId(),
    currentMinute,
    occurredAt: time.toISOString(),
    planId: plan.id,
    planTitle: plan.title,
    startMinute: plan.startMinute,
    type
  };

  return persistReminderObservations([...loadReminderObservations(), nextObservation]);
}

export function clearReminderObservations() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(REMINDER_OBSERVATIONS_KEY);
}
