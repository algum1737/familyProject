"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  describeMinute,
  getCurrentPlan,
  getPlannerSummary,
  isCurrentPlan,
  sortPlans
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import type { PlannerLabelSettingsStore } from "@/providers/labels/planner-label-settings";
import type { PlansStore } from "@/providers/plans/plans-store";
import {
  appendRecoveryHighlightObservation,
  clearRecoveryHighlightObservations,
  loadRecoveryHighlightObservations,
  type RecoveryHighlightObservation,
  type RecoveryHighlightObservationType
} from "@/providers/recovery/recovery-highlight-observation-store";
import {
  appendReminderObservation,
  clearReminderObservations,
  loadReminderObservations,
  type ReminderObservation
} from "@/providers/reminders/reminder-observation-store";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { TimeSource } from "@/providers/time/time-source";
import { getMinutesSinceMidnight } from "@/shared/time/minutes";
import { usePlannerLabelSettings } from "@/ui/planner/use-planner-label-settings";
import { useReminderBanner } from "@/ui/planner/use-reminder-banner";
import { usePlannerState } from "@/ui/planner/use-planner-state";

const CURRENT_MINUTE_POLL_INTERVAL_MS = 10_000;

function useCurrentMinute(timeSource: TimeSource) {
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    setMinute(getMinutesSinceMidnight(timeSource.now()));

    const timer = window.setInterval(() => {
      setMinute(getMinutesSinceMidnight(timeSource.now()));
    }, CURRENT_MINUTE_POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [timeSource]);

  return minute;
}

type UsePlannerViewModelOptions = {
  labelSettingsStore: PlannerLabelSettingsStore;
  plansStore: PlansStore;
  reminderProvider: ReminderProvider;
  timeSource: TimeSource;
};

type PlannerListItem = {
  canToggleStatus: boolean;
  canReschedule: boolean;
  isCurrent: boolean;
  plan: DailyPlan;
  recoveryBadges: string[];
  recoveryHighlight: {
    detail: string;
    label: string;
    tone: "active" | "review" | "watch";
  } | null;
  reflectionPreview: string | null;
  statusLabel: string;
  timeText: string;
};

type ReminderObservationSummaryItem = {
  label: string;
  value: string;
};

type ReminderPolicyStatus = {
  detail: string;
  label: string;
  tone: "hold" | "review" | "watch";
};

type RecoveryObservationSummaryItem = {
  label: string;
  value: string;
};

type RecoveryObservationPolicyStatus = {
  detail: string;
  label: string;
  tone: "hold" | "review" | "watch";
};

function buildReflectionPreview(note: string | undefined) {
  const trimmed = note?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
}

function getChainRootId(plan: DailyPlan) {
  return plan.sourcePlanId ?? plan.id;
}

function getRecoveryHighlightObservationType(
  label: PlannerListItem["recoveryHighlight"] extends infer Highlight
    ? Highlight extends { label: infer Label }
      ? Label
      : never
    : never
): RecoveryHighlightObservationType {
  switch (label) {
    case "회고 다시 보기":
      return "reflection_prompt";
    case "다시 지정 다시 보기":
      return "reschedule_prompt";
    case "다시 지정 불가":
      return "reschedule_unavailable";
    case "다시 지정됨":
      return "followup_scheduled";
    case "다시 지정 곧 시작":
      return "followup_soon";
    default:
      return "followup_active";
  }
}

