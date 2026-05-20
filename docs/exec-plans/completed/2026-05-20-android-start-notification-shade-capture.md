# Android Start Notification Shade Capture QA

## Context

Android 시작 5분 전 알림 지연 보강 후 실기기 QA에서 AlarmManager/logcat 기준 notification post는 확인했지만, notification shade 확인 시점에는 알림이 archive 상태로 전환돼 `오늘 다 했니`와 `시작 5분 전입니다.` 문구를 UI XML/스크린샷으로 캡처하지 못했다.

이번 작업은 최신 `main` standalone APK를 Android 실기기 `SM_S908N` / `R5CT31X2K2H`에 설치하고, 시작 5분 전 알림이 notification shade에 표시되는 실제 문구를 캡처해 기록한다.

## Scope

- Android 실기기 연결 상태 확인
- 최신 `main` 기준 release APK 빌드 및 설치
- Metro reverse가 없는 standalone 상태 확인
- 알림 권한과 notification channel 상태 확인
- 현재 시각 기준 10~15분 뒤 시작하는 QA 일정 생성
- 앱을 Home/background 상태로 전환
- target start-5 이후 15분 관찰 창 안에서 notification shade 카드 문구 캡처
- active notification record와 AlarmManager/logcat 발화 시각 확인
- notification dismiss와 QA 일정 삭제
- QA 결과 문서화, `docs/index.md`, `docs/HANDOFF.md` 갱신

## Out of Scope

- 알림 provider 코드 변경
- Play Console 제출 작업
- iOS 실기기 알림 QA
- 기기 시간 강제 변경
- 기기 절전/배터리 설정 변경

## Assumptions

- 사용자의 `실기기 연결했다 진행하자`는 QA 브랜치 생성, 빌드/설치, 실기기 조작, 문서화 승인으로 본다.
- 현재 연결된 `SM_S908N` / `R5CT31X2K2H`를 QA 대상 기기로 사용한다.
- 시작 5분 전 알림은 Android exact alarm 권한 default 상태에서 수분 지연될 수 있으므로 target 이후 최대 15분까지 관찰한다.
- 알림 shade 문구 캡처가 이번 작업의 핵심 성공 기준이다.

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

- 최신 release APK 빌드 및 설치
- Today 화면 렌더링 확인
- QA 일정 생성 후 시작/종료 시각 확인
- 앱을 Home/background 상태로 내린 뒤 target start-5 시각까지 대기
- `dumpsys notification --noredact`에서 앱 active notification 확인
- notification shade 스크린샷 또는 UI XML에서 `오늘 다 했니`와 QA 일정 시작 5분 전 문구 확인
- notification shade에서 앱 알림 dismiss 후 active list 제거 확인
- QA 일정 삭제

### Skipped/Not Run

- 실제 기기 시간 강제 변경은 실행하지 않는다.
- iOS 실기기 알림은 이번 범위에서 제외한다.

## Completed Scope

- `qa/android-start-notification-shade-capture` 브랜치에서 최신 `main` 기준 Android release APK를 빌드하고 실기기 `SM_S908N` / `R5CT31X2K2H`에 설치했다.
- `adb reverse --list`가 비어 있는 standalone 상태, `POST_NOTIFICATIONS granted=true`, channel `today-reminders-high` / `importance=4` 상태를 확인했다.
- QA 일정 `QAShade 14:30 - 14:58`을 만들고 앱을 Home/background 상태로 내린 뒤 start-5 목표 시각 `2026-05-20 14:25:00 KST` 이후 알림을 관찰했다.
- AlarmManager history에서 start reminder가 `2026-05-20 14:33:06.197 KST`에 발화한 것을 확인했다. 목표 시각보다 약 8분 6초 늦었고, 이번 QA의 15분 관찰 창 안이다.
- notification shade에서 실제 카드 문구 `오늘 다 했니` / `QAShade 시작 5분 전입니다.`를 스크린샷과 UI XML로 캡처했다.
- QA 일정은 앱 화면에서 삭제했고, end reminder PendingIntent `b94c286`은 `alarm_cancelled`로 기록됐다.

## Evidence

- Shade screenshot: `/private/tmp/qashade-shade-live.png`
- Shade UI XML: `/private/tmp/qashade-window-live.xml`
- Notification record tag: `580ed9b4-1304-452a-b46b-271c886c03a3`
- Notification body metadata: `kind=start-reminder`, `scheduledFor=2026-05-20T05:25:00.000Z`
- Start alarm fire history: `origWhen=1779254700000`, `rtc=2026-05-20 14:33:06.197`
- End alarm cancellation history: `H=PI:b94c286 Reason=alarm_cancelled rtc=2026-05-20 14:43:56.082`

## Validation Result

### Pre-flight checks

- PASS: `git status --short --branch` confirmed work on `qa/android-start-notification-shade-capture`.
- PASS: `adb devices -l` detected `R5CT31X2K2H device usb:1-1 product:b0qksx model:SM_S908N device:b0q`.
- PASS: `adb reverse --list` returned empty, confirming no Metro reverse tunnel.
- PASS: `adb shell date` returned device time in KST.
- PASS: `dumpsys package com.familyproject.todaydidyoufinish` confirmed `versionCode=1`, `versionName=0.1.0`, `POST_NOTIFICATIONS granted=true`.
- PASS: `dumpsys notification --noredact` confirmed channel `today-reminders-high`, channel name `오늘 다 했니 리마인드`, `importance=4`.

### Automated tests

- PASS: `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `./gradlew assembleRelease`
- PASS: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- PASS: release APK installed with `adb install -r`.
- PASS: Today screen rendered and QA schedule `QAShade 14:30 - 14:58` was saved.
- PASS: start reminder was scheduled for `2026-05-20 14:25:00 KST`; Android assigned an approximate delivery window of `+8m6s178ms`.
- PASS: notification became active at `2026-05-20 14:33:06.197 KST`, within the 15 minute observation window.
- PASS: notification record contained title `오늘 다 했니` and text/bigText `QAShade 시작 5분 전입니다.`
- PASS: notification shade screenshot showed the same user-facing title and body.
- PASS: QA schedule was deleted after capture; the pending end reminder was cancelled.
- PARTIAL: after the shade card was swiped away and the app was force-stopped, `dumpsys notification` still showed the app `StatusBarNotification` record for a short period even though the card was no longer visible in the shade screenshot. This is recorded as a cleanup observation, not a delivery failure.

### Skipped/Not Run

- SKIPPED: device time manipulation.
- SKIPPED: iOS real-device notification QA.

## Steps

1. 실기기와 현재 브랜치 상태를 확인한다.
2. 최신 Android release APK를 빌드하고 설치한다.
3. 권한, channel, Metro reverse 상태를 확인한다.
4. 10~15분 뒤 시작하는 QA 일정을 생성한다.
5. 앱을 Home/background로 내린다.
6. target start-5 이후 15분 관찰 창 안에서 active record, shade 문구, 스크린샷/UI XML을 확보한다.
7. 알림 dismiss와 QA 일정 삭제를 수행한다.
8. 결과를 completed plan/HANDOFF/docs index에 기록하고 검증 후 커밋한다.
