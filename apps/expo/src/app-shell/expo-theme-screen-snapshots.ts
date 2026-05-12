import type { ExpoThemeKey, ExpoThemePalette } from "./expo-theme-presets";
import { getExpoThemePalette } from "./expo-theme-presets";

function mergeStyles<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  base: T,
  override: U
) {
  return {
    ...base,
    ...override
  };
}

export function buildExpoTodayScreenThemeContract(palette: ExpoThemePalette) {
  return {
    errorBanner: {
      backgroundColor: palette.errorBackground,
      borderColor: palette.errorBorder,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    routeSafeArea: {
      backgroundColor: palette.routeBackground,
      flex: 1
    },
    routeScroll: {
      flex: 1
    },
    routeScrollContent: {
      gap: 16,
      paddingBottom: 140,
      paddingHorizontal: 18,
      paddingTop: 20
    },
    settingsButton: {
      alignItems: "center",
      backgroundColor: palette.surfaceBackground,
      borderColor: palette.menuBorder,
      borderRadius: 16,
      borderWidth: 1,
      height: 42,
      justifyContent: "center",
      width: 42
    },
    settingsButtonText: {
      color: palette.bodyText,
      fontSize: 18,
      fontWeight: "800"
    },
    settingsMenu: {
      backgroundColor: palette.surfaceBackground,
      borderColor: palette.menuBorder,
      borderRadius: 16,
      borderWidth: 1,
      elevation: 8,
      position: "absolute",
      right: 0,
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      top: 48,
      width: 180,
      zIndex: 20
    },
    settingsMenuItem: {
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    settingsMenuItemActive: {
      backgroundColor: palette.accentSoft
    },
    settingsMenuSection: {
      borderTopColor: palette.menuBorder,
      borderTopWidth: 1,
      gap: 2,
      paddingBottom: 6,
      paddingTop: 8
    },
    settingsMenuSectionTitle: {
      color: palette.mutedText,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.6,
      paddingHorizontal: 14,
      paddingVertical: 6,
      textTransform: "uppercase"
    },
    settingsMenuText: {
      color: palette.bodyStrong,
      fontSize: 14,
      fontWeight: "700"
    },
    settingsMenuThemeRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10
    },
    settingsMenuThemeSwatch: {
      borderColor: palette.themeMenuSwatchBorder,
      borderRadius: 999,
      borderWidth: 1,
      height: 12,
      width: 12
    },
    settingsStack: {
      position: "relative",
      zIndex: 20
    },
    statRow: {
      flexDirection: "row",
      gap: 10
    },
    statTile: {
      backgroundColor: palette.accentSoft,
      borderRadius: 18,
      flex: 1,
      gap: 6,
      padding: 14
    },
    statTileStrong: {
      color: palette.bodyStrong,
      fontSize: 18,
      fontWeight: "800"
    },
    statusPill: {
      alignItems: "center",
      borderRadius: 999,
      justifyContent: "center",
      minHeight: 28,
      paddingHorizontal: 10
    },
    statusPillCurrent: {
      backgroundColor: palette.accentSoft
    },
    statusPillDone: {
      backgroundColor: palette.calendarGoodBackground
    },
    statusPillMissed: {
      backgroundColor: palette.calendarWatchBackground
    },
    statusPillPending: {
      backgroundColor: palette.activeChipBackground
    },
    statusPillText: {
      fontSize: 12,
      fontWeight: "800"
    },
    statusPillTextCurrent: {
      color: palette.warningTitle
    },
    statusPillTextDone: {
      color: palette.calendarGoodText
    },
    statusPillTextMissed: {
      color: palette.calendarWatchText
    },
    statusPillTextPending: {
      color: palette.activeChipText
    },
    todayHeader: {
      gap: 10,
      paddingHorizontal: 6
    },
    todayHeaderSubtitle: {
      color: palette.textSecondary,
      fontSize: 16,
      lineHeight: 24
    },
    todayHeaderTitle: {
      color: palette.textPrimary,
      fontSize: 34,
      fontWeight: "900",
      letterSpacing: -0.8
    },
    todayHeaderTopRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    todayPlanMetaText: {
      color: palette.mutedText,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 20
    },
    todayPlannerCard: {
      backgroundColor: palette.surfaceBackground,
      borderRadius: 28,
      gap: 14,
      padding: 18,
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.08,
      shadowRadius: 24
    },
    todaySectionBody: {
      color: palette.bodyText,
      fontSize: 16,
      lineHeight: 24
    },
    todaySectionHeadline: {
      color: palette.textPrimary,
      fontSize: 22,
      fontWeight: "900",
      letterSpacing: -0.5
    },
    todaySectionHeader: {
      gap: 6
    },
    todaySectionTitle: {
      color: palette.textPrimary,
      fontSize: 14,
      fontWeight: "800",
      letterSpacing: 0.4,
      textTransform: "uppercase"
    }
  } as const;
}

export function buildExpoPlanEditorScreenThemeContract(palette: ExpoThemePalette) {
  return {
    warningCard: {
      backgroundColor: palette.warningBackground,
      borderColor: palette.warningBorder,
      borderRadius: 16,
      borderWidth: 1,
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    warningCardText: {
      color: palette.warningText,
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 20
    },
    warningCardTitle: {
      color: palette.warningTitle,
      fontSize: 14,
      fontWeight: "800",
      lineHeight: 20
    },
    selectOptionRow: {
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderRadius: 14,
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 10
    },
    selectOptionRowActive: {
      backgroundColor: palette.accentSoft
    },
    selectOptionText: {
      color: palette.bodyText,
      fontSize: 13,
      fontWeight: "700"
    },
    selectOptionTextActive: {
      color: palette.bodyStrong
    },
    selectOptionsPanel: {
      backgroundColor: palette.surfaceBackground,
      borderColor: palette.menuBorder,
      borderRadius: 16,
      borderWidth: 1,
      elevation: 8,
      gap: 8,
      left: 0,
      maxHeight: 220,
      padding: 8,
      position: "absolute",
      right: 0,
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      top: 56,
      zIndex: 20
    },
    selectOptionsSpacer: {
      height: 236
    },
    selectStack: {
      gap: 8,
      position: "relative",
      zIndex: 20
    },
    selectTrigger: {
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 48,
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    selectTriggerChevron: {
      color: palette.bodyText,
      fontSize: 14,
      fontWeight: "800"
    },
    selectTriggerText: {
      color: palette.inputText,
      fontSize: 14,
      fontWeight: "700"
    },
    selectTriggerValue: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10
    },
    formActionRow: {
      flexDirection: "row",
      gap: 10
    },
    input: {
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 16,
      borderWidth: 1,
      color: palette.inputText,
      fontSize: 15,
      minHeight: 48,
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    inputError: {
      borderColor: palette.warningTitle,
      borderWidth: 1.5
    },
    inputLabel: {
      color: palette.fieldLabel,
      fontSize: 13,
      fontWeight: "700"
    },
    inputStack: {
      gap: 8
    },
    fieldErrorText: {
      color: palette.dangerText,
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 20
    },
    timePreviewCard: {
      backgroundColor: palette.accentSoft,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    timePreviewText: {
      color: palette.warningText,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 20
    },
    sectionTitle: {
      color: palette.bodyStrong,
      fontSize: 15,
      fontWeight: "800"
    },
    secondaryButton: {
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 16,
      borderWidth: 1,
      flex: 1,
      justifyContent: "center",
      minHeight: 46,
      paddingHorizontal: 14
    },
    secondaryButtonText: {
      color: palette.bodyText,
      fontSize: 14,
      fontWeight: "700"
    },
    primaryButtonDisabled: {
      alignItems: "center",
      backgroundColor: palette.accentMuted,
      borderRadius: 16,
      flex: 1,
      justifyContent: "center",
      minHeight: 46,
      opacity: 0.65,
      paddingHorizontal: 14
    },
    surfaceCard: {
      backgroundColor: palette.surfaceBackground,
      borderRadius: 24,
      gap: 10,
      padding: 18
    },
    bottomSheetOverlay: {
      backgroundColor: palette.overlayBackdrop,
      flex: 1,
      justifyContent: "flex-end"
    },
    bottomSheetBackdrop: {
      flex: 1
    },
    bottomSheetCard: {
      backgroundColor: palette.surfaceBackground,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      gap: 14,
      maxHeight: "72%",
      paddingBottom: 28,
      paddingHorizontal: 18,
      paddingTop: 18
    },
    bottomSheetHeader: {
      gap: 6
    },
    timePickerColumns: {
      flexDirection: "row",
      gap: 10
    },
    timePickerColumn: {
      backgroundColor: palette.secondarySurface,
      borderRadius: 18,
      flex: 1,
      maxHeight: 280
    },
    timePickerColumnContent: {
      gap: 8,
      padding: 10
    },
    timePickerOption: {
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderRadius: 14,
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 12
    },
    timePickerOptionActive: {
      backgroundColor: palette.accentStrong
    },
    timePickerOptionText: {
      color: palette.bodyText,
      fontSize: 15,
      fontWeight: "700"
    },
    timePickerOptionTextActive: {
      color: palette.textOnAccent,
      fontSize: 15,
      fontWeight: "700"
    },
    primaryButton: {
      alignItems: "center",
      backgroundColor: palette.accent,
      borderRadius: 16,
      justifyContent: "center",
      minHeight: 46,
      paddingHorizontal: 14
    },
    primaryButtonText: {
      color: palette.textOnAccent,
      fontSize: 14,
      fontWeight: "800"
    }
  } as const;
}

export function buildExpoReflectionScreenThemeContract(palette: ExpoThemePalette) {
  return {
    routeSectionCard: {
      backgroundColor: palette.surfaceBackground,
      borderRadius: 28,
      gap: 14,
      padding: 18,
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.06,
      shadowRadius: 22
    },
    reflectionTargetCard: {
      backgroundColor: palette.accentSoft,
      borderRadius: 18,
      gap: 6,
      padding: 14
    },
    reflectionTargetLabel: {
      color: palette.warningText,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.3,
      textTransform: "uppercase"
    },
    reflectionTargetTitle: {
      color: palette.bodyStrong,
      fontSize: 19,
      fontWeight: "800",
      letterSpacing: -0.4
    },
    reflectionTextarea: {
      backgroundColor: palette.inputBackground,
      borderColor: palette.inputBorder,
      borderRadius: 18,
      borderWidth: 1,
      color: palette.inputText,
      fontSize: 15,
      lineHeight: 22,
      minHeight: 180,
      paddingHorizontal: 14,
      paddingVertical: 14
    }
  } as const;
}

export function buildExpoMotivationScreenThemeContract(palette: ExpoThemePalette) {
  return {
    motivationMetricGrid: {
      flexDirection: "row",
      gap: 10
    },
    motivationHeroGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10
    },
    motivationSummaryStrip: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10
    },
    motivationSummaryChip: {
      alignItems: "center",
      backgroundColor: palette.surfaceMuted,
      borderRadius: 999,
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    motivationSummaryChipValue: {
      color: palette.bodyStrong,
      fontSize: 13,
      fontWeight: "800"
    },
    motivationMetricCard: {
      backgroundColor: palette.accentSoft,
      borderRadius: 18,
      flex: 1,
      gap: 6,
      padding: 14
    },
    motivationMetricLabel: {
      color: palette.warningText,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.3,
      textTransform: "uppercase"
    },
    motivationMetricValue: {
      color: palette.bodyStrong,
      fontSize: 24,
      fontWeight: "900",
      letterSpacing: -0.6
    },
    motivationLegendRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12
    },
    motivationLegendItem: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8
    },
    motivationLegendSwatch: {
      borderRadius: 999,
      height: 10,
      width: 10
    },
    motivationCalendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10
    },
    motivationCalendarDay: {
      borderRadius: 16,
      minHeight: 74,
      paddingHorizontal: 12,
      paddingVertical: 10,
      width: "22%"
    },
    motivationCalendarDayGood: {
      backgroundColor: palette.calendarGoodBackground
    },
    motivationCalendarDayMid: {
      backgroundColor: palette.calendarMidBackground
    },
    motivationCalendarDayWatch: {
      backgroundColor: palette.calendarWatchBackground
    },
    motivationCalendarDayNumber: {
      color: palette.bodyStrong,
      fontSize: 16,
      fontWeight: "800"
    },
    motivationCalendarRateGood: {
      color: palette.calendarGoodText,
      fontSize: 13,
      fontWeight: "800"
    },
    motivationCalendarRateMid: {
      color: palette.calendarMidText,
      fontSize: 13,
      fontWeight: "800"
    },
    motivationCalendarRateWatch: {
      color: palette.calendarWatchText,
      fontSize: 13,
      fontWeight: "800"
    }
  } as const;
}

