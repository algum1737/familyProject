# Handoff

이 문서는 다른 세션에서 현재 상태를 빠르게 이어받기 위한 인계 문구다.

## Read First

다음 순서로 읽는다.

1. `AGENTS.md`
2. `README.md`
3. `ARCHITECTURE.md`
4. `docs/index.md`
5. `docs/MVP_SCOPE.md`
6. `docs/TECH_STACK.md`
7. `docs/WEB_TO_APP_TRANSITION.md`
8. `docs/PLANS.md`
9. `docs/exec-plans/completed/2026-05-08-harness-template-operations-update.md`
10. `docs/exec-plans/completed/2026-04-17-harness-template-kit.md`
11. `docs/exec-plans/completed/2026-04-24-app-transition-decision.md`
12. `docs/exec-plans/completed/2026-04-28-missed-plan-recovery.md`
13. `docs/exec-plans/completed/2026-04-23-plan-editing.md`
14. `apps/expo/src/screens/today-screen.tsx`
15. `apps/expo/src/components/expo-circular-planner.tsx`

## Current Baseline

### Branch Status

- `Android Start Notification Shade Capture QA` 작업은 `qa/android-start-notification-shade-capture`에서 완료됐고 `main`에 머지됐다.
- `Android Start Notification Precision` 작업은 `fix/android-start-notification-precision`에서 완료됐고 PR #15로 `main`에 머지됐다.
- `Android Notification Regression Guard` 작업은 `qa/android-notification-regression-guard`에서 완료됐고 PR #16으로 `main`에 머지됐다.
- `Android Play Permission Blockers` 작업은 `docs/android-play-permission-blockers`에서 완료됐고 PR #17로 `main`에 머지됐다.
- `CI Playwright System Chrome` 작업은 `fix/ci-playwright-system-chrome`에서 완료됐고 PR #18로 `main`에 머지됐다.
- `User Facing Internal Copy Cleanup` 작업은 `fix/user-facing-internal-copy`에서 완료됐고 `main`에 머지됐다.
- `Expo Route Adapter Boundary` 작업은 `feature/expo-route-adapter-boundary`에서 완료됐고 `main`에 머지됐다.
- `Today Program Description HTML` 작업은 `docs/today-program-description-html`에서 완료됐고 main에 머지됐다.
- `Android Release Manifest Permissions` 작업은 `fix/android-release-manifest-permissions`에서 완료됐고 PR #19로 `main`에 머지됐다.
- `Android Production Permission Summary` 작업은 `qa/android-production-permission-summary`에서 완료됐고 PR #20으로 `main`에 머지됐다.
- `Expo Color Dropdown` 수정은 `fix/expo-color-dropdown`에서 완료됐고 PR #21로 `main`에 머지됐다.
- `Android Production Permission Summary Refresh` 작업은 `qa/android-production-permission-summary-refresh`에서 완료됐고 PR #22로 `main`에 머지됐다.
- 현재 다음 우선 작업은 Play Console app record 생성과 internal testing track 첫 업로드 준비다.
- 기준 커밋은 `git rev-parse --short HEAD`로 확인한다.
- Superpowers 설치 여부: Codex 재시작 후 skill 목록 또는 `~/.agents/skills/superpowers-*` 경로로 확인한다.

### Latest Progress Snapshot

