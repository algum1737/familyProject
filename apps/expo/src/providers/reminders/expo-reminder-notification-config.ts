import {
  EXPO_END_RECOVERY_REMINDER_KIND,
  EXPO_START_REMINDER_KIND
} from "./expo-start-reminder-sync";

export const EXPO_REMINDER_NOTIFICATION_CHANNEL_ID = "today-reminders-high";
export const EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME = "오늘 다 했니 리마인드";
export const EXPO_REMINDER_DATE_TRIGGER_TYPE = "date";

type ExpoReminderNotificationKind =
  | typeof EXPO_END_RECOVERY_REMINDER_KIND
  | typeof EXPO_START_REMINDER_KIND;

export function getExpoReminderNotificationKind(notificationKey: string) {
  return notificationKey.startsWith("end-recovery-reminder:")
    ? EXPO_END_RECOVERY_REMINDER_KIND
    : EXPO_START_REMINDER_KIND;
}

export function buildExpoReminderNotificationContent(input: {
  body: string;
  notificationKey: string;
  planId: string;
  priority: string;
  title: string;
}) {
  const kind: ExpoReminderNotificationKind = getExpoReminderNotificationKind(
    input.notificationKey
  );

  return {
    body: input.body,
    data: {
      kind,
      notificationKey: input.notificationKey,
      planId: input.planId
    },
    priority: input.priority,
    sound: true,
    title: input.title
  };
}

export function buildExpoReminderDateTrigger(input: {
  channelId: string;
  scheduledFor: Date;
}) {
  return {
    channelId: input.channelId,
    date: input.scheduledFor,
    type: EXPO_REMINDER_DATE_TRIGGER_TYPE
  };
}
