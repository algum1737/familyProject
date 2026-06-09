# App Expo Release Checklist

## Purpose

이 문서는 `오늘 다 했니` Expo 앱을 EAS 기준으로 빌드하고 스토어 제출 전 상태를 점검할 때 필요한 최소 체크리스트를 고정한다.

현재 목적은 `릴리스 준비 기준 정리`이며, 실제 제출 완료 기록은 별도 exec plan 또는 handoff에 남긴다.

## Current Baseline

- 현재 릴리스 우선순위는 iOS보다 Android 내부 배포 확인이다.
- Play Console 제출 준비 기준일은 `2026-05-13`이며, Google Play의 현재 Android 제출 기준은 새 앱/업데이트가 Android 15(API 35) 이상을 target 해야 한다.
- 앱 식별자는 [app.json](/Users/hun/workspace/familyProject/apps/expo/app.json)에 고정돼 있다.
  - iOS bundle identifier: `com.familyproject.todaydidyoufinish`
  - Android package: `com.familyproject.todaydidyoufinish`
- EAS project는 `@algumhun/today-did-you-finish`로 생성됐고, `projectId`는 [app.json](/Users/hun/workspace/familyProject/apps/expo/app.json)의 `expo.extra.eas.projectId`에 기록돼 있다.
- Expo 공통 아이콘은 [app-icon-1024.png](/Users/hun/workspace/familyProject/apps/expo/assets/app-icon-1024.png)을 사용한다.
- EAS build profile은 [eas.json](/Users/hun/workspace/familyProject/apps/expo/eas.json)에 `development`, `preview`, `production`으로 정의돼 있다.
- Play Console 입력 준비값은 [APP_PLAY_CONSOLE_SUBMISSION_PREP.md](/Users/hun/workspace/familyProject/docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md)에 별도로 정리돼 있다.
- Play Console용 privacy policy 페이지는 [src/app/privacy/page.tsx](/Users/hun/workspace/familyProject/src/app/privacy/page.tsx)에 준비돼 있으며, 실제 제출 URL은 웹 배포 도메인 확정 후 `https://<domain>/privacy`로 완성한다.
- 시뮬레이터 알림 QA 운영 기준은 [APP_REMINDER_SIMULATOR_QA.md](/Users/hun/workspace/familyProject/docs/APP_REMINDER_SIMULATOR_QA.md)에 정리돼 있다.

## Build Profiles

- `development`
  - 용도: 로컬 개발용 dev client 빌드
  - 특징: `developmentClient: true`, `distribution: internal`
- `preview`
  - 용도: QA 공유용 내부 배포 빌드
  - 특징: `distribution: internal`
  - 현재 주의점: `expo-updates`를 아직 쓰지 않으므로 EAS `channel` 설정은 제거된 상태다.
  - 현재 상태: `react-dom`을 `19.2.0`으로 명시해 EAS `npm ci` peer dependency 충돌을 해소했고, Android 재시도 build `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`로 완료됐다.
- `production`
  - 용도: 스토어 제출 직전 release 빌드
  - 특징: `autoIncrement: true`
  - Android 기대 산출물: Google Play 제출용 `.aab`

## Prerequisites

1. `apps/expo`에서 의존성이 설치돼 있어야 한다.
2. EAS CLI 로그인 상태가 준비돼 있어야 한다.
3. Apple Developer / Google Play Console 접근 권한이 준비돼 있어야 한다.
4. 스토어 제출에 사용할 앱 이름, 설명, 개인정보 처리 관련 문구, 카테고리 초안이 준비돼 있어야 한다.

## Google Play Console Submission Readiness

### 1. Account And Access Prerequisites

- Google Play Developer account가 생성돼 있고 결제/신원/2단계 인증 등 계정 필수 설정이 완료돼 있어야 한다.
- 작업 계정에 최소한 앱 생성, 테스트 트랙 릴리스 생성, App content 작성, Play App Signing 수락, production 접근 요청/릴리스 권한이 있어야 한다.
- 계정 유형을 확인한다. `2023-11-13` 이후 생성된 개인 개발자 계정이면 production 배포 전 closed test에 `12명 이상` tester가 `14일 연속` opt-in 된 뒤 production access 신청이 필요하다.
- 자동 제출을 쓰려면 Google Play Android Developer API와 service account JSON key를 준비한다. 수동 업로드만 할 경우 이 키는 필수는 아니다.

### 2. App Record And Store Listing

