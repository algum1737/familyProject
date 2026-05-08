import type { DatedPlanRecord, DailyPlan } from "@/domains/plans/types";

type PlanLike = Pick<DailyPlan, "id" | "sourcePlanId" | "status">;

export type PlannerPerformanceSummary = {
  totalCount: number;
  completedCount: number;
  missedCount: number;
  pendingCount: number;
  completedAfterRescheduleCount: number;
};

function getChainKey(plan: Pick<DailyPlan, "id" | "sourcePlanId">) {
  return plan.sourcePlanId ?? plan.id;
}

function getChainStatus(plans: PlanLike[]): "done" | "missed" | "pending" {
  if (plans.some((plan) => plan.status === "done")) {
    return "done";
  }

  if (plans.some((plan) => plan.status === "missed")) {
    return "missed";
  }

  return "pending";
}

export function getPlannerPerformanceSummary<T extends PlanLike>(plans: T[]): PlannerPerformanceSummary {
  const grouped = new Map<string, T[]>();

  for (const plan of plans) {
    const key = getChainKey(plan);
    const bucket = grouped.get(key);

    if (bucket) {
      bucket.push(plan);
    } else {
      grouped.set(key, [plan]);
    }
  }

  const chains = Array.from(grouped.values());
  const completedCount = chains.filter((chain) => getChainStatus(chain) === "done").length;
  const missedCount = chains.filter((chain) => getChainStatus(chain) === "missed").length;
  const pendingCount = chains.filter((chain) => getChainStatus(chain) === "pending").length;
  const completedAfterRescheduleCount = chains.filter((chain) =>
    chain.some((plan) => Boolean(plan.sourcePlanId) && plan.status === "done")
  ).length;

  return {
    totalCount: chains.length,
    completedCount,
    missedCount,
    pendingCount,
    completedAfterRescheduleCount
  };
}

export function getDatedPlannerPerformanceSummary(plans: DatedPlanRecord[]) {
  return getPlannerPerformanceSummary(plans);
}
