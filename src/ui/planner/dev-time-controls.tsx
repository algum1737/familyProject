"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyPlan } from "@/domains/plans/types";
import { describeMinute } from "@/domains/plans/service/planner";
import type { MutableTimeSource } from "@/providers/time/time-source";

function toDateTimeInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateTimeInputValue(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildDateAtMinute(baseDate: Date, minute: number) {
  const clampedMinute = Math.max(0, Math.min(23 * 60 + 59, minute));
  const next = new Date(baseDate);

  next.setHours(0, 0, 0, 0);
  next.setMinutes(clampedMinute);

  return next;
}

type DevTimeControlsProps = {
  createObservationSamplePlan: () => DailyPlan | null;
  currentMinute: number | null;
  currentPlan: DailyPlan | null;
  sortedPlans: DailyPlan[];
  timeSource: MutableTimeSource;
};

export function DevTimeControls({
  createObservationSamplePlan,
  currentMinute,
  currentPlan,
  sortedPlans,
  timeSource
}: DevTimeControlsProps) {
  const [draftValue, setDraftValue] = useState(() => toDateTimeInputValue(timeSource.now()));
  const override = timeSource.getOverride();
  const now = timeSource.now();
  const currentPendingPlan = currentPlan?.status === "pending" ? currentPlan : null;
  const nextPendingPlan = useMemo(
    () =>
      sortedPlans.find(
        (plan) =>
          plan.status === "pending" &&
          (currentMinute === null || plan.startMinute >= currentMinute)
      ) ?? sortedPlans.find((plan) => plan.status === "pending") ?? null,
    [currentMinute, sortedPlans]
  );

  useEffect(() => {
    setDraftValue(toDateTimeInputValue(timeSource.now()));
  }, [override, timeSource]);

  const quickActions = [
    nextPendingPlan
      ? {
          label: "다음 시작 5분 전",
          detail: `${nextPendingPlan.title} ${describeMinute(nextPendingPlan.startMinute)} 기준`,
          minute: nextPendingPlan.startMinute - 5
        }
      : null,
    nextPendingPlan
      ? {
          label: "다음 시작 직후",
          detail: `${nextPendingPlan.title} ${describeMinute(nextPendingPlan.startMinute + 1)} 기준`,
          minute: nextPendingPlan.startMinute + 1
        }
      : null,
    currentPendingPlan
      ? {
          label: "현재 종료 5분 전",
          detail: `${currentPendingPlan.title} ${describeMinute(currentPendingPlan.endMinute - 5)} 기준`,
          minute: currentPendingPlan.endMinute - 5
        }
      : null,
    currentPendingPlan
      ? {
          label: "현재 종료 직후",
          detail: `${currentPendingPlan.title} ${describeMinute(currentPendingPlan.endMinute + 1)} 기준`,
          minute: currentPendingPlan.endMinute + 1
        }
      : null
  ].filter((item): item is { detail: string; label: string; minute: number } => item !== null);

  function applyDraftValue() {
    const parsed = parseDateTimeInputValue(draftValue);

    if (!parsed) {
      return;
    }

    timeSource.setOverride(parsed);
  }

  return (
    <section className="dev-time-panel" data-testid="dev-time-panel">
      <div className="dev-time-head">
        <div>
          <p className="eyebrow">Observation Harness</p>
          <h2>관찰 시간 조정</h2>
        </div>
        <span className={override ? "dev-time-badge dev-time-badge-active" : "dev-time-badge"}>
          {override ? "테스트 시간 사용 중" : "시스템 현재 시간"}
        </span>
      </div>
      <p className="dev-time-note">
        시작 5분 전, 시작 직후, 종료 직전 같은 관찰 표본을 빠르게 반복 재현할 때만 사용합니다.
      </p>
      <div className="dev-time-controls">
        <label className="field">
          <span>기준 시각</span>
          <input
            aria-label="관찰 기준 시각"
            onChange={(event) => setDraftValue(event.target.value)}
            type="datetime-local"
            value={draftValue}
          />
        </label>
      <div className="dev-time-actions">
        <button className="submit-button" onClick={applyDraftValue} type="button">
          시간 적용
        </button>
        <button
          className="dev-time-quick-button"
          onClick={() => {
            createObservationSamplePlan();
          }}
          type="button"
        >
          <strong>표본용 예정 일정 추가</strong>
          <span>현재 시각 이후 첫 30분 빈 슬롯을 관찰용 pending 일정으로 채웁니다.</span>
        </button>
        <button
          className="cancel-button"
          onClick={() => {
            timeSource.clearOverride();
            setDraftValue(toDateTimeInputValue(new Date()));
            }}
            type="button"
          >
            현재 시각 복귀
          </button>
        </div>
      </div>
      {quickActions.length > 0 ? (
        <div className="dev-time-quick-actions">
          {quickActions.map((action) => (
            <button
              className="dev-time-quick-button"
              key={action.label}
              onClick={() => timeSource.setOverride(buildDateAtMinute(now, action.minute))}
              type="button"
            >
              <strong>{action.label}</strong>
              <span>{action.detail}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="dev-time-note">현재 빠르게 점프할 pending 일정이 없습니다.</p>
      )}
    </section>
  );
}
