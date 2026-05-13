# Plans

## Rules

- 큰 작업은 구현 전에 반드시 `exec-plans/active/`에 실행 계획을 만든다.
- 실행 계획은 목표, 범위, 가정, 단계, 리스크, 검증 방법, 남은 작업 여부를 포함한다.
- 진행 중 계획은 `exec-plans/active/`에 둔다.
- 작업이 완료되면 완료 범위와 검증 결과를 계획 문서에 기록한다.
- 검증 기준을 충족하고 남은 작업이 없으면 계획 문서를 `exec-plans/completed/`로 이동한다.
- 계획을 이동할 때는 `docs/index.md`와 `docs/HANDOFF.md`도 함께 갱신한다.
- 완료됐는지 애매한 작업은 `active/`에 남기되 `Open Work`와 다음 판단 기준을 적는다.

## Validation Contract

실행 계획은 작업 시작 전에 검증 계약을 먼저 고정하고, 완료 시 같은 항목을 결과와 대조한다.

- `Pre-flight checks`: 브랜치, active plan 존재, 관련 문서/파일, 기존 상태, 외부 도구 연결 여부처럼 작업 전 확인해야 하는 항목을 적는다.
- `Automated tests`: 실행할 단위 테스트, 통합 테스트, E2E, 타입체크, 린트, 문서 검증 명령을 구체적인 명령어로 적는다.
- `Manual/Runtime QA`: 브라우저, 에뮬레이터, 실제 기기, 스크린샷, 접근성 트리, 로그처럼 사람이 보거나 런타임에서 확인할 흐름과 증거 기준을 적는다.
- `Skipped/Not Run`: 실행하지 않을 검증 또는 실행하지 못할 가능성이 있는 검증을 미리 적고, 범위 밖/환경 없음/네트워크 제한/기기 없음 같은 이유를 명시한다.
- `Validation Result`: 완료 시 실제 실행한 명령과 결과를 `통과`, `실패`, `미실행`으로 기록하고, 실패나 미실행은 후속 작업 또는 남은 리스크로 연결한다.

## Recommended Plan Sections

- `Goal`
- `Scope`
- `Out Of Scope`
- `Assumptions`
- `Pre-flight checks`
- `Steps`
- `Automated tests`
- `Manual/Runtime QA`
- `Skipped/Not Run`
- `Open Work`
- `Completion`
- `Validation Result`
