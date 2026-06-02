# Android Notification Regression Guard

## Context

`Android Start Notification Precision`에서 exact alarm 접근이 켜진 Samsung 실기기 기준 start-5 알림이 목표 `2026-06-02 11:20:00.000 KST` 대비 `2026-06-02 11:20:00.106 KST`에 활성화되는 것을 확인했다.

이 결과는 한 번의 실기기 QA로 끝내면 이후 manifest, native module, provider wiring, 문서 정책 중 하나가 바뀔 때 다시 깨질 수 있다. 이번 작업은 Android 알림 정확도 조건을 장기 회귀 방지 항목으로 고정한다.

## Scope

- Android exact alarm 회귀 방지에 필요한 자동 검증 후보 확인
- manifest 권한, `USE_EXACT_ALARM` 금지, native module/package 등록, JS 설정 UX wiring을 검증하는 테스트 또는 스크립트 추가
- 실기기 runtime QA 체크리스트를 “언제 다시 돌릴지” 기준까지 문서화
- release/Play policy 문서와 handoff의 다음 작업 상태 갱신

## Out of Scope

- 새 실기기 timing QA 반복 실행
- Play Console 실제 제출
- exact alarm UX 추가 변경
- iOS 알림 정책 변경

## Assumptions

- 이번 작업은 이미 통과한 runtime QA 결과를 자동/문서 guardrail로 고정하는 범위다.
- 실기기 연결은 당장 필요하지 않다.
- exact alarm 접근이 꺼진 상태의 inexact fallback은 OS 정책상 지연 가능성이 있으므로 실패가 아니라 안내/정책 조건으로 본다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- 관련 알림 테스트/스크립트 위치 확인

### Automated tests

- 새/갱신 테스트 또는 스크립트 실행
- `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- `npm run typecheck`
- `npx tsc --noEmit -p apps/expo/tsconfig.json`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 이번 범위에서는 새 실기기 runtime QA를 실행하지 않는다.
- 대신 release APK 설치 후 다시 확인해야 하는 조건을 체크리스트로 남긴다.

### Success Criteria

- `SCHEDULE_EXACT_ALARM` 누락과 `USE_EXACT_ALARM` 추가가 자동 검증에서 잡힌다.
- Android native exact alarm module/package 등록이 누락되면 자동 검증에서 잡힌다.
- Today 설정 메뉴의 exact alarm 상태 표시 wiring이 테스트로 보호된다.
- 실기기 QA 재실행 트리거가 문서에 명확히 남는다.

### Skipped/Not Run

- 새 standalone APK 빌드/설치
- 새 실기기 notification shade 캡처
- Play Console 권한 선언 입력

## Open Work

- 없음. PR/merge 대기.

## Progress Log

- `qa/android-notification-regression-guard` 브랜치를 만들었다.
- 기존 `tests/expo-reminder-notification-config.test.ts`가 manifest permission과 exact alarm label 계약을 이미 확인하는 것을 확인했다.
- 같은 테스트에 Android native exact alarm bridge 등록 guard를 추가했다. 이제 `MainApplication`의 `ExactAlarmPackage` 등록, `ExactAlarmPackage`의 `ExactAlarmModule` 생성, `ExactAlarmModule`의 module name, `canScheduleExactAlarms()`, `ACTION_REQUEST_SCHEDULE_EXACT_ALARM`, error code 계약을 확인한다.
- `APP_EXPO_RELEASE_CHECKLIST.md`에 Android notification regression guard와 실기기 start-5 timing QA 재실행 트리거를 추가했다.

## Validation Result

### Automated tests

- PASS: `npm test -- --run tests/expo-reminder-notification-config.test.ts`
- PASS: `npm run typecheck`
- PASS: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- PASS: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- NOT RUN: 이번 작업은 이미 통과한 Android start-5 runtime QA를 자동/문서 guardrail로 고정하는 범위라 새 standalone APK 설치와 실기기 notification shade 캡처는 실행하지 않았다.

### Skipped/Not Run

- 새 standalone APK 빌드/설치
- 새 실기기 start-5 timing QA
- Play Console 권한 선언 입력
