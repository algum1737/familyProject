---
id: SYNTHESIS-ANDROID-NOTIFICATION-RELIABILITY
type: synthesis
title: Android Notification Reliability
status: verified
confidence: medium
tags: [android, notifications, exact-alarm, reliability]
sources: [SRC-ANDROID-SCHEDULE-ALARMS, SRC-EXPO-NOTIFICATIONS, SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY]
created: 2026-07-30
updated: 2026-07-30
---

# Android Notification Reliability

## Summary

`오늘 다 했니?`의 Android 로컬 리마인드는 Expo 예약 API, Android exact alarm special access, notification 권한·채널과 재동기화 로직이 함께 맞아야 한다. 현재 프로젝트는 사용자 승인형 `SCHEDULE_EXACT_ALARM`만 선언하고 접근 가능 시 exact delivery를 사용하며, 접근이 없을 때는 지연 가능한 fallback을 허용한다.

## Supported Claims

- Android는 가능한 경우 inexact alarm을 권장하고, 정확한 시각이 사용자에게 중요한 기능에만 exact alarm을 사용하도록 안내한다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.
- `SCHEDULE_EXACT_ALARM`은 사용자가 부여·철회할 수 있고 Android 13 이상 target의 fresh install에는 기본 부여되지 않으므로 런타임 확인과 재예약이 필요하다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.
- Expo Notifications는 Android 12 이상에서 정확한 시각 알림을 예약하려면 `SCHEDULE_EXACT_ALARM`을 manifest에 선언하도록 안내한다. 근거: `SRC-EXPO-NOTIFICATIONS`.
- Google Play는 `USE_EXACT_ALARM`을 alarm, timer 또는 calendar 핵심 기능에 초점을 둔 제한 권한으로 다루고 그 외 사용 사례에는 `SCHEDULE_EXACT_ALARM` 검토를 안내한다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.
- 알림 예약 성공은 OS가 실제 notification을 표시했다는 뜻이 아니며, handler, notification 권한과 채널이 별도로 필요하다. 근거: `SRC-EXPO-NOTIFICATIONS`.

## Project Interpretation

현재 프로젝트 계약은 다음과 같다.

| Layer | Project contract | Project evidence |
| --- | --- | --- |
| Manifest and Play policy | `SCHEDULE_EXACT_ALARM`은 유지하고 `USE_EXACT_ALARM`은 선언하지 않는다. | [Android start notification precision](../../exec-plans/completed/2026-05-20-android-start-notification-precision.md), [production permission refresh](../../exec-plans/completed/2026-06-11-android-production-permission-summary-refresh.md) |
| Runtime access | `canScheduleExactAlarms()`로 상태를 확인하고 사용자를 `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` 설정 화면으로 안내한다. | [Android notification regression guard](../../exec-plans/completed/2026-06-02-android-notification-regression-guard.md) |
| Access granted | 설치된 Expo native 구현은 exact alarm을 사용하며, Samsung `SM_S908N` 한 대에서 target 대비 약 `0.106s` 지연과 `window=0`을 관찰했다. | [Android start notification precision](../../exec-plans/completed/2026-05-20-android-start-notification-precision.md) |
| Access unavailable | 설치된 Expo native 구현은 inexact alarm으로 fallback하며, 같은 실기기 계열의 한 관찰에서 target 대비 약 `2분 57초` 지연됐다. 앱은 지연 알림을 조기에 취소하지 않도록 15분 delivery grace를 둔다. | [Android timing real-device QA](../../exec-plans/completed/2026-05-15-android-start-notification-timing-real-device-qa.md) |
| Release artifact | 2026-06-11 EAS production AAB에서 `SCHEDULE_EXACT_ALARM`은 남고 `USE_EXACT_ALARM`과 제거 대상 권한은 없었다. Play Console summary는 아직 확인하지 못했다. | [production permission refresh](../../exec-plans/completed/2026-06-11-android-production-permission-summary-refresh.md) |

위 실기기 수치는 Android나 Expo의 일반 보장이 아니라 특정 기기·빌드·시점의 프로젝트 관찰이다. 다른 제조사, 절전 상태와 OS 버전으로 일반화하지 않는다.

최소 릴리스 검증 계약:

1. production AAB의 merged/packaged manifest와 Play Console permission summary를 대조한다.
2. fresh install에서 notification 권한과 exact alarm 접근이 모두 꺼진 경로를 확인한다.
3. exact alarm 접근을 켠 뒤 예약 레코드의 `window=0`, notification shade 문구와 실제 `when` 시각을 확인한다.
4. 일정 수정·삭제와 앱 재시작 뒤 중복 또는 잔여 pending alarm이 없는지 확인한다.
5. target SDK, Expo SDK, `expo-notifications`, Android Gradle Plugin, manifest 또는 native bridge가 바뀌면 실기기 timing QA를 다시 실행한다.

## Open Questions

- 시작 5분 전과 종료 5분 전 알림 모두 exact delivery가 제품 핵심 가치에 필요한가.
- 15분 grace가 사용자에게 너무 늦은 알림을 보여주는 문제보다 더 나은지 실제 사용 데이터가 필요하다.
- Samsung 외 제조사와 최신 Android 버전의 최소 기기 행렬을 어떻게 구성할 것인가.
- Play Console이 `SCHEDULE_EXACT_ALARM`에 어떤 declaration 또는 경고를 표시하는지 첫 AAB 업로드 후 확인해야 한다.
