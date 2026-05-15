import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { DailyPlan } from "../../../../../src/domains/plans/types";
import type {
  ReminderProvider,
  ReminderRequest
} from "../../../../../src/providers/reminders/reminder-provider";
import {
  buildExpoReminderDateTrigger,
  buildExpoReminderNotificationContent,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_ID,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME
} from "./expo-reminder-notification-config";
import { createExpoReminderSyncQueue } from "./expo-reminder-sync-queue";
import {
  buildExpoStartReminderRequests,
  EXPO_END_RECOVERY_REMINDER_KIND,
  EXPO_START_REMINDER_KIND,
  getExpoEndRecoveryReminderNotificationKey,
  getExpoStartReminderNotificationKey,
  getExpoStartReminderSyncSignature
} from "./expo-start-reminder-sync";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    priority: Notifications.AndroidNotificationPriority.HIGH,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

type ExpoScheduledNotification = Awaited<
  ReturnType<typeof Notifications.getAllScheduledNotificationsAsync>
>[number];

export type ExpoStartReminderProvider = ReminderProvider & {
  scheduleStartReminder: (input: {
    body: string;
    planId: string;
    scheduledFor: Date;
    title: string;
  }) => Promise<string>;
};

function isManagedStartReminder(notification: ExpoScheduledNotification) {
  return (
    notification.content.data?.kind === EXPO_START_REMINDER_KIND ||
    notification.content.data?.kind === EXPO_END_RECOVERY_REMINDER_KIND
  );
}

function matchesPlanId(notification: ExpoScheduledNotification, planId: string) {
  return (
    isManagedStartReminder(notification) &&
    notification.content.data?.planId === planId
  );
}

async function ensureNotificationPermission() {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function ensureAndroidReminderNotificationChannel() {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(EXPO_REMINDER_NOTIFICATION_CHANNEL_ID, {
    enableVibrate: true,
    importance: Notifications.AndroidImportance.HIGH,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    name: EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME,
    showBadge: false,
    vibrationPattern: [0, 250, 250, 250]
  });
}

async function cancelNotifications(notifications: ExpoScheduledNotification[]) {
  await Promise.all(
    notifications.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier).catch(
        () => undefined
      )
    )
  );
}

function buildStartReminderBody(plan: DailyPlan) {
  return `${plan.title} 시작 5분 전입니다.`;
}

function buildEndRecoveryReminderBody(plan: DailyPlan) {
  return `${plan.title} 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`;
}

export function createExpoStartReminderProvider(): ExpoStartReminderProvider {
  let lastSyncSignature = "";
  const syncQueue = createExpoReminderSyncQueue();

  async function schedule({ plan, scheduledFor }: ReminderRequest) {
    await scheduleStartReminder({
      body: buildStartReminderBody(plan),
      planId: plan.id,
      scheduledFor,
      title: "오늘 다 했니"
    });
  }

  async function scheduleNotification(input: {
    body: string;
    notificationKey: string;
    planId: string;
    scheduledFor: Date;
    title: string;
  }) {
    await ensureAndroidReminderNotificationChannel();

    return Notifications.scheduleNotificationAsync({
      content: buildExpoReminderNotificationContent({
        body: input.body,
        notificationKey: input.notificationKey,
        planId: input.planId,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        title: input.title
      }),
      trigger: buildExpoReminderDateTrigger({
        channelId: EXPO_REMINDER_NOTIFICATION_CHANNEL_ID,
        scheduledFor: input.scheduledFor
      }) as Notifications.NotificationTriggerInput
    });
  }

  async function scheduleStartReminder(input: {
    body: string;
    planId: string;
    scheduledFor: Date;
    title: string;
  }) {
    return scheduleNotification({
      ...input,
      notificationKey: getExpoStartReminderNotificationKey(input.planId)
    });
  }

  async function cancel(planId: string) {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    await cancelNotifications(
      notifications.filter((notification) => matchesPlanId(notification, planId))
    );
    lastSyncSignature = "";
  }

  async function runSync(plans: DailyPlan[], now: Date, isLatest: () => boolean) {
    if (!isLatest()) {
      return;
    }

    const allowed = await ensureNotificationPermission();

    if (!allowed) {
      return;
    }

    await ensureAndroidReminderNotificationChannel();

    const requests = buildExpoStartReminderRequests(plans, now);
    const nextSignature = getExpoStartReminderSyncSignature(requests);

    if (nextSignature === lastSyncSignature) {
      return;
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    if (!isLatest()) {
      return;
    }

    await cancelNotifications(scheduled.filter(isManagedStartReminder));

    for (const request of requests) {
      if (!isLatest()) {
        return;
      }

      await scheduleNotification({
        body:
          request.kind === EXPO_END_RECOVERY_REMINDER_KIND
            ? buildEndRecoveryReminderBody(request.plan)
            : buildStartReminderBody(request.plan),
        notificationKey:
          request.kind === EXPO_END_RECOVERY_REMINDER_KIND
            ? getExpoEndRecoveryReminderNotificationKey(request.plan.id)
            : getExpoStartReminderNotificationKey(request.plan.id),
        planId: request.plan.id,
        scheduledFor: request.scheduledFor,
        title: "오늘 다 했니"
      });
    }

    if (isLatest()) {
      lastSyncSignature = nextSignature;
    }
  }

  function sync(plans: DailyPlan[], now: Date) {
    return syncQueue.run((isLatest) => runSync(plans, now, isLatest));
  }

  return {
    cancel,
    schedule,
    scheduleStartReminder,
    sync
  };
}
