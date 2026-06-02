# Android Play Permission Blockers

## Context

Android production build readiness 문서에는 Play Console 제출 전 blocker 후보로 `SYSTEM_ALERT_WINDOW`, legacy external storage permissions, `SCHEDULE_EXACT_ALARM`, store listing/privacy/data safety 문구 정합성이 남아 있다.

이번 작업은 production 제출 실행이 아니라, 현재 앱 manifest와 제품 설명 기준으로 Play Console 제출 전 확인해야 할 Android 권한/스토어 문구 blocker를 더 구체적으로 분류하고 다음 실행 순서를 고정한다.

## Scope

- Google Play 공식 문서 기준으로 Android 권한/데이터/스토어 설명 관련 최신 제출 리스크 확인
- 현재 manifest permission과 앱 기능의 필요성 대조
- 제거 후보, 선언 유지 후보, Play Console 입력 후보 분리
- `APP_EXPO_RELEASE_CHECKLIST`, `APP_PLAY_CONSOLE_SUBMISSION_PREP`, handoff 갱신

## Out of Scope

- Play Console 실제 접속/입력
- production AAB 빌드/업로드
- Android manifest 권한 제거 코드 변경
- 새 실기기 runtime QA

## Assumptions

- 현재 목표는 “제출 전 blocker 정리”이며, 실제 권한 제거는 별도 구현 브랜치에서 처리한다.
- 권한 정책은 현재 날짜 기준 Google 공식 문서를 우선한다.
- 정확 알림은 start-5/end-5 로컬 알림 정확도 목적과 연결해 설명하고, `USE_EXACT_ALARM`은 계속 선언하지 않는다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- 현재 Android manifest permission 확인
- 관련 Play Console/Google Play policy 공식 문서 확인

### Automated tests

- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 이번 범위에서는 새 앱 설치/실기기 QA를 실행하지 않는다.

### Success Criteria

- 현재 manifest permissions가 “유지”, “제거 후보”, “제출/문구 확인 후보”로 분류된다.
- Play Console store listing, Data safety, permission declaration에서 확인해야 할 값이 문서에 남는다.
- 다음 구현 작업이 필요하면 별도 작업 후보로 명시된다.

### Skipped/Not Run

- Play Console 실제 입력
- AAB build/submit
- 실기기 QA

## Open Work

- 없음. PR/merge 대기.

## Progress Log

- `docs/android-play-permission-blockers` 브랜치를 만들었다.
- Google Play 공식 문서 기준을 확인했다.
  - Sensitive permission/API는 앱 listing에 공개된 현재 기능에 필요한 경우에만 요청해야 한다.
  - `USE_EXACT_ALARM`은 alarm/timer/calendar처럼 정확한 시각이 핵심 기능인 앱에 제한되는 restricted permission이며, 현재 앱은 계속 선언하지 않는다.
  - Data safety form은 internal testing 전용 앱에는 표시가 면제될 수 있지만, closed/open/production 경로를 위해 정확한 form과 privacy policy를 준비해야 한다.
  - privacy policy는 공개 URL이어야 하며 앱 이름 또는 개발 주체, 문의 경로, 데이터 접근/수집/사용/공유/보관 방식을 설명해야 한다.
- 현재 manifest permission을 분류했다.
  - 유지 후보: `INTERNET`, `VIBRATE`, `SCHEDULE_EXACT_ALARM`
  - 금지/미선언 유지: `USE_EXACT_ALARM`
  - 제거 후보: `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`
- `APP_PLAY_CONSOLE_SUBMISSION_PREP.md`에 Android permission blocker matrix, 권한 제거 구현 후보, Play Console 입력 후보를 추가했다.
- `APP_EXPO_RELEASE_CHECKLIST.md`에서 overlay/storage 권한을 production 제출 전 제거 기본 경로로 정리했다.

## References

- Google Play Help, Permissions and APIs that Access Sensitive Information: https://support.google.com/googleplay/android-developer/answer/16558241
- Google Play Help, Data safety section: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play Help, Developer Program Policy / Privacy policy: https://support.google.com/googleplay/android-developer/answer/15402170
- Google Play Help, Create and set up your app: https://support.google.com/googleplay/android-developer/answer/9859152
- Android Developers, Schedule alarms: https://developer.android.com/develop/background-work/services/alarms/schedule
- Android Developers, uses-permission: https://developer.android.com/guide/topics/manifest/uses-permission-element

## Validation Result

### Automated tests

- PASS: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- NOT RUN: 이번 작업은 Play Console 제출 전 blocker 문서 정리 범위라 앱 설치, production AAB build, Play Console 실제 입력은 실행하지 않았다.

### Skipped/Not Run

- Play Console 실제 입력
- AAB build/submit
- 실기기 QA
