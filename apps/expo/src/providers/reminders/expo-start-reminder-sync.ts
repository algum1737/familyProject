import type { DailyPlan } from "../../../../../src/domains/plans/types";
import {
  END_RECOVERY_LEAD_MINUTES,
  REMINDER_LEAD_MINUTES,
  REMINDER_SCHEDULE_GRACE_MINUTES
} from "../../../../../src/features/planner/core/planner-reminder-rules";
import type { ReminderRequest } from "../../../../../src/providers/reminders/reminder-provider";

export const EXPO_START_REMINDER_KIND = "start-reminder";
export const EXPO_END_RECOVERY_REMINDER_KIND = "end-recovery-reminder";

export type ExpoStartReminderRequest = ReminderRequest & {
  kind: typeof EXPO_START_REMINDER_KIND | typeof EXPO_END_RECOVERY_REMINDER_KIND;
  notificationKey: string;
};

export function getExpoStartReminderNotificationKey(planId: string) {
  return `start-reminder:${planId}`;
}

export function getExpoEndRecoveryReminderNotificationKey(planId: string) {
  return `end-recovery-reminder:${planId}`;
}

function buildScheduledFor(now: Date, startMinute: number) {
  const scheduledFor = new Date(now);

  scheduledFor.setHours(0, 0, 0, 0);
  scheduledFor.setMinutes(startMinute - REMINDER_LEAD_MINUTES);

  return scheduledFor;
}

function buildEndRecoveryScheduledFor(now: Date, endMinute: number) {
  const scheduledFor = new Date(now);

  scheduledFor.setHours(0, 0, 0, 0);
  scheduledFor.setMinutes(endMinute - END_RECOVERY_LEAD_MINUTES);

  return scheduledFor;
}

function isWithinScheduleWindow(request: ReminderRequest, now: Date) {
  const expiresAt = new Date(request.scheduledFor);

  expiresAt.setMinutes(expiresAt.getMinutes() + REMINDER_SCHEDULE_GRACE_MINUTES);

  return expiresAt.getTime() > now.getTime();
}

function buildStartReminderRequest(plan: DailyPlan, now: Date): ExpoStartReminderRequest {
  return {
    kind: EXPO_START_REMINDER_KIND,
    notificationKey: getExpoStartReminderNotificationKey(plan.id),
    plan,
    scheduledFor: buildScheduledFor(now, plan.startMinute)
  };
}

function buildEndRecoveryReminderRequest(
  plan: DailyPlan,
  now: Date
): ExpoStartReminderRequest {
  return {
    kind: EXPO_END_RECOVERY_REMINDER_KIND,
    notificationKey: getExpoEndRecoveryReminderNotificationKey(plan.id),
    plan,
    scheduledFor: buildEndRecoveryScheduledFor(now, plan.endMinute)
  };
}

export function buildExpoStartReminderRequests(plans: DailyPlan[], now: Date) {
  const startRequests: ExpoStartReminderRequest[] = plans
    .filter((plan) => plan.status === "pending")
    .map((plan) => buildStartReminderRequest(plan, now))
    .filter((request) => isWithinScheduleWindow(request, now))
    .sort((left, right) => left.scheduledFor.getTime() - right.scheduledFor.getTime());
  const endRecoveryRequests: ExpoStartReminderRequest[] = plans
    .filter((plan) => plan.status === "pending")
    .map((plan) => buildEndRecoveryReminderRequest(plan, now))
    .filter((request) => isWithinScheduleWindow(request, now))
    .sort((left, right) => left.scheduledFor.getTime() - right.scheduledFor.getTime());

  return [...startRequests, ...endRecoveryRequests].sort(
    (left, right) => left.scheduledFor.getTime() - right.scheduledFor.getTime()
  );
}

export function getExpoStartReminderSyncSignature(
  requests: ExpoStartReminderRequest[]
) {
  return JSON.stringify(
    requests.map((request) => ({
      kind: request.kind,
      key: request.notificationKey,
      scheduledFor: request.scheduledFor.toISOString()
    }))
  );
}
