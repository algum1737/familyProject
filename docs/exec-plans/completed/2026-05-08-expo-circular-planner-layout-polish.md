# Expo Circular Planner Layout Polish

## Goal

Expo `Today` 화면의 원형 시간판이 실제 앱 레이아웃 안에서 너무 답답하거나 라벨이 겹쳐 보이지 않도록 보드 크기와 라벨 배치를 다듬는다.

## Scope

- Expo 원형 시간판 캔버스, 반지름, 라벨 배치 구조 확인
- today 화면 카드 폭과 함께 시각 균형 점검
- 필요한 최소 레이아웃 조정과 focused 검증
- 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 정책 변경이 아니라 시각 레이아웃 품질 조정에 집중한다.

## Steps

1. 원형 시간판과 today 화면 레이아웃 구조를 다시 읽는다.
2. 보드 크기, 라벨 충돌, 여백 균형에서 가장 큰 문제를 선정한다.
3. 필요한 최소 구조 조정과 관련 테스트 보강을 수행한다.
4. 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. Expo 원형 시간판의 캔버스와 반지름 비율을 키우고, outer badge truncation을 더 공격적으로 줄였으며, 중앙에 `현재 맥락`과 현재 계획 제목을 넣어 빈 중심부를 정보 영역으로 바꿨다. 관련 레이아웃 계산은 `expo-circular-planner-layout` helper로 분리해 보드 크기, 라벨 절단, 중앙 문구 규칙을 테스트로 고정했다.

## Validation Result

- `npm test -- tests/expo-circular-planner-layout.test.ts tests/expo-router-route-actions.test.ts tests/reschedule-failure-guidance.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- 실제 시뮬레이터 기준의 픽셀 레벨 시각 QA는 아직 별도 스냅샷 테스트로 고정되지 않았다.
