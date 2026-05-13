# App Selector And Store Evolution

## Goal

월간 동기부여 페이지와 날짜 기반 기록을 실제 코드로 연결하기 위한 `selector` 계층과 저장 계약 개정 방향을 정리한다.

이 문서는 화면이 저장소를 직접 해석하지 않게 만들고, 이후 `AsyncStorage -> SQLite` 전환 비용을 낮추는 목적을 가진다.

## Why This Layer Is Needed

현재는 `PlansStore`가 `DailyPlan[]`를 그대로 읽고 저장하는 매우 얇은 구조다.

하지만 월간 화면이 들어오면 화면이 직접 해야 하는 계산이 급격히 늘어난다.

예:

- 이번 달 완료 개수
- 이번 달 완료율
- 일별 `missed` 집계
- 재지정 후 완료 개수
- 연속 달성 일수

이 계산을 화면 컴포넌트에서 직접 하면 아래 문제가 생긴다.

- 웹과 앱에서 같은 계산이 중복된다.
- 저장 모델이 바뀌면 화면 코드가 함께 깨진다.
- `AsyncStorage`에서 `SQLite`로 갈 때 화면 수정 범위가 커진다.

## Selector Rule

화면은 저장소 raw value를 직접 조립하지 않는다.

반드시 아래 계층을 거친다.

1. 저장소 provider
2. 도메인 모델 정규화
3. selector 또는 집계 함수
4. 화면 view-model

즉, 월간 화면은 `plans`를 직접 순회하지 않고, `getMonthlyMotivationSummary(...)` 같은 selector 결과만 받는 구조가 맞다.

## First Selector Set

초기 월간 화면을 위해 필요한 selector는 아래 정도면 충분하다.

### 1. `getPlansByDate`

입력:

- 날짜
- 날짜 기반 계획 기록 집합

출력:

- 해당 날짜 계획 목록

목적:

- 오늘 화면과 특정 날짜 화면의 기본 진입 selector

### 2. `getDailySummary`

입력:

- 특정 날짜 계획 목록

출력:

- `plannedCount`
- `completedCount`
- `missedCount`
- `completionRate`
- `rescheduledCount`
- `completedAfterRescheduleCount`
- `reflectionCount`

목적:

- 하루 요약 카드와 일별 캘린더 상태 계산

### 3. `getMonthlyMotivationSummary`

입력:

- 대상 월
- 날짜 기반 계획 기록 집합

출력:

- `completedCount`
- `completionRate`
- `missedCount`
- `completedAfterRescheduleCount`
- `streakDays`

목적:

- 월간 동기부여 화면 상단 핵심 카드

### 4. `getMonthlyCalendarStatus`

입력:

- 대상 월
- 날짜 기반 계획 기록 집합

출력:

- 날짜별 `good | mid | watch`

목적:

- 월간 캘린더 요약 렌더링

### 5. `getRecoveryContributionSummary`

입력:

- 대상 월
- 날짜 기반 계획 기록 집합

출력:

- `completedAfterRescheduleCount`
- `reflectionDays`

목적:

- 이 제품의 차별점인 `놓쳐도 다시 이어가기` 흐름을 별도 카드로 보여주기

## Proposed Domain Shape

현재 `DailyPlan`은 날짜 정보가 없다.

월간 화면을 위해서는 최소한 아래 방향으로 가야 한다.

### Current

- `DailyPlan`
  - 시간
  - 상태
  - 재지정
  - 회고

### Next

- `DatedPlanRecord`
  - `date`
  - 기존 `DailyPlan` 필드

권고:

- 기존 `DailyPlan`을 바로 깨기보다, 앱 전환 전용 모델 초안으로 `DatedPlanRecord`를 먼저 문서화하고 점진적으로 옮긴다.

## Store Contract Evolution

현재 계약:

- `load(): DailyPlan[] | null`
- `save(plans: DailyPlan[]): void`

월간 동기부여를 넣은 뒤에도 당장 이 형태를 억지로 깨지는 않아도 된다.

다만 다음 단계 개정 방향은 분명히 잡아야 한다.

### Stage 1

현재 계약 유지 + 저장 값만 날짜 기반 누적 구조로 확장

예시 방향:

- `load()`가 내부적으로 날짜 기반 문서를 읽고, 오늘 날짜 기준 계획만 꺼내 반환
- 별도 selector 계층은 전체 날짜 기록 접근용 저장 값을 참조

한계:

- `PlansStore`만으로는 오늘 화면과 월간 화면 요구를 동시에 깔끔하게 설명하기 어렵다

### Stage 2

앱용 저장 계약을 둘로 분리

- `TodayPlansStore`
- `PlanHistoryStore` 또는 `PlannerRecordsStore`

예시 역할:

- `TodayPlansStore`: 오늘 날짜 기준 계획 읽기/저장
- `PlannerRecordsStore`: 날짜 범위 기록 읽기/저장, 월간 집계 입력 제공

권고:

- 현재는 문서로만 방향을 고정한다
- 실제 앱 초기화 직전 또는 날짜 필드 도입 시점에 계약 분리를 검토한다

### Stage 3

`SQLite` 전환 시 저장 계약은 날짜/범위 조회 중심으로 개정

예시:

- `loadByDate(date)`
- `loadRange(startDate, endDate)`
- `saveForDate(date, plans)`

이 단계는 월간 페이지와 날짜 누적 기록이 실제 사용 흐름으로 굳었을 때만 연다.

## Recommended Near-Term Implementation

현재 기준 실무 순서는 아래가 맞다.

1. 날짜 기반 모델 초안 유지
2. 월간 selector 세트 이름과 출력 형식을 먼저 고정
3. 저장 계약은 아직 크게 깨지지 않되, 앱용 개정 방향을 문서화
4. 앱 초기 구현은 `AsyncStorage`
5. 월간 사용 흐름이 고정되면 `TodayPlansStore / PlannerRecordsStore` 분리 여부 결정

## What To Avoid

- 화면 컴포넌트에서 월간 값을 직접 계산하기
- 저장소 raw shape를 화면에서 그대로 가정하기
- 관찰 로그와 제품 기록을 같은 selector로 섞기
- 날짜 기반 요구가 생겼는데도 `오늘 배열 1개` 가정을 계속 유지하기

## Follow-up

이 문서 다음 순서는 아래다.

1. 앱 로컬 알림 구현 초안
2. 앱용 타입 초안에서 `date` 포함 모델을 어떻게 둘지 정리
3. `/app-mockup`에 월간 selector 출력 기준 설명을 더 붙일지 검토
