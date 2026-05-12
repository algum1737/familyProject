"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";
import {
  findActiveEndRecoveryReminder,
  getEndRecoveryInstanceKey
} from "@/features/planner/core/planner-reminder-rules";

export function useEndRecoveryBanner(plans: DailyPlan[], currentMinute: number | null) {
  const [dismissedRecoveryKey, setDismissedRecoveryKey] = useState<string | null>(null);

  const activeEndRecoveryReminder = useMemo(() => {
    return findActiveEndRecoveryReminder(plans, currentMinute);
  }, [currentMinute, plans]);

  useEffect(() => {
    if (!dismissedRecoveryKey) {
      return;
    }

    if (!activeEndRecoveryReminder) {
      setDismissedRecoveryKey(null);
      return;
    }

    const activeKey = getEndRecoveryInstanceKey(activeEndRecoveryReminder);

    if (dismissedRecoveryKey !== activeKey) {
      setDismissedRecoveryKey(null);
    }
  }, [activeEndRecoveryReminder, dismissedRecoveryKey]);

  const activeKey = activeEndRecoveryReminder
    ? getEndRecoveryInstanceKey(activeEndRecoveryReminder)
    : null;

  return {
    activeEndRecoveryReminder:
      activeEndRecoveryReminder && activeKey !== dismissedRecoveryKey
        ? activeEndRecoveryReminder
        : null,
    dismissEndRecoveryReminder(plan: DailyPlan) {
      setDismissedRecoveryKey(getEndRecoveryInstanceKey(plan));
    }
  };
}
