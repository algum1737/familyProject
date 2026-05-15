import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getRescheduleFailureGuidance } from "../../../src/features/planner/core/reschedule-failure-guidance";
import { ExpoPlanEditorScreen } from "../src/screens/plan-editor-screen";
import {
  EXPO_ROUTE_PATHS,
  getEditorRouteParams
} from "../src/app-shell/expo-router-contract";
import { useExpoRouterAppModel } from "../src/app-shell/expo-router-app-provider";
import {
  cancelEditorRoute,
  initializeEditorRoute,
  submitEditorRoute
} from "../src/app-shell/expo-router-route-actions";

export default function EditorRoute() {
  const model = useExpoRouterAppModel();
  const router = useRouter();
  const rescheduleFailureGuidance = getRescheduleFailureGuidance(model.error);
  const params = useLocalSearchParams<{
    mode?: string | string[];
    planId?: string | string[];
  }>();
  const initializedRef = useRef(false);
  const routeParams = getEditorRouteParams(params);
  const mode = routeParams?.mode ?? "create";

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    if (!routeParams) {
      router.replace(EXPO_ROUTE_PATHS.today);
      return;
    }

    initializeEditorRoute({
      mode: routeParams.mode,
      model,
      planId: routeParams.planId ?? null,
      router
    });
  }, [model, routeParams, router]);

  return (
    <ExpoPlanEditorScreen
      error={model.error}
      fieldErrors={model.fieldErrors}
      focusField={model.focusField}
      focusRequest={model.focusRequest}
      form={model.form}
      onCancel={() => cancelEditorRoute(model, router, mode)}
      onSubmit={() => submitEditorRoute(model, router)}
      onUpdateForm={model.updateForm}
      planTitleMaxLength={model.planTitleMaxLength}
      plannedCount={model.todayPlans.length}
      rescheduleFailureGuidance={rescheduleFailureGuidance}
      timeDisplayFormat={model.timeDisplayFormat}
      title={mode === "reschedule" ? "다시 지정" : "계획 편집"}
    />
  );
}
