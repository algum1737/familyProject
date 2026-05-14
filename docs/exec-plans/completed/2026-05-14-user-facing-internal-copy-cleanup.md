# User Facing Internal Copy Cleanup

## Context

계획 편집 화면에 `웹 PlanEditorScreen`, `React Native 입력 위젯`, `selector`, `store 계약` 같은 내부 구현 설명이 노출된다. 사용자가 보는 화면에서는 구현 계층이 아니라 무엇을 입력하고 저장하면 되는지 안내해야 한다.

## Scope

- Expo 실제 앱 route 화면에서 내부 구현 용어 제거
- Expo 앱 bootstrap loading/error 화면에서 내부 구현 용어 제거
- 웹 앱/앱 프리뷰 화면 중 사용자가 직접 볼 수 있는 상단 설명과 라벨의 내부 용어 정리
- 변경된 사용자 카피에 맞는 기존 테스트/타입 검증 실행
- 완료 결과를 docs index, handoff, completed plan에 기록

## Out of Scope

- 화면 레이아웃 리디자인
- 알림/저장/라우팅 동작 변경
- 문서 전반의 개발자용 기술 설명 제거
- 릴리스/스토어 제출 작업

## Assumptions

- 사용자의 `수립하고 진행하자`는 브랜치 생성, 구현 변경, 검증, 문서 기록 승인으로 본다.
- 개발자 문서나 테스트명에 남은 기술 용어는 이번 범위에서 제외한다. 앱 화면, 브라우저 프리뷰 화면, 로딩/오류 화면의 사용자 표시 문구만 다룬다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- 사용자 노출 가능성이 있는 화면 코드에서 내부 용어 검색

### Automated tests

- `npm test -- --run tests/expo-theme-screen-style-snapshots.test.ts tests/expo-router-route-actions.test.ts tests/expo-router-provider-state.test.ts`
- `npm run typecheck`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 코드 리뷰 기준으로 사용자 노출 문자열에서 내부 구현 용어가 사라졌는지 확인한다.
- 이번 작업은 카피 변경이므로 별도 실기기 런타임 QA는 실행하지 않는다.

### Skipped/Not Run

- Android/iOS runtime QA는 이번 범위에서 제외한다.

## Open Work

- 추가로 발견되는 개발자 전용 preview 페이지 문구는 실제 사용자 노출 여부를 판단해 별도 후속으로 분리한다.

## Steps

1. 사용자 노출 화면의 내부 구현 용어를 검색한다.
2. 계획 편집, 앱 loading/error, 웹/앱 프리뷰 상단 문구를 사용자용 카피로 교체한다.
3. 자동 검증을 실행한다.
4. 완료 범위와 검증 결과를 기록한다.
5. completed plan으로 이동하고 커밋한다.

## Completion

- Expo 계획 편집 화면에서 `웹 PlanEditorScreen`, `React Native 입력 위젯`, `selector`, `store 계약`처럼 사용자에게 불필요한 내부 구현 설명을 제거하고, 계획 제목/시간 입력과 저장 결과를 설명하는 문구로 교체했다.
- Expo 앱 bootstrap loading/error 화면과 bootstrap source label을 사용자용 상태 문구로 바꿨다.
- 웹 앱/앱 프리뷰/목업 화면의 `Plan Editor`, `Today Screen`, `Mobile Preview`, `앱 전환 흐름 검증` 같은 개발/프리뷰 중심 라벨을 실제 사용자가 볼 수 있는 한국어 라벨과 설명으로 정리했다.
- 검색 결과에 남은 `PlanEditorScreen`, `selector`, `PlannerRecordMap` 등은 import, type, helper 이름 같은 코드 식별자로 확인해 이번 사용자 표시 문구 정리 범위에서 제외했다.

## Validation Result

### Pre-flight checks

- Passed: `git status --short --branch`
- Passed: 사용자 노출 가능성이 있는 화면 코드에서 내부 용어 검색

### Automated tests

- Passed: `npm test -- --run tests/expo-theme-screen-style-snapshots.test.ts tests/expo-router-route-actions.test.ts tests/expo-router-provider-state.test.ts`
- Passed: `npm run typecheck`
- Passed: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Passed: 코드 리뷰 기준으로 사용자 노출 문자열에서 내부 구현 용어가 사라졌는지 확인했다.
- Not run: 별도 실기기 런타임 QA는 카피 변경 범위라 실행하지 않았다.

### Skipped/Not Run

- Android/iOS runtime QA는 이번 범위에서 제외했다.
