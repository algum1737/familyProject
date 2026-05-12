# Expo Theme Screen Style Snapshots

## Goal

Expo 전역 테마 `Sand`, `Mint`, `Night Ink`가 실제 `Today` 화면에서 쓰는 React Native 스타일 조합을 snapshot으로 고정해, palette contract를 넘어 screen-level 시각 회귀를 더 일찍 잡는다.

## Scope

- 현재 Expo theme factory와 `Today` 화면 스타일 조합 확인
- theme별 `Today` 화면 핵심 style snapshot helper 추가
- focused 테스트 추가
- Expo 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 현재 환경에는 `react-test-renderer`가 없어, 이번 작업은 실제 JSX 렌더 스냅샷 대신 `StyleSheet.flatten` 기반 RN style snapshot contract로 진행한다.
- 우선 범위는 `Today` 화면과 그 안의 상태 pill, menu, planner/stat card 조합에 집중한다.

## Steps

1. `Today` 화면에서 theme가 실제로 조합되는 핵심 RN style 집합을 정한다.
2. theme별 screen style snapshot helper를 추가한다.
3. 관련 focused 테스트를 추가한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 focused 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 실제 JSX 렌더러가 도입되면 `Today` 화면과 다른 route들의 실제 render snapshot으로 확장할 수 있다.

## Completion

Completed. Expo theme regression coverage를 palette/style token contract에서 한 단계 올려, `Today` 화면이 실제로 쓰는 RN style 조합을 순수 helper와 snapshot으로 고정했다. 새 [expo-theme-screen-snapshots.ts](/Users/hun/workspace/familyProject/apps/expo/src/app-shell/expo-theme-screen-snapshots.ts)는 `Today` 화면 route/card/menu/stat/status pill 스타일 contract를 `ExpoThemePalette` 기준으로 조립하고, [expo-theme.ts](/Users/hun/workspace/familyProject/apps/expo/src/app-shell/expo-theme.ts)는 같은 helper를 실제 `StyleSheet.create` 입력에 재사용한다. [expo-theme-screen-style-snapshots.test.ts](/Users/hun/workspace/familyProject/tests/expo-theme-screen-style-snapshots.test.ts)는 `Sand`, `Mint`, `Night Ink` 세 preset의 `Today` 화면 style snapshot과 핵심 대비 규칙을 고정한다.

## Validation Result

- `npm test -- tests/expo-theme.test.ts tests/expo-theme-visual-contract.test.ts tests/expo-theme-screen-style-snapshots.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.
