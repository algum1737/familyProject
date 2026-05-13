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

export function getSingleRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function isAppTabKey(value: string): value is AppTabKey {
  return value === "today" || value === "motivation";
}

export function isOverlayScreenKey(value: string): value is OverlayScreenKey {
  return value === "editor" || value === "reflection";
}
