# Expo Route Provider Coverage

## Goal

Expo `expo-router` route adapter와 provider 연결 경로에서 아직 테스트로 고정되지 않은 분기를 보강해, 네비게이션 경계 회귀 가능성을 줄인다.

## Scope

- Expo route adapter와 route helper의 현재 계약 범위 확인
- today/editor/reflection route 진입과 복귀 분기 중 빠진 케이스 선별
- focused 테스트 추가와 필요한 최소 수정
- 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 실제 navigator 교체가 아니라 existing `expo-router` adapter 계약 보강에 집중한다.

## Steps

1. 현재 route helper와 route adapter 파일을 읽고 테스트 공백을 정리한다.
2. 회귀 위험이 큰 분기를 골라 focused 테스트를 추가한다.
3. 필요한 최소 helper 또는 adapter 수정을 적용한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 Expo route/provider 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo route/provider coverage는 now route action helper 바깥의 남은 경계 규칙까지 테스트로 보강됐다. `expo-router-contract`의 route path, single param parsing, tab/overlay key guard를 별도 테스트로 고정했고, `expo-router-app-provider`의 bootstrap source/status gating은 pure helper로 분리해 loading/error/ready 분기를 테스트 가능하게 만들었다.

## Validation Result

- `npm test -- tests/expo-router-route-actions.test.ts tests/expo-router-contract.test.ts tests/expo-router-provider-state.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- `expo-router` route component 자체를 직접 렌더링하는 통합 테스트는 라이브러리 파싱 제약 때문에 아직 없다.
