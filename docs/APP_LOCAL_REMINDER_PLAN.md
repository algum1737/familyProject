# App Local Reminder Plan

## Goal

앱 전환 시 로컬 알림과 인앱 리마인드가 어떤 역할을 맡아야 하는지, 그리고 현재 `ReminderProvider` 계약을 어떤 방향으로 유지할지 고정한다.

이 문서는 알림 기술 자체보다 제품 규칙과 구현 경계를 먼저 정리하기 위한 초안이다.

시뮬레이터에서의 QA 운영 기준과 한계는 [APP_REMINDER_SIMULATOR_QA.md](./APP_REMINDER_SIMULATOR_QA.md)에서 따로 관리한다.

## Product Rules Already Fixed

현재까지 웹 검증으로 고정된 규칙:

- 시작 리마인드는 `시작 5분 전 ~ 시작 후 10분` 창에서 1회만 본다.
- 시작 전에는 `닫기`만 노출한다.
- 시작 후에는 `지금 완료` 또는 `닫기`로 반응할 수 있다.
- 종료 5분 전 회복 알림은 `계속 진행` 1액션만 둔다.
- `회고 열기`, `다시 지정`은 종료 5분 전 알림에 넣지 않는다.
- 회고와 다시 지정은 종료 직후 `missed` 카드 흐름에서 처리한다.

## Reminder Split

앱에서는 알림을 둘로 나눠 본다.

### A. OS Local Notification

역할:

- 앱이 백그라운드이거나 꺼져 있을 때 시작 시점 근처를 알려주는 신호

첫 버전 원칙:

- 시작 리마인드만 OS 알림 후보로 본다
- 종료 5분 전 회복 알림은 첫 버전에서 OS 알림으로 보내지 않는다

이유:

- 시작 알림은 `지금 해야 할 계획 인지`와 직접 연결된다
- 종료 5분 전 회복 알림은 인앱 맥락에서 가볍게 보는 편이 맞고, OS 수준까지 올리면 과해질 가능성이 크다

### B. In-App Reminder UI

역할:

- 앱이 열려 있을 때 현재 계획 맥락과 즉시 행동을 보여주는 UI

첫 버전 원칙:

- 시작 리마인드는 인앱 배너 유지
- 종료 5분 전 `계속 진행` 배너도 인앱 UI로 유지
- `missed` 이후 회고/다시 지정은 카드나 시트 흐름으로 유지

## First Version Scope

첫 앱 버전에서 포함할 것:

1. 시작 시점 근처 1회 OS 로컬 알림
2. 앱 진입 시 같은 일정에 대한 인앱 시작 리마인드 배너
3. 종료 5분 전 `이미 마쳤다면 완료 처리` OS 로컬 알림 1회
4. 종료 5분 전 `계속 진행` 인앱 배너
5. 종료 직후 `missed` 카드 흐름

첫 앱 버전에서 제외할 것:

- 스누즈
- 반복 알림
- 다단계 리마인드
- 알림 우선순위 세분화

## Recommendation

### Start Reminder

- OS 로컬 알림: Yes
- 인앱 배너: Yes

이유:

- 앱이 꺼져 있을 때도 시작 시점을 알려줄 수 있어야 한다
- 앱 안에서는 `지금 완료`까지 이어지는 짧은 경로가 있어야 한다

### End-5-Minute Reminder

- OS 로컬 알림: Yes
- 인앱 배너: Yes

이유:

- `실제로는 일을 했는데 완료 버튼을 누르지 않아 missed가 되는 사례`를 직접 줄일 수 있다
- 종료 직전에는 새로운 행동보다 `이미 마쳤다면 완료 처리` 같은 가벼운 확인 문구가 적절하다
- 인앱에서는 여전히 `계속 진행` 배너를 유지해, 앱을 보고 있는 사용자에게는 더 즉각적인 맥락을 준다

### Missed Recovery

- OS 로컬 알림: No
- 인앱 카드/시트: Yes

이유:

- 회고와 다시 지정은 문맥 의존적 행동이라 인앱 흐름이 더 자연스럽다

## Provider Direction

현재 계약:

- `sync(plans, now)`
- `schedule(request)`
- `cancel(planId)`

이 계약은 첫 앱 버전에서도 유지 가능하다.

권고 해석:

- `schedule(request)`: 시작 리마인드 OS 알림 예약
- `schedule(request)`: 시작 또는 종료 5분 전 OS 알림 예약
- `cancel(planId)`: 해당 계획의 시작 리마인드 예약 취소
- `sync(plans, now)`: 계획 변경 시 시작/종료 알림 예약 재조정

