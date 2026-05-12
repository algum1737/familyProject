import { describe, expect, it } from "vitest";

import { getRescheduleFailureGuidance } from "@/features/planner/core/reschedule-failure-guidance";
import {
  RESCHEDULE_MAXED_MESSAGE,
  RESCHEDULE_UNAVAILABLE_MESSAGE
} from "@/features/planner/core/planner-state-transitions";

describe("getRescheduleFailureGuidance", () => {
  it("returns unavailable guidance for continuous time shortages", () => {
    expect(getRescheduleFailureGuidance(RESCHEDULE_UNAVAILABLE_MESSAGE)).toEqual({
      description:
        "더 짧은 새 시간으로 다시 잡으십시오. 시작 시간이나 종료 시간을 직접 줄여 같은 화면에서 저장하면 됩니다.",
      kind: "unavailable",
      title: RESCHEDULE_UNAVAILABLE_MESSAGE
    });
  });

  it("returns maxed guidance for plans that exhausted reschedules", () => {
    expect(getRescheduleFailureGuidance(RESCHEDULE_MAXED_MESSAGE)).toEqual({
      description:
        "지금은 다시 지정 대신 회고를 남기거나 일정을 삭제하고, 필요하면 내일 새 계획으로 다시 등록하십시오.",
      kind: "maxed",
      title: RESCHEDULE_MAXED_MESSAGE
    });
  });

  it("returns null for unrelated errors", () => {
    expect(getRescheduleFailureGuidance("다른 오류")).toBeNull();
    expect(getRescheduleFailureGuidance(null)).toBeNull();
  });
});
