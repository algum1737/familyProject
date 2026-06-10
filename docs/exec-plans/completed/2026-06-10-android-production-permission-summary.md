# Android Production Permission Summary

## Goal

Play Console 제출 직전 확인 항목 중 Android production/release 권한 목록을 로컬 production-like 산출물 기준으로 재검증하고, 실제 Play Console/EAS production 단계에서 남은 blocker를 분리한다.

## Scope

- 현재 `main` 기준 Android release merged/packaged manifest 권한 목록 확인
- 로컬 `:app:bundleRelease` 산출물 생성 가능 여부 확인
- release 권한 목록에서 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `USE_EXACT_ALARM`이 빠지고 `SCHEDULE_EXACT_ALARM`이 유지되는지 확인
- Play Console 제출 직전 권한 summary와 production AAB에서 다시 확인해야 할 항목 문서화
- `APP_EXPO_RELEASE_CHECKLIST`, `APP_PLAY_CONSOLE_SUBMISSION_PREP`, `HANDOFF`, `docs/index.md` 갱신

## Out Of Scope

- Play Console 실제 접속/입력
- EAS production remote build 실행
- Play Console internal testing track 업로드
- 실기기 Android notification QA
- manifest 권한 구현 변경

## Assumptions

- 사용자의 `업무 진행하자`는 이전 보고의 다음 우선 업무인 “Play Console 제출 직전 권한 최종 확인” 진행 승인으로 본다.
- 현재 Play Developer 계정과 app record는 아직 준비되지 않았으므로 Play Console permission summary는 직접 확인할 수 없다.
- 로컬 `:app:bundleRelease`는 debug signingConfig를 쓰는 prebuild 기본값이라 Play 제출물은 아니지만, release manifest merge와 packaging 권한 확인에는 유효한 사전 검증으로 본다.
- 실제 제출용 권한 summary는 EAS production AAB 또는 Play Console 업로드 화면에서 다시 확인해야 한다.

## Pre-flight Checks

- `git status --short --branch`
- active plan 존재 확인
- `docs/HANDOFF.md`, `docs/APP_EXPO_RELEASE_CHECKLIST.md`, `docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md`의 release 권한 기준 확인
- `rg -n "SYSTEM_ALERT_WINDOW|READ_EXTERNAL_STORAGE|WRITE_EXTERNAL_STORAGE|SCHEDULE_EXACT_ALARM|USE_EXACT_ALARM" apps/expo/android/app/src tests`

## Steps

1. QA 브랜치와 active exec plan을 만든다.
2. Android app config와 release manifest override 상태를 확인한다.
3. 기존 권한 회귀 테스트와 타입/문서 검증을 실행한다.
4. `:app:processReleaseManifestForPackage`와 `:app:bundleRelease`를 실행한다.
5. merged/packaged release manifest 권한 목록을 확인한다.
6. 결과와 남은 외부 blocker를 관련 문서와 handoff에 기록한다.
7. 완료되면 plan을 completed로 이동하고 인덱스를 갱신한다.

## Automated Tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- `bash scripts/validate-docs.sh`
- `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`
- `cd apps/expo/android && ./gradlew :app:bundleRelease`

## Manual/Runtime QA

- release merged/packaged manifest에서 아래를 확인한다.
  - `android.permission.SCHEDULE_EXACT_ALARM` 있음
  - `android.permission.USE_EXACT_ALARM` 없음
  - `android.permission.SYSTEM_ALERT_WINDOW` 없음
  - `android.permission.READ_EXTERNAL_STORAGE` 없음
  - `android.permission.WRITE_EXTERNAL_STORAGE` 없음
- 로컬 release bundle 산출물 경로와 산출물 존재 여부를 확인한다.

## Skipped/Not Run

- Play Console permission summary 직접 확인: Play Developer 계정/app record/upload 준비가 아직 없어 실행하지 않는다.
- EAS production AAB build: remote credential/store 제출 작업 범위이므로 이번 로컬 QA에서는 실행하지 않는다.
- 실기기 Android smoke/notification QA: manifest/provider/native exact alarm 동작 변경이 없는 권한 summary QA라 이번 범위에서는 실행하지 않는다.

