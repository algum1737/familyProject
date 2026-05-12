# App View-Model Split Draft

## Goal

현재 `use-planner-view-model.ts`를 앱과 웹이 함께 쓸 수 있는 `core` 계층과, 웹 전용 문구/표현 계층으로 어떻게 나눌지 초안을 고정한다.

이 문서는 실제 파일 이동 전에 책임 분리를 먼저 정리하기 위한 문서다.

## Problem

현재 `use-planner-view-model.ts`에는 아래가 한 파일에 함께 들어 있다.

- 현재 시각 동기화
- 정렬된 계획 계산
- 현재 계획 판정
- 요약 계산
- 시작 리마인드 상태
- 종료 5분 전 배너 상태
- 회복 강조 계산
- 상태 라벨 조립
- 섹션 제목/버튼 문구 조립
- 관찰 로그 요약
- 관찰 패널 정책 문구

이 구조는 웹 MVP 단계에서는 빠르지만, 앱 전환 시 아래 문제가 생긴다.

- 앱과 웹이 같은 계산을 재사용하기 어렵다
- 문구와 규칙이 뒤섞여 있어 파일 재사용 경계가 흐려진다
- 월간 화면까지 포함되면 view-model 책임이 더 커진다

## Split Principle

분리 기준은 단순하다.

- `규칙과 계산`은 core
- `문구와 화면 표현`은 presentation

즉, 앱과 웹이 같이 써야 하는 것은 숫자, 상태, 대상 계획, 액션 가능 여부 같은 값이다.
반대로 플랫폼별로 달라질 수 있는 것은 한국어 라벨, 버튼 이름, test id, 관찰 패널 배치다.

## Proposed Layers

### 1. `planner-core-view-model`

역할:

- 공용 계산 결과 조립

포함할 것:

- 현재 시각 기준 분 단위 값
- 정렬된 계획 목록
- 현재 계획
- 오늘 요약
- 계획별 상태 값
- 회복 강조의 `kind`
- 시작 리마인드 대상과 상태
- 종료 5분 전 대상과 상태
- 월간 selector 결과 입력 연결

포함하지 않을 것:

- 한국어 라벨 문자열
- 버튼 텍스트
- 패널 헤더 문구
- test id

### 2. `planner-web-presentation`

역할:

- 웹 렌더링용 문구와 표시 매핑

포함할 것:

- `지금`, `대기`, `완료`, `놓침` 라벨 조립
- `회고 다시 보기`, `다시 지정됨` 같은 회복 강조 문구
- 섹션 제목
- 제출 버튼 문구
- 관찰 패널 요약 라벨

포함하지 않을 것:

- 현재 계획 판정 로직
- 요약 계산
- 리마인드 시간 창 판정

### 3. `planner-web-observation`

역할:

- 웹 전용 관찰 패널과 diagnostics 조립

포함할 것:

- reminder observation summary
- recovery observation summary
- 정책 상태 문구

판단:

- 이 부분은 앱 전환 초기 핵심이 아니므로 core에서 분리하는 편이 맞다

## Current Value Mapping

현재 `use-planner-view-model.ts` 값을 아래처럼 나눌 수 있다.

### Core Candidate

- `sortedPlans`
- `currentMinute`
- `resolvedCurrentMinute`
- `currentPlan`
- `summary`
- `activeReminder`
- `activeEndRecoveryReminder`
- `planItems`의 구조적 정보
  - `canToggleStatus`
  - `canReschedule`
  - `isCurrent`
  - `plan`
  - `recoveryBadges`의 원천 데이터
  - `recoveryHighlight.kind`
- `composer mode`
- `reflection / reschedule state`

### Web Presentation Candidate

- `currentPlanTimeText`
- `reminderTimeText`
- `endRecoveryReminderTimeText`
- `statusLabel`
- `timeText`
- `composerTitle`
- `submitButtonLabel`
- `listCurrentTimeText`
- `recoveryHighlight.label`
- `recoveryHighlight.detail`

### Web Diagnostics Candidate

- `reminderObservationSummaryItems`
- `reminderPolicyStatus`
- `recoveryHighlightObservationSummaryItems`
- `recoveryHighlightObservationPolicyStatus`
- 관련 힌트와 안내 문구

## Recovery Highlight Refactor Direction

현재 회복 강조는 label/detail/tone까지 한 번에 조립된다.

core에서는 아래처럼 더 중립적인 구조로 두는 것이 맞다.

```ts
type RecoveryHighlightKind =
  | "reflection_prompt"
  | "reschedule_prompt"
  | "reschedule_unavailable"
  | "followup_scheduled"
  | "followup_soon"
  | "followup_active";
```

그리고 presentation 계층에서:

- label
- detail
- tone

을 플랫폼별로 매핑한다.

## Reminder Refactor Direction

현재 시작 리마인드와 종료 5분 전 배너는 hook과 view-model이 함께 조립한다.

권고:

- 시간 창과 대상 판정은 core rule로 이동
- `dismiss`, `complete`, `continue` 같은 액션 연결만 플랫폼 hook에 남김

예시:

```ts
type StartReminderState = {
  planId: string;
  visible: boolean;
  canComplete: boolean;
};

type EndRecoveryReminderState = {
  planId: string;
  visible: boolean;
};
```

## Suggested File Draft

초기 분리안:

```text
src/features/planner/core/
  planner-core-view-model.ts
  planner-reminder-rules.ts
  planner-recovery-rules.ts

src/features/planner/web/
  planner-web-presentation.ts
  planner-web-observation.ts
```

현재 코드 기준 대응:

- `use-planner-view-model.ts`
  - core 계산 부분 추출
  - web presentation mapping 분리
- `use-reminder-banner.ts`
  - 대상 판정은 core rule로 이동
- `use-end-recovery-banner.ts`
  - 대상 판정은 core rule로 이동

## Recommended Extraction Order

1. 회복 강조를 `kind` 기반 구조로 바꾼다
2. 상태 라벨과 시간 문구 조립을 presentation 함수로 뺀다
3. 관찰 패널 summary/policy 조립을 diagnostics 계층으로 분리한다
4. 시작/종료 리마인드 시간 창 판정을 core rule로 이동한다
5. 남은 `use-planner-view-model`은 core hook wrapper 수준으로 줄인다

## What The App Will Reuse

앱은 최종적으로 아래만 재사용하면 된다.

- core view-model output
- selector output
- provider contract
- reminder/recovery rule state

앱은 아래를 재사용하지 않는다.

- 웹용 라벨 조립
- 웹 관찰 패널
- 웹 test id
- SVG 친화적 time text formatting

## Follow-up

이 문서 다음 순서는 아래다.

1. 앱 프로젝트 초기화 시 첫 파일 배치안 정리
2. 실제 타입 도입 시 기존 `DailyPlan` 점진 이행 계획 정리
3. 필요하면 `use-planner-state`도 같은 기준으로 core / platform split 초안 작성
