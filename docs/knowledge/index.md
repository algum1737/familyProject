# Knowledge Index

이 파일은 knowledge 계층의 탐색 시작점이다. 새 페이지를 추가하거나 이동할 때 한 줄 요약과 함께 갱신한다.

## Source Notes

- [Karpathy LLM Wiki](./source-notes/karpathy-llm-wiki.md) — 지속적으로 갱신되는 LLM 관리형 Markdown 위키 패턴
- [Android Schedule Alarms](./source-notes/android-schedule-alarms.md) — exact alarm 선택, 권한 확인과 재예약에 관한 Android 공식 기준
- [Expo Notifications](./source-notes/expo-notifications.md) — Expo 알림 예약·취소 API와 Android 권한 요구사항
- [Google Play Exact Alarm Policy](./source-notes/google-play-exact-alarm-policy.md) — `USE_EXACT_ALARM` 제한 권한과 허용 사용 사례
- [Google Play Create App](./source-notes/google-play-create-app.md) — Play Console 앱 레코드 생성 입력과 선언 절차
- [Google Play Testing Tracks](./source-notes/google-play-testing-tracks.md) — internal, closed, open testing 트랙의 목적과 전제
- [Google Play Personal Account Testing](./source-notes/google-play-personal-account-testing.md) — 신규 개인 계정의 production 접근 전 testing 조건
- [Google Play Data Safety](./source-notes/google-play-data-safety.md) — 트랙별 Data Safety와 privacy policy 적용 기준
- [Google Play App Signing](./source-notes/google-play-app-signing.md) — app signing key와 upload key의 역할

## Concepts

- [Persistent Knowledge](./concepts/persistent-knowledge.md) — 대화 결과를 재사용 가능한 지식 자산으로 외부화하는 개념
- [Retrieval-Augmented Generation](./concepts/rag.md) — 질문 시점에 관련 원문 조각을 검색해 답변하는 방식

## Entities

- 현재 등록된 entity 페이지가 없다.

## Syntheses

- [Harness Knowledge Layer](./syntheses/harness-knowledge-layer.md) — LLM Wiki 패턴을 familyProject 하네스에 적용한 설계
- [Android Notification Reliability](./syntheses/android-notification-reliability.md) — 공식 exact alarm 기준과 프로젝트 실기기·AAB 증거를 결합한 검증 지식
- [Google Play Release Readiness](./syntheses/google-play-release-readiness.md) — app record부터 internal testing과 production 접근까지의 checkpoint

## Search

```bash
rg -n -i "키워드|동의어" docs/knowledge docs/references
```
