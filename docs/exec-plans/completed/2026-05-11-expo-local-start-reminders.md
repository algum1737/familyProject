# Expo Local Start Reminders

## Goal

Expo 앱에서 시작 리마인드를 실제 OS 로컬 알림으로 예약해, 앱이 백그라운드이거나 닫혀 있을 때도 시작 시점 근처 신호가 오도록 만든다.

## Scope

- 시작 리마인드 예약 규칙 helper 추가
- Expo notifications provider에 권한 요청, sync, schedule, cancel 구현
- Expo 앱 모델/preview 모델에서 reminder sync 연결
- focused 테스트, 타입체크, 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 첫 버전은 시작 리마인드만 OS 알림으로 예약하고, 종료 5분 전 회복 알림은 인앱 배너로 유지한다.

## Steps

1. 시작 리마인드 예약 규칙과 identifier/data shape를 helper로 분리한다.
2. Expo notifications provider에 permission, sync, schedule, cancel을 구현한다.
3. Expo 앱 모델과 preview 모델에서 reminder sync를 연결한다.
4. 관련 focused 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 reminder 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo 앱의 시작 리마인드는 이제 실제 OS 로컬 알림 예약 경로를 가진다. 시작 5분 전 미래 pending 일정만 대상으로 삼는 scheduling helper를 추가했고, Expo notifications provider는 권한 요청, managed start reminder sync, 계획별 cancel, foreground 배너 표시 handler를 구현했다. Expo app model과 preview model도 reminder sync를 실제로 호출하도록 연결돼, 계획 저장/삭제/시간 흐름에 따라 예약이 재조정된다.

## Validation Result

- `npm test -- tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- 실제 기기 또는 시뮬레이터에서 알림 권한 허용 후 foreground/background 수신 QA는 아직 별도 기록으로 남기지 않았다.
