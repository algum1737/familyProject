# Expo Reminder Banner Visibility QA

## Goal

Expo 로컬 알림이 iOS 시뮬레이터 또는 현재 접근 가능한 환경에서 foreground/background 배너로 실제로 눈에 보이는지 다시 검증한다.

## Scope

- Expo Metro/dev-client 준비
- 시뮬레이터와 앱 권한 상태 확인
- 시작 5분 전, 종료 5분 전 알림의 foreground/background 배너 가시성 관찰
- 필요하면 내부 전달 기록과 pending 예약 파일을 함께 대조
- 결과 문서화

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 실제 iPhone 연결은 보장되지 않으므로 우선 iOS 시뮬레이터에서 가능한 범위까지 확인한다.
- 배너가 시각적으로 보이지 않더라도 시스템 전달 기록이 있으면 그 차이를 명시적으로 기록한다.

## Steps

1. Metro/dev-client와 시뮬레이터 상태를 준비한다.
2. 알림 테스트용 미래 일정을 준비하고 foreground/background 시나리오를 만든다.
3. 배너 시각 노출 여부와 내부 전달 기록을 함께 확인한다.
4. 결과와 제약을 기록하고 completed로 이동한다.

## Validation

- foreground 또는 background 중 최소 한 경로에서 배너 노출 여부를 명시적으로 확인해야 한다.
- 전달 기록을 확인했다면 배너 가시성과 구분해서 기록해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 실제 iPhone에서 같은 시나리오로 OS 배너가 보이는지 후속 검증이 필요하다.

## Result

- `xcrun simctl` 경로를 권한 상승으로 다시 열어, 부팅된 `iPhone 17 Pro` 시뮬레이터와 앱 컨테이너를 직접 제어했다.
- 앱을 종료한 홈 화면 상태에서 종료 5분 전 로컬 알림 시점 `2026-05-12 10:55:33 +0900`에 스크린샷을 캡처했지만, 상단 OS 배너는 보이지 않았다.
- 같은 시점의 `DeliveredNotifications.plist`에는 `배너 QA 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.` 기록이 남아 있어, 시스템 전달과 홈 화면 배너 가시성이 분리되는 현상을 다시 확인했다.
- foreground 비교를 위해 `포그라운드 QA` 일정을 넣고 앱 화면을 `2026-05-12 10:56:55 +0900`에 캡처했다. 별도 OS 배너는 보이지 않았지만, 앱 하단에는 `리마인드: 포그라운드 QA · 곧 시작` 인앱 리마인드 상태가 표시됐다.
- 결론적으로 현재 시뮬레이터에서는 background/foreground 모두 `OS 배너가 화면에 보이지 않는 반면`, 내부 전달 기록 또는 인앱 리마인드 상태는 확인된다.

## Validation Result

- background home screen screenshot와 foreground app screenshot으로 배너 가시성 여부를 확인했다.
- `DeliveredNotifications.plist`에서 종료 5분 전 알림 전달 기록을 확인했다.
- `bash scripts/validate-docs.sh`가 통과했다.
