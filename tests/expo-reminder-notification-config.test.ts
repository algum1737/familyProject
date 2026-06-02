import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getExpoExactAlarmAccessLabel,
  shouldPromptForExpoExactAlarmAccess
} from "../apps/expo/src/providers/reminders/expo-exact-alarm-access";
import {
  buildExpoReminderDateTrigger,
  buildExpoReminderNotificationContent,
  EXPO_REMINDER_DATE_TRIGGER_TYPE,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_ID,
  EXPO_REMINDER_NOTIFICATION_CHANNEL_NAME,
  getExpoReminderNotificationKind
} from "../apps/expo/src/providers/reminders/expo-reminder-notification-config";

const androidManifestPath = resolve(
  process.cwd(),
  "apps/expo/android/app/src/main/AndroidManifest.xml"
);
const mainApplicationPath = resolve(
  process.cwd(),
  "apps/expo/android/app/src/main/java/com/familyproject/todaydidyoufinish/MainApplication.kt"
);
const exactAlarmModulePath = resolve(
  process.cwd(),
  "apps/expo/android/app/src/main/java/com/familyproject/todaydidyoufinish/ExactAlarmModule.kt"
);
const exactAlarmPackagePath = resolve(
  process.cwd(),
  "apps/expo/android/app/src/main/java/com/familyproject/todaydidyoufinish/ExactAlarmPackage.kt"
);

describe("expo reminder notification config", () => {
  it("declares Android exact alarm access for precise start reminders", () => {
    const manifest = readFileSync(androidManifestPath, "utf8");

    expect(manifest).toContain("android.permission.SCHEDULE_EXACT_ALARM");
    expect(manifest).not.toContain("android.permission.USE_EXACT_ALARM");
  });

  it("keeps the Android exact alarm native bridge registered", () => {
    const mainApplication = readFileSync(mainApplicationPath, "utf8");
    const exactAlarmModule = readFileSync(exactAlarmModulePath, "utf8");
    const exactAlarmPackage = readFileSync(exactAlarmPackagePath, "utf8");

    expect(mainApplication).toContain("add(ExactAlarmPackage())");
    expect(exactAlarmPackage).toContain("listOf(ExactAlarmModule(reactContext))");
    expect(exactAlarmModule).toContain('getName(): String = "ExactAlarmModule"');
    expect(exactAlarmModule).toContain("canScheduleExactAlarms()");
    expect(exactAlarmModule).toContain("Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM");
    expect(exactAlarmModule).toContain("ERR_EXACT_ALARM_SETTINGS");
  });

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

  it("builds exact alarm access labels and prompts", () => {
    expect(getExpoExactAlarmAccessLabel("checking")).toBe("알림 상태 확인 중");
    expect(getExpoExactAlarmAccessLabel("granted")).toBe("정확 알림 켜짐");
    expect(getExpoExactAlarmAccessLabel("needs-permission")).toBe("정확 알림 켜기");
    expect(getExpoExactAlarmAccessLabel("not-required")).toBe("정확 알림 지원");
    expect(getExpoExactAlarmAccessLabel("unavailable")).toBe("알림 설정 확인");

    expect(shouldPromptForExpoExactAlarmAccess("needs-permission")).toBe(true);
    expect(shouldPromptForExpoExactAlarmAccess("unavailable")).toBe(true);
    expect(shouldPromptForExpoExactAlarmAccess("checking")).toBe(false);
    expect(shouldPromptForExpoExactAlarmAccess("granted")).toBe(false);
    expect(shouldPromptForExpoExactAlarmAccess("not-required")).toBe(false);
  });

  it("builds high-priority content with managed reminder metadata", () => {
    expect(
      buildExpoReminderNotificationContent({
        body: "운동 종료 5분 전입니다.",
        notificationKey: "end-recovery-reminder:run",
        planId: "run",
        priority: "high",
        scheduledFor: new Date("2026-05-15T06:40:00.000Z"),
        title: "오늘 다 했니"
      })
    ).toEqual({
      body: "운동 종료 5분 전입니다.",
      data: {
        kind: "end-recovery-reminder",
        notificationKey: "end-recovery-reminder:run",
        planId: "run",
        scheduledFor: "2026-05-15T06:40:00.000Z"
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
