export type PlanStatus = "pending" | "done";

export type DailyPlan = {
  id: string;
  title: string;
  color: string;
  startMinute: number;
  endMinute: number;
  status: PlanStatus;
};

export type PlannerSummary = {
  total: number;
  completed: number;
  completionRate: number;
};

