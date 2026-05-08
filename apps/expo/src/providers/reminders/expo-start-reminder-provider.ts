import * as Notifications from "expo-notifications";

type ScheduleStartReminderInput = {
  body: string;
  id: string;
  secondsFromNow: number;
  title: string;
};

export type ExpoStartReminderProvider = {
  cancel: (id: string) => Promise<void>;
  scheduleStartReminder: (input: ScheduleStartReminderInput) => Promise<string>;
};

export function createExpoStartReminderProvider(): ExpoStartReminderProvider {
  return {
    async cancel(id) {
      await Notifications.dismissNotificationAsync(id).catch(() => undefined);
    },
    async scheduleStartReminder({ body, secondsFromNow, title }) {
      return Notifications.scheduleNotificationAsync({
        content: {
          body,
          title
        },
        trigger: {
          seconds: Math.max(1, Math.floor(secondsFromNow)),
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
        }
      });
    }
  };
}
