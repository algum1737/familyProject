import { describe, expect, it } from "vitest";

import {
  createCenteredArcPath,
  createSectorPath,
  describeMinute,
  formatSectorLabel,
  getCurrentPlan,
  getPlannerSummary,
  getSectorLabelRotation,
  getSectorLabelFontSize,
  minuteToTimeString,
  sortPlans,
  timeStringToMinute,
  validatePlanner
} from "../src/domains/plans/service/planner";
import type { DailyPlan } from "../src/domains/plans/types";

const plans: DailyPlan[] = [
  {
    id: "sleep",
    title: "취침",
    color: "#777777",
    startMinute: 0,
    endMinute: 300,
    status: "pending"
  },
  {
    id: "study",
    title: "영어 공부",
    color: "#ff9966",
    startMinute: 300,
    endMinute: 360,
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
          status: "pending" as const
        }
      ])
    ).toThrow("이미 등록된 시간과 겹치는 일정은 저장할 수 없습니다.");
  });

  it("finds the active plan for the current minute", () => {
    expect(getCurrentPlan(plans, 330)?.title).toBe("영어 공부");
  });

  it("summarizes completion", () => {
    expect(getPlannerSummary(plans)).toEqual({
      total: 2,
      completed: 1,
      completionRate: 50
    });
  });

  it("formats time for display", () => {
    expect(describeMinute(305)).toBe("05:05");
  });

  it("converts time strings to minutes and back", () => {
    expect(timeStringToMinute("08:30")).toBe(510);
    expect(minuteToTimeString(510)).toBe("08:30");
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
        status: "pending"
      })
    ).toContain("…");
  });

  it("keeps sector label rotation readable", () => {
    expect(getSectorLabelRotation(6 * 60)).toBe(0);
    expect(getSectorLabelRotation(18 * 60)).toBe(0);
    expect(getSectorLabelRotation(22 * 60)).toBe(60);
  });
});
