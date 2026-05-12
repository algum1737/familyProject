export type ExpoThemeKey = "mint" | "night-ink" | "sand";

export type ExpoThemePalette = {
  accent: string;
  accentMuted: string;
  accentSoft: string;
  accentStrong: string;
  activeChipBackground: string;
  activeChipText: string;
  activeLabel: string;
  appShellBackground: string;
  bodyStrong: string;
  bodyText: string;
  calendarGoodBackground: string;
  calendarGoodText: string;
  calendarMidBackground: string;
  calendarMidText: string;
  calendarWatchBackground: string;
  calendarWatchText: string;
  dangerText: string;
  errorBackground: string;
  errorBorder: string;
  fieldLabel: string;
  heroBackground: string;
  heroEyebrow: string;
  heroSubtitle: string;
  heroTitle: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  isDark: boolean;
  menuBorder: string;
  mutedText: string;
  overlayBackdrop: string;
  pageBackground: string;
  placeholder: string;
  routeBackground: string;
  secondarySurface: string;
  shadowColor: string;
  surfaceBackground: string;
  surfaceBorder: string;
  surfaceMuted: string;
  tertiaryText: string;
  textOnAccent: string;
  textPrimary: string;
  textSecondary: string;
  themeMenuSwatchBorder: string;
  warningBackground: string;
  warningBorder: string;
  warningText: string;
  warningTitle: string;
};

export const EXPO_THEME_OPTIONS: Array<{ key: ExpoThemeKey; label: string }> = [
  { key: "sand", label: "Sand" },
  { key: "mint", label: "Mint" },
  { key: "night-ink", label: "Night Ink" }
];

export const EXPO_THEME_STORAGE_KEY = "expo-theme-key";

