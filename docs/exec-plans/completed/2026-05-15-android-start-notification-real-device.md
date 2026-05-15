# Android Start Notification Real Device QA

## Context

Android 실기기 알림 delivery QA에서 foreground 인앱 리마인드와 background/home 종료 5분 전 OS notification은 확인했다. 시작 5분 전 OS notification은 QA 일정 생성 시점상 이미 과거였기 때문에 별도 실기기 QA로 닫는다.

이번 QA는 현재 기기 시간 기준 10~15분 뒤 시작하는 일정을 만들고, 앱을 background/home 상태로 내린 뒤 시작 5분 전 OS notification delivery를 확인한다.

## Scope

- Android 실기기 연결 상태 확인
- 최신 standalone 설치본이 Metro 없이 실행 중인지 확인
- 알림 권한과 notification channel 상태 확인
- 현재 시각 기준 10~15분 뒤 시작하는 QA 일정 생성
- 앱을 Home/background 상태로 전환
- 시작 5분 전 OS notification active record와 notification shade 표시 확인
- 표시된 앱 알림 dismiss 후 shade에서 제거되는지 확인
- QA 일정 삭제와 결과 문서화

## Out of Scope

- 알림 provider 구현 변경
- 종료 5분 전 알림 재검증
- Play Console 제출 작업
- iOS 실기기 알림 QA
- 24시간 이상 반복 delivery 신뢰성 측정

## Assumptions

- 사용자의 `순서 대로 진행하자`는 PR/merge 후 시작 5분 전 OS 알림 QA를 바로 이어서 진행하라는 승인으로 본다.
- 현재 연결된 `SM_S908N`을 QA 대상 기기로 사용한다.
- 일정은 현재 기기 시간 기준 10~15분 뒤 시작으로 잡아 시작 5분 전 알림을 여유 있게 관찰한다.
- OS heads-up 배너는 제조사/설정에 따라 보이지 않을 수 있으므로 notification shade와 `dumpsys notification --noredact` active record를 핵심 증거로 본다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `adb devices -l`
- `adb reverse --list`
- `adb shell date`
- `adb shell dumpsys package com.familyproject.todaydidyoufinish`
- `adb shell dumpsys notification --noredact`

### Automated tests

- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Today 화면 렌더링 확인
- QA 일정 생성 후 시작/종료 시각 확인
- 앱을 Home/background로 내린 뒤 시작 5분 전 시점까지 대기
- `dumpsys notification --noredact`에서 앱 active notification 확인
- notification shade UI dump에서 `오늘 다 했니`와 QA 일정 시작 5분 전 문구 확인
- notification shade에서 앱 알림 dismiss 후 문구 제거 확인
- QA 일정 삭제

### Skipped/Not Run

- 실제 기기 시간 강제 변경은 실행하지 않는다.
- 종료 5분 전 알림은 직전 QA에서 확인했으므로 이번 범위에서 제외한다.

## Open Work

- 완료. QA 결과는 아래 `Completed Scope`와 `Validation Result`에 기록한다.

## Steps

1. 실기기 연결, 설치 앱, 알림 권한/channel 상태를 확인한다.
2. 현재 기기 시간을 확인하고 QA 일정 시작/종료 시각을 정한다.
3. 앱에서 QA 일정을 생성한다.
4. 앱을 Home/background 상태로 내린다.
5. 시작 5분 전 시점에 notification delivery를 확인한다.
6. notification shade 표시와 dismiss를 확인한다.
7. QA 일정을 삭제한다.
8. 결과를 completed plan/HANDOFF/docs index에 기록하고 커밋한다.

## Completed Scope