- Superpowers 연동 프로파일을 familyProject 하네스 문서에 반영했다. `docs/references/superpowers.md`를 기준으로 Superpowers skill을 사용하되, 사용자 승인, 브랜치 생성, PR/merge 규칙은 `AGENTS.md`를 우선한다.
- `fix/android-start-notification-precision`에서 Android manifest에 `SCHEDULE_EXACT_ALARM`을 추가했고 `USE_EXACT_ALARM`은 Play 정책 리스크 때문에 선언하지 않았다. Expo notifications Android native 구현은 `canScheduleExactAlarms()`가 true이면 `setExactAndAllowWhileIdle`, false이면 `setAndAllowWhileIdle`로 fallback하는 것을 확인했다.
- React Native native module `ExactAlarmModule`과 JS wrapper를 추가해 Android exact alarm 접근 상태 확인과 `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` 설정 화면 이동을 연결했다. Today 설정 메뉴에는 `정확 알림 켜기` / `정확 알림 켜짐` 상태 항목이 추가됐다.
- 관련 정책/릴리스 문서와 privacy policy에 Android exact alarm 목적과 `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` 판단을 반영했다.
- 자동 검증은 `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `bash scripts/validate-docs.sh`, `./gradlew assembleRelease`가 통과했다. 릴리스 merged/packaged manifest에는 `android.permission.SCHEDULE_EXACT_ALARM`이 있고 `android.permission.USE_EXACT_ALARM`은 없다.
- 실기기 runtime QA도 통과했다. `SM_S908N` / `R5CT31X2K2H`에 최신 release APK를 standalone으로 설치했고 `adb reverse --list`가 비어 있어 Metro 없는 상태였다.
- exact alarm 접근 전 Today 설정 메뉴는 `정확 알림 켜기`였고, Android `알람 및 리마인더` 설정에서 허용한 뒤 `정확 알림 켜짐`으로 바뀌었다.
- QA 일정 `QAExact 11:25 - 11:59`의 start-5 target은 `2026-06-02 11:20:00.000 KST`였고, `dumpsys alarm` 예약은 `window=0`, `exactAllowReason=permission`이었다. active notification은 `when=2026-06-02 11:20:00.106 KST`로 기록돼 목표 대비 약 `0.106s` 지연이었다.
- notification shade에는 title `오늘 다 했니`, body `QAExact 시작 5분 전입니다.`, time `오전 11:20`이 표시됐다. 증거 파일은 `/private/tmp/qaexact-shade.png`, `/private/tmp/qaexact-shade.xml`이다.
- 3-button navigation bar 환경에서 plan editor 하단 `취소`/`저장`과 time picker 하단 `취소`/`확인`은 navigation bar 위에 표시됐다. 확인 bounds는 plan editor 버튼 `[102,1927][805,2056]`, `[833,1927][980,2056]`, time picker 버튼 `[51,2001][855,2130]`, `[883,2001][1029,2130]`, navigation bar `[0,2181][1080,2316]`이다.
- QA 일정은 앱 UI에서 삭제했고, 삭제 후 UI에서 `QAExact`가 사라졌다. pending alarm 목록에는 앱 패키지가 남지 않았고, 이전 `11:54` end reminder 항목은 AlarmManager history에만 남은 것으로 확인했다.
- `qa/android-notification-regression-guard`에서 Android 알림 정확도 회귀 방지 guard를 추가했다. `tests/expo-reminder-notification-config.test.ts`는 이제 manifest의 `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` 정책뿐 아니라 `MainApplication`의 `ExactAlarmPackage` 등록, `ExactAlarmPackage`의 `ExactAlarmModule` 생성, `ExactAlarmModule`의 module name, `canScheduleExactAlarms()`, `ACTION_REQUEST_SCHEDULE_EXACT_ALARM`, error code 계약을 확인한다.
- `APP_EXPO_RELEASE_CHECKLIST.md`에는 Android notification regression guard와 실기기 start-5 timing QA 재실행 트리거를 추가했다. 실기기 QA는 Android manifest/native exact alarm bridge/provider/Today 설정 wiring, target SDK/Expo SDK/`expo-notifications`/React Native/Android Gradle Plugin/EAS profile 변경, Play Console 권한/스토어 문구 제출 직전, exact alarm 접근 off fresh install 경로 확인 시 다시 실행한다.
- 이번 guard 작업 검증은 `npm test -- --run tests/expo-reminder-notification-config.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `bash scripts/validate-docs.sh`가 통과했다. 새 실기기 runtime QA는 이전 precision QA 결과를 guardrail로 고정하는 범위라 실행하지 않았다.
- `docs/android-play-permission-blockers`에서 Play Console 제출 전 Android 권한/스토어 문구 blocker를 분류했다. Google 공식 문서 기준 sensitive permission/API는 listing에 공개된 현재 기능에 필요한 경우에만 요청해야 하며, `USE_EXACT_ALARM`은 alarm/timer/calendar 핵심 기능 앱에 제한되는 restricted permission이라 계속 미선언으로 둔다.
- `fix/android-release-manifest-permissions`에서 release manifest 권한 제거를 적용했다. main manifest의 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` 선언을 제거했고, `apps/expo/android/app/src/release/AndroidManifest.xml`에서 세 권한을 `tools:node="remove"`로 차단한다.
- 원천 확인 결과 `READ_EXTERNAL_STORAGE`는 `expo-image`, `WRITE_EXTERNAL_STORAGE`는 `expo-file-system` library manifest에서 재유입됐다. debug/debugOptimized manifest의 `SYSTEM_ALERT_WINDOW`는 개발용 overlay 권한으로 남기고 release에는 남기지 않는다.
- `tests/expo-reminder-notification-config.test.ts`는 이제 `SCHEDULE_EXACT_ALARM` 유지, `USE_EXACT_ALARM` 금지, release override의 `SYSTEM_ALERT_WINDOW`/`READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` 제거 계약을 함께 확인한다.
- 이번 권한 제거 검증은 `npm test -- --run tests/expo-reminder-notification-config.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `bash scripts/validate-docs.sh`, `./gradlew :app:processReleaseMainManifest`, `./gradlew :app:processReleaseManifest`, `./gradlew :app:processReleaseManifestForPackage`가 통과했다. release merged/packaged manifest에는 `SCHEDULE_EXACT_ALARM`만 남고 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `USE_EXACT_ALARM`은 없다.
- Play Console 실제 입력, EAS production AAB build/submit, 실기기 Android smoke/notification QA는 이번 범위가 로컬 release manifest 권한 정리라 실행하지 않았다. Play Console 제출 직전에는 production AAB 또는 Play Console permission summary에서 권한 목록을 다시 확인한다.
- `qa/android-production-permission-summary`에서 `2026-06-10` 로컬 release permission preflight를 진행했다. `npm test -- --run tests/expo-reminder-notification-config.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `bash scripts/validate-docs.sh`, `./gradlew :app:processReleaseManifestForPackage`, `./gradlew :app:bundleRelease`가 통과했다.
- 로컬 release AAB는 `apps/expo/android/app/build/outputs/bundle/release/app-release.aab`에 생성됐고 크기는 약 56 MB다. 이 산출물은 `android/app/build.gradle`의 release build type이 debug signingConfig를 쓰는 현재 prebuild 기본값 때문에 Play 제출물은 아니며, 권한 summary 사전 검증 증거로만 사용한다.
- `bundle_manifest`, `merged_manifests`, `packaged_manifests`, AAB 내부 base manifest 문자열 확인 기준으로 `SCHEDULE_EXACT_ALARM`은 남고 `USE_EXACT_ALARM`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`는 없다. 전체 release permission summary에는 `INTERNET`, `SCHEDULE_EXACT_ALARM`, `VIBRATE`, `ACCESS_NETWORK_STATE`, `RECEIVE_BOOT_COMPLETED`, `POST_NOTIFICATIONS`, `WAKE_LOCK`, FCM receive, dynamic receiver, install referrer, launcher badge 계열 권한이 남는다.
- `fix/expo-color-dropdown`에서 Expo 계획 편집 화면의 색상 선택기를 인라인 absolute 드롭다운에서 하단 모달 선택기로 바꿨다. 기존 구현은 실기기 `SM_S908N`에서 하단 색상 옵션 bounds가 비정상으로 잡히고 `브라운`/`로즈` 선택이 반영되지 않았으며, 새 구현은 modal sheet 안에서 스크롤한 뒤 `브라운, ▾` 선택 반영을 확인했다.
- Expo 새 일정 기본 색상은 팔레트에 없는 `#f07c61`에서 `PLAN_COLORS[0].value`로 맞췄다. 이로써 새 일정 화면의 표시 색상과 실제 저장 색상 불일치가 사라졌다.
- 이번 색상 선택기 수정 검증은 `npm test -- --run tests/expo-plan-editor-color.test.ts tests/expo-theme-screen-style-snapshots.test.ts tests/expo-router-route-actions.test.ts tests/expo-bootstrap-and-reminders.test.ts`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `npm run typecheck`, `npm run lint`, `bash scripts/validate-docs.sh`, `./gradlew :app:assembleRelease`, 실기기 release APK 설치 및 색상 모달 `브라운` 선택 확인이 통과했다. `npm run lint`에는 기존 웹 파일 `src/features/planner/app/app-flow-shell.tsx`의 `aria-selected` warning 1개만 남았다.
- `qa/android-production-permission-summary-refresh`에서 `2026-06-11` EAS Android production build `c3ecce28-bf7a-434e-9d9c-47729696a13e`를 완료했다. 산출물은 `production` profile, `STORE` distribution, `.aab`, `appVersion 0.1.0`, `versionCode 2`다. EAS `autoIncrement`로 `apps/expo/app.json`과 `apps/expo/android/app/build.gradle`의 Android `versionCode`도 `2`로 갱신됐다.
- 원격 production AAB는 `/private/tmp/today-production-c3ecce28.aab`로 내려받아 내부 `base/manifest/AndroidManifest.xml` 문자열을 확인했다. 로컬 `bundle_manifest`/`packaged_manifests`와 원격 AAB 문자열 기준으로 `SCHEDULE_EXACT_ALARM`은 남고 `USE_EXACT_ALARM`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`는 없다. Play Console permission summary 직접 확인은 Play Developer 계정/app record/first upload가 아직 없어 남아 있다.
- `fix/ci-playwright-system-chrome`에서 CI e2e browser install hang 대응을 진행했다. `b077cd7` push run의 `validate` job은 통과했지만 `e2e` job은 `npx playwright install --with-deps chromium`에서 Chrome download `100%` 이후 약 6시간 동안 종료되지 않아 cancelled 됐다.
- Playwright 설정은 로컬과 CI 모두 system Chrome `channel: "chrome"`을 쓰도록 바꿨고, GitHub Actions e2e job에서는 Playwright browser install 단계를 제거했다. 대신 `google-chrome` 또는 `google-chrome-stable` 버전을 확인하는 `Verify system Chrome` step을 추가했다.
- 이번 CI 수정 검증은 `npm run typecheck`, `npm test`, `bash scripts/validate-docs.sh`, 외부 권한 `npm run test:e2e`가 통과했다. PR #18의 GitHub Actions `validate`와 `e2e`도 통과했고, `e2e`는 약 1분 안에 완료됐다. sandbox 내부 `npm run test:e2e`는 Next server bind 제한으로 `listen EPERM: operation not permitted 0.0.0.0:3000` 실패했다.
- `Android Start Notification Shade Capture QA` 계획은 completed로 이동했다. 최신 `main` 기준 release APK를 `SM_S908N` / `R5CT31X2K2H`에 standalone으로 설치했고, `adb reverse --list`가 비어 있어 Metro 없는 상태를 확인했다. 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `POST_NOTIFICATIONS granted=true`, channel `today-reminders-high` `importance=4` 상태였다.
- QA 일정 `QAShade 14:30 - 14:58`을 저장하고 앱을 Home/background로 내린 뒤 start-5 목표 `2026-05-20 14:25:00 KST`를 관찰했다. AlarmManager history상 알림은 `2026-05-20 14:33:06.197 KST`에 발화해 약 8분 6초 지연됐지만, 15분 관찰 창 안에서 active notification으로 확인됐다.
- notification shade 실제 카드에서 title `오늘 다 했니`, body `QAShade 시작 5분 전입니다.`를 캡처했다. 증거 파일은 `/private/tmp/qashade-shade-live.png`와 `/private/tmp/qashade-window-live.xml`이다.
- QA 일정은 앱 화면의 `삭제` 액션으로 제거했고, end reminder PendingIntent `b94c286`은 `alarm_cancelled`로 기록됐다. shade card는 스와이프로 화면에서 제거됐지만 `dumpsys notification`에는 앱 `StatusBarNotification` 레코드가 잠시 남는 잔여 관찰이 있었다.
- 이번 QA 검증은 `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `./gradlew assembleRelease`, standalone APK 설치와 실기기 알림 shade 확인이 통과했다.
- `Today Program Description HTML` 계획은 completed로 이동했다. 현재까지 만든 `오늘 다 했니?` 프로그램을 설명하는 단독 HTML 문서 `docs/generated/today-did-you-finish-program-description.html`을 추가했고, 생성 문서 목록과 `docs/index.md`에 링크를 등록했다.
- HTML 설명서는 제품 목표, 핵심 가치, 오늘/계획 편집/회고/동기 화면, 사용 흐름, 주요 기능, 현재 개발 상태와 남은 확장을 사용자용 문구로 정리한다. 내부 구현명이 사용자 설명에 남지 않도록 `PlanEditorScreen`, `selector`, `store 계약`, `Mobile Preview`, `Expo` 표현을 확인했다.
- 이번 문서 작업 검증은 `bash scripts/validate-docs.sh`가 통과했다. 앱 런타임 QA와 브라우저 스크린샷 QA는 정적 HTML 산출물 작업 범위라 실행하지 않았다.
- `Android Start Notification Timing Real Device QA` 계획은 completed로 이동했다. Android exact alarm 권한이 default 상태인 `SM_S908N` / `R5CT31X2K2H`에서 start-5 알림이 target `18:11`보다 약 2분 57초 늦은 `18:13:56~18:13:57`에 발화하는 것을 AlarmManager history와 logcat으로 확인했다.
- 이 지연을 앱 동기화가 과거 예약으로 오판해 취소하지 않도록 `REMINDER_SCHEDULE_GRACE_MINUTES = 15`를 추가했고, scheduled notification content에 `scheduledFor` metadata를 저장해 같은 notification key와 예정 시각이면 재동기화 시 유지한다. 새 요청은 여전히 `scheduledFor <= now`이면 재예약하지 않는다.
- 보강 포함 release APK를 재빌드/재설치했고 `adb reverse --list`가 비어 있어 Metro 없는 standalone 상태를 확인했다. `POST_NOTIFICATIONS`는 `granted=true`, channel `today-reminders-high`는 `importance=4`였다.
- QA 일정 `QAGracem 18:16 - 19:01`은 테스트 후 삭제해 Today 빈 상태로 정리했다. notification shade 카드 문구는 확인 시점에 이미 archive 상태라 UI XML에서 캡처하지 못했으므로, 추후 최종 릴리스 QA에서는 shade 문구 캡처를 한 번 더 확보하는 것이 좋다.
- 이번 변경 검증은 `npm test -- --run tests/expo-start-reminder-sync.test.ts tests/expo-reminder-notification-config.test.ts tests/expo-reminder-sync-queue.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `./gradlew assembleRelease`, standalone APK 설치가 통과했다.
- `Android Start Notification Timing Fix` 계획은 completed로 이동했다. 시작 5분 전 알림 지연 QA 결과를 기준으로 Expo notification provider를 확인했고, scheduled time 계산은 맞지만 실제 예약 호출이 `scheduledFor`를 `Date.now()` 기준 상대 초로 바꿔 `TIME_INTERVAL` trigger를 쓰고 있었다.
- Android background/home 및 잠금 조건에서 상대 interval 예약이 밀릴 가능성을 줄이기 위해, provider가 `scheduledFor` 절대 시각을 `DATE` trigger로 직접 전달하도록 변경했다. notification content, channel id/name, start/end notification key, 문구 계약은 유지했다.
- `buildExpoReminderDateTrigger` helper와 테스트를 추가했다. 검증은 `npm test -- --run tests/expo-reminder-notification-config.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-reminder-sync-queue.test.ts`, `npm run typecheck`, `npx tsc --noEmit -p apps/expo/tsconfig.json`, `bash scripts/validate-docs.sh`가 통과했다.
- 실기기 런타임 QA는 이번 커밋에서 실행하지 않았다. 현재 설치된 standalone에는 이번 JS 변경이 포함되지 않으므로, 다음 단계는 새 standalone 또는 dev build를 설치한 뒤 10~15분 뒤 시작 일정을 만들고 target start-5 시각의 active notification과 notification shade 표시를 다시 확인하는 것이다.
- PR #10 `Android 알림 delivery 실기기 QA 기록`은 GitHub Actions `validate`와 `e2e` 통과 후 squash merge됐다. 로컬 `main`은 merge 결과를 반영한 뒤 `qa/android-start-notification-real-device` 브랜치로 새 QA를 진행했다.
- `Android Start Notification Real Device QA` 계획은 completed로 이동했다. 최신 standalone 설치본을 `SM_S908N` / `R5CT31X2K2H`에서 Metro reverse 없이 실행했고, `POST_NOTIFICATIONS granted=true`와 notification channel `today-reminders-high` `importance=4` 상태를 확인했다.
- QA 일정 `QAStart 15:45 - 16:33`을 만들고 앱을 Home/background 상태로 내렸다. 시작 5분 전 목표 시각인 `2026-05-15 15:40:25 KST` 확인에서는 앱 notification이 active record가 아니라 archive에만 있었고, notification shade UI에도 `QAStart` 문구가 보이지 않았다.
- `2026-05-15 15:46:11 KST`에는 active `NotificationRecord`와 notification shade 표시가 확인됐다. title은 `오늘 다 했니`, text/bigText는 `QAStart 시작 5분 전입니다.`, channel은 `today-reminders-high`, importance는 `4`였다.
- 이번 결과는 시작 5분 전 알림의 발행/표시/dismiss 자체는 가능하지만 Android background/home 및 잠금 조건에서 목표 시각보다 약 6분 늦게 활성화되는 타이밍 이슈가 남았다는 의미다. QA notification은 swipe dismiss했고, QA 일정은 삭제해 Today `0/0` 상태로 정리했다.
- 같은 QA에서 3-button navigation bar가 있는 상태의 계획 편집 하단 버튼 배치도 확인했다. `취소` `[102,1927][805,2056]`, `저장` `[833,1927][980,2056]`, navigation bar `[0,2181][1080,2316]`로 하단 버튼이 navigation bar에 가려지지 않았다.
- 다음 우선 작업은 이 QA 문서 브랜치를 PR/merge한 뒤, 별도 fix plan으로 Android 시작 5분 전 notification 지연 원인을 다루는 것이다. 후보 원인은 Samsung background freeze/Doze 조건, Expo notification trigger 지연, 앱 프로세스 상태에 따른 예약 처리 지연이다.
- `Android Notification Delivery Real Device QA` 계획은 completed로 이동했다. 최신 standalone 설치본을 `SM_S908N` / `R5CT31X2K2H`에서 Metro reverse 없이 실행했고, `POST_NOTIFICATIONS granted=true`와 notification channel `today-reminders-high` `importance=4` 상태를 확인했다.
- QA 일정 `QADelivery 14:17 - 14:24`를 저장한 뒤 foreground 인앱 리마인드 `리마인드: QADelivery · 지금 완료 가능`을 확인했다. 앱을 Home/background로 내린 뒤 `14:19` 전후 종료 5분 전 OS notification이 active record와 notification shade에 표시됐다.
- 해당 OS notification은 title `오늘 다 했니`, text `QADelivery 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`, channel `today-reminders-high`, importance `4`로 확인됐다. notification shade swipe dismiss 후 UI dump에서 앱 알림 문구가 사라졌고, QA 일정은 삭제했다.
- 시작 5분 전 OS 알림은 이번 짧은 일정 생성 시점상 이미 과거라 별도로 닫지 않았다. 다음 우선 작업은 이 QA 문서 브랜치를 PR/merge한 뒤 Play Console 제출 준비 blocker 정리 또는 시작 5분 전 OS 알림만 분리한 추가 실기 QA다.
- `Android Route Boundary Smoke QA` 계획은 completed로 이동했다. 최신 `main` 기준 `5d67d41`에서 Android standalone release APK를 빌드하고 `SM_S908N` / `R5CT31X2K2H` 실기기에 재설치했다.
- 설치 앱은 `com.familyproject.todaydidyoufinish` `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true` 상태였고, `adb reverse --list`가 비어 있어 Metro 연결 없이 standalone으로 실행되는 것을 확인했다.
- 실기기 smoke에서 Today 렌더링, 계획 편집 생성 진입/취소, `QA-route-smoke` 저장, 저장된 계획 편집 진입/취소, Motivation 탭 진입이 통과했다. QA용 계획은 삭제해 빈 상태로 정리했다.
- 3-button navigation bar가 있는 상태에서 계획 편집 화면 하단 `취소`/`저장` 버튼은 navigation bar 위에 렌더링되어 가려지지 않았다. 확인 bounds는 버튼 `[102,1927][805,2056]`, `[833,1927][980,2056]`, navigation bar `[0,2181][1080,2316]`이다.
- 다음 우선 작업은 이 QA 문서 브랜치를 PR/merge한 뒤 Android 알림 장기 delivery QA 또는 Play Console 제출 준비 blocker 정리로 이어가는 것이다.
- `Expo Route Adapter Boundary` 계획은 completed로 이동했다. `editor`/`reflection` route param parser를 `expo-router-contract`에 추가해 route 파일의 raw param 타입 단언을 제거했고, invalid mode 또는 planId 누락은 `today`로 되돌리는 계약으로 고정했다.
- Expo 전용 타입체크에서 드러난 `ExpoPlanItemView`와 Today screen props 계약 차이도 함께 정리했다. `rescheduleActionState`를 shell model 타입에 포함하고 presentation helper 반환 타입을 명시했다.
- 이번 route 경계 정리 검증은 `npm test -- --run tests/expo-router-route-actions.test.ts tests/expo-router-contract.test.ts tests/expo-router-provider-state.test.ts`, `npm run typecheck`, `apps/expo`의 `npx tsc --noEmit -p tsconfig.json`, `bash scripts/validate-docs.sh`가 통과했다. 실기기 QA는 실행하지 않았다.
- `User Facing Internal Copy Cleanup` 계획은 completed로 이동했다. Expo 계획 편집, 앱 bootstrap loading/error, 웹 앱/앱 프리뷰/목업의 사용자 표시 문구에서 `웹 PlanEditorScreen`, `React Native 입력 위젯`, `selector`, `store 계약`, `Mobile Preview`, `Plan Editor Screen`처럼 사용자가 보기 어색한 내부 구현/프리뷰 라벨을 제거했다.
- 이번 카피 정리는 동작 변경 없이 표시 문구만 다뤘다. 검증은 `npm test -- --run tests/expo-theme-screen-style-snapshots.test.ts tests/expo-router-route-actions.test.ts tests/expo-router-provider-state.test.ts`, `npm run typecheck`, `bash scripts/validate-docs.sh`가 통과했다.
- PR 검증 중 웹 planner E2E가 이전 H1 문구를 찾고 있어 실패했고, `tests/e2e/planner-flow.spec.ts`의 heading 기대값을 새 사용자용 H1로 갱신했다. 로컬 `npm run test:e2e`는 통과했다.
- 남은 우선 작업은 이번 route 경계 정리를 PR/merge한 뒤 Android 최신 빌드 실기기 smoke 확인이다.
- Expo iOS 시뮬레이터 경로가 실제로 연결됐다. `expo-router` route tree, Metro workspace 설정, iOS development build, simulator 실행까지 확인했다.
- Expo `Today` 화면은 safe area, 전체 스크롤, 실제 앱 톤에 가까운 상단 배경/헤더 구조로 정리됐다.
- Expo `Today` 화면에는 계획 삭제 버튼이 연결됐고, `Plan Editor`는 저장 실패 시 화면에 남아서 필드별 오류를 보여주며 첫 오류 필드로 포커스를 이동한다.
- 시간 입력은 `9`, `12`, `930`, `1230`, `09:30`처럼 유연하게 받을 수 있고, 자정 넘김 일정도 `23` 시작 / `4` 종료처럼 입력하면 `23:00 ~ 다음 날 04:00`으로 저장된다.
- 자정 넘김 일정은 저장뿐 아니라 현재 계획 판정, 완료 가능 여부, 리마인드 창 판정, 충돌 검사까지 같은 규칙으로 맞춰져 있다.
- Expo 원형 시간판은 숫자/섹터 라벨/시침 가독성을 키웠고, 해/달 보조 아이콘을 복구했다. 다만 현재는 전체 보드 크기와 레이아웃 균형을 더 다듬을 여지가 있다.
- Expo 원형 시간판은 이제 잘못 저장된 `plan.color` 값도 방어한다. `mint` 같은 theme key가 저장돼 있어도 bootstrap/store/render 경로에서 기본 hex 색으로 정규화해 섹터 fill과 alpha overlay가 깨지지 않는다.
- Expo 로컬 알림 배너 QA를 다시 돌린 결과, iOS 시뮬레이터에서는 `DeliveredNotifications.plist` 또는 인앱 리마인드 상태는 확인되지만 home/app 화면 캡처상 별도 OS 배너는 계속 보이지 않았다.
- 시뮬레이터 알림 QA 운영 기준은 [APP_REMINDER_SIMULATOR_QA.md](/Users/hun/workspace/familyProject/docs/APP_REMINDER_SIMULATOR_QA.md)에 분리됐다. 예약 파일, delivered 기록, foreground 인앱 상태, 화면 배너 screenshot을 같은 강도로 보지 않고 증거 우선순위를 분리한다.
- 실제 iPhone 배너 QA를 시도했지만, 현재 세션에서는 `xcrun devicectl`과 `xcrun xctrace` 기준 연결된 물리 iPhone이 없어서 실기 검증은 진행하지 못했다.
- 실제 iPhone이 없으면 Android 실제 기기 연결로 알림 실기 QA를 대체할 수 있다. 이 경우 `adb devices`로 인식 확인 후 `apps/expo`에서 `npx expo run:android --device`로 dev build를 올리는 경로를 사용한다.
- Expo 릴리스 준비 작업이 시작됐다. `apps/expo/eas.json`에 `development`, `preview`, `production` build profile이 추가됐고, 릴리스 전제 조건과 QA gate는 [APP_EXPO_RELEASE_CHECKLIST.md](/Users/hun/workspace/familyProject/docs/APP_EXPO_RELEASE_CHECKLIST.md)에 정리돼 있다.
- Expo 브라우저 로그인은 완료됐다. 현재 `npx eas-cli whoami`는 `algumhun / algum1737@gmail.com`을 반환한다.
- `npx eas-cli init --non-interactive --force`로 `@algumhun/today-did-you-finish` EAS project 생성과 app link가 완료됐다. `apps/expo/app.json`에는 `owner`와 `extra.eas.projectId`가 반영됐다.
- `apps/expo`에서 `npx eas-cli build --platform ios --profile preview --non-interactive`를 다시 시도한 결과, 현재 다음 blocker는 `iOS internal distribution credential` setup이다. non-interactive 모드에서는 suitable credential이 없어 중단됐다.
- 같은 build 시도에서 `preview` profile의 `channel`은 `expo-updates` 미설치 상태라 경고가 출력됐고, 이후 `expo-updates`를 아직 쓰지 않는 기준으로 `apps/expo/eas.json`의 `channel` 설정은 제거했다.
- 사용자 우선순위에 맞춰 릴리스 경로를 Android 우선으로 전환했다.
- `npx eas-cli build --platform android --profile preview --non-interactive`는 remote Android keystore 생성, 업로드, fingerprint 계산까지 통과했지만, EAS server의 `Install dependencies` 단계에서 `Unknown error`로 실패했다. build id는 `af3052a3-4f1a-4cc4-b96b-cc323cd2c458`다.
- 이 Android build failure는 `/private/tmp/expo-clean2`에서 클린 `npm ci`로 재현됐다. 원인은 `react@19.2.0`만 직접 선언된 상태에서 전이 의존성 `react-dom@19.2.5`가 풀리며 생긴 peer dependency `ERESOLVE`였다.
- [apps/expo/package.json](/Users/hun/workspace/familyProject/apps/expo/package.json)에 `react-dom: 19.2.0`을 명시하고 `apps/expo/package-lock.json`을 갱신한 뒤, `/private/tmp/expo-clean3` 기준 클린 `npm ci`는 통과했다.
- 수정 후 `npx eas-cli build --platform android --profile preview --non-interactive`를 다시 실행했고, 새 build id `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`로 완료됐다.
- 같은 build는 internal APK 산출물을 생성했다.
- internal APK를 `/private/tmp/today-did-you-finish-preview.apk`로 내려받아 Android Emulator에 설치했다.
- 기존 dev build와 preview APK의 서명이 달라 기존 `com.familyproject.todaydidyoufinish` 패키지를 제거한 뒤 새 APK를 설치해야 했다.
- 설치 후 첫 실행에서 알림 권한 요청이 정상 노출됐고, 허용 뒤 `com.familyproject.todaydidyoufinish/.MainActivity`가 resumed 상태로 올라오며 Today 메인 화면 렌더링까지 확인됐다.
- Android preview APK 설치 경로는 한 번 더 반복 확인했고, 제거 -> 재설치 -> 권한 허용 -> Today 메인 화면 렌더링까지 다시 통과했다.
- Android Emulator에서 foreground/background 로컬 알림 QA를 완료했다. foreground에서는 시작 5분 전 인앱 리마인드가 보였고, background/home 상태에서는 종료 5분 전 OS 알림이 notification shade에 적재됐다. 해당 알림은 notification shade에서 스와이프하자 목록에서 제거됐다.
- 웹 planner missed 카드도 Expo Today 화면처럼 `다시 지정` 차단 이유를 직접 보여준다. `rescheduleCount >= 3`이면 `다시 지정 3/3 사용 완료`, 이미 후속 일정이 있으면 `이미 다시 지정된 후속 일정이 있음`을 카드 본문에 표시하고, 버튼은 기존처럼 비활성화한다.
- 웹 planner의 `다시 지정 3/3 사용 완료` 표시는 Playwright E2E로도 확인됐다. `tests/e2e/planner-flow.spec.ts`는 별도 browser context seed로 maxed missed 일정을 주입하고, 실제 `build + start` 렌더 경로에서 문구 표시와 `다시 지정` 버튼 비활성화를 검증한다.
- Expo Today missed 카드도 blocked reschedule 상태를 `rescheduleActionState`로 구분한다. 이제 `다시 지정 3/3 사용 완료` 또는 `이미 다시 지정된 후속 일정이 있음` 이유가 있는 missed 일정은 `다시 지정` 액션을 숨기지 않고 비활성 버튼으로 보여 웹과 의미를 맞춘다.
- Expo 앱 전체 회귀 QA를 Android Emulator에서 완료했다. 설치 앱은 `com.familyproject.todaydidyoufinish` `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS` granted 상태였고, Today 렌더링, 계획 생성/저장, 편집 진입/취소, missed 회고 저장, 생성한 QA 계획 삭제, Motivation 탭 이동과 월간 지표 표시를 smoke 확인했다.
- Expo 앱 전체 회귀 자동 검증은 route/action/presentation/reminder 관련 Vitest 5개 파일 20개 테스트, 루트 `npm run typecheck`, `bash scripts/validate-docs.sh`가 통과했다.
- 단, 현재 설치된 Android preview APK는 `2026-05-13 09:21:59` 설치본이라 이후 소스 변경까지 모두 포함하지 않는다. 최신 소스가 반영된 런타임 확인은 새 Android preview/dev build 재설치 후 후속으로 진행한다.
- 최신 로컬 Android debug APK smoke QA를 완료했다. `apps/expo/android/app/build/outputs/apk/debug/app-debug.apk`를 `2026-05-13 14:00:15`에 새로 빌드했고, 기존 패키지를 제거한 뒤 Emulator에 설치했다. 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `DEBUGGABLE`, `firstInstallTime=2026-05-13 14:25:59` 상태였다.
- debug APK는 JS bundle을 내장한 preview/production 산출물이 아니라 Metro 8081 연결이 필요했다. `adb reverse tcp:8081 tcp:8081` 후 기존 Metro 서버에 붙여 재시작하자 Expo Router bootstrap, 알림 권한 프롬프트, Today 빈 상태, 원형 시간판, `새 계획 추가`, Motivation 탭과 월간 지표가 정상 렌더링됐다.
- 새 debug 설치 직후 `POST_NOTIFICATIONS`는 `granted=false`였고, 앱 권한 프롬프트에서 `허용`을 누른 뒤 `granted=true`로 바뀌었다.
- exec plan 검증 계약을 현재 프로젝트와 `/Users/hun/workspace/하네스시스템구축방법/template-repo`에 함께 반영했다. 이제 큰 작업 계획은 시작 전에 `Pre-flight checks`, `Automated tests`, `Manual/Runtime QA`, `Skipped/Not Run` 기준을 고정하고, 완료 시 `Validation Result`에서 실행/통과/실패/미실행과 이유를 대조한다.
- 커밋 전 체크포인트 정리를 완료했다. release prep/native Android, web/Expo recovery UX, Android/Expo QA 문서, exec plan 검증 계약, completed plan 기록이 단일 checkpoint commit 후보로 분류됐고, Android native tree의 `.gradle`, `.cxx`, `build`, `local.properties`는 내부 `.gitignore` 기준 제외 대상임을 확인했다.
- Play Console 제출 준비 기준은 [APP_EXPO_RELEASE_CHECKLIST.md](/Users/hun/workspace/familyProject/docs/APP_EXPO_RELEASE_CHECKLIST.md)의 `Google Play Console Submission Readiness` 섹션에 구체화됐다. 계정/권한, app record/store listing, privacy policy/Data Safety, testing track, Play App Signing/AAB, release rollout 순서가 기준이다.
- Play Console에서 바로 확인하거나 입력할 후보값은 [APP_PLAY_CONSOLE_SUBMISSION_PREP.md](/Users/hun/workspace/familyProject/docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md)에 분리했다. 앱 이름, package name, store listing 문구 초안, Data Safety 가정, internal testing release notes 후보가 포함돼 있다.
- Play Console용 privacy policy 페이지는 [src/app/privacy/page.tsx](/Users/hun/workspace/familyProject/src/app/privacy/page.tsx)에 추가됐다. 실제 제출 URL은 웹 배포 도메인이 확정된 뒤 `https://<domain>/privacy` 형태로 완성한다.
- Play Console 1차 확인 항목은 계정 유형, `com.familyproject.todaydidyoufinish` 앱 레코드 생성 가능 여부, privacy policy 공개 URL 준비 여부다. 현재 privacy page는 repo에 준비됐고, 계정 유형과 앱 레코드 생성 가능 여부는 실제 Play Console 화면에서 확인해야 한다.
- `2026-05-13` Chrome에서 `play.google.com/console` 접속 시 `Play Console 개발자 계정 만들기`의 계정 유형 선택 화면으로 이동했다. 즉 현재 로그인 Google 계정은 Play Developer 계정 생성이 아직 완료되지 않은 상태이며, app record 생성 가능 여부는 계정 생성 이후에만 확인할 수 있다.
- `tests/expo-router-route-actions.test.ts`의 `startRescheduling` mock 반환 타입을 리터럴 union으로 고정해 루트 `npm run typecheck`가 다시 통과한다.
- `2026-05-13` 기준 Google Play 제출 전 확인해야 할 외부 blocker는 Play Console 계정 유형이다. `2023-11-13` 이후 생성된 개인 개발자 계정이면 production 접근 전에 closed test tester 12명/14일 연속 opt-in 조건을 채워야 한다.
- Android store 제출은 preview APK가 아니라 production profile의 `.aab` 산출물 기준이다. 신규 앱은 Play App Signing 수락과 Google-generated app signing key 사용을 기본 후보로 두고, EAS remote keystore는 upload key 역할로 유지한다.
- Android 우선 전환은 iOS 시뮬레이터 사용 중단을 의미하지 않는다. iOS 시뮬레이터는 계속 로컬 UI/흐름 QA에 쓸 수 있고, Android 배포 산출물 확인은 Android Emulator 또는 실제 Android 기기에서 별도로 해야 한다.
- Expo theme regression은 이제 palette token snapshot뿐 아니라 `Today` 화면의 route/card/menu/status pill 조합을 실제 `StyleSheet.create` 입력과 같은 pure helper로 snapshot 고정한다.
- Expo theme regression은 이제 `Today`뿐 아니라 `Plan Editor`, `Reflection`, `Motivation` 화면의 route/card/form/calendar 조합도 같은 pure helper에서 screen-level snapshot으로 고정한다.
- Expo 앱 아이콘이 새로 연결됐다. [apps/expo/assets/app-icon-1024.png](/Users/hun/workspace/familyProject/apps/expo/assets/app-icon-1024.png)을 Expo 공통 아이콘으로 쓰고, 현재 iOS native asset의 1024 마스터 PNG도 같은 이미지로 교체했다. 홈 화면 반영은 dev build 재설치 또는 새 빌드 후 확인한다.
- iOS 시뮬레이터 dev build를 다시 설치해 홈 화면 반영까지 확인했다. 현재 `오늘 다 했니` 아이콘은 원형 시간판 + 체크 조합으로 홈 화면에 보인다.
- GitHub Actions UTC 환경에서 `tests/planner.test.ts`의 carry-over 테스트가 깨지던 문제는 로컬 시간 생성자를 쓰도록 보정했다. 로컬 기본 시간대와 `TZ=UTC` 모두에서 `npm test -- tests/planner.test.ts`가 통과한다.
- PR `#2` 검증 중 루트 CI 환경에서 Expo provider 의존성 해석과 Expo tsconfig 해석 문제가 드러나 루트 devDependencies에 필요한 Expo 테스트 의존성을 맞췄다. 이후 UTC CI에서 `expo-start-reminder-sync`와 `expo-bootstrap-and-reminders`의 시간 의존 fixture가 깨지던 문제는 로컬 날짜 생성자 기반 테스트로 보정했고, GitHub Actions `validate`와 `e2e`가 모두 통과했다.
- 최신 `main` 기준 Android EAS preview standalone QA를 완료했다. 첫 preview build id는 `0a64265c-2fd7-493a-9c88-d574e91e52fd`였고, 후속 알림 수정/동기화 직렬화가 머지된 뒤 새 preview build id `1476fcb4-843c-42df-adc5-6d8adb897921`를 생성했다. 새 artifact는 `/private/tmp/today-did-you-finish-preview-2026-05-14.apk`로 내려받았고, 실기기 `SM_S908N`에 설치했다. `adb reverse --list`가 비어 있는 standalone 상태에서 Today 렌더링, 알림 권한 허용, background/home 상태 OS 알림 shade 표시와 dismiss가 통과했다.
- 하네스 템플릿 운영 규칙이 현재 프로젝트와 `/Users/hun/workspace/하네스시스템구축방법`에 반영됐다. 큰 작업은 active plan으로 시작하고, 완료 시 완료 범위와 검증 결과를 기록한 뒤 completed로 이동한다.
- `Harness Template Kit Plan`과 `Harness Template Operations Update`는 completed로 이동했다. `Expo Release Prep`, `Expo Notification Foreground Background QA`, `Web Reschedule Blocked Reason`, `Web Reschedule Blocked Browser QA`, `Recovery UX Polish`, `Expo App Regression QA`, `Android Latest Build Smoke QA`, `Android Preview Standalone QA`, `Exec Plan Validation Contract`, `Commit Checkpoint Cleanup`, `PR And Main Merge`도 completed로 닫았고, 현재 active exec plan은 없다.
- 전역 `AGENTS.md`에도 짧은 운영 규칙이 기록됐다. 현재 프로젝트에서 전역 에이전트 역할은 사용할 수 있지만, 실제 delegation은 사용자가 명시적으로 요청한 경우에만 수행한다.
- Expo 앱 QA 리뷰에서 부트스트랩 중 빈 상태 저장이 기존 기록을 덮어쓸 수 있는 문제, 리마인드 dismiss 키가 instance key가 아니라 plan id를 쓰는 문제, 앱 전용 테스트 부재가 확인됐다.
- `Expo Route Validation` 계획은 completed로 이동했다. 실제 iOS 시뮬레이터에서 `today -> editor -> reflection -> motivation` 흐름, `취소` 복귀, 편집 화면 충돌 저장 실패 표시까지 재현했고 route 전환 결함은 찾지 못했다.
- `Expo QA Fixes` 계획은 completed로 이동했다. bootstrap은 기존 records를 유지한 채 carry-over/legacy migration source를 더 정확히 판단하고, `use-expo-planner-state`는 hydration 전 빈 배열을 저장하지 않도록 막았다. 시작/종료 전 reminder dismiss는 이제 `planId`가 아니라 instance key 기준으로 계산되고, 관련 단위 테스트가 추가됐다.
- `Expo Monthly Regression Tests` 계획은 completed로 이동했다. Expo 앱 모델과 preview 모델의 월간 records 병합 규칙을 `buildExpoMergedPlannerRecords` helper로 분리했고, 현재 날짜 in-memory plans가 월간 selector 입력을 덮어쓰며 과거 records는 보존되는지 테스트로 고정했다. 회복 완료 후속 일정이 월간 동기부여/회복 지표에 반영되는지도 테스트에 추가했다.
- `Expo Screen Store Integration Tests` 계획은 completed로 이동했다. `useConnectedMotivationScreen`은 이제 현재 날짜 plans를 같은 렌더에서 월간 records에 직접 덮어쓰고, `AppMotivationShell` 통합 테스트로 stale current-date records override와 `recordsStore.saveForDate` 호출을 고정했다.
- `Reschedule Failure UX` 계획은 completed로 이동했다. `다시 지정` 실패는 이제 공통 helper로 분류되며, 웹 원형 플래너와 앱 편집 화면, Expo today 화면이 `연속 빈 시간 부족`과 `재지정 3회 초과` 안내를 같은 기준으로 보여준다.
- `Expo Route Provider Integration Tests` 계획은 completed로 이동했다. Expo route 엔트리의 create/edit/reschedule/reflection 분기와 today 리마인드 문구 계산은 `expo-router-route-actions` helper로 정리됐고, route/provider 계약은 focused 테스트로 고정됐다.
- `Expo Circular Planner Layout Polish` 계획은 completed로 이동했다. Expo 원형 시간판은 더 큰 캔버스와 중심 정보 영역을 쓰도록 조정됐고, outer badge truncation과 라벨 폭 계산은 helper/test로 고정됐다.
- `Expo Global Theme Presets` 계획은 completed로 이동했다. today 톱니 메뉴에서 `Sand`, `Mint`, `Night Ink` 전역 테마를 바꿀 수 있고, 선택은 AsyncStorage에 저장되며 shell, today/editor/reflection/motivation, tab bar가 같은 프리셋을 공유한다.
- `Expo Circular Planner Visual QA` 계획은 completed로 이동했다. 실제 iOS 시뮬레이터 기준으로 중심 흰색 디스크를 줄이고, 라벨 anchor를 더 바깥 lane으로 옮겼으며, 시계 바늘과 중앙 핀을 중심 정보 텍스트 아래 레이어로 내려 겹침을 줄였다. geometry는 이제 카드 폭에 따라 반응형으로 조정되고 관련 helper 테스트가 추가됐다.
- `Expo Route Provider Coverage` 계획은 completed로 이동했다. `expo-router-contract`의 route path, single param parsing, tab/overlay key guard를 focused 테스트로 고정했고, `expo-router-app-provider`의 bootstrap loading/error/ready gating은 pure helper로 분리해 provider 경계 규칙을 테스트 가능하게 만들었다.
- `Expo Hidden Reschedule Reason` 계획은 completed로 이동했다. missed 카드에서 `다시 지정` 버튼이 숨겨질 때 `다시 지정 3/3 사용 완료` 또는 `이미 다시 지정된 후속 일정이 있음` 이유 문구를 직접 보여주도록 연결했고, 같은 체인의 이전 일정이 후속 일정으로 잘못 잡혀 후속 일정 카드까지 `다시 지정`이 숨겨지던 판정 버그도 함께 수정했다.
- `Expo Theme Visual Regression` 계획은 completed로 이동했다. `Sand`, `Mint`, `Night Ink` theme는 이제 핵심 시각 토큰 묶음이 inline snapshot 테스트로 고정돼 route/surface/input 레이어, hero, semantic calendar tone, warning tone이 의도치 않게 바뀌면 테스트에서 바로 드러난다.
- `Expo Local Start Reminders` 계획은 completed로 이동했다. Expo 앱은 이제 시작 5분 전 미래 pending 일정만 대상으로 OS 로컬 알림을 예약하고, 알림 권한 요청과 managed reminder sync를 provider에 구현했다. app model과 preview model도 reminder sync를 실제로 호출하도록 연결돼 계획 저장/삭제/시간 흐름에 따라 예약이 갱신된다.
- `Expo End Recovery OS Reminders` 계획은 completed로 이동했다. Expo 로컬 알림은 이제 종료 5분 전 `이미 마쳤다면 완료 처리` 알림도 함께 예약하고, scheduling helper/provider sync는 시작 알림과 종료 알림 두 kind를 같은 managed 경로로 다룬다. 제품 정책 문서도 종료 5분 전 `OS 알림 + 인앱 계속 진행 배너`를 함께 유지하는 방향으로 갱신됐다.
- `Expo Local Reminder QA` 계획은 completed로 이동했다. iOS 시뮬레이터에서 테스트 일정 `알림QA`를 `15:27 - 15:35`로 저장하고 `15:22` 시작 알림 시점을 관찰했지만, 홈 화면 배너와 알림 센터 적재를 확인하지 못했다. 권한 프롬프트도 따로 보이지 않아, 알림 로직 회귀보다는 시뮬레이터 권한 상태 또는 전달 환경을 먼저 다시 확인해야 한다.
- `Expo Local Reminder Retry QA` 계획은 completed로 이동했다. 앱 재설치 뒤 알림 권한 프롬프트가 다시 노출되는 것까지 확인했고, 시뮬레이터 저장소 주입으로 미래 테스트 일정을 만들어 `DeliveredNotifications.plist`에 시작 5분 전/종료 5분 전 알림이 실제 기록되는 것도 확인했다. 다만 홈 화면 스크린샷에서는 배너가 보이지 않아, 남은 리스크는 시뮬레이터 배너 가시성과 수정/삭제 후 예약 갱신 QA다.
- `Expo Reminder Reschedule Cancel QA` 계획은 completed로 이동했다. 시뮬레이터 저장소에 미래 일정을 주입한 뒤 `PendingNotifications.plist`를 보면, 초기에는 시작/종료 알림이 둘 다 잡히고, 같은 `id` 일정의 시각/제목을 바꾸면 pending 항목도 새 제목 기준으로 교체되며, 일정을 비우면 pending 배열이 비워진다. 즉 예약 갱신과 취소 자체는 파일 기준으로 동작한다.

