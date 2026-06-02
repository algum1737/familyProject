export type ExpoExactAlarmAccessState =
  | "checking"
  | "granted"
  | "needs-permission"
  | "not-required"
  | "unavailable";

export function getExpoExactAlarmAccessLabel(state: ExpoExactAlarmAccessState) {
  switch (state) {
    case "granted":
      return "정확 알림 켜짐";
    case "needs-permission":
      return "정확 알림 켜기";
    case "not-required":
      return "정확 알림 지원";
    case "checking":
      return "알림 상태 확인 중";
    default:
      return "알림 설정 확인";
  }
}

export function shouldPromptForExpoExactAlarmAccess(
  state: ExpoExactAlarmAccessState
) {
  return state === "needs-permission" || state === "unavailable";
}
