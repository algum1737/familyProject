# Handoff

이 문서는 다른 세션에서 현재 상태를 빠르게 이어받기 위한 인계 문구다.

## Read First

다음 순서로 읽는다.

1. `AGENTS.md`
2. `README.md`
3. `ARCHITECTURE.md`
4. `docs/index.md`
5. `docs/MVP_SCOPE.md`
6. `docs/TECH_STACK.md`
7. `docs/WEB_TO_APP_TRANSITION.md`
8. `docs/exec-plans/active/2026-04-24-app-transition-decision.md`
9. `docs/exec-plans/active/2026-04-28-missed-plan-recovery.md`
10. `docs/exec-plans/active/2026-04-23-plan-editing.md`
11. `src/ui/planner/circular-planner.tsx`
12. `src/app/globals.css`

## Current Baseline

### Latest Progress Snapshot

- Expo iOS 시뮬레이터 경로가 실제로 연결됐다. `expo-router` route tree, Metro workspace 설정, iOS development build, simulator 실행까지 확인했다.
- Expo `Today` 화면은 safe area, 전체 스크롤, 실제 앱 톤에 가까운 상단 배경/헤더 구조로 정리됐다.
- Expo `Today` 화면에는 계획 삭제 버튼이 연결됐고, `Plan Editor`는 저장 실패 시 화면에 남아서 필드별 오류를 보여주며 첫 오류 필드로 포커스를 이동한다.
- 시간 입력은 `9`, `12`, `930`, `1230`, `09:30`처럼 유연하게 받을 수 있고, 자정 넘김 일정도 `23` 시작 / `4` 종료처럼 입력하면 `23:00 ~ 다음 날 04:00`으로 저장된다.
- 자정 넘김 일정은 저장뿐 아니라 현재 계획 판정, 완료 가능 여부, 리마인드 창 판정, 충돌 검사까지 같은 규칙으로 맞춰져 있다.
- Expo 원형 시간판은 숫자/섹터 라벨/시침 가독성을 키웠고, 해/달 보조 아이콘을 복구했다. 다만 현재는 전체 보드 크기와 레이아웃 균형을 더 다듬을 여지가 있다.

### Immediate Next Work

- Expo 원형 시간판의 크기와 카드 내 배치를 다시 조정해 버튼/중앙 텍스트/해달 아이콘과의 균형을 맞춘다.
- overnight 일정이 시간판에서 실제로 어떻게 보이는지 시뮬레이터에서 확인하고, 필요하면 섹터 라벨/회전/길이 표현을 조정한다.
- `Motivation`, `Reflection`, `Plan Editor` 화면도 `Today` 수준으로 앱 톤과 safe area 정리를 맞춘다.
- 이번 세션 종료 시점 기준으로 개발 서버는 모두 내려둔 상태다. 다음 재개 시 `apps/expo`에서 `npx expo start --localhost --clear`로 다시 시작하면 된다.

- 현재 브랜치: `git branch --show-current`로 확인
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 이번 단계에서는 프리뷰 전용 demo seed와 날짜 key helper를 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립을 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리해, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. 이번 단계에서는 [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)를 추가해 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 문서로 고정했고, `docs/index.md`, `apps/expo/README.md`, `docs/WEB_TO_APP_TRANSITION.md`도 같은 기준으로 연결했다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. 이번 단계에서는 [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)를 추가해 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안을 만들었고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)를 추가해 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성했다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용하며, 실제 앱 셸은 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. 이번 단계에서는 [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)를 추가해 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 문서로 고정했다. 이에 맞춰 실제 앱 셸은 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. 이번 단계에서는 [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)를 추가해 실제 navigator 기본 채택안을 `expo-router`로 고정했고, 그 이유와 도입 순서를 문서화했다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)는 실제 navigator 기본 채택안을 `expo-router`로 고정하고, 그 이유와 도입 순서를 문서화한다. 이번 단계에서는 Expo 공식 경로대로 `expo-router`와 관련 필수 의존성을 설치했고, [expo-router-contract.ts](../apps/expo/src/app-shell/expo-router-contract.ts)로 route/state constants를 추가했다. 또한 `apps/expo/app/` 아래에 `_layout`, `(tabs)/today`, `(tabs)/motivation`, `editor`, `reflection` route draft 파일을 만들고, [expo-route-draft-screen.tsx](../apps/expo/src/components/expo-route-draft-screen.tsx)로 이후 adapter 연결 전 비활성 파일 구조 초안을 확인할 수 있게 정리했다. 현재 기본 런타임은 여전히 `ExpoAppShell`이며, `expo-router` file tree는 다음 단계 어댑터 연결을 위한 초안 상태다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)는 실제 navigator 기본 채택안을 `expo-router`로 고정하고, 그 이유와 도입 순서를 문서화한다. 이번 단계에서는 Expo 공식 경로대로 `expo-router`와 관련 필수 의존성을 설치했고, [expo-router-contract.ts](../apps/expo/src/app-shell/expo-router-contract.ts)로 route/state constants를 추가했다. `apps/expo/package.json`의 main은 이제 `expo-router/entry`를 사용하고, 실제 앱 root는 `apps/expo/app/` route tree가 담당한다. 또한 `apps/expo/app/` 아래 `_layout`, `index`, `(tabs)/_layout`, `(tabs)/today`, `(tabs)/motivation`, `editor`, `reflection` route 파일이 실제 `shell/model` 계층을 읽는 adapter로 연결됐다. 현재 `ExpoAppShell`은 더 이상 기본 엔트리가 아니라, route adapter가 재사용하는 실제 앱 상태 조립 계층으로 남아 있다.