## Open Work

- 없음.

## Completion

- 완료.
- `apps/expo/android/app/src/main/AndroidManifest.xml`과 `apps/expo/android/app/src/release/AndroidManifest.xml` 기준으로 release 권한 제거 override 상태를 확인했다.
- `:app:processReleaseManifestForPackage`와 `:app:bundleRelease`가 통과해 로컬 release bundle 사전 검증 산출물 `apps/expo/android/app/build/outputs/bundle/release/app-release.aab`를 생성했다.
- 로컬 AAB는 약 56 MB이며 현재 native release build type이 debug signingConfig를 사용하므로 Play 제출물은 아니다.
- release `bundle_manifest`, `merged_manifests`, `packaged_manifests`, AAB 내부 base manifest 문자열 확인 기준으로 제거 대상 권한이 남지 않는 것을 확인했다.
- `APP_EXPO_RELEASE_CHECKLIST.md`, `APP_PLAY_CONSOLE_SUBMISSION_PREP.md`, `HANDOFF.md`에 이번 권한 summary preflight 결과와 남은 외부 blocker를 기록했다.

## Validation Result

### Pre-flight Checks

- PASS: `git status --short --branch`로 `qa/android-production-permission-summary` 브랜치를 확인했다.
- PASS: active plan을 `docs/exec-plans/active/2026-06-10-android-production-permission-summary.md`에 만들었다.
- PASS: 관련 release/Play Console 문서를 확인했다.
- PASS: `rg -n "SYSTEM_ALERT_WINDOW|READ_EXTERNAL_STORAGE|WRITE_EXTERNAL_STORAGE|SCHEDULE_EXACT_ALARM|USE_EXACT_ALARM" apps/expo/android/app/src tests/expo-reminder-notification-config.test.ts`

### Automated Tests

- PASS: `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `bash scripts/validate-docs.sh`
- PASS: `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`
- PASS: `cd apps/expo/android && ./gradlew :app:bundleRelease`

### Manual/Runtime QA

- PASS: `apps/expo/android/app/build/intermediates/merged_manifest/release/processReleaseMainManifest/AndroidManifest.xml`, `apps/expo/android/app/build/intermediates/merged_manifests/release/processReleaseManifest/AndroidManifest.xml`, `apps/expo/android/app/build/intermediates/packaged_manifests/release/processReleaseManifestForPackage/AndroidManifest.xml`, `apps/expo/android/app/build/intermediates/bundle_manifest/release/processApplicationManifestReleaseForBundle/AndroidManifest.xml` 모두 `SCHEDULE_EXACT_ALARM`만 대상 권한으로 포함한다.
- PASS: AAB 내부 `base/manifest/AndroidManifest.xml` 문자열 확인에서도 `SCHEDULE_EXACT_ALARM`만 대상 권한으로 확인됐다.
- PASS: `apps/expo/android/app/build/outputs/bundle/release/app-release.aab` 생성 확인. 파일 크기는 `58,410,530` bytes다.
- PASS: 전체 release permission summary에는 `INTERNET`, `SCHEDULE_EXACT_ALARM`, `VIBRATE`, `ACCESS_NETWORK_STATE`, `RECEIVE_BOOT_COMPLETED`, `POST_NOTIFICATIONS`, `WAKE_LOCK`, FCM receive, dynamic receiver, install referrer, launcher badge 계열 권한이 남는다.

### Skipped/Not Run

- NOT RUN: Play Console permission summary 직접 확인은 Play Developer 계정/app record/upload 준비가 아직 없어 실행하지 않았다.
- NOT RUN: EAS production AAB build는 remote credential/store 제출 작업 범위이므로 이번 로컬 QA에서 실행하지 않았다.
- NOT RUN: 실기기 Android smoke/notification QA는 manifest/provider/native exact alarm 동작 변경이 없는 권한 summary QA라 실행하지 않았다.
