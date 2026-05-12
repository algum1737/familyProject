import { describe, expect, it } from "vitest";

import {
  getBootstrapSourceLabel,
  getExpoRouterProviderView
} from "../apps/expo/src/app-shell/expo-router-provider-state";

describe("expo router provider state helpers", () => {
  it("maps bootstrap source to user-facing labels", () => {
    expect(getBootstrapSourceLabel("records-restored")).toBe("기존 날짜 기록 복구");
    expect(getBootstrapSourceLabel("legacy-migrated")).toBe(
      "legacy today plans 마이그레이션"
    );
    expect(getBootstrapSourceLabel("empty")).toBe("빈 상태 초기화");
    expect(getBootstrapSourceLabel(null)).toBe("확인 중");
  });

  it("collapses bootstrap status into provider render states", () => {
    expect(getExpoRouterProviderView("loading")).toBe("loading");
    expect(getExpoRouterProviderView("error")).toBe("error");
    expect(getExpoRouterProviderView("ready")).toBe("ready");
  });
});
