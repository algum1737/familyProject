# Harness Template Operations Update

## Goal

현재 프로젝트에서 반복 확인된 하네스 운영 규칙을 명시적으로 정리하고, 같은 규칙을 `/Users/hun/workspace/하네스시스템구축방법` 템플릿에도 반영해 다른 프로젝트에 재사용할 수 있게 만든다.

## Scope

- 현재 프로젝트의 하네스 운영 문서 보강
- active/completed 실행 계획 생명주기 규칙 명확화
- 커밋 후 HANDOFF 갱신 규칙 재확인
- 작업 브랜치/승인/검증 루프 규칙을 템플릿에 반영
- 템플릿 적용 체크리스트와 검증 스크립트에 강제 가능한 항목 추가

## Assumptions

- `/Users/hun/workspace/하네스시스템구축방법`은 다른 프로젝트에 복사해 쓰는 템플릿 키트다.
- 현재 프로젝트에서 확인된 운영 규칙은 제품 특화 규칙이 아니라 템플릿에도 적용할 수 있는 공통 하네스 규칙이다.
- 외부 템플릿 디렉터리는 현재 작업 리포지터리 밖에 있으므로 쓰기 권한이 필요할 수 있다.

## Steps

1. 현재 프로젝트와 템플릿 문서의 규칙 차이를 확인한다.
2. 현재 프로젝트 문서에 하네스 운영 규칙을 보강한다.
3. 템플릿 문서와 템플릿 리포 뼈대에 동일한 운영 규칙을 반영한다.
4. 검증 스크립트가 active plan과 completed plan 구조를 검사하도록 보강한다.
5. 변경 결과를 검증하고 완료 기록을 남긴 뒤 이 계획을 completed로 이동한다.

## Validation

- 현재 프로젝트 문서 검증 스크립트가 통과해야 한다.
- 템플릿의 `validate-docs.sh`가 템플릿 샘플 적용본에서 통과해야 한다.
- 템플릿 문서에 작업 시작/종료 기록, active/completed 이동, HANDOFF 갱신, 브랜치 승인 규칙이 포함돼야 한다.

## Completion

Completed. 현재 프로젝트 문서에는 active plan 시작/종료 기록, completed 이동, HANDOFF 갱신, active plan의 `Open Work` 명시 검증을 반영했고, `/Users/hun/workspace/하네스시스템구축방법` 템플릿에는 같은 운영 규칙과 검증 스크립트/가이드를 반영했다.

## Validation Result

- 현재 프로젝트의 `bash scripts/validate-docs.sh`가 통과했다.
- `/Users/hun/workspace/하네스시스템구축방법/template-repo`의 `bash scripts/validate-docs.sh`는 통과했다.
- `/private/tmp/harness-template-validate.4ukoSN/sample` 템플릿 샘플 적용본의 `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- None.