## Current Product State

- Next.js + TypeScript 기반 웹 MVP가 있다.
- 웹 MVP는 최종 상태가 아니라 앱 전환 전 검증 단계다.
- 24시간 원형 플래너가 렌더링된다.
- 현재 시간 포인터와 현재 계획 판정이 동작한다.
- 현재 계획 부채꼴은 비현재 구간보다 더 강하게 강조된다.
- 계획 등록, 삭제, 완료 토글이 구현돼 있다.
- 계획 수정 모드가 구현돼 있다.
- 수정 모드에서는 섹션 제목이 `계획 수정`, 제출 버튼이 `계획 저장`으로 바뀐다.
- 등록 모드의 `계획 추가` 버튼 최소 너비는 `180px`다.
- 계획 폼의 액션 버튼은 입력 필드들과 같은 라인에 정렬된다.
- 선택된 색상 미리보기는 폼 하단 별도 블록으로 유지된다.
- 시간 입력은 자유 분 단위다.
- 기존 일정과 겹치는 시간대는 저장되지 않는다.
- 일정 충돌 메시지는 등록하려는 일정이 아니라 기존 등록 일정의 제목과 시간대로 안내된다.
- 여러 기존 일정과 겹치더라도 첫 번째로 감지된 충돌 일정 1건만 안내된다.
- 색상 선택은 기본 팔레트 드롭다운과 `사용자 지정` 컬러 피커 흐름으로 정리돼 있다.
- 시계 숫자 라벨은 `0, 3, 6, 9, 12, 15, 18, 21`만 보인다.
- `0` 옆에는 달 아이콘, `12` 옆에는 해 아이콘이 표시된다.
- 저장은 현재 브라우저 `localStorage`를 사용한다.
- 저장소 계약(`plans-store`) 뒤에서 웹 `localStorage` 구현을 사용한다.
- 시간 소스는 `PlannerShell`에서 `CircularPlanner`로 주입된다.
- 편집 상태와 저장/검증 호출은 `use-planner-state`로 분리돼 있다.
- 리마인드 provider 계약과 웹 기본 `noop` 구현이 추가돼 있다.
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준이 문서로 정리돼 있다.
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현하기로 정리돼 있다.
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리돼 있다.
- 웹 리마인드 프로토타입은 현재 계획 카드 아래 배너 형태로 연결돼 있고, `지금 완료`와 `닫기` 동작을 가진다.
- 웹 리마인드 배너의 `지금 완료`는 시작 시각 이후에만 보이고, 시작 전에는 `닫기`만 노출된다.
- `오늘 계획` 리스트에서도 시작 전 pending 일정의 완료 버튼은 비활성화된다.
- 종료 시각이 지난 pending 일정은 자동으로 `missed` 상태로 전환된다.
- 일정 데이터에는 재지정 최대 3회를 위한 `rescheduleCount` 메타데이터가 추가돼 있다.
- `missed` 일정에는 `회고`와 `다시 지정` 버튼이 보이고, 회고 메모를 저장할 수 있다.
- `missed` 일정의 `다시 지정`은 같은 날 빈 시간 새 일정으로 생성되며 최대 3회까지만 허용된다.
- 원래 일정 길이를 채울 연속 빈 시간이 없으면 자동 축약이나 자동 분할 없이 다시 지정 실패로 처리된다.
- `다시 지정 불가` 오류는 이제 `길이 그대로는 불가`와 `더 짧게 직접 다시 지정 저장`이라는 다음 행동을 분리해 안내한다.
- 회고가 저장된 `missed` 일정은 리스트에서 `회고 저장됨` 배지와 메모 미리보기로 다시 보인다.
- 재지정 이력은 원본 일정과 후속 일정 모두에서 `다시 지정 n/3` 배지로 확인할 수 있다.
- 상태 버튼과 리마인드/놓침 액션 라벨은 별도 설정 계층과 웹 `localStorage` 저장 구조 뒤에 분리돼 있다.
- 사용자는 웹 MVP에서 `지금`, `대기`, `완료`, `놓침`, `지금 완료`, `회고`, `다시 지정` 문구를 별도 `표시 문구 변경` 버튼으로 여는 팝업에서 수정하고 기본값으로 복원할 수 있다.
- 라벨 커스터마이징 값은 각 항목당 최대 10자까지만 입력 및 저장된다.
- 앱에서도 유지할 라벨 설정 범위는 현재 `current`, `pending`, `done`, `missed`, `completeNow`, `reflection`, `reschedule` 7개 키로 고정돼 있다.
- 회고가 없는 `missed` 일정은 `회고 다시 보기`, 멀리 떨어진 후속 일정은 `다시 지정됨`, 곧 시작하는 후속 일정은 `다시 지정 곧 시작`, 현재 진행 중인 후속 일정은 `회복 진행 중`으로 다시 강조된다.
- `회복 관찰 로그`는 재강조 빈도와 함께 `관찰 더 필요`, `조정 검토`, `우선 유지` 판단도 보여준다.
- 연속 빈 시간이 부족해 다시 지정이 막히면 `다시 지정 불가` 관찰 로그를 남겨 재지정 정책이 너무 엄격한지 나중에 판단할 수 있다.
- `use-planner-view-model`이 추가돼 현재 계획, 요약, 리마인드 화면 상태를 `CircularPlanner` 밖 공용 계층으로 올렸다.
- 웹 리마인드 기본 정책은 `시작 5분 전 ~ 시작 후 10분` 창이며, `닫기`는 현재 리마인드 창에만 적용된다.
- 현재 시각과 리마인드 배너 판정은 10초 간격으로 갱신된다.
- 개발 모드에서는 상단 `관찰 시간 조정` 패널로 테스트 시간을 바꿔 시작 5분 전, 시작 직후, 종료 직전 표본을 빠르게 재현할 수 있다.
- 같은 패널의 `표본용 예정 일정 추가` 버튼으로 현재 시각 이후 첫 30분 빈 슬롯을 관찰용 `pending` 일정으로 즉시 생성할 수 있다.
- 2026-04-30 추가 관찰에서 `저녁` 시작 직후 `리마인드에서 완료` 1회, `운동` 시작 5분 전 `배너 닫기` 1회를 실제 로그로 확보했다.
- 같은 날 `관찰 표본 1`, `관찰 표본 2`, `관찰 표본 3`로 리마인드 누적 `표시 5회 / 닫기 2회 / 완료 2회`와 정책 상태 `우선 유지`를 다시 확인했다.
- `관찰 표본 2` 체인에서는 `시작 5분 전 닫기 -> 종료 직후 missed -> 회고 다시 보기`, `관찰 표본 3` 체인에서는 `시작 리마인드 표시 -> 종료 5분 전 추가 알림 없이 유지 -> 종료 직후 missed -> 회고 다시 보기` 흐름이 자연스럽게 이어졌다.
- 현재까지는 시작 배너가 이미 한 번 노출된 체인에 종료 5분 전 회복 알림을 더하지 않아도 맥락 파악이 가능했고, 종료 직후 회고 진입이 더 자연스럽다는 관찰 근거가 추가됐다.
- 개발 모드에서만 보이는 `종료 전 확인` 실험 배너가 추가됐고, 액션은 `계속 진행` 1개로 제한된다.
- 회복 관찰 로그는 이제 `종료 전 확인` 표시와 `계속 진행` 액션도 함께 누적해 이후 운영 추적에 쓸 수 있다.
- 실제 관찰에서 `관찰 표본 1` 체인 기준 `종료 전 확인 -> 계속 진행 -> 종료 직후 missed -> 회고 다시 보기` 흐름이 자연스럽게 이어지는 것도 확인했다.
- 추가로 `관찰 표본 2` 체인에서도 `시작 리마인드 -> 종료 전 확인 -> 계속 진행 -> 종료 직후 missed -> 회고 다시 보기`가 같은 형태로 반복되는 것을 확인했다.
- 시작 리마인드 누적은 현재 `표시 7회 / 닫기 2회 / 완료 2회` 기준까지 쌓였다.
- 현재 근거상 종료 5분 전 알림을 유지한다면 `계속 진행` 1액션 구성이 가장 가볍고, 회고/다시 지정은 종료 직후 카드 흐름에 맡기는 쪽이 우선 후보다.
- 종료 5분 전 알림 최종 판단은 [END_5_MINUTE_ALERT_DECISION.md](./END_5_MINUTE_ALERT_DECISION.md)에 고정돼 있다.
- 현재 계획 시간 문구, 리스트 상태 라벨, 섹션 제목, 제출 버튼 문구도 `use-planner-view-model`에서 조립한다.
- 최근 5건의 리마인드 표시, 닫기, 완료 이벤트를 `localStorage` 관찰 로그로 남기고 UI에서 지울 수 있다.
- 관찰 패널은 `표시`, `닫기`, `완료`, `닫기 비율`, `완료 전환율` 요약과 간단한 정책 판단 문구를 함께 보여준다.
- 관찰 패널은 현재 기록 범위와 `관찰 더 필요`, `조정 검토`, `우선 유지` 정책 상태도 함께 보여준다.
- 정책 상태는 표본 3회 이상부터 의미를 가지며, `닫기 비율`이 50% 이상이고 완료보다 많을 때 `조정 검토`로 본다.
- 리마인드 관찰 로그는 로드 시 같은 분 단위 동일 이벤트를 정규화해 중복 key 경고를 막는다.
- Vitest 기반 UI 사용자 흐름 테스트가 추가돼 있다.
- Playwright 기반 브라우저 E2E 흐름 테스트가 추가돼 있다.
- 브라우저 테스트는 `build + start` 서버 기준으로 실행되며, 로컬은 시스템 Chrome 채널, CI는 번들 `chromium`을 사용한다.
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E가 자동 실행된다.
- GitHub Actions CI는 `actions/checkout@v6`, `actions/setup-node@v6`, `Node 24` 기준으로 맞췄다.
- `.githooks/post-commit`은 `scripts/check-handoff-loop.sh`를 호출해 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고한다.
- `npm run check:handoff-loop`로 같은 점검을 수동 실행할 수 있다.
- `npm run test:handoff-loop`로 점검 스크립트의 대표 경고 시나리오를 검증할 수 있다.
- 앱 전환 방식 비교 기준과 결정 입력 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 초기 앱 클라이언트 최소 범위가 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 현재 문서 기준 우선 권장 앱 전환안은 `Expo + React Native`다.
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리돼 있다.
- 현재 판단상 웹 검증은 방향 고정에 충분한 수준까지 왔고, 다음 단계는 추가 실험보다 앱 구현 준비 문서화에 가깝다.
- 앱 전환 준비 완료 조건은 `docs/WEB_TO_APP_TRANSITION.md`의 `App Transition Readiness` 섹션을 기준으로 본다.
- 앱 구현 순서는 `앱 셸 -> 앱 저장소 provider -> 오늘 화면 핵심 흐름 -> 원형 플래너 또는 대안 표현 -> CRUD/검증 -> 리마인드 -> missed 회복` 순으로 고정한다.
- 앱 화면 트리 초안은 `docs/APP_SCREEN_TREE.md`에 있고, 초기 앱은 탭 확장보다 `오늘 화면` 중심 루트 스택 구조를 권장한다.
- 앱 저장소 후보 비교는 `docs/APP_STORAGE_OPTIONS.md`에 있고, 현재 권고안은 `PlansStore` 계약 유지 + `AsyncStorage` 계열 provider 교체다.
- 월간 동기부여 페이지용 날짜 기반 모델 초안은 `docs/APP_MOTIVATION_DATA_MODEL.md`에 있고, 현재 판단은 `AsyncStorage`로 시작하되 날짜 누적 구조와 `SQLite` 전환 가능성을 동시에 준비하는 쪽이다.
- 월간 동기부여 화면 초안은 `docs/APP_MOTIVATION_SCREEN.md`에 있고, 코드 기반 시안에는 세 번째 기기 프레임으로 같은 화면이 포함돼 있다.
- 월간 selector와 저장 계약 개정 방향은 `docs/APP_SELECTOR_AND_STORE_EVOLUTION.md`에 있고, 현재 기준은 `selector 먼저 고정 -> 저장 계약 점진 개정` 순서다.
- 앱 로컬 알림 초안은 `docs/APP_LOCAL_REMINDER_PLAN.md`에 있고, 현재 기준은 `시작 리마인드만 OS 로컬 알림 후보`, `종료 5분 전은 인앱 계속 진행 배너 유지`다.
- 다만 `실제로 했는데 완료 버튼을 안 눌러 missed가 되는 사례`가 반복되면 종료 5분 전 OS 알림 재검토 조건으로 본다.
- 웹 공용 계층과 앱 전용 UI 경계는 `docs/APP_SHARED_AND_UI_BOUNDARY.md`에 있고, 현재 기준은 `규칙/selector/provider 계약 재사용`, `SVG/UI/로컬 저장 구현/하네스는 플랫폼별 분리`다.
- 앱 타입 초안은 `docs/APP_TYPE_DRAFT.md`에 있고, 현재 기준은 `DailyPlan 유지 + DatedPlanRecord 확장`, `selector 출력 타입 분리`, `TodayPlansStore / PlannerRecordsStore` 이름 초안 고정이다.
- view-model 분리 초안은 `docs/APP_VIEW_MODEL_SPLIT_DRAFT.md`에 있고, 현재 기준은 `core 계산`, `web presentation`, `web diagnostics` 3계층 분리다.
- 앱 초기화 파일 배치안은 `docs/APP_BOOTSTRAP_FILE_LAYOUT.md`에 있고, 현재 기준은 `domains -> providers -> features/planner/core -> web -> app` 구조를 첫 커밋부터 드러내는 것이다.
- `DailyPlan` 점진 이행 계획은 `docs/APP_DAILY_PLAN_MIGRATION.md`에 있고, 현재 기준은 `DatedPlanRecord`를 먼저 추가하고 웹 호환 경로는 유지한 채 selector와 저장 계약부터 이동하는 순서다.
- 현재 코드에는 `src/domains/plans/selectors/*`, `src/providers/plans/async-plans.ts`, `src/providers/reminders/expo-local-reminder-provider.ts`, `src/features/planner/core/*`, `src/features/planner/web/*`, `src/features/planner/app/*` placeholder가 추가돼 앱 초기화 첫 커밋 뼈대가 반영돼 있다.
- `src/features/planner/core/planner-core-view-model.ts`에는 계획 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, `planItems` raw 모델 계산이, `src/features/planner/core/planner-reminder-rules.ts`에는 시작/종료 직전 리마인드 창 판정이, `src/features/planner/core/planner-recovery-rules.ts`에는 회복 강조 상태와 체인 재지정 계산이, `src/features/planner/core/planner-state-transitions.ts`에는 제출/토글/회고 저장/다시 지정 순수 전이가, `src/features/planner/core/use-planner-runtime.ts`에는 현재 분 계산과 상태/리마인드 provider 동기화 효과가, `src/features/planner/web/planner-web-presentation.ts`에는 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 문구와 `planItems` 표시 모델 조립이, `src/features/planner/web/planner-web-observation.ts`에는 리마인드/회복 관찰 요약, 정책 문구, 관찰 패널 리스트 표시 모델 조립이, `src/ui/planner/use-planner-observation-log.ts`에는 관찰 로그 append 효과와 액션 기록이, `src/ui/planner/use-planner-actions.ts`에는 계획 토글/삭제/리마인드 닫기/다시 지정 액션 조립이 실제로 이동했다.
- `src/features/planner/app/use-today-screen-view-model.ts`는 앱 `TodayScreen`용 summary/current-plan/reminder/plan-item 조립을 담당하고, `src/features/planner/app/use-connected-today-screen.ts`는 실제 `plansStore`, `labelSettingsStore`, `reminderProvider`, `timeSource`를 연결해 액션과 런타임 동기화까지 묶는다. `src/features/planner/app/screens/today-screen.tsx`는 이 결과와 `src/features/planner/app/components/start-reminder-banner.tsx`, `end-recovery-banner.tsx`, `recovery-detail-sheet.tsx`를 연결해 최소 앱 화면 흐름을 렌더링한다. `src/features/planner/app/app-today-shell.tsx`와 `src/app/app-today/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 오늘 화면은 `/app-today`로 직접 확인할 수 있다.
- `src/features/planner/app/use-plan-editor-screen-view-model.ts`는 앱 편집 화면용 제목/버튼/가이던스 조립을 담당하고, `src/features/planner/app/use-connected-plan-editor-screen.ts`는 실제 `plansStore`, `labelSettingsStore`, `timeSource`를 연결해 편집 상태와 제출/취소 액션을 묶는다. `src/features/planner/app/screens/plan-editor-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-plan-editor-shell.tsx`와 `src/app/app-plan-editor/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 편집 화면은 `/app-plan-editor`로 직접 확인할 수 있다.
- `src/features/planner/app/use-reflection-screen-view-model.ts`는 앱 회고 화면용 메모/플레이스홀더/대상 제목 조립을 담당하고, `src/features/planner/app/use-connected-reflection-screen.ts`는 실제 `plansStore`를 연결해 회고 메모 저장/취소 액션을 묶는다. `src/features/planner/app/screens/reflection-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-reflection-shell.tsx`와 `src/app/app-reflection/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 회고 화면은 `/app-reflection`으로 직접 확인할 수 있다.
- `src/features/planner/app/use-motivation-screen-view-model.ts`는 앱 동기부여 화면용 월간 요약/캘린더/회복 지표 조립을 담당하고, `src/features/planner/app/use-connected-motivation-screen.ts`는 현재 저장소의 하루 계획을 오늘 날짜 record map으로 감싸 selector에 연결한다. `src/features/planner/app/screens/motivation-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-motivation-shell.tsx`와 `src/app/app-motivation/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 동기부여 화면은 `/app-motivation`으로 직접 확인할 수 있다.
- `src/providers/plans/planner-records-store.ts`, `src/providers/plans/local-planner-records.ts`, `src/features/planner/app/use-planner-record-sync.ts`가 추가돼 날짜별 `PlannerRecordMap`을 localStorage에 누적 저장한다. 오늘/편집/회고/흐름 화면은 이 record store에 현재 날짜 계획을 계속 동기화하고, `src/features/planner/app/use-connected-motivation-screen.ts`는 이 누적 record store 전체를 읽어 월간 selector에 연결한다.
- `src/providers/plans/record-backed-plans.ts`가 추가돼 앱 shell들은 오늘 날짜의 `PlannerRecordMap`을 우선 읽는 `PlansStore`를 기본값으로 사용한다. 기존 `localPlansStore`는 record store에 해당 날짜 데이터가 아직 없을 때만 fallback으로 읽고, save 시에는 record store와 legacy store를 함께 갱신해 점진 이행 경로를 유지한다.
- `src/features/planner/app/app-flow-shell.tsx`와 `src/app/app-flow/page.tsx`가 추가돼, 현재 리포지터리 안에서 연결형 앱 핵심 흐름은 `/app-flow`로 직접 확인할 수 있다. 이 흐름은 `Today -> PlanEditor -> Reflection -> Motivation`을 하나의 상태에서 이어서 검증하는 최소 앱 네비게이션 셸이다.
- `src/features/planner/app/components/app-preview-frame.tsx`와 각 `/app-*` page 엔트리가 추가돼, 연결형 앱 화면군은 브라우저 안에서도 상태바/노치/기기 프레임을 포함한 모바일 프리뷰로 확인할 수 있다.
- `src/features/planner/app/components/app-circular-planner.tsx`가 추가돼, 연결형 앱 오늘 화면은 카드/리스트만 있는 임시 표현이 아니라 원형 시간판을 상단 핵심 보드로 다시 포함한다.
- `src/features/planner/app/app-flow-shell.tsx`는 이제 단순 버튼 전환이 아니라 하단 탭형 네비게이션, 활성 화면 chip, 프리뷰 홈 인디케이터를 포함한 앱 탐색 프레임으로 정리돼 있다.
- `apps/expo` 아래에 Expo SDK 55 기준 앱 뼈대가 추가됐다. 현재는 `App.tsx`, `src/expo-planner-preview-shell.tsx`, `src/screens/*`, `src/components/expo-flow-tab-bar.tsx`, `src/components/expo-circular-planner.tsx`, `src/app-shell/use-expo-planner-preview-model.ts`, `src/app-shell/use-expo-planner-state.ts`, `src/providers/plans/expo-async-plans-store.ts`, `src/providers/plans/expo-async-planner-records-store.ts`, `src/providers/reminders/expo-start-reminder-provider.ts`, Expo 설정 파일과 README가 있으며, shared selector와 shared planner core를 실제로 읽고 Expo 전용 상태 전이까지 붙이기 시작한 상태다. 특히 Expo plans store는 `src/providers/plans/async-record-backed-plans.ts`를 통해 웹 `record-backed` 흐름과 같은 날짜 브리지 구조를 공유한다. 루트 Next.js 타입체크와 충돌하지 않도록 루트 `tsconfig.json`에서는 제외한다.
- 자정 넘김 일정은 이제 `종료 시간이 시작 시간보다 이르면 다음 날 종료`로 해석한다. 예를 들어 `23`와 `4`를 입력하면 `23:00 ~ 다음 날 04:00`으로 저장되고, 현재 계획 판정/리마인드 판정/충돌 검사도 같은 규칙을 따른다. Expo 편집 화면은 필드별 오류 문구와 첫 오류 필드 포커스 이동까지 지원한다.
- 코드 기반 앱 시안은 `src/app/app-mockup/page.tsx`와 `src/app/globals.css`의 `mockup-*` 스타일로 관리한다.
- 연결형 앱 화면군은 `src/app/globals.css`의 `app-*` 스타일을 사용해 공통 카드, 배너, 시트, 통계 카드, 캘린더, 플로우 탭 레이아웃을 공유한다.
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영돼 있다.
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영돼 있다.

