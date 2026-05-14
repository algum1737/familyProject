export type ExpoRouterBootstrapSource =
  | "empty"
  | "legacy-migrated"
  | "records-restored"
  | null;

export type ExpoRouterBootstrapStatus = "loading" | "error" | "ready";

export function getBootstrapSourceLabel(source: ExpoRouterBootstrapSource) {
  switch (source) {
    case "records-restored":
      return "저장된 계획을 불러왔습니다";
    case "legacy-migrated":
      return "이전 계획을 불러왔습니다";
    case "empty":
      return "저장된 계획이 없습니다";
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
