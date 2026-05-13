# App Play Console Submission Prep

## Purpose

이 문서는 `오늘 다 했니` Android 앱을 Google Play Console에 처음 올리기 전에 콘솔에서 확인하거나 입력해야 하는 값을 모은다.

현재 목표는 production 공개가 아니라 `internal testing` 트랙에 첫 `.aab`를 올릴 수 있는 상태를 만드는 것이다.

현재 제품 방향은 출시보다 앱 완성도와 QA를 우선한다. 따라서 Play Developer 계정 생성, production 접근, app record 생성, testing track 업로드는 최후순위 릴리스 대기열로 내리고, 사용자가 `밀린 업무 진행하자`라고 할 때 이 문서를 기준으로 재개한다.

## Current App Values

- App name: `오늘 다 했니`
- Package name: `com.familyproject.todaydidyoufinish`
- App type: App
- Initial price: TBD. 초기 배포는 무료 후보로 둔다.
- Default language: Korean (`ko-KR`) 후보
- Category: Productivity 또는 Lifestyle 후보. 최종 선택 필요.
- Contact email: TBD
- Privacy policy URL: deployed web origin + `/privacy`
- Support URL: optional, TBD

## Account Checks

Play Console에서 먼저 확인한다.

1. Google Play Developer account 생성 완료
2. 결제, 신원 인증, 2단계 인증 완료
3. 앱 생성 권한 보유
4. testing track release 생성 권한 보유
5. Play App Signing 약관 수락 가능
6. 계정 유형 확인

계정 유형 기준:

- Organization account: 일반 internal testing -> closed/open/production 경로를 준비한다.
- Personal account created on or after `2023-11-13`: production access 전에 closed testing에서 tester 12명 이상이 14일 연속 opt-in 상태를 유지해야 할 수 있다.

## Create App Inputs

Play Console `Create app`에서 입력할 후보값이다.

- App name: `오늘 다 했니`
- Default language: `Korean`
- App or game: `App`
- Free or paid: `Free` 후보
- Contact email: TBD
- Declarations:
  - Developer Program Policies: accept
  - US export laws: accept
  - Play App Signing Terms of Service: accept

주의:

- `com.familyproject.todaydidyoufinish` package name은 첫 업로드 후 사실상 앱의 영구 식별자가 된다.
- 같은 package name이 다른 Play Console 계정에 이미 있으면 업로드가 막힌다.

## Store Listing Draft

### App Name

`오늘 다 했니`

### Short Description Candidate

`오늘 할 일을 시간 흐름에 맞춰 계획하고, 시작과 마감 전 알림으로 놓치지 않게 돕습니다.`

### Full Description Candidate

`오늘 다 했니는 하루 계획을 시간 흐름에 맞춰 정리하고 실행을 확인하는 개인용 계획 관리 앱입니다.

원형 시간판에서 오늘의 흐름을 한눈에 보고, 계획을 추가하거나 수정하며, 완료 여부를 기록할 수 있습니다. 시작 전과 종료 전 로컬 알림으로 지금 해야 할 일을 놓치지 않도록 돕습니다.

주요 기능:
- 오늘 계획 추가, 수정, 삭제
- 원형 시간판으로 하루 흐름 확인
- 시작 5분 전, 종료 5분 전 로컬 알림
- 완료 상태 기록
- 회고와 동기 화면을 통한 진행 상황 확인

현재 앱은 계정 생성 없이 기기 안에 데이터를 저장하는 개인용 도구로 설계되어 있습니다.`

## Privacy And Data Safety Draft

현재 코드 기준 가정:

- 계정 생성 없음
- 광고 SDK 없음
- 외부 서버 전송 없음
- 사용자가 입력한 계획/회고 데이터는 기기 로컬 저장소에 저장
- 로컬 알림 권한 사용
- 인터넷 권한은 Expo/React Native 런타임과 앱 번들 동작을 위해 manifest에 존재
- 진동 권한은 알림 동작을 위해 manifest에 존재

