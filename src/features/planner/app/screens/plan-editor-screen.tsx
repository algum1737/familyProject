"use client";

import type { PlanFormState } from "@/ui/planner/use-planner-state";

type PlanEditorScreenProps = {
  composerTitle: string;
  error: string | null;
  form: PlanFormState;
  onCancel?: () => void;
  onSubmit?: () => void;
  onUpdateForm?: (values: Partial<PlanFormState>) => void;
  showRescheduleUnavailableGuidance?: boolean;
  submitButtonLabel: string;
};

export function PlanEditorScreen({
  composerTitle,
  error,
  form,
  onCancel,
  onSubmit,
  onUpdateForm,
  showRescheduleUnavailableGuidance = false,
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
      {showRescheduleUnavailableGuidance ? (
        <section className="app-card app-warning-card">
          <strong>오늘 남은 빈 시간에는 이 일정 길이 그대로 다시 지정할 수 없습니다.</strong>
          <p className="app-card-text">
            더 짧은 새 시간으로 다시 잡으십시오. 시작 시간이나 종료 시간을 직접 줄인 뒤
            `다시 지정 저장`을 누르면 됩니다.
          </p>
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
