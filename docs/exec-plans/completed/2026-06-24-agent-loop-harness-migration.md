# Agent Loop Harness Migration

## Goal

Codex agent loop 관점을 기존 `familyProject` 하네스에 병합해, 작업 시작 맥락, 계획, 도구 관찰, 검증, 인계 흐름을 문서와 검증 스크립트에서 명확히 한다.

## Scope

- `docs/AGENT_LOOP.md` 추가
- `AGENTS.md`, `docs/index.md`, `docs/PLANS.md`, `docs/HANDOFF.md`에 agent loop 문서와 운영 관계 연결
- `scripts/validate-docs.sh`에 agent loop 문서와 active plan 관찰/검증 섹션 검사 추가
- 마이그레이션 완료 범위와 검증 결과 기록 후 completed plan으로 이동

## Out Of Scope

- 제품 코드 변경
- Expo/Android 빌드 또는 런타임 QA
- 기존 completed plan 본문 정리
- `docs/HANDOFF.md` 전체 재작성

## Assumptions

- 현재 변경은 하네스 문서와 검증 스크립트 보강만 다룬다.
- `familyProject`의 기존 제품 사실, 릴리스 상태, QA 기록은 유지한다.
- `docs/HANDOFF.md`는 매우 길기 때문에 필요한 항목만 최소 수정한다.

## Pre-flight checks

- 현재 작업 브랜치: `docs/agent-loop-harness-migration`
- 마이그레이션 전 `bash scripts/validate-docs.sh` 통과 확인
- 현재 active exec plan은 `.gitkeep` 외에 없음
- `docs/AGENT_LOOP.md`는 마이그레이션 전 존재하지 않음

## Steps

1. `docs/AGENT_LOOP.md`를 추가한다.
2. `AGENTS.md`의 First Reads와 Key Docs에 agent loop 문서를 추가한다.
3. `docs/index.md`의 Core Documents에 agent loop 문서를 추가한다.
4. `docs/PLANS.md`에 `/goal`, `/plan`, exec plan, HANDOFF 관계와 `Observation Log` 기준을 추가한다.
5. `docs/HANDOFF.md`의 Read First와 최근 진행 상태에 agent loop 마이그레이션을 반영한다.
6. `scripts/validate-docs.sh`에 `docs/AGENT_LOOP.md`, `Observation Log`, `Validation Result` 검사를 추가한다.
7. 검증 후 이 계획을 completed로 이동하고 `docs/index.md`, `docs/HANDOFF.md`를 갱신한다.

## Automated tests

- `bash scripts/validate-docs.sh`
- `rg '<[A-Z_]+>' .`

## Manual/Runtime QA

- `AGENTS.md`, `docs/index.md`, `docs/PLANS.md`, `docs/HANDOFF.md`가 `docs/AGENT_LOOP.md`를 과도한 중복 없이 가리키는지 확인한다.
- `docs/AGENT_LOOP.md`가 `familyProject`의 Expo/Android QA와 기존 observation 기록 방식에 맞는지 확인한다.

## Skipped/Not Run

- 제품 코드 테스트, Expo 빌드, Android 실기기 QA는 문서/하네스 마이그레이션 범위 밖이므로 실행하지 않는다.

## Observation Log

- 마이그레이션 시작 전 `bash scripts/validate-docs.sh`는 통과했다.
- 마이그레이션 시작 전 `docs/AGENT_LOOP.md`는 없었다.
- 마이그레이션 시작 전 실제 active plan은 없고 `.gitkeep`만 있었다.
- `docs/AGENT_LOOP.md`를 추가하고 `AGENTS.md`, `docs/index.md`, `docs/PLANS.md`, `docs/HANDOFF.md`에 연결했다.
- `scripts/validate-docs.sh`에 agent loop 문서, `Observation Log`, `Validation Result` 검사를 추가했다.
- 중간 검증에서 `bash scripts/validate-docs.sh`가 통과했다.
- `rg '<[A-Z_]+>' . --glob '!node_modules/**' --glob '!.next/**' --glob '!apps/expo/node_modules/**'`는 기존 completed plan의 플레이스홀더 설명 문장 1건만 보고했다.

## Open Work

- 없음.

## Completion

- Completed.
- `docs/AGENT_LOOP.md`를 추가했다.
- `/goal`, `/plan`, active exec plan, HANDOFF 관계를 `docs/PLANS.md`와 `docs/AGENT_LOOP.md`에 기록했다.
- 새 세션의 읽기 흐름에 `docs/AGENT_LOOP.md`를 추가했다.
- active plan 관찰/검증 섹션을 `scripts/validate-docs.sh`로 검사하도록 했다.

## Validation Result

- 통과: `bash scripts/validate-docs.sh`
- 확인: `rg '<[A-Z_]+>' . --glob '!node_modules/**' --glob '!.next/**' --glob '!apps/expo/node_modules/**'`
  - 신규 잔여 플레이스홀더는 없음.
  - 기존 completed plan의 템플릿 플레이스홀더 설명 문장 1건은 의도된 기록으로 판단.
- 미실행: 제품 코드 테스트, Expo 빌드, Android 실기기 QA
  - 이유: 이번 작업은 문서/하네스 마이그레이션 범위이며 제품 코드 변경이 없음.
