import { StyleSheet } from "react-native";

export const expoTheme = StyleSheet.create({
  appShellSafeArea: {
    backgroundColor: "#10131a",
    flex: 1
  },
  activeChip: {
    alignItems: "center",
    backgroundColor: "#edf2fb",
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
    color: "#48617f",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8
  },
  activeLabel: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700"
  },
  bodyStrong: {
    color: "#22252c",
    fontSize: 18,
    fontWeight: "800"
  },
  bodyText: {
    color: "#676b78",
    fontSize: 14,
    lineHeight: 22
  },
  bodyTextError: {
    color: "#bc4f43",
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
  selectOptionRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  selectOptionRowActive: {
    backgroundColor: "#fff4ef"
  },
  selectOptionText: {
    color: "#596070",
    fontSize: 13,
    fontWeight: "700"
  },
  selectOptionTextActive: {
    color: "#22252c"
  },
  selectOptionsPanel: {
    backgroundColor: "#fffdf9",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    gap: 8,
    left: 0,
    maxHeight: 220,
    padding: 8,
    position: "absolute",
    right: 0,
    shadowColor: "#8d7c68",
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
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  selectTriggerChevron: {
    color: "#7b7f8b",
    fontSize: 14,
    fontWeight: "800"
  },
  selectTriggerText: {
    color: "#22252c",
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
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    color: "#22252c",
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  inputError: {
    borderColor: "#d76b5b",
    borderWidth: 1.5
  },
  inputLabel: {
    color: "#6b6f7b",
    fontSize: 13,
    fontWeight: "700"
  },
  inputStack: {
    gap: 8
  },
  fieldErrorText: {
    color: "#bc4f43",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20
  },
  timePreviewCard: {
    backgroundColor: "#fff5ef",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  timePreviewText: {
    color: "#8a5a4f",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20
  },
  eyebrow: {
    color: "#ffb39f",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  heroCard: {
    backgroundColor: "#19202b",
    borderRadius: 28,
    gap: 10,
    padding: 22
  },
  page: {
    backgroundColor: "#10131a",
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  routeSafeArea: {
    backgroundColor: "#f5f2eb",
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
  todayHeader: {
    gap: 10,
    paddingHorizontal: 6
  },
  todayHeaderTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  todayHeaderEyebrow: {
    color: "#8c877d",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4
  },
  todayHeaderTitle: {
    color: "#20242d",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.8
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: "#fffdf9",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  settingsButtonText: {
    color: "#596070",
    fontSize: 18,
    fontWeight: "800"
  },
  settingsMenu: {
    backgroundColor: "#fffdf9",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    position: "absolute",
    right: 0,
    shadowColor: "#8d7c68",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    top: 48,
    width: 116,
    zIndex: 20
  },
  settingsMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  settingsMenuText: {
    color: "#22252c",
    fontSize: 14,
    fontWeight: "700"
  },
  settingsStack: {
    position: "relative",
    zIndex: 20
  },
  todayHeaderSubtitle: {
    color: "#747884",
    fontSize: 16,
    lineHeight: 24
  },
  todayPlannerCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 28,
    gap: 14,
    padding: 18,
    shadowColor: "#8d7c68",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24
  },
  todaySectionHeader: {
    gap: 6
  },
  todaySectionTitle: {
    color: "#20242d",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  todaySectionHeadline: {
    color: "#20242d",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5
  },
  todaySectionBody: {
    color: "#7b7f8b",
    fontSize: 16,
    lineHeight: 24
  },
  sectionTitle: {
    color: "#22252c",
    fontSize: 15,
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 14
  },
  secondaryButtonText: {
    color: "#596070",
    fontSize: 14,
    fontWeight: "700"
  },
  primaryButtonDisabled: {
    alignItems: "center",
    backgroundColor: "#f4d1c6",
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    opacity: 0.65,
    paddingHorizontal: 14
  },
  statRow: {
    flexDirection: "row",
    gap: 10
  },
  statTile: {
    backgroundColor: "#fff5ef",
    borderRadius: 18,
    flex: 1,
    gap: 6,
    padding: 14
  },
  statTileStrong: {
    color: "#22252c",
    fontSize: 18,
    fontWeight: "800"
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22
  },
  surfaceCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    gap: 10,
    padding: 18
  },
  routeSectionCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 28,
    gap: 14,
    padding: 18,
    shadowColor: "#8d7c68",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.06,
    shadowRadius: 22
  },
  errorBanner: {
    backgroundColor: "#fff1ee",
    borderColor: "#f0c4bc",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  reflectionTargetCard: {
    backgroundColor: "#fff5ef",
    borderRadius: 18,
    gap: 6,
    padding: 14
  },
  reflectionTargetLabel: {
    color: "#9a6a5b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  reflectionTargetTitle: {
    color: "#22252c",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.4
  },
  reflectionTextarea: {
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
    borderRadius: 18,
    borderWidth: 1,
    color: "#22252c",
    fontSize: 15,
    lineHeight: 22,
    minHeight: 180,
    paddingHorizontal: 14,
    paddingVertical: 14
  },
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
    backgroundColor: "rgba(255,255,255,0.76)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  motivationSummaryChipValue: {
    color: "#22252c",
    fontSize: 13,
    fontWeight: "800"
  },
  motivationMetricCard: {
    backgroundColor: "#fff5ef",
    borderRadius: 18,
    flex: 1,
    gap: 6,
    padding: 14
  },
  motivationMetricLabel: {
    color: "#9a6a5b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  motivationMetricValue: {
    color: "#22252c",
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
    backgroundColor: "#e4f4e7"
  },
  motivationCalendarDayMid: {
    backgroundColor: "#fff1dd"
  },
  motivationCalendarDayWatch: {
    backgroundColor: "#fde7e4"
  },
  motivationCalendarDayNumber: {
    color: "#22252c",
    fontSize: 16,
    fontWeight: "800"
  },
  motivationCalendarRateGood: {
    color: "#2f7b46",
    fontSize: 13,
    fontWeight: "800"
  },
  motivationCalendarRateMid: {
    color: "#a06b16",
    fontSize: 13,
    fontWeight: "800"
  },
  motivationCalendarRateWatch: {
    color: "#b14a3e",
    fontSize: 13,
    fontWeight: "800"
  },
  tertiaryButton: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12
  },
  tertiaryButtonText: {
    color: "#48617f",
    fontSize: 13,
    fontWeight: "700"
  },
  bottomSheetOverlay: {
    backgroundColor: "rgba(22, 24, 31, 0.26)",
    flex: 1,
    justifyContent: "flex-end"
  },
  bottomSheetBackdrop: {
    flex: 1
  },
  bottomSheetCard: {
    backgroundColor: "#fffdf9",
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
    backgroundColor: "#f8f5ef",
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
    backgroundColor: "#ffffff",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 12
  },
  timePickerOptionActive: {
    backgroundColor: "#f07c61"
  },
  timePickerOptionText: {
    color: "#596070",
    fontSize: 15,
    fontWeight: "700"
  },
  timePickerOptionTextActive: {
    color: "#ffffff"
  },
  tabBadge: {
    alignItems: "center",
    backgroundColor: "rgba(37,48,69,0.08)",
    borderRadius: 999,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  tabBadgeText: {
    color: "#273245",
    fontSize: 15,
    fontWeight: "800"
  },
  tabBadgeTextActive: {
    color: "#ffffff"
  },
  tabBar: {
    backgroundColor: "#f7f5f0",
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    padding: 10
  },
  tabButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
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
    backgroundColor: "#ea765a",
    borderColor: "#ea765a"
  },
  tabLabel: {
    color: "#273245",
    fontSize: 12,
    fontWeight: "700"
  },
  tabLabelActive: {
    color: "#ffffff"
  },
  textarea: {
    backgroundColor: "#ffffff",
    borderColor: "#e6ddd6",
    borderRadius: 16,
    borderWidth: 1,
    color: "#22252c",
    fontSize: 15,
    minHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: "top"
  },
  todayPlanItem: {
    backgroundColor: "#ffffff",
    borderColor: "#ece4dd",
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
    color: "#22252c",
    fontSize: 16,
    fontWeight: "800"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#ea765a",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 14
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
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
    backgroundColor: "#ffe8dc"
  },
  statusPillDone: {
    backgroundColor: "#e4f4e7"
  },
  statusPillMissed: {
    backgroundColor: "#fde7e4"
  },
  statusPillPending: {
    backgroundColor: "#ebeef5"
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "800"
  },
  statusPillTextCurrent: {
    color: "#a9503b"
  },
  statusPillTextDone: {
    color: "#2f7b46"
  },
  statusPillTextMissed: {
    color: "#b14a3e"
  },
  statusPillTextPending: {
    color: "#546176"
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800"
  }
});
