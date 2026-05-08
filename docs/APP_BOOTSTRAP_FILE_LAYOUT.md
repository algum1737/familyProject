# App Bootstrap File Layout

## Goal

앱 프로젝트 초기화 시 첫 커밋에서 어떤 폴더와 파일을 만들지, 그리고 무엇을 웹에서 재사용하고 무엇을 앱에서 새로 만들지 파일 단위로 고정한다.

이 문서는 실제 앱 초기화 작업 직전의 실행용 배치안이다.

## Principle

- 첫 커밋은 `모든 기능 구현`이 아니라 `재사용 경계가 드러나는 구조`를 만드는 것이 목적이다.
- 앱 프로젝트를 만들더라도 웹 폴더를 바로 지우지 않는다.
- 공용 타입, selector, provider 계약이 먼저 보이게 배치한다.

## Root Layout Draft

앱 초기화 직후 목표 구조는 아래다.

```text
src/
  app/
  domains/
  providers/
  shared/
  features/
    planner/
      core/
      web/
      app/
```

의미:

- `domains/`: 순수 도메인 규칙, 날짜 모델, selector
- `providers/`: 저장소, 알림, 시간, 라벨 계약과 구현
- `shared/`: 시간 유틸 등 범용 도구
- `features/planner/core`: 앱과 웹이 같이 쓰는 상태 전이/view-model core
- `features/planner/web`: 현재 Next.js 웹 UI
- `features/planner/app`: 새 React Native UI

## First Files To Create

### 1. Domain

처음부터 분명히 있어야 하는 파일:

```text
src/domains/plans/
  types.ts
  service/planner.ts
  selectors/
    daily-summary.ts
    monthly-motivation-summary.ts
    monthly-calendar-status.ts
    recovery-contribution-summary.ts
```

의도:

- 타입과 selector를 앱 초기화 첫날부터 공용 계층으로 분명히 보이게 한다

### 2. Providers

```text
src/providers/plans/
  plans-store.ts
  local-plans.ts
  async-plans.ts

src/providers/reminders/
  reminder-provider.ts
  noop-reminder-provider.ts
  expo-local-reminder-provider.ts

src/providers/time/
  time-source.ts

src/providers/labels/
  planner-label-settings.ts
  local-planner-label-settings.ts
```

의도:

- 웹 구현과 앱 구현을 같은 계약 아래 나란히 두되, 이름으로 플랫폼 차이가 드러나게 한다

### 3. Planner Core

```text
src/features/planner/core/
  planner-core-view-model.ts
  planner-reminder-rules.ts
  planner-recovery-rules.ts
  planner-state-machine.ts
```

의도:

- 현재 `use-planner-state.ts`, `use-planner-view-model.ts`, 배너 규칙 중 공용 부분을 옮길 목표 지점

### 4. Web UI

```text
src/features/planner/web/
  circular-planner.tsx
  planner-shell.tsx
  planner-web-presentation.ts
  planner-web-observation.ts
  dev-time-controls.tsx
```

의도:

- 웹 전용 표현과 diagnostics를 명시적으로 묶는다

### 5. App UI

```text
src/features/planner/app/
  screens/
    today-screen.tsx
    plan-editor-screen.tsx
    reflection-screen.tsx
    motivation-screen.tsx
  components/
    start-reminder-banner.tsx
    end-recovery-banner.tsx
    recovery-detail-sheet.tsx
```

의도:

- 앱 화면과 앱 전용 컴포넌트가 첫날부터 분리돼 보이게 한다

## What Moves First

앱 초기화 시점에 가장 먼저 옮길 것은 아래다.

1. 날짜 포함 타입 초안
2. 월간 selector
3. planner core 계산
4. 앱 저장소 provider
5. 앱 시작 리마인드 provider

즉, UI보다 먼저 `타입 -> selector -> core -> provider` 순서가 보이게 만드는 편이 맞다.

## What Stays Where

### Keep In Web For Now

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/pages/_document.tsx`
- 웹 시안 `/app-mockup`
- 개발 하네스 관련 파일

이유:

- 앱 초기화와 직접 충돌하지 않는다
- 웹 MVP는 여전히 검증/참조 하네스로 남는다

### Create In App Layer Instead Of Moving

- 앱 Today Screen
- 앱 Plan Editor Screen
- 앱 Motivation Screen
- 앱 Recovery Sheet

이유:

- 이들은 재사용이 아니라 새 구현 대상이다

## Minimal First Commit Shape

앱 초기화 첫 커밋에서 모든 로직을 옮길 필요는 없다.

최소 기준:

1. 앱 폴더 구조 생성
2. provider 계약과 앱 구현 파일 자리 생성
3. core/view-model 자리 생성
4. 앱 화면 placeholder 생성
5. 문서와 실제 폴더 구조 일치 확인

즉, 첫 커밋은 “빈 앱이지만 경계가 맞는 상태”를 만드는 데 집중한다.

## Recommended Commit Sequence

### Commit 1

- 앱 폴더 뼈대
- provider 파일 자리
- core 파일 자리

### Commit 2

- 날짜 기반 타입 초안 도입
- selector 초안 도입

### Commit 3

- 앱 Today Screen placeholder
- 앱 Motivation Screen placeholder
- 앱 저장소 provider placeholder

### Commit 4

- core view-model 첫 연결
- 앱 화면에서 core selector 연결

## What To Avoid

- 앱 초기화 첫날에 웹 UI를 바로 갈아엎기
- 앱 폴더를 만들면서 공용 로직을 다시 복붙하기
- 앱 화면부터 먼저 만들고 selector는 나중에 붙이기
- `use-planner-view-model`을 그대로 앱으로 가져가기

## Ready Check

아래가 만족되면 앱 초기화 작업에 들어갈 수 있다.

- 화면 구조 문서 있음
- 저장소 방향 문서 있음
- 날짜 기반 모델 문서 있음
- selector 문서 있음
- 알림 문서 있음
- 경계 문서 있음
- 타입 초안 있음
- view-model split 초안 있음
- 첫 파일 배치안 있음

현재 상태:

- 위 조건은 모두 문서로 충족됐다.

## Follow-up

이 문서 다음 순서는 아래다.

1. 기존 `DailyPlan` 점진 이행 계획 정리
2. 실제 앱 초기화 브랜치에서 폴더 뼈대 생성
3. selector와 core 첫 파일 생성
