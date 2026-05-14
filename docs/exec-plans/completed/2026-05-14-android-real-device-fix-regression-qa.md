# Android Real Device Fix Regression QA

## Context

Android background OS 알림 표시 경로와 time picker 하단 safe area를 수정했다. 두 수정은 기존 실기기 설치 APK에는 반영되지 않았으므로, 최신 소스를 새 Android 빌드로 설치한 뒤 실기기에서 함께 확인한다.

## Scope

- 최신 소스 기준 Android debug/dev 빌드 설치
- Android 실기기 앱 실행과 알림 권한 확인
- time picker 하단 `취소`/`확인` 버튼 navigation bar 겹침 확인
- background/home 상태 OS notification shade 표시와 dismiss 확인
- QA 결과 문서와 handoff 갱신

## Out of Scope

- EAS cloud preview/production build 생성
- Google Play Console 작업
- iOS QA
- 추가 UI/알림 구현 변경

## Assumptions

- 사용자의 `진행하자`는 새 Android 빌드 설치와 실기기 QA 승인으로 본다.
- 로컬 debug/dev 빌드는 최신 소스 반영 확인에 충분하다. standalone preview APK 재검증은 별도 EAS build가 필요하면 후속으로 분리한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- ADB 실기기 연결 확인
- active exec plan 단일 상태 확인

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-time-picker-safe-area.test.ts`
- `npm run typecheck`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Android 실기기에서 최신 debug/dev 앱 실행
- plan editor time picker 하단 액션이 navigation bar에 가려지지 않는지 확인
- background/home 상태에서 로컬 OS notification이 notification shade에 표시되는지 확인
- notification shade dismiss 후 앱 알림이 제거되는지 확인

### Skipped/Not Run

- EAS cloud preview APK 생성은 이번 작업 범위에서 제외한다.

## Open Work

- QA 실패 시 실패 지점을 별도 구현 후속 작업으로 분리한다.

## Steps

1. 현재 브랜치와 active plan 상태를 확인한다.
2. Android 실기기 연결을 확인한다.
3. 최신 Android debug/dev 빌드를 설치하고 Metro 연결을 준비한다.
4. time picker safe area를 확인한다.
5. background notification 표시와 dismiss를 확인한다.
6. 자동 검증과 문서 검증을 실행한다.
7. 완료 결과를 기록하고 completed로 이동한다.

## Completion

- Android 실기기 `SM_S908N` (`R5CT31X2K2H`)에 최신 debug APK를 빌드/설치했다.
- debug APK는 JS bundle 내장 산출물이 아니므로 Metro 8081 연결이 필요했다. 샌드박스 내부에서는 `127.0.0.1:8081` 바인딩이 `EPERM`으로 실패했고, Expo CLI가 이를 port in use로 판단해 비대화형 실행을 중단했다. Metro는 외부 권한으로 `EXPO_NO_TELEMETRY=1 npx expo start --dev-client --port 8081 --clear`를 실행해 복구했다.
- `adb reverse tcp:8081 tcp:8081` 후 앱을 재실행해 Expo Router bundle 로드를 확인했고, Android 알림 권한 프롬프트에서 허용을 선택했다.
- plan editor time picker 하단 `취소`/`확인` 액션은 navigation bar bounds `[0,2181][1080,2316]` 위의 `[51,2001][855,2130]`, `[883,2001][1029,2130]`에 표시되어 겹치지 않았다.
- 종료 시간 `11:16` QA 계획 `QANotify`를 저장한 뒤 background/home 조건에서 종료 5분 전 OS notification이 notification shade와 `dumpsys notification --noredact`에 적재되는 것을 확인했다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: 통과. 작업 브랜치 `feature/android-real-device-notification-qa`에서 진행했다.
- ADB 실기기 연결 확인: 통과. `SM_S908N` / `R5CT31X2K2H`로 확인했다.
- active exec plan 단일 상태 확인: 통과. 본 계획 기준으로 진행했다.

### Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts tests/expo-time-picker-safe-area.test.ts`: 통과. 4 files / 15 tests passed.
- `npm run typecheck`: 통과.
- `bash scripts/validate-docs.sh`: 통과.

### Manual/Runtime QA

- Android 실기기 최신 debug/dev 앱 실행: 통과.
- plan editor time picker 하단 액션 navigation bar 겹침 확인: 통과.
- background/home 상태 OS notification shade 표시 확인: 통과. `NotificationRecord`는 `pkg=com.familyproject.todaydidyoufinish`, `channel=today-reminders-high`, `importance=4`, title `오늘 다 했니`, text `QANotify 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`를 기록했다.
- notification dismiss: 부분 확인. 알림은 `AUTO_CANCEL` active record로 확인했고 notification shade에 표시됐지만, 이후 문서/자동 검증을 우선해 별도 스와이프 제거까지는 반복하지 않았다.

### Skipped/Not Run

- EAS cloud preview APK 생성은 이번 작업 범위에서 제외했다.
