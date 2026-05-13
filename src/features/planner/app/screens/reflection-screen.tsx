"use client";

type ReflectionScreenProps = {
  onCancel?: () => void;
  onChangeNote?: (value: string) => void;
  onSave?: () => void;
  placeholder: string;
  recoveryPlanTitle: string;
  reflectionNoteDraft: string;
};

export function ReflectionScreen({
  onCancel,
  onChangeNote,
  onSave,
  placeholder,
  recoveryPlanTitle,
  reflectionNoteDraft
}: ReflectionScreenProps) {
  return (
    <section className="app-screen app-screen-reflection" data-testid="app-reflection-screen">
      <header className="app-screen-header">
        <p className="app-screen-eyebrow">Reflection</p>
        <h1>놓침 회고</h1>
        <span className="app-screen-subtitle">{recoveryPlanTitle}</span>
      </header>
      <section className="app-card">
      <label className="app-field">
        <span>회고 메모</span>
        <textarea
          className="app-textarea"
          onChange={(event) => onChangeNote?.(event.target.value)}
          placeholder={placeholder}
          rows={4}
          value={reflectionNoteDraft}
        />
      </label>
      </section>
      <div className="app-inline-actions">
        <button className="app-button app-button-primary" onClick={onSave} type="button">
          회고 저장
        </button>
        <button className="app-button app-button-secondary" onClick={onCancel} type="button">
          회고 취소
        </button>
      </div>
    </section>
  );
}
