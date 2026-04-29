"use client";

import { useEffect, useState } from "react";

import { localPlannerLabelSettingsStore } from "@/providers/labels/local-planner-label-settings";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { noopReminderProvider } from "@/providers/reminders/noop-reminder-provider";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";
import { CircularPlanner } from "@/ui/planner/circular-planner";

type PlannerShellProps = {
  labelSettingsStore?: PlannerLabelSettingsStore;
  plansStore?: PlansStore;
  reminderProvider?: ReminderProvider;
  timeSource?: TimeSource;
};

export function PlannerShell({
  labelSettingsStore = localPlannerLabelSettingsStore,
  plansStore = localPlansStore,
  reminderProvider = noopReminderProvider,
  timeSource = systemTimeSource
}: PlannerShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return (
    <CircularPlanner
      labelSettingsStore={labelSettingsStore}
      plansStore={plansStore}
      reminderProvider={reminderProvider}
      timeSource={timeSource}
    />
  );
}
