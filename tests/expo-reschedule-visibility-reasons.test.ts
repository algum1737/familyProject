import { describe, expect, it } from "vitest";

import { buildExpoTodayPlanItems } from "../apps/expo/src/app-shell/expo-planner-preview-presentation";

function createPlan(overrides: Partial<any> = {}) {
  return {
    color: "#767676",
    endMinute: 10 * 60,
    id: "plan-1",
    rescheduleCount: 0,
    startMinute: 9 * 60,
    status: "pending" as const,
    title: "기본 일정",
    ...overrides
  };
}

describe("expo reschedule visibility reasons", () => {
  it("shows maxed reason when a missed plan has already used all three reschedules", () => {
    const items = buildExpoTodayPlanItems(
      [createPlan({ id: "missed-maxed", rescheduleCount: 3, status: "missed" })],
      14 * 60,
      "24h"
    );

    expect(items[0]?.canReschedule).toBe(false);
    expect(items[0]?.rescheduleBlockedReason).toBe("다시 지정 3/3 사용 완료");
  });

  it("shows follow-up reason when a missed plan already has a rescheduled successor", () => {
    const root = createPlan({
      id: "root",
      reflectionNote: "흐름이 밀렸다.",
      rescheduleCount: 0,
      status: "missed",
      title: "테12"
    });
    const followUp = createPlan({
      id: "follow-up",
      sourcePlanId: "root",
      startMinute: 13 * 60 + 22,
      endMinute: 13 * 60 + 24,
      rescheduleCount: 1,
      status: "missed",
      title: "테123"
    });

    const items = buildExpoTodayPlanItems([root, followUp], 14 * 60, "24h");
    const rootItem = items.find((item) => item.id === "root");
    const followUpItem = items.find((item) => item.id === "follow-up");

    expect(rootItem?.canReschedule).toBe(false);
    expect(rootItem?.rescheduleBlockedReason).toBe("이미 다시 지정된 후속 일정이 있음");
    expect(followUpItem?.canReschedule).toBe(true);
    expect(followUpItem?.rescheduleBlockedReason).toBeNull();
  });
});