export function buildExpoTodayScreenStyleSnapshot(themeKey: ExpoThemeKey) {
  const contract = buildExpoTodayScreenThemeContract(getExpoThemePalette(themeKey));

  return {
    errorBanner: contract.errorBanner,
    plannerCard: contract.todayPlannerCard,
    plannerMetaText: contract.todayPlanMetaText,
    routeSafeArea: contract.routeSafeArea,
    settingsButton: contract.settingsButton,
    settingsMenu: contract.settingsMenu,
    settingsMenuItemActive: mergeStyles(
      contract.settingsMenuItem,
      contract.settingsMenuItemActive
    ),
    settingsMenuText: contract.settingsMenuText,
    statTile: contract.statTile,
    statusCurrent: {
      container: mergeStyles(contract.statusPill, contract.statusPillCurrent),
      text: mergeStyles(contract.statusPillText, contract.statusPillTextCurrent)
    },
    statusDone: {
      container: mergeStyles(contract.statusPill, contract.statusPillDone),
      text: mergeStyles(contract.statusPillText, contract.statusPillTextDone)
    },
    statusMissed: {
      container: mergeStyles(contract.statusPill, contract.statusPillMissed),
      text: mergeStyles(contract.statusPillText, contract.statusPillTextMissed)
    },
    statusPending: {
      container: mergeStyles(contract.statusPill, contract.statusPillPending),
      text: mergeStyles(contract.statusPillText, contract.statusPillTextPending)
    },
    todayHeadline: contract.todaySectionHeadline,
    todaySubtitle: contract.todayHeaderSubtitle,
    todayTitle: contract.todayHeaderTitle
  };
}

