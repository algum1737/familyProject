# Android Start Notification Precision

## Context

Android 실기기 `SM_S908N` / `R5CT31X2K2H`에서 시작 5분 전 알림은 notification shade에 올바른 문구로 표시되는 것을 확인했다. 다만 QA 일정 `QAShade 14:30 - 14:58`의 start-5 목표 시각은 `2026-05-20 14:25:00 KST`였고, 실제 발화는 `2026-05-20 14:33:06.197 KST`로 약 8분 6초 늦었다.

이번 작업은 “알림이 eventually 도착한다”가 아니라 사용자가 기대하는 “시작 5분 전”에 최대한 가깝게 도착하도록 Android 예약 경로와 OS 제약을 확인하고 개선 방향을 고정한다.

## Scope

- Android exact alarm 권한과 현재 manifest/provider 설정 확인
- Expo notifications `DATE` trigger가 Android native AlarmManager에 매핑되는 방식 확인
- Samsung background freeze/Doze 조건에서 지연되는 경로 확인
- `SCHEDULE_EXACT_ALARM` 또는 `USE_EXACT_ALARM` 적용 가능성 검토
- exact alarm 권한이 필요한 경우 사용자 설정/권한 요청 UX와 Play policy 영향 정리
- 코드 변경이 필요하면 provider/manifest/test를 함께 수정
- 실기기에서 10~15분 뒤 시작 일정으로 start-5 알림 발화 시각 재측정

## Out of Scope

- Play Console 실제 제출
- iOS 알림 정확도 개선
- 서버 push notification 도입
- 장기 백그라운드 서비스 설계

## Assumptions

- Android는 배터리/Doze 정책 때문에 모든 기기에서 초 단위 정확도를 보장하지 않을 수 있다.
- 제품 목표는 “가능한 한 정확한 시작 5분 전 알림”이며, OS 정책상 불가한 경우 그 한계와 사용자 안내를 문서화한다.
- Samsung 실기기에서 반복 재현되는 6~8분 지연은 별도 개선/정책 판단이 필요한 제품 리스크로 본다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `adb devices -l`
- `adb shell dumpsys package com.familyproject.todaydidyoufinish`
- `adb shell dumpsys alarm`
- `adb shell dumpsys deviceidle`
- `adb shell dumpsys notification --noredact`

### Automated tests

- `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 최신 standalone APK 빌드/설치
- Metro reverse 없는 standalone 상태 확인
- 현재 시각 기준 10~15분 뒤 시작하는 QA 일정 생성
- 앱 Home/background 상태에서 start-5 목표 시각과 실제 발화 시각 기록
- notification shade 문구와 발화 시각 증거 캡처
- QA 일정과 알림 정리

### Success Criteria

- start-5 목표 대비 실제 발화 지연이 기존 약 6~8분보다 의미 있게 줄었는지 기록한다.
- exact alarm 적용이 불가능하거나 정책상 부적절하면 그 이유와 제품 대안을 문서화한다.
- 사용자가 기대하는 “시작 5분 전” 표현을 유지할 수 있는지, 또는 문구/설정 안내 조정이 필요한지 판단한다.

### Skipped/Not Run

- 실제 기기 시간을 강제로 변경하지 않는다.
- iOS는 이번 범위에서 제외한다.

## Open Work

- 실기기 USB 디버깅 authorization 복구
- 실기기 timing QA 재실행

## Progress Log

- `fix/android-start-notification-precision` 브랜치를 만들었다.
- Expo notifications Android native 구현을 확인했다. `canScheduleExactAlarms()`가 true면 `setExactAndAllowWhileIdle`, false면 `setAndAllowWhileIdle`로 fallback한다.
- Android 공식 문서 기준 `SCHEDULE_EXACT_ALARM`은 Android 13+ target fresh install에서 기본 거부될 수 있고, 앱은 `canScheduleExactAlarms()`로 상태를 확인해야 한다.
- Play 정책 리스크 때문에 `USE_EXACT_ALARM`은 선언하지 않고, 사용자 승인형 `SCHEDULE_EXACT_ALARM`만 사용하기로 결정했다.
- Android manifest에 `android.permission.SCHEDULE_EXACT_ALARM`을 추가했다.
- React Native native module `ExactAlarmModule`을 추가해 Android exact alarm 접근 상태 확인과 `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` 설정 화면 이동을 제공했다.
- Today 설정 메뉴에 exact alarm 상태 항목을 추가했다. 접근이 없으면 `정확 알림 켜기`, 접근이 있으면 `정확 알림 켜짐`으로 표시한다.
- `APP_LOCAL_REMINDER_PLAN`, `APP_EXPO_RELEASE_CHECKLIST`, `APP_PLAY_CONSOLE_SUBMISSION_PREP`, privacy policy에 exact alarm 목적과 정책 판단을 반영했다.

## Validation Result

### Automated tests

- PASS: `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `bash scripts/validate-docs.sh`
- PASS: `./gradlew assembleRelease`
- PASS: release merged/packaged manifests contain `android.permission.SCHEDULE_EXACT_ALARM` and do not contain `android.permission.USE_EXACT_ALARM`.

### Manual/Runtime QA

- BLOCKED: `adb kill-server` / `adb start-server` 후에도 `adb devices -l` currently reports `R5CT31X2K2H unauthorized`. 실기기에서 USB 디버깅 허용이 필요하다.
