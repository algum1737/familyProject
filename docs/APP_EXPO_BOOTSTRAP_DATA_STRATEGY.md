# Expo Bootstrap Data Strategy

## Goal

Expo 프리뷰 런타임에서 쓰는 demo seed와 실제 앱 부트스트랩 데이터를 명확히 분리한다.

핵심은 두 가지다.

1. 프리뷰를 보기 위한 seed는 개발 보조 장치로만 남긴다.
2. 실제 앱 런타임은 저장소 복구, 마이그레이션, 빈 상태 초기화를 별도 경로로 가진다.

## Current State

현재 Expo 프리뷰는 아래 계층으로 나뉘어 있다.

- `use-expo-planner-state`
  - 저장, 상태 보관, 제출/토글/회고 저장 같은 상태 전이 적용
- `use-expo-planner-actions`
  - 편집 시작, 회고 진입, 다시 지정 진입, 리마인드 닫기 같은 UI 액션
- `use-expo-planner-flow`
  - `today -> editor -> reflection -> motivation` 이동 규칙
- `expo-planner-screen-registry`
  - 화면별 props 조립과 렌더링 분기
- `expo-planner-preview-seed`
  - 프리뷰용 demo records와 날짜 key helper
- `expo-planner-preview-presentation`
  - 프리뷰 표시용 문구와 plan item view 조립

이 구조에서 `seed`는 이미 별도 파일로 분리돼 있지만, 아직 실제 앱 부트스트랩 전략 문서는 없었다.

## Rules

### Rule 1

프리뷰 seed는 제품 데이터가 아니다.

- `apps/expo/src/app-shell/expo-planner-preview-seed.ts`는 오직 preview shell에서만 사용한다.
- 실제 앱 root 또는 실제 navigator에서는 이 seed를 직접 import하지 않는다.

### Rule 2

실제 앱 부트스트랩은 아래 우선순위를 따른다.

1. `AsyncStorage`에 저장된 `PlannerRecordMap`
2. 필요한 경우 legacy `PlansStore` 데이터 마이그레이션
3. 아무 데이터가 없으면 빈 상태 초기화

즉, 실제 앱은 demo seed 없이도 정상 시작 가능해야 한다.

### Rule 3

debug fixture는 seed와 분리한다.

- preview shell용 seed는 항상 고정 예시 데이터다.
- 실제 앱에서 QA나 개발 편의를 위해 fixture를 넣고 싶다면 별도 debug flag 경로를 만든다.
- 이 debug fixture는 production 기본 경로에 포함하지 않는다.

### Rule 4

shared 상태 전이 helper는 순수 함수로 유지한다.

현재 기준:

- `src/features/planner/core/planner-state-transitions.ts`

여기에는 아래만 들어간다.

- 제출
- 완료 토글
- 회고 저장
- 다시 지정 계산
- form 값 초기화/생성

여기에는 아래가 들어가면 안 된다.

- 화면 이동
- 리마인드 닫기
- provider 호출
- `setState` 호출
- seed 선택

### Rule 5

Expo actions는 shared helper 위에 얹는 UI 계층으로 유지한다.

즉, `use-expo-planner-actions`는 아래를 담당한다.

- 어떤 전이를 언제 호출할지 결정
- 실패 결과를 Expo state error에 반영
- 편집/회고 모드 전환
- reminder dismissal state 갱신

반대로 아래는 맡지 않는다.

- 월간 selector 계산
- 프리뷰 seed 생성
- 화면 registry 렌더링

## Data Source Split

### Preview Path

현재 preview path는 아래 흐름을 따른다.

1. record store를 읽는다.
2. 비어 있으면 `expo-planner-preview-seed`의 demo records를 넣는다.
3. 그 데이터를 오늘 화면, 편집, 회고, 동기 화면 검증에 쓴다.

이 경로는 개발용이다.

### Real App Path

실제 앱 root에서는 아래 흐름으로 바뀌어야 한다.

1. record store를 읽는다.
2. legacy plans 데이터가 있으면 날짜 기반 record로 승격한다.
3. 그래도 비어 있으면 빈 planner state로 시작한다.
4. 필요할 때만 onboarding 또는 empty-state guide를 보여준다.

즉, 실제 앱은 demo data를 자동 주입하지 않는다.

## Recommended Next Implementation

실제 앱 초기화로 넘어갈 때는 아래 순서를 권장한다.

1. `use-expo-app-bootstrap` 또는 유사한 boot hook 추가
2. 이 hook에서 record store restore / legacy migration / empty init 처리
3. preview shell은 계속 별도 seed 경로 유지
4. 실제 app root는 preview seed import 금지

## Guardrails

코드 리뷰와 이후 작업에서 아래를 확인한다.

- 실제 앱 root가 `expo-planner-preview-seed`를 import하지 않는지
- shared transition helper가 UI navigation을 직접 모르도록 유지되는지
- preview 전용 문구 helper가 production-critical core 계산으로 역유입되지 않는지
- `AsyncStorage` 복구 실패 시에도 빈 상태 시작이 가능한지

## Immediate Impact

이 문서 기준으로 다음 구현 단계는 분명하다.

- preview는 계속 빠르게 검증하는 개발 셸로 유지
- 실제 앱 부트스트랩은 별도 hook/entry에서 설계
- shared core는 순수 계산 유지
- Expo actions는 UI orchestration까지만 담당
