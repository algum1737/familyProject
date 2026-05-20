# Android Start Notification Timing Real Device QA

## Context

`fix/android-start-notification-timing`에서 Expo notification provider가 start/end reminder를 상대 `TIME_INTERVAL` trigger가 아니라 절대 `DATE` trigger로 예약하도록 수정했다.

이번 QA는 수정이 포함된 Android 빌드를 실기기 `SM_S908N`에 설치하고, 시작 5분 전 notification이 target 시각에 active record와 notification shade에 표시되는지 재검증한다.

초기 재검증에서 `QAAbs 17:22 - 18:06` 일정의 시작 알림이 target start-5인 `17:17`에 active notification으로 확인되지 않았고, logcat에서는 `17:22:35`에 notification post가 기록됐다. Android exact alarm 권한이 default 상태인 기기에서는 Expo가 inexact alarm fallback을 사용할 수 있으므로, 앱 동기화가 지연 알림을 너무 빨리 취소하지 않도록 15분 delivery grace를 추가한 뒤 다시 검증한다.

## Scope

- Android 실기기 연결 상태 확인
- 수정 포함 Android 빌드 설치
- 앱이 Metro 없이 실행되는지 확인하거나, dev build 경로를 쓰는 경우 그 제약을 명시
- 알림 권한과 notification channel 상태 확인
- 현재 시각 기준 10~15분 뒤 시작하는 QA 일정 생성
- 앱을 Home/background 상태로 전환
- target start-5 시각의 active notification과 notification shade 표시 확인
- 표시된 앱 알림 dismiss 확인
- QA 일정 삭제와 결과 문서화

## Out of Scope

- 알림 provider 전체 교체
- Play Console 제출 작업
- iOS 실기기 알림 QA
- 기기 절전/배터리 설정 변경

## Assumptions

- 사용자의 `진행하자`는 수정 후 Android 실기기 QA 진행 승인으로 본다.
- 현재 연결된 `SM_S908N` / `R5CT31X2K2H`를 QA 대상 기기로 사용한다.
- standalone release 빌드가 가능하면 standalone을 우선한다. 빌드 시간이 과도하거나 실패하면 dev build/Metro 경로로 전환하고 결과에 명시한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `adb devices -l`
- `adb reverse --list`
- `adb shell date`
- 설치 후 `adb shell dumpsys package com.familyproject.todaydidyoufinish`
- 설치 후 `adb shell dumpsys notification --noredact`

### Automated tests

- `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- QA 문서 갱신 후 `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 수정 포함 Android 빌드 설치
- Today 화면 렌더링 확인
- QA 일정 생성 후 시작/종료 시각 확인
- 앱을 Home/background 상태로 내린 뒤 target start-5 시각까지 대기
- `dumpsys notification --noredact`에서 앱 active notification 확인
- notification shade UI dump에서 `오늘 다 했니`와 QA 일정 시작 5분 전 문구 확인
- notification shade에서 앱 알림 dismiss 후 active list 제거 확인
- QA 일정 삭제

### Skipped/Not Run

- 실제 기기 시간 강제 변경은 실행하지 않는다.
- iOS 실기기 알림은 이번 범위에서 제외한다.

## Open Work

- 완료. 상세 결과는 `Validation Result`에 기록한다.

## Steps

1. 실기기와 현재 브랜치 상태를 확인한다.
2. 수정 포함 Android 빌드를 생성/설치한다.
3. 알림 권한, channel, Metro reverse 상태를 확인한다.
4. target 이후 지연 delivery를 보존하는 15분 grace policy를 코드와 테스트에 반영한다.
5. 10~15분 뒤 시작하는 QA 일정을 생성한다.
6. target start-5 시각부터 15분 관찰 창 안에서 notification delivery를 확인한다.
7. notification shade 표시와 dismiss를 확인한다.
8. QA 일정을 삭제한다.
9. 결과를 completed plan/HANDOFF/docs index에 기록하고 커밋한다.

## Progress Log

