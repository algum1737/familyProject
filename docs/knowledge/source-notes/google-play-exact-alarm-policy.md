---
id: SOURCE-NOTE-GOOGLE-PLAY-EXACT-ALARM-POLICY
type: source-note
title: Google Play Exact Alarm Policy
status: verified
confidence: high
tags: [google-play, policy, exact-alarm]
sources: [SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Exact Alarm Policy

## Summary

Google Play는 자동 부여되는 `USE_EXACT_ALARM`을 제한 권한으로 다루며, 앱의 핵심 사용자 기능이 정확한 시각을 필요로 하는 alarm, timer 또는 calendar 계열 사용 사례인지 심사한다. 그 범위에 맞지 않으면 사용자 승인형 `SCHEDULE_EXACT_ALARM`을 검토하도록 안내한다.

## Supported Claims

- `USE_EXACT_ALARM`은 Android 13 이상에서 제한되는 권한이며, 선언 앱은 Play 검토 대상이 된다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.
- 허용 사례는 핵심 사용자 기능이 정확한 시각을 요구하는 alarm, timer 또는 event notification을 제공하는 calendar 앱에 초점을 둔다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.
- 위 범위에 해당하지 않는 exact alarm 사용 사례는 `SCHEDULE_EXACT_ALARM` 대안을 검토해야 한다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.
- 앱은 Play Console의 관련 declaration에서 기능과 권한 사용을 설명해야 할 수 있다. 근거: `SRC-GOOGLE-PLAY-EXACT-ALARM-POLICY`.

## Project Interpretation

- `오늘 다 했니?`는 전용 alarm clock이나 calendar 앱으로 확정되지 않았으므로 `USE_EXACT_ALARM` 미선언을 유지하는 현재 판단이 정책 위험을 줄인다.
- `SCHEDULE_EXACT_ALARM` 사용도 자동 승인으로 간주하지 않고, 사용자 목적·설정 UX·스토어 설명·privacy 문구를 일관되게 유지해야 한다.
- 최종 적합성은 실제 Play Console permission summary와 정책 검토 결과로 확인한다.

## Open Questions

- Play Console이 현재 AAB의 `SCHEDULE_EXACT_ALARM`에 별도 declaration을 요구하는지 첫 업로드 후 확인해야 한다.
- 제품 포지셔닝이 일정 알림 핵심 앱으로 바뀌면 권한 설명과 정책 적합성을 다시 검토해야 한다.
