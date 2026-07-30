---
id: CONCEPT-RAG
type: concept
title: Retrieval-Augmented Generation
status: verified
confidence: high
tags: [rag, retrieval, llm]
sources: [SRC-KARPATHY-LLM-WIKI]
created: 2026-07-30
updated: 2026-07-30
---

# Retrieval-Augmented Generation

## Summary

질문 시점에 관련 원문 조각을 검색하고 그 결과를 모델 컨텍스트에 제공해 답변을 생성하는 방식이다.

## Supported Claims

- LLM Wiki 제안은 일반적인 문서 질의 경험을 질문마다 관련 조각을 다시 찾고 조립하는 방식으로 설명한다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- 지속 위키는 반복되는 종합 결과를 미리 문서화해 매 질문의 재합성 비용을 줄이려 한다. 근거: `SRC-KARPATHY-LLM-WIKI`.

## Project Interpretation

- Knowledge Layer는 RAG를 제거하지 않는다. 지식 페이지가 많아지면 관련 문서를 찾는 검색 단계가 여전히 필요하다.
- 초기에는 `index.md`와 `rg`를 사용하고, 검색 품질이 실제 병목이 될 때 BM25 또는 하이브리드 검색을 검토한다.
- 중요한 답변은 파생 지식뿐 아니라 raw source 포인터까지 역추적해야 한다.

## Open Questions

- 검색 규모와 지연시간 중 어떤 지표를 전문 검색 도입 기준으로 사용할지 정해야 한다.
- 의미 검색 도입 시 로컬 처리와 외부 서비스 중 보안 기준을 정해야 한다.
