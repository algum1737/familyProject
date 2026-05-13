"use client";

import { useEffect, useRef, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";
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
import type { TimeSource } from "@/providers/time/time-source";

type RecoveryHighlightItem = {
  plan: DailyPlan;
  recoveryHighlightLabel: string | null;
};

type UsePlannerObservationLogOptions = {
  activeEndRecoveryReminder: DailyPlan | null;
  activeReminder: DailyPlan | null;
  currentMinute: number | null;
  recoveryHighlightItems: RecoveryHighlightItem[];
  timeSource: TimeSource;
};

function getRecoveryHighlightObservationType(
  label: string
): RecoveryHighlightObservationType {
  switch (label) {
    case "회고 다시 보기":
      return "reflection_prompt";
    case "종료 전 확인":
      return "end_recovery_prompt";
    case "계속 진행":
      return "end_recovery_continue";
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

export function usePlannerObservationLog({
  activeEndRecoveryReminder,
  activeReminder,
  currentMinute,
  recoveryHighlightItems,
  timeSource
}: UsePlannerObservationLogOptions) {
  const [recoveryHighlightObservations, setRecoveryHighlightObservations] = useState<
    RecoveryHighlightObservation[]
  >(() => loadRecoveryHighlightObservations());
  const [reminderObservations, setReminderObservations] = useState<ReminderObservation[]>(() =>
    loadReminderObservations()
  );
  const lastShownReminderKeyRef = useRef<string | null>(null);
  const lastShownEndRecoveryKeyRef = useRef<string | null>(null);
  const lastRecoveryHighlightKeyRef = useRef<Record<string, string>>({});

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
    if (!activeEndRecoveryReminder) {
      return;
    }

    const recoveryKey = `${activeEndRecoveryReminder.id}:${activeEndRecoveryReminder.endMinute}`;

    if (lastShownEndRecoveryKeyRef.current === recoveryKey) {
      return;
    }

    lastShownEndRecoveryKeyRef.current = recoveryKey;
    setRecoveryHighlightObservations((currentObservations) =>
      appendRecoveryHighlightObservation({
        currentMinute,
        plan: activeEndRecoveryReminder,
        time: timeSource.now(),
        type: "end_recovery_prompt"
      })
    );
  }, [activeEndRecoveryReminder, currentMinute, timeSource]);

  useEffect(() => {
    const nextRecoveryKeys: Record<string, string> = {};

    recoveryHighlightItems.forEach((item) => {
      if (!item.recoveryHighlightLabel) {
        return;
      }

      const observationType = getRecoveryHighlightObservationType(item.recoveryHighlightLabel);
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
  }, [currentMinute, recoveryHighlightItems, timeSource]);

  function recordReminderCompleted(plan: DailyPlan) {
    setReminderObservations(
      appendReminderObservation({
        currentMinute,
        plan,
        time: timeSource.now(),
        type: "completed"
      })
    );
  }

  function recordReminderDismissed(plan: DailyPlan) {
    setReminderObservations(
      appendReminderObservation({
        currentMinute,
        plan,
        time: timeSource.now(),
        type: "dismissed"
      })
    );
  }

  function recordEndRecoveryContinue(plan: DailyPlan) {
    setRecoveryHighlightObservations((currentObservations) =>
      appendRecoveryHighlightObservation({
        currentMinute,
        plan,
        time: timeSource.now(),
        type: "end_recovery_continue"
      })
    );
  }

  function recordRescheduleUnavailable(plan: DailyPlan) {
    setRecoveryHighlightObservations((currentObservations) =>
      appendRecoveryHighlightObservation({
        currentMinute,
        plan,
        time: timeSource.now(),
        type: "reschedule_unavailable"
      })
    );
  }

  function clearReminderObservationLog() {
    clearReminderObservations();
    setReminderObservations([]);
  }

  function clearRecoveryObservationLog() {
    clearRecoveryHighlightObservations();
    setRecoveryHighlightObservations([]);
  }

  return {
    clearRecoveryObservationLog,
    clearReminderObservationLog,
    recordEndRecoveryContinue,
    recordReminderCompleted,
    recordReminderDismissed,
    recordRescheduleUnavailable,
    recoveryHighlightObservations,
    reminderObservations
  };
}
