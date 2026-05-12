import {
  defaultPlannerLabelSettings,
  type PlannerLabelSettingsStore,
  type PlannerLabelSettings
} from "@/providers/labels/planner-label-settings";
import type { DailyPlan } from "@/domains/plans/types";
import type { PlannerRecordsStore } from "@/providers/plans/planner-records-store";
import type { PlansStore } from "@/providers/plans/plans-store";
import type { ReminderProvider } from "@/providers/reminders/reminder-provider";
import type { TimeSource } from "@/providers/time/time-source";
import { EndRecoveryBanner } from "@/features/planner/app/components/end-recovery-banner";
import { AppCircularPlanner } from "@/features/planner/app/components/app-circular-planner";
import { RecoveryDetailSheet } from "@/features/planner/app/components/recovery-detail-sheet";
import { StartReminderBanner } from "@/features/planner/app/components/start-reminder-banner";
import { useConnectedTodayScreen } from "@/features/planner/app/use-connected-today-screen";
import { useTodayScreenViewModel } from "@/features/planner/app/use-today-screen-view-model";

type TodayScreenProps = {
  currentMinute?: number | null;
  labelSettings?: PlannerLabelSettings;
  onContinueEndRecovery?: (planId: string) => void;
  onDismissReminder?: (planId: string) => void;
  onOpenReflection?: (planId: string) => void;
  onOpenReschedule?: (planId: string) => void;
  onTogglePlanStatus?: (planId: string) => void;
  plans?: DailyPlan[];
};

export function TodayScreen({
  currentMinute = null,
  labelSettings = defaultPlannerLabelSettings,
  onContinueEndRecovery,
  onDismissReminder,
  onOpenReflection,
  onOpenReschedule,
  onTogglePlanStatus,
  plans = []
}: TodayScreenProps) {
  const {
    activeEndRecoveryReminder,
    activeReminder,
    canCompleteActiveReminder,
    currentPlan,
    currentPlanTimeText,
    endRecoveryReminderTimeText,
    highlightedRecoveryItem,
    planItems,
    reminderTimeText,
    summary
  } = useTodayScreenViewModel({
    currentMinute,
    labelSettings,
    plans
  });

  return (
    <section className="app-screen app-screen-today" data-testid="app-today-screen">
      <header className="app-screen-header">
        <p className="app-screen-eyebrow">Today</p>
        <h1>오늘 화면</h1>
        <p className="app-screen-subtitle">{currentPlanTimeText}</p>
      </header>
      <section aria-label="today-summary" className="app-summary-grid">
        <article className="app-stat-card">
          <span>완료</span>
          <strong>
            {summary.completed}/{summary.total}
          </strong>
        </article>
        <article className="app-stat-card">
          <span>완료율</span>
          <strong>{summary.completionRate}%</strong>
        </article>
      </section>
      <section className="app-card app-circular-card" aria-label="today-circular-overview">
        <div className="app-section-head">
          <h2>오늘 시간판</h2>
          <span>앱에서도 원형 계획 표현을 상단 핵심 블록으로 유지합니다.</span>
        </div>
        <AppCircularPlanner
          currentMinute={currentMinute}
          currentPlanTitle={currentPlan?.title ?? null}
          plans={plans}
        />
      </section>
      <section aria-label="today-current-plan" className="app-card app-focus-card">
        <p className="app-card-eyebrow">현재 해야 할 계획</p>
        <strong>{currentPlan?.title ?? "현재 계획 없음"}</strong>
        <p className="app-card-text">현재 맥락과 회복 흐름을 한 화면에서 바로 확인합니다.</p>
      </section>
      {activeReminder ? (
        <StartReminderBanner
          canComplete={canCompleteActiveReminder}
          onComplete={() => onTogglePlanStatus?.(activeReminder.id)}
          onDismiss={() => onDismissReminder?.(activeReminder.id)}
          timeText={reminderTimeText ?? ""}
          title={activeReminder.title}
        />
      ) : null}
      {activeEndRecoveryReminder ? (
        <EndRecoveryBanner
          onContinue={() => onContinueEndRecovery?.(activeEndRecoveryReminder.id)}
          timeText={endRecoveryReminderTimeText ?? ""}
          title={activeEndRecoveryReminder.title}
        />
      ) : null}
      {highlightedRecoveryItem?.recoveryHighlight ? (
        <RecoveryDetailSheet
          detail={highlightedRecoveryItem.recoveryHighlight.detail}
          onReflection={() => onOpenReflection?.(highlightedRecoveryItem.plan.id)}
          onReschedule={() => onOpenReschedule?.(highlightedRecoveryItem.plan.id)}
          reflectionPreview={highlightedRecoveryItem.reflectionPreview}
          title={highlightedRecoveryItem.plan.title}
        />
      ) : null}
      <section className="app-card">
        <div className="app-section-head">
          <h2>오늘 계획</h2>
          <span>상태와 회복 진입을 같은 리스트에서 확인합니다.</span>
        </div>
        <ul aria-label="today-plan-list" className="app-plan-list">
          {planItems.map((item) => (
            <li className="app-plan-item" key={item.plan.id}>
              <div className="app-plan-copy">
                <span className={`app-status-pill app-status-pill-${item.isCurrent ? "current" : item.plan.status}`}>
                  {item.statusLabel}
                </span>
                <strong>{item.plan.title}</strong>
                <span className="app-plan-time">{item.timeText}</span>
              </div>
              <div className="app-plan-side">
                {item.recoveryHighlight ? (
                  <span className="app-recovery-pill">{item.recoveryHighlight.label}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

type ConnectedTodayScreenProps = {
  labelSettingsStore: PlannerLabelSettingsStore;
  recordsStore?: PlannerRecordsStore;
  plansStore: PlansStore;
  reminderProvider: ReminderProvider;
  timeSource: TimeSource;
};

export function ConnectedTodayScreen({
  labelSettingsStore,
  recordsStore,
  plansStore,
  reminderProvider,
  timeSource
}: ConnectedTodayScreenProps) {
  const { todayScreenProps } = useConnectedTodayScreen({
    labelSettingsStore,
    plansStore,
    recordsStore,
    reminderProvider,
    timeSource
  });

  return <TodayScreen {...todayScreenProps} />;
}
