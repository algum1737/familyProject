import type {
  DailyPlan,
  DatedPlanRecord,
  PlanDateKey,
  PlannerRecordMap
} from "@/domains/plans/types";
import { normalizeDailyPlans } from "@/domains/plans/service/plan-color";
import {
  addPlanDate,
  getCarryoverPlansForDate,
  getPlanDateKey,
  resetPlansForNextDay,
  stripPlanDate
} from "@/providers/plans/record-backed-shared";
import type { TimeSource } from "@/providers/time/time-source";

export interface AsyncPlannerRecordsStore {
  loadAll(): Promise<PlannerRecordMap>;
  saveForDate(date: PlanDateKey, plans: DatedPlanRecord[]): Promise<void>;
}

export type AsyncRecordBackedPlansStore = {
  load(): Promise<DailyPlan[]>;
  save(plans: DailyPlan[]): Promise<void>;
};

export function createAsyncRecordBackedPlansStore(options: {
  fallbackStore?: AsyncRecordBackedPlansStore;
  recordsStore: AsyncPlannerRecordsStore;
  timeSource: TimeSource;
}): AsyncRecordBackedPlansStore {
  const { fallbackStore, recordsStore, timeSource } = options;

  return {
    async load() {
      const now = timeSource.now();
      const dateKey = getPlanDateKey(now);
      const records = await recordsStore.loadAll();
      const datedPlans = records[dateKey];
      const carryoverPlans = normalizeDailyPlans(getCarryoverPlansForDate(records, now, dateKey));

      if (datedPlans) {
        return normalizeDailyPlans([...stripPlanDate(datedPlans), ...carryoverPlans]);
      }

      return fallbackStore
        ? normalizeDailyPlans(resetPlansForNextDay(await fallbackStore.load()))
        : [];
    },
    async save(plans) {
      const dateKey = getPlanDateKey(timeSource.now());
      const normalizedPlans = normalizeDailyPlans(plans);

      await recordsStore.saveForDate(dateKey, addPlanDate(dateKey, normalizedPlans));

      if (fallbackStore) {
        await fallbackStore.save(normalizedPlans);
      }
    }
  };
}
