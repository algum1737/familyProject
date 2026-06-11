# Android Production Permission Summary Refresh

## Goal

PR #21 머지 후 최신 `main` 기준 Android release 권한 목록을 다시 확인하고, EAS production AAB 또는 Play Console permission summary 확인 가능 여부를 분리한다.

## Scope

- 최신 `main` 기준 Android/Expo release 권한 관련 설정 확인
- EAS/Play Console 접근 가능성 확인
- 가능한 경우 production AAB/permission summary 경로 확인
- 접근 조건이 막히면 로컬 release AAB 기준 권한 summary 재검증
- 관련 release 문서, handoff, docs index 갱신

## Out Of Scope

- Play Console app record 생성
- Play Console 실제 store listing/data safety 입력
- Google Play internal testing track 업로드
- 사용자 계정/결제/개발자 신원 인증 대행
- manifest 권한 구현 변경
- Android 알림 실기기 timing QA

## Assumptions

- 사용자의 `진행하자`는 PR #21 merge 이후 문서상 다음 우선 작업인 Android production/release 권한 summary 재확인 진행 승인으로 본다.
- 기존 문서 기준 Play Developer 계정과 app record는 아직 준비되지 않았을 수 있다.
- EAS CLI 로그인/credential 상태는 현재 로컬 환경에서 직접 확인하기 전까지 알 수 없다.
- EAS production build 또는 Play Console permission summary가 외부 계정/자격증명 때문에 막히면, 그 사유를 `Skipped/Not Run`에 기록하고 로컬 release AAB preflight로 대체한다.

## Pre-flight Checks

- `git status --short --branch`
- active plan 존재 확인
- `docs/HANDOFF.md`, `docs/APP_EXPO_RELEASE_CHECKLIST.md`, `docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md` 확인
- `apps/expo/app.json`, `apps/expo/eas.json`, `apps/expo/android/app/src/release/AndroidManifest.xml` 확인

## Steps

1. EAS CLI 로그인/credential/build list 접근 가능 여부를 확인한다.
2. Play Console 직접 확인 가능성이 문서/환경상 있는지 확인한다.
3. Android release manifest override와 권한 guard 테스트를 실행한다.
4. 로컬 release manifest packaging과 AAB bundle을 생성한다.
5. merged/packaged/bundle manifest 및 AAB 내부 권한 문자열을 확인한다.
6. 결과와 외부 blocker를 release 문서와 handoff에 기록한다.
7. plan을 completed로 이동하고 docs index를 갱신한다.

## Automated Tests

- `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- `bash scripts/validate-docs.sh`
- `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`
- `cd apps/expo/android && ./gradlew :app:bundleRelease`

## Manual/Runtime QA

- EAS/Play Console 접근성 확인 결과를 기록한다.
- release merged/packaged/bundle manifest에서 아래를 확인한다.
  - `android.permission.SCHEDULE_EXACT_ALARM` 있음
  - `android.permission.USE_EXACT_ALARM` 없음
  - `android.permission.SYSTEM_ALERT_WINDOW` 없음
  - `android.permission.READ_EXTERNAL_STORAGE` 없음
  - `android.permission.WRITE_EXTERNAL_STORAGE` 없음
- AAB 내부 manifest 문자열 기준 동일 권한 목록을 확인한다.

## Skipped/Not Run

- Play Console permission summary 직접 확인은 Play Developer 계정/app record/upload 접근이 없으면 실행하지 않는다.
- EAS production AAB build는 로그인/credential/build 승인 또는 외부 계정 조건이 막히면 실행하지 않는다.
- 실기기 Android notification QA는 manifest/provider/native exact alarm 동작 변경이 없으면 실행하지 않는다.

## Open Work

- Play Console app record 생성, first upload, Play Console permission summary 직접 확인은 아직 남아 있다.

## Completion

- EAS CLI 로그인은 `algumhun / algum1737@gmail.com`으로 확인했다.
- 최신 Android build 목록에서 새 production build 전에는 Android `production` AAB 기록이 없고, 기존 최근 빌드는 `preview` APK 중심임을 확인했다.
- EAS Android production build를 실행했고 `c3ecce28-bf7a-434e-9d9c-47729696a13e`가 `FINISHED`로 완료됐다.
- build detail:
  - project: `@algumhun/today-did-you-finish`
  - platform: `ANDROID`
  - profile: `production`
  - distribution: `STORE`
  - artifact: `.aab`
  - appVersion: `0.1.0`
  - appBuildVersion/versionCode: `2`
  - completedAt: `2026-06-11T00:52:59.061Z`
  - artifact URL: `https://expo.dev/artifacts/eas/sS4iZmS98P65PzQRZBb1nlAyRRPPpkf0NBUfYs4tzDE.aab`
- EAS `autoIncrement`가 `apps/expo/app.json`과 `apps/expo/android/app/build.gradle`의 Android `versionCode`를 `2`로 갱신했다. 이 값은 production AAB 산출물과 일치하므로 이번 작업 결과로 보존한다.
- 원격 production AAB를 `/private/tmp/today-production-c3ecce28.aab`로 내려받아 내부 `base/manifest/AndroidManifest.xml` 문자열을 확인했다.
- 원격 production AAB 내부 manifest 문자열과 로컬 release bundle manifest 확인 기준으로 `SCHEDULE_EXACT_ALARM`은 남고, `USE_EXACT_ALARM`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`는 없다.
- 남는 주요 권한은 `INTERNET`, `SCHEDULE_EXACT_ALARM`, `VIBRATE`, `ACCESS_NETWORK_STATE`, `RECEIVE_BOOT_COMPLETED`, `POST_NOTIFICATIONS`, `WAKE_LOCK`, FCM receive, dynamic receiver, install referrer, launcher badge 계열이다.
- `bundletool` 구조화 manifest dump는 로컬 Gradle cache의 jar가 standalone 실행 의존성을 포함하지 않아 실행하지 못했다. 대신 Gradle이 생성한 `bundle_manifest` XML과 원격 AAB 내부 문자열 확인을 함께 증거로 사용한다.
- Play Console 직접 permission summary 확인은 Play Developer 계정/app record/first upload가 아직 없어 실행하지 않았다.
- Android 실기기 notification timing QA는 manifest/provider/native exact alarm 동작 변경이 없으므로 이번 범위에서 실행하지 않았다.

## Validation Result

- `git status --short --branch`: `qa/android-production-permission-summary-refresh` 브랜치에서 시작했고 EAS autoIncrement 변경을 확인했다.
- `npx eas-cli whoami`: 통과, `algumhun / algum1737@gmail.com`.
- `npx eas-cli build:list --platform android --limit 5 --json`: 통과, production build `c3ecce28-bf7a-434e-9d9c-47729696a13e`가 목록 최상단 `FINISHED`로 표시됨.
- `npx eas-cli build:view c3ecce28-bf7a-434e-9d9c-47729696a13e --json`: 통과, `STORE`/`production`/`.aab`/versionCode `2`.
- `npm test -- --run tests/expo-reminder-notification-config.test.ts`: 통과.
- `npm run typecheck`: 통과.
- `npx tsc --noEmit -p apps/expo/tsconfig.json`: 통과.
- `cd apps/expo/android && ./gradlew :app:processReleaseManifestForPackage`: 통과.
- `cd apps/expo/android && ./gradlew :app:bundleRelease`: 통과.
- `bash scripts/validate-docs.sh`: 통과.
- release manifest checks: `merged_manifest`, `merged_manifests`, `packaged_manifests`, `bundle_manifest`, 로컬 AAB 문자열, 원격 EAS production AAB 문자열에서 제거 대상 권한 미검출.
