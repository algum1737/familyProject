import type { DailyPlan } from "@/domains/plans/types";
import type { ReminderProvider, ReminderRequest } from "@/providers/reminders/reminder-provider";

export const noopReminderProvider: ReminderProvider = {
  sync(_plans: DailyPlan[], _now: Date) {},
  schedule(_request: ReminderRequest) {},
  cancel(_planId: string) {}
};