### Immediate Next Work

- 새 큰 작업을 시작하기 전에 반드시 `docs/exec-plans/active/`에 실행 계획을 먼저 작성한다.
- 현재 제품 방향은 Google Play 출시보다 앱 완성도와 QA를 먼저 높이는 것이다.
- 현재 우선 경로의 Android preview build, Emulator 설치, channel 경고 정리는 완료됐다. Play Developer 계정 생성, production 접근, Play Console app record 생성, Android production `.aab` 업로드는 최후순위 릴리스 대기열로 내린다.
- 사용자가 `밀린 업무 진행하자`라고 하면 최후순위 릴리스 대기열에서 Play Developer 계정 유형 선택/계정 생성, package name app record 확보, 공개 privacy policy URL 배포, Contact email 확정, App content/Data Safety 입력, Play App Signing 수락, internal/closed testing release 생성, production access 신청을 순서대로 재개한다.
- `feature/android-real-device-notification-qa`의 GitHub PR `#4`는 `main`에 merge됐고, 로컬 `main` 동기화도 완료됐다.
- Android 실기기 `SM_S908N`에서 최신 debug APK 재QA를 완료했다. 샌드박스 내부 Metro 실패 원인은 `127.0.0.1:8081` 바인딩 `EPERM`이었고, Expo CLI가 이를 port in use로 판단해 중단했다. 외부 권한으로 `EXPO_NO_TELEMETRY=1 npx expo start --dev-client --port 8081 --clear`를 실행하고 `adb reverse tcp:8081 tcp:8081`을 설정해 앱 bundle 로드를 복구했다.
- `Android Background Notification Fix` 계획과 후속 실기기 재QA가 완료됐다. `today-reminders-high` HIGH importance channel, Android priority `high`, notification content `sound: true` 기준으로 `QANotify` 종료 5분 전 OS notification이 notification shade와 `dumpsys notification --noredact`에 적재됐다. 기록된 active notification은 `pkg=com.familyproject.todaydidyoufinish`, `channel=today-reminders-high`, title `오늘 다 했니`, text `QANotify 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`, `importance=4`였다.
- `Android Time Picker Safe Area` 계획과 후속 실기기 재QA가 완료됐다. navigation bar bounds는 `[0,2181][1080,2316]`였고, time picker 하단 `취소`/`확인` 액션 bounds는 각각 `[51,2001][855,2130]`, `[883,2001][1029,2130]`로 navigation bar 위에 표시됐다.
- 최신 debug APK 재설치 과정에서 기존 설치본과 debug 서명이 달라 `adb uninstall com.familyproject.todaydidyoufinish` 후 설치했다. 따라서 해당 실기기 로컬 앱 데이터와 권한 상태는 이번 QA 중 초기화됐다.
- `Android Notification Reschedule Cancel Real Device QA`에서 빠른 일정 수정/삭제 중 reminder sync 경합을 발견했다. 수정 저장으로 새 `11:26:59` pending alarm이 만들어진 직후 삭제하면 UI에서는 일정이 사라져도 stale pending alarm이 남았다.
- reminder sync는 이제 `createExpoReminderSyncQueue`로 직렬화되고, stale sync task는 side effect를 남기지 않는다. 수정 후 앱 재실행 기준 stale `e8129d9` alarm은 `alarm_cancelled`로 이동했고 active notification list에는 삭제된 일정 알림이 남지 않았다.
- `Android Preview Background Notification Smoke` 계획은 completed로 이동했다. 최신 `main` 커밋 `20bb4de` 기준 EAS preview build `1476fcb4-843c-42df-adc5-6d8adb897921`를 생성했고, 실기기 `SM_S908N`에 preview standalone APK를 설치했다. `QAPreview` 일정 `16:19 - 16:30` 저장 후 Home/background 상태에서 `오늘 다 했니`, `QAPreview 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.` 알림이 notification shade와 `dumpsys notification --noredact` active record에 표시됐다. record는 `channel=today-reminders-high`, `importance=4`, `flags=AUTO_CANCEL`였고, shade에서 스와이프 dismiss 후 앱 알림은 목록에서 제거됐다.
- `qa/android-preview-background-notification-smoke`의 GitHub PR `#5`는 `main`에 merge됐고, 로컬 `main` 동기화도 완료됐다.
- route helper 수준 계약은 테스트로 고정됐지만, `expo-router` route component 자체를 직접 렌더링하는 테스트는 라이브러리 파싱 제약 때문에 아직 없다.
- 원형 시간판은 시뮬레이터 기준 레이아웃을 한 번 더 정리했지만, 실제 픽셀 기준 스냅샷이나 시각 회귀 테스트는 아직 없다.
- theme 프리셋은 palette/style contract 수준 테스트로는 고정됐지만, 실제 React Native 렌더 스냅샷이나 픽셀 기준 시각 회귀 테스트는 아직 없다.
- Expo 로컬 알림은 코드와 단위 테스트는 붙었지만, 실제 시뮬레이터 QA에서는 시작 알림 배너가 관찰되지 않았다. 권한 초기화 상태나 실제 기기에서의 재검증이 남아 있다.
- 시뮬레이터 내부 전달 기록상으로는 시작/종료 알림이 실제 생성된다. 따라서 현재 불확실성은 `알림이 오지 않는다`보다 `시뮬레이터에서 배너가 눈에 보이느냐`와 `예약 취소/갱신이 예상대로 정리되느냐` 쪽이다.
- 예약 취소/갱신은 `PendingNotifications.plist` 기준으로는 재현됐다. 이제 남은 핵심 공백은 실제 사용자 눈에 보이는 배너 가시성과 실제 기기에서의 체감 QA다.
- Expo 로컬 알림은 시작/종료 5분 전 경로와 helper 테스트가 연결됐고, Android Emulator에서는 foreground 인앱 리마인드와 background OS 알림 적재까지 완료 기록으로 남겼다.
- 현재 템플릿 키트 후속 작업은 없다. 다른 프로젝트에 적용할 때는 `/Users/hun/workspace/하네스시스템구축방법/QUICKSTART.md` 또는 `EXISTING_REPO_APPLY_PLAYBOOK.md`를 사용한다.
- 현재 브랜치/커밋은 git 명령으로 확인한다.

