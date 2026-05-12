import {
  getComparableCurrentMinute,
  getCurrentPlan,
  isCurrentPlan
} from "@/domains/plans/service/planner";
import type {
  DailyPlan,
  DatedPlanRecord,
  PlanDateKey,
  PlannerSummary
} from "@/domains/plans/types";
import { getPlannerPerformanceSummary } from "@/domains/plans/selectors/planner-performance-summary";
import {
  findAnyFollowUp,
  getChainRescheduleCount,
  getPlannerStatusLabelKey,
  getRecoveryHighlightState,
  type RecoveryHighlightState
} from "@/features/planner/core/planner-recovery-rules";

export type PlannerCoreViewModelInput = {
  date: PlanDateKey;
  plans: DatedPlanRecord[];
  now: Date;
};

export type PlannerCoreViewModel = {
  date: PlanDateKey;
  plans: DatedPlanRecord[];
  summary: PlannerSummary;
  now: Date;
};

export type PlannerPlanItemCoreModel = {
  canReschedule: boolean;
  rescheduleBlockedReason: string | null;
  canToggleStatus: boolean;
  followUpTitle: string | null;
  isCurrent: boolean;
  plan: DailyPlan;
  recoveryBadges: string[];
  recoveryHighlightState: RecoveryHighlightState;
  reflectionPreview: string | null;
  statusLabelKey: "current" | "pending" | "done" | "missed";
};

export function buildPlannerCoreViewModel(
  input: PlannerCoreViewModelInput
): PlannerCoreViewModel {
  return {
    date: input.date,
    plans: input.plans,
    summary: buildPlannerSummary(input.plans),
    now: input.now
  };
}

export function buildPlannerSummary(
  plans: Pick<DailyPlan, "id" | "sourcePlanId" | "status">[]
): PlannerSummary {
  const summary = getPlannerPerformanceSummary(plans);

  return {
    total: summary.totalCount,
    completed: summary.completedCount,
    completionRate:
      summary.totalCount === 0 ? 0 : Math.round((summary.completedCount / summary.totalCount) * 100)
  };
}

export function getCurrentPlanSnapshot(
  plans: DailyPlan[],
  currentMinute: number | null
) {
  const resolvedCurrentMinute = currentMinute ?? 0;
  const currentPlan =
    currentMinute === null ? null : getCurrentPlan(plans, resolvedCurrentMinute);

  return {
    currentPlan,
    isCurrentMinuteReady: currentMinute !== null,
    resolvedCurrentMinute
  };
}

export function canTogglePlanStatus(plan: DailyPlan, currentMinute: number | null) {
  if (currentMinute === null) {
    return false;
  }

  if (plan.status === "missed") {
    return false;
  }

  const comparableMinute = getComparableCurrentMinute(plan, currentMinute);

  return comparableMinute >= plan.startMinute && comparableMinute < plan.endMinute;
}

export function canReschedulePlan(plan: DailyPlan) {
  return plan.status === "missed" && plan.rescheduleCount < 3;
}

export function isCurrentPlanAtMinute(plan: DailyPlan, currentMinute: number | null) {
  if (currentMinute === null) {
    return false;
  }

  return isCurrentPlan(plan, currentMinute);
}

function buildReflectionPreview(note: string | undefined) {
  const trimmed = note?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
}

function getRescheduleBlockedReason(
  plan: DailyPlan,
  anyFollowUp: DailyPlan | null
) {
  if (plan.status !== "missed") {
    return null;
  }

  if (plan.rescheduleCount >= 3) {
    return "다시 지정 3/3 사용 완료";
  }

  if (anyFollowUp) {
    return "이미 다시 지정된 후속 일정이 있음";
  }

  return null;
}

export function buildPlannerPlanItemCoreModels(
  plans: DailyPlan[],
  currentMinute: number | null
): PlannerPlanItemCoreModel[] {
  return plans.map((plan) => {
    const isCurrent = isCurrentPlanAtMinute(plan, currentMinute);
    const recoveryHighlightState = getRecoveryHighlightState(plan, plans, currentMinute);
    const anyFollowUp = findAnyFollowUp(plans, plan);
    const followUpPlan =
      recoveryHighlightState?.followUpPlanId === null || !recoveryHighlightState
        ? null
        : plans.find((item) => item.id === recoveryHighlightState.followUpPlanId) ?? null;
    const recoveryBadges: string[] = [];
    const chainRescheduleCount = getChainRescheduleCount(plans, plan);

    if (plan.reflectionNote?.trim()) {
      recoveryBadges.push("회고 저장됨");
    }

    if (chainRescheduleCount > 0) {
      recoveryBadges.push(`다시 지정 ${chainRescheduleCount}/3`);
    }

    return {
      canReschedule: canReschedulePlan(plan) && anyFollowUp === null,
      rescheduleBlockedReason: getRescheduleBlockedReason(plan, anyFollowUp),
      canToggleStatus: canTogglePlanStatus(plan, currentMinute),
      followUpTitle: followUpPlan?.title ?? null,
      isCurrent,
      plan,
      recoveryBadges,
      recoveryHighlightState,
      reflectionPreview: buildReflectionPreview(plan.reflectionNote),
      statusLabelKey: getPlannerStatusLabelKey(plan.status, isCurrent)
    };
  });
}
