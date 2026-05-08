import { useEffect, useMemo, useState } from "react";

import {
  markMissedPlans,
  minuteToTimeString,
  normalizeEndMinute,
  PLAN_TITLE_MAX_LENGTH,
  sortPlans,
  timeStringToMinute,
  validatePlanTitle
} from "../../../../src/domains/plans/service/planner";
import type { DailyPlan } from "../../../../src/domains/plans/types";
import {
  savePlannerReflection,
  submitPlannerPlan,
  togglePlannerPlanStatus
} from "../../../../src/features/planner/core/planner-state-transitions";
import type { ExpoPlansStore } from "../providers/plans/expo-async-plans-store";
import type { ExpoPlannerRecordsStore } from "../providers/plans/expo-async-planner-records-store";

export type ExpoPlanFormState = {
  color: string;
  endTime: string;
  startTime: string;
  title: string;
};

export type ExpoPlanFormField = "title" | "startTime" | "endTime";
export type ExpoPlanFormErrors = Partial<Record<ExpoPlanFormField, string>>;

type RecoveryMode = "reflection" | "reschedule" | null;

export const defaultExpoPlanFormState: ExpoPlanFormState = {
  color: "#f07c61",
  endTime: "09:00",
  startTime: "08:00",
  title: ""
};

export function createExpoPlanId() {
  return `expo-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function stripDate<T extends DailyPlan & { date?: string }>(plans: T[]): DailyPlan[] {
  return plans.map(({ date: _date, ...plan }) => plan);
}

export function useExpoPlannerState(options: {
  currentDate: string;
  currentMinute: number;
  initialPlans: DailyPlan[];
  plansStore: ExpoPlansStore;
  recordsStore: ExpoPlannerRecordsStore;
}) {
  const { currentDate, currentMinute, initialPlans, plansStore, recordsStore } = options;
  const [plans, setPlans] = useState<DailyPlan[]>(() => sortPlans(initialPlans));
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpoPlanFormState>(defaultExpoPlanFormState);
  const [fieldErrors, setFieldErrors] = useState<ExpoPlanFormErrors>({});
  const [focusField, setFocusField] = useState<ExpoPlanFormField | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>(null);
  const [recoveryPlanId, setRecoveryPlanId] = useState<string | null>(null);
  const [reflectionNoteDraft, setReflectionNoteDraft] = useState("");
  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>([]);
  const [dismissedEndRecoveryIds, setDismissedEndRecoveryIds] = useState<string[]>([]);

  useEffect(() => {
    setPlans(sortPlans(initialPlans));
  }, [initialPlans]);

  useEffect(() => {
    const nextPlans = markMissedPlans(plans, currentMinute);

    if (JSON.stringify(nextPlans) !== JSON.stringify(plans)) {
      setPlans(nextPlans);
    }
  }, [currentMinute, plans]);

  useEffect(() => {
    void plansStore.save(plans);
    void recordsStore.saveForDate(
      currentDate,
      plans.map((plan) => ({
        ...plan,
        date: currentDate
      }))
    );
  }, [currentDate, plans, plansStore, recordsStore]);

  const recoveryPlan = useMemo(
    () => (recoveryPlanId ? plans.find((plan) => plan.id === recoveryPlanId) ?? null : null),
    [plans, recoveryPlanId]
  );

  function updateForm(values: Partial<ExpoPlanFormState>) {
    setForm((current) => ({
      ...current,
      ...values
    }));
    setFieldErrors((current) => {
      const next = { ...current };

      for (const key of Object.keys(values) as ExpoPlanFormField[]) {
        delete next[key];
      }

      return next;
    });
  }

  function requestFieldFocus(field: ExpoPlanFormField) {
    setFocusField(field);
    setFocusRequest((current) => current + 1);
  }

  function getTimeFieldError(label: "시작 시간" | "종료 시간", value: string) {
    const normalized = value.trim();

    if (!normalized) {
      return `${label}을 입력해 주십시오.`;
    }

    try {
      timeStringToMinute(normalized);
      return null;
    } catch (parseError) {
      const message =
        parseError instanceof Error ? parseError.message : "시간 형식을 확인해 주십시오.";

      return `${label} '${normalized}' 입력값을 확인해 주십시오. ${message}`;
    }
  }

  function submitPlan() {
    const nextFieldErrors: ExpoPlanFormErrors = {};

    try {
      validatePlanTitle(form.title);
    } catch (titleError) {
      nextFieldErrors.title =
        titleError instanceof Error ? titleError.message : "제목을 확인해 주십시오.";
    }

    const startTimeError = getTimeFieldError("시작 시간", form.startTime);
    if (startTimeError) {
      nextFieldErrors.startTime = startTimeError;
    }

    const endTimeError = getTimeFieldError("종료 시간", form.endTime);
    if (endTimeError) {
      nextFieldErrors.endTime = endTimeError;
    }

    if (!startTimeError && !endTimeError) {
      try {
        const startMinute = timeStringToMinute(form.startTime);
        normalizeEndMinute(startMinute, timeStringToMinute(form.endTime));
      } catch (normalizeError) {
        nextFieldErrors.endTime =
          normalizeError instanceof Error
            ? normalizeError.message
            : "종료 시간을 확인해 주십시오.";
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError(null);

      const firstField = (["title", "startTime", "endTime"] as ExpoPlanFormField[]).find(
        (field) => nextFieldErrors[field]
      );

      if (firstField) {
        requestFieldFocus(firstField);
      }

      return false;
    }

    try {
      setPlans(
        submitPlannerPlan({
          createId: createExpoPlanId,
          editingPlanId,
          form,
          plans,
          recoveryMode,
          recoveryPlanId
        })
      );
      setEditingPlanId(null);
      setRecoveryMode(null);
      setRecoveryPlanId(null);
      setForm(defaultExpoPlanFormState);
      setFieldErrors({});
      setReflectionNoteDraft("");
      setError(null);
      return true;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "계획을 저장하지 못했습니다."
      );
      return false;
    }
  }

  function togglePlanStatus(planId: string) {
    setPlans((current) => togglePlannerPlanStatus(current, planId));
  }

  function deletePlan(planId: string) {
    setPlans((current) => current.filter((plan) => plan.id !== planId));

    if (editingPlanId === planId) {
      setEditingPlanId(null);
      setForm(defaultExpoPlanFormState);
    }

    if (recoveryPlanId === planId) {
      setRecoveryMode(null);
      setRecoveryPlanId(null);
      setReflectionNoteDraft("");
    }

    setDismissedReminderIds((current) => current.filter((id) => id !== planId));
    setDismissedEndRecoveryIds((current) => current.filter((id) => id !== planId));
    setError(null);
  }

  function markReminderDismissed(planId: string) {
    setDismissedReminderIds((current) =>
      current.includes(planId) ? current : [...current, planId]
    );
  }

  function markEndRecoveryDismissed(planId: string) {
    setDismissedEndRecoveryIds((current) =>
      current.includes(planId) ? current : [...current, planId]
    );
  }

  function saveReflection() {
    if (!recoveryPlanId) {
      return;
    }

    setPlans((current) =>
      savePlannerReflection(current, recoveryPlanId, reflectionNoteDraft)
    );
    setRecoveryMode(null);
    setRecoveryPlanId(null);
    setReflectionNoteDraft("");
    setError(null);
  }

  function seedFromRecords(nextPlans: DailyPlan[]) {
    setPlans(sortPlans(stripDate(nextPlans)));
  }

  return {
    dismissedEndRecoveryIds,
    dismissedReminderIds,
    deletePlan,
    editingPlanId,
    error,
    fieldErrors,
    focusField,
    focusRequest,
    form,
    currentMinute,
    planTitleMaxLength: PLAN_TITLE_MAX_LENGTH,
    plans,
    recoveryMode,
    recoveryPlan,
    recordsStore,
    reflectionNoteDraft,
    saveReflection,
    seedFromRecords,
    setDismissedEndRecoveryIds,
    setDismissedReminderIds,
    setEditingPlanId,
    setError,
    setForm,
    setPlans,
    setRecoveryMode,
    setRecoveryPlanId,
    setReflectionNoteDraft,
    markEndRecoveryDismissed,
    markReminderDismissed,
    submitPlan,
    togglePlanStatus,
    updateForm
  };
}
