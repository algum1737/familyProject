import type {
  DailyPlan,
  DatedPlanRecord,
  PlannerRecordMap
} from "../../../../src/domains/plans/types";
import {
  addPlanDate,
  getCarryoverPlansForDate,
  stripPlanDate
} from "../../../../src/providers/plans/record-backed-shared";

export type ExpoBootstrapSource = "empty" | "legacy-migrated" | "records-restored";

export type ResolvedExpoBootstrapState = {
  initialPlans: DailyPlan[];
  migratedCurrentDatePlans: DatedPlanRecord[] | null;
  records: PlannerRecordMap;
  source: ExpoBootstrapSource;
};

export function resolveExpoBootstrapState(options: {
  currentDate: string;
  loadedPlans: DailyPlan[];
  loadedRecords: PlannerRecordMap;
  now: Date;
}): ResolvedExpoBootstrapState {
  const { currentDate, loadedPlans, loadedRecords, now } = options;
  const carryoverPlans = getCarryoverPlansForDate(loadedRecords, now, currentDate);
  const currentDateRecord = loadedRecords[currentDate];

  if (currentDateRecord) {
    return {
      initialPlans: [...stripPlanDate(currentDateRecord), ...carryoverPlans],
      migratedCurrentDatePlans: null,
      records: loadedRecords,
      source: "records-restored"
    };
  }

  if (loadedPlans.length > 0) {
    const migratedCurrentDatePlans = addPlanDate(currentDate, loadedPlans);

    return {
      initialPlans: loadedPlans,
      migratedCurrentDatePlans,
      records: {
        ...loadedRecords,
        [currentDate]: migratedCurrentDatePlans
      },
      source: "legacy-migrated"
    };
  }

  if (Object.keys(loadedRecords).length > 0) {
    return {
      initialPlans: carryoverPlans,
      migratedCurrentDatePlans: null,
      records: loadedRecords,
      source: "records-restored"
    };
  }

  return {
    initialPlans: [],
    migratedCurrentDatePlans: null,
    records: {},
    source: "empty"
  };
}
