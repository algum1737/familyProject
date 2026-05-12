import { z } from "zod";

import type { DailyPlan, PlannerSummary } from "@/domains/plans/types";
import { getPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";
import { MINUTES_PER_DAY } from "@/shared/time/planner-day";

export const PLAN_TITLE_MAX_LENGTH = 20;
export type TimeDisplayFormat = "12h" | "24h";

export const dailyPlanSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1).max(PLAN_TITLE_MAX_LENGTH),
    color: z.string().min(1),
    startMinute: z.number().int().min(0).max(MINUTES_PER_DAY - 1),
    endMinute: z.number().int().min(1).max(MINUTES_PER_DAY * 2),
    rescheduleCount: z.number().int().min(0).max(3).default(0),
    sourcePlanId: z.string().min(1).optional(),
    reflectionNote: z.string().max(500).optional(),
    status: z.enum(["pending", "done", "missed"])
  })
  .refine((plan) => plan.endMinute > plan.startMinute, {
    message: "Plan end time must be later than start time."
  })
  .refine((plan) => plan.endMinute - plan.startMinute <= MINUTES_PER_DAY, {
    message: "Plan duration must not exceed 24 hours."
  });

export const plannerSchema = z.array(dailyPlanSchema);

type ValidatePlannerOptions = {
  focusPlanId?: string;
};

export function validatePlanner(
  plans: DailyPlan[],
  options: ValidatePlannerOptions = {}
): DailyPlan[] {
  const parsedPlans = plannerSchema.parse(plans);
  const intervals = parsedPlans
    .flatMap((plan) => {
      const base = [
        {
          endMinute: plan.endMinute,
          id: plan.id,
          plan,
          startMinute: plan.startMinute
        }
      ];

      if (plan.endMinute <= MINUTES_PER_DAY) {
        base.push({
          endMinute: plan.endMinute + MINUTES_PER_DAY,
          id: plan.id,
          plan,
          startMinute: plan.startMinute + MINUTES_PER_DAY
        });
      }

      return base;
    })
    .sort((left, right) => left.startMinute - right.startMinute);

  for (let index = 1; index < intervals.length; index += 1) {
    const previous = intervals[index - 1];
    const current = intervals[index];

    if (current.id !== previous.id && current.startMinute < previous.endMinute) {
      throw new Error(getOverlapErrorMessage(previous.plan, current.plan, options.focusPlanId));
    }
  }

  return parsedPlans;
}

export function validatePlanTitle(title: string): string {
  const normalized = title.trim();

  if (!normalized) {
    throw new Error("제목을 입력해 주십시오.");
  }

  if (normalized.length > PLAN_TITLE_MAX_LENGTH) {
    throw new Error(`제목은 ${PLAN_TITLE_MAX_LENGTH}자 이하로 입력해 주십시오.`);
  }

  return normalized;
}

function getOverlapErrorMessage(
  previous: DailyPlan,
  current: DailyPlan,
  focusPlanId?: string
): string {
  const conflictingPlan =
    focusPlanId === previous.id ? current : focusPlanId === current.id ? previous : previous;

  return `이미 등록된 일정 '${conflictingPlan.title}'(${describeMinute(conflictingPlan.startMinute)} - ${describeMinute(conflictingPlan.endMinute)})과 겹쳐 저장할 수 없습니다.`;
}

export function minuteToAngle(minute: number): number {
  return (minute / MINUTES_PER_DAY) * 360 - 90;
}

export function polarToCartesian(angleInDegrees: number, radius: number): {
  x: number;
  y: number;
} {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: Math.cos(angleInRadians) * radius,
    y: Math.sin(angleInRadians) * radius
  };
}

