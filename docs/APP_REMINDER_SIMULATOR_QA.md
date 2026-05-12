# App Reminder Simulator QA

## Purpose

이 문서는 Expo 로컬 알림을 iOS 시뮬레이터에서 점검할 때 무엇을 `성공 신호`로 볼지, 무엇은 실제 기기에서 다시 봐야 하는지를 분리해 기록한다.

정책 자체는 [APP_LOCAL_REMINDER_PLAN.md](./APP_LOCAL_REMINDER_PLAN.md)에 두고, 이 문서는 QA 운영 기준만 다룬다.

## Current Known Behavior

현재 completed QA 기록 기준:

- iOS 시뮬레이터에서 `DeliveredNotifications.plist`에는 시작 5분 전, 종료 5분 전 알림 기록이 남을 수 있다.
- 앱이 foreground일 때는 인앱 리마인드 상태가 보일 수 있다.
- 하지만 같은 시점의 home screen 또는 app screen 캡처에서 상단 OS 배너가 보이지 않을 수 있다.

즉 시뮬레이터에서는 아래 두 신호를 분리해서 봐야 한다.

- `시스템 전달 또는 예약이 되었는가`
- `사용자 눈에 배너가 실제로 보였는가`

## What Simulator QA Can Confirm

시뮬레이터에서 신뢰할 수 있는 확인 범위:

1. pending 예약 생성 여부
2. 계획 수정 후 예약 교체 여부
3. 계획 삭제 후 예약 취소 여부
4. delivered 기록 존재 여부
5. foreground 인앱 리마인드 상태 표시 여부

이 범위는 파일과 앱 상태 기준으로 확인한다.

## What Simulator QA Cannot Close Reliably

시뮬레이터만으로는 아래를 최종 통과로 닫지 않는다.

1. background OS 배너가 사용자의 눈에 항상 보이는지
2. foreground에서 iOS가 별도 배너를 띄우는지
3. 실제 기기 알림 센터/잠금 화면 UX가 자연스러운지
4. 벤더별 Android 알림 표시 차이

이 항목은 실제 iPhone 또는 Android 기기 QA로 넘긴다.

## Recommended Simulator Checklist

### A. Scheduling

- 미래 `pending` 일정 1개 생성
- 시작 5분 전, 종료 5분 전 두 알림이 pending에 잡히는지 확인

### B. Reschedule

- 같은 일정의 제목 또는 시각 수정
- 기존 예약이 사라지고 새 예약으로 교체되는지 확인

### C. Delete

- 일정 삭제
- pending 알림이 비워지는지 확인

### D. Delivery

- 시뮬레이터 시간을 알림 시점으로 이동
- `DeliveredNotifications.plist`에 기록이 쌓이는지 확인

### E. Foreground App State

- 앱을 켠 상태에서 시작/종료 시점 근처 진입
- 인앱 리마인드 상태가 기대대로 보이는지 확인

## Evidence Hierarchy

QA 기록에서 우선순위는 아래 순서로 적는다.

1. pending 예약 파일
2. delivered 기록 파일
3. 앱 foreground 인앱 상태
4. 화면 배너 스크린샷

이유:

- 현재 시뮬레이터에서는 1~3은 재현되지만 4는 일관되지 않다.
- 그래서 시뮬레이터 screenshot만 보고 `알림 실패`로 단정하지 않는다.

## Exit Criteria

시뮬레이터 QA를 `통과`로 볼 최소 조건:

- 예약 생성/교체/삭제가 파일 기준으로 확인됨
- delivered 기록 또는 인앱 상태 중 하나로 시점 도달이 확인됨

실제 사용자 가시성까지 `완료`로 닫을 조건:

- 물리 iPhone 또는 Android 기기에서 OS 배너 노출 확인

## Follow-up

- 실제 iPhone이 연결되면 시작 5분 전, 종료 5분 전 배너 가시성을 다시 확인한다.
- 실제 iPhone이 없으면 Android 실제 기기 QA로 대체한다.
