# Expo Screen Store Integration Tests

## Goal

Expo 앱 화면과 저장소 연결 경로에서 핵심 상태가 실제 store 데이터와 맞물려 동작하는지 통합 성격의 테스트를 보강한다.

## Scope

- Expo 연결형 화면 또는 앱 모델의 store 연결 경로 확인
- 테스트하기 쉬운 고가치 경로 1개 이상 선정
- 필요한 helper 분리 또는 작은 구조 정리
- focused 테스트 추가와 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree에 이미 남아 있는 변경은 보존한다.
- 이번 작업은 테스트 보강 중심이며, 테스트를 위해 필요한 작은 보조 분리만 허용한다.

## Steps

1. Expo 연결형 화면, 앱 모델, store/provider 경로를 다시 읽는다.
2. 현재 테스트 공백 중 위험 대비 효율이 높은 경로를 선정한다.
3. 필요한 helper를 분리하고 focused 테스트를 추가한다.
4. 타입체크와 테스트, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 추가한 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. `useConnectedMotivationScreen`이 현재 날짜 plans를 저장 effect 이후가 아니라 같은 렌더에서 월간 records에 덮어쓰도록 수정했고, `AppMotivationShell` 기준으로 stale current-date records를 현재 plans가 덮어쓰는지와 `recordsStore.saveForDate` 호출이 일어나는지를 통합 테스트로 고정했다.

## Validation Result

- `npm test -- tests/app-motivation-shell.test.tsx tests/expo-bootstrap-and-reminders.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`은 기존 상태대로 통과하는 것을 유지했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- None.
