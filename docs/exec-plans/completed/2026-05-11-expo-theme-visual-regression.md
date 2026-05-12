# Expo Theme Visual Regression

## Goal

Expo 전역 테마 `Sand`, `Mint`, `Night Ink`의 핵심 시각 토큰을 회귀 테스트로 고정해, 테마 변경이 화면 전체 톤을 의도치 않게 무너뜨리지 않도록 한다.

## Scope

- 현재 Expo theme preset과 theme factory 구조 확인
- 화면 전반에 영향을 주는 핵심 palette/style contract 선정
- focused visual contract 테스트 추가
- 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 실제 RN 픽셀 스냅샷이 아니라 palette/style contract 기반 회귀 테스트에 집중한다.

## Steps

1. Expo theme preset과 theme factory에서 안정적으로 고정할 핵심 시각 토큰을 정한다.
2. theme별 visual contract 테스트를 추가한다.
3. 필요한 최소 helper 보강이 있으면 적용한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 Expo theme 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo theme visual regression coverage는 이제 preset option/status bar 테스트를 넘어서, 각 theme의 핵심 시각 토큰 묶음을 inline snapshot으로 고정한다. `Sand`, `Mint`, `Night Ink` 각각에 대해 accent, route/surface/input 레이어, hero, semantic calendar tone, warning tone 등 화면 전반의 분위기를 결정하는 contract를 별도 테스트로 기록했고, 모든 theme 안에서 주요 레이어와 semantic tone이 서로 구분되는지도 함께 검증한다.

## Validation Result

- `npm test -- tests/expo-theme.test.ts tests/expo-theme-visual-contract.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- 실제 React Native 렌더 스냅샷이나 픽셀 기준 시각 회귀 테스트는 아직 없다.
