type StartReminderBannerProps = {
  canComplete: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
  timeText: string;
  title: string;
};

export function StartReminderBanner({
  canComplete,
  onComplete,
  onDismiss,
  timeText,
  title
}: StartReminderBannerProps) {
  return (
    <section
      aria-label="app-start-reminder"
      className="app-banner app-banner-start"
      data-testid="app-start-reminder"
    >
      <p className="app-banner-eyebrow">시작 리마인드</p>
      <strong>{title}</strong>
      <p className="app-banner-time">{timeText}</p>
      <div className="app-banner-actions">
        {canComplete ? (
          <button className="app-button app-button-primary" onClick={onComplete} type="button">
            지금 완료
          </button>
        ) : null}
        <button className="app-button app-button-secondary" onClick={onDismiss} type="button">
          닫기
        </button>
      </div>
    </section>
  );
}
