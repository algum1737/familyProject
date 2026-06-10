# Android Release Manifest Permissions

## Goal

Android production/release 제출 전에 현재 제품 기능과 맞지 않는 manifest 권한인 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`가 최종 release merged manifest에 남지 않도록 원천을 확인하고 제거 또는 차단한다.

## Scope

- Android native/prebuild manifest와 config에서 제거 후보 권한 원천 확인
- release merged manifest 기준으로 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` 제거 또는 `tools:node="remove"` 차단
- 기존 유지 권한인 `INTERNET`, `VIBRATE`, `SCHEDULE_EXACT_ALARM`과 금지 권한인 `USE_EXACT_ALARM` 계약 유지
- 권한 회귀 방지 테스트와 release manifest 검증 보강
- 관련 release checklist, Play Console 준비 문서, handoff 갱신

## Out Of Scope

- Play Console 실제 접속/입력
- EAS production AAB 원격 빌드/업로드
- Android exact alarm UX 또는 알림 provider 동작 변경
- 새 기능 추가

## Assumptions

- 사용자의 `업무 진행하자`는 이전 답변에서 안내한 “작업 브랜치 생성 후 진행” 승인으로 본다.
- 현재 제품에는 다른 앱 위 overlay 기능이 없다.
- 현재 제품에는 사진/미디어/공유 저장소 읽기/쓰기 기능이 없다.
- 로컬 계획/회고 저장은 앱 내부 저장소 기준이며 legacy external storage permission이 필요하지 않다.
- `SCHEDULE_EXACT_ALARM`은 시작/종료 전 로컬 알림 정확도 목적이 있으므로 유지한다.
- `USE_EXACT_ALARM`은 계속 선언하지 않는다.

## Pre-flight checks

- `git status --short --branch`
- active plan 존재 확인
- `rg -n "SYSTEM_ALERT_WINDOW|READ_EXTERNAL_STORAGE|WRITE_EXTERNAL_STORAGE|SCHEDULE_EXACT_ALARM|USE_EXACT_ALARM" apps/expo`
- Android manifest/config 원천 확인
- release merged manifest 생성 가능 여부 확인

## Steps

1. 별도 작업 브랜치에서 active exec plan을 만든다.
2. Android manifest와 Expo config에서 권한 원천을 조사한다.
3. release merged manifest에 제거 후보 권한이 남는지 확인한다.
4. 필요한 경우 native manifest에서 제거 후보 권한을 `tools:node="remove"`로 차단한다.
5. 권한 회귀 방지 테스트를 업데이트한다.
6. release checklist, Play Console 준비 문서, handoff를 갱신한다.
7. 자동 검증과 release manifest 확인 결과를 기록한다.

## Automated tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- `bash scripts/validate-docs.sh`
- `cd apps/expo/android && ./gradlew :app:processReleaseMainManifest`
- `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`

## Manual/Runtime QA

- release merged manifest 파일에서 아래를 확인한다.
  - `android.permission.SYSTEM_ALERT_WINDOW` 없음
  - `android.permission.READ_EXTERNAL_STORAGE` 없음
  - `android.permission.WRITE_EXTERNAL_STORAGE` 없음
  - `android.permission.SCHEDULE_EXACT_ALARM` 있음
  - `android.permission.USE_EXACT_ALARM` 없음

## Skipped/Not Run

- Play Console 실제 입력: 계정/스토어 제출 작업 범위가 아니다.
- EAS production AAB build/submit: 이번 범위는 로컬 release manifest 검증이다.
- 실기기 Android smoke/notification QA: manifest 권한 제거와 테스트 보강 후 필요성이 남으면 후속 QA로 분리한다. 알림 provider/native exact alarm wiring을 변경하지 않는다면 이번 범위에서는 실행하지 않는다.

## Open Work

- 없음.

## Completion

- 완료.
- `apps/expo/android/app/src/main/AndroidManifest.xml`에서 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` 선언을 제거했다.
- `apps/expo/android/app/src/release/AndroidManifest.xml`을 추가해 release 변형에서 세 권한을 `tools:node="remove"`로 차단한다.
- `READ_EXTERNAL_STORAGE`는 `expo-image`, `WRITE_EXTERNAL_STORAGE`는 `expo-file-system` library manifest에서 재유입되는 것을 manifest merger blame report로 확인했다.
- `SYSTEM_ALERT_WINDOW`는 debug/debugOptimized manifest에는 개발용으로 남지만 release merged manifest에는 남지 않는다.
- `tests/expo-reminder-notification-config.test.ts`에 release 권한 제거 override 계약을 추가했다.
- `APP_PLAY_CONSOLE_SUBMISSION_PREP.md`, `APP_EXPO_RELEASE_CHECKLIST.md`를 release override 적용 상태에 맞게 갱신했다.

## Validation Result

### Pre-flight checks

- PASS: `git status --short --branch`로 `fix/android-release-manifest-permissions` 작업 브랜치를 확인했다.
- PASS: active plan을 `docs/exec-plans/active/2026-06-04-android-release-manifest-permissions.md`에 만들었다.
- PASS: `rg -n "SYSTEM_ALERT_WINDOW|READ_EXTERNAL_STORAGE|WRITE_EXTERNAL_STORAGE|SCHEDULE_EXACT_ALARM|USE_EXACT_ALARM" apps/expo tests docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md docs/APP_EXPO_RELEASE_CHECKLIST.md`로 권한 원천과 문서 상태를 확인했다.

### Automated tests

- PASS: `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `bash scripts/validate-docs.sh`
- PASS: `cd apps/expo/android && ./gradlew :app:processReleaseMainManifest`
- PASS: `cd apps/expo/android && ./gradlew :app:processReleaseManifest`
- PASS: `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`

### Manual/Runtime QA

- PASS: `apps/expo/android/app/build/intermediates/merged_manifest/release/processReleaseMainManifest/AndroidManifest.xml`에는 `SCHEDULE_EXACT_ALARM`만 남고 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `USE_EXACT_ALARM`은 없다.
- PASS: `apps/expo/android/app/build/intermediates/merged_manifests/release/processReleaseManifest/AndroidManifest.xml`에는 `SCHEDULE_EXACT_ALARM`만 남고 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `USE_EXACT_ALARM`은 없다.
- PASS: `apps/expo/android/app/build/intermediates/packaged_manifests/release/processReleaseManifestForPackage/AndroidManifest.xml`에는 `SCHEDULE_EXACT_ALARM`만 남고 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `USE_EXACT_ALARM`은 없다.

### Skipped/Not Run

- NOT RUN: Play Console 실제 입력은 계정/스토어 제출 작업 범위가 아니므로 실행하지 않았다.
- NOT RUN: EAS production AAB build/submit은 이번 범위가 로컬 release manifest 검증이므로 실행하지 않았다.
- NOT RUN: 실기기 Android smoke/notification QA는 알림 provider/native exact alarm wiring을 변경하지 않았고 manifest 권한 제거 범위라 실행하지 않았다. Play Console 제출 직전 permission summary와 함께 재확인한다.
