import type { ReminderProvider, ReminderRequest } from "@/providers/reminders/reminder-provider";
import type { DailyPlan } from "@/domains/plans/types";

export const expoLocalReminderProvider: ReminderProvider = {
  async sync(_plans: DailyPlan[], _now: Date) {},
  async schedule(_request: ReminderRequest) {},
  async cancel(_planId: string) {}
};
