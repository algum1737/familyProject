import { useEffect, useState } from "react";

import type { DailyPlan, PlannerRecordMap } from "../../../../src/domains/plans/types";
import {
  addPlanDate,
  getCarryoverPlansForDate,
  stripPlanDate
} from "../../../../src/providers/plans/record-backed-shared";
import type { ExpoPlansStore } from "../providers/plans/expo-async-plans-store";
import type { ExpoPlannerRecordsStore } from "../providers/plans/expo-async-planner-records-store";

type BootstrapStatus = "error" | "loading" | "ready";
type BootstrapSource = "empty" | "legacy-migrated" | "records-restored";

type ExpoAppBootstrapState = {
  error: string | null;
  initialPlans: DailyPlan[];
  records: PlannerRecordMap;
  source: BootstrapSource | null;
  status: BootstrapStatus;
};

const defaultBootstrapState: ExpoAppBootstrapState = {
  error: null,
  initialPlans: [],
  records: {},
  source: null,
  status: "loading"
};

export function useExpoAppBootstrap(options: {
  currentDate: string;
  plansStore: ExpoPlansStore;
  recordsStore: ExpoPlannerRecordsStore;
}) {
  const { currentDate, plansStore, recordsStore } = options;
  const [state, setState] = useState<ExpoAppBootstrapState>(defaultBootstrapState);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const loadedRecords = await recordsStore.loadAll();
        const carryoverPlans = getCarryoverPlansForDate(loadedRecords, new Date(), currentDate);

        if (!active) {
          return;
        }

        if (Object.keys(loadedRecords).length > 0 && loadedRecords[currentDate]) {
          setState({
            error: null,
            initialPlans: [...stripPlanDate(loadedRecords[currentDate]), ...carryoverPlans],
            records: loadedRecords,
            source: "records-restored",
            status: "ready"
          });
          return;
        }

        const loadedPlans = await plansStore.load();

        if (!active) {
          return;
        }

        if (loadedPlans.length > 0) {
          const datedPlans = addPlanDate(currentDate, loadedPlans);
          const migratedRecords = {
            ...loadedRecords,
            [currentDate]: datedPlans
          };

          await recordsStore.saveForDate(currentDate, datedPlans);

          if (!active) {
            return;
          }

          setState({
            error: null,
            initialPlans: loadedPlans,
            records: migratedRecords,
            source: Object.keys(loadedRecords).length > 0 ? "records-restored" : "legacy-migrated",
            status: "ready"
          });
          return;
        }

        setState({
          error: null,
          initialPlans: [],
          records: {},
          source: "empty",
          status: "ready"
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          error: error instanceof Error ? error.message : "앱 데이터를 복구하지 못했습니다.",
          initialPlans: [],
          records: {},
          source: null,
          status: "error"
        });
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [currentDate, plansStore, recordsStore]);

  return state;
}
