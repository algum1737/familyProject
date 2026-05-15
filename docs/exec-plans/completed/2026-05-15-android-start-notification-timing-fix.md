# Android Start Notification Timing Fix

## Context

Android 실기기 `SM_S908N`에서 시작 5분 전 OS notification QA를 진행한 결과, `QAStart 15:45 - 16:33` 일정의 target start-5 시각 `15:40`에는 active notification이 없었고 `15:46`에야 active record와 notification shade 표시가 확인됐다.

이번 작업은 시작 5분 전 알림이 목표 시각에 더 가깝게 전달되도록 알림 예약/동기화 경로를 수정하고, 같은 회귀를 막을 테스트를 추가한다.

## Scope

- Expo/Android 알림 예약 provider와 reminder sync 경로 조사
- 시작 5분 전 알림이 늦게 활성화되는 원인 후보 축소
- 필요한 경우 Android 전용 scheduling 옵션 또는 예약 시점 계산 수정
- 시작 알림과 종료 알림의 기존 문구/channel 계약 유지
- 관련 단위 테스트 또는 provider 계약 테스트 보강
- 문서와 handoff 갱신

## Out of Scope

- Play Console 제출 작업
- iOS 실기기 알림 QA
- 종료 5분 전 알림 정책 변경
- Samsung OS 절전 설정 자체 변경을 전제로 한 해결
- 반복 알림, snooze, 서버 push 도입

## Assumptions

- 사용자의 `진행하자`는 새 fix 브랜치 생성과 구현 변경 승인으로 본다.
- 현재 기준 브랜치는 최신 `main`이다.
- 이번 작업의 1차 성공 기준은 코드/테스트에서 start-5 예약 계약을 바로잡는 것이다.
- 실기기 재검증은 수정 후 필요하면 사용자에게 기기 연결/잠금 해제를 요청한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `rg -n "schedule|Notification|Reminder|start.*5|trigger|today-reminders" apps src tests`
- 관련 completed QA plan 확인

### Automated tests

- 관련 reminder/provider Vitest
- `npm run typecheck`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 필요 시 Android 실기기 standalone/dev build에서 10~15분 뒤 시작 일정을 만들고 start-5 active notification과 shade 표시를 확인한다.
- 실기기 QA가 즉시 불가능하면 미실행 사유와 후속 QA 계약을 기록한다.

### Skipped/Not Run

- 기기 시간을 강제로 변경하지 않는다.
- iOS 실기기 알림은 이번 범위에서 제외한다.

## Open Work

- 완료. 결과는 아래 `Completed Scope`와 `Validation Result`에 기록한다.

## Steps

1. 알림 예약/동기화 코드와 테스트 위치를 찾는다.
2. Expo notifications trigger 옵션과 예약 계산 로직을 확인한다.
3. start-5 알림 지연을 줄이는 수정안을 적용한다.
4. 자동 테스트를 추가/갱신한다.
5. 검증 결과를 plan/HANDOFF/docs index에 반영한다.
6. 커밋한다.

## Completed Scope

- Android 시작 5분 전 notification 지연 QA 결과를 기준으로 알림 예약 경로를 조사했다.
- `buildExpoStartReminderRequests`의 scheduled time 계산은 `startMinute - REMINDER_LEAD_MINUTES`로 맞게 동작했고, 기존 테스트도 `15:45` 시작이면 `15:40` 예약이 되도록 검증하고 있었다.
- 실제 provider의 예약 호출은 `scheduledFor`를 `Date.now()` 기준 상대 초로 변환한 뒤 `TIME_INTERVAL` trigger로 전달하고 있었다.
- Android background/home 및 잠금 조건에서 상대 time interval 예약이 밀릴 가능성을 줄이기 위해, provider가 `scheduledFor` 절대 시각을 `DATE` trigger로 직접 전달하도록 바꿨다.
- notification content, channel id, channel name, notification key, start/end 문구 계약은 유지했다.
- `buildExpoReminderDateTrigger` helper를 추가하고, 절대 날짜 trigger 계약을 테스트로 고정했다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: `fix/android-start-notification-timing` 브랜치에서 진행했다.
- `rg -n "schedule|Notification|Notifications|Reminder|start.*5|end.*5|today-reminders|trigger" apps src tests`: provider/sync/test 경로를 확인했다.
- `docs/exec-plans/completed/2026-05-15-android-start-notification-real-device.md`: 지연 QA 결과를 확인했다.

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts`: Passed.
- `npm run typecheck`: Passed.
- `npx tsc --noEmit -p apps/expo/tsconfig.json`: Passed.
- `bash scripts/validate-docs.sh`: Passed.

### Manual/Runtime QA

- Not run in this change. 기존 standalone 설치본에는 이번 JS 변경이 포함되어 있지 않다.
- 실기기 재검증은 새 standalone 또는 dev build를 설치한 뒤 10~15분 뒤 시작 일정을 만들고 target start-5 시각의 active notification과 notification shade 표시를 다시 확인해야 한다.

### Skipped/Not Run

- 기기 시간을 강제로 변경하지 않았다.
- iOS 실기기 알림은 이번 범위에서 제외했다.
