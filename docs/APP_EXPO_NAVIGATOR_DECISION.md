# Expo Navigator Decision

## Goal

Expo 앱에 실제 네비게이터 라이브러리를 붙이기 전에, 어떤 라이브러리를 채택할지와 도입 순서를 고정한다.

이 문서는 아래를 결정한다.

- `expo-router`와 `react-navigation` 중 무엇을 기본안으로 쓸지
- 현재 `tab + overlay` 계약과 어떤 쪽이 더 잘 맞는지
- 지금 코드베이스에서 어떤 순서로 도입해야 리스크가 낮은지

## Candidates

### Option A: `expo-router`

특징:

- Expo 환경에 맞춘 파일 기반 라우팅
- 내부적으로 React Navigation 위에 구축
- Expo 문서와 예시 흐름이 더 직접적

### Option B: `react-navigation`

특징:

- React Native 생태계에서 널리 쓰이는 직접 네비게이션 조합 방식
- stack, tabs, modal을 수동으로 더 세밀하게 조립 가능

## Current Project Constraints

현재 앱 구조는 아래 전제를 가진다.

1. 기본 실행 화면은 `today`
2. `motivation`은 동등 depth의 반복 방문 탭
3. `editor`, `reflection`은 짧은 보조 흐름
4. 편집 상태, 회고 draft, 리마인드 상태는 navigator state가 아니라 shared state가 소유
5. Expo preview shell과 real app shell이 이미 `tab + overlay` 모델을 먼저 검증하고 있다

즉, 지금 중요한 것은 “복잡한 네비게이터 기능”보다 “현재 route/state 계약을 최소 마찰로 실제 런타임에 옮기는 것”이다.

## Decision

현재 기준 기본 채택안은 `expo-router`다.

## Why `expo-router`

### 1. Expo 전환 경로와 더 자연스럽다

이 프로젝트는 이미 Expo SDK를 기준으로 실제 앱 런타임을 만들고 있다.

현재 상태:

- Expo bootstrap shell 존재
- Expo AsyncStorage provider 존재
- Expo notifications provider 초안 존재
- Expo real app root와 preview root 분리 완료

이 상황에서는 Expo 도구 체인과 가장 가깝게 붙는 `expo-router`가 초기 마찰이 적다.

### 2. 현재 route contract와 잘 맞는다

이미 문서로 고정한 구조:

- tabs
  - `today`
  - `motivation`
- overlay routes
  - `editor`
  - `reflection`

이 구조는 파일 기반 route group으로 옮기기 쉽다.

예:

- `app/(tabs)/today.tsx`
- `app/(tabs)/motivation.tsx`
- `app/editor.tsx`
- `app/reflection.tsx`

### 3. shared state를 그대로 두기 쉽다

우리는 navigator가 아래 상태를 직접 가지지 않게 하려 한다.

- 편집 form
- 회고 draft
- 리마인드 표시 상태
- 현재 계획 계산

`expo-router`는 route 구조만 옮기고, shared state는 지금처럼 shell/model 계층에 계속 둘 수 있다.

즉, 현재 `use-expo-app-model`, `use-expo-planner-actions`, `use-expo-planner-flow`를 한 번에 버리지 않고 adapter처럼 점진 이행하기 쉽다.

### 4. 지금 단계에서는 세밀한 수동 제어보다 도입 단순성이 더 중요하다

`react-navigation`은 유연하지만, 현재 단계에서는 직접 stack/tab/modal wiring을 더 많이 작성해야 한다.

이 프로젝트는 아직:

- 실제 알림 연결
- 원형 시간판 시각 품질
- app shell과 preview shell 공용 계산 정리

같은 더 중요한 일이 남아 있다.

그래서 초기 navigator 도입 비용은 낮을수록 좋다.

## Why Not `react-navigation` First

`react-navigation`이 틀린 선택은 아니다.

다만 지금 바로 기본안으로 채택하지 않는 이유는 아래와 같다.

### 1. 수동 조립 비용이 더 든다

현재 구조를 stack + tabs + overlay modal로 직접 조립할 수는 있다.
하지만 지금 단계에서는 그 자유도가 제품 리스크를 줄이기보다 설정 비용으로 돌아올 가능성이 높다.

### 2. Expo 문맥에서 추가 추상화 이점이 약하다

우리는 이미 Expo 환경에 올라와 있다.
이 상황에서는 `expo-router`가 제공하는 파일 기반 진입 구조가 더 직접적이다.

### 3. 지금 필요한 것은 “고급 내비게이션”보다 “점진 이행”이다

현재 핵심은:

- preview shell -> real app shell
- shell state -> route adapter
- route contract -> 실제 라우트 파일

이 세 단계를 낮은 리스크로 밟는 것이다.

## Migration Order

실제 도입 순서는 아래를 권장한다.

### Step 1

route key와 route param constants를 코드로 고정한다.

예:

- `today`
- `motivation`
- `editor`
- `reflection`

그리고:

- `editor.mode`
- `editor.planId`
- `reflection.planId`

shape를 타입으로 만든다.

### Step 2

`expo-router` 파일 구조를 추가하되, 기존 shell/model 계층은 유지한다.

초기 목표:

- route file은 thin adapter
- 실제 계산은 기존 shell/model 계층 재사용

### Step 3

현재 `use-expo-planner-flow`를 router adapter로 점진 치환한다.

즉:

- tab select -> router push/replace
- overlay open -> route present/push
- save/cancel return -> router back or replace

### Step 4

preview shell은 계속 개발용으로 남긴다.

즉:

- preview shell 제거하지 않음
- real app router와 분리 유지

이유:

- preview는 fixture 기반 빠른 UI 검증용
- real app은 저장소 복구 기반 실제 동작 검증용

## Guardrails

`expo-router` 도입 시 아래는 유지한다.

1. route param에 form 전체를 넣지 않는다
2. shared state를 navigator state로 승격하지 않는다
3. `today`를 앱 기본 진입점으로 유지한다
4. `motivation`만 독립 탭으로 유지한다
5. `editor`, `reflection`은 overlay 성격을 유지한다

## Reconsideration Trigger

아래 상황이면 `react-navigation` 재검토가 가능하다.

1. nested stack/tab/modal 제어가 `expo-router`에서 과도하게 우회적으로 느껴질 때
2. deep linking/custom transition 요구가 크게 늘어날 때
3. navigator 상태를 세밀하게 제어해야 하는 복합 흐름이 늘어날 때

현재 단계에서는 아직 해당하지 않는다.

## Final Recommendation

현재 프로젝트의 첫 실제 navigator 도입안은 `expo-router`다.

이유를 한 줄로 줄이면:

Expo 기반 앱 전환, 현재의 `2 tabs + 2 overlays` 계약, shared state 유지 전략을 가장 적은 마찰로 연결할 수 있기 때문이다.

## Immediate Follow-up

다음 구현 순서는 아래가 맞다.

1. route/state constants 추가
2. `expo-router` 파일 구조 초안 추가
3. `ExpoAppShell`의 tab/overlay 전환을 router adapter로 치환