export function buildExpoPlanEditorScreenStyleSnapshot(themeKey: ExpoThemeKey) {
  const contract = buildExpoPlanEditorScreenThemeContract(getExpoThemePalette(themeKey));

  return {
    bottomSheetCard: contract.bottomSheetCard,
    errorBanner: buildExpoTodayScreenThemeContract(getExpoThemePalette(themeKey)).errorBanner,
    fieldErrorText: contract.fieldErrorText,
    input: contract.input,
    inputError: mergeStyles(contract.input, contract.inputError),
    pickerOptionActive: {
      container: mergeStyles(contract.timePickerOption, contract.timePickerOptionActive),
      text: contract.timePickerOptionTextActive
    },
    primaryButton: contract.primaryButton,
    primaryButtonText: contract.primaryButtonText,
    secondaryButton: contract.secondaryButton,
    secondaryButtonText: contract.secondaryButtonText,
    selectOptionsPanel: contract.selectOptionsPanel,
    selectRowActive: mergeStyles(contract.selectOptionRow, contract.selectOptionRowActive),
    selectTrigger: contract.selectTrigger,
    surfaceCard: contract.surfaceCard,
    timePickerColumn: contract.timePickerColumn,
    timePreviewCard: contract.timePreviewCard,
    warningCard: contract.warningCard
  };
}

