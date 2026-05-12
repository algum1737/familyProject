import { useEffect, useState } from "react";

import {
  normalizeDailyPlans,
  normalizePlannerRecordMap
} from "../../../../src/domains/plans/service/plan-color";
import type { DailyPlan, PlannerRecordMap } from "../../../../src/domains/plans/types";
import type { ExpoPlansStore } from "../providers/plans/expo-async-plans-store";
import type { ExpoPlannerRecordsStore } from "../providers/plans/expo-async-planner-records-store";
import {
  resolveExpoBootstrapState,
  type ExpoBootstrapSource
} from "./expo-bootstrap-state";

type BootstrapStatus = "error" | "loading" | "ready";
type BootstrapSource = ExpoBootstrapSource;

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
        const loadedRecords = normalizePlannerRecordMap(await recordsStore.loadAll());

        if (!active) {
          return;
        }

        const loadedPlans = normalizeDailyPlans(await plansStore.load());

        if (!active) {
          return;
        }

        const resolved = resolveExpoBootstrapState({
          currentDate,
          loadedPlans,
          loadedRecords,
          now: new Date()
        });

        if (resolved.migratedCurrentDatePlans) {
          await recordsStore.saveForDate(
            currentDate,
            normalizeDailyPlans(resolved.migratedCurrentDatePlans)
          );

          if (!active) {
            return;
          }
        }

        setState({
          error: null,
          initialPlans: resolved.initialPlans,
          records: resolved.records,
          source: resolved.source,
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