- `SM_S908N` / `R5CT31X2K2H` 연결 확인.
- release APK 빌드 및 설치 확인. `adb reverse --list`는 비어 있어 Metro 없는 standalone 설치 경로로 확인.
- `POST_NOTIFICATIONS` 권한은 `granted=true`.
- 초기 `QAAbs 17:22 - 18:06` 일정은 notification shade에 `QAAbs 시작 5분 전입니다.`로 남았으나, target start-5 `17:17` 확인 시점에는 active notification으로 확인되지 않았고 logcat post 시각은 `17:22:35`였다.
- `REMINDER_SCHEDULE_GRACE_MINUTES = 15`를 추가하고, 예약 content metadata에 `scheduledFor`를 저장해 동일 알림/동일 예정 시각은 재동기화 시 취소하지 않도록 보강했다.
- 보강 후 테스트 통과:
  - `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`
  - `npm run typecheck`
  - `npx tsc --noEmit -p apps/expo/tsconfig.json`
- 보강 포함 release APK 재빌드/재설치 완료. `lastUpdateTime=2026-05-15 17:58:54`, `POST_NOTIFICATIONS: granted=true`, `adb reverse --list` empty.
- 보강 포함 설치본에서 `QAGracem 18:16 - 19:01` 일정을 생성했다. title 입력 중 저장 tap이 한 글자 추가 입력으로 처리돼 QA 이름은 `QAGracem`으로 남았다.
- 앱은 `2026-05-15 18:04:02 KST`에 Home/background 상태로 내렸다.
- `dumpsys alarm`에서 start-5 알림은 `origWhen=2026-05-15 18:11:00.000`, end-recovery 알림은 `origWhen=2026-05-15 18:56:00.000`으로 예약된 것을 확인했다.
- `18:11:34`, `18:12:53` 확인 시점에는 active notification이 보이지 않았다.
- AlarmManager history와 logcat에서 start-5 알림의 실제 broadcast/post는 `2026-05-15 18:13:56.960~18:13:57.267 KST`에 발생했다. target 대비 약 2분 57초 지연이며, 15분 grace 관찰 창 안이다.
- 이후 `dumpsys notification --noredact`에서 앱 notification tag `a684754f-37b6-42b7-b20b-40e650b6ad6e`가 archive에 남은 것을 확인했다. notification shade를 열었을 때는 이미 사용자/시스템 상호작용으로 archive 상태라 `QAGracem` 카드 문구는 UI XML에서 캡처하지 못했다.
- 테스트용 `QAGracem` 일정은 삭제했고 Today 화면은 빈 상태로 정리했다.

## Validation Result

### Pre-flight checks

- Passed: `git status --short --branch`로 `fix/android-start-notification-timing` 브랜치와 변경 파일을 확인했다.
- Passed: `adb devices`에서 `R5CT31X2K2H device` 연결을 확인했다.
- Passed: `adb reverse --list`는 비어 있어 Metro 없는 standalone 설치 상태로 확인했다.
- Passed: `adb shell date`로 기기 시간이 KST 기준 현재 시각과 일치함을 확인했다.
- Passed: 설치 후 package 상태는 `versionCode=1`, `versionName=0.1.0`, `POST_NOTIFICATIONS: granted=true`였다.
- Passed: notification channel `today-reminders-high`는 `importance=4` 상태였다.

### Automated tests

- Passed: `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`
- Passed: `npm run typecheck`
- Passed: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- Passed: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Passed: 수정 포함 Android release APK를 빌드하고 `SM_S908N` / `R5CT31X2K2H`에 재설치했다.
- Passed: Today 화면 렌더링과 QA 일정 생성/삭제를 확인했다.
- Passed: `QAGracem 18:16 - 19:01`의 start-5 target `18:11` 알림이 AlarmManager history 기준 `18:13:56`에 발화했다.
- Passed with caveat: Android exact alarm 권한이 default 상태인 기기에서 약 2분 57초 지연됐지만, 15분 grace 정책 안에서 OS notification post가 확인됐다.
- Not captured: notification shade 카드 문구는 확인 시점에 이미 archive 상태로 전환돼 UI XML에서 `QAGracem` / `오늘 다 했니` 텍스트를 캡처하지 못했다.
- Passed: 테스트용 QA 일정은 삭제해 빈 Today 상태로 정리했다.

### Skipped/Not Run

- Skipped: 실제 기기 시간 강제 변경.
- Skipped: iOS 실기기 알림 QA.
