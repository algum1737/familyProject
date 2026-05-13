"use client";

import { useEffect, useMemo, useState } from "react";

import { MotivationScreen } from "@/features/planner/app/screens/motivation-screen";
import { useConnectedMotivationScreen } from "@/features/planner/app/use-connected-motivation-screen";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { createRecordBackedPlansStore } from "@/providers/plans/record-backed-plans";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";

type AppMotivationShellProps = {
  recordsStore?: PlannerRecordsStore;
  plansStore?: PlansStore;
  timeSource?: TimeSource;
};

export function AppMotivationShell({
  recordsStore = localPlannerRecordsStore,
  plansStore,
  timeSource = systemTimeSource
}: AppMotivationShellProps) {
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
  const { motivationScreenProps } = useConnectedMotivationScreen({
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

  return <MotivationScreen {...motivationScreenProps} />;
}
