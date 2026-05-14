const todayPlans = [
  { time: "06:30 - 07:00", title: "가벼운 스트레칭", state: "완료", tone: "done" },
  { time: "09:00 - 10:30", title: "집중 작업", state: "지금", tone: "current" },
  { time: "12:30 - 13:00", title: "점심 산책", state: "대기", tone: "pending" },
  { time: "16:00 - 16:30", title: "관찰 표본 1", state: "놓침", tone: "missed" }
] as const;

const editorFields = [
  { label: "제목", value: "관찰 표본 1 보충" },
  { label: "시작 시간", value: "18:20" },
  { label: "종료 시간", value: "18:45" },
  { label: "색상", value: "해질녘 코랄" }
] as const;

const motivationDays = [
  "1", "2", "3", "4", "5", "6", "7",
  "8", "9", "10", "11", "12", "13", "14",
  "15", "16", "17", "18", "19", "20", "21",
  "22", "23", "24", "25", "26", "27", "28"
] as const;

export default function AppMockupPage() {
  return (
    <main className="mockup-shell">
      <section className="mockup-hero">
        <div>
          <p className="mockup-eyebrow">오늘 다 했니</p>
          <h1>오늘 계획 앱 화면</h1>
          <p className="mockup-intro">
            오늘 할 일을 만들고, 놓친 일은 회고하거나 다시 지정할 수 있는 모바일 화면
            흐름입니다.
          </p>
        </div>
        <div className="mockup-pill-row">
          <span className="mockup-pill">루트 스택</span>
          <span className="mockup-pill">오늘 화면 중심</span>
          <span className="mockup-pill">회복은 보조 흐름</span>
        </div>
      </section>

      <section className="mockup-grid mockup-grid-wide">
        <article className="phone-frame">
          <div className="phone-screen">
            <header className="mockup-topbar">
              <div>
                <p className="mockup-screen-label">오늘</p>
                <h2>오늘 화면</h2>
              </div>
              <button className="mockup-ghost-button" type="button">
                + 계획 추가
              </button>
            </header>

            <section className="mockup-focus-card">
              <p className="mockup-card-kicker">현재 해야 할 계획</p>
              <strong>집중 작업</strong>
              <span>09:00 - 10:30</span>
              <p>
                시작 리마인드 이후에도 현재 작업 맥락을 잃지 않게, 카드 상단에서 바로
                확인되는 구조를 유지합니다.
              </p>
            </section>

            <section className="mockup-banner mockup-banner-start">
              <div>
                <p className="mockup-banner-label">시작 리마인드</p>
                <strong>집중 작업을 시작할 시간입니다</strong>
                <span>지금 완료는 시작 후에만 보이고, 그 전에는 닫기만 노출됩니다.</span>
              </div>
              <div className="mockup-banner-actions">
                <button className="mockup-primary-button" type="button">
                  지금 완료
                </button>
                <button className="mockup-secondary-button" type="button">
                  닫기
                </button>
              </div>
            </section>

            <section className="mockup-planner-card">
              <div className="mockup-planner-ring">
                <div className="mockup-planner-core">
                  <span>09:20</span>
                  <strong>지금</strong>
                </div>
                <div className="mockup-segment mockup-segment-current">집중 작업</div>
                <div className="mockup-segment mockup-segment-soft">점심 산책</div>
                <div className="mockup-segment mockup-segment-muted">스트레칭</div>
              </div>
              <div className="mockup-planner-copy">
                <strong>원형 플래너 또는 대안 표현</strong>
                <p>
                  앱에서는 같은 시간 규칙을 유지하되, 원형 플래너가 무겁다면 동일 정보를
                  다른 모바일 표현으로 바꿀 수 있게 둡니다.
                </p>
              </div>
            </section>

            <section className="mockup-summary-row">
              <div className="mockup-summary-card">
                <span>완료</span>
                <strong>1 / 4</strong>
              </div>
              <div className="mockup-summary-card">
                <span>완료율</span>
                <strong>25%</strong>
              </div>
              <div className="mockup-summary-card">
                <span>회복 상태</span>
                <strong>우선 유지</strong>
              </div>
            </section>

            <section className="mockup-list-card">
              <div className="mockup-section-head">
                <h3>오늘 계획</h3>
                <span>상태와 회복 진입을 한 리스트 안에 둡니다.</span>
              </div>
              <ul className="mockup-plan-list">
                {todayPlans.map((plan) => (
                  <li className="mockup-plan-item" key={plan.title}>
                    <div>
                      <span className={`mockup-plan-state mockup-plan-state-${plan.tone}`}>
                        {plan.state}
                      </span>
                      <strong>{plan.title}</strong>
                      <p>{plan.time}</p>
                    </div>
                    <button className="mockup-inline-button" type="button">
                      {plan.tone === "missed" ? "회고 / 다시 지정" : "수정"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mockup-banner mockup-banner-end">
              <div>
                <p className="mockup-banner-label">종료 5분 전</p>
                <strong>종료 전 확인</strong>
                <span>
                  종료 전에 한 번 더 확인하고, 놓친 일은 이후 카드에서 회고하거나 다시
                  지정할 수 있습니다.
                </span>
              </div>
              <div className="mockup-banner-actions">
                <button className="mockup-primary-button mockup-primary-button-warm" type="button">
                  계속 진행
                </button>
              </div>
            </section>

            <section className="mockup-recovery-sheet">
              <div className="mockup-sheet-handle" />
              <p className="mockup-card-kicker">회복 기록</p>
              <strong>회고 다시 보기</strong>
              <p>
                놓친 뒤 남긴 회고와 다시 지정한 일정을 한곳에서 확인합니다.
              </p>
            </section>
          </div>
        </article>

        <article className="phone-frame phone-frame-editor">
          <div className="phone-screen">
            <header className="mockup-topbar">
              <div>
                <p className="mockup-screen-label">계획 편집</p>
                <h2>계획 편집</h2>
              </div>
              <button className="mockup-ghost-button" type="button">
                닫기
              </button>
            </header>

            <section className="mockup-editor-card">
              <p className="mockup-card-kicker">다시 지정</p>
              <strong>놓친 일정을 더 짧게 다시 잡는 흐름</strong>
              <p>
                놓친 일정을 다시 잡을 때는 제목, 시작 시간, 종료 시간을 바로 고쳐 저장할
                수 있습니다.
              </p>
            </section>

            <section className="mockup-form-card">
              {editorFields.map((field) => (
                <label className="mockup-form-field" key={field.label}>
                  <span>{field.label}</span>
                  <div>{field.value}</div>
                </label>
              ))}
            </section>

            <section className="mockup-error-card">
              <strong>오늘 남은 빈 시간에는 이 일정 길이 그대로 다시 지정할 수 없습니다.</strong>
              <p>
                더 짧은 새 시간으로 다시 잡으십시오. 시작 시간이나 종료 시간을 직접 줄인 뒤
                다시 지정 저장을 누르면 됩니다.
              </p>
            </section>

            <section className="mockup-actions-card">
              <button className="mockup-primary-button mockup-block-button" type="button">
                다시 지정 저장
              </button>
              <button className="mockup-secondary-button mockup-block-button" type="button">
                다시 지정 취소
              </button>
            </section>

            <section className="mockup-note-card">
              <p className="mockup-card-kicker">입력 안내</p>
              <ul>
                <li>시간은 시작과 종료를 기준으로 저장됩니다</li>
                <li>같은 시간에 이미 계획이 있으면 저장되지 않습니다</li>
                <li>다시 지정은 최대 3회까지 사용할 수 있습니다</li>
              </ul>
            </section>
          </div>
        </article>

        <article className="phone-frame phone-frame-motivation">
          <div className="phone-screen">
            <header className="mockup-topbar">
              <div>
                <p className="mockup-screen-label">Motivation Screen</p>
                <h2>월간 유지 흐름</h2>
              </div>
              <button className="mockup-ghost-button" type="button">
                오늘로 돌아가기
              </button>
            </header>

            <section className="mockup-motivation-hero">
              <p className="mockup-card-kicker">May 2026</p>
              <strong>이번 달 42개를 완료했습니다</strong>
              <p>
                지난달보다 더 자주 지켰고, 놓친 일정도 다시 이어간 날이 늘었습니다.
              </p>
            </section>

            <section className="mockup-motivation-cards">
              <div className="mockup-metric-card">
                <span>완료 개수</span>
                <strong>42</strong>
              </div>
              <div className="mockup-metric-card">
                <span>완료율</span>
                <strong>76%</strong>
              </div>
              <div className="mockup-metric-card">
                <span>놓침</span>
                <strong>9</strong>
              </div>
            </section>

            <section className="mockup-streak-card">
              <div>
                <p className="mockup-card-kicker">Highlight</p>
                <strong>7일 연속 유지</strong>
                <p>하루 완료율 60% 이상을 일주일 연속으로 지켰습니다.</p>
              </div>
              <div className="mockup-streak-badge">7D</div>
            </section>

            <section className="mockup-calendar-card">
              <div className="mockup-section-head">
                <h3>이번 달 흐름</h3>
                <span>좋음, 보통, 회복 필요의 3단계로 빠르게 읽습니다.</span>
              </div>
              <div className="mockup-calendar-grid">
                {motivationDays.map((day, index) => {
                  const tone =
                    index % 6 === 0 ? "watch" : index % 4 === 0 ? "mid" : "good";

                  return (
                    <span
                      className={`mockup-calendar-day mockup-calendar-day-${tone}`}
                      key={day}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </section>

            <section className="mockup-recovery-metrics">
              <div className="mockup-recovery-metric-card">
                <span>재지정 후 완료</span>
                <strong>6개</strong>
                <p>놓친 뒤에도 다시 이어간 흐름을 분리해서 봅니다.</p>
              </div>
              <div className="mockup-recovery-metric-card">
                <span>회고 저장</span>
                <strong>11일</strong>
                <p>실패를 기록으로 남긴 날이 쌓여 다음 수정의 근거가 됩니다.</p>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