- `main`에 PR #10이 merge된 뒤 `qa/android-start-notification-real-device` 브랜치에서 QA를 진행했다.
- Android 실기기 `SM_S908N` / `R5CT31X2K2H` 연결을 확인했다.
- 설치 앱은 `com.familyproject.todaydidyoufinish` `versionCode=1`, `versionName=0.1.0`, `targetSdk=36` 상태였고, `POST_NOTIFICATIONS granted=true`였다.
- `adb reverse --list`가 비어 있어 Metro reverse 없는 standalone 조건을 유지했다.
- notification channel `today-reminders-high`는 `importance=4` 상태였다.
- 기기 시간 `2026-05-15 15:33:21 KST` 기준 QA 일정 `QAStart 15:45 - 16:33`을 생성했다.
- 계획 편집 화면에서 3-button navigation bar가 있는 상태의 하단 버튼 배치를 확인했다.
  - `취소` bounds: `[102,1927][805,2056]`
  - `저장` bounds: `[833,1927][980,2056]`
  - navigation bar bounds: `[0,2181][1080,2316]`
  - 결과: 하단 버튼은 navigation bar 위에 렌더링되어 가려지지 않았다.
- 앱을 Home/background 상태로 내린 뒤 시작 5분 전 목표 시각인 `15:40` 전후를 관찰했다.
- `15:40:25 KST` 확인에서는 앱 notification이 active `NotificationRecord`가 아니라 archive에만 남아 있었고, notification shade UI에는 `QAStart` 알림 문구가 보이지 않았다.
- `15:46:11 KST` 확인에서는 active `NotificationRecord`가 생성되어 있었다.
  - title: `오늘 다 했니`
  - text/bigText: `QAStart 시작 5분 전입니다.`
  - channel: `today-reminders-high`
  - importance: `4`
- notification shade UI에서도 `오늘 다 했니` / `QAStart 시작 5분 전입니다.` 표시를 확인했다.
- 표시된 notification은 swipe dismiss 후 active list에서 사라지고 archive에만 남는 것을 확인했다.
- QA 일정 `QAStart`는 삭제했고, Today 화면은 `0/0` 상태로 정리했다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: `qa/android-start-notification-real-device` 브랜치에서 진행했다.
- `adb devices -l`: `R5CT31X2K2H device ... model:SM_S908N` 연결을 확인했다.
- `adb reverse --list`: 비어 있음.
- `adb shell date`: `Fri May 15 15:33:21 KST 2026` 기준으로 QA 일정을 잡았다.
- `adb shell dumpsys package com.familyproject.todaydidyoufinish`: 설치 앱과 알림 권한 상태를 확인했다.
- `adb shell dumpsys notification --noredact`: channel과 notification record/archive 상태를 확인했다.

### Automated tests

- `bash scripts/validate-docs.sh`: Passed.

### Manual/Runtime QA

- Today 화면 렌더링: Passed.
- QA 일정 생성 후 시작/종료 시각 확인: Passed (`QAStart 15:45 - 16:33`).
- Home/background 상태 전환: Passed.
- 시작 5분 전 목표 시각의 active notification 확인: Failed. `15:40:25 KST`에는 active record가 없고 archive 흔적만 있었다.
- notification shade 표시 확인: Failed at target time. `15:40:25 KST`에는 표시 문구가 보이지 않았다.
- 지연 후 notification delivery 확인: Passed with timing issue. `15:46:11 KST`에는 active record와 shade 문구가 확인됐다.
- notification dismiss 확인: Passed.
- QA 일정 삭제: Passed.
- 3-button navigation bar가 있는 경우 계획 편집 하단 버튼 가림 여부: Passed.

### Skipped/Not Run

- 실제 기기 시간 강제 변경은 실행하지 않았다.
- 종료 5분 전 알림은 직전 QA에서 확인했으므로 이번 범위에서 제외했다.

## Follow-up

- 시작 5분 전 notification은 발행/표시 자체는 가능하지만, background/home 및 잠금 조건에서 목표 시각보다 약 6분 늦게 활성화됐다.
- 다음 구현 작업에서는 Android background 알림 scheduling 지연 원인을 별도 fix plan으로 다룬다. 후보 원인은 Samsung background freeze/Doze 조건, Expo notification trigger 지연, 앱 프로세스 상태에 따른 예약 처리 지연이다.
