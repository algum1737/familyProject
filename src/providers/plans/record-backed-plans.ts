import type {
  DailyPlan,
} from "@/domains/plans/types";
import {
  addPlanDate,
  getCarryoverPlansForDate,
  getPlanDateKey,
  resetPlansForNextDay,
  stripPlanDate
} from "@/providers/plans/record-backed-shared";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { TimeSource } from "@/providers/time/time-source";

export function createRecordBackedPlansStore(options: {
  fallbackStore?: PlansStore;
  recordsStore: PlannerRecordsStore;
  timeSource: TimeSource;
}): PlansStore {
  const { fallbackStore, recordsStore, timeSource } = options;

  return {
    load() {
      const now = timeSource.now();
      const dateKey = getPlanDateKey(now);
      const records = recordsStore.loadAll();
      const datedPlans = records[dateKey];
      const carryoverPlans = getCarryoverPlansForDate(records, now, dateKey);

      if (datedPlans) {
        return [...stripPlanDate(datedPlans), ...carryoverPlans];
      }

      const fallbackPlans = fallbackStore?.load() ?? null;

      return fallbackPlans ? resetPlansForNextDay(fallbackPlans) : null;
    },
    save(plans: DailyPlan[]) {
      const dateKey = getPlanDateKey(timeSource.now());

      recordsStore.saveForDate(dateKey, addPlanDate(dateKey, plans));
      fallbackStore?.save(plans);
    }
  };
}
