import type { DailyPlan } from "@/domains/plans/types";

export type ReminderRequest = {
  plan: DailyPlan;
  scheduledFor: Date;
};

export interface ReminderProvider {
  sync(plans: DailyPlan[], now: Date): void | Promise<void>;
  schedule(request: ReminderRequest): void | Promise<void>;
  cancel(planId: string): void | Promise<void>;
}
