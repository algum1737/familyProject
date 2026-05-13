import { describe, expect, it } from "vitest";

import {
  buildExpoStartReminderRequests,
  getExpoEndRecoveryReminderNotificationKey,
  getExpoStartReminderNotificationKey,
  getExpoStartReminderSyncSignature
} from "../apps/expo/src/providers/reminders/expo-start-reminder-sync";

function createPlan(overrides: Partial<any> = {}) {
  return {
    color: "#767676",
    endMinute: 9 * 60,
    id: "plan-1",
    rescheduleCount: 0,
    startMinute: 8 * 60,
    status: "pending" as const,
    title: "아침 계획",
    ...overrides
  };
}

function createLocalTestDate(hours: number, minutes: number) {
  return new Date(2026, 4, 11, hours, minutes, 0, 0);
}

function createExpectedScheduledIso(hours: number, minutes: number) {
  return new Date(2026, 4, 11, hours, minutes, 0, 0).toISOString();
}

describe("expo start reminder sync", () => {
  it("builds future start and end reminder requests around pending plans", () => {
    const now = createLocalTestDate(7, 30);
    const requests = buildExpoStartReminderRequests(
      [
        createPlan({ id: "soon", startMinute: 8 * 60, endMinute: 9 * 60 }),
        createPlan({ id: "later", startMinute: 10 * 60, endMinute: 11 * 60 }),
        createPlan({ id: "done", startMinute: 11 * 60, endMinute: 12 * 60, status: "done" })
      ],
      now
    );

    expect(requests.map((request) => request.notificationKey)).toEqual([
      "start-reminder:soon",
      "end-recovery-reminder:soon",
      "start-reminder:later",
      "end-recovery-reminder:later"
    ]);
    expect(requests[0]?.scheduledFor.toISOString()).toBe(createExpectedScheduledIso(7, 55));
    expect(requests[1]?.scheduledFor.toISOString()).toBe(createExpectedScheduledIso(8, 55));
    expect(requests[2]?.scheduledFor.toISOString()).toBe(createExpectedScheduledIso(9, 55));
    expect(requests[3]?.scheduledFor.toISOString()).toBe(createExpectedScheduledIso(10, 55));
  });

  it("skips plans whose reminder time has already passed", () => {
    const now = createLocalTestDate(8, 2);
    const requests = buildExpoStartReminderRequests(
      [
        createPlan({ id: "too-late", startMinute: 8 * 60, endMinute: 8 * 60 + 4 }),
        createPlan({ id: "future", startMinute: 9 * 60 + 10, endMinute: 10 * 60 + 10 })
      ],
      now
    );

    expect(requests).toHaveLength(2);
    expect(requests[0]?.notificationKey).toBe("start-reminder:future");
    expect(requests[1]?.notificationKey).toBe("end-recovery-reminder:future");
  });

  it("creates a stable sync signature for the desired reminder schedule", () => {
    const now = createLocalTestDate(7, 30);
    const requests = buildExpoStartReminderRequests(
      [createPlan({ id: "soon", startMinute: 8 * 60 })],
      now
    );

    expect(getExpoStartReminderNotificationKey("soon")).toBe("start-reminder:soon");
    expect(getExpoEndRecoveryReminderNotificationKey("soon")).toBe(
      "end-recovery-reminder:soon"
    );
    expect(getExpoStartReminderSyncSignature(requests)).toBe(
      JSON.stringify([
        {
          kind: "start-reminder",
          key: "start-reminder:soon",
          scheduledFor: createExpectedScheduledIso(7, 55)
        },
        {
          kind: "end-recovery-reminder",
          key: "end-recovery-reminder:soon",
          scheduledFor: createExpectedScheduledIso(8, 55)
        }
      ])
    );
  });
});
