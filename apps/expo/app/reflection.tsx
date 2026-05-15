import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ExpoReflectionScreen } from "../src/screens/reflection-screen";
import {
  EXPO_ROUTE_PATHS,
  getReflectionRouteParams
} from "../src/app-shell/expo-router-contract";
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
  const routeParams = getReflectionRouteParams(params);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    if (!routeParams) {
      router.replace(EXPO_ROUTE_PATHS.today);
      return;
    }

    initializeReflectionRoute({ model, planId: routeParams.planId, router });
  }, [model, routeParams, router]);

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
