"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  createSectorPath,
  describeMinute,
  formatSectorLabel,
  getCurrentPlan,
  getPlannerSummary,
  getReadableTextColor,
  getSectorLabelFontSize,
  getSectorLabelRotation,
  isCurrentPlan,
  minuteToTimeString,
  minuteToAngle,
  polarToCartesian,
  sortPlans,
  timeStringToMinute,
  validatePlanner
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";
import { loadPlans, savePlans } from "@/providers/plans/local-plans";
import { systemTimeSource } from "@/providers/time/time-source";
import { getMinutesSinceMidnight } from "@/shared/time/minutes";
import { demoPlans } from "@/ui/planner/planner-demo-data";

const CENTER = 240;
const RADIUS = 180;
const SECTOR_RADIUS = 190;
const CURRENT_SECTOR_RADIUS = 198;
const CURRENT_SECTOR_HALO_RADIUS = 206;
const INACTIVE_SECTOR_OPACITY = 0.42;
const PLAN_COLORS = [
  { value: "#767676", label: "그레이" },
  { value: "#9a80eb", label: "보라" },
  { value: "#f7b347", label: "옐로" },
  { value: "#ef668f", label: "핑크" },
  { value: "#ef8d75", label: "코랄" },
  { value: "#5bb7aa", label: "민트" }
];

