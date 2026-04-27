import type { DailyPlan } from "@/domains/plans/types";

export interface PlansStore {
  load(): DailyPlan[] | null;
  save(plans: DailyPlan[]): void;
}
