import { describe, expect, it } from "vitest";

import {
  EXPO_THEME_OPTIONS,
  getExpoThemePalette
} from "../apps/expo/src/app-shell/expo-theme-presets";
import { getExpoStatusBarStyle } from "../apps/expo/src/app-shell/expo-theme-presets";

describe("expo theme presets", () => {
  it("exposes the three intended theme presets", () => {
    expect(EXPO_THEME_OPTIONS).toEqual([
      { key: "sand", label: "Sand" },
      { key: "mint", label: "Mint" },
      { key: "night-ink", label: "Night Ink" }
    ]);
  });

  it("maps theme palette contrast to status bar styles", () => {
    expect(getExpoStatusBarStyle("sand")).toBe("dark-content");
    expect(getExpoStatusBarStyle("mint")).toBe("dark-content");
    expect(getExpoStatusBarStyle("night-ink")).toBe("light-content");
  });

  it("exposes distinct accent colors for each preset", () => {
    expect(getExpoThemePalette("sand").accent).toBe("#ea765a");
    expect(getExpoThemePalette("mint").accent).toBe("#2f9d8f");
    expect(getExpoThemePalette("night-ink").accent).toBe("#7c91ff");
  });
});
