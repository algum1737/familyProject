# Expo Local Reminder Retry QA

## Goal

Expo 앱의 OS 로컬 알림이 권한 초기화 이후 iOS 시뮬레이터에서 실제로 수신되는지 다시 검증하고, 가능하면 일정 수정/삭제 후 예약 갱신까지 확인한다.

## Scope

- Expo Metro/dev-client 재기동
- 시뮬레이터 앱 상태 초기화 또는 재설치로 알림 권한 재요청 조건 확보
- foreground/background 시작 5분 전 알림 재현
- 가능하면 종료 5분 전 완료 유도 알림과 일정 수정/삭제 후 예약 갱신 확인
- 결과 문서화

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 실제 QA는 iOS 시뮬레이터 기준으로 우선 진행한다.
- 실제 iPhone 연결 여부는 현재 세션에서 보장되지 않는다.

## Steps

1. Metro/dev-client와 시뮬레이터 상태를 다시 준비한다.
2. 앱 상태를 초기화해 알림 권한 재요청 조건을 만든다.
3. 짧은 테스트 일정으로 foreground/background 시작 알림을 재검증한다.
4. 가능하면 종료 알림과 수정/삭제 후 예약 갱신까지 이어서 확인한다.
5. 결과와 제한 사항을 기록하고 completed로 이동한다.

## Validation

- 알림 권한 프롬프트 또는 권한 상태를 확인해야 한다.
- foreground 또는 background 중 최소 한 경로에서 시작 5분 전 알림 수신 여부를 확인해야 한다.
- 가능하면 종료 5분 전 알림과 예약 갱신/취소도 확인해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 없음

## Result

- Expo Metro/dev-client는 재기동 후 `dev-client` 모드로 정상 연결됐다.
- 시뮬레이터의 기존 설치 앱을 제거한 뒤 `npx expo run:ios -d 'iPhone 17 Pro' --no-bundler`로 개발 빌드를 재설치했다.
- 재설치 직후 앱을 열자 알림 권한 프롬프트가 실제로 다시 노출되는 것을 확인했다.
- `Computer Use` 인증 오류와 macOS 보조 접근 제한 때문에 프롬프트를 직접 누르지는 못했지만, 시뮬레이터 내부 `BulletinBoard` 섹션 정보는 `authorizationStatus = 2`로 풀렸고 프롬프트도 이후 사라졌다.
- 앱 저장소를 직접 조작해 `현재 시각 + 8분 시작 / +16분 종료` 테스트 일정을 주입한 뒤 앱을 실행하고 백그라운드로 내렸다.
- 홈 화면 캡처에서는 시작 알림 배너가 보이지 않았지만, 시뮬레이터 `Library/UserNotifications/.../DeliveredNotifications.plist`에는 `알림 재검증 시작 5분 전입니다.`와 `알림 재검증 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`가 실제로 기록됐다.
- 즉 Expo 로컬 알림의 권한 재요청, 예약, 시스템 전달까지는 재현됐고, 남은 불확실성은 `시뮬레이터 홈 화면 배너 표시`와 `수정/삭제 후 예약 갱신`이다.

## Verification

- 실제 iOS 시뮬레이터 수동 QA:
  - Metro/dev-client 재기동 확인
  - 앱 삭제 후 개발 빌드 재설치 확인
  - 알림 권한 프롬프트 재노출 확인
  - 홈 화면 캡처로 배너 시각 확인
  - `DeliveredNotifications.plist`에서 시작/종료 알림 전달 기록 확인
- `bash scripts/validate-docs.sh`

## Follow-up

- 실제 iPhone 또는 시뮬레이터 알림 배너가 확실히 보이는 환경에서 foreground/background 배너 가시성을 다시 확인해야 한다.
- 계획 수정/삭제 후 `PendingNotifications.plist`와 전달 기록이 어떻게 갱신되는지 후속 QA가 필요하다.
