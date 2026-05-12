import AsyncStorage from "@react-native-async-storage/async-storage";

import { normalizeDatedPlans, normalizePlannerRecordMap } from "../../../../../src/domains/plans/service/plan-color";
import type {
  DatedPlanRecord,
  PlanDateKey,
  PlannerRecordMap
} from "../../../../../src/domains/plans/types";
import type { AsyncPlannerRecordsStore } from "../../../../../src/providers/plans/async-record-backed-plans";

const RECORDS_STORAGE_KEY = "tdyfy::planner-records";

export type ExpoPlannerRecordsStore = AsyncPlannerRecordsStore & {
  seed: (records: PlannerRecordMap) => Promise<void>;
};

export function createExpoAsyncPlannerRecordsStore(): ExpoPlannerRecordsStore {
  return {
    async loadAll() {
      const raw = await AsyncStorage.getItem(RECORDS_STORAGE_KEY);

      if (!raw) {
        return {};
      }

      return normalizePlannerRecordMap(JSON.parse(raw) as PlannerRecordMap);
    },
    async saveForDate(date: PlanDateKey, plans: DatedPlanRecord[]) {
      const records = await this.loadAll();
      records[date] = normalizeDatedPlans(plans);
      await AsyncStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
    },
    async seed(records) {
      await AsyncStorage.setItem(
        RECORDS_STORAGE_KEY,
        JSON.stringify(normalizePlannerRecordMap(records))
      );
    }
  };
}
