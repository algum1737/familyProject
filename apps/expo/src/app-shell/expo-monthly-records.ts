import type {
  DailyPlan,
  PlannerRecordMap
} from "../../../../src/domains/plans/types";

import { toExpoDateRecord } from "./expo-planner-preview-seed";

export function buildExpoMergedPlannerRecords(options: {
  currentDate: string;
  currentPlans: DailyPlan[];
  records: PlannerRecordMap;
}): PlannerRecordMap {
  const { currentDate, currentPlans, records } = options;

  return {
    ...records,
    [currentDate]: toExpoDateRecord(currentDate, currentPlans)
  };
}
