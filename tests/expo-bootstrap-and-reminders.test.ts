import { describe, expect, it } from "vitest";

import { resolveExpoBootstrapState } from "../apps/expo/src/app-shell/expo-bootstrap-state";
import { buildExpoMergedPlannerRecords } from "../apps/expo/src/app-shell/expo-monthly-records";
import { getMonthlyCalendarStatus } from "../src/domains/plans/selectors/monthly-calendar-status";
import { getMonthlyMotivationSummary } from "../src/domains/plans/selectors/monthly-motivation-summary";
import { getRecoveryContributionSummary } from "../src/domains/plans/selectors/recovery-contribution-summary";
import {
  getEndRecoveryInstanceKey,
  getReminderInstanceKey,
  isEndRecoveryReminderDismissed,
  isStartReminderDismissed
} from "../src/features/planner/core/planner-reminder-rules";
import type { DailyPlan, PlannerRecordMap } from "../src/domains/plans/types";

describe("expo bootstrap state", () => {
  it("preserves existing records when today has no record and no legacy plans", () => {
    const loadedRecords: PlannerRecordMap = {
      "2026-05-07": [
        {
          id: "carry",
          title: "야간 작업",
          color: "#111111",
          startMinute: 23 * 60,
          endMinute: 30 * 60,
          rescheduleCount: 0,
          status: "pending",
          date: "2026-05-07"
        }
      ]
    };

    const resolved = resolveExpoBootstrapState({
      currentDate: "2026-05-08",
      loadedPlans: [],
      loadedRecords,
      now: new Date("2026-05-08T05:30:00+09:00")
    });

    expect(resolved.source).toBe("records-restored");
    expect(resolved.records).toEqual(loadedRecords);
    expect(resolved.initialPlans).toEqual([
      {
        id: "carry",
        title: "야간 작업",
        color: "#111111",
        startMinute: 23 * 60,
        endMinute: 30 * 60,
        rescheduleCount: 0,
        status: "pending"
      }
    ]);
    expect(resolved.migratedCurrentDatePlans).toBeNull();
  });

  it("marks legacy plans as migrated instead of pretending records were restored", () => {
    const legacyPlans: DailyPlan[] = [
      {
        id: "legacy",
        title: "기존 오늘 계획",
        color: "#f07c61",
        startMinute: 8 * 60,
        endMinute: 9 * 60,
        rescheduleCount: 0,
        status: "pending"
      }
    ];

    const resolved = resolveExpoBootstrapState({
      currentDate: "2026-05-08",
      loadedPlans: legacyPlans,
      loadedRecords: {
        "2026-05-07": [
          {
            ...legacyPlans[0],
            date: "2026-05-07"
          }
        ]
      },
      now: new Date("2026-05-08T08:00:00+09:00")
    });

    expect(resolved.source).toBe("legacy-migrated");
    expect(resolved.initialPlans).toEqual(legacyPlans);
    expect(resolved.records["2026-05-08"]).toEqual([
      {
        ...legacyPlans[0],
        date: "2026-05-08"
      }
    ]);
  });
});

describe("expo reminder dismissal keys", () => {
  it("uses start reminder instance keys instead of plain plan ids", () => {
    const originalPlan = {
      id: "plan-1",
      startMinute: 8 * 60
    };
    const rescheduledPlan = {
      id: "plan-1",
      startMinute: 10 * 60
    };
    const dismissedKeys = [getReminderInstanceKey(originalPlan)];

    expect(isStartReminderDismissed(dismissedKeys, originalPlan)).toBe(true);
    expect(isStartReminderDismissed(dismissedKeys, rescheduledPlan)).toBe(false);
  });

  it("uses end recovery reminder instance keys instead of plain plan ids", () => {
    const originalPlan = {
      id: "plan-1",
      endMinute: 9 * 60
    };
    const rescheduledPlan = {
      id: "plan-1",
      endMinute: 11 * 60
    };
    const dismissedKeys = [getEndRecoveryInstanceKey(originalPlan)];

    expect(isEndRecoveryReminderDismissed(dismissedKeys, originalPlan)).toBe(true);
    expect(isEndRecoveryReminderDismissed(dismissedKeys, rescheduledPlan)).toBe(false);
  });
});

describe("expo monthly record aggregation", () => {
  it("uses the current in-memory plans for the current date while preserving older records", () => {
    const records: PlannerRecordMap = {
      "2026-05-06": [
        {
          id: "past-done",
          title: "과거 완료",
          color: "#5f86b3",
          startMinute: 9 * 60,
          endMinute: 10 * 60,
          rescheduleCount: 0,
          status: "done",
          date: "2026-05-06"
        }
      ],
      "2026-05-08": [
        {
          id: "stale",
          title: "이전 오늘 상태",
          color: "#f07c61",
          startMinute: 8 * 60,
          endMinute: 9 * 60,
          rescheduleCount: 0,
          status: "missed",
          date: "2026-05-08"
        }
      ]
    };
    const currentPlans: DailyPlan[] = [
      {
        id: "today-done",
        title: "오늘 완료",
        color: "#87b889",
        startMinute: 11 * 60,
        endMinute: 12 * 60,
        rescheduleCount: 0,
        status: "done"
      },
      {
        id: "today-missed",
        title: "오늘 놓침",
        color: "#f07c61",
        startMinute: 13 * 60,
        endMinute: 14 * 60,
        rescheduleCount: 0,
        status: "missed",
        reflectionNote: "시작을 놓쳤다."
      }
    ];

    const mergedRecords = buildExpoMergedPlannerRecords({
      currentDate: "2026-05-08",
      currentPlans,
      records
    });
    const monthlySummary = getMonthlyMotivationSummary("2026-05", mergedRecords);
    const calendar = getMonthlyCalendarStatus("2026-05", mergedRecords);
    const recoverySummary = getRecoveryContributionSummary("2026-05", mergedRecords);

    expect(mergedRecords["2026-05-08"].map((plan) => plan.id)).toEqual([
      "today-done",
      "today-missed"
    ]);
    expect(monthlySummary).toMatchObject({
      completedCount: 2,
      completionRate: 67,
      missedCount: 1
    });
    expect(calendar.find((day) => day.date === "2026-05-08")).toMatchObject({
      completionRate: 50,
      tone: "mid"
    });
    expect(recoverySummary.reflectionDays).toBe(1);
  });

  it("counts completed rescheduled follow-ups in Expo monthly recovery metrics", () => {
    const records = buildExpoMergedPlannerRecords({
      currentDate: "2026-05-08",
      currentPlans: [
        {
          id: "root",
          title: "원래 일정",
          color: "#f07c61",
          startMinute: 9 * 60,
          endMinute: 10 * 60,
          rescheduleCount: 0,
          status: "missed",
          reflectionNote: "오전 집중 시간이 밀렸다."
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
      ],
      records: {}
    });
    const monthlySummary = getMonthlyMotivationSummary("2026-05", records);
    const recoverySummary = getRecoveryContributionSummary("2026-05", records);

    expect(monthlySummary.completedAfterRescheduleCount).toBe(1);
    expect(monthlySummary.completionRate).toBe(100);
    expect(recoverySummary).toMatchObject({
      completedAfterRescheduleCount: 1,
      reflectionDays: 1
    });
  });
});
