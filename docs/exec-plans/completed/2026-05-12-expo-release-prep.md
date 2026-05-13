# Expo Release Prep

## Goal

Expo 앱을 배포 가능한 상태로 정리하기 위해 빌드 프로필, 릴리스 체크리스트, 검증 기준을 문서와 설정으로 고정한다.

## Scope

- `apps/expo`의 현재 앱 식별자와 배포 설정 공백 확인
- `eas.json` 빌드 프로필 추가
- Expo 릴리스 체크리스트 문서 추가
- 현재 진행 상태를 `docs/index.md`, `docs/HANDOFF.md`에 반영

## Out Of Scope

- 실제 App Store Connect 제출
- 실제 Google Play 제출
- 실제 iPhone 또는 Android 물리 기기 알림 QA 완료
- 스토어 메타데이터 작성과 스크린샷 제작

## Assumptions

- 현재 작업 브랜치는 `feature/expo-release-prep`를 유지한다.
- working tree의 기존 `docs/HANDOFF.md` 변경은 이 작업 범위 안에서 보존하고 갱신한다.
- 현재 릴리스 준비의 목적은 `dev / preview / production` 빌드 경로와 운영 체크리스트를 고정하는 것이다.
- EAS CLI 자체 설치나 로그인 상태는 이 문서 작업에서 보장하지 않는다.

## Steps

1. Expo 앱 설정과 릴리스 관련 공백을 확인한다.
2. `apps/expo/eas.json`에 기본 빌드 프로필을 추가한다.
3. 릴리스 체크리스트 문서를 작성해 자격증명, 환경, QA, 제출 전제 조건을 고정한다.
4. `docs/index.md`와 `docs/HANDOFF.md`에 진행 중 작업 상태를 반영한다.
5. 문서 검증과 설정 파일 파싱 검증을 수행한다.

## Validation

- `apps/expo/eas.json`이 유효한 JSON이어야 한다.
- 릴리스 체크리스트 문서가 실제 현재 상태와 남은 리스크를 구분해 기록해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Deferred / Release Backlog

- 현재 제품 방향은 출시보다 앱 완성도와 QA를 우선한다.
- 실제 기기 알림 배너 QA는 iPhone 또는 Android 물리 기기 기준으로 후속 확인이 필요하다.
- Android production build와 Google Play Console 제출 준비는 최후순위 릴리스 대기열로 내린다.
- 사용자가 `밀린 업무 진행하자`라고 하면 Play Developer 계정 유형 선택/계정 생성, package name app record 확보, 공개 privacy policy URL 배포, Contact email 확정, App content/Data Safety 입력, Play App Signing 수락, internal/closed testing release 생성, production access 신청을 순서대로 재개한다.
- Android production build 전에는 [APP_EXPO_RELEASE_CHECKLIST.md](/Users/hun/workspace/familyProject/docs/APP_EXPO_RELEASE_CHECKLIST.md)의 `Android Production Build Readiness Plan` preflight를 먼저 실행한다.
- Play Console 제출 blocker 후보는 package ownership, Android credential/App Signing 정책, service account 연결, Data safety/permission declaration, store metadata/screenshot 준비다.

## Progress

