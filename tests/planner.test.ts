import { describe, expect, it } from "vitest";

import {
  createCenteredArcPath,
  createSectorPath,
  describeMinute,
  formatSectorLabel,
  getCurrentPlan,
  getPlannerSummary,
  getSectorLabelFontSize,
  getSectorLabelRotation,
  markMissedPlans,
  minuteToTimeString,
  sortPlans,
  timeStringToMinute,
  validatePlanner
} from "../src/domains/plans/service/planner";
import {
  resetPlansForNextDay
} from "../src/providers/plans/record-backed-shared";
import {
  getCarryoverPlansForDate
} from "../src/shared/time/planner-day";
import type { DailyPlan } from "../src/domains/plans/types";

const plans: DailyPlan[] = [
  {
    id: "sleep",
    title: "취침",
    color: "#777777",
    startMinute: 0,
    endMinute: 300,
    rescheduleCount: 0,
    status: "pending"
  },
  {
    id: "study",
    title: "영어 공부",
    color: "#ff9966",
    startMinute: 300,
    endMinute: 360,
    rescheduleCount: 0,
    status: "done"
  }
];

describe("planner domain", () => {
  it("validates planner input", () => {
    expect(validatePlanner(plans)).toHaveLength(2);
  });

  it("rejects overlapping plans", () => {
    expect(() =>
      validatePlanner([
        ...plans,
        {
          id: "overlap",
          title: "겹침",
          color: "#000000",
          startMinute: 350,
          endMinute: 420,
          rescheduleCount: 0,
          status: "pending" as const
        }
      ], {
        focusPlanId: "overlap"
      })
    ).toThrow("이미 등록된 일정 '영어 공부'(05:00 - 06:00)과 겹쳐 저장할 수 없습니다.");
  });

  it("shows the existing plan when a new earlier plan overlaps", () => {
    expect(() =>
      validatePlanner(
        [
          ...plans,
          {
            id: "earlier-overlap",
            title: "아침 준비",
            color: "#111111",
            startMinute: 290,
            endMinute: 310,
            rescheduleCount: 0,
            status: "pending" as const
          }
        ],
        {
          focusPlanId: "earlier-overlap"
        }
      )
    ).toThrow("이미 등록된 일정 '취침'(00:00 - 05:00)과 겹쳐 저장할 수 없습니다.");
  });

  it("allows adjacent plans without overlap", () => {
    expect(
      validatePlanner([
        ...plans,
        {
          id: "adjacent",
          title: "인접",
          color: "#000000",
          startMinute: 360,
          endMinute: 420,
          rescheduleCount: 0,
          status: "pending" as const
        }
      ])
    ).toHaveLength(3);
  });

  it("finds the active plan for the current minute", () => {
    expect(getCurrentPlan(plans, 330)?.title).toBe("영어 공부");
  });

  it("finds an overnight plan after midnight", () => {
    const overnightPlans: DailyPlan[] = [
      {
        id: "overnight",
        title: "야간 작업",
        color: "#111111",
        startMinute: 23 * 60,
        endMinute: 4 * 60 + 24 * 60,
        rescheduleCount: 0,
        status: "pending"
      }
    ];

    expect(getCurrentPlan(overnightPlans, 60)?.title).toBe("야간 작업");
  });

  it("summarizes completion", () => {
    expect(getPlannerSummary(plans)).toEqual({
      total: 2,
      completed: 1,
      completionRate: 50
    });
  });

  it("treats a recovered reschedule chain as fully completed", () => {
    const recoveredPlans: DailyPlan[] = [
      {
        id: "original",
        title: "원래 일정",
        color: "#111111",
        startMinute: 600,
        endMinute: 660,
        rescheduleCount: 0,
        status: "missed"
      },
      {
        id: "followup",
        title: "다시 지정 일정",
        color: "#222222",
        startMinute: 700,
        endMinute: 760,
        rescheduleCount: 1,
        sourcePlanId: "original",
        status: "done"
      }
    ];

    expect(getPlannerSummary(recoveredPlans)).toEqual({
      total: 1,
      completed: 1,
      completionRate: 100
    });
  });

  it("formats time for display", () => {
    expect(describeMinute(305)).toBe("05:05");
  });

  it("converts time strings to minutes and back", () => {
    expect(timeStringToMinute("08:30")).toBe(510);
    expect(timeStringToMinute("8")).toBe(480);
    expect(timeStringToMinute("12")).toBe(720);
    expect(timeStringToMinute("930")).toBe(570);
    expect(timeStringToMinute("1230")).toBe(750);
    expect(minuteToTimeString(510)).toBe("08:30");
    expect(minuteToTimeString(1680)).toBe("04:00");
  });

  it("rejects unsupported or out-of-range time strings", () => {
    expect(() => timeStringToMinute("")).toThrow("시간을 입력해 주십시오.");
    expect(() => timeStringToMinute("2460")).toThrow(
      "시간은 0:00부터 23:59 사이로 입력해 주십시오."
    );
    expect(() => timeStringToMinute("abcd")).toThrow(
      "시간은 9, 12, 930, 1230, 09:30 형식으로 입력해 주십시오."
    );
  });

  it("detects overlap between an overnight plan and an after-midnight plan", () => {
    expect(() =>
      validatePlanner(
        [
          {
            id: "overnight",
            title: "야간 작업",
            color: "#111111",
            startMinute: 23 * 60,
            endMinute: 4 * 60 + 24 * 60,
            rescheduleCount: 0,
            status: "pending"
          },
          {
            id: "early",
            title: "새벽 운동",
            color: "#222222",
            startMinute: 2 * 60,
            endMinute: 3 * 60,
            rescheduleCount: 0,
            status: "pending"
          }
        ],
        {
          focusPlanId: "early"
        }
      )
    ).toThrow("이미 등록된 일정 '야간 작업'(23:00 - 04:00)과 겹쳐 저장할 수 없습니다.");
  });

  it("builds centered arc paths for svg segments", () => {
    expect(createCenteredArcPath(0, 60, 100, 240, 240)).toContain("M 240 140");
  });

  it("builds sector paths that start from the center", () => {
    expect(createSectorPath(0, 60, 100, 240, 240)).toContain("M 240 240");
  });

  it("sorts plans by start time", () => {
    expect(sortPlans(plans).map((plan) => plan.id)).toEqual(["sleep", "study"]);
  });

  it("shrinks label font size for short sectors or long titles", () => {
    expect(
      getSectorLabelFontSize({
        id: "tiny",
        title: "아주긴제목",
        color: "#000000",
        startMinute: 300,
        endMinute: 330,
        rescheduleCount: 0,
        status: "pending"
      })
    ).toBeLessThan(14);
  });

  it("truncates labels that do not fit sector width", () => {
    expect(
      formatSectorLabel({
        id: "tiny",
        title: "아주긴제목",
        color: "#000000",
        startMinute: 300,
        endMinute: 330,
        rescheduleCount: 0,
        status: "pending"
      })
    ).toContain("…");
  });

  it("marks expired pending plans as missed", () => {
    expect(markMissedPlans(plans, 360)).toEqual([
      {
        ...plans[0],
        status: "missed"
      },
      plans[1]
    ]);
  });

  it("keeps sector label rotation readable", () => {
    expect(getSectorLabelRotation(6 * 60)).toBe(0);
    expect(getSectorLabelRotation(18 * 60)).toBe(0);
    expect(getSectorLabelRotation(22 * 60)).toBe(60);
  });

  it("drops rescheduled follow-up plans when a new day resets plans", () => {
    const nextDayPlans = resetPlansForNextDay([
      {
        id: "base",
        title: "기본 일정",
        color: "#111111",
        startMinute: 540,
        endMinute: 600,
        rescheduleCount: 0,
        status: "done"
      },
      {
        id: "followup",
        title: "다시 지정 일정",
        color: "#222222",
        startMinute: 700,
        endMinute: 760,
        rescheduleCount: 1,
        sourcePlanId: "base",
        status: "pending"
      }
    ]);

    expect(nextDayPlans).toEqual([
      {
        id: "base",
        title: "기본 일정",
        color: "#111111",
        startMinute: 540,
        endMinute: 600,
        rescheduleCount: 0,
        sourcePlanId: undefined,
        reflectionNote: undefined,
        status: "pending"
      }
    ]);
  });

  it("does not carry over rescheduled follow-up plans into the next day", () => {
    const carryoverPlans = getCarryoverPlansForDate(
      {
        "2026-05-07": [
          {
            id: "base",
            title: "원래 일정",
            color: "#111111",
            date: "2026-05-07",
            startMinute: 1320,
            endMinute: 1800,
            rescheduleCount: 0,
            status: "pending"
          },
          {
            id: "followup",
            title: "다시 지정 일정",
            color: "#222222",
            date: "2026-05-07",
            startMinute: 1380,
            endMinute: 1740,
            rescheduleCount: 1,
            sourcePlanId: "base",
            status: "pending"
          }
        ]
      },
      new Date(2026, 4, 8, 5, 30),
      "2026-05-08"
    );

    expect(carryoverPlans).toEqual([
      {
        id: "base",
        title: "원래 일정",
        color: "#111111",
        startMinute: 1320,
        endMinute: 1800,
        rescheduleCount: 0,
        status: "pending"
      }
    ]);
  });
});
