"use client";

import { useEffect, useMemo, useState } from "react";

import { localPlannerLabelSettingsStore } from "@/providers/labels/local-planner-label-settings";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import { localPlannerRecordsStore } from "@/providers/plans/local-planner-records";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import { localPlansStore } from "@/providers/plans/local-plans";
import type { PlansStore } from "@/providers/plans/plans-store";
import { createRecordBackedPlansStore } from "@/providers/plans/record-backed-plans";
import { systemTimeSource } from "@/providers/time/time-source";
import type { TimeSource } from "@/providers/time/time-source";
import { PlanEditorScreen } from "@/features/planner/app/screens/plan-editor-screen";
import { useConnectedPlanEditorScreen } from "@/features/planner/app/use-connected-plan-editor-screen";

type AppPlanEditorShellProps = {
  labelSettingsStore?: PlannerLabelSettingsStore;
  recordsStore?: PlannerRecordsStore;
  plansStore?: PlansStore;
  timeSource?: TimeSource;
};

export function AppPlanEditorShell({
  labelSettingsStore = localPlannerLabelSettingsStore,
  recordsStore = localPlannerRecordsStore,
  plansStore,
  timeSource = systemTimeSource
}: AppPlanEditorShellProps) {
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
  const { planEditorScreenProps } = useConnectedPlanEditorScreen({
    labelSettingsStore,
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

  return <PlanEditorScreen {...planEditorScreenProps} />;
}