- `apps/expo/eas.json`을 추가해 `development`, `preview`, `production` build profile을 고정했다.
- [APP_EXPO_RELEASE_CHECKLIST.md](/Users/hun/workspace/familyProject/docs/APP_EXPO_RELEASE_CHECKLIST.md)를 추가해 app config, build profile, QA gate, store readiness, post-build check를 정리했다.
- [docs/index.md](/Users/hun/workspace/familyProject/docs/index.md), [docs/HANDOFF.md](/Users/hun/workspace/familyProject/docs/HANDOFF.md), [apps/expo/README.md](/Users/hun/workspace/familyProject/apps/expo/README.md)에 현재 릴리스 준비 상태를 반영했다.
- `apps/expo`에서 `npx expo config --type public`으로 현재 Expo 공개 설정을 확인했다.
- 브라우저 로그인 경로로 Expo 계정 인증을 완료했고, `npx eas-cli whoami`가 `algumhun / algum1737@gmail.com`을 반환했다.
- 로그인 후 `npx eas-cli build --platform ios --profile preview --non-interactive`를 다시 시도했고, 다음 blocker가 `EAS project not configured`임을 확인했다.
- `npx eas-cli init --non-interactive --force`로 `@algumhun/today-did-you-finish` EAS project를 생성했고, `apps/expo/app.json`에 `owner`와 `extra.eas.projectId`가 반영됐다.
- project link 후 `npx eas-cli build --platform ios --profile preview --non-interactive`를 다시 시도했고, 다음 blocker가 `iOS internal distribution credential missing in non-interactive mode`임을 확인했다.
- 같은 build 시도에서 `preview` profile의 `channel`은 `expo-updates` 미설치 상태라 경고가 출력됐다.
- 사용자 우선순위에 맞춰 릴리스 경로를 iOS에서 Android로 전환했다.
- `npx eas-cli build --platform android --profile preview --non-interactive`는 Expo remote keystore 생성, 업로드, fingerprint 계산까지 통과했다.
- 같은 Android build는 EAS server의 `Install dependencies` 단계에서 `Unknown error`로 실패했다. build id는 `af3052a3-4f1a-4cc4-b96b-cc323cd2c458`다.
- `/private/tmp/expo-clean2`에서 클린 `npm ci`를 재현한 결과, `react@19.2.0`과 전이 의존성 `react-dom@19.2.5` 사이의 peer dependency 충돌로 `ERESOLVE`가 발생함을 확인했다.
- [package.json](/Users/hun/workspace/familyProject/apps/expo/package.json)에 `react-dom: 19.2.0`을 명시해 Expo 앱의 React DOM 버전을 React와 맞췄다.
- `apps/expo`에서 `npm install`로 lockfile을 갱신했다.
- `/private/tmp/expo-clean3` 기준 클린 `npm ci`가 통과해 `Install dependencies` blocker가 로컬 재현 기준으로 해소됐음을 확인했다.
- 수정 후 `npx eas-cli build --platform android --profile preview --non-interactive`를 다시 실행했고, 새 build id `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`로 완료됐다.
- 같은 build는 internal distribution APK를 산출했고, `applicationArchiveUrl`은 `https://expo.dev/artifacts/eas/aVBekwXjJrBsTPWxgkZvRQ.apk`다.
- EAS preview APK를 `/private/tmp/today-did-you-finish-preview.apk`로 내려받아 Android Emulator에 설치했다.
- 기존 dev build와는 서명이 달라 `INSTALL_FAILED_UPDATE_INCOMPATIBLE`가 발생했으므로, 기존 `com.familyproject.todaydidyoufinish` 패키지를 제거한 뒤 preview APK를 새로 설치했다.
- preview APK 첫 실행 시 알림 권한 요청 다이얼로그가 정상 노출됐고, 허용 후 `com.familyproject.todaydidyoufinish/.MainActivity`가 resumed 상태로 올라오는 것을 확인했다.
- `expo-updates`를 아직 쓰지 않으므로 `apps/expo/eas.json`의 `development`, `preview`, `production` profile에서 `channel` 설정을 제거했다.
- Worker A가 Android production build readiness를 점검했고, 실제 production build는 실행하지 않았다.
- [APP_EXPO_RELEASE_CHECKLIST.md](/Users/hun/workspace/familyProject/docs/APP_EXPO_RELEASE_CHECKLIST.md)에 Android production preflight commands, expected blockers, production build/submit command 후보, validation steps를 추가했다.
- 점검 기준 현재 Android native `release` build type은 debug signingConfig를 가리키는 prebuild 기본값이므로, Play 제출물은 로컬 Gradle release 산출물이 아니라 EAS remote Android credential로 서명된 production build를 기준으로 삼는다.
- native manifest의 `SYSTEM_ALERT_WINDOW`, legacy external storage permission은 Play Console permission/data safety 검토 전까지 Android production 제출 blocker 후보로 추적한다.
- Play Console용 privacy policy 페이지를 [src/app/privacy/page.tsx](/Users/hun/workspace/familyProject/src/app/privacy/page.tsx)에 추가했고, 실제 제출 URL은 웹 배포 도메인이 확정된 뒤 `https://<domain>/privacy` 형태로 완성한다.
- Play Console 1차 확인 항목은 계정 유형, `com.familyproject.todaydidyoufinish` 앱 레코드 생성 가능 여부, privacy policy 공개 URL 준비 여부로 분리했다.
- 루트 `npm run typecheck`를 막던 `tests/expo-router-route-actions.test.ts`의 `startRescheduling` mock 반환 타입을 리터럴 union으로 고정했다.
- Chrome에서 `play.google.com/console`에 접속해 현재 로그인 계정이 Play Console dashboard가 아니라 `Play Console 개발자 계정 만들기`의 계정 유형 선택 화면으로 이동하는 것을 확인했다.

