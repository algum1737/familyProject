"use client";

import { useEffect, useState } from "react";

import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";
import { CircularPlanner } from "@/ui/planner/circular-planner";

type PlannerShellProps = {
  plansStore?: PlansStore;
  timeSource?: TimeSource;
};

export function PlannerShell({
  plansStore = localPlansStore,
  timeSource = systemTimeSource
}: PlannerShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return <CircularPlanner plansStore={plansStore} timeSource={timeSource} />;
}
