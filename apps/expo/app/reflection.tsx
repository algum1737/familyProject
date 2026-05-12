import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ExpoReflectionScreen } from "../src/screens/reflection-screen";
import { getSingleRouteParam } from "../src/app-shell/expo-router-contract";
import { useExpoRouterAppModel } from "../src/app-shell/expo-router-app-provider";
import {
  cancelReflectionRoute,
  initializeReflectionRoute,
  saveReflectionRoute
} from "../src/app-shell/expo-router-route-actions";

export default function ReflectionRoute() {
  const model = useExpoRouterAppModel();
  const router = useRouter();
  const params = useLocalSearchParams<{
    planId?: string | string[];
  }>();
  const initializedRef = useRef(false);
  const planId = getSingleRouteParam(params.planId);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    initializeReflectionRoute({ model, planId: planId ?? null, router });
  }, [model, planId, router]);

  return (
    <ExpoReflectionScreen
      activeRecoveryTitle={model.recoveryPlan?.title ?? null}
      note={model.reflectionNoteDraft}
      onCancel={() => cancelReflectionRoute(model, router)}
      onChangeNote={model.setReflectionNoteDraft}
      onSave={() => saveReflectionRoute(model, router)}
    />
  );
}
