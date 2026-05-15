import {
  describeMinuteWithFormat,
  type TimeDisplayFormat
} from "../../../../src/domains/plans/service/planner";
import type { DailyPlan } from "../../../../src/domains/plans/types";
import {
  buildPlannerPlanItemCoreModels,
  type PlannerPlanItemCoreModel
} from "../../../../src/features/planner/core/planner-core-view-model";

import type { ExpoPlanItemView } from "./expo-planner-shell-model";

function getStatusLabel(status: "current" | "pending" | "done" | "missed") {
  switch (status) {
    case "current":
      return "지금";
    case "done":
      return "완료";
    case "missed":
      return "놓침";
    default:
      return "대기";
  }
}

function getRecoveryLabel(kind: string | null) {
  switch (kind) {
    case "reflection_prompt":
      return "회고 다시 보기";
    case "reschedule_prompt":
      return "다시 지정 다시 보기";
    case "followup_completed":
      return "회복 완료";
    case "followup_active":
      return "회복 진행 중";
    case "followup_soon":
      return "다시 지정 곧 시작";
    case "followup_scheduled":
      return "다시 지정됨";
    default:
      return null;
  }
}

function getTimeText(
  startMinute: number,
  endMinute: number,
  timeDisplayFormat: TimeDisplayFormat
) {
  return `${describeMinuteWithFormat(startMinute, timeDisplayFormat)} - ${describeMinuteWithFormat(endMinute, timeDisplayFormat)}`;
}

function toPlanItemView(
  item: PlannerPlanItemCoreModel,
  timeDisplayFormat: TimeDisplayFormat
): ExpoPlanItemView {
  const isMissed = item.statusLabelKey === "missed";
  const rescheduleActionState: ExpoPlanItemView["rescheduleActionState"] =
    isMissed && item.canReschedule
      ? "enabled"
      : isMissed && item.rescheduleBlockedReason
        ? "blocked"
        : "hidden";

  return {
    canReschedule: item.canReschedule,
    canToggleStatus: item.canToggleStatus,
    id: item.plan.id,
    title: item.plan.title,
    rescheduleActionState,
    rescheduleBlockedReason: item.rescheduleBlockedReason,
    timeText: getTimeText(item.plan.startMinute, item.plan.endMinute, timeDisplayFormat),
    statusLabel: getStatusLabel(item.statusLabelKey),
    statusTone: item.statusLabelKey,
    recoveryLabel: getRecoveryLabel(item.recoveryHighlightState?.kind ?? null)
  };
}

export function buildExpoTodayPlanItems(
  plans: DailyPlan[],
  currentMinute: number,
  timeDisplayFormat: TimeDisplayFormat
) {
  return buildPlannerPlanItemCoreModels(plans, currentMinute).map((item) =>
    toPlanItemView(item, timeDisplayFormat)
  );
}

export function getExpoCurrentPlanTimeText(
  currentPlan: DailyPlan | null,
  timeDisplayFormat: TimeDisplayFormat
) {
  if (currentPlan === null) {
    return "현재 시간대에 등록된 계획이 없습니다.";
  }

  return getTimeText(currentPlan.startMinute, currentPlan.endMinute, timeDisplayFormat);
}
