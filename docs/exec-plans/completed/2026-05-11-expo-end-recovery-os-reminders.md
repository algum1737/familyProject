# Expo End Recovery OS Reminders

## Goal

Expo 앱에서 종료 5분 전 `이미 마쳤다면 완료 처리`를 유도하는 OS 로컬 알림을 추가해, 완료 버튼 누락으로 `missed`가 되는 사례를 줄인다.

## Scope

- Expo 로컬 알림 scheduling helper를 종료 5분 전 알림까지 확장
- Expo notifications provider에서 시작/종료 알림 sync와 cancel 갱신
- reminder 정책 문서 정합성 갱신
- focused 테스트, 타입체크, 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 첫 추가 범위는 `pending` 일정의 종료 5분 전 1회 OS 알림이며, 회고/다시 지정 진입은 여전히 인앱 카드 흐름에 남긴다.

## Steps

1. 시작/종료 알림 helper 구조를 정리한다.
2. Expo provider에서 종료 5분 전 알림 예약과 취소를 구현한다.
3. 관련 테스트와 reminder 정책 문서를 갱신한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 reminder 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo 로컬 알림은 이제 시작 5분 전뿐 아니라 종료 5분 전 `이미 마쳤다면 완료 처리` 알림도 함께 예약한다. scheduling helper는 시작/종료 알림 request를 모두 계산하도록 확장됐고, Expo notifications provider는 두 kind를 하나의 managed sync/cancel 경로로 다루도록 갱신됐다. 제품 정책 문서도 종료 5분 전 OS 알림과 인앱 `계속 진행` 배너를 함께 유지하는 방향으로 갱신했다.

## Validation Result

- `npm test -- tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- 실제 권한 허용 후 종료 5분 전 foreground/background 수신 QA는 아직 별도 완료 기록으로 남기지 않았다.
