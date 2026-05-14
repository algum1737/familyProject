import { describe, expect, it } from "vitest";

import { createExpoReminderSyncQueue } from "../apps/expo/src/providers/reminders/expo-reminder-sync-queue";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("expo reminder sync queue", () => {
  it("runs sync tasks serially and lets stale tasks skip side effects", async () => {
    const queue = createExpoReminderSyncQueue();
    const events: string[] = [];

    const first = queue.run(async (isLatest) => {
      events.push("first:start");
      await wait(5);

      if (!isLatest()) {
        events.push("first:stale");
        return;
      }

      events.push("first:effect");
    });
    const second = queue.run(async (isLatest) => {
      events.push("second:start");

      if (isLatest()) {
        events.push("second:effect");
      }
    });

    await Promise.all([first, second]);

    expect(events).toEqual([
      "first:start",
      "first:stale",
      "second:start",
      "second:effect"
    ]);
  });
});
