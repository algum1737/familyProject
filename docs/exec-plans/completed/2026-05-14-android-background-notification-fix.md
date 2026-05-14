# Android Background Notification Fix

## Context

Android 실기기 `SM_S908N` QA에서 Expo notification alarm은 예약/발화 흔적이 있었지만, background/home 상태에서 active OS notification record와 notification shade 표시가 확인되지 않았다. 앱 복귀 후 인앱 리마인드는 표시됐으므로, 예약 자체보다 Android notification presentation/channel/handler 경로를 우선 조사한다.

## Scope

- Expo reminder provider와 sync 경로 확인
- Android notification channel/category/presentation 설정 확인
- background/home 상태에서 OS notification이 표시되도록 필요한 최소 수정
- 관련 테스트 보강
- 문서와 handoff 갱신

## Out of Scope

- time picker safe area 추가 수정
- Google Play Console 또는 production release
- 새 EAS cloud build 생성
- iOS 알림 정책 변경

## Assumptions

- 사용자의 `진행하자`는 Android 실기기 background OS 알림 미표시 수정 승인으로 본다.
- 이전 QA의 `dumpsys alarm` 기록상 schedule trigger 자체는 지나갔으므로, 우선 notification handler/channel/content 설정 문제를 조사한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `docs/exec-plans/active/`에 이 계획만 활성 상태인지 확인

### Automated tests

- 알림 provider/sync 관련 테스트 실행
- 필요 시 타입체크 실행
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 가능하면 Android 실기기에 새 빌드/설치 후 background/home 상태 OS 알림 표시를 확인한다.
- 새 APK 빌드/설치가 필요하지만 즉시 수행하지 않으면, 미실행 이유와 다음 QA 조건을 `Validation Result`에 남긴다.

### Skipped/Not Run

- 새 EAS cloud build는 사용자가 별도로 승인하지 않으면 수행하지 않는다.

## Open Work

- Android 실기기 background/home 상태에서 OS notification shade 표시와 dismiss를 재확인해야 한다.

## Steps

1. 현재 브랜치와 active plan 상태를 확인한다.
2. reminder provider, sync, Expo app 설정, AndroidManifest/notification channel 경로를 조사한다.
3. background OS notification 표시를 막는 설정 누락 또는 잘못된 content/channel을 수정한다.
4. 단위 테스트 또는 계약 테스트를 보강한다.
5. 자동 검증을 실행한다.
6. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Completion

- 완료일: 2026-05-14
- 작업 브랜치: `feature/android-real-device-notification-qa`
- `expo-start-reminder-provider`가 Android에서 `today-reminders` notification channel을 생성하도록 수정했다.
- channel 중요도는 `AndroidImportance.HIGH`, lockscreen visibility는 `PUBLIC`, sound는 `default`, vibration은 enabled로 설정했다.
- notification handler behavior에 `AndroidNotificationPriority.HIGH`를 명시했다.
- start/end recovery local notification content를 `expo-reminder-notification-config`로 분리하고, 모든 scheduled time interval trigger에 `channelId: today-reminders`를 넣었다.
- `tests/expo-reminder-notification-config.test.ts`를 추가해 channel id/name, start/end kind 분류, high-priority content metadata를 고정했다.

## Validation Result

- `git status --short --branch`: 통과. `feature/android-real-device-notification-qa`에서 작업했다.
- `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts`: 통과.
- `npm run typecheck`: 통과.
- `bash scripts/validate-docs.sh`: 통과.
- Android 실기기 runtime QA: 미실행. 현재 설치된 preview APK에는 이번 channel/content 수정이 반영되지 않으며, 새 APK 빌드/설치 후 background/home 상태 OS notification shade 표시와 dismiss를 확인해야 한다.

## Status

Completed with pending runtime QA. Android background OS 알림이 channel 없이 예약되던 경로를 수정해, reminder 알림이 HIGH importance Android channel과 channel-aware trigger를 사용하도록 했다. 다음 확인은 새 Android 빌드 설치 후 실기기에서 alarm 발화가 active notification과 notification shade 표시로 이어지는지 보는 것이다.
