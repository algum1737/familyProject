import type {
  DailyPlan,
  DatedPlanRecord,
  PlanDateKey,
  PlannerRecordMap
} from "@/domains/plans/types";
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
      const carryoverPlans = getCarryoverPlansForDate(records, now, dateKey);

      if (datedPlans) {
        return [...stripPlanDate(datedPlans), ...carryoverPlans];
      }

      return fallbackStore ? resetPlansForNextDay(await fallbackStore.load()) : [];
    },
    async save(plans) {
      const dateKey = getPlanDateKey(timeSource.now());

      await recordsStore.saveForDate(dateKey, addPlanDate(dateKey, plans));

      if (fallbackStore) {
        await fallbackStore.save(plans);
      }
    }
  };
}
