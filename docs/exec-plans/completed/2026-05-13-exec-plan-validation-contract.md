# Exec Plan Validation Contract

## Goal

작업 계획과 완료 기록에서 테스트/검증 항목이 빠지지 않도록 exec plan 검증 계약 포맷을 현재 프로젝트와 범용 template-repo에 함께 반영한다.

## Scope

- 현재 프로젝트 `AGENTS.md` 운영 규칙 보강
- 현재 프로젝트 `docs/PLANS.md` 상세 포맷 보강
- `/Users/hun/workspace/하네스시스템구축방법/template-repo`의 동일 문서에 범용 규칙 반영
- 문서 검증 실행

## Out Of Scope

- 제품 코드 변경
- 테스트 스크립트 신규 작성
- 기존 completed plan 일괄 재작성

## Assumptions

- 현재 프로젝트와 template-repo 모두 `AGENTS.md`는 짧은 운영 규칙, `docs/PLANS.md`는 상세 계획 작성 기준으로 사용한다.
- template-repo에는 제품 고유 명칭 없이 범용 문구로 반영한다.

## Steps

1. 현재 프로젝트와 template-repo의 계획/운영 문서를 확인한다.
2. `AGENTS.md`에는 검증 계약을 작업 시작 전 고정하고 완료 시 대조한다는 규칙을 추가한다.
3. `docs/PLANS.md`에는 `Pre-flight checks`, `Automated tests`, `Manual/Runtime QA`, `Skipped/Not Run`, `Validation Result` 기준을 추가한다.
4. 현재 프로젝트와 template-repo에서 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 현재 프로젝트 `bash scripts/validate-docs.sh`
- template-repo `bash scripts/validate-docs.sh`

## Open Work

- 강제 스크립트나 CI 체크 승격은 별도 후속 작업으로 판단한다.

## Completion

- 완료일: 2026-05-13
- 현재 프로젝트 `AGENTS.md`에 exec plan 검증 계약을 작업 시작 전에 고정하고 완료 시 `Validation Result`에서 대조한다는 운영 규칙을 추가했다.
- 현재 프로젝트 `docs/PLANS.md`에 `Validation Contract`와 `Recommended Plan Sections`를 추가했다.
- template-repo `AGENTS.md`에도 같은 운영 규칙을 범용 문구로 추가했다.
- template-repo `docs/PLANS.md`에도 같은 검증 계약 포맷을 범용 문구로 추가했다.
- template-repo는 독립 git repository가 아니므로 `git status`는 확인하지 않았다.

## Validation Result

- 현재 프로젝트: `bash scripts/validate-docs.sh` 통과
- template-repo: `bash scripts/validate-docs.sh` 통과
