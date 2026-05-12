# Expo Sector Color Normalization

## Goal

Expo 원형 시간판에서 잘못 저장된 `plan.color` 값 때문에 섹터 색이 비어 보이거나 SVG 경고가 나는 문제를 막는다.

## Scope

- Expo 원형 시간판 렌더 경로의 색상 방어 로직 추가
- 저장된 planner data의 `color` 값 정규화 helper 추가
- focused 테스트 추가
- 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 현재 문제의 주원인은 일부 `DailyPlan.color` 값에 `mint` 같은 theme key 문자열이 섞인 경우다.
- 이번 작업은 theme key를 실제 plan color palette로 역매핑하기보다 안전한 hex fallback 정규화에 집중한다.

## Steps

1. 현재 Expo planner data와 circular planner 렌더 경로에서 `color` 사용 지점을 확인한다.
2. `DailyPlan.color`가 hex가 아닐 때 안전한 fallback 색으로 정규화하는 helper를 추가한다.
3. 원형 시간판과 저장소 bootstrap/save 경로에서 정규화 helper를 연결한다.
4. 잘못된 `color` 값이 들어와도 섹터 색이 사라지지 않는 focused 테스트를 추가한다.
5. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
6. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 focused 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 잘못된 `plan.color` 값이 다시 생기면, 저장소 주입이나 migration 중 어느 경로가 theme key를 넣는지 추가 추적이 필요하다.

## Completion

Completed. Expo 원형 시간판과 Expo 저장소/bootstrap 경로에 `plan.color` 정규화 방어를 추가했다. 새 shared helper `src/domains/plans/service/plan-color.ts`가 hex가 아닌 값에 기본 fallback 색을 적용하고, `createAsyncRecordBackedPlansStore`, Expo AsyncStorage plans/records store, `useExpoAppBootstrap`, `useExpoPlannerPreviewModel`, `useExpoPlannerState`, `ExpoCircularPlanner`가 이 helper를 사용하도록 연결했다. 그 결과 기존 저장 데이터에 `mint`, `sand`, `night-ink` 같은 theme key가 섞여 있어도 섹터 fill과 alpha overlay가 무효 색으로 깨지지 않고, 이후 저장 시 정상 hex 값으로 정리된다.

## Validation Result

- `npm test -- tests/plan-color-normalization.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Extra Verification

- 루트 `npm run typecheck`는 이번 변경과 무관한 기존 `tests/expo-router-route-actions.test.ts`의 `startRescheduling` mock 타입 불일치로 실패했다.