- Play Console에서 `Create app`을 실행한다.
  - App name: `오늘 다 했니`
  - Default language: 한국어 또는 실제 1차 listing 언어
  - App/game: App
  - Free/paid: 초기 무료 배포 여부 결정 필요
  - Contact email: 사용자 문의 수신 가능한 주소
  - Declarations: Developer Program Policies, US export laws, Play App Signing Terms of Service 확인
- Package name은 `com.familyproject.todaydidyoufinish`로 고정한다. 한 번 업로드한 package name은 다른 앱으로 재사용하거나 변경할 수 없으므로 업로드 전 최종 확인한다.
- Main store listing 초안을 준비한다.
  - App name은 Google Play 표시 이름 30자 제한 안에 맞춘다.
  - Short description은 80자 제한 안에 맞춘다.
  - Full description은 4000자 제한 안에 맞춘다.
  - Category/tags, contact email, 선택 contact website/support URL을 정한다.
  - Phone/tablet screenshot, app icon, feature graphic 등 Play Console에서 요구하는 graphic asset을 준비한다.

### 3. App Content, Privacy, And Data Safety

- Privacy policy URL을 먼저 준비한다. 앱이 현재 로컬 저장만 쓰더라도 Google Play Data Safety form과 개인정보 처리방침의 설명이 서로 일치해야 한다.
- App content에서 다음 항목을 작성한다.
  - Privacy policy
  - Ads: 현재 광고 SDK가 없으면 `No ads` 기준으로 작성한다.
  - App access: 로그인/제한 영역이 없으면 reviewer access instruction은 불필요하다고 명시한다.
  - Target audience and content: 현재 제품은 생활계획/습관 관리 앱이며 어린이 대상 앱으로 기획되지 않았다는 전제 여부를 제품 판단으로 확정한다.
  - Content rating questionnaire
  - Data Safety form
- Data Safety 초안은 현재 코드 기준으로 `서버 전송 없음`, `계정 없음`, `광고 없음`, `로컬 기기 저장 중심`을 가정할 수 있다. 단, Expo/OS 알림 권한, crash/analytics SDK, 외부 API, 계정 기능, 백업/동기화가 추가되면 제출 전 다시 갱신해야 한다.
- 알림 권한 설명은 store listing, privacy policy, in-app permission rationale이 같은 의미를 갖도록 맞춘다. 현재 앱의 알림 목적은 계획 시작/종료 전 로컬 리마인드다.

### 4. Testing Track Plan

- 첫 Play Console 업로드는 production이 아니라 internal testing track으로 시작한다.
- Internal testing은 최대 100명 tester email list로 빠른 검증에 사용한다. 첫 internal test는 앱 설정이 완전히 끝나기 전에도 시작할 수 있지만, production 승격 전에는 store listing과 App content를 닫아야 한다.
- 개인 개발자 계정이 `2023-11-13` 이후 생성됐다면 closed testing track을 별도로 운영한다. 최소 `12명` tester가 `14일 연속` opt-in 상태를 유지해야 production access 신청이 가능하다.
- 테스트 트랙 검증 항목은 최소 아래를 포함한다.
  - 설치/첫 실행/권한 요청
  - Today -> Editor -> Reflection -> Motivation 핵심 흐름
  - 계획 저장/삭제/자정 넘김 일정
  - 시작 5분 전/종료 5분 전 알림 권한 및 실제 수신
  - 앱 아이콘/앱 이름/초기 화면 표시

### 5. App Signing, AAB, And EAS Build

- Google Play 신규 앱 제출은 Android App Bundle(`.aab`) 기준으로 준비한다. `preview` profile의 internal APK 성공은 Play 제출 가능성을 보장하지 않으므로 `production` profile의 Android build를 별도로 생성한다.
- Play App Signing은 Play Console에서 수락한다. 신규 앱은 Google-generated app signing key 사용을 기본 후보로 둔다.
- EAS Android remote keystore는 upload key 역할로 관리된다. Google Play에 첫 AAB를 올린 뒤 같은 package name의 후속 업데이트는 동일 signing lineage를 유지해야 한다.
- production build 전 확인한다.
  - `npx expo config --type public`에서 `android.package`가 `com.familyproject.todaydidyoufinish`인지 확인
  - Android target API가 Google Play의 현재 요구사항인 API 35 이상인지 확인
  - `versionCode`가 이전 Play Console 업로드보다 큰지 확인
  - `.aab` 산출물이 EAS dashboard 또는 `eas build:list`에서 확인되는지 확인
