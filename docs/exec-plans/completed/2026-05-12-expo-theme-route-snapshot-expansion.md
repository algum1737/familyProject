# Expo Theme Route Snapshot Expansion

## Goal

Expo 전역 테마 `Sand`, `Mint`, `Night Ink`가 `Today`뿐 아니라 `Plan Editor`, `Reflection`, `Motivation` 화면의 핵심 React Native 스타일 조합에서도 안정적으로 유지되도록 screen-level snapshot 범위를 확장한다.

## Scope

- 현재 Expo theme helper와 세 route 화면의 실제 style 사용 지점 확인
- `editor/reflection/motivation`용 pure screen contract helper 추가
- route-level theme snapshot 테스트 확장
- Expo 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 현재 환경에는 `react-test-renderer`가 없어, 이번 작업도 실제 JSX 렌더 스냅샷 대신 `StyleSheet.create` 입력과 같은 pure style contract snapshot으로 진행한다.
- 우선 범위는 세 화면의 핵심 route/card/form/calendar 조합이며, 실제 기기 픽셀 회귀 테스트는 포함하지 않는다.

## Steps

1. `Plan Editor`, `Reflection`, `Motivation` 화면에서 theme가 실제로 조합되는 핵심 RN style 집합을 정한다.
2. screen-level theme contract helper를 추가하고 `expo-theme.ts`가 같은 정의를 재사용하게 맞춘다.
3. 관련 focused snapshot 테스트를 추가한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 focused 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 실제 JSX 렌더러가 도입되면 `Today` 포함 전체 route 화면을 render snapshot이나 시각 회귀 테스트로 올릴 수 있다.

## Completion

Completed. Expo theme regression coverage를 `Today` 단일 화면에서 `Plan Editor`, `Reflection`, `Motivation`까지 확장했다. [expo-theme-screen-snapshots.ts](/Users/hun/workspace/familyProject/apps/expo/src/app-shell/expo-theme-screen-snapshots.ts)는 이제 route별 pure style contract와 snapshot builder를 함께 제공하고, [expo-theme.ts](/Users/hun/workspace/familyProject/apps/expo/src/app-shell/expo-theme.ts)는 `Today`뿐 아니라 editor/reflection/motivation 관련 style 정의도 같은 helper에서 재사용한다. [expo-theme-screen-style-snapshots.test.ts](/Users/hun/workspace/familyProject/tests/expo-theme-screen-style-snapshots.test.ts)는 세 theme preset에 대해 `Today + editor + reflection + motivation` route style snapshot을 고정하고, 핵심 색 대비 분리도 추가로 검증한다.

## Validation Result

- `npm test -- tests/expo-theme.test.ts tests/expo-theme-visual-contract.test.ts tests/expo-theme-screen-style-snapshots.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.
