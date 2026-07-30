---
id: SOURCE-NOTE-EXPO-NOTIFICATIONS
type: source-note
title: Expo Notifications
status: verified
confidence: high
tags: [expo, notifications, android]
sources: [SRC-EXPO-NOTIFICATIONS]
created: 2026-07-30
updated: 2026-07-30
---

# Expo Notifications

## Summary

Expo Notifications는 로컬·푸시 알림 권한, 예약, 조회와 취소 API를 제공한다. Android에서는 재부팅 후 예약 복구를 위한 권한을 자동 추가하고, Android 12 이상에서 정확한 시각 알림을 예약하려면 exact alarm 권한을 manifest에 선언하도록 안내한다.

## Supported Claims

- `scheduleNotificationAsync()`는 미래 시점 알림을 예약하고 식별자를 반환하며, 예약 조회와 취소 API가 별도로 제공된다. 근거: `SRC-EXPO-NOTIFICATIONS`.
- Android에서는 `RECEIVE_BOOT_COMPLETED`가 library manifest를 통해 추가돼 재부팅 후 예약 알림 설정에 사용된다. 근거: `SRC-EXPO-NOTIFICATIONS`.
- Android 12 이상에서 정확한 시각에 알림을 트리거하려면 `SCHEDULE_EXACT_ALARM` 선언이 필요하다. 근거: `SRC-EXPO-NOTIFICATIONS`.
- 예약 요청이 성공해도 실제 알림 표시를 위해서는 적절한 notification handler와 OS 권한·채널 설정이 필요하다. 근거: `SRC-EXPO-NOTIFICATIONS`.

## Project Interpretation

- familyProject는 Expo 예약 식별자를 저장·취소·재동기화하는 계약과 Android 권한 계약을 함께 검증해야 한다.
- Expo 공개 문서는 실제 native alarm method와 권한 부재 시 fallback을 모두 보장하지 않으므로, 설치 버전의 native 코드와 회귀 테스트를 별도 근거로 유지한다.
- latest 문서와 설치된 `expo-notifications` 버전이 다를 수 있어 SDK 업데이트 시 source note를 재검토한다.

## Open Questions

- Expo SDK 업데이트 후 Android native alarm 선택 로직이 바뀌는지 자동 감지할 범위를 정해야 한다.
- notification handler, 채널과 OS 권한을 하나의 릴리스 preflight로 묶을지 결정해야 한다.
