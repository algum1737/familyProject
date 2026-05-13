# Expo Navigation Contract

## Goal

Expo 앱에서 실제 네비게이터 라이브러리를 붙이기 전에, 화면 구조와 상태 전환 계약을 먼저 고정한다.

이 문서는 다음 질문에 답한다.

- 어떤 화면이 하단 탭인가
- 어떤 화면이 보조 흐름인가
- 각 화면이 어떤 진입 파라미터를 받는가
- 저장/취소 후 어디로 복귀하는가
- 어떤 상태는 route param이 아니라 shared state로 유지하는가

## Current Direction

현재 Expo 실제 앱 셸은 아래 구조를 가진다.

- 하단 탭
  - `today`
  - `motivation`
- 오버레이 성격 보조 화면
  - `editor`
  - `reflection`

이 구조는 `apps/expo/src/app-shell/use-expo-planner-flow.ts`에 먼저 반영돼 있다.

즉, 실제 네비게이터를 붙일 때도 `4개 독립 탭`으로 가는 것이 아니라 `2 tabs + 2 secondary routes`를 유지하는 것이 현재 계약이다.

## Route Groups

### 1. Root Tabs

#### `today`

역할:

- 하루 실행 중심 화면
- 원형 시간판
- 현재 계획
- 오늘 계획 리스트
- 시작 리마인드
- 종료 직전 `계속 진행`

이 화면은 항상 앱의 기본 진입점이다.

#### `motivation`

역할:

- 월간 동기부여와 유지 흐름 확인
- 완료율, `missed`, 회복 기여

이 화면은 `today`와 같은 depth의 탭이다.

### 2. Overlay Routes

#### `editor`

역할:

- 새 계획 추가
- 기존 계획 수정
- `missed` 일정 다시 지정

열리는 방식:

- `today`에서 push/present
- 저장 또는 취소 후 이전 실행 문맥으로 복귀

#### `reflection`

역할:

- `missed` 일정 회고 입력

열리는 방식:

- `today`에서 push/present
- 저장 또는 취소 후 이전 실행 문맥으로 복귀

## Route Params

실제 네비게이터 도입 시 route param은 최소한으로 유지한다.

### `today`

route param 없음

이유:

- 현재 날짜
- 현재 계획
- 리마인드 상태
- 오늘 계획 목록

은 모두 shared state와 time source에서 계산 가능하다.

### `motivation`

route param 없음

이유:

- 현재 월 기준 계산은 shared record store와 selector에서 바로 계산 가능하다.

### `editor`

권장 param:

- `mode`: `"create" | "edit" | "reschedule"`
- `planId`: `string | null`

규칙:

- `create`면 `planId`는 없어도 된다.
- `edit`와 `reschedule`는 반드시 `planId`가 있어야 한다.

주의:

- 실제 form 값 전체를 route param으로 넘기지 않는다.
- form 초기값은 shared state/action 계층이 주입한다.

### `reflection`

권장 param:

- `planId`: `string`

규칙:

- 회고 대상 plan은 반드시 하나여야 한다.
- 메모 draft는 shared state에 보관한다.

## Return Rules

### Editor Return

- 저장 성공: `today`로 복귀
- 취소: 진입 전 화면으로 복귀

현재 제품 기준으로는 `today`에서만 열리므로 사실상 `today` 복귀가 기본이다.

### Reflection Return

- 회고 저장: `today`로 복귀
- 취소: `today`로 복귀

### Motivation Return

- 하단 탭 전환으로만 이동한다.
- 별도 `back` 흐름을 강하게 전제하지 않는다.

## State Ownership

네비게이터가 직접 소유하면 안 되는 상태:

- 현재 날짜/현재 시각
- 오늘 계획 배열
- 리마인드 표시 상태
- 회고 draft
- 다시 지정 모드
- 편집 form 값

이 상태는 계속 아래 계층이 소유한다.

- `use-expo-app-model`
- `use-expo-planner-state`
- `use-expo-planner-actions`
- shared selector / state transition helpers

네비게이터가 소유하는 것은 아래만으로 제한한다.

- 현재 탭
- 현재 오버레이 route
- 최소 route param

## Why Not Four Tabs

`editor`, `reflection`을 탭으로 두지 않는 이유:

- 이 둘은 탐색 허브가 아니라 짧은 작업 흐름이다.
- 사용자가 탭 이동 중에 편집 draft를 잃거나 문맥을 잊기 쉽다.
- `today` 실행 문맥 위에서 열고 닫히는 것이 더 자연스럽다.

## Why Not Pure Stack Only

`motivation`을 오버레이로 두지 않는 이유:

- 실행 화면과 다른 종류의 정기 확인 화면이다.
- 월간 유지 동기를 확인하는 별도 공간이 있어야 한다.
- 탭으로 두면 사용자가 `오늘`과 `동기`를 오가는 mental model이 더 단순하다.

## Navigator Mapping Draft

실제 라이브러리 도입 시 권장 매핑:

### Option A: `expo-router`

- `(tabs)/today`
- `(tabs)/motivation`
- `editor`
- `reflection`

### Option B: `react-navigation`

- root stack
  - `MainTabs`
  - `Editor`
  - `Reflection`
- bottom tabs inside `MainTabs`
  - `Today`
  - `Motivation`

현재 제품 기준 권고는 두 옵션 모두 가능하지만, Expo 환경에서는 `expo-router`가 초기 진입이 더 단순할 수 있다.

## Transition Conditions Before Real Navigator

실제 navigator 라이브러리 도입 전 아래가 준비돼 있어야 한다.

1. route key 이름 고정
2. overlay vs tab 구분 고정
3. `editor` / `reflection` param shape 고정
4. 저장 후 복귀 규칙 고정
5. shared state가 navigator state를 침범하지 않도록 유지

## Immediate Follow-up

이 문서 다음 구현은 아래 순서가 적절하다.

1. Expo 앱에서 사용할 route/state enum 또는 constants 정리
2. `expo-router` 또는 `react-navigation` 중 실제 채택안 결정
3. 현재 `use-expo-planner-flow`를 선택한 네비게이터 어댑터로 치환
