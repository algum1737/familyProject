---
id: SYNTHESIS-GOOGLE-PLAY-RELEASE-READINESS
type: synthesis
title: Google Play Release Readiness
status: verified
confidence: medium
tags: [google-play, release, internal-testing, data-safety]
sources: [SRC-GOOGLE-PLAY-CREATE-APP, SRC-GOOGLE-PLAY-TESTING-TRACKS, SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING, SRC-GOOGLE-PLAY-DATA-SAFETY, SRC-GOOGLE-PLAY-APP-SIGNING, SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Release Readiness

## Summary

familyProject의 첫 Google Play 목표는 production 공개가 아니라 앱 레코드를 만들고 production AAB를 internal testing에 배포해 실제 Play 설치 경로를 검증하는 것이다. 계정 유형, app record, 서명, testing track, 권한 summary, privacy와 Data Safety는 서로 다른 checkpoint로 관리한다.

## Supported Claims

- 앱 레코드 생성에는 기본 언어, 표시 이름, 앱 유형, 무료·유료 여부, 연락처 이메일과 필수 선언이 필요하다. 근거: `SRC-GOOGLE-PLAY-CREATE-APP`.
- Google Play은 빠른 초기 피드백을 위해 internal testing부터 시작한 뒤 closed testing으로 확장하는 흐름을 권장하며 internal test는 최대 100명의 tester를 지원한다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.
- 첫 artifact를 업로드하면 package name이 고정되므로 업로드 전에 식별자를 확정해야 한다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.
- 2026-07-30 확인 기준으로 2023년 11월 13일 이후 생성된 개인 개발자 계정은 production access 신청 전에 closed test에서 tester 12명 이상이 14일 연속 opt-in 상태를 유지해야 한다. 근거: `SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING`.
- internal testing에만 활성화된 앱은 Data Safety section 의무에서 면제되지만, closed, open 또는 production 트랙에서는 form과 privacy policy가 필요하다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.
- Play App Signing에서는 Google Play이 app signing key를 관리하고 개발자는 AAB 업로드에 사용하는 upload key를 보관한다. 근거: `SRC-GOOGLE-PLAY-APP-SIGNING`.
- `USE_EXACT_ALARM`은 제한 권한이므로 familyProject의 실제 AAB 권한 목록과 Play declaration을 제출 전에 확인해야 한다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.

## Project Interpretation

2026-06-11 프로젝트 증거 기준으로 EAS production AAB `versionCode 2`가 생성됐고, 내부 manifest에는 `SCHEDULE_EXACT_ALARM`이 있으며 `USE_EXACT_ALARM`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`는 없었다. 이 결과는 당시 artifact의 preflight이며 Play Console permission summary를 대신하지 않는다. 근거는 [production permission refresh](../../exec-plans/completed/2026-06-11-android-production-permission-summary-refresh.md)다.

다음 외부 작업은 아래 checkpoint 순서로 진행한다.

| Checkpoint | Evidence required | Stop condition |
| --- | --- | --- |
| Developer account | 계정 유형, 생성일, identity verification과 결제 상태 | 계정 생성 또는 인증이 완료되지 않음 |
| App record | 표시 이름, package name `com.familyproject.todaydidyoufinish`, 연락처 이메일과 선언 저장 | package name 충돌 또는 공개 정보 미승인 |
| Signing | Play App Signing 약관, upload certificate와 EAS credential 대응 확인 | certificate 불일치 또는 credential 소유 불명 |
| First AAB | production profile AAB, versionCode, Play permission summary | 중복 versionCode, 서명 오류 또는 예상 밖 권한 |
| Internal testing | tester 목록, release notes, opt-in URL과 Play 설치 성공 | 설치 불가 또는 review blocker |
| Runtime QA | 첫 실행, Today, Editor, Reflection, Motivation, notification 권한과 start reminder | 핵심 흐름 또는 알림 실패 |
| Wider release | 계정 유형별 closed testing 조건, privacy URL, Data Safety와 store listing | 정책·데이터 답변 미확정 |

프로젝트 입력 초안과 실제 체크리스트의 권위는 [Play Console 제출 준비](../../APP_PLAY_CONSOLE_SUBMISSION_PREP.md)와 [Expo 릴리스 체크리스트](../../APP_EXPO_RELEASE_CHECKLIST.md)에 둔다. 이 synthesis는 외부 규칙과 프로젝트 checkpoint를 연결하는 탐색 문서이며 콘솔 입력값을 자동 확정하지 않는다.

Google Play 정책값은 시간에 민감하다. tester 수, 연속 기간, Data Safety 면제와 권한 정책은 internal 또는 production 작업을 재개하는 날 공식 원문에서 다시 확인한다.

## Open Questions

- 사용할 Play Developer 계정의 유형과 생성일은 무엇인가.
- app record에 노출할 개발자 이름, 연락처 이메일과 privacy policy 공개 URL은 무엇인가.
- EAS production upload certificate와 Play App Signing 등록 certificate가 일치하는가.
- 첫 internal tester와 피드백 채널을 누가 운영할 것인가.
- production AAB의 Expo·Google SDK가 Data Safety에서 신고할 off-device 전송을 수행하는가.
