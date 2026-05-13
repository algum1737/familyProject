# App DailyPlan Migration

## Goal

현재 웹 MVP의 `DailyPlan` 중심 구조를, 앱 전환과 월간 동기부여 요구에 맞는 날짜 기반 기록 구조로 점진 이행하는 순서를 고정한다.

이 문서는 실제 코드 변경 전에 `무엇을 먼저 바꾸고, 무엇은 잠시 유지할지`를 정리하기 위한 계획 문서다.

## Current State

현재 기본 타입:

```ts
type DailyPlan = {
  id: string;
  title: string;
  color: string;
  startMinute: number;
  endMinute: number;
  rescheduleCount: number;
  sourcePlanId?: string;
  reflectionNote?: string;
  status: PlanStatus;
};
```

이 구조는 오늘 화면과 웹 MVP에는 충분하지만, 아래 요구에는 부족하다.

- 날짜별 누적 저장
- 월간 동기부여 지표
- 날짜 범위 selector
- 앱 저장소 분리

## Migration Principle

- `DailyPlan`을 한 번에 삭제하지 않는다.
- 먼저 `DatedPlanRecord`를 추가하고, `DailyPlan`은 오늘 화면 호환 타입으로 잠시 유지한다.
- 화면보다 selector와 저장 계약부터 바꾼다.
- 웹 MVP를 깨지 않는 상태로 앱 타입을 늘린다.

## Target Shape

장기적으로는 아래 방향을 목표로 한다.

```ts
type PlanDateKey = "YYYY-MM-DD";

type DatedPlanRecord = DailyPlan & {
  date: PlanDateKey;
};
```

그리고 저장/조회는:

- 오늘 화면: 특정 `date`의 계획 목록
- 월간 화면: 날짜 범위의 `DatedPlanRecord`

기준으로 움직인다.

## Stage Plan

### Stage 0: Document Freeze

현재 상태:

- 타입 초안 있음
- selector 초안 있음
- 저장 계약 개정 방향 있음

목적:

- 코드 변경 전에 목표 타입과 순서를 흔들리지 않게 한다

### Stage 1: Additive Type Introduction

할 일:

- `PlanDateKey` 추가
- `DatedPlanRecord` 추가
- `PlannerRecordMap` 추가

유지할 것:

- 기존 `DailyPlan`
- 기존 `PlansStore`

원칙:

- 이 단계에서는 기존 웹 호출부를 깨지 않는다
- 새 타입은 앱 전환용 확장 타입으로만 먼저 도입한다

### Stage 2: Selector Input Migration

할 일:

- 월간 selector는 `DatedPlanRecord[]` 또는 `PlannerRecordMap`만 받게 한다
- 오늘 selector도 `date` 입력을 받는 구조를 추가한다

유지할 것:

- 기존 웹 화면이 `DailyPlan[]`를 다루는 경로

원칙:

- 날짜 기반 계산은 새 selector 경로에서만 먼저 시작한다

### Stage 3: Store Contract Bridge

할 일:

- 저장소 내부 값은 날짜 기반 누적 구조를 담을 수 있게 설계
- 외부 웹 인터페이스는 잠시 `DailyPlan[]` 호환 유지

예시:

- 웹 `load()`는 오늘 날짜 계획만 꺼내 반환
- 앱/selector 계층은 누적 기록 접근 함수를 별도 사용

목적:

- 저장 구조는 바꾸되, UI는 한 번에 안 깨뜨린다

### Stage 4: Today Screen Input Migration

할 일:

- 오늘 화면 core view-model 입력을 `DatedPlanRecord[]` 기준으로 이동
- 웹 presentation 계층은 이 결과를 계속 렌더링

원칙:

- 사용자 화면은 거의 안 바뀌고, 내부 입력 타입만 바뀌게 한다

### Stage 5: App Store Split

할 일:

- `TodayPlansStore`
- `PlannerRecordsStore`

개념을 실제 코드에 도입

시점:

- 앱 프로젝트 초기화 이후
- 월간 화면과 오늘 화면이 모두 실제로 붙기 시작할 때

### Stage 6: DailyPlan Demotion

할 일:

- `DailyPlan`을 핵심 저장 모델에서 내린다
- 필요하면 `TodayPlanView` 같은 today-specific 타입으로 축소한다

주의:

- 이 단계는 가장 나중이다
- 웹 호환 경로와 앱 core가 충분히 안정된 뒤에만 연다

## Compatibility Rules

점진 이행 중에는 아래를 지킨다.

1. 기존 웹 UI는 당분간 `DailyPlan[]` 호환 경로를 유지한다.
2. 새 월간 selector는 `date` 없는 타입을 받지 않는다.
3. 저장소 raw shape는 화면에 직접 노출하지 않는다.
4. `sourcePlanId`, `rescheduleCount`, `reflectionNote`는 절대 잃지 않는다.
5. 관찰 로그는 제품 기록 타입과 분리 유지한다.

## Risk Points

주의해야 할 지점:

- `DailyPlan`과 `DatedPlanRecord`가 한동안 공존해 타입 혼동이 생길 수 있다
- 저장소 브리지 단계에서 today-only path와 range path가 어색해질 수 있다
- 웹 테스트가 `DailyPlan` 전제에 강하게 묶여 있으면 이행 비용이 커진다

대응:

- 타입 이름을 분명히 나눈다
- selector 입력 타입을 빨리 고정한다
- migration 단계별로 테스트 경계도 같이 조정한다

## First Code Changes When Starting

실제 작업 시작 시 첫 변화는 아래 순서가 맞다.

1. `src/domains/plans/types.ts`에 additive 타입 추가
2. 월간 selector 파일 생성
3. 날짜 키 유틸 추가
4. 저장소 브리지 초안 추가
5. core view-model 입력 타입 일부 교체

## Ready To Start Condition

아래가 충족되면 실제 코드 이행에 들어갈 수 있다.

- 타입 초안 있음
- selector 초안 있음
- 저장소 방향 있음
- 경계 문서 있음
- 파일 배치안 있음

현재 상태:

- 위 조건은 모두 충족됐다

## Follow-up

이 문서 다음 순서는 아래다.

1. 앱 초기화 브랜치에서 폴더 뼈대 생성 여부 결정
2. 타입 추가만 하는 최소 코드 변경 묶음 설계
3. 월간 selector 첫 코드 초안 작성
