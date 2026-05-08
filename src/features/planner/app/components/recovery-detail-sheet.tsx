type RecoveryDetailSheetProps = {
  detail: string;
  onReflection?: () => void;
  onReschedule?: () => void;
  reflectionPreview?: string | null;
  title: string;
};

export function RecoveryDetailSheet({
  detail,
  onReflection,
  onReschedule,
  reflectionPreview = null,
  title
}: RecoveryDetailSheetProps) {
  return (
    <section
      aria-label="app-recovery-detail-sheet"
      className="app-card app-recovery-sheet"
      data-testid="app-recovery-detail-sheet"
    >
      <div className="app-sheet-handle" />
      <p className="app-card-eyebrow">회복 상세</p>
      <strong>{title}</strong>
      <p className="app-card-text">{detail}</p>
      {reflectionPreview ? <p className="app-recovery-preview">회고 메모: {reflectionPreview}</p> : null}
      <div className="app-inline-actions">
        <button className="app-button app-button-primary" onClick={onReflection} type="button">
          회고
        </button>
        <button className="app-button app-button-secondary" onClick={onReschedule} type="button">
          다시 지정
        </button>
      </div>
    </section>
  );
}
