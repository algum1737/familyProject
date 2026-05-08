import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ExpoPlanEditorScreen } from "../src/screens/plan-editor-screen";
import {
  EXPO_ROUTE_PATHS,
  getSingleRouteParam,
  type EditorRouteMode
} from "../src/app-shell/expo-router-contract";
import { useExpoRouterAppModel } from "../src/app-shell/expo-router-app-provider";

export default function EditorRoute() {
  const model = useExpoRouterAppModel();
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string | string[];
    planId?: string | string[];
  }>();
  const initializedRef = useRef(false);
  const mode = (getSingleRouteParam(params.mode) ?? "create") as EditorRouteMode;
  const planId = getSingleRouteParam(params.planId);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    if (mode === "create") {
      model.startCreatePlan();
      return;
    }

    if (!planId) {
      router.replace(EXPO_ROUTE_PATHS.today);
      return;
    }

    const plan = model.todayPlans.find((item) => item.id === planId);

    if (!plan) {
      router.replace(EXPO_ROUTE_PATHS.today);
      return;
    }

    if (mode === "edit") {
      model.startEditingPlan(plan);
      return;
    }

    const result = model.startRescheduling(plan);

    if (result !== "started") {
      router.replace(EXPO_ROUTE_PATHS.today);
    }
  }, [mode, model, planId, router]);

  return (
    <ExpoPlanEditorScreen
      error={model.error}
      fieldErrors={model.fieldErrors}
      focusField={model.focusField}
      focusRequest={model.focusRequest}
      form={model.form}
      onCancel={() => {
        if (mode === "reschedule") {
          model.cancelRecovery();
        } else {
          model.cancelEditing();
        }
        router.replace(EXPO_ROUTE_PATHS.today);
      }}
      onSubmit={() => {
        if (model.submitPlan()) {
          router.replace(EXPO_ROUTE_PATHS.today);
        }
      }}
      onUpdateForm={model.updateForm}
      planTitleMaxLength={model.planTitleMaxLength}
      plannedCount={model.todayPlans.length}
      timeDisplayFormat={model.timeDisplayFormat}
      title={mode === "reschedule" ? "다시 지정" : "계획 편집"}
    />
  );
}
