# App Shared And UI Boundary

## Goal

웹 MVP에서 앱 전환 시 그대로 가져갈 공용 계층과, 앱에서 새로 만들어야 할 UI 계층의 경계를 파일 수준으로 고정한다.

이 문서는 실제 앱 프로젝트 초기화 전에 어떤 파일을 재사용 후보로 보고, 어떤 파일은 웹 전용으로 남길지 판단 기준을 제공한다.

## Boundary Principle

앱에서 재사용할 것은 `렌더링 결과`가 아니라 `규칙과 상태 전이`다.

즉, 아래처럼 나눈다.

- 공용 계층: 타입, 시간 계산, 상태 규칙, 저장/알림/시간 provider 계약, selector
- 앱 전용 계층: React Native 화면, 인앱 배너 표현, 입력 위젯, 네비게이션, 네이티브 스타일
- 웹 전용 계층: SVG 렌더링, 브라우저 입력, `localStorage`, 개발 하네스

## Current Source Map

현재 파일 구조에서 핵심 후보는 아래다.

### Shared Candidates

- `src/domains/plans/types.ts`
- `src/domains/plans/service/planner.ts`
- `src/shared/time/minutes.ts`
- `src/providers/plans/plans-store.ts`
- `src/providers/reminders/reminder-provider.ts`
- `src/providers/time/time-source.ts`
- `src/providers/labels/planner-label-settings.ts`

### Web-Only Candidates