export const expoThemePalettes: Record<ExpoThemeKey, ExpoThemePalette> = {
  sand: {
    accent: "#ea765a",
    accentMuted: "#f7b7a7",
    accentSoft: "#fff5ef",
    accentStrong: "#f07c61",
    activeChipBackground: "#edf2fb",
    activeChipText: "#48617f",
    activeLabel: "#ffffff",
    appShellBackground: "#10131a",
    bodyStrong: "#22252c",
    bodyText: "#676b78",
    calendarGoodBackground: "#e4f4e7",
    calendarGoodText: "#2f7b46",
    calendarMidBackground: "#fff1dd",
    calendarMidText: "#a06b16",
    calendarWatchBackground: "#fde7e4",
    calendarWatchText: "#b14a3e",
    dangerText: "#bc4f43",
    errorBackground: "#fff1ee",
    errorBorder: "#f0c4bc",
    fieldLabel: "#6b6f7b",
    heroBackground: "#19202b",
    heroEyebrow: "#ffb39f",
    heroSubtitle: "rgba(255,255,255,0.72)",
    heroTitle: "#ffffff",
    inputBackground: "#ffffff",
    inputBorder: "#e6ddd6",
    inputText: "#22252c",
    isDark: false,
    menuBorder: "#e6ddd6",
    mutedText: "#8c877d",
    overlayBackdrop: "rgba(22,24,31,0.26)",
    pageBackground: "#10131a",
    placeholder: "#a0a5b2",
    routeBackground: "#f5f2eb",
    secondarySurface: "#f8f5ef",
    shadowColor: "#8d7c68",
    surfaceBackground: "#fffdf9",
    surfaceBorder: "#ece4dd",
    surfaceMuted: "rgba(255,255,255,0.76)",
    tertiaryText: "#48617f",
    textOnAccent: "#ffffff",
    textPrimary: "#20242d",
    textSecondary: "#747884",
    themeMenuSwatchBorder: "rgba(34,37,44,0.08)",
    warningBackground: "#fff5ef",
    warningBorder: "#f0d4c4",
    warningText: "#8a5a4f",
    warningTitle: "#8f4f43"
  },
  mint: {
    accent: "#2f9d8f",
    accentMuted: "#9dd9cf",
    accentSoft: "#eefaf7",
    accentStrong: "#2aa795",
    activeChipBackground: "#e1f5f0",
    activeChipText: "#31766d",
    activeLabel: "#ffffff",
    appShellBackground: "#0c1b1b",
    bodyStrong: "#1b2a28",
    bodyText: "#5f726d",
    calendarGoodBackground: "#dff5ed",
    calendarGoodText: "#247358",
    calendarMidBackground: "#f4f7d8",
    calendarMidText: "#7a7e22",
    calendarWatchBackground: "#fde9e2",
    calendarWatchText: "#b35741",
    dangerText: "#b04c40",
    errorBackground: "#fff1ed",
    errorBorder: "#efc4b6",
    fieldLabel: "#58706c",
    heroBackground: "#0f2b2a",
    heroEyebrow: "#8be3d4",
    heroSubtitle: "rgba(238,249,247,0.76)",
    heroTitle: "#f4fffd",
    inputBackground: "#ffffff",
    inputBorder: "#d4ebe5",
    inputText: "#1b2a28",
    isDark: false,
    menuBorder: "#d7ece6",
    mutedText: "#5f7b73",
    overlayBackdrop: "rgba(8,25,24,0.24)",
    pageBackground: "#0c1b1b",
    placeholder: "#97a9a5",
    routeBackground: "#eef7f4",
    secondarySurface: "#f6fbfa",
    shadowColor: "#6ca399",
    surfaceBackground: "#fcfffe",
    surfaceBorder: "#dcefe9",
    surfaceMuted: "rgba(255,255,255,0.82)",
    tertiaryText: "#31766d",
    textOnAccent: "#ffffff",
    textPrimary: "#1b2a28",
    textSecondary: "#60706d",
    themeMenuSwatchBorder: "rgba(27,42,40,0.08)",
    warningBackground: "#edf9f4",
    warningBorder: "#cde9df",
    warningText: "#467268",
    warningTitle: "#295d55"
  },
  "night-ink": {
    accent: "#7c91ff",
    accentMuted: "#4d5fc4",
    accentSoft: "#1b2337",
    accentStrong: "#8ea0ff",
    activeChipBackground: "#222c41",
    activeChipText: "#dbe3ff",
    activeLabel: "#f5f7ff",
    appShellBackground: "#060911",
    bodyStrong: "#eef2ff",
    bodyText: "#a7b3d1",
    calendarGoodBackground: "#173125",
    calendarGoodText: "#91e2b1",
    calendarMidBackground: "#372f17",
    calendarMidText: "#f2d780",
    calendarWatchBackground: "#371d22",
    calendarWatchText: "#ff9ca4",
    dangerText: "#ffb1b8",
    errorBackground: "#26141a",
    errorBorder: "#55313a",
    fieldLabel: "#9ba6c6",
    heroBackground: "#12182a",
    heroEyebrow: "#9db3ff",
    heroSubtitle: "rgba(227,233,255,0.72)",
    heroTitle: "#f7f9ff",
    inputBackground: "#161d2d",
    inputBorder: "#2f3a56",
    inputText: "#f2f5ff",
    isDark: true,
    menuBorder: "#2e3957",
    mutedText: "#8e9ab7",
    overlayBackdrop: "rgba(3,6,14,0.56)",
    pageBackground: "#060911",
    placeholder: "#7f8aa8",
    routeBackground: "#0d1320",
    secondarySurface: "#141c2d",
    shadowColor: "#02050e",
    surfaceBackground: "#121827",
    surfaceBorder: "#27324d",
    surfaceMuted: "rgba(255,255,255,0.08)",
    tertiaryText: "#b7c4ff",
    textOnAccent: "#09101f",
    textPrimary: "#f3f6ff",
    textSecondary: "#a7b3d1",
    themeMenuSwatchBorder: "rgba(255,255,255,0.12)",
    warningBackground: "#1b2337",
    warningBorder: "#33415e",
    warningText: "#c3ceee",
    warningTitle: "#f0f4ff"
  }
};

export function getExpoThemePalette(themeKey: ExpoThemeKey) {
  return expoThemePalettes[themeKey];
}

export function getExpoStatusBarStyle(themeKey: ExpoThemeKey): "dark-content" | "light-content" {
  return expoThemePalettes[themeKey].isDark ? "light-content" : "dark-content";
}
