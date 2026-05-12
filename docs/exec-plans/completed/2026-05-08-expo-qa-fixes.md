# Expo QA Fixes

## Goal

Expo 앱 QA 리뷰에서 확인된 데이터 보존과 리마인드 dismiss key 관련 결함을 수정하고, 가능한 범위에서 앱 전용 검증 공백도 줄인다.

## Scope

- Expo bootstrap의 빈 상태/legacy migration/records 복구 경로 점검
- Expo 리마인드 dismiss key 정책 점검
- 확인된 결함 수정
- 관련 검증 코드 또는 최소 재현 검증 추가
- 완료 시 검증 결과와 남은 작업 기록

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 문서 변경은 이번 작업 범위 밖이며 되돌리지 않는다.
- 이번 작업은 Expo 앱 QA 리뷰 문서에 기록된 이슈를 우선순위로 다룬다.

## Steps

1. QA 리뷰 문서와 관련 Expo bootstrap/reminder/store 코드를 다시 읽는다.
2. 데이터 보존과 dismiss key 경로를 재현 가능한 단위로 정리한다.
3. 결함을 수정하고 필요한 검증 코드를 추가한다.
4. 타입체크와 관련 테스트를 실행한다.
5. 완료 범위와 검증 결과를 기록하고, 남은 작업이 없으면 completed로 이동한다.

## Validation

- 수정한 경로를 재현하는 테스트 또는 동등한 검증이 있어야 한다.
- `apps/expo` 기준 타입체크 또는 루트 테스트가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. Expo bootstrap이 기존 records를 잃거나 초기 빈 상태로 덮어쓸 수 있는 경로를 막고, reminder dismiss key를 instance key 기준으로 맞췄다. 관련 bootstrap 판단과 dismiss 규칙은 단위 테스트로 고정했다.

## Validation Result

- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- 루트에서 `npm test -- tests/expo-bootstrap-and-reminders.test.ts`가 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- None.
