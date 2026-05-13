# Expo Notification Foreground Background QA

## Goal

Expo Android 앱에서 로컬 알림이 앱 foreground/background 상태에서 실제 사용자에게 어떻게 보이는지 확인하고, 재현 가능한 QA 절차와 증거 기준을 남긴다.

## Scope

- Android Emulator 기준 알림 권한, 시작 5분 전 알림, 종료 5분 전 알림 수신 확인
- 앱이 foreground일 때와 background/home 상태일 때의 관찰 결과 분리
- ADB 또는 Android 시스템 화면에서 확인 가능한 pending/delivered 상태 증거 수집
- 결과를 `docs/HANDOFF.md`와 관련 QA 문서에 반영

## Out Of Scope

- Google Play Developer 계정 생성과 production 접근
- Play Console app record 생성과 production `.aab` 업로드
- iOS credential setup
- 실제 Android 물리 기기 QA. 필요하면 Emulator QA 이후 별도 계획으로 진행한다.

## Assumptions

- 현재 제품 방향은 출시보다 앱 완성도와 QA를 우선한다.
- Android Emulator는 이미 준비돼 있고, `com.familyproject.todaydidyoufinish` preview APK 설치 검증은 완료된 상태다.
- 시작/종료 5분 전 알림 scheduling 로직은 기존 단위 테스트와 simulator 파일 기준 QA로 어느 정도 확인됐다.
- 이번 작업은 알림 로직 구현 변경보다 실제 수신/가시성 증거 확보를 우선한다.

## Steps

1. 현재 Emulator와 설치된 앱 상태를 확인한다.
2. 알림 권한 상태와 앱 foreground/background 전환 방법을 고정한다.
3. 가까운 미래 일정으로 시작 5분 전, 종료 5분 전 알림을 재현한다.
4. foreground 상태의 인앱/OS 알림 표시 결과를 기록한다.
5. background/home 상태의 OS 알림 배너 또는 알림 shade 표시 결과를 기록한다.
6. 필요하면 ADB dumpsys, screenshot, pending notification 상태를 보조 증거로 남긴다.
7. 결과와 남은 리스크를 문서에 반영한다.

## Validation

- `bash scripts/validate-docs.sh` 통과.
- 루트 `npm run typecheck` 통과.
- QA 결과에는 테스트 환경, 앱 상태, 일정 시각, 기대 알림 시각, 실제 관찰 결과, 증거 경로 또는 명령을 포함했다.

## QA Result

- 환경: Android Emulator, package `com.familyproject.todaydidyoufinish`, version `0.1.0`, versionCode `1`, targetSdk `36`.
- 권한: `android.permission.POST_NOTIFICATIONS` granted, app notification importance `DEFAULT`.
- 테스트 일정: UI에서 생성한 일정 `뼈_로_ㅠㅎ`, 최초 `11:05 - 11:50`, 이후 background 검증을 위해 `11:05 - 11:12`로 편집.
- foreground 시작 5분 전: `2026-05-13 11:00 KST` 전후 앱 foreground 상태에서 `리마인드: 뼈_로_ㅠㅎ · 곧 시작` 인앱 리마인드가 Today 화면 하단에 노출됐다.
- foreground OS 알림: 같은 시점 앱 foreground 화면에서는 별도 heads-up 배너가 보이지 않았다. `dumpsys notification --noredact` 기준 app usage stats는 `numPostedByApp=5`, `note_importance_` DEFAULT 기록이 존재했다.
- background 종료 5분 전: 종료 시간을 `11:12`로 저장한 뒤 Home으로 내려 `2026-05-13 11:07:28 KST`에 notification shade에서 `오늘 다 했니 · 지금`, 제목 `오늘 다 했니`, 본문 `뼈_로_ㅠㅎ 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.` 알림을 확인했다.
- dismiss 동작: notification shade에서 해당 알림을 좌측으로 스와이프하자 앱 알림이 목록에서 사라졌고, 시스템 알림만 남았다.
- 보조 증거: 화면 캡처는 `/private/tmp/codex-screen9.png`에 마지막 상태로 남겼고, 확인 명령은 `adb shell screencap`, `adb pull`, `adb shell cmd statusbar expand-notifications`, `adb shell dumpsys notification --noredact`를 사용했다.

## Remaining Work

- 실제 Android 기기에서의 알림 체감 QA는 별도 후속 후보로 남긴다.
- Play Console 릴리스 대기열은 사용자가 `밀린 업무 진행하자`라고 할 때 재개한다.

## Completion

Completed. Android Emulator 기준 foreground 인앱 리마인드, background OS 알림 shade 노출, 알림 스와이프 제거를 확인했다.
