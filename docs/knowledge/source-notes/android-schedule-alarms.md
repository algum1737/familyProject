---
id: SOURCE-NOTE-ANDROID-SCHEDULE-ALARMS
type: source-note
title: Android Schedule Alarms
status: verified
confidence: high
tags: [android, exact-alarm, notifications]
sources: [SRC-ANDROID-SCHEDULE-ALARMS]
created: 2026-07-30
updated: 2026-07-30
---

# Android Schedule Alarms

## Summary

Android는 대부분의 작업에 inexact alarm을 권장하고, 사용자에게 정확한 시각이 중요한 기능에만 exact alarm을 사용하도록 안내한다. exact alarm 권한은 종류별 승인 방식과 적용 범위가 다르며 사용자 승인 상태를 런타임에서 다시 확인해야 한다.

## Supported Claims

- exact alarm은 사용자에게 정확한 시각이 중요한 기능에 한해 사용해야 하며, Android는 가능한 경우 inexact alarm을 권장한다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.
- Android 13 이상을 대상으로 할 때 `SCHEDULE_EXACT_ALARM`과 `USE_EXACT_ALARM`은 승인 방식과 사용 사례가 다르다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.
- `SCHEDULE_EXACT_ALARM`은 사용자가 부여하고 철회할 수 있으며, Android 13 이상을 대상으로 하는 fresh install에는 기본 부여되지 않는다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.
- 앱은 `canScheduleExactAlarms()`로 접근 상태를 확인하고, 승인 후 필요한 exact alarm을 다시 예약해야 한다. 근거: `SRC-ANDROID-SCHEDULE-ALARMS`.

## Project Interpretation

- familyProject의 시작·종료 전 리마인드는 사용자가 지정한 시간에 연결되지만, exact alarm 필요성은 배터리 비용과 실제 지연 허용 범위를 함께 검토해야 한다.
- 현재 `SCHEDULE_EXACT_ALARM` 상태 확인과 설정 이동 UX는 공식 권한 흐름에 부합한다. 구현과 검증 기준은 [Expo 릴리스 체크리스트](../../APP_EXPO_RELEASE_CHECKLIST.md)를 따른다.
- 접근이 없을 때의 fallback과 Samsung 실기기 지연 수치는 Android 공식 보장이 아니라 프로젝트별 관찰로 취급한다.

## Open Questions

- 시작 5분 전과 종료 5분 전 알림 모두 exact alarm이 필요한지 사용자 가치 기준으로 다시 검토해야 한다.
- 제조사와 절전 모드별 허용 지연을 어떤 QA 행렬로 유지할지 결정해야 한다.
