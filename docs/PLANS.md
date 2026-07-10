# Plans

## Rules

- 큰 작업은 구현 전에 반드시 `exec-plans/active/`에 실행 계획을 만든다.
- 실행 계획은 목표, 범위, 가정, 단계, 리스크, 검증 방법, 남은 작업 여부를 포함한다.
- 진행 중 계획은 `exec-plans/active/`에 둔다.
- 작업이 완료되면 완료 범위와 검증 결과를 계획 문서에 기록한다.
- 검증 기준을 충족하고 남은 작업이 없으면 계획 문서를 `exec-plans/completed/`로 이동한다.
- 계획을 이동할 때는 `docs/index.md`와 `docs/HANDOFF.md`도 함께 갱신한다.
- 완료됐는지 애매한 작업은 `active/`에 남기되 `Open Work`와 다음 판단 기준을 적는다.

## Goal, Plan, And Exec Plan

- `/goal`은 현재 Codex 스레드에 붙는 지속 목표다. 긴 작업의 방향과 완료 기준을 기억시키는 데 쓴다.
- `/plan`은 구현 전에 접근 방식, 범위, 위험, 검증 방법을 다듬는 데 쓴다.
- `docs/exec-plans/active/*`는 리포지터리에 남는 작업 계획이다. `/goal`이나 `/plan`에서 정한 내용을 실제 파일 상태와 검증 계약으로 고정한다.
- `docs/HANDOFF.md`는 다음 세션이 같은 맥락에서 이어받기 위한 인계 문서다.

긴 작업은 `/goal`만으로 끝내지 않는다. 완료 기준과 검증 결과는 active exec plan에 남기고, 완료 후 completed로 이동한다.

## Validation Contract

실행 계획은 작업 시작 전에 검증 계약을 먼저 고정하고, 완료 시 같은 항목을 결과와 대조한다.

- `Pre-flight checks`: 브랜치, active plan 존재, 관련 문서/파일, 기존 상태, 외부 도구 연결 여부처럼 작업 전 확인해야 하는 항목을 적는다.
- `Automated tests`: 실행할 단위 테스트, 통합 테스트, E2E, 타입체크, 린트, 문서 검증 명령을 구체적인 명령어로 적는다.
- `Manual/Runtime QA`: 브라우저, 에뮬레이터, 실제 기기, 스크린샷, 접근성 트리, 로그처럼 사람이 보거나 런타임에서 확인할 흐름과 증거 기준을 적는다.
- `Skipped/Not Run`: 실행하지 않을 검증 또는 실행하지 못할 가능성이 있는 검증을 미리 적고, 범위 밖/환경 없음/네트워크 제한/기기 없음 같은 이유를 명시한다.
- `Observation Log`: 도구 실행 결과, 로그, 실패 원인, 재시도 여부, 남은 리스크를 작업 중에 기록한다.
- `Validation Result`: 완료 시 실제 실행한 명령과 결과를 `통과`, `실패`, `미실행`으로 기록하고, 실패나 미실행은 후속 작업 또는 남은 리스크로 연결한다.

## Superpowers-Compatible Detail

Superpowers가 설치된 환경에서는 `writing-plans`의 실행 가능성 기준을 이 문서 체계 안에 반영한다.

- 계획은 `docs/exec-plans/active/`에 저장한다. 별도 요청이 없으면 `docs/superpowers/plans/`를 만들지 않는다.
- 각 작업은 checkbox 형태의 작은 단계로 나눈다.
- 코드 변경 단계에는 정확한 파일 경로와 필요한 경우 코드 조각을 포함한다.
- 테스트 단계에는 실행 명령, 기대 실패 또는 기대 성공 결과를 적는다.
- 기능 또는 버그 수정은 가능한 한 RED-GREEN-REFACTOR 순서로 계획한다.
- 구현 후에는 계획의 요구사항 충족 여부와 코드 품질을 분리해 검토한다.
- 추정, 미확정, 실행하지 못한 검증은 빈칸으로 두지 않고 `Assumptions`, `Open Work`, `Skipped/Not Run`에 기록한다.

## Recommended Plan Sections

- `Goal`
- `Scope`
- `Out Of Scope`
- `Assumptions`
- `Pre-flight checks`
- `Steps`
- `Task Breakdown`
- `Automated tests`
- `Manual/Runtime QA`
- `Skipped/Not Run`
- `Observation Log`
- `Open Work`
- `Completion`
- `Validation Result`
