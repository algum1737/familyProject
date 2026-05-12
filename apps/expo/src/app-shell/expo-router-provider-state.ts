export type ExpoRouterBootstrapSource =
  | "empty"
  | "legacy-migrated"
  | "records-restored"
  | null;

export type ExpoRouterBootstrapStatus = "loading" | "error" | "ready";

export function getBootstrapSourceLabel(source: ExpoRouterBootstrapSource) {
  switch (source) {
    case "records-restored":
      return "기존 날짜 기록 복구";
    case "legacy-migrated":
      return "legacy today plans 마이그레이션";
    case "empty":
      return "빈 상태 초기화";
    default:
      return "확인 중";
  }
}

export function getExpoRouterProviderView(status: ExpoRouterBootstrapStatus) {
  if (status === "loading") {
    return "loading";
  }

  if (status === "error") {
    return "error";
  }

  return "ready";
}
