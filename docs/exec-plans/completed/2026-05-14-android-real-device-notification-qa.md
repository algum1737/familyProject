# Android Real Device Notification QA

## Goal

Android 실기기 `SM_S908N`에서 standalone 앱의 로컬 알림 동작을 확인한다. 특히 이전 Android preview standalone QA에서 미실행으로 남은 background/home 상태 OS 알림 전달과 notification shade dismiss를 검증한다.

## Scope

- 현재 브랜치와 실기기 ADB 연결 상태 확인
- 최신 사용 가능한 Android standalone 빌드 식별
- 실기기에 앱 설치 또는 기존 설치 상태 확인
- 알림 권한 상태 확인
- Today 화면 진입 smoke
- foreground 인앱 리마인드 smoke
- background/home 상태 OS 알림 전달 smoke
- notification shade dismiss 확인
- 결과를 exec plan, `docs/index.md`, `docs/HANDOFF.md`에 기록

## Out Of Scope

- 제품 코드 변경
- Play Console 계정 생성, app record 생성, production AAB 제출
- iOS credential setup 또는 iPhone 실기기 QA

## Assumptions

- 사용자가 Android 실기기 연결과 작업 브랜치 생성을 승인했다.
- QA 대상 실기기는 ADB serial `R5CT31X2K2H`, model `SM_S908N`이다.
- 이번 작업은 Android 실기기 런타임 검증이 목적이며, 필요하지 않으면 새 EAS cloud build를 만들지 않는다.

## Pre-flight checks

- `git status --short --branch`
- `/Users/hun/Library/Android/sdk/platform-tools/adb devices -l`
- 사용 가능한 APK/AAB 산출물 확인
- 기기 설치 앱과 알림 권한 상태 확인

## Steps

1. 브랜치와 active plan 상태를 확인한다.
2. QA에 사용할 Android 빌드 산출물을 확정한다.
3. `SM_S908N`에 앱을 설치하거나 기존 설치 상태를 확인한다.
4. 앱을 실행해 Today 화면과 알림 권한 상태를 확인한다.
5. 시작 전 또는 종료 전 알림 조건을 만들어 foreground 인앱 리마인드를 확인한다.
6. 앱을 background/home 상태로 보내 OS 알림이 notification shade에 뜨는지 확인한다.
7. notification shade에서 알림 dismiss를 확인한다.
8. 결과와 미실행 항목을 문서에 기록하고 plan을 completed로 이동한다.

## Automated tests

- 필요 시 `npm run typecheck`
- 필요 시 `bash scripts/validate-docs.sh`

이번 작업은 코드 변경이 없으면 전체 테스트보다 문서 검증과 실기기 런타임 QA를 우선한다.

## Manual/Runtime QA

- `adb`로 실기기 연결과 설치 앱 상태를 확인한다.
- 앱 첫 실행 또는 재실행에서 Today 화면이 뜨는지 확인한다.
- Android 알림 권한이 허용 상태인지 확인한다.
- foreground 상태에서 인앱 리마인드 표시를 확인한다.
- background/home 상태에서 OS 알림이 notification shade에 표시되는지 확인한다.
- notification shade 알림 dismiss 후 목록에서 제거되는지 확인한다.

## Skipped/Not Run

- Play Console 제출 경로는 릴리스 대기열 작업이므로 실행하지 않는다.
- iOS QA는 이번 Android 실기기 범위 밖이다.
- 새 EAS build는 기존 standalone 산출물로 검증 가능하면 실행하지 않는다.

## Open Work

- Android 실기기에서 Expo notification alarm은 예약/발화 흔적이 있었지만 active OS notification record와 notification shade 적재가 확인되지 않았다.
- 다음 작업은 `expo-local-reminder-provider`의 Android notification presentation 경로, channel/category 설정, foreground/background handler 차이, Samsung/Android 16 notification policy 영향을 분리하는 조사다.
- notification shade dismiss는 표시된 앱 알림이 없어 실행하지 못했다.
- 시간 설정 UI에서 하단 `취소`/`확인` 액션이 Android navigation bar에 가려지는 문제가 관찰됐다. 후속 UI 수정은 navigation bar가 있는 3-button 환경과 gesture/navigation bar가 사실상 없는 환경을 모두 검증해야 한다.

