import { describeMinute } from "@/domains/plans/service/planner";
import type { PlannerLabelSettings } from "@/providers/labels/planner-label-settings";
import type { PlannerPlanItemCoreModel } from "@/features/planner/core/planner-core-view-model";
import type { RecoveryHighlightKind } from "@/features/planner/core/planner-recovery-rules";
import type { RecoveryHighlightState } from "@/features/planner/core/planner-recovery-rules";

export function getRecoveryHighlightLabel(kind: RecoveryHighlightKind): string {
  switch (kind) {
    case "reflection_prompt":
      return "회고 다시 보기";
    case "reschedule_prompt":
      return "다시 지정 다시 보기";
    case "followup_completed":
      return "회복 완료";
    case "reschedule_unavailable":
      return "다시 지정 불가";
    case "followup_scheduled":
      return "다시 지정됨";
    case "followup_soon":
      return "다시 지정 곧 시작";
    default:
      return "회복 진행 중";
  }
}

export function getComposerTitle(options: {
  editingPlanId: string | null;
  recoveryMode: "reflection" | "reschedule" | null;
}): string {
  return options.recoveryMode === "reschedule"
    ? "다시 지정"
    : options.editingPlanId
      ? "계획 수정"
      : "계획 등록";
}

export function getSubmitButtonLabel(options: {
  editingPlanId: string | null;
  recoveryMode: "reflection" | "reschedule" | null;
}): string {
  return options.recoveryMode === "reschedule"
    ? "다시 지정 저장"
    : options.editingPlanId
      ? "계획 저장"
      : "계획 추가";
}

export function getPlanStatusLabel(
  labelSettings: PlannerLabelSettings,
  key: "current" | "pending" | "done" | "missed"
) {
  return labelSettings.statusLabels[key];
}

export function getPlanTimeText(startMinute: number, endMinute: number) {
  return `${describeMinute(startMinute)} - ${describeMinute(endMinute)}`;
}

export function getCurrentPlanTimeText(
  currentPlan: { startMinute: number; endMinute: number } | null,
  isCurrentMinuteReady: boolean
) {
  if (!isCurrentMinuteReady) {
    return "현재 시간을 동기화하고 있습니다.";
  }

  return currentPlan
    ? getPlanTimeText(currentPlan.startMinute, currentPlan.endMinute)
    : "현재 시간대에 등록된 계획이 없습니다.";
}

export function getListCurrentTimeText(
  currentMinute: number | null,
  resolvedCurrentMinute: number
) {
  return currentMinute === null ? "시간 동기화 중" : `${describeMinute(resolvedCurrentMinute)} 기준`;
}

export function getRecoveryHighlightPresentation(options: {
  followUpTitle: string | null;
  state: RecoveryHighlightState;
}) {
  if (!options.state) {
    return null;
  }

  switch (options.state.kind) {
    case "reflection_prompt":
      return {
        detail: "왜 놓쳤는지 짧게라도 남겨 두면 같은 패턴을 다시 줄이기 쉽습니다.",
        label: getRecoveryHighlightLabel("reflection_prompt"),
        tone: "review" as const
      };
    case "reschedule_prompt":
      return {
        detail: "오늘 남은 빈 시간에 다시 지정할 수 있습니다.",
        label: getRecoveryHighlightLabel("reschedule_prompt"),
        tone: "watch" as const
      };
    case "followup_active":
      return {
        detail: `${options.followUpTitle ?? "후속"} 일정이 지금 진행 중입니다. 끝나기 전에 완료 여부를 확인하십시오.`,
        label: getRecoveryHighlightLabel("followup_active"),
        tone: "active" as const
      };
    case "followup_completed":
      return {
        detail: `${options.followUpTitle ?? "후속"} 일정이 완료됐습니다. 원래 놓친 일정은 회복 완료로 기록됩니다.`,
        label: getRecoveryHighlightLabel("followup_completed"),
        tone: "active" as const
      };
    case "followup_soon":
      return {
        detail: `${describeMinute(options.state.followUpStartMinute ?? 0)}에 다시 지정한 일정이 곧 시작됩니다.`,
        label: getRecoveryHighlightLabel("followup_soon"),
        tone: "watch" as const
      };
    case "followup_scheduled":
      return {
        detail: `${describeMinute(options.state.followUpStartMinute ?? 0)}에 ${options.followUpTitle ?? "후속"} 일정으로 다시 지정돼 있습니다.`,
        label: getRecoveryHighlightLabel("followup_scheduled"),
        tone: "watch" as const
      };
    default:
      return {
        detail: "오늘 남은 빈 시간에는 이 일정 길이 그대로 다시 지정할 수 없습니다.",
        label: getRecoveryHighlightLabel("reschedule_unavailable"),
        tone: "watch" as const
      };
  }
}

export function buildPlannerPlanItemPresentation(
  coreModel: PlannerPlanItemCoreModel,
  labelSettings: PlannerLabelSettings
) {
  return {
    canReschedule: coreModel.canReschedule,
    canToggleStatus: coreModel.canToggleStatus,
    isCurrent: coreModel.isCurrent,
    plan: coreModel.plan,
    recoveryBadges: coreModel.recoveryBadges,
    recoveryHighlight: getRecoveryHighlightPresentation({
      followUpTitle: coreModel.followUpTitle,
      state: coreModel.recoveryHighlightState
    }),
    reflectionPreview: coreModel.reflectionPreview,
    statusLabel: getPlanStatusLabel(labelSettings, coreModel.statusLabelKey),
    timeText: getPlanTimeText(coreModel.plan.startMinute, coreModel.plan.endMinute)
  };
}
