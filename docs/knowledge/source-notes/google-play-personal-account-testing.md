---
id: SOURCE-NOTE-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING
type: source-note
title: Google Play Personal Account Testing
status: verified
confidence: high
tags: [google-play, closed-testing, account]
sources: [SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Personal Account Testing

## Summary

Google Play은 2023년 11월 13일 이후 생성된 개인 개발자 계정에 production 접근 전 closed testing 조건을 적용한다. internal testing은 선택 사항이지만 초기 검증 경로로 권장된다.

## Supported Claims

- 2023년 11월 13일 이후 생성된 개인 개발자 계정은 production 배포 전에 별도 testing 요구사항을 충족해야 한다. 근거: `SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING`.
- 2026-07-30 확인 기준으로 closed test에 tester 12명 이상이 14일 연속 opt-in 상태를 유지해야 production access를 신청할 수 있다. 근거: `SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING`.
- 조건 충족 뒤에도 closed test, 앱 가치와 production readiness에 관한 질문에 답해 production access를 신청해야 한다. 근거: `SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING`.
- internal testing은 이 production 접근 조건과 별개인 선택적 초기 트랙이다. 근거: `SRC-GOOGLE-PLAY-PERSONAL-ACCOUNT-TESTING`.

## Project Interpretation

- familyProject는 계정 유형과 생성일을 확인하기 전까지 closed test 조건을 확정 blocker로 간주하지 않는다.
- 신규 개인 계정이면 tester 모집과 14일 연속 opt-in 기간이 제품 코드보다 긴 lead time이 될 수 있다.
- tester 수와 기간은 변경 가능한 정책값이므로 production 계획 수립 직전에 원문을 다시 확인한다.

## Open Questions

- 사용할 개발자 계정은 개인 계정인가 조직 계정인가.
- closed testing이 필요할 경우 실제 사용자에 가까운 tester 12명과 피드백 수집 경로를 확보할 수 있는가.
