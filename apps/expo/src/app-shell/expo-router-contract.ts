import type { AppTabKey, OverlayScreenKey } from "./flow-tabs";

export const EXPO_ROUTE_SEGMENTS = {
  editor: "editor",
  motivation: "motivation",
  reflection: "reflection",
  tabsGroup: "(tabs)",
  today: "today"
} as const;

export const EXPO_ROUTE_PATHS = {
  editor: `/${EXPO_ROUTE_SEGMENTS.editor}`,
  motivation: `/${EXPO_ROUTE_SEGMENTS.motivation}`,
  reflection: `/${EXPO_ROUTE_SEGMENTS.reflection}`,
  today: `/${EXPO_ROUTE_SEGMENTS.today}`
} as const;

export type EditorRouteMode = "create" | "edit" | "reschedule";

export type EditorRouteParams = {
  mode: EditorRouteMode;
  planId?: string;
};

export type ReflectionRouteParams = {
  planId: string;
};

type RawRouteParam = string | string[] | undefined;

export function getSingleRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function isEditorRouteMode(value: string): value is EditorRouteMode {
  return value === "create" || value === "edit" || value === "reschedule";
}

export function getEditorRouteParams(params: {
  mode?: RawRouteParam;
  planId?: RawRouteParam;
}): EditorRouteParams | null {
  const mode = getSingleRouteParam(params.mode) ?? "create";
  const planId = getSingleRouteParam(params.planId);

  if (!isEditorRouteMode(mode)) {
    return null;
  }

  if (mode === "create") {
    return { mode };
  }

  if (!planId) {
    return null;
  }

  return { mode, planId };
}

export function getReflectionRouteParams(params: {
  planId?: RawRouteParam;
}): ReflectionRouteParams | null {
  const planId = getSingleRouteParam(params.planId);

  if (!planId) {
    return null;
  }

  return { planId };
}

export function isAppTabKey(value: string): value is AppTabKey {
  return value === "today" || value === "motivation";
}

export function isOverlayScreenKey(value: string): value is OverlayScreenKey {
  return value === "editor" || value === "reflection";
}
