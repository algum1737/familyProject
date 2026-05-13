# Android Preview Standalone QA

## Goal

최신 `main` 기준 Expo Android preview APK를 EAS로 다시 생성하고, Metro 연결 없이 Android Emulator에서 standalone 내부 배포 경로가 실행되는지 확인한다.

## Scope

- `qa/android-preview-standalone` 브랜치에서 진행한다.
- EAS Android `preview` profile build를 실행한다.
- 생성된 APK를 로컬에 내려받는다.
- Android Emulator에 기존 패키지를 제거한 뒤 APK를 설치한다.
- Metro 연결 없이 앱이 실행되는지 확인한다.
- Today 렌더링, 계획 생성/삭제, 알림 권한, foreground/background 알림 smoke를 가능한 범위에서 확인한다.
- 완료 범위와 검증 결과를 문서화한다.

## Out Of Scope

- Google Play Console 계정 생성 및 app record 생성
- production `.aab` 제출
- iOS build 또는 iOS Simulator QA
- 제품 UX 변경

## Assumptions

- 사용자는 Android 배포 우선순위를 유지한다.
- Play Console/production 접근은 최후순위 릴리스 대기열로 유지한다.
- Android Emulator는 사용자가 이전에 구성한 `/Users/hun/Library/Android/sdk` 경로를 사용한다.

## Pre-flight checks

- `git status --short`
- `git branch --show-current`
- `npx eas-cli whoami`
- Android Emulator 연결 확인: `/Users/hun/Library/Android/sdk/platform-tools/adb devices`

## Steps

1. 현재 브랜치와 작업 트리 상태를 확인한다.
2. EAS 로그인 상태를 확인한다.
3. Android Emulator 연결 상태를 확인한다.
4. `apps/expo`에서 Android preview build를 실행한다.
5. build 완료 후 APK URL 또는 artifact 경로를 확인한다.
6. APK를 `/private/tmp/today-did-you-finish-preview-latest.apk`로 내려받는다.
7. 기존 `com.familyproject.todaydidyoufinish` 앱을 제거하고 새 APK를 설치한다.
8. Metro 없이 앱을 실행한다.
9. Today 화면과 기본 플로우 smoke를 확인한다.
10. 알림 권한과 알림 동작 smoke를 가능한 범위에서 확인한다.
11. 결과를 completed plan, `docs/HANDOFF.md`, `docs/index.md`에 기록한다.

## Automated tests

- `bash scripts/validate-docs.sh`
- 필요 시 `npm run typecheck`
- 필요 시 `npm test`

## Manual/Runtime QA

- Android Emulator standalone APK 실행
- Today 화면 렌더링
- 계획 생성/삭제 smoke
- 알림 권한 prompt 또는 권한 상태 확인
- foreground/background 알림 smoke

## Skipped/Not Run

- EAS build가 외부 서비스 오류로 실패하면 artifact 설치 QA는 미실행으로 기록한다.
- Emulator가 연결되지 않으면 설치/런타임 QA는 미실행으로 기록한다.
- 알림 smoke는 실제 OS 예약/전달 시간이 필요한 경우 실행 범위와 관찰 증거를 분리해 기록한다.

## Open Work

- 완료 범위와 검증 결과를 completed plan, handoff, index에 반영한다.

## Completion

- 완료일: 2026-05-13
- `qa/android-preview-standalone` 브랜치에서 진행했다.
- EAS 로그인 계정은 `algumhun / algum1737@gmail.com`으로 확인했다.
- Android Emulator는 `emulator-5554`로 연결됐다.
- `npx eas-cli build --platform android --profile preview --non-interactive`로 최신 `main` merge commit 기준 Android preview build를 실행했다.
- EAS build id는 `0a64265c-2fd7-493a-9c88-d574e91e52fd`이고, 상태는 `FINISHED`다.
- APK artifact는 `https://expo.dev/artifacts/eas/2hqw9Bog46Ch4h5YitU83v.apk`이며 `/private/tmp/today-did-you-finish-preview-latest.apk`로 내려받았다.
- APK 크기는 약 82MB였다.
- 기존 `com.familyproject.todaydidyoufinish` 패키지를 제거한 뒤 최신 preview APK를 설치했다.
- 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`이었다.
- Metro reverse 연결 없이 앱을 실행했다. `adb reverse --list`는 비어 있었다.
- foreground Activity는 `com.familyproject.todaydidyoufinish/.MainActivity`로 확인됐다.
- 첫 실행에서 알림 권한 프롬프트가 표시됐고 `허용`을 눌렀다.
- 알림 app op는 `Default mode: allow`로 확인됐다.
- Today 화면이 standalone APK에서 정상 렌더링됐다.
- QA 계획을 생성했고, 원형 시간판/현재 계획/오늘 계획 목록에 반영되는 것을 확인했다.
- QA 계획 생성 시 foreground 인앱 리마인드가 표시됐다.
- 생성한 QA 계획은 `삭제` 버튼으로 제거했고, 오늘 계획 목록이 비어 있는 상태로 복구되는 것을 확인했다.
- `adb input text QAStandalone`은 한글 IME 환경에서 제목이 깨져 표시됐다. 이는 ADB 입력 방식의 한계로 보고, 앱 저장/삭제 smoke 자체는 통과로 판단했다.

## Validation Result

- `git status --short` 통과
- `git branch --show-current` 확인: `qa/android-preview-standalone`
- `npx eas-cli whoami` 통과
- `/Users/hun/Library/Android/sdk/platform-tools/adb devices` 통과: `emulator-5554 device`
- EAS Android preview build 통과: `0a64265c-2fd7-493a-9c88-d574e91e52fd`
- APK download 통과: `/private/tmp/today-did-you-finish-preview-latest.apk`
- APK install 통과
- standalone launch 통과
- Today render smoke 통과
- notification permission prompt/allow smoke 통과
- plan create/delete smoke 통과
- foreground in-app reminder smoke 통과

## Not Run

- background/home 상태 OS 알림 전달 smoke는 이번 런에서 완료하지 않았다. 현재 UI 기본 시간 선택으로는 짧은 세션 안에 종료 5분 전 또는 시작 5분 전 OS 알림 시점을 안정적으로 맞추기 어렵고, 시간 조작은 QA 증거를 왜곡할 수 있어 미실행으로 기록한다.