## Completion

- 완료일: 2026-05-14
- 작업 브랜치: `feature/android-real-device-notification-qa`
- QA 대상 기기: `R5CT31X2K2H`, `SM_S908N`, Android `16`
- QA 산출물: `/private/tmp/today-did-you-finish-preview-latest.apk`, 약 `82M`, `versionName=0.1.0`, `versionCode=1`, `targetSdk=36`
- `adb install -r /private/tmp/today-did-you-finish-preview-latest.apk`로 실기기 설치를 완료했다.
- 첫 실행에서 Android `POST_NOTIFICATIONS` 권한 프롬프트가 노출됐고 `허용` 후 `granted=true`를 확인했다.
- Today 화면, 원형 시간판, `새 계획 추가`, 편집 화면, 저장 흐름이 실기기에서 렌더링됐다.
- QA 일정 `QA-Notification`을 생성했고 저장 후 Today 목록에서 `09:32 - 09:45` 표시를 확인했다.
- foreground 상태에서 `리마인드: QA-Notification · 지금 완료 가능` 인앱 리마인드를 확인했다.
- 종료 시간을 `09:52`로 편집해 저장했고 Today 목록에서 `09:32 - 09:52` 표시를 확인했다.
- 앱을 홈으로 내려 background 상태를 만든 뒤 09:47 전후 background OS 알림을 대기했다.
- `dumpsys window` 기준 09:48:13에는 launcher가 focus 상태였고 앱 task는 `visible=false`라 background/home 조건은 충족했다.
- `dumpsys alarm`에는 `expo.modules.notifications.NOTIFICATION_EVENT`가 `origWhen=2026-05-14 09:46:59.130`으로 등록돼 있었고, 09:48 확인 시 과거 alarm 항목으로 남아 발화 시점 자체는 지나간 상태였다.
- 그러나 `dumpsys notification --noredact`에서는 `com.familyproject.todaydidyoufinish`의 active `NotificationRecord` 또는 `StatusBarNotification`을 확인하지 못했다.
- 앱 복귀 후에는 `리마인드: QA-Notification · 종료 전 확인`과 `계속 진행` 인앱 배너를 확인했다.
- 시간 설정 UI의 하단 `취소`/`확인` 액션이 기기 navigation bar와 겹쳐 보이는 문제를 관찰했다.

## Validation Result

- `git status --short --branch`: 통과. `feature/android-real-device-notification-qa`에서 시작했다.
- `/Users/hun/Library/Android/sdk/platform-tools/adb devices -l`: 통과. 실기기 `R5CT31X2K2H model:SM_S908N`만 연결된 상태를 확인했다.
- `/Users/hun/Library/Android/sdk/platform-tools/adb -s R5CT31X2K2H install -r /private/tmp/today-did-you-finish-preview-latest.apk`: 통과.
- `dumpsys package com.familyproject.todaydidyoufinish`: 통과. `versionName=0.1.0`, `versionCode=1`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true`.
- UI dump 기준 권한 프롬프트, Today 렌더링, 계획 생성/편집/저장, foreground 인앱 리마인드: 통과.
- Background/home 상태 OS 알림 active notification 확인: 실패. alarm 예약/발화 흔적은 있으나 active notification record와 shade 표시를 확인하지 못했다.
- Notification shade dismiss: 미실행. dismiss할 앱 OS 알림이 표시되지 않았다.
- `bash scripts/validate-docs.sh`: 통과.

## Status

Completed with finding. 실기기 설치, 권한, Today 렌더링, foreground 인앱 리마인드, end-recovery 인앱 배너는 확인됐지만 Android 실기기 background OS notification은 active notification으로 남지 않았다. 또한 시간 설정 하단 액션이 navigation bar에 가려지는 UI 이슈가 관찰됐다. 후속 작업은 Android notification presentation 경로 조사와 time picker safe area/inset 수정이다.
