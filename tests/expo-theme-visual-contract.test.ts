import { describe, expect, it } from "vitest";

import {
  EXPO_THEME_OPTIONS,
  getExpoThemePalette
} from "../apps/expo/src/app-shell/expo-theme-presets";

function pickVisualContract(themeKey: "mint" | "night-ink" | "sand") {
  const palette = getExpoThemePalette(themeKey);

  return {
    accent: palette.accent,
    accentSoft: palette.accentSoft,
    bodyStrong: palette.bodyStrong,
    bodyText: palette.bodyText,
    calendarGoodBackground: palette.calendarGoodBackground,
    calendarMidBackground: palette.calendarMidBackground,
    calendarWatchBackground: palette.calendarWatchBackground,
    heroBackground: palette.heroBackground,
    heroTitle: palette.heroTitle,
    inputBackground: palette.inputBackground,
    inputBorder: palette.inputBorder,
    routeBackground: palette.routeBackground,
    surfaceBackground: palette.surfaceBackground,
    textOnAccent: palette.textOnAccent,
    textPrimary: palette.textPrimary,
    warningBackground: palette.warningBackground,
    warningTitle: palette.warningTitle
  };
}

describe("expo theme visual contracts", () => {
  it("keeps the sand palette visual contract stable", () => {
    expect(pickVisualContract("sand")).toMatchInlineSnapshot(`
      {
        "accent": "#ea765a",
        "accentSoft": "#fff5ef",
        "bodyStrong": "#22252c",
        "bodyText": "#676b78",
        "calendarGoodBackground": "#e4f4e7",
        "calendarMidBackground": "#fff1dd",
        "calendarWatchBackground": "#fde7e4",
        "heroBackground": "#19202b",
        "heroTitle": "#ffffff",
        "inputBackground": "#ffffff",
        "inputBorder": "#e6ddd6",
        "routeBackground": "#f5f2eb",
        "surfaceBackground": "#fffdf9",
        "textOnAccent": "#ffffff",
        "textPrimary": "#20242d",
        "warningBackground": "#fff5ef",
        "warningTitle": "#8f4f43",
      }
    `);
  });

  it("keeps the mint palette visual contract stable", () => {
    expect(pickVisualContract("mint")).toMatchInlineSnapshot(`
      {
        "accent": "#2f9d8f",
        "accentSoft": "#eefaf7",
        "bodyStrong": "#1b2a28",
        "bodyText": "#5f726d",
        "calendarGoodBackground": "#dff5ed",
        "calendarMidBackground": "#f4f7d8",
        "calendarWatchBackground": "#fde9e2",
        "heroBackground": "#0f2b2a",
        "heroTitle": "#f4fffd",
        "inputBackground": "#ffffff",
        "inputBorder": "#d4ebe5",
        "routeBackground": "#eef7f4",
        "surfaceBackground": "#fcfffe",
        "textOnAccent": "#ffffff",
        "textPrimary": "#1b2a28",
        "warningBackground": "#edf9f4",
        "warningTitle": "#295d55",
      }
    `);
  });

  it("keeps the night ink palette visual contract stable", () => {
    expect(pickVisualContract("night-ink")).toMatchInlineSnapshot(`
      {
        "accent": "#7c91ff",
        "accentSoft": "#1b2337",
        "bodyStrong": "#eef2ff",
        "bodyText": "#a7b3d1",
        "calendarGoodBackground": "#173125",
        "calendarMidBackground": "#372f17",
        "calendarWatchBackground": "#371d22",
        "heroBackground": "#12182a",
        "heroTitle": "#f7f9ff",
        "inputBackground": "#161d2d",
        "inputBorder": "#2f3a56",
        "routeBackground": "#0d1320",
        "surfaceBackground": "#121827",
        "textOnAccent": "#09101f",
        "textPrimary": "#f3f6ff",
        "warningBackground": "#1b2337",
        "warningTitle": "#f0f4ff",
      }
    `);
  });

  it("keeps visual layers and semantic tones distinct inside every theme", () => {
    for (const option of EXPO_THEME_OPTIONS) {
      const palette = getExpoThemePalette(option.key);

      expect(palette.routeBackground).not.toBe(palette.surfaceBackground);
      expect(palette.surfaceBackground).not.toBe(palette.inputBackground);
      expect(palette.textPrimary).not.toBe(palette.routeBackground);
      expect(palette.calendarGoodBackground).not.toBe(palette.calendarMidBackground);
      expect(palette.calendarMidBackground).not.toBe(palette.calendarWatchBackground);
      expect(palette.warningBackground).not.toBe(palette.surfaceBackground);
    }
  });
});