- `src/providers/plans/local-plans.ts`
- `src/providers/reminders/noop-reminder-provider.ts`
- `src/providers/labels/local-planner-label-settings.ts`
- `src/ui/planner/circular-planner.tsx`
- `src/ui/planner/dev-time-controls.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

### Mixed / Needs Refactoring

- `src/ui/planner/use-planner-state.ts`
- `src/ui/planner/use-planner-view-model.ts`
- `src/ui/planner/use-reminder-banner.ts`
- `src/ui/planner/use-end-recovery-banner.ts`
- `src/providers/reminders/reminder-observation-store.ts`
- `src/providers/recovery/recovery-highlight-observation-store.ts`

이 그룹은 일부는 공용으로 남길 수 있지만, 현재 웹 UI 문맥이 섞여 있어 분리가 더 필요하다.

## Shared Layer Target

앱 전환 기준 공용 계층은 아래 책임만 가져야 한다.

### 1. Domain

책임:

- 계획 타입
- 상태 타입
- 날짜 포함 기록 타입
- 일정 계산
- 현재 계획 판정
- 완료율 계산
- 재지정 규칙
- 월간 selector

들어갈 것:

- `DailyPlan`
- 앞으로 추가될 `DatedPlanRecord`
- `PlannerSummary`
- `getDailySummary`
- `getMonthlyMotivationSummary`
- `getMonthlyCalendarStatus`

### 2. Providers

책임:

- 저장소 계약
- 알림 계약
- 시간 소스 계약
- 라벨 설정 계약

들어갈 것:

- `PlansStore` 또는 이후 분리될 `TodayPlansStore / PlannerRecordsStore`
- `ReminderProvider`
- `TimeSource`
- `PlannerLabelSettingsStore`

### 3. Selector / View-Model Core

책임:

- 화면이 바로 쓸 수 있는 계산 결과 조립
- 저장소 raw shape 직접 노출 방지

원칙:

- React Native 화면도 같은 selector 결과를 받아야 한다
- 웹과 앱이 같은 계산을 각각 다시 쓰지 않는다

## Web-Only Layer

아래 책임은 웹에 남는다.

- SVG 기반 원형 플래너 렌더링
- 브라우저 `input type="time"` 기반 편집 폼
- `localStorage` 구현
- 개발 하네스와 시간 점프 패널
- 관찰용 시안 페이지와 웹 CSS

현재 해당 파일:

- `src/ui/planner/circular-planner.tsx`
- `src/ui/planner/dev-time-controls.tsx`
- `src/providers/plans/local-plans.ts`
- `src/app/*`

## App-Only Layer

앱에서 새로 만들어야 할 것은 아래다.

- React Native `Today Screen`
- `Plan Editor Screen`
- `Reflection Screen`
- `Motivation Screen`
- `Recovery Detail Sheet`
- 인앱 시작 리마인드 배너
- 종료 5분 전 `계속 진행` 배너
- 네이티브 저장소 provider
- 시작 리마인드용 로컬 알림 provider

이 계층은 현재 웹 파일을 복사하지 않고 새로 만든다.

## Refactoring Direction For Mixed Files

### `use-planner-state.ts`

현재 역할:

- 편집 상태
- 저장 호출
- 회고/재지정 상태

판단:

- 공용 후보가 맞다
- 다만 현재 `PlanFormState`와 웹 폼 입력 형태가 일부 강하게 묶여 있다

권고:

- 앱 공용 상태 전이 hook으로 남기되, 입력 표현은 더 중립적인 값 구조로 옮긴다

### `use-planner-view-model.ts`

현재 역할:

- 현재 계획
- 요약
- 리마인드 상태
- 화면 문구 조립
- 관찰 로그 UI 상태

판단:

- 지금 그대로는 웹 문맥이 너무 많다

권고:

- `core view-model`과 `web presentation mapping`으로 분리한다
- core는 앱과 웹 공용
- label/test id/문구 조합은 플랫폼 presentation 계층으로 남긴다

### `use-reminder-banner.ts` / `use-end-recovery-banner.ts`

판단:

- 규칙 자체는 공용 후보
- 배너 노출 상태와 UI 연결은 플랫폼 계층

권고:

- 시간 창과 대상 판정 로직은 domain/service로 이동
- hook은 플랫폼 화면 연결용 얇은 wrapper로 줄인다

### Observation Stores

판단:

- 장기 제품 핵심이 아니라 관찰/정책 점검 도구

권고:

- 앱 전환 초기에는 그대로 공용 핵심 계층에 넣지 않는다
- 필요 시 웹 전용 도구 또는 별도 diagnostics 계층으로 둔다

## Suggested Folder Evolution

앱 전환 직전 또는 초기화 시점에는 아래 구조가 자연스럽다.

```text
src/
  domains/
    plans/
      types.ts
      service/
      selectors/
  providers/
    plans/
    reminders/
    time/
    labels/
  features/
    planner/
      core/
      web/
      app/
```

의미:

- `domains/`는 순수 규칙과 selector
- `providers/`는 계약과 플랫폼별 구현
- `features/planner/core`는 공용 상태 전이와 공용 view-model
- `features/planner/web`는 현재 Next.js 웹 UI
- `features/planner/app`는 앞으로의 React Native UI

## First Extraction Order

실제 분리는 아래 순서가 맞다.

1. 날짜 기반 타입과 selector를 `domains`로 고정
2. `use-planner-view-model`에서 공용 계산과 웹 전용 문구 조립을 분리
3. 배너 시간 창 판정 로직을 hook 밖으로 이동
4. 앱용 provider 구현 추가
5. 앱용 화면에서 공용 core 계층을 연결

## Do Not Do

- `circular-planner.tsx`를 앱으로 그대로 옮기려 하지 않는다
- 웹 `localStorage` 구현을 앱 저장소 구현의 기준 코드로 직접 복사하지 않는다
- 테스트용 관찰 하네스를 앱 핵심 계층에 섞지 않는다
- 월간 selector 계산을 화면마다 다시 쓰지 않는다

## Follow-up

이 문서 다음 순서는 아래다.

1. 앱 타입 초안에서 `date` 포함 기록 모델과 selector 출력 타입 정리
2. `use-planner-view-model`을 core / web presentation으로 어떻게 쪼갤지 초안 작성
3. 앱 프로젝트 초기화 시 첫 파일 배치안 정리