## Validation Result

- `node -e "JSON.parse(require('fs').readFileSync('apps/expo/eas.json','utf8'))"`로 `apps/expo/eas.json` 파싱이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.
- `npx expo config --type public` 기준 `slug`, `version`, iOS bundle identifier, Android package가 예상값으로 출력됐다.
- `npx eas-cli whoami`가 현재 로그인 계정 `algumhun / algum1737@gmail.com`을 출력했다.
- `npx eas-cli init --non-interactive --force`로 EAS project 생성과 app link가 완료됐다.
- `npx eas-cli build --platform ios --profile preview --non-interactive`는 iOS internal distribution credential setup이 non-interactive 모드에서는 불가해 중단됐다.
- `npx eas-cli build --platform android --profile preview --non-interactive`는 remote Android credential 생성까지 진행됐고, 실패 지점이 EAS server-side `Install dependencies` 단계임을 확인했다.
- `/private/tmp/expo-clean2`에서 `npm ci`를 재현해 EAS failure 원인이 `react-dom` peer dependency 충돌임을 확인했다.
- `react-dom: 19.2.0` 추가 후 `/private/tmp/expo-clean3`에서 클린 `npm ci`가 통과했다.
- 새 Android `preview` build `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`이며 APK 산출물 URL이 발급됐다.
- preview APK를 Android Emulator에 설치했고, 알림 권한 요청과 메인 Today 화면 기동까지 확인했다.
- `apps/expo/eas.json`에서 `channel` 설정을 제거해 `expo-updates` 미설치 상태의 EAS channel 경고 원인을 해소했다.
- Worker A readiness 점검에서 `node -e "JSON.parse(...)"`로 `apps/expo/app.json`, `apps/expo/eas.json`, `apps/expo/package.json` 파싱이 통과했다.
- Worker A readiness 점검에서 `npx expo config --type public` 출력 기준 `android.package: com.familyproject.todaydidyoufinish`, `owner: algumhun`, `extra.eas.projectId: c7885bdb-b444-4aa5-9e24-7f341b68234a`를 확인했다.
- Worker A readiness 점검에서 `bash scripts/validate-docs.sh`가 통과했다.
- `bash scripts/validate-docs.sh`가 다시 통과했다.
- `npm run typecheck`가 통과했다.

## Completion

Completed. 릴리스 준비의 문서/설정 뼈대, Expo 계정 로그인, EAS project 연결, Android `preview` cloud build 성공, Emulator 설치 검증, EAS channel 경고 정리, Play Console 제출 초안, privacy policy 페이지, 루트 typecheck 복구까지 완료했다. 현재 제품 방향은 출시보다 앱 완성도와 QA를 우선하므로 Play Developer 계정 생성, app record 생성 가능 여부 확인, production `.aab` build, Play Console 제출은 최후순위 릴리스 대기열로 내렸다. 다음 우선순위는 Android 알림 foreground/background 수신 QA와 실제 사용자 가시성 증거 확보다. iOS credential setup도 후순위로 남긴다.
