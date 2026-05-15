# Android Notification Delivery Real Device QA

## Context

최신 `main` 기준 Android standalone route boundary smoke는 통과했다. 남은 공백은 같은 설치본에서 실제 Android 기기 background/home 상태의 시작 5분 전, 종료 5분 전 OS 알림 delivery를 다시 확인하고, notification shade 표시와 dismiss까지 증거로 남기는 것이다.

## Scope

- Android 실기기 연결과 설치 앱 상태 확인
- 최신 standalone 설치본이 Metro 없이 실행 중인지 확인
- `POST_NOTIFICATIONS` 권한과 notification channel 상태 확인
- 가까운 미래 QA 일정을 생성해 시작 5분 전 알림과 종료 5분 전 알림을 관찰
- foreground 인앱 리마인드와 background/home OS notification shade 표시를 가능한 범위에서 확인
- notification shade dismiss 후 앱 알림 제거 여부 확인
- 결과를 docs index, handoff, completed plan에 기록

## Out of Scope

- 알림 정책 변경
- 알림 provider 구현 변경
- Play Console 제출 작업
- iOS 실기기 알림 QA
- 장시간 반복/다일 알림 신뢰성 측정

## Assumptions

- 사용자의 `다음 작업 시작하자`는 이전 handoff의 다음 우선 후보 중 Android 알림 delivery QA를 시작하라는 승인으로 본다.
- 현재 연결된 `SM_S908N`을 QA 대상 기기로 사용한다.
- 시간 조작 없이 실제 기기 시간 흐름으로 관찰한다. 필요한 경우 가까운 미래 일정 생성으로 대기 시간을 줄인다.
- OS heads-up 배너는 제조사/설정에 따라 보이지 않을 수 있으므로 notification shade와 `dumpsys notification --noredact` active record를 핵심 증거로 본다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `adb devices -l`
- `adb reverse --list`
- `adb shell dumpsys package com.familyproject.todaydidyoufinish`
- `adb shell dumpsys notification --noredact`

### Automated tests

- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 앱 실행 후 Today 화면 렌더링 확인
- 알림 권한과 channel importance 확인
- 시작 5분 전 또는 시작 근처 인앱 리마인드 표시 확인
- 앱을 Home/background 상태로 전환한 뒤 시작 5분 전 OS 알림 또는 종료 5분 전 OS 알림 표시 확인
- notification shade 또는 `dumpsys notification --noredact`에서 앱 알림 active record 확인
- 표시된 앱 알림 dismiss 후 active/shade에서 제거되는지 확인

### Skipped/Not Run

- 실제 기기 시간을 강제로 변경하는 QA는 증거 왜곡 가능성이 있어 기본적으로 실행하지 않는다.
- 24시간 이상 반복 delivery 신뢰성 측정은 이번 작업 범위에서 제외한다.

## Completed Scope

- Android 실기기 `SM_S908N` / `R5CT31X2K2H` 연결을 확인했다.
- 최신 standalone 설치본 `com.familyproject.todaydidyoufinish`가 Metro reverse 없이 실행 중인 상태를 확인했다.
- 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true` 상태였다.
- notification channel `today-reminders-high`가 `mImportance=4` / `mOriginalImp=4`로 등록되어 있음을 확인했다.
- QA 일정 `QADelivery 14:17 - 14:24`를 생성했다.
- foreground 상태에서 인앱 리마인드 `리마인드: QADelivery · 지금 완료 가능` 표시를 확인했다.
- 앱을 Home/background 상태로 내린 뒤 `14:19` 전후 종료 5분 전 OS notification delivery를 확인했다.
- `dumpsys notification --noredact`에서 active `NotificationRecord`가 `pkg=com.familyproject.todaydidyoufinish`, `channel=today-reminders-high`, `importance=4`, title `오늘 다 했니`, text `QADelivery 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`로 표시됐다.
- notification shade UI dump에서도 `오늘 다 했니`와 `QADelivery 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`가 표시됐다.
- notification shade에서 해당 알림을 swipe dismiss했고, 이후 shade UI dump에는 앱 알림 문구가 남지 않았다.
- QA 일정 `QADelivery`를 삭제해 앱 화면에서 테스트 데이터를 정리했다.

## Steps

1. 실기기 연결, 설치 앱, 알림 권한/channel 상태를 확인한다.
2. 필요하면 최신 standalone APK를 재설치한다.
3. 가까운 미래 QA 일정을 만든다.
4. foreground 인앱 리마인드가 기대대로 보이는지 확인한다.
5. 앱을 Home/background로 내리고 OS 알림 delivery를 기다린다.
6. notification shade와 dumpsys active record를 확인한다.
7. 알림 dismiss를 확인하고 QA 일정 삭제 여부를 정리한다.
8. 결과를 completed plan/HANDOFF/docs index에 기록하고 커밋한다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: `qa/android-notification-delivery-real-device`에서 active plan과 docs index 변경 상태.
- `adb devices -l`: `R5CT31X2K2H device usb:1-1 product:b0qksx model:SM_S908N device:b0q transport_id:10`.
- `adb reverse --list`: empty output, Metro reverse 없음.
- `adb shell dumpsys package com.familyproject.todaydidyoufinish`: 통과. `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true`.
- `adb shell dumpsys notification --noredact`: channel `today-reminders-high` 확인. `mImportance=4`, `mOriginalImp=4`.

### Automated tests

- `bash scripts/validate-docs.sh`: passed.

### Manual/Runtime QA

- 앱 실행 후 Today 화면 렌더링 확인: 통과.
- QA 일정 생성: `QADelivery 14:17 - 14:24` 저장 통과.
- foreground 인앱 리마인드: `리마인드: QADelivery · 지금 완료 가능` 표시 확인.
- background/home OS notification: 통과. `14:19` 전후 종료 5분 전 알림이 active notification과 notification shade에 표시됐다.
- active notification 증거: `NotificationRecord ... pkg=com.familyproject.todaydidyoufinish ... channel=today-reminders-high ... importance=4`, title `오늘 다 했니`, text `QADelivery 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`
- notification shade 증거: UI dump에서 `오늘 다 했니`, `QADelivery 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.` 표시 확인.
- dismiss: notification shade에서 앱 알림을 swipe dismiss한 뒤 UI dump에서 앱 알림 문구가 사라졌다. `dumpsys notification`에는 archive 성격의 `StatusBarNotification` 기록과 channel 설정만 남았다.
- cleanup: 앱에서 `QADelivery` 계획을 삭제했다.

### Skipped/Not Run

- 시작 5분 전 OS 알림은 이번 짧은 일정 생성 시점상 이미 과거가 되어 별도로 닫지 않았다.
- 실제 기기 시간 강제 변경은 실행하지 않았다.
- 24시간 이상 반복 delivery 신뢰성 측정은 실행하지 않았다.
