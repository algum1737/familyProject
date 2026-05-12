"use client";

import type {
  MonthlyCalendarDay
} from "@/domains/plans/selectors/monthly-calendar-status";
import type {
  MonthlyMotivationSummary
} from "@/domains/plans/selectors/monthly-motivation-summary";
import type {
  RecoveryContributionSummary
} from "@/domains/plans/selectors/recovery-contribution-summary";

type MotivationScreenProps = {
  calendarDays: MonthlyCalendarDay[];
  monthKey: string;
  recoverySummary: RecoveryContributionSummary;
  summary: MonthlyMotivationSummary;
};

export function MotivationScreen({
  calendarDays,
  monthKey,
  recoverySummary,
  summary
}: MotivationScreenProps) {
  return (
    <section className="app-screen app-screen-motivation" data-testid="app-motivation-screen">
      <header className="app-screen-header">
        <p className="app-screen-eyebrow">Motivation</p>
        <h1>{monthKey} 동기부여</h1>
      </header>
      <section aria-label="motivation-summary" className="app-summary-grid app-summary-grid-wide">
        <article className="app-stat-card">
          <span>완료</span>
          <strong>{summary.completedCount}개</strong>
        </article>
        <article className="app-stat-card">
          <span>완료율</span>
          <strong>{summary.completionRate}%</strong>
        </article>
        <article className="app-stat-card">
          <span>놓침</span>
          <strong>{summary.missedCount}개</strong>
        </article>
      </section>
      <section aria-label="motivation-recovery" className="app-card">
        <div className="app-section-head">
          <h2>회복 기여</h2>
          <span>다시 지정과 회고가 실제 성과로 얼마나 이어졌는지 봅니다.</span>
        </div>
        <strong>다시 지정 후 완료 {recoverySummary.completedAfterRescheduleCount}개</strong>
        <span className="app-screen-subtitle">회고 남긴 날 {recoverySummary.reflectionDays}일</span>
      </section>
      <section aria-label="motivation-calendar" className="app-card">
        <div className="app-section-head">
          <h2>월간 흐름</h2>
          <span>하루 단위 완료율과 톤을 빠르게 확인합니다.</span>
        </div>
        <ul className="app-calendar-grid">
          {calendarDays.map((day) => (
            <li className={`app-calendar-day app-calendar-day-${day.tone}`} key={day.date}>
              <strong>{day.dayOfMonth}</strong>
              <span>{day.completionRate}%</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
