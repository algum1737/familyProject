"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";

export const REMINDER_LEAD_MINUTES = 5;
export const REMINDER_LINGER_MINUTES = 10;

function getReminderInstanceKey(plan: DailyPlan) {
  return `${plan.id}:${plan.startMinute}`;
}

export function useReminderBanner(plans: DailyPlan[], currentMinute: number | null) {
  const [dismissedReminderKey, setDismissedReminderKey] = useState<string | null>(null);

  const activeReminder = useMemo(() => {
    if (currentMinute === null) {
      return null;
    }

    return (
      plans.find(
        (plan) =>
          plan.status === "pending" &&
          currentMinute >= plan.startMinute - REMINDER_LEAD_MINUTES &&
          currentMinute <= plan.startMinute + REMINDER_LINGER_MINUTES
      ) ?? null
    );
  }, [currentMinute, plans]);

  useEffect(() => {
    if (!dismissedReminderKey) {
      return;
    }

    if (!activeReminder) {
      setDismissedReminderKey(null);
      return;
    }

    const activeReminderKey = getReminderInstanceKey(activeReminder);

    if (dismissedReminderKey !== activeReminderKey) {
      setDismissedReminderKey(null);
    }
  }, [activeReminder, dismissedReminderKey, plans]);

  const activeReminderKey = activeReminder ? getReminderInstanceKey(activeReminder) : null;

  return {
    activeReminder:
      activeReminder && activeReminderKey !== dismissedReminderKey ? activeReminder : null,
    dismissReminder(plan: DailyPlan) {
      setDismissedReminderKey(getReminderInstanceKey(plan));
    }
  };
}
