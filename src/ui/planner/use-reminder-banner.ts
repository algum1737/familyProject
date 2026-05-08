"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";
import {
  findActiveStartReminder,
  getReminderInstanceKey
} from "@/features/planner/core/planner-reminder-rules";

export function useReminderBanner(plans: DailyPlan[], currentMinute: number | null) {
  const [dismissedReminderKey, setDismissedReminderKey] = useState<string | null>(null);

  const activeReminder = useMemo(() => {
    return findActiveStartReminder(plans, currentMinute);
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
