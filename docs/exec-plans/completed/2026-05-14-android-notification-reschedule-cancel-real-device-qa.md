# Android Notification Reschedule Cancel Real Device QA

## Context

Android 실기기에서 종료 5분 전 OS notification 표시와 time picker navigation bar safe area는 확인됐다. 남은 핵심 공백은 실제 기기에서 일정 수정/삭제가 Expo 로컬 알림 예약과 표시 상태를 예상대로 갱신하거나 취소하는지 확인하는 것이다.

## Scope

- Android 실기기 `SM_S908N` 기준 최신 debug APK와 Metro 연결 상태 확인
- QA 일정 생성 후 pending notification 예약 확인
- 일정 제목/시간 수정 후 기존 예약이 새 제목/시간 기준으로 갱신되는지 확인
- 일정 삭제 후 pending/active notification이 남지 않는지 확인
- 결과를 docs와 handoff에 기록

## Out of Scope

- EAS cloud preview/production build 생성
- iOS 시뮬레이터/실기기 QA
- Play Console 제출 작업
- 새로운 알림 정책 추가

## Assumptions

- 사용자의 `다음 진행하자`는 직전 handoff의 남은 Android 알림 QA 공백을 이어가라는 승인으로 본다.
- debug APK는 Metro 8081 연결이 필요하며, sandbox 내 8081 bind가 막히면 외부 권한으로 Metro를 실행한다.
- OS notification shade의 heads-up 배너 애니메이션은 화면 녹화 없이 안정적으로 잡기 어렵기 때문에, notification shade 표시와 `dumpsys notification`/pending 예약 상태를 1차 증거로 둔다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- ADB 실기기 연결 확인
- Metro 8081 연결 상태 확인

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts tests/expo-bootstrap-and-reminders.test.ts tests/expo-time-picker-safe-area.test.ts`
- `npm run typecheck`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Android 실기기에서 QA 일정 생성 후 예약/표시 상태 확인
- QA 일정 수정 후 기존 알림이 새 제목/시간으로 갱신되는지 확인
- QA 일정 삭제 후 pending/active notification 잔존 여부 확인

### Skipped/Not Run

- heads-up 배너 순간 애니메이션 캡처는 화면 녹화 장비 없이는 불안정하므로, notification shade와 `dumpsys notification` 중심으로 판단한다.

## Steps

1. 현재 브랜치/기기/Metro 상태를 확인한다.
2. 필요 시 Metro와 `adb reverse`를 복구한다.
3. 실기기에서 QA 일정 생성 후 pending notification 예약 상태를 확인한다.
4. 일정 제목 또는 시간을 수정하고 pending notification 갱신 상태를 확인한다.
5. 일정 삭제 후 pending/active notification 잔존 여부를 확인한다.
6. 자동 검증과 문서 검증을 실행한다.
7. 완료 결과를 기록하고 completed로 이동한다.

## Completion

- Android 실기기 `SM_S908N`에서 debug APK와 Metro 8081 연결을 복구했다.
- 기존 QA 일정 `알림테스트 11:21 - 11:30`의 pending alarm은 `2026-05-14 11:24:59`로 확인했다.
- 종료 시간을 `11:32`로 수정하자 기존 `11:24:59` alarm은 `alarm_cancelled`로 기록되고 새 pending alarm `2026-05-14 11:26:59`가 생성됐다.
- 수정 직후 일정을 삭제했을 때 UI에서는 일정이 사라졌지만, pending alarm `2026-05-14 11:26:59`가 남는 결함을 발견했다.
- 원인은 빠른 수정/삭제 중첩 시 이전 reminder sync가 늦게 schedule을 완료하고, 삭제 sync가 그 예약을 보기 전에 cancel 목록을 읽는 비동기 경합이었다.
- `createExpoReminderSyncQueue`를 추가해 reminder sync를 직렬화하고 stale sync task가 side effect를 남기지 않도록 수정했다.
- 수정 후 앱을 force-stop/relaunch하여 새 JS bundle을 로드했고, stale `e8129d9` alarm이 `alarm_cancelled`로 이동한 것을 확인했다.
- `dumpsys notification --noredact` 기준 앱 알림은 archive에만 남고 active `Notification List`에는 삭제된 일정 알림이 남지 않았다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: 통과. `feature/android-real-device-notification-qa`에서 진행했다.
- ADB 실기기 연결 확인: 통과. `SM-S908N` / `R5CT31X2K2H`.
- Metro 8081 연결 상태 확인: 통과. 기존 Metro가 없어 외부 권한으로 `EXPO_NO_TELEMETRY=1 npx expo start --dev-client --port 8081 --clear`를 실행하고 `adb reverse tcp:8081 tcp:8081`을 설정했다.

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts tests/expo-bootstrap-and-reminders.test.ts tests/expo-time-picker-safe-area.test.ts`: 통과. 5 files / 16 tests passed.
- `npm run typecheck`: 통과.
- `bash scripts/validate-docs.sh`: 통과.

### Manual/Runtime QA

- QA 일정 수정 후 기존 알림이 새 시간으로 갱신되는지 확인: 통과.
- QA 일정 삭제 후 pending/active notification 잔존 여부 확인: 초기 실패 후 수정/재검증 통과.

### Skipped/Not Run

- heads-up 배너 순간 애니메이션 캡처는 미실행. notification shade, `dumpsys alarm`, `dumpsys notification` 기준으로 판단했다.
