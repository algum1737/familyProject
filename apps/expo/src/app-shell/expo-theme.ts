import { StyleSheet } from "react-native";
import {
  buildExpoMotivationScreenThemeContract,
  buildExpoPlanEditorScreenThemeContract,
  buildExpoReflectionScreenThemeContract,
  buildExpoTodayScreenThemeContract
} from "./expo-theme-screen-snapshots";

export {
  EXPO_THEME_OPTIONS,
  EXPO_THEME_STORAGE_KEY,
  getExpoStatusBarStyle,
  getExpoThemePalette,
  type ExpoThemeKey
} from "./expo-theme-presets";
import {
  getExpoThemePalette,
  type ExpoThemeKey,
  type ExpoThemePalette
} from "./expo-theme-presets";

const themeCache = new Map<ExpoThemeKey, ReturnType<typeof StyleSheet.create>>();

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const safeColor =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const red = Number.parseInt(safeColor.slice(0, 2), 16);
  const green = Number.parseInt(safeColor.slice(2, 4), 16);
  const blue = Number.parseInt(safeColor.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${alpha})`;
}

function createExpoThemeStyles(palette: ExpoThemePalette) {
  return StyleSheet.create({
    appShellSafeArea: {
      backgroundColor: palette.appShellBackground,
      flex: 1
    },
    activeChip: {
      alignItems: "center",
      backgroundColor: palette.activeChipBackground,
      borderRadius: 999,
      justifyContent: "center",
      minHeight: 28,
      paddingHorizontal: 10
    },
    activeChipRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10
    },
    activeChipText: {
      color: palette.activeChipText,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.8
    },
    activeLabel: {
      color: palette.activeLabel,
      fontSize: 17,
      fontWeight: "700"
    },
    bodyStrong: {
      color: palette.bodyStrong,
      fontSize: 18,
      fontWeight: "800"
    },
    bodyText: {
      color: palette.bodyText,
      fontSize: 14,
      lineHeight: 22
    },
    bodyTextError: {
      color: palette.dangerText,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 22
    },
    content: {
      gap: 14,
      paddingBottom: 18
    },
    selectColorPreview: {
      borderRadius: 999,
      height: 18,
      width: 18
    },
    eyebrow: {
      color: palette.heroEyebrow,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1,
      textTransform: "uppercase"
    },
    heroCard: {
      backgroundColor: palette.heroBackground,
      borderRadius: 28,
      gap: 10,
      padding: 22
    },
    page: {
      backgroundColor: palette.pageBackground,
      flex: 1,
      gap: 16,
      paddingHorizontal: 16,
      paddingTop: 8
    },
    ...buildExpoTodayScreenThemeContract(palette),
    ...buildExpoPlanEditorScreenThemeContract(palette),
    ...buildExpoReflectionScreenThemeContract(palette),
    ...buildExpoMotivationScreenThemeContract(palette),
    todayHeaderEyebrow: {
      color: palette.mutedText,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.4
    },
    subtitle: {
      color: palette.heroSubtitle,
      fontSize: 14,
      lineHeight: 22
    },
    tertiaryButton: {
      alignItems: "center",
      borderRadius: 14,
      justifyContent: "center",
      minHeight: 40,
      paddingHorizontal: 12
    },
    tertiaryButtonDisabled: {
      opacity: 0.48
    },
    tertiaryButtonText: {
      color: palette.tertiaryText,
      fontSize: 13,
      fontWeight: "700"
    },
    tertiaryButtonTextDisabled: {
      color: palette.mutedText,
      fontSize: 13,
      fontWeight: "700"
    },
    tabBadge: {
      alignItems: "center",
      backgroundColor: withAlpha(palette.textPrimary, palette.isDark ? 0.18 : 0.08),
      borderRadius: 999,
      height: 28,
      justifyContent: "center",
      width: 28
    },
    tabBadgeActive: {
      backgroundColor: withAlpha("#ffffff", palette.isDark ? 0.16 : 0.2)
    },
    tabBadgeText: {
      color: palette.textPrimary,
      fontSize: 15,
      fontWeight: "800"
    },
    tabBadgeTextActive: {
      color: palette.textOnAccent
    },
    tabBar: {
      backgroundColor: palette.secondarySurface,
      borderRadius: 24,
      flexDirection: "row",
      gap: 8,
      padding: 10
    },
    tabButton: {
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 18,
      borderWidth: 1,
      flex: 1,
      gap: 6,
      justifyContent: "center",
      minHeight: 64,
      paddingHorizontal: 8,
      paddingVertical: 8
    },
    tabButtonActive: {
      backgroundColor: palette.accent,
      borderColor: palette.accent
    },
    tabLabel: {
      color: palette.textPrimary,
      fontSize: 12,
      fontWeight: "700"
    },
    tabLabelActive: {
      color: palette.textOnAccent
    },
    textarea: {
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 16,
      borderWidth: 1,
      color: palette.inputText,
      fontSize: 15,
      minHeight: 120,
      paddingHorizontal: 14,
      paddingVertical: 14,
      textAlignVertical: "top"
    },
    todayPlanItem: {
      backgroundColor: palette.inputBackground,
      borderColor: palette.surfaceBorder,
      borderRadius: 18,
      borderWidth: 1,
      gap: 8,
      padding: 14
    },
    todayPlanMetaRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8
    },
    todayPlanTitle: {
      color: palette.bodyStrong,
      fontSize: 16,
      fontWeight: "800"
    },
    title: {
      color: palette.heroTitle,
      fontSize: 24,
      fontWeight: "800"
    }
  });
}

export function getExpoTheme(themeKey: ExpoThemeKey) {
  const cached = themeCache.get(themeKey);

  if (cached) {
    return cached;
  }

  const styles = createExpoThemeStyles(getExpoThemePalette(themeKey));
  themeCache.set(themeKey, styles);
  return styles;
}

export const expoTheme = getExpoTheme("sand");
