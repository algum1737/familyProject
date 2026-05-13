# Expo Circular Planner Visual QA

## Goal

Expo `Today` 화면의 원형 시간판을 실제 iOS 시뮬레이터 기준으로 다시 점검하고, 중심 정보와 라벨이 겹쳐 보이는 문제를 줄인다.

## Scope

- Expo 원형 시간판의 중심 영역, 라벨 반경, 시계 바늘 레이어 순서 재점검
- 기기 폭 변화에 대응할 수 있는 반응형 geometry 보강
- focused helper 테스트와 타입체크, 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 정책 변경이 아니라 Expo `Today` 화면의 시각 레이아웃 품질 보정에 집중한다.

## Steps

1. 현재 Expo 원형 시간판 구조와 실제 시뮬레이터 화면을 확인한다.
2. 중심부 겹침과 라벨 배치 문제를 줄이는 최소 geometry 조정을 설계한다.
3. 관련 helper, 컴포넌트, 테스트를 수정한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- `tests/expo-circular-planner-layout.test.ts`가 통과해야 한다.
- 필요한 관련 테스트가 추가되면 함께 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo 원형 시간판은 이제 카드 폭에 따라 geometry가 반응형으로 조정되고, 중심 흰색 디스크 반경을 줄여 라벨이 중심부를 덮지 않도록 보정했다. 라벨 anchor는 더 바깥쪽 lane으로 이동했고, 시계 바늘과 중앙 핀은 중심 정보 텍스트 아래 레이어로 내려서 `현재 맥락`과 현재 계획 제목을 가리지 않도록 정리했다.

## Validation Result

- `npm test -- tests/expo-circular-planner-layout.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- theme별 실제 React Native 스냅샷이나 픽셀 수준 시각 회귀 테스트는 아직 없다.
