export type PlanStatus = "pending" | "done" | "missed";

export type DailyPlan = {
  id: string;
  title: string;
  color: string;
  startMinute: number;
  endMinute: number;
  rescheduleCount: number;
  sourcePlanId?: string;
  reflectionNote?: string;
  status: PlanStatus;
};

export type PlannerSummary = {
  total: number;
  completed: number;
  completionRate: number;
};
