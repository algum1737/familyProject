import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_PLAN_COLOR,
  normalizeDailyPlans,
  normalizePlanColor,
  normalizePlannerRecordMap
} from "@/domains/plans/service/plan-color";
import type { DailyPlan, DatedPlanRecord, PlannerRecordMap } from "@/domains/plans/types";
import { createAsyncRecordBackedPlansStore } from "@/providers/plans/async-record-backed-plans";

function createPlan(overrides?: Partial<DailyPlan>): DailyPlan {
  return {
    color: "#5bb7aa",
    endMinute: 600,
    id: "plan-1",
    rescheduleCount: 0,
    startMinute: 540,
    status: "pending",
    title: "아침 준비",
    ...overrides
  };
}

describe("plan color normalization", () => {
  it("falls back to the default palette color when a theme key is stored", () => {
    expect(normalizePlanColor("mint")).toBe(DEFAULT_PLAN_COLOR);
    expect(normalizePlanColor(" night-ink ")).toBe(DEFAULT_PLAN_COLOR);
    expect(normalizePlanColor("#5bb7aa")).toBe("#5bb7aa");
  });

  it("normalizes record maps loaded from storage", () => {
    const records: PlannerRecordMap = {
      "2026-05-12": [
        {
          ...createPlan({ color: "mint", id: "broken-plan" }),
          date: "2026-05-12"
        }
      ]
    };

    expect(normalizePlannerRecordMap(records)).toEqual({
      "2026-05-12": [
        {
          ...createPlan({ color: DEFAULT_PLAN_COLOR, id: "broken-plan" }),
          date: "2026-05-12"
        }
      ]
    });
  });

  it("sanitizes invalid colors when record-backed plans are loaded and saved", async () => {
    const saveForDate = vi.fn(async (_date: string, _plans: DatedPlanRecord[]) => {});
    const fallbackSave = vi.fn(async (_plans: DailyPlan[]) => {});
    const store = createAsyncRecordBackedPlansStore({
      fallbackStore: {
        load: async () => [createPlan({ color: "mint", id: "fallback-plan" })],
        save: fallbackSave
      },
      recordsStore: {
        loadAll: async () => ({}),
        saveForDate
      },
      timeSource: {
        now: () => new Date(2026, 4, 12, 9, 0, 0, 0)
      }
    });

    const loaded = await store.load();
    expect(normalizeDailyPlans(loaded)).toEqual([
      createPlan({ color: DEFAULT_PLAN_COLOR, id: "fallback-plan" })
    ]);

    await store.save([createPlan({ color: "mint", id: "save-plan" })]);

    expect(saveForDate).toHaveBeenCalledWith("2026-05-12", [
      {
        ...createPlan({ color: DEFAULT_PLAN_COLOR, id: "save-plan" }),
        date: "2026-05-12"
      }
    ]);
    expect(fallbackSave).toHaveBeenCalledWith([
      createPlan({ color: DEFAULT_PLAN_COLOR, id: "save-plan" })
    ]);
  });
});