제출 전 확인해야 하는 항목:

- Privacy policy URL 준비. 현재 repo에는 [src/app/privacy/page.tsx](/Users/hun/workspace/familyProject/src/app/privacy/page.tsx)가 추가돼 있으므로, 웹 배포 도메인이 생기면 `https://<domain>/privacy`를 후보로 쓴다.
- Data Safety form에서 수집/공유 여부를 실제 구현과 일치시킴
- crash/analytics SDK 추가 여부 확인
- 백업/동기화/계정 기능 추가 여부 확인
- Play Console permission summary와 앱 설명의 알림 목적 일치 여부 확인

Privacy policy 초안에 반드시 들어갈 내용:

- 앱이 어떤 데이터를 사용자가 직접 입력하게 하는지
- 데이터가 기본적으로 기기 내부에 저장된다는 점
- 알림 권한 사용 목적
- 문의 이메일
- 향후 서버 동기화나 분석 도구가 추가되면 정책이 갱신된다는 점

## Internal Testing Track

첫 업로드는 production이 아니라 internal testing track을 기준으로 진행한다.

필요 작업:

1. Internal testing track 생성
2. tester email list 생성
3. Android production `.aab` 업로드
4. release name 작성
5. release notes 작성
6. Play App Signing 설정 확인
7. review warnings/errors 처리
8. opt-in URL 공유

Release notes 후보:

`첫 내부 테스트 빌드입니다. 오늘 계획 추가/수정/삭제, 원형 시간판, 알림 권한 요청, 시작/종료 전 로컬 알림, 동기 화면 기본 흐름을 확인합니다.`

## Production AAB Build

Play Console 업로드용 산출물은 preview APK가 아니라 production `.aab`다.

명령 후보:

```bash
cd apps/expo
npx eas-cli build --platform android --profile production --non-interactive
```

완료 후 확인:

```bash
cd apps/expo
npx eas-cli build:list --platform android --limit 5
npx eas-cli build:view <production-build-id>
```

## Submit Automation

첫 Google Play 업로드는 수동 업로드가 필요할 수 있다. 이후 자동 제출을 쓰려면 service account JSON key를 준비하고 EAS credentials 또는 EAS dashboard에 연결한다.

자동 제출 후보 명령:

```bash
cd apps/expo
npx eas-cli submit --platform android --profile production
```

자동 제출은 아래 조건을 만족한 뒤 실행한다.

- Play Console app record 생성 완료
- 첫 AAB 업로드 또는 API 제출 조건 충족
- Google Play Android Developer API 사용 설정
- service account JSON key 준비
- target track 결정: `internal`, `closed`, `production`

## Current Verification Status

- 계정 유형: `2026-05-13` Chrome에서 `play.google.com/console` 접속 시 `Play Console 개발자 계정 만들기`의 계정 유형 선택 화면으로 이동했다. 따라서 이 Google 계정의 Play Developer 계정 생성은 아직 완료되지 않은 상태로 본다.
- App record 생성 가능 여부: 개발자 계정 생성 전이므로 아직 확인 불가. 계정 생성, 결제/신원/2단계 인증 완료 후 실제 Play Console `Create app` 및 첫 AAB 업로드에서 확인한다.
- Privacy policy URL: `/privacy` 페이지는 repo에 준비됨. 실제 공개 URL은 웹 배포 도메인 확정 후 완성
- Contact email: 아직 TBD

## References

- Google Play Help: Create and set up your app: https://support.google.com/googleplay/android-developer/answer/9859152
- Google Play Help: Prepare and roll out a release: https://support.google.com/googleplay/android-developer/answer/9859348
- Google Play Help: App testing requirements for new personal developer accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Expo Docs: Create a production build for Android: https://docs.expo.dev/tutorial/eas/android-production-build
- Expo Docs: Submit to the Google Play Store: https://docs.expo.dev/submit/android/
