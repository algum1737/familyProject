import { describe, expect, it } from "vitest";

import {
  EXPO_ROUTE_PATHS,
  EXPO_ROUTE_SEGMENTS,
  getEditorRouteParams,
  getReflectionRouteParams,
  getSingleRouteParam,
  isEditorRouteMode,
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

  it("parses editor route params at the adapter boundary", () => {
    expect(getEditorRouteParams({})).toEqual({ mode: "create" });
    expect(getEditorRouteParams({ mode: "create", planId: "ignored" })).toEqual({
      mode: "create"
    });
    expect(getEditorRouteParams({ mode: "edit", planId: "plan-1" })).toEqual({
      mode: "edit",
      planId: "plan-1"
    });
    expect(
      getEditorRouteParams({ mode: ["reschedule", "edit"], planId: ["plan-2"] })
    ).toEqual({
      mode: "reschedule",
      planId: "plan-2"
    });
    expect(getEditorRouteParams({ mode: "edit" })).toBeNull();
    expect(getEditorRouteParams({ mode: "reschedule" })).toBeNull();
    expect(getEditorRouteParams({ mode: "unknown", planId: "plan-1" })).toBeNull();
  });

  it("parses reflection route params at the adapter boundary", () => {
    expect(getReflectionRouteParams({ planId: "plan-1" })).toEqual({
      planId: "plan-1"
    });
    expect(getReflectionRouteParams({ planId: ["plan-2", "plan-1"] })).toEqual({
      planId: "plan-2"
    });
    expect(getReflectionRouteParams({})).toBeNull();
  });

  it("guards valid app tabs and overlay route keys", () => {
    expect(isEditorRouteMode("create")).toBe(true);
    expect(isEditorRouteMode("edit")).toBe(true);
    expect(isEditorRouteMode("reschedule")).toBe(true);
    expect(isEditorRouteMode("today")).toBe(false);
    expect(isAppTabKey("today")).toBe(true);
    expect(isAppTabKey("motivation")).toBe(true);
    expect(isAppTabKey("editor")).toBe(false);
    expect(isOverlayScreenKey("editor")).toBe(true);
    expect(isOverlayScreenKey("reflection")).toBe(true);
    expect(isOverlayScreenKey("today")).toBe(false);
  });
});
