"use client";

import { useMemo } from "react";

import type { DatedPlanRecord, PlannerRecordMap } from "@/domains/plans/types";
import {
  getMonthlyCalendarStatus
} from "@/domains/plans/selectors/monthly-calendar-status";
import {
  getMonthlyMotivationSummary
} from "@/domains/plans/selectors/monthly-motivation-summary";
import {
  getRecoveryContributionSummary
} from "@/domains/plans/selectors/recovery-contribution-summary";

type UseMotivationScreenViewModelOptions = {
  monthKey: string;
  records: PlannerRecordMap;
};

export function useMotivationScreenViewModel({
  monthKey,
  records
}: UseMotivationScreenViewModelOptions) {
  return useMemo(() => {
    const summary = getMonthlyMotivationSummary(monthKey, records);
    const calendarDays = getMonthlyCalendarStatus(monthKey, records);
    const recoverySummary = getRecoveryContributionSummary(monthKey, records);

    return {
      calendarDays,
      monthKey,
      recoverySummary,
      summary
    };
  }, [monthKey, records]);
}

export function buildPlannerRecordMapForDate(
  date: string,
  plans: Omit<DatedPlanRecord, "date">[]
): PlannerRecordMap {
  return {
    [date]: plans.map((plan) => ({
      ...plan,
      date
    }))
  };
}
