import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DailyPlan } from "../../../../../src/domains/plans/types";
import {
  createAsyncRecordBackedPlansStore,
  type AsyncRecordBackedPlansStore
} from "../../../../../src/providers/plans/async-record-backed-plans";
import type { TimeSource } from "../../../../../src/providers/time/time-source";
import { createExpoAsyncPlannerRecordsStore } from "./expo-async-planner-records-store";

type CreateExpoAsyncPlansStoreOptions = {
  recordsStore?: ReturnType<typeof createExpoAsyncPlannerRecordsStore>;
  timeSource: TimeSource;
};

const STORAGE_KEY = "tdyfy::plans::current";

export type ExpoPlansStore = AsyncRecordBackedPlansStore;

function createExpoFallbackPlansStore(): AsyncRecordBackedPlansStore {
  return {
    async load() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return [];
      }

      return JSON.parse(raw) as DailyPlan[];
    },
    async save(plans) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    }
  };
}

export function createExpoAsyncPlansStore(options: CreateExpoAsyncPlansStoreOptions) {
  return createAsyncRecordBackedPlansStore({
    fallbackStore: createExpoFallbackPlansStore(),
    recordsStore: options.recordsStore ?? createExpoAsyncPlannerRecordsStore(),
    timeSource: options.timeSource
  });
}
