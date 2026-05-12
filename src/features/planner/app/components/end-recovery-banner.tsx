type EndRecoveryBannerProps = {
  onContinue?: () => void;
  timeText: string;
  title: string;
};

export function EndRecoveryBanner({
  onContinue,
  timeText,
  title
}: EndRecoveryBannerProps) {
  return (
    <section
      aria-label="app-end-recovery-banner"
      className="app-banner app-banner-end"
      data-testid="app-end-recovery-banner"
    >
      <p className="app-banner-eyebrow">종료 전 확인</p>
      <strong>{title}</strong>
      <p className="app-banner-time">{timeText}</p>
      <p className="app-banner-detail">종료 직전에는 가벼운 확인만 두고, 회고는 종료 후 흐름으로 넘깁니다.</p>
      <button className="app-button app-button-primary app-button-warm" onClick={onContinue} type="button">
        계속 진행
      </button>
    </section>
  );
}
