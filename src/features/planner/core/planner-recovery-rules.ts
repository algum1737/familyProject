import type { DailyPlan, PlanStatus } from "@/domains/plans/types";

export type RecoveryHighlightKind =
  | "reflection_prompt"
  | "reschedule_prompt"
  | "reschedule_unavailable"
  | "followup_completed"
  | "followup_scheduled"
  | "followup_soon"
  | "followup_active";

export type RecoveryHighlightState = {
  followUpPlanId: string | null;
  followUpStartMinute: number | null;
  kind: RecoveryHighlightKind;
} | null;

function getChainRootId(plan: DailyPlan) {
  return plan.sourcePlanId ?? plan.id;
}

function isLaterChainFollowUp(basePlan: DailyPlan, candidate: DailyPlan) {
  return (
    candidate.id !== basePlan.id &&
    getChainRootId(candidate) === getChainRootId(basePlan) &&
    candidate.rescheduleCount > basePlan.rescheduleCount
  );
}

function isCurrentPlanAtMinute(plan: Pick<DailyPlan, "startMinute" | "endMinute">, currentMinute: number) {
  return currentMinute >= plan.startMinute && currentMinute < plan.endMinute;
}

export function getChainRescheduleCount(plans: DailyPlan[], plan: DailyPlan) {
  const chainRootId = getChainRootId(plan);

  return plans.reduce((maxCount, item) => {
    if (getChainRootId(item) !== chainRootId) {
      return maxCount;
    }

    return Math.max(maxCount, item.rescheduleCount);
  }, 0);
}

export function findNextPendingFollowUp(plans: DailyPlan[], plan: DailyPlan) {
  return (
    plans.find(
      (item) =>
        isLaterChainFollowUp(plan, item) &&
        item.status === "pending"
    ) ?? null
  );
}

export function findAnyFollowUp(plans: DailyPlan[], plan: DailyPlan) {
  const followUps = plans
    .filter((item) => isLaterChainFollowUp(plan, item))
    .sort((left, right) => left.startMinute - right.startMinute);

  return followUps.at(-1) ?? null;
}

export function getRecoveryHighlightState(
  plan: DailyPlan,
  plans: DailyPlan[],
  currentMinute: number | null
): RecoveryHighlightState {
  if (plan.status !== "missed") {
    return null;
  }

  if (!plan.reflectionNote?.trim()) {
    return {
      followUpPlanId: null,
      followUpStartMinute: null,
      kind: "reflection_prompt"
    };
  }

  const anyFollowUp = findAnyFollowUp(plans, plan);
  const nextPendingFollowUp = findNextPendingFollowUp(plans, plan);

  if (anyFollowUp && anyFollowUp.status === "done") {
    return {
      followUpPlanId: anyFollowUp.id,
      followUpStartMinute: anyFollowUp.startMinute,
      kind: "followup_completed"
    };
  }

  if (!nextPendingFollowUp) {
    return plan.rescheduleCount < 3
      ? {
          followUpPlanId: null,
          followUpStartMinute: null,
          kind: "reschedule_prompt"
        }
      : null;
  }

  if (currentMinute !== null && isCurrentPlanAtMinute(nextPendingFollowUp, currentMinute)) {
    return {
      followUpPlanId: nextPendingFollowUp.id,
      followUpStartMinute: nextPendingFollowUp.startMinute,
      kind: "followup_active"
    };
  }

  if (
    currentMinute !== null &&
    nextPendingFollowUp.startMinute >= currentMinute &&
    nextPendingFollowUp.startMinute - currentMinute <= 60
  ) {
    return {
      followUpPlanId: nextPendingFollowUp.id,
      followUpStartMinute: nextPendingFollowUp.startMinute,
      kind: "followup_soon"
    };
  }

  return {
    followUpPlanId: nextPendingFollowUp.id,
    followUpStartMinute: nextPendingFollowUp.startMinute,
    kind: "followup_scheduled"
  };
}

export function getPlannerStatusLabelKey(
  status: PlanStatus,
  isCurrent: boolean
): "current" | "pending" | "done" | "missed" {
  if (status === "done") {
    return "done";
  }

  if (status === "missed") {
    return "missed";
  }

  return isCurrent ? "current" : "pending";
}