function useCurrentMinute() {
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    setMinute(getMinutesSinceMidnight(systemTimeSource.now()));

    const timer = window.setInterval(() => {
      setMinute(getMinutesSinceMidnight(systemTimeSource.now()));
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  return minute;
}

type PlanFormState = {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  colorMode: string;
};

const defaultFormState: PlanFormState = {
  title: "",
  startTime: "08:00",
  endTime: "09:00",
  color: PLAN_COLORS[0].value,
  colorMode: PLAN_COLORS[0].value
};

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

function getColorModeForColor(color: string): string {
  return PLAN_COLORS.some((paletteColor) => paletteColor.value === color)
    ? color
    : "custom";
}

export function CircularPlanner() {
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [plans, setPlans] = useState<DailyPlan[]>(() => validatePlanner(demoPlans));
  const [form, setForm] = useState<PlanFormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const currentMinute = useCurrentMinute();
  const resolvedCurrentMinute = currentMinute ?? 0;
  const sortedPlans = useMemo(() => sortPlans(plans), [plans]);
  const currentPlan =
    currentMinute === null ? null : getCurrentPlan(sortedPlans, resolvedCurrentMinute);
  const summary = getPlannerSummary(plans);

  useEffect(() => {
    const storedPlans = loadPlans();

    if (storedPlans) {
      setPlans(sortPlans(storedPlans));
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    savePlans(plans);
  }, [isHydrated, plans]);

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
      const nextPlan: DailyPlan = {
        id: editingPlanId ?? crypto.randomUUID(),
        title: form.title.trim(),
        color: form.color,
        startMinute: timeStringToMinute(form.startTime),
        endMinute: timeStringToMinute(form.endTime),
        status: "pending"
      };
      const basePlans =
        editingPlanId === null
          ? plans
          : plans.filter((plan) => plan.id !== editingPlanId);
      const previousPlan = plans.find((plan) => plan.id === editingPlanId);
      const nextPlans = sortPlans(
        validatePlanner([
          ...basePlans,
          {
            ...nextPlan,
            status: previousPlan?.status ?? "pending"
          }
        ])
      );

      setPlans(nextPlans);
      setForm(defaultFormState);
      setEditingPlanId(null);
      setError(null);
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message);
        return;
      }

      setError("계획을 저장하지 못했습니다.");
    }
  }

  function togglePlanStatus(id: string) {
    setPlans((currentPlans) =>
      sortPlans(
        currentPlans.map((plan) =>
          plan.id === id
            ? { ...plan, status: plan.status === "done" ? "pending" : "done" }
            : plan
        )
      )
    );
  }

  function deletePlan(id: string) {
    if (editingPlanId === id) {
      setEditingPlanId(null);
      setForm(defaultFormState);
    }

    setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== id));
  }

  function startEditingPlan(plan: DailyPlan) {
    setEditingPlanId(plan.id);
    setForm({
      title: plan.title,
      startTime: minuteToTimeString(plan.startMinute),
      endTime: minuteToTimeString(plan.endMinute),
      color: plan.color,
      colorMode: getColorModeForColor(plan.color)
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingPlanId(null);
    setForm(defaultFormState);
    setError(null);
  }

  return (
    <main className="shell">
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
              <span className="status-time">
              {currentPlan
                ? `${describeMinute(currentPlan.startMinute)} - ${describeMinute(currentPlan.endMinute)}`
                : currentMinute === null
                  ? "현재 시간을 동기화하고 있습니다."
                  : "현재 시간대에 등록된 계획이 없습니다."}
            </span>
          </div>
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
          <h2>{editingPlanId ? "계획 수정" : "계획 등록"}</h2>
          <span>시간 자유 입력</span>
        </div>
        <form className="plan-form" onSubmit={handleSubmit}>
          <label className="field field-title">
            <span>제목</span>
            <input
              name="title"
              onChange={(event) =>
                setForm((currentForm) => ({ ...currentForm, title: event.target.value }))
              }
              placeholder="예: 영어 공부"
              required
              value={form.title}
            />
          </label>
          <label className="field field-time">
            <span>시작 시간</span>
            <input
              name="startTime"
              onChange={(event) =>
                setForm((currentForm) => ({ ...currentForm, startTime: event.target.value }))
              }
              required
              type="time"
              value={form.startTime}
            />
          </label>
          <label className="field field-time">
            <span>종료 시간</span>
            <input
              name="endTime"
              onChange={(event) =>
                setForm((currentForm) => ({ ...currentForm, endTime: event.target.value }))
              }
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
                  setForm((currentForm) => ({
                    ...currentForm,
                    colorMode: "custom"
                  }));
                  queueMicrotask(() => {
                    openCustomColorPicker();
                  });
                  return;
                }

                setForm((currentForm) => ({
                  ...currentForm,
                  colorMode: nextMode,
                  color: nextMode
                }));
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
                setForm((currentForm) => ({
                  ...currentForm,
                  color: event.target.value,
                  colorMode: "custom"
                }))
              }
              ref={colorInputRef}
              type="color"
              value={form.color}
            />
          </label>
          <div className={editingPlanId ? "form-actions form-actions-editing" : "form-actions"}>
            <button
              className={
                editingPlanId
                  ? "submit-button form-submit form-submit-editing"
                  : "submit-button form-submit"
              }
              type="submit"
            >
              {editingPlanId ? "계획 저장" : "계획 추가"}
            </button>
            {editingPlanId ? (
              <button
                className="cancel-button cancel-button-editing"
                onClick={cancelEditing}
                type="button"
              >
                수정 취소
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
      </section>
      <section className="list-section">
        <div className="section-head">
          <h2>오늘 계획</h2>
          <span>
            {currentMinute === null
              ? "시간 동기화 중"
              : `${describeMinute(resolvedCurrentMinute)} 기준`}
          </span>
        </div>
        <ul className="plan-list">
          {sortedPlans.map((plan) => {
            const current =
              currentMinute === null ? false : isCurrentPlan(plan, resolvedCurrentMinute);
            return (
              <li
                className={current ? "plan-item plan-item-current" : "plan-item"}
                key={plan.id}
              >
                <span className="plan-color" style={{ backgroundColor: plan.color }} />
                <div className="plan-meta">
                  <strong>{plan.title}</strong>
                  <span>
                    {describeMinute(plan.startMinute)} - {describeMinute(plan.endMinute)}
                  </span>
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
                    onClick={() => togglePlanStatus(plan.id)}
                    type="button"
                  >
                    {plan.status === "done" ? "완료" : current ? "지금" : "대기"}
                  </button>
                  <button className="plan-delete" onClick={() => deletePlan(plan.id)} type="button">
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