export function describeMinute(minute: number): string {
  const safeMinute = ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(safeMinute / 60);
  const mins = safeMinute % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function describeMinuteWithFormat(
  minute: number,
  timeDisplayFormat: TimeDisplayFormat
): string {
  if (timeDisplayFormat === "24h") {
    return describeMinute(minute);
  }

  const safeMinute = ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(safeMinute / 60);
  const mins = safeMinute % 60;
  const meridiem = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${meridiem} ${hour12}:${String(mins).padStart(2, "0")}`;
}

export function getCurrentPlan(plans: DailyPlan[], currentMinute: number): DailyPlan | null {
  return plans.find((plan) => isCurrentPlan(plan, currentMinute)) ?? null;
}

export function getPlannerSummary(plans: DailyPlan[]): PlannerSummary {
  const summary = getPlannerPerformanceSummary(plans);

  return {
    total: summary.totalCount,
    completed: summary.completedCount,
    completionRate:
      summary.totalCount === 0 ? 0 : Math.round((summary.completedCount / summary.totalCount) * 100)
  };
}

export function markMissedPlans(plans: DailyPlan[], currentMinute: number): DailyPlan[] {
  return sortPlans(
    plans.map((plan) =>
      plan.status === "pending" && getComparableCurrentMinute(plan, currentMinute) >= plan.endMinute
        ? { ...plan, status: "missed" }
        : plan
    )
  );
}

export function findNextAvailableTimeSlot(
  plans: DailyPlan[],
  durationMinutes: number,
  startMinute: number
): { endMinute: number; startMinute: number } | null {
  const sortedPlans = sortPlans(plans);
  let candidateStart = Math.max(0, Math.min(startMinute, MINUTES_PER_DAY - durationMinutes));

  for (const plan of sortedPlans) {
    if (candidateStart + durationMinutes <= plan.startMinute) {
      return {
        startMinute: candidateStart,
        endMinute: candidateStart + durationMinutes
      };
    }

    if (candidateStart < plan.endMinute) {
      candidateStart = plan.endMinute;
    }
  }

  if (candidateStart + durationMinutes <= MINUTES_PER_DAY) {
    return {
      startMinute: candidateStart,
      endMinute: candidateStart + durationMinutes
    };
  }

  return null;
}

export function isCurrentPlan(plan: DailyPlan, currentMinute: number): boolean {
  const comparableMinute = getComparableCurrentMinute(plan, currentMinute);

  return comparableMinute >= plan.startMinute && comparableMinute < plan.endMinute;
}

export function sortPlans(plans: DailyPlan[]): DailyPlan[] {
  return [...plans].sort((left, right) => left.startMinute - right.startMinute);
}

export function timeStringToMinute(value: string): number {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("시간을 입력해 주십시오.");
  }

  let hours: number;
  let minutes: number;

  if (normalized.includes(":")) {
    const [hourText, minuteText] = normalized.split(":");

    hours = Number.parseInt(hourText ?? "", 10);
    minutes = Number.parseInt(minuteText ?? "", 10);
  } else if (/^\d{1,2}$/.test(normalized)) {
    hours = Number.parseInt(normalized, 10);
    minutes = 0;
  } else if (/^\d{3}$/.test(normalized)) {
    hours = Number.parseInt(normalized.slice(0, 1), 10);
    minutes = Number.parseInt(normalized.slice(1), 10);
  } else if (/^\d{4}$/.test(normalized)) {
    hours = Number.parseInt(normalized.slice(0, 2), 10);
    minutes = Number.parseInt(normalized.slice(2), 10);
  } else {
    throw new Error("시간은 9, 12, 930, 1230, 09:30 형식으로 입력해 주십시오.");
  }

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error("시간은 0:00부터 23:59 사이로 입력해 주십시오.");
  }

  return hours * 60 + minutes;
}

export function minuteToTimeString(minute: number): string {
  const safeMinute = ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(safeMinute / 60) % 24;
  const mins = safeMinute % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function normalizeEndMinute(startMinute: number, endMinute: number): number {
  if (endMinute === startMinute) {
    throw new Error("종료 시간은 시작 시간과 같을 수 없습니다.");
  }

  return endMinute <= startMinute ? endMinute + MINUTES_PER_DAY : endMinute;
}

export function getComparableCurrentMinute(plan: Pick<DailyPlan, "startMinute" | "endMinute">, currentMinute: number): number {
  if (plan.endMinute > MINUTES_PER_DAY && currentMinute < plan.endMinute - MINUTES_PER_DAY) {
    return currentMinute + MINUTES_PER_DAY;
  }

  return currentMinute;
}

export function createArcPath(startMinute: number, endMinute: number, radius: number): string {
  return createCenteredArcPath(startMinute, endMinute, radius, 0, 0);
}

export function createCenteredArcPath(
  startMinute: number,
  endMinute: number,
  radius: number,
  centerX: number,
  centerY: number
): string {
  const startAngle = minuteToAngle(startMinute);
  const endAngle = minuteToAngle(endMinute);
  const start = polarToCartesian(startAngle, radius);
  const end = polarToCartesian(endAngle, radius);
  const largeArcFlag = endMinute - startMinute > MINUTES_PER_DAY / 2 ? 1 : 0;

  return `M ${centerX + start.x} ${centerY + start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${centerX + end.x} ${centerY + end.y}`;
}

export function createSectorPath(
  startMinute: number,
  endMinute: number,
  outerRadius: number,
  centerX: number,
  centerY: number
): string {
  const startAngle = minuteToAngle(startMinute);
  const endAngle = minuteToAngle(endMinute);
  const start = polarToCartesian(startAngle, outerRadius);
  const end = polarToCartesian(endAngle, outerRadius);
  const largeArcFlag = endMinute - startMinute > MINUTES_PER_DAY / 2 ? 1 : 0;

  return [
    `M ${centerX} ${centerY}`,
    `L ${centerX + start.x} ${centerY + start.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${centerX + end.x} ${centerY + end.y}`,
    "Z"
  ].join(" ");
}

export function getReadableTextColor(hexColor: string): string {
  const normalized = hexColor.replace("#", "");
  const safeColor =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const red = Number.parseInt(safeColor.slice(0, 2), 16);
  const green = Number.parseInt(safeColor.slice(2, 4), 16);
  const blue = Number.parseInt(safeColor.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.68 ? "#31323a" : "#ffffff";
}

export function getPlanDuration(plan: DailyPlan): number {
  return plan.endMinute - plan.startMinute;
}

export function getSectorLabelFontSize(plan: DailyPlan): number {
  const duration = getPlanDuration(plan);
  const sizeByDuration = Math.max(9, Math.min(24, duration / 7));
  const penalty = Math.max(0, plan.title.length - 4) * 0.8;

  return Math.max(9, Math.min(22, sizeByDuration - penalty));
}

export function formatSectorLabel(plan: DailyPlan): string {
  const duration = getPlanDuration(plan);
  const maxChars = duration >= 180 ? 10 : duration >= 90 ? 7 : duration >= 45 ? 5 : 3;

  if (plan.title.length <= maxChars) {
    return plan.title;
  }

  return `${plan.title.slice(0, Math.max(1, maxChars - 1))}…`;
}

export function getSectorLabelRotation(minute: number): number {
  const angle = minuteToAngle(minute);
  const normalized = ((angle % 360) + 360) % 360;

  if (minute >= 12 * 60) {
    return (normalized + 180) % 360;
  }

  return normalized;
}
