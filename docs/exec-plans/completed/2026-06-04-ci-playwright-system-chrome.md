# CI Playwright System Chrome

## Context

`main` 최신 `b077cd7` push run에서 `validate` job은 통과했지만, `e2e` job이 `npx playwright install --with-deps chromium` 단계에서 Chrome download `100%` 이후 약 6시간 동안 종료되지 않아 cancelled 됐다.

현재 브라우저 E2E는 CI에서 번들 chromium을 쓰고, 로컬에서만 시스템 Chrome을 쓰도록 분기돼 있다. 이번 작업은 GitHub Actions runner의 시스템 Chrome을 CI에서도 사용해 Playwright browser install 단계를 제거하고 e2e job hang 가능성을 줄인다.

## Scope

- Playwright config의 CI browser channel 기준을 시스템 Chrome으로 전환
- GitHub Actions e2e job에서 `npx playwright install --with-deps chromium` 제거
- CI에서 Chrome 설치 여부를 빠르게 확인하는 guard step 추가
- 관련 문서/인계 갱신

## Out of Scope

- E2E 테스트 시나리오 변경
- 앱 기능 변경
- Android 실기기 QA
- Play Console blocker 추가 정리

## Assumptions

- GitHub Actions `ubuntu-latest` runner에는 `google-chrome` 또는 `google-chrome-stable`이 제공된다.
- CI에서 시스템 Chrome을 쓰면 별도 browser binary download/unpack 단계가 없어져 이번 hang 원인을 피할 수 있다.
- 만약 runner 이미지에서 Chrome이 제거되면 새 guard step이 browser test 실행 전 명확히 실패한다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- 실패 run 로그 확인
- 현재 workflow와 Playwright config 확인

### Automated tests

- `npm run test:e2e`
- `npm run typecheck`
- `npm test`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 이번 범위에서는 앱 runtime QA를 실행하지 않는다.

### Success Criteria

- CI e2e workflow에 Playwright browser install 단계가 없다.
- Playwright project가 CI와 로컬 모두 system Chrome channel을 사용한다.
- CI에서 Chrome binary 확인 실패 시 test 실행 전 원인을 알 수 있다.
- 로컬 E2E가 통과한다.

### Skipped/Not Run

- Android 실기기 QA
- Play Console 입력

## Open Work

- 없음. PR/merge 대기.

## Progress Log

- `fix/ci-playwright-system-chrome` 브랜치를 만들었다.
- 실패한 `b077cd7` e2e 로그를 확인했다. `validate` job은 통과했고, `e2e` job은 `npx playwright install --with-deps chromium` 단계에서 Chrome download `100%` 이후 `Run Playwright tests`로 넘어가지 못한 채 약 6시간 뒤 cancelled 됐다.
- `playwright.config.ts`에서 CI도 로컬과 동일하게 system Chrome `channel: "chrome"`을 사용하도록 변경했다.
- GitHub Actions e2e job에서 `npx playwright install --with-deps chromium` 단계를 제거했다.
- GitHub Actions e2e job에 `google-chrome` 또는 `google-chrome-stable` 버전을 확인하는 `Verify system Chrome` step을 추가했다.
- `docs/HANDOFF.md`의 E2E 실행 기준을 “로컬과 CI 모두 시스템 Chrome 채널”로 갱신했다.
- sandbox 내부 `npm run test:e2e`는 Next server가 `0.0.0.0:3000`에 bind하지 못해 `EPERM`으로 실패했다. 같은 명령을 외부 권한으로 재실행하자 E2E 3개가 통과했다.

## Validation Result

### Automated tests

- PASS: `npm run typecheck`
- PASS: `npm test`
- PASS: `bash scripts/validate-docs.sh`
- PASS: `npm run test:e2e` with external permissions. Sandbox 내부 실행은 `listen EPERM: operation not permitted 0.0.0.0:3000`으로 실패했으며, 포트 바인딩 제한으로 판단했다.

### Manual/Runtime QA

- NOT RUN: 이번 작업은 CI workflow와 browser E2E 실행 환경 변경 범위라 앱 runtime QA는 실행하지 않았다.

### Skipped/Not Run

- Android 실기기 QA
- Play Console 입력