- 현재 브랜치: `git branch --show-current`로 확인
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- Superpowers가 설치된 환경에서는 요구사항 정리, 계획 작성, TDD, 디버깅, 완료 검증에 관련 skill을 사용하되, 이 문서와 `AGENTS.md`의 승인/브랜치 규칙을 우선한다.
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 이번 단계에서는 프리뷰 전용 demo seed와 날짜 key helper를 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립을 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리해, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. 이번 단계에서는 [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)를 추가해 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 문서로 고정했고, `docs/index.md`, `apps/expo/README.md`, `docs/WEB_TO_APP_TRANSITION.md`도 같은 기준으로 연결했다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `screen` 상태, `today -> editor/reflection` 이동 규칙, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 today 복귀`, 리마인드 문구와 회고 대상 제목 조립을 담당하고, [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. 이번 단계에서는 [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)를 추가해 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안을 만들었고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)를 추가해 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성했다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용하며, 실제 앱 셸은 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. 이번 단계에서는 [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)를 추가해 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 문서로 고정했다. 이에 맞춰 실제 앱 셸은 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. 이번 단계에서는 [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)를 추가해 실제 navigator 기본 채택안을 `expo-router`로 고정했고, 그 이유와 도입 순서를 문서화했다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [App.tsx](../apps/expo/App.tsx)는 이제 preview shell이 아니라 `ExpoAppShell`을 기본 진입점으로 사용한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)는 실제 navigator 기본 채택안을 `expo-router`로 고정하고, 그 이유와 도입 순서를 문서화한다. 이번 단계에서는 Expo 공식 경로대로 `expo-router`와 관련 필수 의존성을 설치했고, [expo-router-contract.ts](../apps/expo/src/app-shell/expo-router-contract.ts)로 route/state constants를 추가했다. 또한 `apps/expo/app/` 아래에 `_layout`, `(tabs)/today`, `(tabs)/motivation`, `editor`, `reflection` route draft 파일을 만들고, [expo-route-draft-screen.tsx](../apps/expo/src/components/expo-route-draft-screen.tsx)로 이후 adapter 연결 전 비활성 파일 구조 초안을 확인할 수 있게 정리했다. 현재 기본 런타임은 여전히 `ExpoAppShell`이며, `expo-router` file tree는 다음 단계 어댑터 연결을 위한 초안 상태다.
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: 앱 초기화 브랜치에서 `features/planner/core`와 `features/planner/web`로 `use-planner-view-model` 일부 계산을 실제 분리했다. 현재는 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, 리마인드 창 판정, 회복 강조 상태 판정, `planItems` raw 모델 계산, 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 표시 조립, 관찰 요약/정책 문구와 관찰 패널 표시 모델 조립이 새 계층으로 이동했고, 관찰 로그 append 효과와 액션 기록은 `use-planner-observation-log` hook으로, 계획 토글/삭제/리마인드 닫기/다시 지정 액션은 `use-planner-actions` hook으로, 시간 소스/상태 동기화 효과는 `use-planner-runtime` hook으로 빠진 상태다. 앱 `TodayScreen`은 `use-today-screen-view-model`을 통해 표시 모델을 받고, `use-connected-today-screen`, `ConnectedTodayScreen`, `AppTodayShell`, `/app-today` 엔트리를 통해 실제 store/provider/time source 연결까지 갖춘 상태다. `PlanEditorScreen`은 `use-plan-editor-screen-view-model`, `use-connected-plan-editor-screen`, `AppPlanEditorShell`, `/app-plan-editor` 엔트리까지 추가됐고, `ReflectionScreen`도 `use-reflection-screen-view-model`, `use-connected-reflection-screen`, `AppReflectionShell`, `/app-reflection` 엔트리까지 추가된 상태다. `MotivationScreen`도 `use-motivation-screen-view-model`, `use-connected-motivation-screen`, `AppMotivationShell`, `/app-motivation` 엔트리까지 추가된 상태다. 여기에 `PlannerRecordsStore`, `localPlannerRecordsStore`, `use-planner-record-sync`, `createRecordBackedPlansStore`가 들어가면서 월간 화면은 더 이상 임시 하루 브리지가 아니라 실제 날짜 누적 record store를 읽고, 앱 화면군의 오늘 데이터 읽기 역시 기본적으로 날짜 record store를 우선 사용한다. 이제 `AppFlowShell`과 `/app-flow` 엔트리로 `Today -> PlanEditor -> Reflection -> Motivation` 4화면을 하나의 앱 흐름처럼 이어서 확인할 수 있고, `src/app/globals.css`의 `app-*` 스타일과 앱 화면/배너/시트 클래스, `AppPreviewFrame` 기반 모바일 프리뷰 프레임이 추가돼 브라우저 안에서도 앱처럼 보이는 시각 구조를 갖춘 상태다. 또한 앱 `TodayScreen`에는 `AppCircularPlanner`가 추가돼 웹 MVP의 핵심 표현인 원형 시간판을 앱 상단 핵심 블록으로 다시 유지하고, `AppFlowShell`은 하단 탭형 네비게이션 감각과 활성 화면 표시를 포함한 모바일 탐색 프리뷰까지 갖춘 상태다. 브라우저 프리뷰 다음 단계로 `apps/expo` Expo 런타임 뼈대가 추가됐고, 현재는 `screens/`, `components/`, `providers/` 분리와 함께 `expo-async-plans-store`, `expo-async-planner-records-store`, `expo-start-reminder-provider`, `react-native-svg` 원형 시간판, shared selector 연결뿐 아니라 Expo 전용 상태 훅을 통해 토글·편집·회고·다시 지정 흐름까지 묶는 실제 React Native 앱 구조를 별도 관리하기 시작했다. Expo 전용 `npx tsc --noEmit -p tsconfig.json`은 통과했고, `CI=1 npx expo start --offline` 기준 Metro가 `http://localhost:8081`에서 실제로 기동되는 것까지 확인했다. 추가로 `src/features/planner/core/planner-state-transitions.ts`가 생겨 웹 `use-planner-state`와 Expo `use-expo-planner-state`가 제출, 완료 토글, 회고 저장, 다시 지정 계산을 같은 순수 전이 helper로 공유하기 시작했고, `src/providers/plans/record-backed-shared.ts`와 `src/providers/plans/async-record-backed-plans.ts`가 추가돼 Expo 날짜 누적 저장 경로도 웹 `record-backed` 구조와 더 직접적으로 맞춰지기 시작했다. Expo 상태 훅에서 화면 제어 성격이 강한 `startCreatePlan`, `startEditingPlan`, `cancelEditing`, `dismissReminder`, `dismissEndRecovery`, `startReflection`, `cancelRecovery`, `startRescheduling`은 [use-expo-planner-actions.ts](../apps/expo/src/app-shell/use-expo-planner-actions.ts)로 분리해 `use-expo-planner-state`는 저장과 상태 보관에 더 집중하고, `use-expo-planner-preview-model`은 새 액션 계층을 통해 Expo 프리뷰 흐름을 조립하도록 정리했다. [use-expo-planner-flow.ts](../apps/expo/src/app-shell/use-expo-planner-flow.ts)는 `today/동기` 하단 탭과 `편집/회고` 오버레이 화면을 분리하는 이동 규칙을 맡고, `planId` 기반 대상 plan 조회, `submit/save/cancel 후 오버레이 닫기`, 리마인드 문구와 회고 대상 제목 조립을 담당한다. [expo-planner-screen-registry.tsx](../apps/expo/src/app-shell/expo-planner-screen-registry.tsx)는 `today/editor/reflection/motivation` 화면별 props 매핑과 렌더링 분기를 맡는다. 프리뷰 전용 demo seed와 날짜 key helper는 [expo-planner-preview-seed.ts](../apps/expo/src/app-shell/expo-planner-preview-seed.ts)로, 현재 계획 시간 문구와 오늘 계획 item 표시 모델 조립은 [expo-planner-preview-presentation.ts](../apps/expo/src/app-shell/expo-planner-preview-presentation.ts)로 분리돼, [use-expo-planner-preview-model.ts](../apps/expo/src/app-shell/use-expo-planner-preview-model.ts)는 로딩과 shared selector 연결, state/action 조립에 더 집중하도록 줄였다. [APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md](./APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md)는 preview seed와 실제 앱 부트스트랩 데이터를 분리하는 기준, shared 전이 helper와 Expo actions의 책임 경계, 실제 앱 root가 따라야 할 복구/마이그레이션/빈 상태 초기화 우선순위를 고정한다. [use-expo-app-bootstrap.ts](../apps/expo/src/app-shell/use-expo-app-bootstrap.ts)는 `PlannerRecordMap` 복구 -> legacy today plans 마이그레이션 -> 빈 상태 초기화 순서를 가진 실제 앱 bootstrap hook 초안이고, [use-expo-app-model.ts](../apps/expo/src/app-shell/use-expo-app-model.ts)와 [expo-app-shell.tsx](../apps/expo/src/expo-app-shell.tsx)는 preview seed를 쓰지 않는 실제 앱 root용 셸을 구성한다. [APP_EXPO_NAVIGATION_CONTRACT.md](./APP_EXPO_NAVIGATION_CONTRACT.md)는 실제 navigator 도입 전 route key, tab/overlay 구분, route param shape, 저장 후 복귀 규칙, navigator가 소유하면 안 되는 shared state 범위를 고정한다. [APP_EXPO_NAVIGATOR_DECISION.md](./APP_EXPO_NAVIGATOR_DECISION.md)는 실제 navigator 기본 채택안을 `expo-router`로 고정하고, 그 이유와 도입 순서를 문서화한다. 이번 단계에서는 Expo 공식 경로대로 `expo-router`와 관련 필수 의존성을 설치했고, [expo-router-contract.ts](../apps/expo/src/app-shell/expo-router-contract.ts)로 route/state constants를 추가했다. `apps/expo/package.json`의 main은 이제 `expo-router/entry`를 사용하고, 실제 앱 root는 `apps/expo/app/` route tree가 담당한다. 또한 `apps/expo/app/` 아래 `_layout`, `index`, `(tabs)/_layout`, `(tabs)/today`, `(tabs)/motivation`, `editor`, `reflection` route 파일이 실제 `shell/model` 계층을 읽는 adapter로 연결됐다. 현재 `ExpoAppShell`은 더 이상 기본 엔트리가 아니라, route adapter가 재사용하는 실제 앱 상태 조립 계층으로 남아 있다.

