# App Type Draft

## Goal

앱 전환 전 필요한 핵심 타입 이름과 책임 범위를 고정한다.

이 문서는 아직 실제 코드 변경이 아니라, `date` 포함 기록 모델, selector 출력 타입, 오늘 화면과 월간 화면 view-model 입력 타입을 어떤 이름으로 둘지 정리하기 위한 초안이다.

## Type Design Principle

- 현재 웹 타입은 가능한 한 보존한다.
- 앱 전환과 월간 동기부여 요구는 별도 확장 타입으로 먼저 연다.
- selector 출력은 화면 친화적이어야 하고, raw 저장 구조를 노출하지 않아야 한다.
- 플랫폼 UI 타입과 도메인 타입을 섞지 않는다.

## Existing Base Types

현재 코드 기준 기본 타입:

- `PlanStatus`
- `DailyPlan`
- `PlannerSummary`

이 타입들은 웹 MVP의 오늘 화면 기준으로는 충분하지만, 날짜 기반 누적 기록과 월간 selector에는 부족하다.

## Proposed Domain Types

### 1. `PlanDateKey`

역할:

- 하루를 식별하는 문자열 키

권장 형식:

- `YYYY-MM-DD`

이유:

- 저장 키와 selector 입력 모두에서 가장 단순하다
- 로컬 정렬과 범위 비교가 쉽다

### 2. `DatedPlanRecord`

역할:

- 날짜가 포함된 앱 전환용 계획 기록 타입

초안:

```ts
type DatedPlanRecord = DailyPlan & {
  date: PlanDateKey;
};
```

원칙:

- 기존 `DailyPlan`을 깨지 않고 확장한다
- 월간 집계와 날짜 범위 조회의 최소 단위로 사용한다

### 3. `DailyPlanCollection`

역할:

- 특정 날짜 계획 집합

초안:

```ts
type DailyPlanCollection = {
  date: PlanDateKey;
  plans: DatedPlanRecord[];
};
```

원칙:

- 저장소가 날짜별 문서 구조로 갈 경우 기본 단위가 된다

### 4. `PlannerRecordMap`

역할:

- 날짜를 키로 한 누적 계획 맵

초안:

```ts
type PlannerRecordMap = Record<PlanDateKey, DatedPlanRecord[]>;
```

원칙:

- `AsyncStorage` 초기안에서 가장 다루기 쉬운 누적 저장 구조 후보
- 이후 `SQLite` 전환 시에도 selector 입력 표준으로 유지 가능

## Selector Output Types

### 1. `DailySummary`

역할:

- 특정 날짜 요약 카드 출력

초안:

```ts
type DailySummary = {
  date: PlanDateKey;
  plannedCount: number;
  completedCount: number;
  missedCount: number;
  completionRate: number;
  rescheduledCount: number;
  completedAfterRescheduleCount: number;
  reflectionCount: number;
};
```

### 2. `MonthlyMotivationSummary`

역할:

- 월간 동기부여 화면 상단 카드 출력

초안:

```ts
type MonthlyMotivationSummary = {
  monthKey: string;
  completedCount: number;
  completionRate: number;
  missedCount: number;
  completedAfterRescheduleCount: number;
  streakDays: number;
};
```

### 3. `CalendarDayTone`

역할:

- 월간 캘린더의 날짜 상태

초안:

```ts
type CalendarDayTone = "good" | "mid" | "watch";
```

### 4. `MonthlyCalendarDay`

역할:

- 캘린더 한 칸 렌더링용 출력

초안:

```ts
type MonthlyCalendarDay = {
  date: PlanDateKey;
  dayOfMonth: number;
  tone: CalendarDayTone;
  completionRate: number;
};
```

### 5. `RecoveryContributionSummary`

역할:

- 회복 흐름 성과 카드 출력

초안:

```ts
type RecoveryContributionSummary = {
  monthKey: string;
  completedAfterRescheduleCount: number;
  reflectionDays: number;
};
```

## View-Model Input Types

### 1. `TodayPlannerViewModelInput`

역할:

- 오늘 화면 공용 view-model 입력

초안:

```ts
type TodayPlannerViewModelInput = {
  date: PlanDateKey;
  plans: DatedPlanRecord[];
  now: Date;
  labelSettings: PlannerLabelSettings;
};
```

### 2. `MotivationViewModelInput`

역할:

- 월간 동기부여 화면 공용 view-model 입력

초안:

```ts
type MotivationViewModelInput = {
  monthKey: string;
  records: PlannerRecordMap;
};
```

원칙:

- 화면은 `PlannerRecordMap` 전체를 직접 다루기보다 selector 결과를 우선 받는다
- 다만 view-model 레벨 입력 초안은 이 정도 범위까지 허용 가능하다

## Store Contract Draft Types

### Current-Compatible

```ts
type TodayPlansStore = {
  load(date: PlanDateKey): DatedPlanRecord[] | null;
  save(date: PlanDateKey, plans: DatedPlanRecord[]): void;
};
```

### Next-Step History Store

```ts
type PlannerRecordsStore = {
  loadByDate(date: PlanDateKey): DatedPlanRecord[] | null;
  loadRange(startDate: PlanDateKey, endDate: PlanDateKey): PlannerRecordMap;
  saveForDate(date: PlanDateKey, plans: DatedPlanRecord[]): void;
};
```

주의:

- 이 타입들은 아직 실제 코드 계약 확정안이 아니다
- 현재 문서 목적은 이름과 책임 범위를 먼저 고정하는 데 있다

## Keep Separate

아래는 이 타입 초안에 섞지 않는다.

- React component props
- CSS class names
- test id
- observation diagnostics 전용 타입
- Expo 알림 라이브러리의 실제 payload 타입

## Recommended Adoption Order

1. `PlanDateKey`, `DatedPlanRecord`, `PlannerRecordMap`
2. `DailySummary`, `MonthlyMotivationSummary`
3. `MonthlyCalendarDay`, `RecoveryContributionSummary`
4. `TodayPlansStore`, `PlannerRecordsStore`
5. 이후 core view-model 입력 타입

## Follow-up

이 문서 다음 순서는 아래다.

1. `use-planner-view-model`을 core / web presentation으로 나누는 초안
2. 앱 프로젝트 초기화 시 첫 파일 배치안 정리
3. 실제 타입 도입 시 기존 `DailyPlan`을 어떻게 점진 이행할지 계획 정리
