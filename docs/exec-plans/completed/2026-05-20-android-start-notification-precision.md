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

- 없음. PR/merge 대기.

## Progress Log

- `fix/android-start-notification-precision` 브랜치를 만들었다.
- Expo notifications Android native 구현을 확인했다. `canScheduleExactAlarms()`가 true면 `setExactAndAllowWhileIdle`, false면 `setAndAllowWhileIdle`로 fallback한다.
- Android 공식 문서 기준 `SCHEDULE_EXACT_ALARM`은 Android 13+ target fresh install에서 기본 거부될 수 있고, 앱은 `canScheduleExactAlarms()`로 상태를 확인해야 한다.
- Play 정책 리스크 때문에 `USE_EXACT_ALARM`은 선언하지 않고, 사용자 승인형 `SCHEDULE_EXACT_ALARM`만 사용하기로 결정했다.
- Android manifest에 `android.permission.SCHEDULE_EXACT_ALARM`을 추가했다.
- React Native native module `ExactAlarmModule`을 추가해 Android exact alarm 접근 상태 확인과 `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` 설정 화면 이동을 제공했다.
- Today 설정 메뉴에 exact alarm 상태 항목을 추가했다. 접근이 없으면 `정확 알림 켜기`, 접근이 있으면 `정확 알림 켜짐`으로 표시한다.
- `APP_LOCAL_REMINDER_PLAN`, `APP_EXPO_RELEASE_CHECKLIST`, `APP_PLAY_CONSOLE_SUBMISSION_PREP`, privacy policy에 exact alarm 목적과 정책 판단을 반영했다.
- 실기기 USB 디버깅 authorization을 복구한 뒤 최신 release APK를 standalone으로 재설치했다. `adb reverse --list`는 비어 있어 Metro 없는 상태였다.
- `SM_S908N` / `R5CT31X2K2H`에서 `SCHEDULE_EXACT_ALARM` permission 선언, `POST_NOTIFICATIONS granted=true`, 3-button navigation bar overlay를 확인했다.
- Today 설정 메뉴에서 exact alarm 접근 전 `정확 알림 켜기`, 설정 화면에서 허용 후 `정확 알림 켜짐` 상태를 확인했다.
- QA 일정 `QAExact 11:25 - 11:59`를 저장하고 앱을 Home/background로 내린 뒤 start-5 목표 `2026-06-02 11:20:00 KST`를 관찰했다.
- `dumpsys alarm`에서 `expo.modules.notifications.NOTIFICATION_EVENT`가 `origWhen=2026-06-02 11:20:00.000`, `window=0`, `exactAllowReason=permission`으로 예약된 것을 확인했다.
- notification shade와 `dumpsys notification --noredact`에서 `오늘 다 했니`, `QAExact 시작 5분 전입니다.`, `when=2026-06-02 11:20:00.106 KST`를 확인했다.
- 3-button navigation bar가 있는 상태에서 계획 편집 하단 버튼과 time picker 하단 `취소`/`확인` 버튼이 navigation bar 위에 표시되는 것도 함께 확인했다.
- QA 일정은 앱 UI의 `삭제` 액션으로 제거했고, 삭제 후 UI에서 `QAExact`가 사라졌다. `dumpsys alarm` pending 목록에는 앱 패키지가 남지 않았고, 이전 `11:54` end reminder 항목은 AlarmManager history에만 남아 있는 것으로 확인했다.

## Validation Result

### Automated tests

- PASS: `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `bash scripts/validate-docs.sh`
- PASS: `./gradlew assembleRelease`
- PASS: release merged/packaged manifests contain `android.permission.SCHEDULE_EXACT_ALARM` and do not contain `android.permission.USE_EXACT_ALARM`.

### Manual/Runtime QA

- PASS: `SM_S908N` / `R5CT31X2K2H`에서 최신 release APK를 standalone으로 설치했다. `adb reverse --list`는 비어 있어 Metro 연결이 없었다.
- PASS: 설치 앱은 `com.familyproject.todaydidyoufinish`, `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true` 상태였다.
- PASS: package requested permission에 `android.permission.SCHEDULE_EXACT_ALARM`이 포함됐고 `android.permission.USE_EXACT_ALARM`은 포함되지 않았다.
- PASS: exact alarm 접근 전 Today 설정 메뉴는 `정확 알림 켜기`를 표시했고, Android `알람 및 리마인더` 설정에서 허용한 뒤 `정확 알림 켜짐`으로 바뀌었다.
- PASS: QA 일정 `QAExact 11:25 - 11:59`의 start-5 target은 `2026-06-02 11:20:00.000 KST`였고, 예약 레코드는 `window=0`, `exactAllowReason=permission`이었다.
- PASS: active notification은 `when=2026-06-02 11:20:00.106 KST`로 기록됐다. 목표 대비 관찰 지연은 약 `0.106s`로, 기존 `QAShade`의 약 8분 6초 지연보다 의미 있게 줄었다.
- PASS: notification shade에는 title `오늘 다 했니`, body `QAExact 시작 5분 전입니다.`, time `오전 11:20`이 표시됐다. 증거 파일은 `/private/tmp/qaexact-shade.png`, `/private/tmp/qaexact-shade.xml`이다.
- PASS: 3-button navigation bar 환경에서 plan editor 하단 `취소` `[102,1927][805,2056]`, `저장` `[833,1927][980,2056]`, navigation bar `[0,2181][1080,2316]`로 버튼이 가려지지 않았다.
- PASS: time picker 하단 `취소` `[51,2001][855,2130]`, `확인` `[883,2001][1029,2130]`, navigation bar `[0,2181][1080,2316]`로 버튼이 가려지지 않았다.
- PASS: QA 일정은 삭제했고 UI에서 `QAExact`가 사라졌다. 삭제 후 pending alarm 목록에는 앱 패키지가 남지 않았다.
