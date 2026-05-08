"use client";

import { useEffect, useMemo, useState } from "react";

import { ConnectedTodayScreen } from "@/features/planner/app/screens/today-screen";
import { localPlannerLabelSettingsStore } from "@/providers/labels/local-planner-label-settings";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { createRecordBackedPlansStore } from "@/providers/plans/record-backed-plans";
import { noopReminderProvider } from "@/providers/reminders/noop-reminder-provider";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";

type AppTodayShellProps = {
  labelSettingsStore?: PlannerLabelSettingsStore;
  recordsStore?: PlannerRecordsStore;
  plansStore?: PlansStore;
  reminderProvider?: ReminderProvider;
  timeSource?: TimeSource;
};

export function AppTodayShell({
  labelSettingsStore = localPlannerLabelSettingsStore,
  recordsStore = localPlannerRecordsStore,
  plansStore,
  reminderProvider = noopReminderProvider,
  timeSource = systemTimeSource
}: AppTodayShellProps) {
  const [mounted, setMounted] = useState(false);
  const resolvedPlansStore = useMemo(
    () =>
      plansStore ??
      createRecordBackedPlansStore({
        fallbackStore: localPlansStore,
        recordsStore,
        timeSource
      }),
    [plansStore, recordsStore, timeSource]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return (
    <ConnectedTodayScreen
      labelSettingsStore={labelSettingsStore}
      recordsStore={recordsStore}
      plansStore={resolvedPlansStore}
      reminderProvider={reminderProvider}
      timeSource={timeSource}
    />
  );
}
