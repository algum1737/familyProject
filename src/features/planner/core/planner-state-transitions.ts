import {
  findNextAvailableTimeSlot,
  minuteToTimeString,
  normalizeEndMinute,
  sortPlans,
  timeStringToMinute,
  validatePlanTitle,
  validatePlanner
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";

export const RESCHEDULE_UNAVAILABLE_MESSAGE =
  "오늘 남은 빈 시간에는 이 일정 길이 그대로 다시 지정할 수 없습니다.";
export const RESCHEDULE_MAXED_MESSAGE =
  "이 일정은 다시 지정 최대 3회를 모두 사용했습니다.";

type PlannerFormInput = {
  color: string;
  endTime: string;
  startTime: string;
  title: string;
};

type BuildFormOptions = {
  color: string;
  endMinute: number;
  startMinute: number;
  title: string;
};

type PlannerFormValues = {
  color: string;
  endTime: string;
  startTime: string;
  title: string;
};

type SubmitPlannerPlanOptions = {
  plans: DailyPlan[];
  form: PlannerFormInput;
  editingPlanId: string | null;
  recoveryMode: "reflection" | "reschedule" | null;
  recoveryPlanId: string | null;
  createId: () => string;
};

type StartPlannerRescheduleOptions = {
  plans: DailyPlan[];
  plan: DailyPlan;
  currentMinute: number | null;
};

type StartPlannerRescheduleResult =
  | {
      kind: "started";
      formValues: PlannerFormValues;
    }
  | {
      kind: "maxed";
      error: string;
    }
  | {
      kind: "unavailable";
      error: string;
    };

export function buildPlannerFormValues(options: BuildFormOptions): PlannerFormValues {
  return {
    color: options.color,
    endTime: minuteToTimeString(options.endMinute),
    startTime: minuteToTimeString(options.startMinute),
    title: options.title
  };
}

export function submitPlannerPlan(options: SubmitPlannerPlanOptions): DailyPlan[] {
  const previousPlan =
    options.plans.find((plan) => plan.id === options.editingPlanId) ??
    options.plans.find((plan) => plan.id === options.recoveryPlanId);
  const isRescheduling =
    options.recoveryMode === "reschedule" && options.recoveryPlanId !== null;
  const startMinute = timeStringToMinute(options.form.startTime);
  const endMinute = normalizeEndMinute(
    startMinute,
    timeStringToMinute(options.form.endTime)
  );
  const nextPlan: DailyPlan = {
    id: isRescheduling
      ? options.createId()
      : options.editingPlanId ?? options.createId(),
    title: validatePlanTitle(options.form.title),
    color: options.form.color,
    startMinute,
    endMinute,
    rescheduleCount: isRescheduling
      ? (previousPlan?.rescheduleCount ?? 0) + 1
      : previousPlan?.rescheduleCount ?? 0,
    sourcePlanId:
      isRescheduling && previousPlan
        ? previousPlan.sourcePlanId ?? previousPlan.id
        : previousPlan?.sourcePlanId,
    reflectionNote: previousPlan?.reflectionNote,
    status: isRescheduling ? "pending" : previousPlan?.status ?? "pending"
  };
  const basePlans =
    options.editingPlanId === null || isRescheduling
      ? options.plans
      : options.plans.filter((plan) => plan.id !== options.editingPlanId);

  return sortPlans(
    validatePlanner([...basePlans, nextPlan], {
      focusPlanId: nextPlan.id
    })
  );
}

export function togglePlannerPlanStatus(plans: DailyPlan[], planId: string): DailyPlan[] {
  return sortPlans(
    plans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            status:
              plan.status === "done"
                ? "pending"
                : plan.status === "pending"
                  ? "done"
                  : "missed"
          }
        : plan
    )
  );
}

export function savePlannerReflection(
  plans: DailyPlan[],
  recoveryPlanId: string | null,
  reflectionNoteDraft: string
): DailyPlan[] {
  if (!recoveryPlanId) {
    return plans;
  }

  return plans.map((plan) =>
    plan.id === recoveryPlanId
      ? {
          ...plan,
          reflectionNote: reflectionNoteDraft.trim() || undefined
        }
      : plan
  );
}

export function startPlannerReschedule(
  options: StartPlannerRescheduleOptions
): StartPlannerRescheduleResult {
  if (options.plan.rescheduleCount >= 3) {
    return {
      kind: "maxed",
      error: RESCHEDULE_MAXED_MESSAGE
    };
  }

  const duration = options.plan.endMinute - options.plan.startMinute;
  const suggestedSlot = findNextAvailableTimeSlot(
    options.plans.filter((item) => item.id !== options.plan.id),
    duration,
    Math.max(options.currentMinute ?? options.plan.endMinute, options.plan.endMinute)
  );

  if (!suggestedSlot) {
    return {
      kind: "unavailable",
      error: RESCHEDULE_UNAVAILABLE_MESSAGE
    };
  }

  return {
    kind: "started",
    formValues: buildPlannerFormValues({
      color: options.plan.color,
      endMinute: suggestedSlot.endMinute,
      startMinute: suggestedSlot.startMinute,
      title: options.plan.title
    })
  };
}
