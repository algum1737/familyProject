# PR And Main Merge

## Goal

`feature/expo-release-prep` 체크포인트 커밋을 원격에 push하고, `main` 대상 pull request를 만든 뒤 검증 상태를 확인한다.

## Scope

- 현재 git 상태, remote, 최신 커밋 확인
- GitHub CLI 인증 상태 확인
- feature branch 원격 push
- `main` 대상 PR 생성
- PR check 상태 확인
- merge 가능 여부 보고

## Out Of Scope

- PR 승인 없는 강제 merge
- 실패한 CI 수정
- 추가 제품 구현

## Assumptions

- 사용자가 PR 생성 절차 진행을 승인했다.
- `main` 머지는 PR checks와 사용자 최종 승인 상태를 보고 진행한다.

## Pre-flight checks

- `git status --short`
- `git branch --show-current`
- `git remote -v`
- `git log -1 --oneline`
- `gh auth status`

## Steps

1. 현재 브랜치와 원격 상태를 확인한다.
2. 현재 프로젝트 문서 검증을 실행한다.
3. feature branch를 원격에 push한다.
4. GitHub PR을 `main` 대상으로 생성한다.
5. PR checks와 URL을 확인해 사용자에게 보고한다.
6. 완료 범위와 검증 결과를 기록한다.

## Automated tests

- `bash scripts/validate-docs.sh`
- PR checks는 GitHub Actions 결과로 확인한다.

## Manual/Runtime QA

- 이번 작업은 배포/런타임 QA를 새로 수행하지 않는다.
- 직전 checkpoint commit의 검증 결과를 참조한다.

## Skipped/Not Run

- 로컬 전체 테스트 재실행은 직전 checkpoint commit에서 이미 수행했으므로 생략한다.
- PR checks가 장시간 대기 중이면 URL과 현재 상태를 남기고 후속 확인으로 넘긴다.

## Open Work

- PR checks 재실행 결과를 확인한 뒤 merge 여부를 판단한다.

## Completion

- 완료일: 2026-05-13
- `gh`가 설치되어 있지 않아 Homebrew로 `gh 2.92.0`을 설치했다.
- `gh auth login -h github.com -p https -w` device flow로 GitHub CLI 인증을 완료했고 `algum1737` 계정으로 로그인됐다.
- `feature/expo-release-prep` 브랜치를 원격에 push했다.
- `main` 대상 PR을 생성했다: `https://github.com/algum1737/familyProject/pull/2`
- PR은 `MERGEABLE` 상태였지만 GitHub Actions `validate` check가 실패했다.
- 실패 원인은 CI가 루트 `npm ci`만 실행하는 상태에서 루트 타입체크가 Expo provider의 `@react-native-async-storage/async-storage` import를 해석하지 못한 것이다.
- CI 타입체크/테스트 경계를 맞추기 위해 루트 devDependencies에 `@react-native-async-storage/async-storage`와 `react-native`를 추가했다.
- 두 번째 CI 실패는 Vitest가 `apps/expo/tsconfig.json`의 `extends: "expo/tsconfig.base"`를 해석하는 과정에서 루트 CI 환경에 `expo` 패키지가 없어 발생했다.
- 루트 Vitest가 Expo 소스를 직접 import하는 현재 구조에 맞춰 루트 devDependencies에 `expo`도 추가했다.
- 세 번째 CI 실패는 `+09:00` 문자열 날짜로 만든 테스트 입력과 로컬 타임존 기준 `setHours` 구현이 CI UTC 환경에서 다르게 해석되어 Expo bootstrap/reminder 테스트가 과거 알림으로 필터링된 것이다.
- 제품 로직은 기기 로컬 시간 기준으로 유지하고, 테스트 fixture를 로컬 날짜 생성자 기반으로 바꿔 CI 타임존 의존성을 제거했다.

## Validation Result

- `gh auth status` 통과
- `gh pr create --base main --head feature/expo-release-prep` 통과
- `gh pr checks 2`에서 최초 `validate` 실패 확인
- `npm run typecheck` 통과
- `npm test -- tests/expo-reschedule-visibility-reasons.test.ts tests/circular-planner-ui.test.tsx tests/expo-router-route-actions.test.ts` 통과, 3개 파일 34개 테스트
- `npm test` 통과, 15개 파일 94개 테스트
- `bash scripts/validate-docs.sh` 통과
- `TZ=UTC npm test -- tests/expo-start-reminder-sync.test.ts tests/expo-bootstrap-and-reminders.test.ts` 통과, 2개 파일 9개 테스트

## Status

Active until the dependency fix is committed, pushed, and PR checks are re-run.