export function usePlannerViewModel({
  labelSettingsStore,
  plansStore,
  reminderProvider,
  timeSource
}: UsePlannerViewModelOptions) {
  const plannerState = usePlannerState(plansStore);
  const { labelSettings, resetLabelSettings, saveLabelSettings } = usePlannerLabelSettings(
    labelSettingsStore
  );
  const [recoveryHighlightObservations, setRecoveryHighlightObservations] = useState<
    RecoveryHighlightObservation[]
  >(() => loadRecoveryHighlightObservations());
  const [reminderObservations, setReminderObservations] = useState<ReminderObservation[]>(() =>
    loadReminderObservations()
  );
  const currentMinute = useCurrentMinute(timeSource);
  const resolvedCurrentMinute = currentMinute ?? 0;
  const lastShownReminderKeyRef = useRef<string | null>(null);
  const lastRecoveryHighlightKeyRef = useRef<Record<string, string>>({});
  const sortedPlans = useMemo(() => sortPlans(plannerState.plans), [plannerState.plans]);
  const currentPlan =
    currentMinute === null ? null : getCurrentPlan(sortedPlans, resolvedCurrentMinute);
  const summary = getPlannerSummary(plannerState.plans);
  const { activeReminder, dismissReminder } = useReminderBanner(sortedPlans, currentMinute);

  function canTogglePlanStatus(plan: DailyPlan) {
    if (plan.status === "done") {
      return true;
    }

    if (plan.status === "missed") {
      return false;
    }

    return currentMinute !== null && currentMinute >= plan.startMinute;
  }

  function canReschedulePlan(plan: DailyPlan) {
    return plan.status === "missed" && plan.rescheduleCount < 3;
  }

  const planItems = useMemo<PlannerListItem[]>(
    () =>
      sortedPlans.map((plan) => {
        const current =
          currentMinute === null ? false : isCurrentPlan(plan, resolvedCurrentMinute);
        const canToggleStatus = canTogglePlanStatus(plan);
        const chainRootId = getChainRootId(plan);
        const chainRescheduleCount = sortedPlans.reduce((maxCount, item) => {
          const itemRootId = getChainRootId(item);

          if (itemRootId !== chainRootId) {
            return maxCount;
          }

          return Math.max(maxCount, item.rescheduleCount);
        }, 0);
        const recoveryBadges = [];

        if (plan.reflectionNote?.trim()) {
          recoveryBadges.push("회고 저장됨");
        }

        if (chainRescheduleCount > 0) {
          recoveryBadges.push(`다시 지정 ${chainRescheduleCount}/3`);
        }

        const nextPendingFollowUp = sortPlans(
          sortedPlans.filter(
            (item) =>
              item.id !== plan.id &&
              getChainRootId(item) === chainRootId &&
              item.status === "pending"
          )
        )[0];
        let recoveryHighlight: PlannerListItem["recoveryHighlight"] = null;

        if (plan.status === "missed") {
          if (!plan.reflectionNote?.trim()) {
            recoveryHighlight = {
              detail: "왜 놓쳤는지 짧게라도 남겨 두면 같은 패턴을 다시 줄이기 쉽습니다.",
              label: "회고 다시 보기",
              tone: "review"
            };
          } else if (
            nextPendingFollowUp &&
            currentMinute !== null &&
            isCurrentPlan(nextPendingFollowUp, resolvedCurrentMinute)
          ) {
            recoveryHighlight = {
              detail: `${nextPendingFollowUp.title} 일정이 지금 진행 중입니다. 끝나기 전에 완료 여부를 확인하십시오.`,
              label: "회복 진행 중",
              tone: "active"
            };
          } else if (
            nextPendingFollowUp &&
            currentMinute !== null &&
            nextPendingFollowUp.startMinute >= resolvedCurrentMinute &&
            nextPendingFollowUp.startMinute - resolvedCurrentMinute <= 60
          ) {
            recoveryHighlight = {
              detail: `${describeMinute(nextPendingFollowUp.startMinute)}에 다시 지정한 일정이 곧 시작됩니다.`,
              label: "다시 지정 곧 시작",
              tone: "watch"
            };
          } else if (nextPendingFollowUp) {
            recoveryHighlight = {
              detail: `${describeMinute(nextPendingFollowUp.startMinute)}에 ${nextPendingFollowUp.title} 일정으로 다시 지정돼 있습니다.`,
              label: "다시 지정됨",
              tone: "watch"
            };
          } else if (!nextPendingFollowUp && plan.rescheduleCount < 3) {
            recoveryHighlight = {
              detail: "오늘 남은 빈 시간에 다시 지정할 수 있습니다.",
              label: "다시 지정 다시 보기",
              tone: "watch"
            };
          }
        }

        return {
          canToggleStatus,
          canReschedule: canReschedulePlan(plan),
          isCurrent: current,
          plan,
          recoveryBadges,
          recoveryHighlight,
          reflectionPreview: buildReflectionPreview(plan.reflectionNote),
          statusLabel:
            plan.status === "done"
              ? labelSettings.statusLabels.done
              : plan.status === "missed"
                ? labelSettings.statusLabels.missed
                : current
                  ? labelSettings.statusLabels.current
                  : labelSettings.statusLabels.pending,
          timeText: `${describeMinute(plan.startMinute)} - ${describeMinute(plan.endMinute)}`
        };
      }),
    [currentMinute, labelSettings.statusLabels, resolvedCurrentMinute, sortedPlans]
  );
  const currentPlanTimeText = currentPlan
    ? `${describeMinute(currentPlan.startMinute)} - ${describeMinute(currentPlan.endMinute)}`
    : currentMinute === null
      ? "현재 시간을 동기화하고 있습니다."
      : "현재 시간대에 등록된 계획이 없습니다.";
  const reminderTimeText = activeReminder
    ? `${describeMinute(activeReminder.startMinute)} - ${describeMinute(activeReminder.endMinute)}`
    : null;
  const canCompleteActiveReminder =
    activeReminder !== null &&
    currentMinute !== null &&
    currentMinute >= activeReminder.startMinute;
  const composerTitle =
    plannerState.recoveryMode === "reschedule"
      ? "다시 지정"
      : plannerState.editingPlanId
        ? "계획 수정"
        : "계획 등록";
  const submitButtonLabel =
    plannerState.recoveryMode === "reschedule"
      ? "다시 지정 저장"
      : plannerState.editingPlanId
        ? "계획 저장"
        : "계획 추가";
  const listCurrentTimeText =
    currentMinute === null ? "시간 동기화 중" : `${describeMinute(resolvedCurrentMinute)} 기준`;
  const recoveryPlan =
    plannerState.recoveryPlanId === null
      ? null
      : sortedPlans.find((plan) => plan.id === plannerState.recoveryPlanId) ?? null;

  useEffect(() => {
    if (currentMinute === null) {
      return;
    }

    plannerState.syncPlanStatuses(currentMinute);
  }, [currentMinute, plannerState]);

  useEffect(() => {
    if (currentMinute === null) {
      return;
    }

    void reminderProvider.sync(sortedPlans, timeSource.now());
  }, [currentMinute, reminderProvider, sortedPlans, timeSource]);

  useEffect(() => {
    if (!activeReminder) {
      return;
    }

    const reminderKey = `${activeReminder.id}:${activeReminder.startMinute}`;

    if (lastShownReminderKeyRef.current === reminderKey) {
      return;
    }

    lastShownReminderKeyRef.current = reminderKey;
    setReminderObservations((currentObservations) => {
      const nextObservations = appendReminderObservation({
        currentMinute,
        plan: activeReminder,
        time: timeSource.now(),
        type: "shown"
      });

      return nextObservations.length === currentObservations.length &&
        nextObservations.at(-1)?.id === currentObservations.at(-1)?.id
        ? currentObservations
        : nextObservations;
    });
  }, [activeReminder, currentMinute, timeSource]);

  useEffect(() => {
    const nextRecoveryKeys: Record<string, string> = {};

    planItems.forEach((item) => {
      if (!item.recoveryHighlight) {
        return;
      }

      const observationType = getRecoveryHighlightObservationType(item.recoveryHighlight.label);
      const nextKey = `${observationType}:${currentMinute ?? "unknown"}`;
      nextRecoveryKeys[item.plan.id] = nextKey;

      if (lastRecoveryHighlightKeyRef.current[item.plan.id] === nextKey) {
        return;
      }

      lastRecoveryHighlightKeyRef.current[item.plan.id] = nextKey;
      setRecoveryHighlightObservations((currentObservations) =>
        appendRecoveryHighlightObservation({
          currentMinute,
          plan: item.plan,
          time: timeSource.now(),
          type: observationType
        })
      );
    });

    lastRecoveryHighlightKeyRef.current = nextRecoveryKeys;
  }, [currentMinute, planItems, timeSource]);

  function togglePlanStatus(planId: string) {
    const plan = sortedPlans.find((item) => item.id === planId);

    if (!plan || !canTogglePlanStatus(plan)) {
      return;
    }

    plannerState.togglePlanStatus(planId);

    dismissReminder(plan);

    if (activeReminder?.id === plan.id && plan.status === "pending") {
      setReminderObservations(
        appendReminderObservation({
          currentMinute,
          plan,
          time: timeSource.now(),
          type: "completed"
        })
      );
    }

    void reminderProvider.cancel(planId);
  }

  function deletePlan(planId: string) {
    plannerState.deletePlan(planId);
    const plan = sortedPlans.find((item) => item.id === planId);

    if (plan) {
      dismissReminder(plan);
    }
    void reminderProvider.cancel(planId);
  }

  function dismissActiveReminder(planId: string) {
    const plan = sortedPlans.find((item) => item.id === planId);

    if (plan) {
      dismissReminder(plan);
      setReminderObservations(
        appendReminderObservation({
          currentMinute,
          plan,
          time: timeSource.now(),
          type: "dismissed"
        })
      );
    }
    void reminderProvider.cancel(planId);
  }

  function startReflection(plan: DailyPlan) {
    plannerState.startReflection(plan);
  }

  function startRescheduling(plan: DailyPlan) {
    const result = plannerState.startRescheduling(plan, currentMinute);

    if (result === "unavailable") {
      setRecoveryHighlightObservations((currentObservations) =>
        appendRecoveryHighlightObservation({
          currentMinute,
          plan,
          time: timeSource.now(),
          type: "reschedule_unavailable"
        })
      );
    }
  }

  const reminderObservationItems = useMemo(
    () =>
      [...reminderObservations]
        .reverse()
        .slice(0, 5)
        .map((item) => ({
          ...item,
          label:
            item.type === "shown"
              ? "배너 표시"
              : item.type === "dismissed"
                ? "배너 닫기"
                : "리마인드에서 완료",
          timeText: `${describeMinute(item.startMinute)} 시작`,
          observedMinuteText:
            item.currentMinute === null ? "시간 미확인" : `${describeMinute(item.currentMinute)} 감지`
        })),
    [reminderObservations]
  );
  const reminderObservationWindowText = useMemo(() => {
    if (reminderObservations.length === 0) {
      return "아직 관찰 기간이 없습니다.";
    }

    const firstObservation = reminderObservations[0];
    const lastObservation = reminderObservations.at(-1);

    if (!firstObservation || !lastObservation) {
      return "아직 관찰 기간이 없습니다.";
    }

    const firstTime = new Date(firstObservation.occurredAt);
    const lastTime = new Date(lastObservation.occurredAt);
    const format = (value: Date) =>
      `${String(value.getMonth() + 1).padStart(2, "0")}/${String(value.getDate()).padStart(2, "0")} ${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;

    return `${format(firstTime)} ~ ${format(lastTime)}`;
  }, [reminderObservations]);
  const reminderObservationSummaryItems = useMemo<ReminderObservationSummaryItem[]>(() => {
    const shownCount = reminderObservations.filter((item) => item.type === "shown").length;
    const dismissedCount = reminderObservations.filter((item) => item.type === "dismissed").length;
    const completedCount = reminderObservations.filter((item) => item.type === "completed").length;
    const completionRate =
      shownCount === 0 ? "0%" : `${Math.round((completedCount / shownCount) * 100)}%`;
    const dismissRate =
      shownCount === 0 ? "0%" : `${Math.round((dismissedCount / shownCount) * 100)}%`;

    return [
      { label: "표시", value: `${shownCount}회` },
      { label: "닫기", value: `${dismissedCount}회` },
      { label: "완료", value: `${completedCount}회` },
      { label: "닫기 비율", value: dismissRate },
      { label: "완료 전환율", value: completionRate }
    ];
  }, [reminderObservations]);
  const reminderPolicyStatus = useMemo<ReminderPolicyStatus>(() => {
    const shownCount = reminderObservations.filter((item) => item.type === "shown").length;
    const dismissedCount = reminderObservations.filter((item) => item.type === "dismissed").length;
    const completedCount = reminderObservations.filter((item) => item.type === "completed").length;
    const dismissRate = shownCount === 0 ? 0 : dismissedCount / shownCount;

    if (shownCount < 3) {
      return {
        detail: "표본이 아직 적습니다. 최소 3회 이상 표시된 뒤 다시 판단하십시오.",
        label: "관찰 더 필요",
        tone: "watch"
      };
    }

    if (dismissedCount > completedCount && dismissRate >= 0.5) {
      return {
        detail: "닫기 비율이 높습니다. 시간 창을 더 늦추거나 배너 표현을 낮출 후보입니다.",
        label: "조정 검토",
        tone: "review"
      };
    }

    return {
      detail: "완료 전환이 닫기보다 유지됩니다. 현재 시간 창은 우선 유지해도 됩니다.",
      label: "우선 유지",
      tone: "hold"
    };
  }, [reminderObservations]);
  const reminderObservationHint = useMemo(() => {
    const shownCount = reminderObservations.filter((item) => item.type === "shown").length;
    const dismissedCount = reminderObservations.filter((item) => item.type === "dismissed").length;
    const completedCount = reminderObservations.filter((item) => item.type === "completed").length;

    if (shownCount === 0) {
      return "아직 관찰 기록이 없어 정책 판단을 내리기 이릅니다.";
    }

    if (dismissedCount > completedCount && dismissedCount >= 2) {
      return "닫기가 완료보다 많습니다. 현재 시간 창이 이르거나 배너가 거슬릴 가능성을 먼저 보십시오.";
    }

    if (completedCount >= dismissedCount && completedCount >= 2) {
      return "리마인드에서 완료 전환이 유지됩니다. 현재 시간 창은 우선 유지해도 됩니다.";
    }

    return "기록이 더 필요합니다. 표시 후 실제 완료와 닫기 비율을 조금 더 모아 보십시오.";
  }, [reminderObservations]);
  const recoveryHighlightObservationItems = useMemo(
    () =>
      [...recoveryHighlightObservations]
        .reverse()
        .slice(0, 5)
        .map((item) => ({
          ...item,
          label:
            item.type === "reflection_prompt"
              ? "회고 다시 보기"
              : item.type === "reschedule_prompt"
                ? "다시 지정 다시 보기"
                : item.type === "reschedule_unavailable"
                  ? "다시 지정 불가"
                : item.type === "followup_scheduled"
                  ? "다시 지정됨"
                : item.type === "followup_soon"
                  ? "다시 지정 곧 시작"
                  : "회복 진행 중",
          observedMinuteText:
            item.currentMinute === null ? "시간 미확인" : `${describeMinute(item.currentMinute)} 감지`
        })),
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationSummaryItems = useMemo<RecoveryObservationSummaryItem[]>(
    () => {
      const reflectionPromptCount = recoveryHighlightObservations.filter(
        (item) => item.type === "reflection_prompt"
      ).length;
      const reschedulePromptCount = recoveryHighlightObservations.filter(
        (item) => item.type === "reschedule_prompt"
      ).length;
      const rescheduleUnavailableCount = recoveryHighlightObservations.filter(
        (item) => item.type === "reschedule_unavailable"
      ).length;
      const followupScheduledCount = recoveryHighlightObservations.filter(
        (item) => item.type === "followup_scheduled"
      ).length;
      const followupSoonCount = recoveryHighlightObservations.filter(
        (item) => item.type === "followup_soon"
      ).length;
      const followupActiveCount = recoveryHighlightObservations.filter(
        (item) => item.type === "followup_active"
      ).length;

      return [
        { label: "회고 다시 보기", value: `${reflectionPromptCount}회` },
        { label: "다시 지정 다시 보기", value: `${reschedulePromptCount}회` },
        { label: "다시 지정 불가", value: `${rescheduleUnavailableCount}회` },
        { label: "다시 지정됨", value: `${followupScheduledCount}회` },
        { label: "다시 지정 곧 시작", value: `${followupSoonCount}회` },
        { label: "회복 진행 중", value: `${followupActiveCount}회` }
      ];
    },
    [recoveryHighlightObservations]
  );
  const recoveryHighlightObservationWindowText = useMemo(() => {
    if (recoveryHighlightObservations.length === 0) {
      return "아직 관찰 기간이 없습니다.";
    }

    const firstObservation = recoveryHighlightObservations[0];
    const lastObservation = recoveryHighlightObservations.at(-1);

    if (!firstObservation || !lastObservation) {
      return "아직 관찰 기간이 없습니다.";
    }

    const firstTime = new Date(firstObservation.occurredAt);
    const lastTime = new Date(lastObservation.occurredAt);
    const format = (value: Date) =>
      `${String(value.getMonth() + 1).padStart(2, "0")}/${String(value.getDate()).padStart(2, "0")} ${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;

    return `${format(firstTime)} ~ ${format(lastTime)}`;
  }, [recoveryHighlightObservations]);
  const recoveryHighlightObservationPolicyStatus = useMemo<RecoveryObservationPolicyStatus>(() => {
    const reflectionPromptCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reflection_prompt"
    ).length;
    const reschedulePromptCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reschedule_prompt"
    ).length;
    const rescheduleUnavailableCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reschedule_unavailable"
    ).length;
    const followupScheduledCount = recoveryHighlightObservations.filter(
      (item) => item.type === "followup_scheduled"
    ).length;
    const followupSoonCount = recoveryHighlightObservations.filter(
      (item) => item.type === "followup_soon"
    ).length;
    const followupActiveCount = recoveryHighlightObservations.filter(
      (item) => item.type === "followup_active"
    ).length;
    const totalCount = recoveryHighlightObservations.length;

    if (totalCount < 3) {
      return {
        detail: "표본이 아직 적습니다. 재강조가 반복되는지 조금 더 관찰하십시오.",
        label: "관찰 더 필요",
        tone: "watch"
      };
    }

    if (
      reflectionPromptCount >= 3 ||
      followupSoonCount >= 3 ||
      rescheduleUnavailableCount >= 2
    ) {
      return {
        detail: "같은 회복 신호나 다시 지정 실패가 반복됩니다. 노출 시점, 강조 강도, 또는 재지정 정책을 조정할 후보입니다.",
        label: "조정 검토",
        tone: "review"
      };
    }

    if (
      followupActiveCount > 0 ||
      (reschedulePromptCount <= 1 && followupSoonCount <= 1 && followupScheduledCount <= 2)
    ) {
      return {
        detail: "재강조가 회복 흐름을 다시 잡아주는 수준에 머뭅니다. 현재 규칙은 우선 유지해도 됩니다.",
        label: "우선 유지",
        tone: "hold"
      };
    }

    return {
      detail: "재강조가 쌓이고 있지만 아직 과하다고 단정하기는 어렵습니다. 실제 사용 로그를 더 보십시오.",
      label: "관찰 더 필요",
      tone: "watch"
    };
  }, [recoveryHighlightObservations]);
  const recoveryHighlightObservationHint = useMemo(() => {
    const reflectionPromptCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reflection_prompt"
    ).length;
    const rescheduleUnavailableCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reschedule_unavailable"
    ).length;
    const followupSoonCount = recoveryHighlightObservations.filter(
      (item) => item.type === "followup_soon"
    ).length;

    if (recoveryHighlightObservations.length === 0) {
      return "아직 회복 재강조 기록이 없어 정책 판단을 내리기 이릅니다.";
    }

    if (rescheduleUnavailableCount >= 2) {
      return "연속 빈 시간이 없어 다시 지정이 막히는 경우가 반복됩니다. 자동 축약 허용이나 수동 단축 안내가 필요한지 검토하십시오.";
    }

    if (reflectionPromptCount >= 2) {
      return "회고 다시 보기가 반복됩니다. 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 보십시오.";
    }

    if (followupSoonCount >= 2) {
      return "임박한 후속 일정 신호가 반복됩니다. 60분 기준이 이른지 먼저 확인하십시오.";
    }

    return "기록이 더 필요합니다. 어떤 재강조가 가장 자주 쌓이는지 조금 더 보십시오.";
  }, [recoveryHighlightObservations]);
  const recoveryHighlightObservationRecommendation = useMemo(() => {
    const reflectionPromptCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reflection_prompt"
    ).length;
    const rescheduleUnavailableCount = recoveryHighlightObservations.filter(
      (item) => item.type === "reschedule_unavailable"
    ).length;
    const followupSoonCount = recoveryHighlightObservations.filter(
      (item) => item.type === "followup_soon"
    ).length;

    if (rescheduleUnavailableCount >= 2) {
      return "추천: 자동 축약 허용 여부 또는 수동 단축 입력 안내를 먼저 검토하십시오.";
    }

    if (reflectionPromptCount >= 2) {
      return "추천: 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 먼저 검토하십시오.";
    }

    if (followupSoonCount >= 2) {
      return "추천: `다시 지정 곧 시작` 기준 60분을 더 짧게 줄일지 먼저 검토하십시오.";
    }

    return "추천: 지금은 규칙을 바꾸기보다 실제 사용 로그를 조금 더 모으십시오.";
  }, [recoveryHighlightObservations]);

  function clearObservationLog() {
    clearReminderObservations();
    setReminderObservations([]);
  }

  function clearRecoveryObservationLog() {
    clearRecoveryHighlightObservations();
    setRecoveryHighlightObservations([]);
  }

  return {
    ...plannerState,
    activeReminder,
    clearObservationLog,
    canCompleteActiveReminder,
    composerTitle,
    currentMinute,
    currentPlan,
    currentPlanTimeText,
    deletePlan,
    dismissActiveReminder,
    labelSettings,
    listCurrentTimeText,
    planItems,
    recoveryPlan,
    recoveryHighlightObservationHint,
    recoveryHighlightObservationItems,
    recoveryHighlightObservationPolicyStatus,
    recoveryHighlightObservationRecommendation,
    recoveryHighlightObservationSummaryItems,
    recoveryHighlightObservationWindowText,
    reminderObservationHint,
    reminderObservationItems,
    reminderObservationWindowText,
    reminderObservationSummaryItems,
    reminderPolicyStatus,
    resolvedCurrentMinute,
    reminderTimeText,
    resetLabelSettings,
    clearRecoveryObservationLog,
    saveReflection: plannerState.saveReflection,
    sortedPlans,
    startReflection,
    startRescheduling,
    submitButtonLabel,
    summary,
    togglePlanStatus,
    saveLabelSettings,
  };
}
