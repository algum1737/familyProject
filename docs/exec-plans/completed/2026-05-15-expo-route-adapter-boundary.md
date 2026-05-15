# Expo Route Adapter Boundary

## Context

사용자 노출 문구 정리가 `main`에 반영됐고, 다음 우선 작업은 Expo route adapter/provider 경계 정리다. 현재 `expo-router` 파일 구조는 존재하지만 route 파일, provider, screen registry, flow/action 계층의 책임이 더 명확히 고정돼야 한다.

## Scope

- Expo route 파일과 provider/model/action 경계의 현재 구조를 확인한다.
- route adapter가 route param을 해석하고 provider action으로 넘기는 규칙을 얇은 계층에 고정한다.
- route/provider 경계 회귀를 막는 focused 테스트를 추가하거나 보강한다.
- 완료 결과를 docs index, handoff, completed plan에 기록한다.

## Out of Scope

- 화면 레이아웃 리디자인
- 알림 예약/권한 동작 변경
- 실기기 런타임 QA
- EAS/Play Console 제출 작업

## Assumptions

- 사용자의 `업무 진행` 승인은 브랜치 생성, 구현 변경, 검증, 문서 기록 승인으로 본다.
- 실기기는 이번 구현/자동 검증 단계에서는 필요하지 않다. route 변경 후 런타임 smoke가 필요해지면 별도로 요청한다.
- 기존 shared state와 action 계층은 유지하고, route 계층은 가능한 얇게 둔다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- Expo route/provider 관련 파일 구조 확인

### Automated tests

- `npm test -- --run tests/expo-router-route-actions.test.ts tests/expo-router-contract.test.ts tests/expo-router-provider-state.test.ts`
- 필요 시 추가 focused route adapter 테스트
- `npm run typecheck`
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 코드 리뷰 기준으로 route 파일이 화면 상태를 직접 소유하지 않고 adapter/helper를 통해 provider action에 위임하는지 확인한다.

### Skipped/Not Run

- Android 실기기 QA는 이번 작업이 route/provider 경계 정리와 자동 테스트 중심이라 기본 범위에서 제외한다.
- 변경 내용상 실제 앱 화면 전환 smoke가 필요해지면 사용자에게 실기기 연결을 요청한다.

## Open Work

- 현재 route file/component 구조를 읽은 뒤 테스트 가능한 adapter 단위를 결정한다.

## Steps

1. Expo route 파일, router contract, route action helper, provider state helper를 확인한다.
2. route adapter/provider 경계의 모호한 부분을 정리할 최소 구현 범위를 정한다.
3. focused 테스트와 필요한 최소 코드를 수정한다.
4. 자동 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed plan으로 이동한 뒤 커밋한다.

## Completion

- `expo-router-contract`에 editor/reflection route param parser를 추가해 route 파일이 raw search param을 직접 타입 단언하지 않도록 정리했다.
- `editor` route는 `create | edit | reschedule` 외 mode, planId 없는 edit/reschedule을 `today`로 돌려보내도록 했다.
- `reflection` route는 planId 없는 진입을 `today`로 돌려보내도록 했다.
- route param parser 테스트를 추가해 scalar/array param, create planId 무시, invalid mode, missing planId 분기를 고정했다.
- Expo 전용 타입체크에서 드러난 `ExpoPlanItemView`와 `ExpoTodayScreen` props 계약 차이를 맞췄다. `rescheduleActionState`를 shell model 타입에 포함하고 presentation helper의 반환 타입을 명시했다.

## Validation Result

### Pre-flight checks

- Passed: `git status --short --branch`
- Passed: Expo route/provider 관련 파일 구조 확인

### Automated tests

- Passed: `npm test -- --run tests/expo-router-route-actions.test.ts tests/expo-router-contract.test.ts tests/expo-router-provider-state.test.ts`
- Passed: `npm run typecheck`
- Passed: `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`
- Passed: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Passed: 코드 리뷰 기준으로 route 파일은 route param 해석과 redirect만 담당하고, 화면 상태는 provider/model/action 계층에 위임한다.

### Skipped/Not Run

- Android 실기기 QA는 이번 작업이 route/provider 경계와 타입 계약 정리 범위라 실행하지 않았다.
