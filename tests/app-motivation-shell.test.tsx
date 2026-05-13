// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";

import { AppMotivationShell } from "@/features/planner/app/app-motivation-shell";
import type { DailyPlan, DatedPlanRecord, PlannerRecordMap } from "@/domains/plans/types";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";

function createFixedTimeSource() {
  return {
    now: () => new Date(2026, 4, 8, 8, 0, 0, 0),
    subscribe: () => () => {}
  };
}

function createRecord(date: string, plan: DailyPlan): DatedPlanRecord {
  return {
    ...plan,
    date
  };
}

afterEach(() => {
  cleanup();
});

describe("AppMotivationShell", () => {
  it("prefers current plans over stale current-date records in monthly summary", async () => {
    const currentPlans: DailyPlan[] = [
      {
        id: "today-done",
        title: "오늘 완료",
        color: "#87b889",
        startMinute: 9 * 60,
        endMinute: 10 * 60,
        rescheduleCount: 0,
        status: "done"
      },
      {
        id: "today-missed",
        title: "오늘 놓침",
        color: "#f07c61",
        startMinute: 11 * 60,
        endMinute: 12 * 60,
        rescheduleCount: 0,
        status: "missed",
        reflectionNote: "시작을 놓쳤다."
      }
    ];
    const records: PlannerRecordMap = {
      "2026-05-06": [
        createRecord("2026-05-06", {
          id: "past-done",
          title: "과거 완료",
          color: "#5f86b3",
          startMinute: 8 * 60,
          endMinute: 9 * 60,
          rescheduleCount: 0,
          status: "done"
        })
      ],
      "2026-05-08": [
        createRecord("2026-05-08", {
          id: "stale",
          title: "이전 오늘 상태",
          color: "#111111",
          startMinute: 7 * 60,
          endMinute: 8 * 60,
          rescheduleCount: 0,
          status: "done"
        })
      ]
    };
    const plansStore: PlansStore = {
      load: () => currentPlans,
      save: () => {}
    };
    const saveCalls: Array<{ date: string; plans: DatedPlanRecord[] }> = [];
    const recordsStore: PlannerRecordsStore = {
      loadAll: () => records,
      saveForDate: (date, plans) => {
        saveCalls.push({ date, plans });
        records[date] = plans;
      }
    };

    render(
      <AppMotivationShell
        plansStore={plansStore}
        recordsStore={recordsStore}
        timeSource={createFixedTimeSource()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-motivation-screen")).toBeTruthy();
    });

    const summarySection = screen.getByLabelText("motivation-summary");
    expect(within(summarySection).getByText("2개")).toBeTruthy();
    expect(within(summarySection).getByText("67%")).toBeTruthy();
    expect(within(summarySection).getByText("1개")).toBeTruthy();
    expect(screen.getByText("회고 남긴 날 1일")).toBeTruthy();

    await waitFor(() => {
      expect(saveCalls).toHaveLength(1);
    });
    expect(saveCalls[0]?.date).toBe("2026-05-08");
    expect(saveCalls[0]?.plans.map((plan) => plan.id)).toEqual([
      "today-done",
      "today-missed"
    ]);
  });

  it("includes completed rescheduled follow-ups in recovery contribution", async () => {
    const currentPlans: DailyPlan[] = [
      {
        id: "root",
        title: "원래 일정",
        color: "#f07c61",
        startMinute: 9 * 60,
        endMinute: 10 * 60,
        rescheduleCount: 0,
        status: "missed",
        reflectionNote: "오전 흐름이 밀렸다."
      },
      {
        id: "follow-up",
        title: "회복 일정",
        color: "#87b889",
        startMinute: 11 * 60,
        endMinute: 12 * 60,
        rescheduleCount: 1,
        sourcePlanId: "root",
        status: "done"
      }
    ];
    const plansStore: PlansStore = {
      load: () => currentPlans,
      save: () => {}
    };
    const recordsStore: PlannerRecordsStore = {
      loadAll: () => ({}),
      saveForDate: () => {}
    };

    render(
      <AppMotivationShell
        plansStore={plansStore}
        recordsStore={recordsStore}
        timeSource={createFixedTimeSource()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-motivation-screen")).toBeTruthy();
    });

    const summarySection = screen.getByLabelText("motivation-summary");
    expect(screen.getByText("다시 지정 후 완료 1개")).toBeTruthy();
    expect(screen.getByText("회고 남긴 날 1일")).toBeTruthy();
    expect(within(summarySection).getByText("100%")).toBeTruthy();
  });
});
