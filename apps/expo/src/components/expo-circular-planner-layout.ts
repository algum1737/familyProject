const DEFAULT_CANVAS_WIDTH = 320;

export type ExpoCircularPlannerCanvas = {
  centerX: number;
  centerY: number;
  currentSectorHaloRadius: number;
  currentSectorRadius: number;
  height: number;
  innerDiscRadius: number;
  radius: number;
  sectorRadius: number;
  width: number;
};

export function getExpoCircularPlannerCanvas(containerWidth = DEFAULT_CANVAS_WIDTH): ExpoCircularPlannerCanvas {
  const width = Math.max(292, Math.min(348, Math.round(containerWidth)));
  const scale = width / DEFAULT_CANVAS_WIDTH;
  const radius = Math.round(112 * scale);

  return {
    centerX: width / 2,
    centerY: Math.round(170 * scale),
    currentSectorHaloRadius: Math.round(138 * scale),
    currentSectorRadius: Math.round(130 * scale),
    height: Math.round(360 * scale),
    innerDiscRadius: Math.round(86 * scale),
    radius,
    sectorRadius: Math.round(124 * scale),
    width
  };
}

export const EXPO_CIRCULAR_PLANNER_CANVAS = getExpoCircularPlannerCanvas();

export function formatExpoCircularBadgeLabel(title: string) {
  return title.length <= 6 ? title : `${title.slice(0, 5)}…`;
}

export function getExpoCircularPlannerCenterLabel(currentMinute: number | null) {
  return currentMinute === null ? "시간 동기화 중" : "현재 맥락";
}

export function getExpoCircularPlannerCenterTitle(currentPlanTitle: string | null) {
  if (!currentPlanTitle) {
    return "비어 있음";
  }

  return currentPlanTitle.length <= 10 ? currentPlanTitle : `${currentPlanTitle.slice(0, 9)}…`;
}

export function getExpoCircularPlannerLabelWidth(title: string, selected: boolean) {
  if (selected) {
    return Math.min(148, Math.max(74, title.length * 8 + 18));
  }

  return Math.min(88, Math.max(38, title.length * 7 + 14));
}

export function getExpoCircularPlannerLabelRadius(
  canvas: ExpoCircularPlannerCanvas,
  selected: boolean
) {
  return selected ? canvas.currentSectorRadius * 0.82 : canvas.sectorRadius * 0.8;
}
