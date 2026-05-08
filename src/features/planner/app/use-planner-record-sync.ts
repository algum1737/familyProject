"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyPlan, DatedPlanRecord, PlanDateKey } from "@/domains/plans/types";
import { getPlanDateKey } from "@/providers/plans/record-backed-shared";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { TimeSource } from "@/providers/time/time-source";

export function usePlannerRecordSync(options: {
  plans: DailyPlan[];
  recordsStore: PlannerRecordsStore;
  timeSource: TimeSource;
}) {
  const { plans, recordsStore, timeSource } = options;
  const [dateKey, setDateKey] = useState<PlanDateKey>(() => getPlanDateKey(timeSource.now()));

  useEffect(() => {
    const syncDateKey = () => {
      setDateKey(getPlanDateKey(timeSource.now()));
    };

    syncDateKey();
    const timer = window.setInterval(syncDateKey, 10_000);
    const unsubscribe = timeSource.subscribe?.(syncDateKey);

    return () => {
      window.clearInterval(timer);
      unsubscribe?.();
    };
  }, [timeSource]);

  const datedPlans = useMemo<DatedPlanRecord[]>(
    () =>
      plans.map((plan) => ({
        ...plan,
        date: dateKey
      })),
    [dateKey, plans]
  );

  useEffect(() => {
    recordsStore.saveForDate(dateKey, datedPlans);
  }, [dateKey, datedPlans, recordsStore]);

  return {
    dateKey
  };
}