- 기본 production build 명령 후보:

```bash
cd apps/expo
npx eas build --platform android --profile production
```

### 6. Release Rollout Checklist

- Internal testing release를 만든다.
  - production `.aab` 업로드
  - release name과 release notes 작성
  - tester email list 연결
  - rollout 후 opt-in URL 공유
- Internal testing에서 설치와 핵심 QA가 통과하면 closed testing 필요 여부를 계정 유형 기준으로 결정한다.
- closed testing이 필요한 경우 tester 12명/14일 조건을 채우고, testing feedback과 QA 증거를 정리한 뒤 production access를 신청한다.
- production 접근이 열린 뒤 production release를 만든다.
  - 국가/지역, 무료/유료, managed publishing 사용 여부 확인
  - review errors/warnings 해소
  - 초기 rollout은 가능한 경우 staged rollout로 시작한다.
  - 출시 후 Android vitals, crash, ANR, user feedback, notification 관련 이슈를 확인한다.

## Release Commands

예상 기본 명령은 아래를 기준으로 삼는다.

```bash
cd apps/expo
npx expo config --type public
npx eas build --platform ios --profile preview
npx eas build --platform android --profile preview
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

제출 단계는 계정과 자격증명 연결이 준비된 뒤 아래 명령을 후보로 본다.

```bash
cd apps/expo
npx eas submit --platform ios --profile production
npx eas submit --platform android --profile production
```

## Android Production Build Readiness Plan

현재 Android production 목표는 `production` profile로 Play Store 제출 가능한 AAB를 만들기 전에, preview에서 이미 닫힌 dependency/install blocker가 production에서도 재발하지 않는지 확인하고 Play Console 제출 blocker를 분리하는 것이다. 이 섹션의 production build 명령은 준비 완료 후 실행할 후보이며, readiness 점검 단계에서는 실행하지 않는다.

### Current Android Baseline

- Expo public config 기준 Android package는 `com.familyproject.todaydidyoufinish`다.
- [eas.json](/Users/hun/workspace/familyProject/apps/expo/eas.json)의 `production` profile은 `autoIncrement: true`이며 별도 `distribution` 값이 없으므로 store build 경로로 취급한다.
- Android `preview` cloud build `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`였고, dependency install blocker는 `react-dom: 19.2.0` 고정 후 클린 `npm ci`로 해소됐다.
- native [android/app/build.gradle](/Users/hun/workspace/familyProject/apps/expo/android/app/build.gradle)는 `release` build type이 debug signingConfig를 가리키는 prebuild 기본값을 유지한다. Play 제출용 산출물은 로컬 `./gradlew assembleRelease`가 아니라 EAS remote Android credential로 서명된 production build를 기준으로 검증한다.
- main native manifest의 `SYSTEM_ALERT_WINDOW`, legacy external storage permission 선언은 제거했다. `READ_EXTERNAL_STORAGE`는 `expo-image`, `WRITE_EXTERNAL_STORAGE`는 `expo-file-system` library manifest에서 재유입되므로 release 전용 manifest override에서 `tools:node="remove"`로 차단한다. debug/debugOptimized manifest의 `SYSTEM_ALERT_WINDOW`는 개발용 overlay 권한으로 분리해 유지한다.
- Android 시작 5분 전 알림 정확도를 높이기 위해 `SCHEDULE_EXACT_ALARM`을 선언한다. 이 권한은 Android 13+ fresh install에서 기본 거부될 수 있으므로 앱 설정 메뉴의 exact alarm 상태 확인/설정 이동 UX와 함께 검증한다.
- `USE_EXACT_ALARM`은 calendar/alarm clock 앱 정책 범위에 더 직접적으로 묶이므로 현재 manifest에는 넣지 않는다. Play Console 제출 전에는 `SCHEDULE_EXACT_ALARM` 권한 선언, store listing의 알림 설명, privacy policy 문구를 같은 의미로 맞춘다.

### Android Notification Regression Guard

아래 항목은 Android 알림 정확도 회귀 방지 조건으로 유지한다.

- `tests/expo-reminder-notification-config.test.ts`는 native manifest에 `SCHEDULE_EXACT_ALARM`이 있고 `USE_EXACT_ALARM`이 없는지 확인한다.
- 같은 테스트는 release manifest override가 `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`를 `tools:node="remove"`로 차단하는지도 확인한다.
- 같은 테스트는 `ExactAlarmPackage`가 `MainApplication`에 등록됐는지, `ExactAlarmModule`이 `canScheduleExactAlarms()`와 `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` 설정 이동을 유지하는지 확인한다.
- `정확 알림 켜기` / `정확 알림 켜짐` 라벨과 설정 이동 가능 상태는 같은 테스트의 exact alarm access label 계약으로 보호한다.

실기기 start-5 timing QA는 아래 경우 다시 실행한다.

- Android manifest, `ExactAlarmModule`, `ExactAlarmPackage`, `MainApplication`, Expo reminder provider, Today 설정 메뉴 wiring 중 하나가 바뀔 때
- target SDK, Expo SDK, `expo-notifications`, React Native, Android Gradle Plugin, EAS build profile 중 하나가 바뀔 때
- Play Console 권한 선언 또는 store listing/privacy policy의 정확한 알림 설명을 제출 직전 확정할 때
- Samsung/Android 실기기에서 exact alarm 접근이 꺼진 fresh install 경로를 다시 확인해야 할 때

재실행 시 최소 증거는 standalone 설치, `adb reverse --list` empty, package permission, exact alarm 접근 상태, `dumpsys alarm`의 `window=0` / `exactAllowReason=permission`, notification shade 문구, `dumpsys notification --noredact`의 `when` timestamp, QA 일정 삭제 후 pending alarm 정리 상태다.

### Preflight Commands

아래 명령은 production build 전에 실행한다.

```bash
cd apps/expo
node -e "JSON.parse(require('fs').readFileSync('app.json','utf8')); JSON.parse(require('fs').readFileSync('eas.json','utf8')); JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('json ok')"
npx expo config --type public
npm ci
npx expo-doctor
npx eas-cli whoami
npx eas-cli credentials --platform android
```

리포지터리 루트에서는 문서와 기존 하네스를 확인한다.

```bash
bash scripts/validate-docs.sh
```

Android native project가 있는 현재 상태에서 로컬 release 번들링/컴파일만 사전 확인할 경우 아래를 후보로 둔다. 이 산출물은 debug signingConfig 때문에 Play 제출물로 사용하지 않는다.

```bash
cd apps/expo/android
./gradlew :app:bundleRelease
```

### Expected Blockers

- Google Play Console에 `com.familyproject.todaydidyoufinish` 앱 레코드가 없거나, 같은 package name을 다른 계정이 이미 소유하면 production submit은 중단된다.
- EAS Android credential이 preview에서 생성됐더라도 production 제출 전에 Play App Signing / upload key / keystore 보관 정책을 확정해야 한다.
- `npx eas-cli submit --platform android --profile production`은 Google Play service account JSON 또는 interactive Play 계정 연결이 없으면 중단된다.
- `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`가 최종 merged 또는 packaged release manifest에 다시 남으면 현재 제품 기능과 맞지 않는 권한으로 보고 제출 전에 제거한다. 현재 기준으로는 release 전용 manifest override가 세 권한을 차단해야 한다.
- 개인정보 처리방침 URL, 지원 URL, Data safety, 앱 카테고리, 알림 사용 목적, 스크린샷, 짧은/긴 설명이 없으면 Play Console 제출 검토를 완료할 수 없다.
- production build 산출물이 AAB가 아닌 APK로 생성되면 Play 제출 경로에 맞지 않으므로 profile 또는 EAS 기본 동작을 재확인한다.
- `autoIncrement: true`가 versionCode를 기대대로 증가시키지 않거나 Play Console에 이미 같은 versionCode가 있으면 업로드가 거절된다.

### Production Build And Submit Commands

preflight와 blocker 확인 후 사용자 승인 하에 아래 순서로 실행한다.

```bash
cd apps/expo
npx eas-cli build --platform android --profile production --non-interactive
npx eas-cli build:list --platform android --limit 5
npx eas-cli build:view <production-build-id>
```

Play Console submit 준비가 끝난 뒤에만 아래를 실행한다.

```bash
cd apps/expo
npx eas-cli submit --platform android --profile production
```

### Validation Steps

- `npx expo config --type public` 출력에서 `name`, `slug`, `version`, `android.package`, `extra.eas.projectId`, `owner`가 현재 baseline과 일치하는지 확인한다.
- 루트 `npm run typecheck`와 `bash scripts/validate-docs.sh`가 통과하는지 확인한다.
- production build detail에서 platform이 Android, profile이 `production`, status가 `FINISHED`, artifact가 Play 제출 가능한 AAB인지 확인한다.
- production 산출물을 Play Console internal testing track 또는 closed testing track에 올리고 versionCode 중복 오류가 없는지 확인한다.
- Android 실제 기기 또는 Play internal testing 설치 경로에서 첫 실행, Today 화면 진입, 알림 권한 요청, 시작 리마인드 예약/수신, Today -> Editor -> Reflection -> Motivation 흐름을 확인한다.
- 최종 merged manifest 또는 Play Console permission summary에서 알림/인터넷/진동 외 권한이 제출 메타데이터와 일치하는지 확인한다.
- 제출 후 build id, artifact type, Play track, 검증 기기, 실패/성공 결과를 활성 exec plan과 handoff에 남긴다.

## Release Checklist

### 1. App Config

- [app.json](/Users/hun/workspace/familyProject/apps/expo/app.json)의 `name`, `slug`, `scheme`, `version`이 배포 대상과 일치한다.
- iOS `bundleIdentifier`와 Android `package`가 최종 제출 식별자와 일치한다.
- iOS는 native `ios/` 디렉터리가 있으므로 실제 build 시 `app.json`의 `ios.bundleIdentifier`보다 native code 설정값이 우선된다는 점을 확인한다.
- 앱 아이콘 자산이 최신 상태다.
- 알림 플러그인과 router 플러그인이 현재 요구사항과 일치한다.

### 2. Build Profiles

- [eas.json](/Users/hun/workspace/familyProject/apps/expo/eas.json)에 `development`, `preview`, `production` 프로필이 존재한다.
- 내부 QA는 `preview` 빌드 기준으로 배포한다.
- 스토어 제출 직전 빌드는 `production` 프로필 기준으로 만든다.
- OTA updates를 도입하기 전까지 `channel` 설정은 두지 않는다.

### 3. QA Gate

- Today -> Editor -> Reflection -> Motivation 핵심 흐름이 다시 재현된다.
- 원형 시간판, 삭제, 저장 실패, 자정 넘김 일정 처리 회귀가 없다.
- theme snapshot 및 route/screen snapshot 테스트가 깨지지 않는다.
- 시뮬레이터 알림 QA는 [APP_REMINDER_SIMULATOR_QA.md](/Users/hun/workspace/familyProject/docs/APP_REMINDER_SIMULATOR_QA.md) 기준을 충족한다.
- 실제 기기 알림 배너 가시성은 iPhone 또는 Android 중 최소 한 경로에서 별도 확인한다.

### 4. Store Readiness

- App Store Connect / Google Play Console에 앱 레코드가 준비돼 있다.
- Google Play Console app record, main store listing, App content, Data Safety, testing track, Play App Signing 준비 상태는 위 `Google Play Console Submission Readiness` 기준으로 확인한다.
- iOS internal distribution에 필요한 credential이 interactive setup 또는 사전 업로드 상태로 준비돼 있다.
- 개인정보 처리방침 URL, 지원 URL, 연령 등급 입력값이 준비돼 있다.
- 스토어 설명, 키워드, 스크린샷, 테스트 계정 필요 여부가 정리돼 있다.
- 알림 사용 목적 설명이 제출 메타데이터와 일치한다.

### 5. Post-Build Checks

- preview 빌드가 실제 기기 또는 테스트 환경에 설치된다.
- production 빌드가 EAS에서 성공한다.
- 빌드 산출물의 앱 아이콘, 앱 이름, 초기 진입 화면이 기대와 일치한다.
- `2026-05-13` 기준 Android `preview` build `505e6104-7c02-4c35-95a6-517325029d96`는 `FINISHED`이며, Emulator 설치 후 알림 권한 요청과 Today 메인 화면 기동까지 확인됐다.

## Known Gaps

- 현재 문서 기준으로 실제 App Store Connect / Google Play Console 제출 기록은 없다.
- Play Console app record 생성, store listing 입력, App content/Data Safety 제출, testing track 생성, Play App Signing 수락 기록은 아직 없다.
- Android production `.aab` build와 Play Console 업로드 검증은 아직 없다.
- Google Play 계정 유형이 조직 계정인지, `2023-11-13` 이후 생성된 개인 계정인지 아직 확인되지 않았다. 개인 신규 계정이면 closed test 12명/14일 조건이 production 접근의 blocker가 될 수 있다.
- Privacy policy 페이지는 [src/app/privacy/page.tsx](/Users/hun/workspace/familyProject/src/app/privacy/page.tsx)에 준비됐지만, Play Console에 넣을 실제 공개 URL은 웹 배포 도메인이 확정돼야 완성된다.
- 실제 iPhone 연결이 없는 세션에서는 알림 배너 실기 QA를 닫지 못했다.
- EAS 프로젝트 연결, 자격증명 생성, submit 실행 여부는 아직 확인되지 않았다.
- `2026-05-12` 기준 Expo 로그인은 완료됐고 `npx eas-cli whoami`는 `algumhun / algum1737@gmail.com`을 출력한다.
- 같은 날짜 `eas init --force`로 `@algumhun/today-did-you-finish` EAS project 생성과 app link는 완료됐다.
- 그다음 `npx eas-cli build --platform ios --profile preview --non-interactive`는 iOS internal distribution credential이 non-interactive 모드에서 준비되지 않아 중단됐다.
- 같은 build 시도에서 `expo-updates` 미설치 상태로 `channel: preview` 경고가 함께 출력됐다.
- Android `preview` build는 Expo remote keystore 생성과 업로드까지 진행됐지만, EAS server의 `Install dependencies` 단계에서 `Unknown error`로 실패했다.
- 같은 failure는 `/private/tmp/expo-clean2`의 클린 `npm ci`에서 `react@19.2.0`과 전이 `react-dom@19.2.5` peer dependency 충돌로 재현됐다.
- [package.json](/Users/hun/workspace/familyProject/apps/expo/package.json)에 `react-dom: 19.2.0`을 추가하고 lockfile을 갱신한 뒤, `/private/tmp/expo-clean3` 기준 클린 `npm ci`는 통과했다.
- 수정 후 Android `preview` build `505e6104-7c02-4c35-95a6-517325029d96`를 다시 실행했고, `FINISHED`로 완료되어 internal APK 산출물이 발급됐다.
- `expo-updates` 미사용 상태의 EAS channel 경고를 피하기 위해 [eas.json](/Users/hun/workspace/familyProject/apps/expo/eas.json)의 `channel` 설정은 제거했다.

## Simulator And Emulator Note

- Android 우선으로 전환해도 iOS 시뮬레이터를 더 이상 못 쓰게 되는 것은 아니다.
- iOS 시뮬레이터는 계속 로컬 UI/흐름 확인 용도로 사용할 수 있다.
- 다만 Android 배포 산출물 확인은 iOS 시뮬레이터가 아니라 Android Emulator 또는 실제 Android 기기에서 해야 한다.
- 즉 `iOS simulator = iOS 로컬 QA`, `Android emulator/device = Android 배포/설치 QA`로 역할이 나뉜다.

## Recommended Next Step

현재 제품 방향은 Google Play 출시보다 앱 완성도와 QA를 먼저 높이는 것이다.

1. Android Emulator 또는 실제 Android 기기에서 foreground/background 로컬 알림 수신과 배너 가시성을 증거로 남긴다.
2. 알림 QA 이후 사용자가 체감하는 Today -> Editor -> Reflection -> Motivation 핵심 흐름을 한 번 더 점검한다.
3. 필요하면 web planner의 `다시 지정` 차단 이유 노출, `rescheduleCount >= 3` 안내 정책, 원형 시간판 시각 회귀 테스트를 순서대로 진행한다.
4. 사용자가 `밀린 업무 진행하자`라고 하면 [APP_PLAY_CONSOLE_SUBMISSION_PREP.md](/Users/hun/workspace/familyProject/docs/APP_PLAY_CONSOLE_SUBMISSION_PREP.md)의 입력값으로 Play Developer 계정 생성, package name app record 확보, privacy policy 공개 URL, Contact email, App content/Data Safety, Play App Signing, testing track, production access 신청을 재개한다.
5. 이후 필요하면 iOS credential setup을 별도 후순위로 진행한다.

## References

- Google Play Help: [Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152)
- Google Play Help: [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- Google Play Help: [Provide information for Google Play's Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469)
- Google Play Help: [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Google Play Help: [App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- Google Play Help: [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- Google Play Help: [Use Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)
- Google Play Help: [Target API level requirements for Google Play apps](https://support.google.com/googleplay/android-developer/answer/11926878)
- Expo Docs: [Create a production build for Android](https://docs.expo.dev/tutorial/eas/android-production-build)
