import { describe, expect, it } from "vitest";

import {
  buildExpoReminderDateTrigger,
  buildExpoReminderNotificationContent,
  EXPO_REMINDER_DATE_TRIGGER_TYPE,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_ID,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME,
  getExpoReminderNotificationKind
} from "../apps/expo/src/providers/reminders/expo-reminder-notification-config";

describe("expo reminder notification config", () => {
  it("uses a stable Android channel for reminder notifications", () => {
    expect(EXPO_REMINDER_NOTIFICATION_CHANNEL_ID).toBe("today-reminders-high");
    expect(EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME).toBe("오늘 다 했니 리마인드");
    expect(EXPO_REMINDER_DATE_TRIGGER_TYPE).toBe("date");
  });

  it("classifies start and end recovery notification keys", () => {
    expect(getExpoReminderNotificationKind("start-reminder:plan-1")).toBe("start-reminder");
    expect(getExpoReminderNotificationKind("end-recovery-reminder:plan-1")).toBe(
      "end-recovery-reminder"
    );
  });

  it("builds high-priority content with managed reminder metadata", () => {
    expect(
      buildExpoReminderNotificationContent({
        body: "운동 종료 5분 전입니다.",
        notificationKey: "end-recovery-reminder:run",
        planId: "run",
        priority: "high",
        title: "오늘 다 했니"
      })
    ).toEqual({
      body: "운동 종료 5분 전입니다.",
      data: {
        kind: "end-recovery-reminder",
        notificationKey: "end-recovery-reminder:run",
        planId: "run"
      },
      priority: "high",
      sound: true,
      title: "오늘 다 했니"
    });
  });

  it("builds absolute date triggers for Android reminder scheduling", () => {
    const scheduledFor = new Date(2026, 4, 15, 15, 40, 0, 0);

    expect(
      buildExpoReminderDateTrigger({
        channelId: EXPO_REMINDER_NOTIFICATION_CHANNEL_ID,
        scheduledFor
      })
    ).toEqual({
      channelId: "today-reminders-high",
      date: scheduledFor,
      type: "date"
    });
  });
});
