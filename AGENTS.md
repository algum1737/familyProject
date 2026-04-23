# AGENTS.md

이 파일은 이 리포지터리의 짧은 작업 맵이다. 세부 규칙은 `docs/`에서 찾는다.

## Mission

- 목표는 `오늘 다 했니?` 프로그램과 이를 지속적으로 개발할 수 있는 하네스를 함께 구축하는 것이다.
- 사람은 방향, 우선순위, 승인, 제품 판단을 담당한다.
- 에이전트는 설계, 구현, 테스트, 문서화, 검증, 정리 작업을 수행한다.

## First Reads

작업 시작 전 아래 순서로 읽는다.

1. `README.md`
2. `ARCHITECTURE.md`
3. `docs/index.md`
4. 관련 `docs/product-specs/*`
5. 관련 `docs/exec-plans/active/*`

## Operating Rules

- 리포지터리 밖에만 있는 지식은 없는 것으로 간주한다.
- 요구사항이 불명확하면 추정하지 말고 `Assumptions` 섹션에 기록한다.
- 새 규칙이 반복되면 문서에 남기고, 가능하면 스크립트나 테스트로 승격한다.
- 큰 작업은 반드시 `docs/exec-plans/active/`에 실행 계획을 남긴다.
- 완료된 계획은 `docs/exec-plans/completed/`로 이동한다.
- 구현 변경은 사용자가 명시적으로 `진행하자`, `수정해`, `적용해`처럼 승인한 경우에만 수행한다.

## Output Expectations

- 변경에는 목적, 이유, 검증 방법이 있어야 한다.
- 제품 코드보다 먼저 작업 환경과 검증 루프를 정리한다.
- 문서만 제안하지 말고 강제 가능한 항목은 스크립트나 CI 후보로 표시한다.

## Key Docs

- 아키텍처 맵: `ARCHITECTURE.md`
- 문서 인덱스: `docs/index.md`
- 제품 가정: `docs/product-specs/today-did-you-finish.md`
- 원본 기획서: `기획/오늘_다했니_기획서.txt`
- 품질 기준: `docs/QUALITY_SCORE.md`
- 신뢰성 기준: `docs/RELIABILITY.md`
- 보안 기준: `docs/SECURITY.md`