## Working Rules

- 구현 변경은 사용자가 명시적으로 `진행하자`, `적용해`, `수정해`, `브랜치 만들어서 진행해`라고 말했을 때만 수행한다.
- 그 전에는 분석, 원인 파악, 제안까지만 한다.
- 새 실제 작업은 `main`에서 직접 하지 않고, 사용자가 승인하면 작업 브랜치를 만든다.
- `main` 머지는 사용자가 명시적으로 요청할 때만 한다.
- 커밋 후에는 `docs/HANDOFF.md`의 최근 반영 작업, 현재 상태, 다음 작업을 검토하고 갱신한다.
- 커밋 해시는 문서에 고정하지 말고 git 명령으로 확인하게 유지한다.
- 리포지터리 밖에만 있는 지식은 없는 것으로 간주한다.

## Suggested Next Work

1. `expo-router` 탭/오버레이 route를 preview shell 없이 실제 앱에서 열어보는 실행 검증
2. Expo actions와 shared state transition helper의 경계를 더 명확히 나누기
3. 필요하면 `use-planner-state`도 같은 기준으로 core / platform split 초안 작성하기

## Handoff Prompt

아래 문구를 새 세션에 그대로 넣으면 된다.

```text
이 프로젝트는 하네스 엔지니어링 방식으로 진행 중이다.

먼저 아래 파일을 읽고 현재 상태를 요약해라.
1. AGENTS.md
2. README.md
3. ARCHITECTURE.md
4. docs/index.md
5. docs/MVP_SCOPE.md
6. docs/TECH_STACK.md
7. docs/WEB_TO_APP_TRANSITION.md
8. docs/exec-plans/active/2026-04-24-app-transition-decision.md
9. docs/exec-plans/active/2026-04-28-missed-plan-recovery.md
10. docs/exec-plans/active/2026-04-23-plan-editing.md
11. src/ui/planner/circular-planner.tsx
12. src/app/globals.css

현재 기준:
- branch: `git branch --show-current`
- commit: `git rev-parse --short HEAD`
- latest progress: recovery observation runbook and end-5-minute review checklist added

현재 구현 상태:
- Next.js + TypeScript 기반 웹 MVP
- 웹 MVP는 앱 전환 전 검증 단계
- 24시간 원형 플래너
- 계획 등록/삭제/완료 토글/수정
- 현재 계획 강조 강화
- 계획 폼 액션 버튼 같은 라인 정렬
- 색상 미리보기 하단 별도 블록 유지
- 자유 분 단위 시간 입력
- 시간 겹침 일정 저장 차단
- 충돌 메시지는 기존 등록 일정 제목/시간 기준
- 첫 충돌 일정 1건만 안내
- 기본 팔레트 + 사용자 지정 색상 흐름
- 3시간 단위 숫자 라벨
- 0/12 라벨 보조 아이콘
- localStorage 저장
- 저장소 계약 뒤에서 웹 localStorage 구현 사용
- 시간 소스는 PlannerShell에서 CircularPlanner로 주입
- 편집 상태와 저장/검증 호출은 use-planner-state로 분리
- 리마인드 provider 계약과 웹 기본 noop 구현 추가
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준 정리
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리
- 웹 리마인드 프로토타입은 현재 계획 카드 아래 배너 형태로 연결되고, `지금 완료`와 `닫기` 동작을 가진다
- 웹 리마인드 배너의 `지금 완료`는 시작 시각 이후에만 보이고, 시작 전에는 `닫기`만 노출된다
- `오늘 계획` 리스트에서도 시작 전 pending 일정의 완료 버튼은 비활성화된다
- 종료 시각이 지난 pending 일정은 자동으로 `missed` 상태로 전환된다
- 일정 데이터에는 재지정 최대 3회를 위한 `rescheduleCount` 메타데이터가 추가돼 있다
- `missed` 일정에는 `회고`와 `다시 지정` 버튼이 보이고, 회고 메모를 저장할 수 있다
- `missed` 일정의 `다시 지정`은 같은 날 빈 시간 새 일정으로 생성되며 최대 3회까지만 허용된다
- 원래 일정 길이를 채울 연속 빈 시간이 없으면 자동 축약이나 자동 분할 없이 다시 지정 실패로 처리된다
- 회고가 저장된 `missed` 일정은 리스트에서 `회고 저장됨` 배지와 메모 미리보기로 다시 보인다
- 재지정 이력은 원본 일정과 후속 일정 모두에서 `다시 지정 n/3` 배지로 확인할 수 있다
- 상태 버튼과 리마인드/놓침 액션 라벨은 별도 설정 계층과 웹 localStorage 저장 구조 뒤에 분리돼 있다
- 사용자는 웹 MVP에서 `지금`, `대기`, `완료`, `놓침`, `지금 완료`, `회고`, `다시 지정` 문구를 직접 수정하고 기본값으로 복원할 수 있다
- 앱에서도 유지할 라벨 설정 범위는 현재 `current`, `pending`, `done`, `missed`, `completeNow`, `reflection`, `reschedule` 7개 키로 고정돼 있다
- 회고가 없는 `missed` 일정은 `회고 다시 보기`, 멀리 떨어진 후속 일정은 `다시 지정됨`, 곧 시작하는 후속 일정은 `다시 지정 곧 시작`, 현재 진행 중인 후속 일정은 `회복 진행 중`으로 다시 강조된다
- `회복 관찰 로그`는 재강조 빈도와 함께 `관찰 더 필요`, `조정 검토`, `우선 유지` 판단도 보여준다
- 연속 빈 시간이 부족해 다시 지정이 막히면 `다시 지정 불가` 관찰 로그를 남겨 재지정 정책이 너무 엄격한지 나중에 판단할 수 있다
- `use-planner-view-model`이 추가돼 현재 계획, 요약, 리마인드 화면 상태를 `CircularPlanner` 밖 공용 계층으로 올림
- 웹 리마인드 기본 정책은 `시작 5분 전 ~ 시작 후 10분` 창이며, `닫기`는 현재 리마인드 창에만 적용
- 현재 시각과 리마인드 배너 판정은 10초 간격으로 갱신
- 현재 계획 시간 문구, 리스트 상태 라벨, 섹션 제목, 제출 버튼 문구도 `use-planner-view-model`에서 조립
- 최근 5건의 리마인드 표시, 닫기, 완료 이벤트를 `localStorage` 관찰 로그로 남기고 UI에서 지울 수 있음
- 관찰 패널은 `표시`, `닫기`, `완료`, `닫기 비율`, `완료 전환율` 요약과 간단한 정책 판단 문구를 함께 보여줌
- 관찰 패널은 현재 기록 범위와 `관찰 더 필요`, `조정 검토`, `우선 유지` 정책 상태도 함께 보여줌
- 정책 상태는 표본 3회 이상부터 의미를 가지며, `닫기 비율`이 50% 이상이고 완료보다 많을 때 `조정 검토`로 봄
- 리마인드 관찰 로그는 로드 시 같은 분 단위 동일 이벤트를 정규화해 중복 key 경고를 막음
- Vitest UI 사용자 흐름 테스트 추가
- Playwright 브라우저 E2E 테스트 추가
- E2E는 `build + start` 기준, 로컬은 시스템 Chrome 채널, CI는 번들 `chromium`
- 계획 편집 흐름의 기본 테스트 범위는 실행 계획 문서에 정리됨
- 테스트 확장 조건과 CI 실패 시 문서 갱신 기준은 실행 계획 문서에 정리됨
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E 자동 실행
- post-commit 훅이 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고
- `npm run check:handoff-loop`로 같은 점검을 수동 실행 가능
- `npm run test:handoff-loop`로 대표 경고 시나리오 검증 가능
- 앱 전환 방식 비교 기준과 결정 입력 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 초기 앱 클라이언트 최소 범위는 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 현재 우선 권장 앱 전환안은 `Expo + React Native`
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리됨
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영됨
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영됨

중요 규칙:
- 구현 변경은 내가 명시적으로 진행하라고 할 때만 수행해라.
- 그 전에는 분석과 제안까지만 해라.
- 새 실제 작업은 브랜치를 만들어서 진행하고, main 머지는 내가 요청할 때만 해라.
- 커밋 후에는 docs/HANDOFF.md를 갱신하되, 커밋 해시는 git 명령으로 확인하게 유지해라.
- CI 실패가 문서/계획 불일치와 연결되면 HANDOFF와 실행 계획도 함께 갱신해라.

먼저 현재 상태를 요약하고, 내가 승인할 때만 실제 수정을 시작해라.
```
