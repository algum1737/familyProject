---
id: SOURCE-NOTE-GOOGLE-PLAY-TESTING-TRACKS
type: source-note
title: Google Play Testing Tracks
status: verified
confidence: high
tags: [google-play, internal-testing, release]
sources: [SRC-GOOGLE-PLAY-TESTING-TRACKS]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Testing Tracks

## Summary

Google Play은 internal, closed, open testing을 서로 다른 배포 범위와 목적에 맞게 제공한다. 공식 문서는 빠른 초기 피드백을 위해 internal testing부터 시작한 뒤 closed testing으로 확장하는 흐름을 권장한다.

## Supported Claims

- internal testing은 소규모 신뢰 tester에게 빌드를 빠르게 배포하는 초기 검증 트랙이다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.
- internal testing은 앱별 최대 100명의 tester를 관리할 수 있다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.
- 첫 앱 번들을 internal testing에 올리면 초기에는 임시 앱 이름이 보일 수 있으며, artifact 업로드 뒤 package name은 고정된다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.
- internal tester가 open 또는 closed test를 받으려면 기존 internal test에서 opt-out한 뒤 대상 test에 opt-in해야 한다. 근거: `SRC-GOOGLE-PLAY-TESTING-TRACKS`.

## Project Interpretation

- familyProject의 첫 외부 설치 경로는 production보다 internal testing이 적절하다.
- 첫 AAB 업로드 전에 `com.familyproject.todaydidyoufinish` package name, versionCode와 서명 경로를 최종 확인해야 한다.
- internal testing 설치 후 핵심 흐름과 알림 QA를 통과한 뒤 계정 유형에 따라 closed testing을 준비한다.

## Open Questions

- 첫 internal tester 목록과 피드백 채널을 어떻게 구성할 것인가.
- internal testing 설치 기기에서 exact alarm 접근 off/on 두 경로를 모두 검증할 것인가.
