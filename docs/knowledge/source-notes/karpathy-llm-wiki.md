---
id: SOURCE-NOTE-KARPATHY-LLM-WIKI
type: source-note
title: Karpathy LLM Wiki
status: verified
confidence: high
tags: [llm, wiki, knowledge-management]
sources: [SRC-KARPATHY-LLM-WIKI]
created: 2026-07-30
updated: 2026-07-30
---

# Karpathy LLM Wiki

## Summary

LLM이 원문을 질문 때마다 다시 조립하는 데 그치지 않고, 상호 연결된 Markdown 위키를 지속적으로 작성하고 유지하는 패턴을 제안한다. 사람은 자료 선택과 판단을 맡고 LLM은 요약, 연결, 갱신, 정비를 담당한다.

## Supported Claims

- 패턴은 immutable raw sources, LLM-managed wiki, 운영 schema의 세 계층을 둔다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- 핵심 작업은 ingest, query, lint로 구성된다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- `index.md`는 내용 중심 탐색 지도이고 `log.md`는 시간순 작업 기록이다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- 규모가 커지기 전에는 Markdown 인덱스와 로컬 검색만으로 시작할 수 있다. 근거: `SRC-KARPATHY-LLM-WIKI`.

## Project Interpretation

- 현재 하네스의 `AGENTS.md`와 `docs/AGENT_LOOP.md`는 schema 역할의 상당 부분을 이미 수행한다.
- `docs/references/`, 새 `docs/knowledge/`, 검증 스크립트를 결합하면 별도 웹서비스 없이 MVP를 구성할 수 있다.
- 제품 명세와 보안 정책까지 LLM 소유로 두면 권위 경계가 무너지므로, 파생 지식과 규범 문서를 분리해야 한다.

## Open Questions

- 프로젝트별로 원문 전문을 저장할지 URL과 해시만 저장할지 결정해야 한다.
- 수백 페이지를 넘을 때 어떤 로컬 검색기를 도입할지 사용량을 근거로 판단해야 한다.
- 팀 환경에서 의미 변경을 PR 필수 검토 대상으로 만들지 결정해야 한다.
