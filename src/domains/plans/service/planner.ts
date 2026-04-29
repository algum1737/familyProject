import { z } from "zod";

import type { DailyPlan, PlannerSummary } from "@/domains/plans/types";

export const MINUTES_PER_DAY = 24 * 60;

export const dailyPlanSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    color: z.string().min(1),
    startMinute: z.number().int().min(0).max(MINUTES_PER_DAY - 1),
    endMinute: z.number().int().min(1).max(MINUTES_PER_DAY),
    rescheduleCount: z.number().int().min(0).max(3).default(0),
    sourcePlanId: z.string().min(1).optional(),
    reflectionNote: z.string().max(500).optional(),
    status: z.enum(["pending", "done", "missed"])
  })
  .refine((plan) => plan.endMinute > plan.startMinute, {
    message: "Plan end time must be later than start time."
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
  const sortedPlans = sortPlans(parsedPlans);

  for (let index = 1; index < sortedPlans.length; index += 1) {
    const previous = sortedPlans[index - 1];
    const current = sortedPlans[index];

    if (current.startMinute < previous.endMinute) {
      throw new Error(getOverlapErrorMessage(previous, current, options.focusPlanId));
    }
  }

  return parsedPlans;
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
  const hours = Math.floor(minute / 60);
  const mins = minute % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getCurrentPlan(plans: DailyPlan[], currentMinute: number): DailyPlan | null {
  return (
    plans.find(
      (plan) => currentMinute >= plan.startMinute && currentMinute < plan.endMinute
    ) ?? null
  );
}

export function getPlannerSummary(plans: DailyPlan[]): PlannerSummary {
  const total = plans.length;
  const completed = plans.filter((plan) => plan.status === "done").length;

  return {
    total,
    completed,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}

export function markMissedPlans(plans: DailyPlan[], currentMinute: number): DailyPlan[] {
  return sortPlans(
    plans.map((plan) =>
      plan.status === "pending" && currentMinute >= plan.endMinute
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
  return currentMinute >= plan.startMinute && currentMinute < plan.endMinute;
}

export function sortPlans(plans: DailyPlan[]): DailyPlan[] {
  return [...plans].sort((left, right) => left.startMinute - right.startMinute);
}

export function timeStringToMinute(value: string): number {
  const [hourText, minuteText] = value.split(":");
  const hours = Number.parseInt(hourText ?? "", 10);
  const minutes = Number.parseInt(minuteText ?? "", 10);

  return hours * 60 + minutes;
}

export function minuteToTimeString(minute: number): string {
  const safeMinute = Math.max(0, Math.min(MINUTES_PER_DAY, minute));
  const hours = Math.floor(safeMinute / 60) % 24;
  const mins = safeMinute % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
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
