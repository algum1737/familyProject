# Harness Knowledge Layer Update

## Goal

기존 `familyProject` 하네스의 제품 문서와 작업 이력을 보존하면서, 외부 자료를 출처와 함께 축적하고 저장소 안에서 검색할 수 있는 Markdown knowledge 계층을 추가한다.

## Scope

- `docs/references/sources/`에 변경하지 않는 출처 레코드 구조를 추가한다.
- `docs/knowledge/`에 source note, concept, entity, synthesis 구조를 추가한다.
- Karpathy의 LLM Wiki 글을 첫 출처로 등록하고 하네스 적용 분석을 저장한다.
- `scripts/validate-knowledge.sh`로 frontmatter, 출처 참조, 인덱스와 링크 무결성을 검증한다.
- `AGENTS.md`, `README.md`, `docs/index.md`, `docs/AGENT_LOOP.md`에 knowledge 탐색 흐름을 연결한다.
- `package.json`, `scripts/validate-docs.sh`, CI 검증 흐름에 knowledge 검증을 통합한다.
- 완료 시 계획, 문서 인덱스와 `docs/HANDOFF.md`를 갱신한다.

## Out Of Scope

- 웹 기반 위키 UI 또는 별도 검색 서버
- 벡터 데이터베이스, 임베딩, RAG 런타임
- 기존 제품 코드와 Expo 앱 동작 변경
- 기존 완료 계획과 제품 문서의 대규모 재작성
- 외부 자료의 원문 전문 저장

## Assumptions

- 초기 검색은 `rg`를 사용한 저장소 내부 텍스트 검색으로 충분하다.
- 파생 knowledge는 제품 명세나 승인된 설계를 자동으로 덮어쓰지 않는다.
- Karpathy 글의 발행일은 원문에서 확인되지 않아 출처 레코드에 `unknown`으로 기록한다.
- 현재 하네스의 제품별 필수 문서 검증 규칙은 그대로 유지한다.

## Pre-flight checks

- [x] `main`과 `origin/main`이 `d3c3837`에서 일치한다.
- [x] 원본 작업 트리가 깨끗하다.
- [x] `docs/harness-knowledge-layer` 브랜치와 별도 worktree를 생성했다.
- [x] 기존 `scripts/validate-docs.sh`와 `scripts/test-check-handoff-loop.sh`가 통과한다.
- [x] 기존 knowledge 계층과 `scripts/validate-knowledge.sh`가 없음을 확인했다.

## Steps

- [x] 출처 레코드와 knowledge 디렉터리 계약을 추가한다.
- [x] 첫 source note, concept, synthesis를 작성한다.
- [x] knowledge 검증 스크립트를 추가한다.
- [x] 에이전트 진입 문서와 문서 인덱스에 검색 흐름을 연결한다.
- [x] package 및 CI 검증 경로에 knowledge 검증을 통합한다.
- [x] 자동 검증과 변경 검토를 수행한다.
- [x] 계획을 completed로 이동하고 handoff를 갱신한다.

## Task Breakdown

### Task 1: Knowledge storage contract

- Files:
  - `docs/references/sources/SRC-KARPATHY-LLM-WIKI.md`
  - `docs/knowledge/README.md`
  - `docs/knowledge/index.md`
  - `docs/knowledge/log.md`
  - `docs/knowledge/source-notes/karpathy-llm-wiki.md`
  - `docs/knowledge/concepts/*.md`
  - `docs/knowledge/entities/README.md`
  - `docs/knowledge/syntheses/harness-knowledge-layer.md`
  - `docs/generated/knowledge-lint/README.md`

### Task 2: Validation and entry points

- Files:
  - `scripts/validate-knowledge.sh`
  - `scripts/validate-docs.sh`
  - `package.json`
  - `.github/workflows/ci.yml`
  - `AGENTS.md`
  - `README.md`
  - `docs/index.md`
  - `docs/AGENT_LOOP.md`

### Task 3: Completion record

- Files:
  - `docs/HANDOFF.md`
  - `docs/exec-plans/completed/2026-07-30-harness-knowledge-layer.md`

## Automated tests

- `bash scripts/validate-knowledge.sh`
- `bash scripts/validate-docs.sh`
- `bash scripts/test-check-handoff-loop.sh`
- `npm run typecheck`
- `npm test`

## Manual/Runtime QA

- `docs/knowledge/index.md`에서 모든 파생 knowledge 페이지로 이동 가능한지 확인한다.
- `rg -n -i "persistent knowledge|rag|지식" docs/knowledge docs/references`로 저장소 내부 검색 흐름을 확인한다.
- Git diff에서 기존 제품 코드와 완료 계획이 변경되지 않았는지 확인한다.

## Skipped/Not Run

- 브라우저 및 실제 기기 QA: 제품 런타임을 변경하지 않는 문서·검증 하네스 작업이므로 실행하지 않는다.
- 프로덕션 빌드와 E2E: 제품 코드와 빌드 구성을 변경하지 않으므로 기본 검증 계약에서는 제외한다.
- 외부 웹 재수집: 출처 내용은 이미 검토하고 저장한 source record를 기준으로 하며 이번 구현에서는 네트워크 재수집을 수행하지 않는다.

## Observation Log

- 2026-07-30: 기존 하네스는 Agent Loop, exec plan, handoff, CI와 제품별 검증을 이미 갖추고 있다.
- 2026-07-30: 최신 템플릿과의 주요 차이는 source-backed knowledge 계층과 `validate-knowledge.sh`다.
- 2026-07-30: 기존 문서 검증과 handoff-loop 시나리오 테스트가 변경 전 기준점에서 통과했다.
- 2026-07-30: Karpathy LLM Wiki 출처 1개와 source note, concept 2개, synthesis 1개를 추가했다.
- 2026-07-30: knowledge/docs/handoff 검증, TypeScript typecheck와 전체 Vitest 110개가 통과했다.
- 2026-07-30: `rg` 검색으로 knowledge index에서 파생 페이지와 원본 포인터까지 탐색 가능한 것을 확인했다.

## Open Work

- 없음.

## Completion

- 상태: 완료
- 완료 범위:
  - 출처 레코드와 파생 knowledge 저장 계약
  - 최초 source note, persistent knowledge/RAG concept, familyProject 적용 synthesis
  - 구조·참조·인덱스·링크 무결성 검증 스크립트
  - AGENTS, README, Agent Loop, 문서 인덱스, package와 CI 연결
  - 완료 계획, 문서 인덱스와 handoff 갱신

## Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Knowledge validation | 통과 | `npm run validate:knowledge` — source 1개, knowledge page 4개 |
| Docs validation | 통과 | `npm run validate:docs` |
| Handoff-loop scenarios | 통과 | `npm run test:handoff-loop` |
| TypeScript typecheck | 통과 | `npm run typecheck` |
| Vitest | 통과 | `npm test` — 19 files, 110 tests |
| Manual repository search | 통과 | `rg`로 index, concept, synthesis와 source pointer 검색 확인 |
