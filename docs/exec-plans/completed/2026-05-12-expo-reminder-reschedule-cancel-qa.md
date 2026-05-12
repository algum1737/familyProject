# Expo Reminder Reschedule Cancel QA

## Goal

Expo 로컬 알림이 계획 수정과 삭제 이후에 예약/전달 기록을 예상대로 갱신하거나 제거하는지 시뮬레이터 기준으로 확인한다.

## Scope

- Expo Metro/dev-client 재기동
- 시뮬레이터 앱 저장소에 미래 테스트 일정 주입
- 계획 수정 후 `PendingNotifications.plist`와 전달 기록 변화를 확인
- 계획 삭제 후 예약 제거 여부를 확인
- 결과 문서화

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 실제 QA는 iOS 시뮬레이터와 내부 `UserNotifications` 저장소 관찰 기준으로 진행한다.
- 홈 화면 배너 가시성 자체는 이번 턴의 핵심 범위가 아니다.

## Steps

1. Metro/dev-client와 시뮬레이터 상태를 준비한다.
2. 미래 테스트 일정을 저장소에 주입하고 예약 파일 상태를 기록한다.
3. 같은 일정의 시간을 수정한 뒤 예약 파일이 새 시각 기준으로 갱신되는지 본다.
4. 일정을 삭제한 뒤 pending 예약이 제거되는지 본다.
5. 결과와 제한 사항을 기록하고 completed로 이동한다.

## Validation

- `PendingNotifications.plist` 또는 `Schedule.plist` 변화로 수정 후 재예약 여부를 확인해야 한다.
- 삭제 후 pending 예약이 비워지는지 확인해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 없음

## Result

- Expo Metro/dev-client를 다시 올린 뒤 시뮬레이터 앱 저장소에 미래 테스트 일정을 직접 주입해 예약 상태를 관찰했다.
- 초기 상태에서는 `PendingNotifications.plist`에 `QA-Initial 시작 5분 전입니다.`와 `QA-Initial 종료 5분 전입니다. 이미 마쳤다면 완료 처리해 주세요.`가 함께 잡혔다.
- 같은 `id`의 일정을 더 늦은 시각과 새 제목 `QA-Modified`로 덮어쓴 뒤 앱을 재실행하자, `PendingNotifications.plist`의 pending 항목이 `QA-Modified ...`로 교체됐다.
- 마지막으로 저장소를 비우고 앱을 다시 실행하자 `PendingNotifications.plist`의 pending 배열은 비워졌다.
- 즉 Expo 로컬 알림은 시뮬레이터 기준으로 `수정 시 재예약`, `삭제 시 pending 제거`가 동작한다.

## Verification

- 실제 iOS 시뮬레이터 + 내부 저장소 QA:
  - 초기 pending 예약 확인
  - 수정 후 pending 제목/예약 교체 확인
  - 삭제 후 pending 비움 확인
- `bash scripts/validate-docs.sh`

## Follow-up

- 실제 iPhone 또는 배너 노출이 확실한 환경에서 `수정 후 새 배너만 보이는지`, `삭제 후 배너가 더 이상 오지 않는지`까지 사용자 체감 수준 QA가 남아 있다.
