import { describe, expect, it } from "vitest";

import {
  getBootstrapSourceLabel,
  getExpoRouterProviderView
} from "../apps/expo/src/app-shell/expo-router-provider-state";

describe("expo router provider state helpers", () => {
  it("maps bootstrap source to user-facing labels", () => {
    expect(getBootstrapSourceLabel("records-restored")).toBe(
      "저장된 계획을 불러왔습니다"
    );
    expect(getBootstrapSourceLabel("legacy-migrated")).toBe(
      "이전 계획을 불러왔습니다"
    );
    expect(getBootstrapSourceLabel("empty")).toBe("저장된 계획이 없습니다");
    expect(getBootstrapSourceLabel(null)).toBe("확인 중");
  });

  it("collapses bootstrap status into provider render states", () => {
    expect(getExpoRouterProviderView("loading")).toBe("loading");
    expect(getExpoRouterProviderView("error")).toBe("error");
    expect(getExpoRouterProviderView("ready")).toBe("ready");
  });
});
