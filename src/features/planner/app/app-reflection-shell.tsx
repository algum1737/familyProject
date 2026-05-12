"use client";

import { useEffect, useMemo, useState } from "react";

import { ReflectionScreen } from "@/features/planner/app/screens/reflection-screen";
import { useConnectedReflectionScreen } from "@/features/planner/app/use-connected-reflection-screen";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { createRecordBackedPlansStore } from "@/providers/plans/record-backed-plans";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";

type AppReflectionShellProps = {
  recordsStore?: PlannerRecordsStore;
  plansStore?: PlansStore;
  timeSource?: TimeSource;
};

export function AppReflectionShell({
  recordsStore = localPlannerRecordsStore,
  plansStore,
  timeSource = systemTimeSource
}: AppReflectionShellProps) {
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
  const { reflectionScreenProps } = useConnectedReflectionScreen({
    recordsStore,
    plansStore: resolvedPlansStore,
    timeSource
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return <ReflectionScreen {...reflectionScreenProps} />;
}
