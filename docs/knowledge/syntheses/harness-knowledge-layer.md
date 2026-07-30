---
id: SYNTHESIS-HARNESS-KNOWLEDGE-LAYER
type: synthesis
title: Harness Knowledge Layer
status: verified
confidence: medium
tags: [harness, knowledge-layer, architecture]
sources: [SRC-KARPATHY-LLM-WIKI]
created: 2026-07-30
updated: 2026-07-30
---

# Harness Knowledge Layer

## Summary

familyProject 하네스의 문서 기반 작업 루프에 references, knowledge, knowledge lint를 추가해 외부 자료와 반복 가능한 분석을 장기 자산으로 유지하는 설계다.

## Supported Claims

- 원본, 파생 위키, 운영 schema를 분리하면 원본을 보존하면서 종합 지식을 지속 갱신할 수 있다. 근거: `SRC-KARPATHY-LLM-WIKI`.
- ingest, query, lint는 자료 추가, 지식 활용, 드리프트 정비의 기본 루프를 제공한다. 근거: `SRC-KARPATHY-LLM-WIKI`.

## Project Interpretation

현재 하네스에는 다음 대응 관계가 있다.

| Knowledge pattern | Harness surface |
| --- | --- |
| Raw source | `docs/references/sources/*` |
| Derived wiki | `docs/knowledge/*` |
| Schema | `AGENTS.md`, `docs/knowledge/README.md` |
| Index | `docs/knowledge/index.md` |
| Log | `docs/knowledge/log.md` |
| Structural lint | `scripts/validate-knowledge.sh` |
| Semantic lint report | `docs/generated/knowledge-lint/*` |

규범 문서와 파생 지식을 분리하는 것이 핵심 경계다. 에이전트는 knowledge를 유지할 수 있지만 제품 명세, 보안 정책, 승인된 아키텍처 변경은 기존 계획과 승인 절차를 따라야 한다.

초기 검색은 아래 순서로 충분하다.

```text
Natural-language query
  -> knowledge/index.md
  -> rg keyword and synonym search
  -> synthesis/concept/source-note
  -> raw source verification
```

## Open Questions

- entity 페이지가 필요해지는 최소 반복 언급 기준을 정해야 한다.
- 의미 lint 보고서의 실행 주기를 수동, CI, 정기 자동화 중 어디에 둘지 결정해야 한다.
- 비개발 사용자가 늘어나면 정적 문서 사이트와 전용 웹 UI 중 어느 수준이 필요한지 재평가해야 한다.