export function buildExpoReflectionScreenStyleSnapshot(themeKey: ExpoThemeKey) {
  const reflectionContract = buildExpoReflectionScreenThemeContract(getExpoThemePalette(themeKey));
  const editorContract = buildExpoPlanEditorScreenThemeContract(getExpoThemePalette(themeKey));
  const todayContract = buildExpoTodayScreenThemeContract(getExpoThemePalette(themeKey));

  return {
    primaryButton: editorContract.primaryButton,
    reflectionTargetCard: reflectionContract.reflectionTargetCard,
    reflectionTargetLabel: reflectionContract.reflectionTargetLabel,
    reflectionTargetTitle: reflectionContract.reflectionTargetTitle,
    reflectionTextarea: reflectionContract.reflectionTextarea,
    routeSectionCard: reflectionContract.routeSectionCard,
    secondaryButton: editorContract.secondaryButton,
    todaySubtitle: todayContract.todayHeaderSubtitle,
    todayTitle: todayContract.todayHeaderTitle
  };
}

export function buildExpoMotivationScreenStyleSnapshot(themeKey: ExpoThemeKey) {
  const motivationContract = buildExpoMotivationScreenThemeContract(getExpoThemePalette(themeKey));
  const reflectionContract = buildExpoReflectionScreenThemeContract(getExpoThemePalette(themeKey));
  const todayContract = buildExpoTodayScreenThemeContract(getExpoThemePalette(themeKey));

  return {
    calendarGood: {
      container: mergeStyles(
        motivationContract.motivationCalendarDay,
        motivationContract.motivationCalendarDayGood
      ),
      text: motivationContract.motivationCalendarRateGood
    },
    calendarMid: {
      container: mergeStyles(
        motivationContract.motivationCalendarDay,
        motivationContract.motivationCalendarDayMid
      ),
      text: motivationContract.motivationCalendarRateMid
    },
    calendarWatch: {
      container: mergeStyles(
        motivationContract.motivationCalendarDay,
        motivationContract.motivationCalendarDayWatch
      ),
      text: motivationContract.motivationCalendarRateWatch
    },
    legendSwatch: motivationContract.motivationLegendSwatch,
    metricCard: motivationContract.motivationMetricCard,
    metricValue: motivationContract.motivationMetricValue,
    plannerCard: todayContract.todayPlannerCard,
    routeSectionCard: reflectionContract.routeSectionCard,
    statTile: todayContract.statTile,
    summaryChip: motivationContract.motivationSummaryChip,
    summaryChipValue: motivationContract.motivationSummaryChipValue,
    todayHeadline: todayContract.todaySectionHeadline
  };
}
