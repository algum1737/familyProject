import {
  RESCHEDULE_MAXED_MESSAGE,
  RESCHEDULE_UNAVAILABLE_MESSAGE
} from "@/features/planner/core/planner-state-transitions";

export type RescheduleFailureGuidance = {
  description: string;
  kind: "maxed" | "unavailable";
  title: string;
};

const RESCHEDULE_UNAVAILABLE_DESCRIPTION =
  "더 짧은 새 시간으로 다시 잡으십시오. 시작 시간이나 종료 시간을 직접 줄여 같은 화면에서 저장하면 됩니다.";
const RESCHEDULE_MAXED_DESCRIPTION =
  "지금은 다시 지정 대신 회고를 남기거나 일정을 삭제하고, 필요하면 내일 새 계획으로 다시 등록하십시오.";

export function getRescheduleFailureGuidance(
  error: string | null
): RescheduleFailureGuidance | null {
  if (error === RESCHEDULE_UNAVAILABLE_MESSAGE) {
    return {
      description: RESCHEDULE_UNAVAILABLE_DESCRIPTION,
      kind: "unavailable",
      title: RESCHEDULE_UNAVAILABLE_MESSAGE
    };
  }

  if (error === RESCHEDULE_MAXED_MESSAGE) {
    return {
      description: RESCHEDULE_MAXED_DESCRIPTION,
      kind: "maxed",
      title: RESCHEDULE_MAXED_MESSAGE
    };
  }

  return null;
}
