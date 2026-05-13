import { describe, expect, it } from "vitest";

import {
  EXPO_CIRCULAR_PLANNER_CANVAS,
  formatExpoCircularBadgeLabel,
  getExpoCircularPlannerCanvas,
  getExpoCircularPlannerCenterLabel,
  getExpoCircularPlannerCenterTitle,
  getExpoCircularPlannerLabelRadius,
  getExpoCircularPlannerLabelWidth
} from "../apps/expo/src/components/expo-circular-planner-layout";

describe("expo circular planner layout helpers", () => {
  it("keeps canvas geometry in the expected mobile range", () => {
    expect(EXPO_CIRCULAR_PLANNER_CANVAS.width).toBe(320);
    expect(EXPO_CIRCULAR_PLANNER_CANVAS.height).toBe(360);
    expect(EXPO_CIRCULAR_PLANNER_CANVAS.currentSectorRadius).toBeGreaterThan(
      EXPO_CIRCULAR_PLANNER_CANVAS.sectorRadius
    );
    expect(EXPO_CIRCULAR_PLANNER_CANVAS.innerDiscRadius).toBeLessThan(
      EXPO_CIRCULAR_PLANNER_CANVAS.radius
    );
  });

  it("adapts canvas geometry to wider phone cards without exceeding bounds", () => {
    const narrow = getExpoCircularPlannerCanvas(280);
    const wide = getExpoCircularPlannerCanvas(360);

    expect(narrow.width).toBe(292);
    expect(wide.width).toBe(348);
    expect(wide.height).toBeGreaterThan(narrow.height);
    expect(wide.innerDiscRadius).toBeGreaterThan(narrow.innerDiscRadius);
  });

  it("truncates outer badge labels more aggressively for mobile", () => {
    expect(formatExpoCircularBadgeLabel("운동")).toBe("운동");
    expect(formatExpoCircularBadgeLabel("가족과저녁식사")).toBe("가족과저녁…");
  });

  it("builds center copy from current context", () => {
    expect(getExpoCircularPlannerCenterLabel(null)).toBe("시간 동기화 중");
    expect(getExpoCircularPlannerCenterLabel(540)).toBe("현재 맥락");
    expect(getExpoCircularPlannerCenterTitle(null)).toBe("비어 있음");
    expect(getExpoCircularPlannerCenterTitle("영어 공부")).toBe("영어 공부");
    expect(getExpoCircularPlannerCenterTitle("가족과 함께 저녁 준비")).toBe("가족과 함께 저녁…");
  });

  it("caps label pill widths for default and selected states", () => {
    expect(getExpoCircularPlannerLabelWidth("운동", false)).toBeGreaterThanOrEqual(38);
    expect(getExpoCircularPlannerLabelWidth("가족과저녁식…", false)).toBeLessThanOrEqual(88);
    expect(getExpoCircularPlannerLabelWidth("긴 제목 일정 테스트", true)).toBeLessThanOrEqual(148);
  });

  it("keeps label anchors outside the center disc lane", () => {
    const defaultRadius = getExpoCircularPlannerLabelRadius(EXPO_CIRCULAR_PLANNER_CANVAS, false);
    const selectedRadius = getExpoCircularPlannerLabelRadius(EXPO_CIRCULAR_PLANNER_CANVAS, true);

    expect(defaultRadius).toBeGreaterThan(EXPO_CIRCULAR_PLANNER_CANVAS.innerDiscRadius);
    expect(defaultRadius).toBeLessThan(EXPO_CIRCULAR_PLANNER_CANVAS.sectorRadius);
    expect(selectedRadius).toBeGreaterThan(defaultRadius);
    expect(selectedRadius).toBeLessThanOrEqual(EXPO_CIRCULAR_PLANNER_CANVAS.currentSectorRadius);
  });
});
