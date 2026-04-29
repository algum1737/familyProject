"use client";

import { useEffect, useState } from "react";

import {
  defaultPlannerLabelSettings,
  type PlannerLabelSettings,
  type PlannerLabelSettingsStore,
  sanitizePlannerLabelSettings
} from "@/providers/labels/planner-label-settings";

export function usePlannerLabelSettings(labelSettingsStore: PlannerLabelSettingsStore) {
  const [labelSettings, setLabelSettings] = useState<PlannerLabelSettings>(
    defaultPlannerLabelSettings
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedSettings = labelSettingsStore.load();

    if (storedSettings) {
      setLabelSettings(storedSettings);
    }

    setIsHydrated(true);
  }, [labelSettingsStore]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    labelSettingsStore.save(labelSettings);
  }, [isHydrated, labelSettings, labelSettingsStore]);

  function saveLabelSettings(nextSettings: PlannerLabelSettings) {
    setLabelSettings(sanitizePlannerLabelSettings(nextSettings));
  }

  function resetLabelSettings() {
    setLabelSettings(defaultPlannerLabelSettings);
  }

  return {
    labelSettings,
    resetLabelSettings,
    saveLabelSettings
  };
}
