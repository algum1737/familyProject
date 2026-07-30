---
id: SOURCE-NOTE-GOOGLE-PLAY-CREATE-APP
type: source-note
title: Google Play Create App
status: verified
confidence: high
tags: [google-play, app-record, release]
sources: [SRC-GOOGLE-PLAY-CREATE-APP]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Create App

## Summary

Play Console 앱 레코드는 개발자 계정 생성 후 기본 언어, 표시 이름, 앱 유형, 무료·유료 여부, 연락처 이메일과 필수 선언을 입력해 만든다.

## Supported Claims

- Play Console 앱 생성은 개발자 계정이 준비된 뒤 `All apps`의 앱 생성 흐름에서 시작한다. 근거: `SRC-GOOGLE-PLAY-CREATE-APP`.
- 생성 시 기본 언어, 앱 표시 이름, 앱 또는 게임 여부와 무료·유료 여부를 선택한다. 근거: `SRC-GOOGLE-PLAY-CREATE-APP`.
- 사용자 연락처 이메일을 제공하고 개발자 정책·수출 관련 선언과 Play App Signing 약관을 확인한다. 근거: `SRC-GOOGLE-PLAY-CREATE-APP`.

## Project Interpretation

- familyProject의 후보 입력값은 [Play Console 제출 준비](../../APP_PLAY_CONSOLE_SUBMISSION_PREP.md)에 유지하고 실제 화면에서 최종 확정한다.
- 앱 레코드 생성은 package name 사용 가능 여부와 콘솔 계정 상태를 처음으로 확인하는 외부 checkpoint다.
- 연락처 이메일과 개발자 표시 정보는 공개 범위를 확인한 뒤 입력해야 한다.

## Open Questions

- 현재 로그인 계정의 개발자 계정 유형과 본인 인증 상태는 무엇인가.
- 앱 표시 이름과 공개 연락처 이메일을 최종 승인할 사람은 누구인가.