중요:

- 종료 5분 전 `계속 진행` 배너는 여전히 화면 상태 규칙으로 처리한다
- 즉, 종료 5분 전에는 `OS 알림 + 인앱 배너`가 함께 존재할 수 있다

## App Flow Mapping

### 1. Plan Created or Edited

- 계획 저장
- `ReminderProvider.sync(...)` 호출
- 시작 시점 근처 알림만 예약

### 2. App Open Near Start Time

- 인앱 시작 리마인드 배너 노출
- 사용자는 `지금 완료` 또는 `닫기`

### 3. App Open Near End Time

- 종료 5분 전 OS 로컬 알림이 이미 예약돼 있을 수 있다
- 종료 5분 전 `계속 진행` 인앱 배너 노출
- 사용자는 `계속 진행`

### 4. Plan Not Completed After End

- 상태가 `missed`로 전환
- 카드에서 `회고`, `다시 지정` 진입

## Technical Preference

첫 앱 버전은 `Expo + React Native` 기준으로 가정한다.

기술 선택 원칙:

- Expo 관리 워크플로우와 잘 맞아야 한다
- 로컬 일정 예약과 취소가 단순해야 한다
- 백그라운드 장기 자동화보다 단일 로컬 알림 신뢰성이 우선이다

문서 수준 결론:

- 시작 리마인드용 Expo 로컬 알림 계열 구현을 우선 사용한다
- 종료 5분 전 `완료 처리 유도`도 Expo 로컬 알림으로 보낸다
- 종료 5분 전 `계속 진행` 배너는 인앱 UI로 유지한다

## Android Exact Alarm Policy

Android 실기기 QA에서 Expo notifications는 Android native에서 `canScheduleExactAlarms()`가 true일 때 `setExactAndAllowWhileIdle`을 사용하고, 그렇지 않으면 `setAndAllowWhileIdle`로 fallback하는 것을 확인했다. 기존 앱 manifest에는 exact alarm 권한이 없어 Samsung 실기기에서 start-5 목표보다 약 6~8분 늦는 window가 붙었다.

현재 정책:

- `SCHEDULE_EXACT_ALARM`을 Android manifest에 선언한다.
- 앱 설정 메뉴에서 exact alarm 접근 상태를 확인하고, 접근이 없으면 Android의 정확한 알림 설정 화면으로 이동할 수 있게 한다.
- `USE_EXACT_ALARM`은 설치 시 부여되지만 calendar/alarm clock 성격 앱에 가까운 권한이고 Play 정책 검토 리스크가 크므로 현재는 선언하지 않는다.
- exact alarm 권한이 꺼져 있으면 Expo notifications는 inexact fallback을 쓰므로, start-5 알림은 OS 정책에 따라 몇 분 늦을 수 있다.

제품 판단:

- `시작 5분 전` 문구를 유지하려면 Android에서 exact alarm 접근이 켜져 있어야 한다.
- exact alarm 접근을 켜지 않은 사용자에게는 알림이 도착하지 않는 문제가 아니라 “정확한 시각보다 늦을 수 있는 문제”로 안내한다.
- 실제 배포 전에는 Play Console 권한 선언과 개인정보 처리방침의 알림/정확한 알림 설명을 함께 맞춘다.

## What To Track

앱 전환 후에도 아래는 계속 본다.

- 시작 알림이 실제 앱 진입이나 완료 전환으로 이어지는지
- 종료 5분 전 인앱 배너가 과한지
- `missed` 이후 회고/다시 지정 진입이 자연스러운지
- 실제 수행은 했지만 완료 버튼을 누르지 않아 `missed`로 남는 사례가 반복되는지

## Revisit Triggers

아래 중 하나가 반복되면 알림 정책을 다시 본다.

- 시작 알림이 자주 무시되고 인앱 배너만 의미가 있을 때
- 종료 직후 회고 진입이 자주 놓쳐져 종료 전 보조 알림 필요성이 커질 때
- 사용자가 종료 5분 전 인앱 배너도 거슬린다고 느낄 때
- 실제 운영에서 `완료 버튼 누락 때문에 발생한 missed`가 반복돼, 종료 직전 확인 신호가 통계 왜곡과 사용자 혼란을 동시에 만들 때

## Follow-up

이 문서 다음으로 필요한 것은 아래다.

1. 웹 공용 계층과 앱 전용 UI 계층 경계 초안
2. 앱 타입 초안에서 `date` 포함 기록 모델과 reminder selector 입력 타입 정리
