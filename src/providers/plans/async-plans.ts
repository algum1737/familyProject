import type { DatedPlanRecord } from "@/domains/plans/types";

export interface AsyncPlansStore {
  load(date: string): Promise<DatedPlanRecord[] | null>;
  save(date: string, plans: DatedPlanRecord[]): Promise<void>;
}

export const asyncPlansStore: AsyncPlansStore = {
  async load() {
    return null;
  },
  async save() {}
};
