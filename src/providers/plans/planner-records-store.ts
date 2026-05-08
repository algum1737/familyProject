import type { DatedPlanRecord, PlanDateKey, PlannerRecordMap } from "@/domains/plans/types";

export interface PlannerRecordsStore {
  loadAll(): PlannerRecordMap;
  saveForDate(date: PlanDateKey, plans: DatedPlanRecord[]): void;
}