## Current Product State

- Next.js + TypeScript 기반 웹 MVP가 있다.
- 웹 MVP는 최종 상태가 아니라 앱 전환 전 검증 단계다.
- 24시간 원형 플래너가 렌더링된다.
- 현재 시간 포인터와 현재 계획 판정이 동작한다.
- 현재 계획 부채꼴은 비현재 구간보다 더 강하게 강조된다.
- 계획 등록, 삭제, 완료 토글이 구현돼 있다.
- 계획 수정 모드가 구현돼 있다.
- 수정 모드에서는 섹션 제목이 `계획 수정`, 제출 버튼이 `계획 저장`으로 바뀐다.
- 등록 모드의 `계획 추가` 버튼 최소 너비는 `180px`다.
- 계획 폼의 액션 버튼은 입력 필드들과 같은 라인에 정렬된다.
- 선택된 색상 미리보기는 폼 하단 별도 블록으로 유지된다.
- 시간 입력은 자유 분 단위다.
- 기존 일정과 겹치는 시간대는 저장되지 않는다.
- 일정 충돌 메시지는 등록하려는 일정이 아니라 기존 등록 일정의 제목과 시간대로 안내된다.
- 여러 기존 일정과 겹치더라도 첫 번째로 감지된 충돌 일정 1건만 안내된다.
- 색상 선택은 기본 팔레트 드롭다운과 `사용자 지정` 컬러 피커 흐름으로 정리돼 있다.
- 시계 숫자 라벨은 `0, 3, 6, 9, 12, 15, 18, 21`만 보인다.
- `0` 옆에는 달 아이콘, `12` 옆에는 해 아이콘이 표시된다.
- 저장은 현재 브라우저 `localStorage`를 사용한다.
- 저장소 계약(`plans-store`) 뒤에서 웹 `localStorage` 구현을 사용한다.
- 시간 소스는 `PlannerShell`에서 `CircularPlanner`로 주입된다.
- 편집 상태와 저장/검증 호출은 `use-planner-state`로 분리돼 있다.
- 리마인드 provider 계약과 웹 기본 `noop` 구현이 추가돼 있다.
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준이 문서로 정리돼 있다.
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현하기로 정리돼 있다.
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리돼 있다.
- 웹 리마인드 프로토타입은 현재 계획 카드 아래 배너 형태로 연결돼 있고, `지금 완료`와 `닫기` 동작을 가진다.
- 웹 리마인드 배너의 `지금 완료`는 시작 시각 이후에만 보이고, 시작 전에는 `닫기`만 노출된다.
- `오늘 계획` 리스트에서도 시작 전 pending 일정의 완료 버튼은 비활성화된다.
- 종료 시각이 지난 pending 일정은 자동으로 `missed` 상태로 전환된다.
- 일정 데이터에는 재지정 최대 3회를 위한 `rescheduleCount` 메타데이터가 추가돼 있다.
- `missed` 일정에는 `회고`와 `다시 지정` 버튼이 보이고, 회고 메모를 저장할 수 있다.
- `missed` 일정의 `다시 지정`은 같은 날 빈 시간 새 일정으로 생성되며 최대 3회까지만 허용된다.
- 원래 일정 길이를 채울 연속 빈 시간이 없으면 자동 축약이나 자동 분할 없이 다시 지정 실패로 처리된다.
- `다시 지정 불가` 오류는 이제 `길이 그대로는 불가`와 `더 짧게 직접 다시 지정 저장`이라는 다음 행동을 분리해 안내한다.
- 회고가 저장된 `missed` 일정은 리스트에서 `회고 저장됨` 배지와 메모 미리보기로 다시 보인다.
- 재지정 이력은 원본 일정과 후속 일정 모두에서 `다시 지정 n/3` 배지로 확인할 수 있다.
- 상태 버튼과 리마인드/놓침 액션 라벨은 별도 설정 계층과 웹 `localStorage` 저장 구조 뒤에 분리돼 있다.
- 사용자는 웹 MVP에서 `지금`, `대기`, `완료`, `놓침`, `지금 완료`, `회고`, `다시 지정` 문구를 별도 `표시 문구 변경` 버튼으로 여는 팝업에서 수정하고 기본값으로 복원할 수 있다.
- 라벨 커스터마이징 값은 각 항목당 최대 10자까지만 입력 및 저장된다.
- 앱에서도 유지할 라벨 설정 범위는 현재 `current`, `pending`, `done`, `missed`, `completeNow`, `reflection`, `reschedule` 7개 키로 고정돼 있다.
- 회고가 없는 `missed` 일정은 `회고 다시 보기`, 멀리 떨어진 후속 일정은 `다시 지정됨`, 곧 시작하는 후속 일정은 `다시 지정 곧 시작`, 현재 진행 중인 후속 일정은 `회복 진행 중`으로 다시 강조된다.
- `회복 관찰 로그`는 재강조 빈도와 함께 `관찰 더 필요`, `조정 검토`, `우선 유지` 판단도 보여준다.
- 연속 빈 시간이 부족해 다시 지정이 막히면 `다시 지정 불가` 관찰 로그를 남겨 재지정 정책이 너무 엄격한지 나중에 판단할 수 있다.
- `use-planner-view-model`이 추가돼 현재 계획, 요약, 리마인드 화면 상태를 `CircularPlanner` 밖 공용 계층으로 올렸다.
- 웹 리마인드 기본 정책은 `시작 5분 전 ~ 시작 후 10분` 창이며, `닫기`는 현재 리마인드 창에만 적용된다.
- 현재 시각과 리마인드 배너 판정은 10초 간격으로 갱신된다.
- 개발 모드에서는 상단 `관찰 시간 조정` 패널로 테스트 시간을 바꿔 시작 5분 전, 시작 직후, 종료 직전 표본을 빠르게 재현할 수 있다.
- 같은 패널의 `표본용 예정 일정 추가` 버튼으로 현재 시각 이후 첫 30분 빈 슬롯을 관찰용 `pending` 일정으로 즉시 생성할 수 있다.
- 2026-04-30 추가 관찰에서 `저녁` 시작 직후 `리마인드에서 완료` 1회, `운동` 시작 5분 전 `배너 닫기` 1회를 실제 로그로 확보했다.
- 같은 날 `관찰 표본 1`, `관찰 표본 2`, `관찰 표본 3`로 리마인드 누적 `표시 5회 / 닫기 2회 / 완료 2회`와 정책 상태 `우선 유지`를 다시 확인했다.
- `관찰 표본 2` 체인에서는 `시작 5분 전 닫기 -> 종료 직후 missed -> 회고 다시 보기`, `관찰 표본 3` 체인에서는 `시작 리마인드 표시 -> 종료 5분 전 추가 알림 없이 유지 -> 종료 직후 missed -> 회고 다시 보기` 흐름이 자연스럽게 이어졌다.
- 현재까지는 시작 배너가 이미 한 번 노출된 체인에 종료 5분 전 회복 알림을 더하지 않아도 맥락 파악이 가능했고, 종료 직후 회고 진입이 더 자연스럽다는 관찰 근거가 추가됐다.
- 개발 모드에서만 보이는 `종료 전 확인` 실험 배너가 추가됐고, 액션은 `계속 진행` 1개로 제한된다.
- 회복 관찰 로그는 이제 `종료 전 확인` 표시와 `계속 진행` 액션도 함께 누적해 이후 운영 추적에 쓸 수 있다.
- 실제 관찰에서 `관찰 표본 1` 체인 기준 `종료 전 확인 -> 계속 진행 -> 종료 직후 missed -> 회고 다시 보기` 흐름이 자연스럽게 이어지는 것도 확인했다.
- 추가로 `관찰 표본 2` 체인에서도 `시작 리마인드 -> 종료 전 확인 -> 계속 진행 -> 종료 직후 missed -> 회고 다시 보기`가 같은 형태로 반복되는 것을 확인했다.
- 시작 리마인드 누적은 현재 `표시 7회 / 닫기 2회 / 완료 2회` 기준까지 쌓였다.
- 현재 근거상 종료 5분 전 알림을 유지한다면 `계속 진행` 1액션 구성이 가장 가볍고, 회고/다시 지정은 종료 직후 카드 흐름에 맡기는 쪽이 우선 후보다.
- 종료 5분 전 알림 최종 판단은 [END_5_MINUTE_ALERT_DECISION.md](./END_5_MINUTE_ALERT_DECISION.md)에 고정돼 있다.
- 현재 계획 시간 문구, 리스트 상태 라벨, 섹션 제목, 제출 버튼 문구도 `use-planner-view-model`에서 조립한다.
- 최근 5건의 리마인드 표시, 닫기, 완료 이벤트를 `localStorage` 관찰 로그로 남기고 UI에서 지울 수 있다.
- 관찰 패널은 `표시`, `닫기`, `완료`, `닫기 비율`, `완료 전환율` 요약과 간단한 정책 판단 문구를 함께 보여준다.
- 관찰 패널은 현재 기록 범위와 `관찰 더 필요`, `조정 검토`, `우선 유지` 정책 상태도 함께 보여준다.
- 정책 상태는 표본 3회 이상부터 의미를 가지며, `닫기 비율`이 50% 이상이고 완료보다 많을 때 `조정 검토`로 본다.
- 리마인드 관찰 로그는 로드 시 같은 분 단위 동일 이벤트를 정규화해 중복 key 경고를 막는다.
- Vitest 기반 UI 사용자 흐름 테스트가 추가돼 있다.
- Playwright 기반 브라우저 E2E 흐름 테스트가 추가돼 있다.
- 브라우저 테스트는 `build + start` 서버 기준으로 실행되며, 로컬과 CI 모두 시스템 Chrome 채널을 사용한다.
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E가 자동 실행된다.
- GitHub Actions CI는 `actions/checkout@v6`, `actions/setup-node@v6`, `Node 24` 기준으로 맞췄다.
- `.githooks/post-commit`은 `scripts/check-handoff-loop.sh`를 호출해 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고한다.
- `npm run check:handoff-loop`로 같은 점검을 수동 실행할 수 있다.
- `npm run test:handoff-loop`로 점검 스크립트의 대표 경고 시나리오를 검증할 수 있다.
- 앱 전환 방식 비교 기준과 결정 입력 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 초기 앱 클라이언트 최소 범위가 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 현재 문서 기준 우선 권장 앱 전환안은 `Expo + React Native`다.
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리돼 있다.
- 현재 판단상 웹 검증은 방향 고정에 충분한 수준까지 왔고, 다음 단계는 추가 실험보다 앱 구현 준비 문서화에 가깝다.
- 앱 전환 준비 완료 조건은 `docs/WEB_TO_APP_TRANSITION.md`의 `App Transition Readiness` 섹션을 기준으로 본다.
- 앱 구현 순서는 `앱 셸 -> 앱 저장소 provider -> 오늘 화면 핵심 흐름 -> 원형 플래너 또는 대안 표현 -> CRUD/검증 -> 리마인드 -> missed 회복` 순으로 고정한다.
- 앱 화면 트리 초안은 `docs/APP_SCREEN_TREE.md`에 있고, 초기 앱은 탭 확장보다 `오늘 화면` 중심 루트 스택 구조를 권장한다.
- 앱 저장소 후보 비교는 `docs/APP_STORAGE_OPTIONS.md`에 있고, 현재 권고안은 `PlansStore` 계약 유지 + `AsyncStorage` 계열 provider 교체다.
- 월간 동기부여 페이지용 날짜 기반 모델 초안은 `docs/APP_MOTIVATION_DATA_MODEL.md`에 있고, 현재 판단은 `AsyncStorage`로 시작하되 날짜 누적 구조와 `SQLite` 전환 가능성을 동시에 준비하는 쪽이다.
- 월간 동기부여 화면 초안은 `docs/APP_MOTIVATION_SCREEN.md`에 있고, 코드 기반 시안에는 세 번째 기기 프레임으로 같은 화면이 포함돼 있다.
- 월간 selector와 저장 계약 개정 방향은 `docs/APP_SELECTOR_AND_STORE_EVOLUTION.md`에 있고, 현재 기준은 `selector 먼저 고정 -> 저장 계약 점진 개정` 순서다.
- 앱 로컬 알림 초안은 `docs/APP_LOCAL_REMINDER_PLAN.md`에 있고, 현재 기준은 `시작 리마인드만 OS 로컬 알림 후보`, `종료 5분 전은 인앱 계속 진행 배너 유지`다.
- 다만 `실제로 했는데 완료 버튼을 안 눌러 missed가 되는 사례`가 반복되면 종료 5분 전 OS 알림 재검토 조건으로 본다.
- 웹 공용 계층과 앱 전용 UI 경계는 `docs/APP_SHARED_AND_UI_BOUNDARY.md`에 있고, 현재 기준은 `규칙/selector/provider 계약 재사용`, `SVG/UI/로컬 저장 구현/하네스는 플랫폼별 분리`다.
- 앱 타입 초안은 `docs/APP_TYPE_DRAFT.md`에 있고, 현재 기준은 `DailyPlan 유지 + DatedPlanRecord 확장`, `selector 출력 타입 분리`, `TodayPlansStore / PlannerRecordsStore` 이름 초안 고정이다.
- view-model 분리 초안은 `docs/APP_VIEW_MODEL_SPLIT_DRAFT.md`에 있고, 현재 기준은 `core 계산`, `web presentation`, `web diagnostics` 3계층 분리다.
- 앱 초기화 파일 배치안은 `docs/APP_BOOTSTRAP_FILE_LAYOUT.md`에 있고, 현재 기준은 `domains -> providers -> features/planner/core -> web -> app` 구조를 첫 커밋부터 드러내는 것이다.
- `DailyPlan` 점진 이행 계획은 `docs/APP_DAILY_PLAN_MIGRATION.md`에 있고, 현재 기준은 `DatedPlanRecord`를 먼저 추가하고 웹 호환 경로는 유지한 채 selector와 저장 계약부터 이동하는 순서다.
- 현재 코드에는 `src/domains/plans/selectors/*`, `src/providers/plans/async-plans.ts`, `src/providers/reminders/expo-local-reminder-provider.ts`, `src/features/planner/core/*`, `src/features/planner/web/*`, `src/features/planner/app/*` placeholder가 추가돼 앱 초기화 첫 커밋 뼈대가 반영돼 있다.
- `src/features/planner/core/planner-core-view-model.ts`에는 계획 요약 계산, 현재 계획 스냅샷, 토글/재지정 가능 여부, `planItems` raw 모델 계산이, `src/features/planner/core/planner-reminder-rules.ts`에는 시작/종료 직전 리마인드 창 판정이, `src/features/planner/core/planner-recovery-rules.ts`에는 회복 강조 상태와 체인 재지정 계산이, `src/features/planner/core/planner-state-transitions.ts`에는 제출/토글/회고 저장/다시 지정 순수 전이가, `src/features/planner/core/use-planner-runtime.ts`에는 현재 분 계산과 상태/리마인드 provider 동기화 효과가, `src/features/planner/web/planner-web-presentation.ts`에는 상태 라벨/시간 문구/폼 제목/버튼 문구/회복 강조 문구와 `planItems` 표시 모델 조립이, `src/features/planner/web/planner-web-observation.ts`에는 리마인드/회복 관찰 요약, 정책 문구, 관찰 패널 리스트 표시 모델 조립이, `src/ui/planner/use-planner-observation-log.ts`에는 관찰 로그 append 효과와 액션 기록이, `src/ui/planner/use-planner-actions.ts`에는 계획 토글/삭제/리마인드 닫기/다시 지정 액션 조립이 실제로 이동했다.
- `src/features/planner/app/use-today-screen-view-model.ts`는 앱 `TodayScreen`용 summary/current-plan/reminder/plan-item 조립을 담당하고, `src/features/planner/app/use-connected-today-screen.ts`는 실제 `plansStore`, `labelSettingsStore`, `reminderProvider`, `timeSource`를 연결해 액션과 런타임 동기화까지 묶는다. `src/features/planner/app/screens/today-screen.tsx`는 이 결과와 `src/features/planner/app/components/start-reminder-banner.tsx`, `end-recovery-banner.tsx`, `recovery-detail-sheet.tsx`를 연결해 최소 앱 화면 흐름을 렌더링한다. `src/features/planner/app/app-today-shell.tsx`와 `src/app/app-today/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 오늘 화면은 `/app-today`로 직접 확인할 수 있다.
- `src/features/planner/app/use-plan-editor-screen-view-model.ts`는 앱 편집 화면용 제목/버튼/가이던스 조립을 담당하고, `src/features/planner/app/use-connected-plan-editor-screen.ts`는 실제 `plansStore`, `labelSettingsStore`, `timeSource`를 연결해 편집 상태와 제출/취소 액션을 묶는다. `src/features/planner/app/screens/plan-editor-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-plan-editor-shell.tsx`와 `src/app/app-plan-editor/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 편집 화면은 `/app-plan-editor`로 직접 확인할 수 있다.
- `src/features/planner/app/use-reflection-screen-view-model.ts`는 앱 회고 화면용 메모/플레이스홀더/대상 제목 조립을 담당하고, `src/features/planner/app/use-connected-reflection-screen.ts`는 실제 `plansStore`를 연결해 회고 메모 저장/취소 액션을 묶는다. `src/features/planner/app/screens/reflection-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-reflection-shell.tsx`와 `src/app/app-reflection/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 회고 화면은 `/app-reflection`으로 직접 확인할 수 있다.
- `src/features/planner/app/use-motivation-screen-view-model.ts`는 앱 동기부여 화면용 월간 요약/캘린더/회복 지표 조립을 담당하고, `src/features/planner/app/use-connected-motivation-screen.ts`는 현재 저장소의 하루 계획을 오늘 날짜 record map으로 감싸 selector에 연결한다. `src/features/planner/app/screens/motivation-screen.tsx`는 이 결과를 렌더링하고, `src/features/planner/app/app-motivation-shell.tsx`와 `src/app/app-motivation/page.tsx`가 추가돼 현재 리포지터리 안에서 연결형 앱 동기부여 화면은 `/app-motivation`으로 직접 확인할 수 있다.
- `src/providers/plans/planner-records-store.ts`, `src/providers/plans/local-planner-records.ts`, `src/features/planner/app/use-planner-record-sync.ts`가 추가돼 날짜별 `PlannerRecordMap`을 localStorage에 누적 저장한다. 오늘/편집/회고/흐름 화면은 이 record store에 현재 날짜 계획을 계속 동기화하고, `src/features/planner/app/use-connected-motivation-screen.ts`는 이 누적 record store 전체를 읽어 월간 selector에 연결한다.
- `src/providers/plans/record-backed-plans.ts`가 추가돼 앱 shell들은 오늘 날짜의 `PlannerRecordMap`을 우선 읽는 `PlansStore`를 기본값으로 사용한다. 기존 `localPlansStore`는 record store에 해당 날짜 데이터가 아직 없을 때만 fallback으로 읽고, save 시에는 record store와 legacy store를 함께 갱신해 점진 이행 경로를 유지한다.
- `src/features/planner/app/app-flow-shell.tsx`와 `src/app/app-flow/page.tsx`가 추가돼, 현재 리포지터리 안에서 연결형 앱 핵심 흐름은 `/app-flow`로 직접 확인할 수 있다. 이 흐름은 `Today -> PlanEditor -> Reflection -> Motivation`을 하나의 상태에서 이어서 검증하는 최소 앱 네비게이션 셸이다.
- `src/features/planner/app/components/app-preview-frame.tsx`와 각 `/app-*` page 엔트리가 추가돼, 연결형 앱 화면군은 브라우저 안에서도 상태바/노치/기기 프레임을 포함한 모바일 프리뷰로 확인할 수 있다.
- `src/features/planner/app/components/app-circular-planner.tsx`가 추가돼, 연결형 앱 오늘 화면은 카드/리스트만 있는 임시 표현이 아니라 원형 시간판을 상단 핵심 보드로 다시 포함한다.
- `src/features/planner/app/app-flow-shell.tsx`는 이제 단순 버튼 전환이 아니라 하단 탭형 네비게이션, 활성 화면 chip, 프리뷰 홈 인디케이터를 포함한 앱 탐색 프레임으로 정리돼 있다.
- `apps/expo` 아래에 Expo SDK 55 기준 앱 뼈대가 추가됐다. 현재는 `App.tsx`, `src/expo-planner-preview-shell.tsx`, `src/screens/*`, `src/components/expo-flow-tab-bar.tsx`, `src/components/expo-circular-planner.tsx`, `src/app-shell/use-expo-planner-preview-model.ts`, `src/app-shell/use-expo-planner-state.ts`, `src/providers/plans/expo-async-plans-store.ts`, `src/providers/plans/expo-async-planner-records-store.ts`, `src/providers/reminders/expo-start-reminder-provider.ts`, Expo 설정 파일과 README가 있으며, shared selector와 shared planner core를 실제로 읽고 Expo 전용 상태 전이까지 붙이기 시작한 상태다. 특히 Expo plans store는 `src/providers/plans/async-record-backed-plans.ts`를 통해 웹 `record-backed` 흐름과 같은 날짜 브리지 구조를 공유한다. 루트 Next.js 타입체크와 충돌하지 않도록 루트 `tsconfig.json`에서는 제외한다.
- 자정 넘김 일정은 이제 `종료 시간이 시작 시간보다 이르면 다음 날 종료`로 해석한다. 예를 들어 `23`와 `4`를 입력하면 `23:00 ~ 다음 날 04:00`으로 저장되고, 현재 계획 판정/리마인드 판정/충돌 검사도 같은 규칙을 따른다. Expo 편집 화면은 필드별 오류 문구와 첫 오류 필드 포커스 이동까지 지원한다.
- 코드 기반 앱 시안은 `src/app/app-mockup/page.tsx`와 `src/app/globals.css`의 `mockup-*` 스타일로 관리한다.
- 연결형 앱 화면군은 `src/app/globals.css`의 `app-*` 스타일을 사용해 공통 카드, 배너, 시트, 통계 카드, 캘린더, 플로우 탭 레이아웃을 공유한다.
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영돼 있다.
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영돼 있다.

## Working Rules

- 구현 변경은 사용자가 명시적으로 `진행하자`, `적용해`, `수정해`, `브랜치 만들어서 진행해`라고 말했을 때만 수행한다.
- 그 전에는 분석, 원인 파악, 제안까지만 한다.
- 새 실제 작업은 `main`에서 직접 하지 않고, 사용자가 승인하면 작업 브랜치를 만든다.
- `main` 머지는 사용자가 명시적으로 요청할 때만 한다.
- PR을 생성하거나 갱신할 때 title/body/요약 설명은 한글로 작성한다.
- 커밋 후에는 `docs/HANDOFF.md`의 최근 반영 작업, 현재 상태, 다음 작업을 검토하고 갱신한다.
- 커밋 해시는 문서에 고정하지 말고 git 명령으로 확인하게 유지한다.
- 리포지터리 밖에만 있는 지식은 없는 것으로 간주한다.

## Suggested Next Work

1. route helper 수준 계약은 테스트로 고정됐지만, `expo-router` route component 자체 또는 route adapter 경계 테스트가 아직 `main`에 없다.
2. 원형 시간판/테마 프리셋은 실제 React Native 렌더 스냅샷이나 픽셀 기준 시각 회귀 테스트가 아직 없다.
3. 사용자가 `밀린 업무 진행하자`라고 하면 Play Developer 계정 생성과 Play Console 릴리스 대기열을 재개.

## Handoff Prompt

아래 문구를 새 세션에 그대로 넣으면 된다.

```text
이 프로젝트는 하네스 엔지니어링 방식으로 진행 중이다.

먼저 아래 파일을 읽고 현재 상태를 요약해라.
1. AGENTS.md
2. README.md
3. ARCHITECTURE.md
4. docs/index.md
5. docs/MVP_SCOPE.md
6. docs/TECH_STACK.md
7. docs/WEB_TO_APP_TRANSITION.md
8. docs/PLANS.md
9. docs/exec-plans/completed/2026-05-08-harness-template-operations-update.md
10. docs/exec-plans/completed/2026-04-17-harness-template-kit.md
11. docs/exec-plans/completed/2026-04-24-app-transition-decision.md
12. docs/exec-plans/completed/2026-04-28-missed-plan-recovery.md
13. docs/exec-plans/completed/2026-04-23-plan-editing.md
14. apps/expo/src/screens/today-screen.tsx
15. apps/expo/src/components/expo-circular-planner.tsx

현재 기준:
- branch: `git branch --show-current`
- commit: `git rev-parse --short HEAD`
- Superpowers: 설치된 경우 관련 skill을 먼저 검토
- latest progress: Expo mobile shell and planner policy work pushed; harness template operations updated and completed exec plans moved out of active

현재 구현 상태:
- Next.js + TypeScript 기반 웹 MVP
- 웹 MVP는 앱 전환 전 검증 단계
- 24시간 원형 플래너
- 계획 등록/삭제/완료 토글/수정
- 현재 계획 강조 강화
- 계획 폼 액션 버튼 같은 라인 정렬
- 색상 미리보기 하단 별도 블록 유지
- 자유 분 단위 시간 입력
- 시간 겹침 일정 저장 차단
- 충돌 메시지는 기존 등록 일정 제목/시간 기준
- 첫 충돌 일정 1건만 안내
- 기본 팔레트 + 사용자 지정 색상 흐름
- 3시간 단위 숫자 라벨
- 0/12 라벨 보조 아이콘
- localStorage 저장
- 저장소 계약 뒤에서 웹 localStorage 구현 사용
- 시간 소스는 PlannerShell에서 CircularPlanner로 주입
- 편집 상태와 저장/검증 호출은 use-planner-state로 분리
- 리마인드 provider 계약과 웹 기본 noop 구현 추가
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준 정리
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리
- 웹 리마인드 프로토타입은 현재 계획 카드 아래 배너 형태로 연결되고, `지금 완료`와 `닫기` 동작을 가진다
- 웹 리마인드 배너의 `지금 완료`는 시작 시각 이후에만 보이고, 시작 전에는 `닫기`만 노출된다
- `오늘 계획` 리스트에서도 시작 전 pending 일정의 완료 버튼은 비활성화된다
- 종료 시각이 지난 pending 일정은 자동으로 `missed` 상태로 전환된다
- 일정 데이터에는 재지정 최대 3회를 위한 `rescheduleCount` 메타데이터가 추가돼 있다
- `missed` 일정에는 `회고`와 `다시 지정` 버튼이 보이고, 회고 메모를 저장할 수 있다
- `missed` 일정의 `다시 지정`은 같은 날 빈 시간 새 일정으로 생성되며 최대 3회까지만 허용된다
- 원래 일정 길이를 채울 연속 빈 시간이 없으면 자동 축약이나 자동 분할 없이 다시 지정 실패로 처리된다
- 회고가 저장된 `missed` 일정은 리스트에서 `회고 저장됨` 배지와 메모 미리보기로 다시 보인다
- 재지정 이력은 원본 일정과 후속 일정 모두에서 `다시 지정 n/3` 배지로 확인할 수 있다
- 상태 버튼과 리마인드/놓침 액션 라벨은 별도 설정 계층과 웹 localStorage 저장 구조 뒤에 분리돼 있다
- 사용자는 웹 MVP에서 `지금`, `대기`, `완료`, `놓침`, `지금 완료`, `회고`, `다시 지정` 문구를 직접 수정하고 기본값으로 복원할 수 있다
- 앱에서도 유지할 라벨 설정 범위는 현재 `current`, `pending`, `done`, `missed`, `completeNow`, `reflection`, `reschedule` 7개 키로 고정돼 있다
- 회고가 없는 `missed` 일정은 `회고 다시 보기`, 멀리 떨어진 후속 일정은 `다시 지정됨`, 곧 시작하는 후속 일정은 `다시 지정 곧 시작`, 현재 진행 중인 후속 일정은 `회복 진행 중`으로 다시 강조된다
- `회복 관찰 로그`는 재강조 빈도와 함께 `관찰 더 필요`, `조정 검토`, `우선 유지` 판단도 보여준다
- 연속 빈 시간이 부족해 다시 지정이 막히면 `다시 지정 불가` 관찰 로그를 남겨 재지정 정책이 너무 엄격한지 나중에 판단할 수 있다
- `use-planner-view-model`이 추가돼 현재 계획, 요약, 리마인드 화면 상태를 `CircularPlanner` 밖 공용 계층으로 올림
- 웹 리마인드 기본 정책은 `시작 5분 전 ~ 시작 후 10분` 창이며, `닫기`는 현재 리마인드 창에만 적용
- 현재 시각과 리마인드 배너 판정은 10초 간격으로 갱신
- 현재 계획 시간 문구, 리스트 상태 라벨, 섹션 제목, 제출 버튼 문구도 `use-planner-view-model`에서 조립
- 최근 5건의 리마인드 표시, 닫기, 완료 이벤트를 `localStorage` 관찰 로그로 남기고 UI에서 지울 수 있음
- 관찰 패널은 `표시`, `닫기`, `완료`, `닫기 비율`, `완료 전환율` 요약과 간단한 정책 판단 문구를 함께 보여줌
- 관찰 패널은 현재 기록 범위와 `관찰 더 필요`, `조정 검토`, `우선 유지` 정책 상태도 함께 보여줌
- 정책 상태는 표본 3회 이상부터 의미를 가지며, `닫기 비율`이 50% 이상이고 완료보다 많을 때 `조정 검토`로 봄
- 리마인드 관찰 로그는 로드 시 같은 분 단위 동일 이벤트를 정규화해 중복 key 경고를 막음
- Vitest UI 사용자 흐름 테스트 추가
- Playwright 브라우저 E2E 테스트 추가
- E2E는 `build + start` 기준, 로컬과 CI 모두 시스템 Chrome 채널
- 계획 편집 흐름의 기본 테스트 범위는 실행 계획 문서에 정리됨
- 테스트 확장 조건과 CI 실패 시 문서 갱신 기준은 실행 계획 문서에 정리됨
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E 자동 실행
- post-commit 훅이 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고
- `npm run check:handoff-loop`로 같은 점검을 수동 실행 가능
- `npm run test:handoff-loop`로 대표 경고 시나리오 검증 가능
- 앱 전환 방식 비교 기준과 결정 입력 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 초기 앱 클라이언트 최소 범위는 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 현재 우선 권장 앱 전환안은 `Expo + React Native`
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리됨
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영됨
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영됨

중요 규칙:
- 구현 변경은 내가 명시적으로 진행하라고 할 때만 수행해라.
- 그 전에는 분석과 제안까지만 해라.
- 새 실제 작업은 브랜치를 만들어서 진행하고, main 머지는 내가 요청할 때만 해라.
- 커밋 후에는 docs/HANDOFF.md를 갱신하되, 커밋 해시는 git 명령으로 확인하게 유지해라.
- Superpowers가 설치되어 있으면 brainstorming, writing-plans, test-driven-development, systematic-debugging, verification-before-completion을 이 리포지터리 문서 경로에 맞춰 사용해라.
- CI 실패가 문서/계획 불일치와 연결되면 HANDOFF와 실행 계획도 함께 갱신해라.

먼저 현재 상태를 요약하고, 내가 승인할 때만 실제 수정을 시작해라.
```
