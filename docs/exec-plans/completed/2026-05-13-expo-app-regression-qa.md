# Expo App Regression QA

## Goal

Expo 앱의 핵심 사용자 흐름을 한 번의 회귀 QA로 묶어 확인하고, 자동 테스트와 Android Emulator smoke 결과를 분리해 기록한다.

## Scope

- Today 화면 렌더링과 현재/대기/놓침 상태 표시
- 계획 생성, 편집, 삭제 흐름
- missed 회고 저장 흐름
- missed 다시 지정 및 차단 이유 표시 흐름
- 로컬 알림 foreground/background QA 기존 결과와 이번 회귀 결과 연결
- 결과를 `docs/HANDOFF.md`와 `docs/index.md`에 반영

## Out Of Scope

- Play Console 릴리스 대기열
- Android production `.aab` 생성
- 실제 Android 물리 기기 QA
- 새 알림 정책 변경

## Assumptions

- 현재 설치된 Android preview APK는 이전 EAS 산출물일 수 있으므로, 최신 소스 변경 검증은 자동 테스트로 우선 확인한다.
- Android Emulator smoke는 설치 앱의 현재 런타임 상태 확인으로 기록하고, 최신 소스 반영 여부는 별도 빌드/재설치가 필요하면 Open Work로 남긴다.

## Steps

1. 현재 Android Emulator와 설치된 앱 상태를 확인한다.
2. Expo route/action/presentation 단위 테스트로 create/edit/delete/reflection/reschedule/reminder 계약을 확인한다.
3. Android Emulator에서 설치 앱 실행, Today 렌더링, 기본 화면 접근을 smoke 확인한다.
4. 가능하면 UI로 생성/편집/삭제 중 최소 1개 흐름을 확인한다.
5. 알림 회귀는 기존 foreground/background QA 완료 결과와 이번 설치 앱 상태를 연결해 기록한다.
6. 검증 결과와 남은 리스크를 문서화하고 completed로 이동한다.

## Validation

- 관련 Vitest 테스트가 통과해야 한다.
- 루트 `npm run typecheck`가 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.
- Android Emulator smoke 결과에는 package/version, 권한 상태, 화면 렌더링 증거를 포함한다.

## Open Work

- 현재 설치 앱은 `2026-05-13 09:21:59`에 설치된 Android preview APK로, 이후 소스 변경까지 모두 반영된 새 APK는 아니다. 최신 소스 반영 런타임 QA는 새 Android preview/dev build 재설치 후 다시 확인한다.
- 실제 Android 기기 QA는 별도 후속 후보로 남긴다.

## Completion

- 완료일: 2026-05-13
- Android Emulator 설치 앱 상태를 확인했다. `com.familyproject.todaydidyoufinish`, `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS` 권한 granted/user-set 상태였다.
- 자동 회귀 테스트로 Expo route/action/presentation/reminder 계약을 확인했다. 5개 테스트 파일, 20개 테스트가 통과했다.
- Android Emulator에서 Today 화면 렌더링, 원형 시간판, 현재 계획 카드, 하단 탭을 smoke 확인했다.
- UI smoke로 계획 생성/저장, 현재 카드와 요약 갱신, 편집 진입/취소, missed 회고 저장, 생성한 QA 계획 삭제, Motivation 탭 이동과 월간 지표 표시를 확인했다.
- 로컬 알림 회귀는 `Expo Notification Foreground Background QA` 완료 결과와 연결한다. Android Emulator에서 foreground 인앱 시작 리마인드와 background 종료 5분 전 OS 알림 적재 및 notification shade dismiss가 이미 확인돼 있다.

## Validation Result

- `npm test -- tests/expo-router-route-actions.test.ts tests/expo-reschedule-visibility-reasons.test.ts tests/expo-bootstrap-and-reminders.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-router-provider-state.test.ts`
- `npm run typecheck`
- `bash scripts/validate-docs.sh`
- Android Emulator screenshot evidence: `/private/tmp/codex-screen9.png`
