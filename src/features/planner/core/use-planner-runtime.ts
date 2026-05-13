"use client";

import { useEffect, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { TimeSource } from "@/providers/time/time-source";
import { getMinutesSinceMidnight } from "@/shared/time/minutes";

const CURRENT_MINUTE_POLL_INTERVAL_MS = 10_000;

export function useCurrentMinute(timeSource: TimeSource) {
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    const syncMinute = () => {
      setMinute(getMinutesSinceMidnight(timeSource.now()));
    };

    syncMinute();

    const timer = window.setInterval(syncMinute, CURRENT_MINUTE_POLL_INTERVAL_MS);
    const unsubscribe = timeSource.subscribe?.(syncMinute);

    return () => {
      window.clearInterval(timer);
      unsubscribe?.();
    };
  }, [timeSource]);

  return minute;
}

export function usePlannerRuntimeSync(options: {
  currentMinute: number | null;
  plans: DailyPlan[];
  reminderProvider: ReminderProvider;
  syncPlanStatuses(currentMinute: number): void;
  timeSource: TimeSource;
}) {
  const { currentMinute, plans, reminderProvider, syncPlanStatuses, timeSource } = options;

  useEffect(() => {
    if (currentMinute === null) {
      return;
    }

    syncPlanStatuses(currentMinute);
  }, [currentMinute, syncPlanStatuses]);

  useEffect(() => {
    if (currentMinute === null) {
      return;
    }

    void reminderProvider.sync(plans, timeSource.now());
  }, [currentMinute, plans, reminderProvider, timeSource]);
}
