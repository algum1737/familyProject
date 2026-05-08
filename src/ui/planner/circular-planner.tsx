"use client";

import { FormEvent, useEffect, useState, useRef } from "react";

import {
  createSectorPath,
  formatSectorLabel,
  getReadableTextColor,
  getSectorLabelFontSize,
  getSectorLabelRotation,
  isCurrentPlan,
  minuteToAngle,
  minuteToTimeString,
  PLAN_TITLE_MAX_LENGTH,
  polarToCartesian
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import {
  PLANNER_LABEL_MAX_LENGTH,
  sanitizePlannerLabelSettings,
  type PlannerLabelSettings,
  type PlannerLabelSettingsStore
} from "@/providers/labels/planner-label-settings";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import { isMutableTimeSource, type TimeSource } from "@/providers/time/time-source";
import { PLAN_COLORS } from "@/ui/planner/planner-colors";
import { DevTimeControls } from "@/ui/planner/dev-time-controls";
import { usePlannerViewModel } from "@/ui/planner/use-planner-view-model";

const CENTER = 240;
const RADIUS = 180;
const SECTOR_RADIUS = 190;
const CURRENT_SECTOR_RADIUS = 198;
const CURRENT_SECTOR_HALO_RADIUS = 206;
const INACTIVE_SECTOR_OPACITY = 0.42;
const RESCHEDULE_UNAVAILABLE_MESSAGE =
  "오늘 남은 빈 시간에는 이 일정 길이 그대로 다시 지정할 수 없습니다.";

function getRecoveryObservationSummaryTestId(label: string) {
  switch (label) {
    case "회고 다시 보기":
      return "recovery-summary-reflection";
    case "종료 전 확인":
      return "recovery-summary-end-recovery";
    case "계속 진행":
      return "recovery-summary-end-recovery-continue";
    case "다시 지정 다시 보기":
      return "recovery-summary-reschedule";
    case "다시 지정 불가":
      return "recovery-summary-reschedule-unavailable";
    case "다시 지정됨":
      return "recovery-summary-followup-scheduled";
    case "다시 지정 곧 시작":
      return "recovery-summary-followup-soon";
    default:
      return "recovery-summary-followup-active";
  }
}

function getReminderObservationSummaryTestId(label: string) {
  switch (label) {
    case "표시":
      return "reminder-summary-shown";
    case "닫기":
      return "reminder-summary-dismissed";
    case "완료":
      return "reminder-summary-completed";
    case "닫기 비율":
      return "reminder-summary-dismiss-rate";
    default:
      return "reminder-summary-completion-rate";
  }
}

function buildLabelSettingsDraft(settings: PlannerLabelSettings): PlannerLabelSettings {
  return {
    actionLabels: {
      ...settings.actionLabels
    },
    statusLabels: {
      ...settings.statusLabels
    }
  };
}

function ClockFace() {
  const ticks = Array.from({ length: 24 }, (_, index) => index);
  const visibleHours = new Set([0, 3, 6, 9, 12, 15, 18, 21]);

  return (
    <>
      {ticks.map((hour) => {
        const angle = minuteToAngle(hour * 60);
        const outer = polarToCartesian(angle, RADIUS + 22);
        const inner = polarToCartesian(angle, RADIUS + 8);
        const labelPoint = polarToCartesian(angle, RADIUS + 45);
        const isMajorHour = visibleHours.has(hour);

        return (
          <g key={hour}>
            <line
              x1={CENTER + inner.x}
              y1={CENTER + inner.y}
              x2={CENTER + outer.x}
              y2={CENTER + outer.y}
              stroke="#d6d7dd"
              strokeWidth={isMajorHour ? 2.6 : 1.4}
            />
            {isMajorHour ? (
              <text
                x={CENTER + labelPoint.x}
                y={CENTER + labelPoint.y}
                className="planner-hour"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {hour}
              </text>
            ) : null}
          </g>
        );
      })}
      <g
        aria-hidden="true"
        className="planner-icon planner-icon-moon"
        transform={`translate(${CENTER + 25} ${CENTER - (RADIUS + 45)})`}
      >
        <circle cx="0" cy="0" fill="#f0bf3f" r="9.2" />
        <circle cx="-7.1" cy="-6.4" fill="#ffd76a" r="1.25" />
        <circle cx="-4" cy="-10" fill="#ffd76a" r="1" />
        <circle cx="-1.7" cy="-5.4" fill="#ffd76a" r="0.85" />
      </g>
      <g
        aria-hidden="true"
        className="planner-icon planner-icon-sun"
        transform={`translate(${CENTER + 31} ${CENTER + (RADIUS + 45)})`}
      >
        <circle cx="0" cy="0" fill="#f7b347" r="6.3" />
        {Array.from({ length: 8 }, (_, index) => {
          const rayAngle = (Math.PI / 4) * index;
          const innerX = Math.cos(rayAngle) * 9.2;
          const innerY = Math.sin(rayAngle) * 9.2;
          const outerX = Math.cos(rayAngle) * 13.8;
          const outerY = Math.sin(rayAngle) * 13.8;

          return (
            <line
              key={index}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
            />
          );
        })}
      </g>
    </>
  );
}

function PlanSegment({
  plan,
  currentMinute
}: {
  plan: DailyPlan;
  currentMinute: number;
}) {
  const current = isCurrentPlan(plan, currentMinute);
  const labelMinute = plan.startMinute + (plan.endMinute - plan.startMinute) / 2;
  const sectorRadius = current ? CURRENT_SECTOR_RADIUS : SECTOR_RADIUS;
  const labelPoint = polarToCartesian(minuteToAngle(labelMinute), sectorRadius * 0.63);
  const fontSize = getSectorLabelFontSize(plan);
  const label = formatSectorLabel(plan);
  const rotation = getSectorLabelRotation(labelMinute);

  return (
    <>
      {current ? (
        <path
          d={createSectorPath(
            plan.startMinute,
            plan.endMinute,
            CURRENT_SECTOR_HALO_RADIUS,
            CENTER,
            CENTER
          )}
          fill="#fff3ea"
          opacity="0.92"
        />
      ) : null}
      <path
        d={createSectorPath(plan.startMinute, plan.endMinute, sectorRadius, CENTER, CENTER)}
        fill={plan.color}
        opacity={current ? 1 : INACTIVE_SECTOR_OPACITY}
        stroke={current ? "#fffaf5" : "rgba(255,255,255,0.36)"}
        strokeLinejoin="round"
        strokeWidth={current ? 6 : 2}
      />
      <text
        x={CENTER + labelPoint.x}
        y={CENTER + labelPoint.y}
        className={current ? "planner-label planner-label-current" : "planner-label"}
        fill={current ? "#ffffff" : getReadableTextColor(plan.color)}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${rotation} ${CENTER + labelPoint.x} ${CENTER + labelPoint.y})`}
      >
        {label}
      </text>
    </>
  );
}

function CurrentHand({ currentMinute }: { currentMinute: number }) {
  const hand = polarToCartesian(minuteToAngle(currentMinute), CURRENT_SECTOR_RADIUS * 0.79);

  return (
    <>
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER + hand.x}
        y2={CENTER + hand.y}
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <circle cx={CENTER} cy={CENTER} fill="#ffffff" r="18" stroke="#d7d8de" strokeWidth="6" />
    </>
  );
}

type CircularPlannerProps = {
  labelSettingsStore: PlannerLabelSettingsStore;
  plansStore: PlansStore;
  reminderProvider: ReminderProvider;
  timeSource: TimeSource;
};

export function CircularPlanner({
  labelSettingsStore,
  plansStore,
  reminderProvider,
  timeSource
}: CircularPlannerProps) {
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [isLabelSettingsModalOpen, setIsLabelSettingsModalOpen] = useState(false);
  const {
    activeEndRecoveryReminder,
    activeReminder,
    cancelEditing,
    cancelRecovery,
    clearObservationLog,
    canCompleteActiveReminder,
    currentMinute,
    currentPlan,
    currentPlanTimeText,
    createObservationSamplePlan,
    composerTitle,
    deletePlan,
    dismissActiveEndRecoveryReminder,
    dismissActiveReminder,
    editingPlanId,
    endRecoveryReminderTimeText,
    error,
    form,
    isCurrentMinuteReady,
    labelSettings,
    listCurrentTimeText,
    planItems,
    clearRecoveryObservationLog,
    reflectionNoteDraft,
    recoveryMode,
    recoveryPlan,
    recoveryHighlightObservationHint,
    recoveryHighlightObservationItems,
    recoveryHighlightObservationPolicyStatus,
    recoveryHighlightObservationRecommendation,
    recoveryHighlightObservationSummaryItems,
    recoveryHighlightObservationWindowText,
    reminderObservationHint,
    reminderObservationItems,
    reminderObservationSummaryItems,
    reminderObservationWindowText,
    reminderPolicyStatus,
    reminderTimeText,
    resolvedCurrentMinute,
    resetLabelSettings,
    saveLabelSettings,
    saveReflection,
    setError,
    setReflectionNoteDraft,
    sortedPlans,
    startEditingPlan,
    startReflection,
    startRescheduling,
    submitPlan,
    submitButtonLabel,
    summary,
    togglePlanStatus,
    updateForm
  } = usePlannerViewModel({
    labelSettingsStore,
    plansStore,
    reminderProvider,
    timeSource
  });
  const [labelSettingsDraft, setLabelSettingsDraft] = useState<PlannerLabelSettings>(() =>
    buildLabelSettingsDraft(labelSettings)
  );

  useEffect(() => {
    if (!isLabelSettingsModalOpen) {
      setLabelSettingsDraft(buildLabelSettingsDraft(labelSettings));
    }
  }, [isLabelSettingsModalOpen, labelSettings]);

  function openCustomColorPicker() {
    const input = colorInputRef.current;

    if (!input) {
      return;
    }

    if ("showPicker" in HTMLInputElement.prototype) {
      input.showPicker();
      return;
    }

    input.click();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      submitPlan();
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message);
        return;
      }

      setError("계획을 저장하지 못했습니다.");
    }
  }

  function handleTogglePlanStatus(planId: string) {
    togglePlanStatus(planId);
  }

  function handleDeletePlan(planId: string) {
    deletePlan(planId);
  }

  function handleDismissReminder(planId: string) {
    dismissActiveReminder(planId);
  }

  function handleCancelComposer() {
    if (recoveryMode === "reschedule") {
      cancelRecovery();
      return;
    }

    cancelEditing();
  }

  function handleOpenLabelSettingsModal() {
    setLabelSettingsDraft(buildLabelSettingsDraft(labelSettings));
    setIsLabelSettingsModalOpen(true);
  }

  function handleCloseLabelSettingsModal() {
    setLabelSettingsDraft(buildLabelSettingsDraft(labelSettings));
    setIsLabelSettingsModalOpen(false);
  }

  function handleLabelDraftChange(
    group: "actionLabels" | "statusLabels",
    key: string,
    value: string
  ) {
    const nextValue = value.slice(0, PLANNER_LABEL_MAX_LENGTH);

    setLabelSettingsDraft((currentDraft) => ({
      ...currentDraft,
      [group]: {
        ...currentDraft[group],
        [key]: nextValue
      }
    }));
  }

  function handleApplyLabelSettings() {
    saveLabelSettings(sanitizePlannerLabelSettings(labelSettingsDraft));
    setIsLabelSettingsModalOpen(false);
  }

  function handleResetLabelSettings() {
    resetLabelSettings();
    setLabelSettingsDraft(buildLabelSettingsDraft(labelSettings));
  }

  const showRescheduleUnavailableGuidance = error === RESCHEDULE_UNAVAILABLE_MESSAGE;
  const showDevTimeControls =
    process.env.NODE_ENV !== "production" && isMutableTimeSource(timeSource);
  const showEndRecoveryReminder =
    showDevTimeControls && !activeReminder && activeEndRecoveryReminder !== null;

  return (
    <main
      className="shell"
      data-planner-ready={isCurrentMinuteReady ? "true" : "false"}
      data-testid="planner-root"
    >
      {showDevTimeControls ? (
        <DevTimeControls
          createObservationSamplePlan={() => createObservationSamplePlan(currentMinute)}
          currentMinute={currentMinute}
          currentPlan={currentPlan}
          sortedPlans={sortedPlans}
          timeSource={timeSource}
        />
      ) : null}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Today Did You Finish?</p>
          <h1>지금 해야 할 계획을 시계처럼 바로 보게 만드는 MVP</h1>
          <p className="hero-text">
            24시간 원형 계획판, 자유 시간 입력, 현재 시각 포인터를 웹 MVP로 먼저
            검증한 뒤 앱 전환까지 이어지는 구조다.
          </p>
          <div className="status-card">
            <span className="status-label">현재 해야 할 계획</span>
            <strong>{currentPlan?.title ?? "계획 없음"}</strong>
            <span className="status-time">{currentPlanTimeText}</span>
          </div>
          {activeReminder ? (
            <div
              aria-live="polite"
              className="reminder-banner"
              data-testid="reminder-banner"
              role="status"
            >
              <div className="reminder-copy">
                <span className="reminder-label">시작 리마인드</span>
                <strong>{activeReminder.title}</strong>
                <span className="reminder-time">{reminderTimeText}</span>
              </div>
              <div className="reminder-actions">
                {canCompleteActiveReminder ? (
                  <button
                    className="reminder-complete"
                    onClick={() => handleTogglePlanStatus(activeReminder.id)}
                    type="button"
                  >
                    {labelSettings.actionLabels.completeNow}
                  </button>
                ) : null}
                <button
                  className="reminder-dismiss"
                  onClick={() => handleDismissReminder(activeReminder.id)}
                  type="button"
                >
                  닫기
                </button>
              </div>
            </div>
          ) : null}
          {showEndRecoveryReminder ? (
            <div
              aria-live="polite"
              className="reminder-banner reminder-banner-recovery"
              data-testid="end-recovery-banner"
              role="status"
            >
              <div className="reminder-copy">
                <span className="reminder-label">종료 전 확인</span>
                <strong>{activeEndRecoveryReminder.title}</strong>
                <span className="reminder-time">{endRecoveryReminderTimeText}</span>
                <span className="reminder-detail">
                  종료 직전에는 가벼운 확인만 두고, 회고는 종료 후 흐름으로 넘기는 실험 배너입니다.
                </span>
              </div>
              <div className="reminder-actions">
                <button
                  className="reminder-complete reminder-continue"
                  onClick={() => dismissActiveEndRecoveryReminder(activeEndRecoveryReminder.id)}
                  type="button"
                >
                  계속 진행
                </button>
              </div>
            </div>
          ) : null}
          <div className="summary-row">
            <div className="summary-tile">
              <span>완료</span>
              <strong>
                {summary.completed}/{summary.total}
              </strong>
            </div>
            <div className="summary-tile">
              <span>완료율</span>
              <strong>{summary.completionRate}%</strong>
            </div>
            <div className="summary-tile">
              <span>입력 방식</span>
              <strong>자유</strong>
            </div>
          </div>
        </div>
        <div className="planner-panel">
          <svg
            aria-label="24시간 원형 계획판"
            className="planner-svg"
            viewBox="0 0 480 480"
            role="img"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              fill="#f4f4f6"
              r={RADIUS + 18}
              stroke="#ececf1"
              strokeWidth="16"
            />
            <ClockFace />
            {sortedPlans.map((plan) => (
              <PlanSegment
                currentMinute={resolvedCurrentMinute}
                key={plan.id}
                plan={plan}
              />
            ))}
            <CurrentHand currentMinute={resolvedCurrentMinute} />
          </svg>
        </div>
      </section>
      <section className="composer-section">
        <div className="section-head">
          <h2>{composerTitle}</h2>
        </div>
        <form className="plan-form" onSubmit={handleSubmit}>
          <label className="field field-title">
            <span>제목</span>
            <input
              maxLength={PLAN_TITLE_MAX_LENGTH}
              name="title"
              onChange={(event) => updateForm({ title: event.target.value })}
              placeholder="예: 영어 공부"
              required
              value={form.title}
            />
          </label>
          <label className="field field-time">
            <span>시작 시간</span>
            <input
              name="startTime"
              onChange={(event) => updateForm({ startTime: event.target.value })}
              required
              type="time"
              value={form.startTime}
            />
          </label>
          <label className="field field-time">
            <span>종료 시간</span>
            <input
              name="endTime"
              onChange={(event) => updateForm({ endTime: event.target.value })}
              required
              type="time"
              value={form.endTime}
            />
          </label>
          <label className="field field-color">
            <span>색상</span>
            <select
              className="color-select"
              name="colorMode"
              onChange={(event) => {
                const nextMode = event.target.value;

                if (nextMode === "custom") {
                  updateForm({ colorMode: "custom" });
                  queueMicrotask(() => {
                    openCustomColorPicker();
                  });
                  return;
                }

                updateForm({
                  colorMode: nextMode,
                  color: nextMode
                });
              }}
              value={form.colorMode}
            >
              {PLAN_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
              <option value="custom">사용자 지정</option>
            </select>
            <input
              className="custom-color-hidden"
              id="custom-plan-color"
              name="customColor"
              onChange={(event) =>
                updateForm({
                  color: event.target.value,
                  colorMode: "custom"
                })
              }
              ref={colorInputRef}
              type="color"
              value={form.color}
            />
          </label>
          <div className={editingPlanId ? "form-actions form-actions-editing" : "form-actions"}>
            <button
              className={
                editingPlanId || recoveryMode === "reschedule"
                  ? "submit-button form-submit form-submit-editing"
                  : "submit-button form-submit"
              }
              type="submit"
            >
              {submitButtonLabel}
            </button>
            {editingPlanId || recoveryMode === "reschedule" ? (
              <button
                className="cancel-button cancel-button-editing"
                onClick={handleCancelComposer}
                type="button"
              >
                {recoveryMode === "reschedule" ? "다시 지정 취소" : "수정 취소"}
              </button>
            ) : null}
          </div>
        </form>
        <div className="color-preview">
          <span>선택된 색상</span>
          <button
            className={
              form.colorMode === "custom"
                ? "color-preview-badge color-preview-badge-clickable"
                : "color-preview-badge"
            }
            onClick={() => {
              if (form.colorMode === "custom") {
                openCustomColorPicker();
              }
            }}
            type="button"
          >
            <span
              className="color-preview-swatch"
              style={{ backgroundColor: form.color }}
            />
            <strong>
              {form.colorMode === "custom"
                ? `사용자 지정 ${form.color.toUpperCase()}`
                : PLAN_COLORS.find((color) => color.value === form.color)?.label ?? "사용자 색상"}
            </strong>
          </button>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        {showRescheduleUnavailableGuidance ? (
          <p className="form-help">
            더 짧은 새 시간으로 다시 잡으십시오. 시작 시간이나 종료 시간을 직접 줄인 뒤
            `다시 지정 저장`을 누르면 됩니다.
          </p>
        ) : null}
      </section>
      <section className="list-section">
        <div className="section-head">
          <h2>오늘 계획</h2>
          <span>{listCurrentTimeText}</span>
        </div>
        <ul className="plan-list" data-testid="plan-list">
          {planItems.map(
            ({
              canReschedule,
              canToggleStatus,
              isCurrent,
              plan,
              recoveryBadges,
              recoveryHighlight,
              reflectionPreview,
              statusLabel,
              timeText
            }) => {
            return (
              <li
                className={isCurrent ? "plan-item plan-item-current" : "plan-item"}
                data-testid={`plan-item-${plan.id}`}
                key={plan.id}
              >
                <span className="plan-color" style={{ backgroundColor: plan.color }} />
                <div className="plan-meta">
                  <strong data-testid={`plan-title-${plan.id}`}>{plan.title}</strong>
                  <span>{timeText}</span>
                  {recoveryBadges.length > 0 ? (
                    <div className="plan-recovery-badges">
                      {recoveryBadges.map((badge) => (
                        <span className="plan-recovery-badge" key={badge}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {reflectionPreview ? (
                    <p className="plan-reflection-preview">{reflectionPreview}</p>
                  ) : null}
                  {recoveryHighlight ? (
                    <div
                      className={`plan-recovery-highlight plan-recovery-highlight-${recoveryHighlight.tone}`}
                      data-testid={`recovery-highlight-${plan.id}`}
                    >
                      <strong>{recoveryHighlight.label}</strong>
                      <span>{recoveryHighlight.detail}</span>
                    </div>
                  ) : null}
                </div>
                <div className="plan-actions">
                  <button
                    className="plan-edit"
                    onClick={() => startEditingPlan(plan)}
                    type="button"
                  >
                    수정
                  </button>
                  <button
                    className={plan.status === "done" ? "plan-state plan-state-done" : "plan-state"}
                    disabled={!canToggleStatus}
                    onClick={() => handleTogglePlanStatus(plan.id)}
                    title={!canToggleStatus ? "시작 전 일정은 아직 완료 처리할 수 없습니다." : undefined}
                    type="button"
                  >
                    {statusLabel}
                  </button>
                  {plan.status === "missed" ? (
                    <>
                      <button
                        className="plan-recovery"
                        onClick={() => startReflection(plan)}
                        type="button"
                      >
                        {labelSettings.actionLabels.reflection}
                      </button>
                      <button
                        className="plan-recovery"
                        disabled={!canReschedule}
                        onClick={() => startRescheduling(plan)}
                        title={!canReschedule ? "다시 지정은 최대 3회까지만 가능합니다." : undefined}
                        type="button"
                      >
                        {labelSettings.actionLabels.reschedule}
                      </button>
                    </>
                  ) : null}
                  <button
                    className="plan-delete"
                    onClick={() => handleDeletePlan(plan.id)}
                    type="button"
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {recoveryMode === "reflection" && recoveryPlan ? (
          <div className="recovery-panel">
            <div className="section-head">
              <h2>놓침 회고</h2>
              <span>{recoveryPlan.title}</span>
            </div>
            <label className="field">
              <span>회고 메모</span>
              <textarea
                className="reflection-textarea"
                onChange={(event) => setReflectionNoteDraft(event.target.value)}
                placeholder="왜 놓쳤는지, 다음에는 어떻게 바꿀지 적어두세요."
                rows={4}
                value={reflectionNoteDraft}
              />
            </label>
            <div className="recovery-actions">
              <button className="submit-button" onClick={saveReflection} type="button">
                회고 저장
              </button>
              <button className="cancel-button" onClick={cancelRecovery} type="button">
                회고 취소
              </button>
            </div>
          </div>
        ) : null}
        <div className="label-settings-panel">
          <div className="section-head">
            <h2>표시 문구</h2>
            <button
              className="submit-button label-settings-open"
              onClick={handleOpenLabelSettingsModal}
              type="button"
            >
              표시 문구 변경
            </button>
          </div>
          <p className="label-settings-note">
            앱에서도 유지할 범위는 상태 4개와 핵심 액션 3개, 총 7개 키로 제한합니다.
          </p>
          <p className="label-settings-summary">
            현재: {labelSettings.statusLabels.current} / {labelSettings.statusLabels.pending} /{" "}
            {labelSettings.statusLabels.done} / {labelSettings.statusLabels.missed}
          </p>
        </div>
        {isLabelSettingsModalOpen ? (
          <div
            aria-modal="true"
            className="modal-backdrop"
            role="dialog"
            aria-labelledby="label-settings-dialog-title"
          >
            <div className="modal-panel">
              <div className="section-head">
                <h2 id="label-settings-dialog-title">표시 문구 변경</h2>
                <button className="cancel-button" onClick={handleCloseLabelSettingsModal} type="button">
                  닫기
                </button>
              </div>
              <p className="label-settings-note">
                각 문구는 최대 {PLANNER_LABEL_MAX_LENGTH}자까지 입력할 수 있습니다.
              </p>
              <div className="label-settings-grid">
                <label className="field">
                  <span>지금 라벨</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("statusLabels", "current", event.target.value)
                    }
                    value={labelSettingsDraft.statusLabels.current}
                  />
                </label>
                <label className="field">
                  <span>대기 라벨</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("statusLabels", "pending", event.target.value)
                    }
                    value={labelSettingsDraft.statusLabels.pending}
                  />
                </label>
                <label className="field">
                  <span>완료 라벨</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("statusLabels", "done", event.target.value)
                    }
                    value={labelSettingsDraft.statusLabels.done}
                  />
                </label>
                <label className="field">
                  <span>놓침 라벨</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("statusLabels", "missed", event.target.value)
                    }
                    value={labelSettingsDraft.statusLabels.missed}
                  />
                </label>
                <label className="field">
                  <span>리마인드 완료 버튼</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("actionLabels", "completeNow", event.target.value)
                    }
                    value={labelSettingsDraft.actionLabels.completeNow}
                  />
                </label>
                <label className="field">
                  <span>회고 버튼</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("actionLabels", "reflection", event.target.value)
                    }
                    value={labelSettingsDraft.actionLabels.reflection}
                  />
                </label>
                <label className="field">
                  <span>다시 지정 버튼</span>
                  <input
                    maxLength={PLANNER_LABEL_MAX_LENGTH}
                    onChange={(event) =>
                      handleLabelDraftChange("actionLabels", "reschedule", event.target.value)
                    }
                    value={labelSettingsDraft.actionLabels.reschedule}
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={handleResetLabelSettings} type="button">
                  기본값 복원
                </button>
                <button className="submit-button modal-submit" onClick={handleApplyLabelSettings} type="button">
                  변경 적용
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <details className="observation-panel" data-testid="recovery-observation-panel">
          <summary>회복 관찰 로그</summary>
          <div className="observation-panel-body">
            <div className="observation-panel-head">
              <div className="observation-panel-meta">
                <span>최근 5건</span>
                <span>{recoveryHighlightObservationWindowText}</span>
              </div>
              <button
                className="observation-clear"
                onClick={clearRecoveryObservationLog}
                type="button"
              >
                기록 지우기
              </button>
            </div>
            <div className="observation-summary">
              {recoveryHighlightObservationSummaryItems.map((item) => (
                <div
                  className="observation-summary-tile"
                  data-testid={getRecoveryObservationSummaryTestId(item.label)}
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <div
              className={`observation-policy observation-policy-${recoveryHighlightObservationPolicyStatus.tone}`}
            >
              <strong>{recoveryHighlightObservationPolicyStatus.label}</strong>
              <span>{recoveryHighlightObservationPolicyStatus.detail}</span>
            </div>
            <p className="observation-hint">{recoveryHighlightObservationHint}</p>
            <p className="observation-hint"><strong>{recoveryHighlightObservationRecommendation}</strong></p>
            {recoveryHighlightObservationItems.length === 0 ? (
              <p className="observation-empty">아직 기록된 회복 재강조 로그가 없습니다.</p>
            ) : (
              <ul className="observation-list">
                {recoveryHighlightObservationItems.map((item) => (
                  <li className="observation-item" key={item.id}>
                    <strong>{item.label}</strong>
                    <span>{item.planTitle}</span>
                    <span>{item.observedMinuteText}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
        <details className="observation-panel" data-testid="reminder-observation-panel">
          <summary>리마인드 관찰 로그</summary>
          <div className="observation-panel-body">
            <div className="observation-panel-head">
              <div className="observation-panel-meta">
                <span>최근 5건</span>
                <span>{reminderObservationWindowText}</span>
              </div>
              <button
                className="observation-clear"
                onClick={clearObservationLog}
                type="button"
              >
                기록 지우기
              </button>
            </div>
            <div className="observation-summary">
              {reminderObservationSummaryItems.map((item) => (
                <div
                  className="observation-summary-tile"
                  data-testid={getReminderObservationSummaryTestId(item.label)}
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <div className={`observation-policy observation-policy-${reminderPolicyStatus.tone}`}>
              <strong>{reminderPolicyStatus.label}</strong>
              <span>{reminderPolicyStatus.detail}</span>
            </div>
            <p className="observation-hint">{reminderObservationHint}</p>
            {reminderObservationItems.length === 0 ? (
              <p className="observation-empty">아직 기록된 리마인드 관찰 로그가 없습니다.</p>
            ) : (
              <ul className="observation-list">
                {reminderObservationItems.map((item) => (
                  <li className="observation-item" key={item.id}>
                    <strong>{item.label}</strong>
                    <span>{item.planTitle}</span>
                    <span>{item.timeText}</span>
                    <span>{item.observedMinuteText}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </section>
    </main>
  );
}
