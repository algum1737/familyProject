# Expo Monthly Regression Tests

## Goal

Expo 앱의 월간 기록 집계와 carry-over 경계가 앱 저장소 흐름에서도 깨지지 않도록 회귀 테스트를 보강한다.

## Scope

- Expo 앱 모델의 월간 record merge 경로 점검
- 월간 selector와 recovery selector의 앱 사용 방식 확인
- carry-over와 현재 날짜 plans가 월간 집계에 반영되는지 단위 테스트 추가
- 관련 타입체크와 테스트 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree에 이미 있는 이전 작업 변경은 보존한다.
- 이번 작업은 테스트 보강 중심이며, 테스트가 실제 결함을 드러내는 경우에만 구현을 수정한다.

## Steps

1. Expo 앱 모델에서 월간 records를 조립하는 경로를 확인한다.
2. 월간 selector와 recovery selector의 입력/출력 계약을 확인한다.
3. 앱에서 사용하는 records merge 규칙을 테스트 가능한 helper로 분리하거나 기존 helper를 활용한다.
4. 월간 집계와 carry-over 반영 회귀 테스트를 추가한다.
5. 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 추가한 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. Expo 앱 모델과 preview 모델의 월간 records 병합 규칙을 `buildExpoMergedPlannerRecords` helper로 분리하고, 현재 날짜 in-memory plans가 월간 selector 입력을 덮어쓰며 과거 records는 보존되는지 테스트로 고정했다. 회복 완료 후속 일정이 Expo 월간 동기부여/회복 지표에 반영되는지도 같은 테스트 파일에 추가했다.

## Validation Result

- `npm test -- tests/expo-bootstrap-and-reminders.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- None.
