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

- EAS/Play Console 접근 가능 여부 확인 전.
