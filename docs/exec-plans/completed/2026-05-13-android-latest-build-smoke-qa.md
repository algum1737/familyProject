# Android Latest Build Smoke QA

## Goal

최신 소스가 반영된 Android 빌드를 Emulator에 재설치하고, 이전 preview APK 기준으로 남아 있던 런타임 반영 공백을 닫는다.

## Scope

- 현재 로컬 Android 빌드 경로와 산출물 기준 확인
- 최신 소스 기준 Android debug APK 로컬 빌드
- Emulator에 기존 앱 제거 또는 덮어쓰기 설치
- 설치 앱 package/version/permission 상태 확인
- Today 화면 렌더링과 핵심 UI smoke 확인
- 결과를 `docs/HANDOFF.md`와 `docs/index.md`에 반영

## Out Of Scope

- Play Console 제출
- production `.aab` 생성
- EAS remote build 재시도
- 실제 Android 물리 기기 QA
- 새 기능 구현 또는 UI 변경

## Assumptions

- 최신 소스 런타임 반영 확인에는 로컬 debug APK가 충분하다.
- production 제출 적합성은 debug APK로 판단하지 않는다.
- 기존 Emulator 데이터는 QA 편의를 위해 필요하면 앱 제거로 초기화할 수 있다.

## Steps

1. Android 로컬 빌드 전 타입/핵심 테스트 상태를 확인한다.
2. `apps/expo/android`에서 최신 debug APK를 빌드한다.
3. Emulator에 최신 APK를 설치하고 실행한다.
4. 설치 package/version/permission 상태와 Today 화면 렌더링을 확인한다.
5. 가능한 경우 최신 Recovery UX 반영 지점인 blocked reschedule 버튼/이유 표시를 smoke 확인한다.
6. 검증 결과와 남은 리스크를 문서화하고 completed로 이동한다.

## Validation

- 관련 Expo Vitest 테스트가 통과해야 한다.
- 루트 `npm run typecheck`가 통과해야 한다.
- Android debug APK 빌드가 통과해야 한다.
- Emulator 설치와 앱 실행이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- production `.aab`와 Play Console 경로는 릴리스 대기열로 유지한다.
- 실제 Android 물리 기기 알림 QA는 별도 후속 후보로 유지한다.
- debug APK는 JS bundle을 내장한 production/preview 산출물이 아니므로, 설치 직후 흰 화면이 보이면 Metro 8081 연결과 `adb reverse tcp:8081 tcp:8081`이 필요하다.
- EAS preview APK처럼 JS bundle까지 내장한 최신 내부 배포 산출물 검증은 별도 후속으로 남긴다.

## Completion

- 완료일: 2026-05-13
- 로컬 Android debug APK를 새로 빌드했다. 산출물은 `apps/expo/android/app/build/outputs/apk/debug/app-debug.apk`, 크기 `157M`, 수정 시각 `2026-05-13 14:00:15`다.
- 첫 Gradle 실행은 `/Users/hun/.gradle` wrapper lock 접근이 sandbox에 막혀 실패했고, 승인된 권한으로 `./gradlew assembleDebug`를 재실행해 성공했다.
- 빌드 중 `NODE_ENV` 미지정 경고와 Android SDK XML version 경고가 있었지만 `BUILD SUCCESSFUL in 43s`로 종료됐다.
- 기존 `com.familyproject.todaydidyoufinish` 패키지를 제거한 뒤 새 debug APK를 Emulator에 설치했다.
- 설치 앱은 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `DEBUGGABLE`, `firstInstallTime=2026-05-13 14:25:59` 상태였다.
- 재설치 직후 `POST_NOTIFICATIONS`는 `granted=false`였고, 앱의 권한 프롬프트에서 `허용`을 누른 뒤 `granted=true`로 바뀐 것을 확인했다.
- debug APK 단독 실행 직후에는 흰 화면이 보였고, 기존 Metro 8081 서버와 `adb reverse tcp:8081 tcp:8081` 연결 후 앱을 재시작하자 Expo Router 부트스트랩 화면과 Today 화면이 정상 렌더링됐다.
- Today 화면에서 `현재 계획 없음`, 원형 시간판, `새 계획 추가`, 하단 `오늘/동기` 탭을 확인했다.
- Motivation 탭 전환 후 `동기`, `2026-05 체인 완료 0개`, `회복 기여`, `월간 캘린더` 화면을 확인했다.
- 최신 Recovery UX blocked reschedule 화면은 빈 저장소 상태라 Emulator에서 직접 재현하지 않았고, `tests/expo-reschedule-visibility-reasons.test.ts` 자동 테스트 결과로 연결한다.

## Validation Result

- `npm test -- tests/expo-router-route-actions.test.ts tests/expo-reschedule-visibility-reasons.test.ts tests/expo-bootstrap-and-reminders.test.ts tests/expo-start-reminder-sync.test.ts tests/expo-router-provider-state.test.ts`
- `npm run typecheck`
- `./gradlew assembleDebug`
- `adb uninstall` + `adb install apps/expo/android/app/build/outputs/apk/debug/app-debug.apk`
- `adb reverse tcp:8081 tcp:8081`
- Android Emulator Today/Motivation screenshot evidence: `/private/tmp/codex-screen9.png`
