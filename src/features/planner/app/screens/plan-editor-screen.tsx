"use client";

import type { RescheduleFailureGuidance } from "@/features/planner/core/reschedule-failure-guidance";
import type { PlanFormState } from "@/ui/planner/use-planner-state";

type PlanEditorScreenProps = {
  composerTitle: string;
  error: string | null;
  form: PlanFormState;
  onCancel?: () => void;
  onSubmit?: () => void;
  onUpdateForm?: (values: Partial<PlanFormState>) => void;
  rescheduleFailureGuidance?: RescheduleFailureGuidance | null;
  submitButtonLabel: string;
};

export function PlanEditorScreen({
  composerTitle,
  error,
  form,
  onCancel,
  onSubmit,
  onUpdateForm,
  rescheduleFailureGuidance = null,
  submitButtonLabel
}: PlanEditorScreenProps) {
  return (
    <section className="app-screen app-screen-editor" data-testid="app-plan-editor-screen">
      <header className="app-screen-header">
        <p className="app-screen-eyebrow">Editor</p>
        <h1>{composerTitle}</h1>
      </header>
      <section className="app-card">
        <div className="app-section-head">
          <h2>계획 정보</h2>
          <span>추가, 수정, 다시 지정을 한 화면에서 처리합니다.</span>
        </div>
        <div className="app-form-grid">
        <label className="app-field">
          <span>제목</span>
          <input
            onChange={(event) => onUpdateForm?.({ title: event.target.value })}
            value={form.title}
          />
        </label>
        <label className="app-field">
          <span>시작 시간</span>
          <input
            onChange={(event) => onUpdateForm?.({ startTime: event.target.value })}
            value={form.startTime}
          />
        </label>
        <label className="app-field">
          <span>종료 시간</span>
          <input
            onChange={(event) => onUpdateForm?.({ endTime: event.target.value })}
            value={form.endTime}
          />
        </label>
        <label className="app-field">
          <span>색상</span>
          <input
            onChange={(event) =>
              onUpdateForm?.({ color: event.target.value, colorMode: event.target.value })
            }
            value={form.color}
          />
        </label>
        </div>
      </section>
      {error ? <p className="app-inline-error">{error}</p> : null}
      {rescheduleFailureGuidance ? (
        <section className="app-card app-warning-card">
          <strong>{rescheduleFailureGuidance.title}</strong>
          <p className="app-card-text">{rescheduleFailureGuidance.description}</p>
        </section>
      ) : null}
      <div className="app-inline-actions">
        <button className="app-button app-button-primary" onClick={onSubmit} type="button">
          {submitButtonLabel}
        </button>
        <button className="app-button app-button-secondary" onClick={onCancel} type="button">
          {submitButtonLabel === "다시 지정 저장" ? "다시 지정 취소" : "수정 취소"}
        </button>
      </div>
    </section>
  );
}
