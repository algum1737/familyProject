import { describe, expect, it } from "vitest";

import {
  EXPO_ROUTE_PATHS,
  EXPO_ROUTE_SEGMENTS,
  getSingleRouteParam,
  isAppTabKey,
  isOverlayScreenKey
} from "../apps/expo/src/app-shell/expo-router-contract";

describe("expo router contract helpers", () => {
  it("keeps route path constants aligned with route segments", () => {
    expect(EXPO_ROUTE_PATHS.today).toBe(`/${EXPO_ROUTE_SEGMENTS.today}`);
    expect(EXPO_ROUTE_PATHS.editor).toBe(`/${EXPO_ROUTE_SEGMENTS.editor}`);
    expect(EXPO_ROUTE_PATHS.reflection).toBe(`/${EXPO_ROUTE_SEGMENTS.reflection}`);
    expect(EXPO_ROUTE_PATHS.motivation).toBe(`/${EXPO_ROUTE_SEGMENTS.motivation}`);
  });

  it("reads a single route param from scalar and array values", () => {
    expect(getSingleRouteParam("edit")).toBe("edit");
    expect(getSingleRouteParam(["reschedule", "edit"])).toBe("reschedule");
    expect(getSingleRouteParam(undefined)).toBeUndefined();
  });

  it("guards valid app tabs and overlay route keys", () => {
    expect(isAppTabKey("today")).toBe(true);
    expect(isAppTabKey("motivation")).toBe(true);
    expect(isAppTabKey("editor")).toBe(false);
    expect(isOverlayScreenKey("editor")).toBe(true);
    expect(isOverlayScreenKey("reflection")).toBe(true);
    expect(isOverlayScreenKey("today")).toBe(false);
  });
});
