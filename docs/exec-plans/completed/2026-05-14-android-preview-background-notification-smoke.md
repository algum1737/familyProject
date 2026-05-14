# Android Preview Background Notification Smoke

## Context

최신 `main`에는 Android notification channel 수정과 reminder sync 직렬화가 머지됐다. 하지만 기존 Android preview standalone QA는 `2026-05-13` preview APK 기준이어서 background/home 상태 OS 알림 전달 smoke를 완료하지 못했다. 이번 작업은 최신 `main` 기준 preview standalone APK를 새로 설치해 Metro 없이 background OS notification 표시를 확인한다.

## Scope

- 최신 `main` 기준 Android preview APK 생성 또는 최신 preview artifact 확보
- Android 실기기 `SM_S908N`에 preview standalone APK 설치
- Metro reverse 연결 없이 앱 실행 확인
- background/home 상태 OS notification shade 표시 확인
- 가능한 경우 notification shade dismiss 확인
- QA 결과 문서와 handoff 갱신

## Out of Scope

- Google Play Console 작업
- production `.aab` 생성/제출
- iOS QA
- 추가 알림/UI 구현 변경

## Assumptions

- 사용자의 `진행하자`는 최신 preview standalone 알림 smoke QA 진행 승인으로 본다.
- 현재 연결된 Android 실기기 `SM_S908N`을 우선 QA 대상으로 사용한다.
- EAS preview build가 외부 서비스나 네트워크 문제로 실패하면 artifact 설치 QA는 미실행으로 기록하고 실패 지점을 남긴다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `git log --oneline -8`
- ADB 실기기 연결 확인
- EAS 로그인 상태 확인

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts`
- `npm run typecheck`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Android 실기기 preview standalone APK 설치
- `adb reverse --list`가 비어 있는 상태에서 앱 실행
- 알림 권한 상태 확인
- 미래 QA 일정 생성 후 앱을 background/home 상태로 내려 OS notification shade 표시 확인
- 가능한 경우 notification shade dismiss 후 active notification 제거 확인

### Skipped/Not Run

- EAS build 또는 artifact 다운로드가 실패하면 설치/런타임 QA는 미실행으로 기록한다.
- 알림 heads-up 순간 배너 캡처는 화면 녹화 없이 안정적이지 않으므로 notification shade와 `dumpsys notification` 중심으로 판단한다.

## Steps

1. 현재 브랜치와 기기 연결 상태를 확인한다.
2. EAS 로그인 상태와 preview build 가능 여부를 확인한다.
3. 최신 Android preview APK를 생성하거나 artifact를 확보한다.
4. 실기기에 preview APK를 설치하고 Metro 없이 실행한다.
5. background/home 상태 OS notification 표시와 dismiss를 확인한다.
6. 자동 검증과 문서 검증을 실행한다.
7. 결과를 기록하고 completed로 이동한다.

## Open Work

- QA 실패 시 원인과 후속 구현 작업을 분리한다.

## Completion

- 작업 브랜치: `qa/android-preview-background-notification-smoke`
- EAS 계정은 `algumhun / algum1737@gmail.com`으로 확인했다.
- 최신 `main` 커밋 `20bb4de` 기준 Android preview build를 새로 생성했다.
- EAS build id는 `1476fcb4-843c-42df-adc5-6d8adb897921`이고 상태는 `FINISHED`다.
- APK artifact는 `https://expo.dev/artifacts/eas/3wz6C5JC8AkpkmyucDDTZk.apk`이며 `/private/tmp/today-did-you-finish-preview-2026-05-14.apk`로 내려받았다.
- Android 실기기 `SM_S908N` (`R5CT31X2K2H`)에 preview APK를 설치했다.
- 기존 설치본과 preview APK의 서명이 달라 `adb uninstall com.familyproject.todaydidyoufinish` 후 설치했다. 이 과정에서 해당 실기기 앱 데이터와 권한 상태는 초기화됐다.
- 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `firstInstallTime=2026-05-14 16:17:45`였다.
- `adb reverse --list`가 비어 있는 상태에서 `com.familyproject.todaydidyoufinish/.MainActivity`를 실행했고, Today 화면 렌더링과 알림 권한 프롬프트를 확인했다.
- 알림 권한 프롬프트에서 `허용`을 선택했고, app op는 `Default mode: allow`로 확인했다.
- QA 일정 `QAPreview`를 `16:19 - 16:30`으로 저장했고, `dumpsys alarm`에서 `expo.modules.notifications.NOTIFICATION_EVENT` 예약을 확인했다.
- 앱을 Home으로 내려 background/home 조건을 만들었다. `dumpsys window` 기준 launcher가 focus였고 앱 task는 `visible=false`였다.
- `2026-05-14 16:25`에 notification shade에서 `오늘 다 했니`, 본문 `QAPreview 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.` 알림을 확인했다.
- `dumpsys notification --noredact`의 active record는 `pkg=com.familyproject.todaydidyoufinish`, `channel=today-reminders-high`, `importance=4`, `flags=AUTO_CANCEL`, title `오늘 다 했니`, text `QAPreview 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`였다.
- notification shade에서 해당 알림을 스와이프 dismiss했고, 이후 shade 목록에서 앱 알림이 제거된 것을 확인했다. `dumpsys notification`에는 active list가 아니라 archive/channel 기록만 남았다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: 통과. 작업 브랜치 `qa/android-preview-background-notification-smoke`에서 진행했다.
- `git log --oneline -8`: 통과. 기준 커밋 `20bb4de`를 확인했다.
- ADB 실기기 연결 확인: 통과. `SM_S908N` / `R5CT31X2K2H`로 확인했다.
- EAS 로그인 상태 확인: 통과. `algumhun / algum1737@gmail.com`.

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts`: 통과. 3 files / 12 tests.
- `npm run typecheck`: 통과.
- `bash scripts/validate-docs.sh`: 통과.

### Manual/Runtime QA

- Android 실기기 preview standalone APK 설치: 통과.
- `adb reverse --list`가 비어 있는 상태에서 앱 실행: 통과.
- 알림 권한 상태 확인: 통과.
- background/home 상태 OS notification shade 표시 확인: 통과.
- notification shade dismiss 후 active notification 제거 확인: 통과.

### Skipped/Not Run

- heads-up 순간 배너 화면 녹화는 미실행. notification shade와 `dumpsys notification`을 증거로 판단했다.
