---
id: CONCEPT-PERSISTENT-KNOWLEDGE
type: concept
title: Persistent Knowledge
status: verified
confidence: high
tags: [knowledge, memory, markdown]
sources: [SRC-KARPATHY-LLM-WIKI]
created: 2026-07-30
updated: 2026-07-30
---

# Persistent Knowledge

## Summary

대화에서 생성된 요약과 분석을 일회성 응답으로 끝내지 않고, 출처와 연결된 버전 관리 문서로 축적해 다음 작업의 컨텍스트로 재사용하는 방식이다.

## Supported Claims

- 지속 위키는 새 자료가 들어올 때 기존 개념, 개체, 종합 페이지를 함께 갱신한다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- 좋은 질의 결과를 다시 위키에 기록하면 자료 수집뿐 아니라 탐색과 분석도 누적된다. 근거: `SRC-KARPATHY-LLM-WIKI`.

## Project Interpretation

- 하네스의 exec plan과 HANDOFF는 작업 상태를 저장하고, knowledge 계층은 장기 지식을 저장한다.
- 두 상태를 분리하면 현재 작업 정보가 지식 문서를 오염시키거나 오래된 분석이 현재 계획처럼 해석되는 일을 줄일 수 있다.
- Markdown과 Git을 사용하면 에이전트와 사람이 같은 변경 이력을 검토할 수 있다.

## Open Questions

- 어떤 질의 결과를 저장할 가치가 있는지 프로젝트별 선별 기준이 필요하다.
- 오래된 지식의 재검증 주기를 시간 기준으로 할지 출처 변경 기준으로 할지 결정해야 한다.
