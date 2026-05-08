export type AppTabKey = "today" | "motivation";
export type OverlayScreenKey = "editor" | "reflection";
export type ScreenKey = AppTabKey | OverlayScreenKey;

export const FLOW_TABS: Array<{
  badge: string;
  description: string;
  key: ScreenKey;
  label: string;
}> = [
  { key: "today", label: "오늘", badge: "◷", description: "원형 시간판과 현재 계획" },
  { key: "editor", label: "편집", badge: "P", description: "계획 입력과 다시 지정 편집" },
  { key: "reflection", label: "회고", badge: "R", description: "missed 회고와 메모 저장" },
  { key: "motivation", label: "동기", badge: "✦", description: "월간 유지율과 회복 기여" }
];

export const APP_TABS = FLOW_TABS.filter(
  (tab): tab is (typeof FLOW_TABS)[number] & { key: AppTabKey } =>
    tab.key === "today" || tab.key === "motivation"
);
