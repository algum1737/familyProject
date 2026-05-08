import type {
  DatedPlanRecord,
  PlanDateKey,
  PlannerRecordMap
} from "@/domains/plans/types";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";

const STORAGE_KEY = "today-did-you-finish:planner-records";

function normalizeRecordMap(value: unknown): PlannerRecordMap {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>).map(([date, plans]) => [
    date,
    Array.isArray(plans) ? (plans as DatedPlanRecord[]) : []
  ]);

  return Object.fromEntries(entries);
}

function loadRecordsFromLocalStorage(): PlannerRecordMap {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return normalizeRecordMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

function saveRecordsToLocalStorage(records: PlannerRecordMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const localPlannerRecordsStore: PlannerRecordsStore = {
  loadAll() {
    return loadRecordsFromLocalStorage();
  },
  saveForDate(date: PlanDateKey, plans: DatedPlanRecord[]) {
    const currentRecords = loadRecordsFromLocalStorage();

    saveRecordsToLocalStorage({
      ...currentRecords,
      [date]: plans
    });
  }
};
