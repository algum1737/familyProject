# Today Program Description HTML

## Context

사용자가 현재까지 만든 `오늘 다 했니?` 프로그램을 설명하는 HTML 문서를 요청했다. 문서는 사용자가 읽는 제품 소개 문서로 작성하며, 내부 구현 명칭보다 실제 기능과 사용 흐름을 중심으로 정리한다.

## Scope

- 현재 제품 목표와 핵심 가치 요약
- 오늘 화면, 계획 편집, 회고, 월간 동기부여, 알림 흐름 설명
- 현재 구현/검증된 상태와 아직 남은 범위 구분
- 독립적으로 열 수 있는 HTML 파일 생성
- 생성 문서 인덱스 갱신

## Out of Scope

- 앱/웹 런타임 기능 변경
- 새 UI 컴포넌트 구현
- 제품 스크린샷 제작
- 배포용 랜딩 페이지 연결

## Assumptions

- HTML 문서는 리포지터리 기록 산출물이므로 `docs/generated/` 아래에 둔다.
- 문서 독자는 개발자가 아니라 제품 방향을 파악하려는 사용자/관계자로 본다.
- 현재 검증 상태는 리포지터리 문서 기준으로만 서술한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- 관련 제품 문서 확인: `README.md`, `ARCHITECTURE.md`, `docs/product-specs/today-did-you-finish.md`, `docs/MVP_SCOPE.md`, `docs/APP_SCREEN_TREE.md`

### Automated tests

- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 생성된 HTML 파일이 문서 구조와 링크 없이도 단독으로 읽히는지 확인
- 내부 구현 용어가 사용자 설명에 과하게 노출되지 않는지 확인

### Skipped/Not Run

- 앱 런타임 QA는 문서 산출물 작업이므로 실행하지 않는다.
- 브라우저 스크린샷 QA는 정적 HTML 문서 생성 범위에서는 실행하지 않는다.

## Open Work

- 완료. 상세 결과는 `Validation Result`에 기록한다.

## Steps

1. 제품/화면/알림 관련 기준 문서를 읽는다.
2. `docs/generated/today-did-you-finish-program-description.html`을 작성한다.
3. `docs/generated/README.md`와 `docs/index.md`에 산출물 링크를 추가한다.
4. 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 plan을 completed로 이동한다.

## Validation Result

### Pre-flight checks

- Passed: `git status --short --branch`로 `docs/today-program-description-html` 브랜치와 변경 파일을 확인했다.
- Passed: `README.md`, `ARCHITECTURE.md`, `docs/product-specs/today-did-you-finish.md`, `docs/MVP_SCOPE.md`, `docs/APP_SCREEN_TREE.md`, `docs/APP_LOCAL_REMINDER_PLAN.md`, `docs/APP_MOTIVATION_SCREEN.md`를 확인했다.

### Automated tests

- Passed: `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- Passed: `docs/generated/today-did-you-finish-program-description.html`이 단독 HTML 문서로 열 수 있는 구조인지 확인했다.
- Passed: 사용자 설명에 어울리지 않는 내부 구현명(`PlanEditorScreen`, `selector`, `store 계약`, `Mobile Preview`, `Expo`)이 HTML 본문에 남지 않았는지 `rg`로 확인했다.

### Skipped/Not Run

- Skipped: 앱 런타임 QA는 문서 산출물 작업이므로 실행하지 않았다.
- Skipped: 브라우저 스크린샷 QA는 정적 HTML 문서 생성 범위에서는 실행하지 않았다.
