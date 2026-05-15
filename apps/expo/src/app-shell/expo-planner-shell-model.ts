import type { TimeDisplayFormat } from "../../../../src/domains/plans/service/planner";
import type { DailyPlan, PlannerSummary } from "../../../../src/domains/plans/types";
import type { MonthlyCalendarDay } from "../../../../src/domains/plans/selectors/monthly-calendar-status";
import type { MonthlyMotivationSummary } from "../../../../src/domains/plans/selectors/monthly-motivation-summary";
import type { RecoveryContributionSummary } from "../../../../src/domains/plans/selectors/recovery-contribution-summary";
import type {
  ExpoPlanFormErrors,
  ExpoPlanFormField,
  ExpoPlanFormState
} from "./use-expo-planner-state";

export type ExpoPlanItemView = {
  canReschedule: boolean;
  canToggleStatus: boolean;
  id: string;
  recoveryLabel: string | null;
  rescheduleActionState: "enabled" | "blocked" | "hidden";
  rescheduleBlockedReason: string | null;
  statusLabel: string;
  statusTone: "current" | "pending" | "done" | "missed";
  timeText: string;
  title: string;
};

export type ExpoPlannerShellModel = {
  activeEndRecoveryReminder: DailyPlan | null;
  activeReminder: DailyPlan | null;
  canCompleteActiveReminder: boolean;
  cancelEditing(): void;
  cancelRecovery(): void;
  currentMinute: number;
  currentPlan: DailyPlan | null;
  currentPlanTimeText: string;
  dailySummary: {
    plannedCount: number;
    reflectionCount: number;
  } | null;
  defaultFormState: ExpoPlanFormState;
  deletePlan(planId: string): void;
  dismissEndRecovery(planId: string): void;
  dismissReminder(planId: string): void;
  error: string | null;
  fieldErrors: ExpoPlanFormErrors;
  focusField: ExpoPlanFormField | null;
  focusRequest: number;
  form: ExpoPlanFormState;
  monthlyCalendar: MonthlyCalendarDay[];
  monthlySummary: MonthlyMotivationSummary;
  planTitleMaxLength: number;
  recoveryMode: "reflection" | "reschedule" | null;
  recoveryPlan: DailyPlan | null;
  recoverySummary: RecoveryContributionSummary;
  reflectionNoteDraft: string;
  saveReflection(): void;
  setReflectionNoteDraft(note: string): void;
  setTimeDisplayFormat(next: TimeDisplayFormat): void;
  startCreatePlan(): void;
  startEditingPlan(plan: DailyPlan): void;
  startReflection(plan: DailyPlan): void;
  startRescheduling(plan: DailyPlan): "maxed" | "started" | "unavailable";
  submitPlan(): boolean;
  summary: PlannerSummary;
  timeDisplayFormat: TimeDisplayFormat;
  todayPlanItems: ExpoPlanItemView[];
  todayPlans: DailyPlan[];
  togglePlanStatus(planId: string): void;
  updateForm(values: Partial<ExpoPlanFormState>): void;
};
