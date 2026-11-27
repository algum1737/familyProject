# Harness Tool Selection Update

## Goal

기존 제품과 하네스 기록을 보존하며 `2026.11.25.2`의 도구 선택·기록 계약을 적용한다.

## Scope

- 기존 Codex 구성과 tracked profile을 유지하고 `harness=codex`를 기록한다.
- 도구 선택 지침, AGENT_LOOP, PLANS, HARNESS_UPDATE와 맞춤 문서 검증을 병합한다.
- 실행 계획의 빈 active 허용을 명시하고 완료 기록·인계를 갱신한다.

## Out Of Scope

제품 코드·의존성·앱 설정 변경, 패키지 설치, 앱/Android 빌드, 서버·브라우저·실기기 실행, Git 커밋·머지·푸시는 수행하지 않는다.

## Assumptions

- 기존 AGENTS와 AGENT_LOOP가 명시한 Codex 구성을 유지한다. 기존 marker에는 harness 필드가 없지만 사용 도구를 추정해 전환하지 않는다.
- 완료 이력의 옛 배포 버전과 제품 상태 설명은 소급 수정하지 않는다.

## Pre-flight checks

- 사용자 최신화 승인, main의 clean 상태와 기존 `2026.07.30.1/tracked/passed` marker를 확인했다.
- 별도 `codex/update-harness-20261125-2` 브랜치에서 작업한다.
- 수정 대상 원본과 기존 active 계획 상태를 로컬 임시 디렉터리에 백업했다. 로컬 위치와 백업 파일은 공개 변경에 포함하지 않는다.
- 원격 `2271577` 템플릿으로 프로젝트 값이 치환된 비교본을 생성했다.

## Steps

- [x] 대상에 이 계획을 먼저 기록하고 marker를 pending으로 설정한다.
- [x] 프로젝트 정책·knowledge·업무 기록을 보존하며 필요한 계약만 병합한다.
- [x] 정해진 검증을 실행하고 실제 결과를 기록한다.
- [x] passed marker를 확정하고 completed 이동, index/HANDOFF 갱신과 보존 검사를 마친다.

## Automated tests

- `bash -n scripts/validate-docs.sh scripts/test-check-handoff-loop.sh`
- `npm run validate:knowledge`
- `npm run validate:docs`
- `npm run test:handoff-loop`
- `npm run typecheck`
- `npm test`
- 임시 읽기 전용 fixture에서 legacy Codex, 현재 Codex, 잘못된 도구, 누락/코드 블록 안/정상 Claude import를 검증한다.
- `git diff --check`와 변경 경로 검사를 통해 제품 코드와 기존 완료 이력이 변경되지 않았는지 확인한다.

## Manual/Runtime QA

- 루트 AGENTS 120줄 제한과 도구 선택 지침, 실제 marker와 문서 예제가 일치해야 한다.
- 새 계획만 completed로 옮기고 index/HANDOFF가 완료 위치를 가리켜야 한다.
- 기존 업무·릴리스 다음 작업과 제품 코드/의존성을 보존해야 한다.

## Skipped/Not Run

- 제품 코드·의존성 변경이 없으므로 build/E2E/Android·실기기·런타임 QA는 수행하지 않는다.
- 새 커밋을 만들지 않으므로 이번 작업에 대한 after-commit 검사는 수행하지 않는다. 인계 스크립트의 동작은 기존 회귀검증으로 확인한다.

## Observation Log

- 작업 전 Git은 clean이며 active Markdown 계획은 0개였다.
- 빈 active는 기존 맞춤 validator에서도 허용됐다. 최신 도구 marker/import 검사와 계획 디렉터리 존재 검사를 기존 필수 파일·tracked 제한·훅 검사에 병합했다.
- 사전 계획/pending 기록 뒤 필요한 하네스 변경만 적용했고 모든 정해진 검증을 통과했다. 기존 제품 파일과 완료 문서는 변경하지 않았다.

## Open Work

- 승인된 하네스 업데이트 범위의 남은 작업은 없다.

## Completion

도구 선택·기록 지침, 실제 Codex marker와 맞춤 validator, 도구 공통 작업 루프를 병합했다. 제품 코드·의존성·knowledge·기존 완료 이력을 보존했고 이번 계획만 completed로 이동한다. 커밋·머지·푸시는 수행하지 않았다.

## Validation Result

- 통과: `bash -n scripts/validate-docs.sh scripts/test-check-handoff-loop.sh`.
- 통과: `npm run validate:knowledge`와 `npm run validate:docs` — source 9개, knowledge 14개.
- 통과: `npm run test:handoff-loop` — 기존 인계 경고 시나리오.
- 통과: `npm run typecheck`.
- 통과: `npm test` — Vitest 19개 파일, 110개 테스트.
- 통과: 임시 fixture 6종. 현재 Codex·legacy Codex·정상 Claude import는 성공했고 잘못된 도구·누락 import·코드 블록 안 import는 예상 메시지로 거부됐다. 실제 프로젝트의 marker/문서는 바꾸지 않았고 fixture를 제거했다.
- 통과: `git diff --check`, AGENTS 87줄, 제품 코드·의존성·knowledge·기존 완료 이력 변경 없음.
- 통과: 새 계획 completed 이동과 index/HANDOFF 포인터, 기존 active 없음과 `.gitkeep` 유지.
- 미실행: build/E2E/Android·실기기·서버 런타임 QA. 제품 코드와 의존성은 바꾸지 않았다.
- 미실행: 새 커밋에 대한 after-commit 검사·Git 커밋/머지/푸시. 이번 작업은 미커밋 하네스 변경이며 인계 스크립트는 기존 회귀검증으로 확인했다.


## 공개 반영 검토

### 승인 범위와 상태

- 하네스 도구 선택·기록, marker와 맞춤 validator, 현재 운영 문서 및 이 계획의 공개 반영을 승인받았다.
- 제품 코드·의존성·knowledge·과거 제품 기능 브랜치는 제외한다.
- 공개 변경 검토와 로컬 검증을 완료했다. 작업 브랜치 커밋·푸시와 PR을 준비하며 main 병합은 PR·CI 상태를 확인한 뒤 최종 검토 담당자가 수행한다.

### 사전 기록과 공개 경계

- 변경 11개 파일의 원문과 전체 패치를 로컬 임시 디렉터리에 먼저 백업했다.
- 새 공개 변경에 로컬 절대경로·계정·서버 정보·개인정보·비공개 참조를 포함하지 않는다. 제외한 로컬 기록은 백업에 보존한다.
- 현재 작업 브랜치와 원격 main은 같은 기준 커밋에서 시작하며, 다른 제품 기능 커밋을 포함하지 않는다.
- `.harness-version`은 실제 적용한 `2026.11.25.2/tracked/passed/harness=codex`를 유지한다.

### 검증 계약

- `npm run validate:knowledge`, `npm run validate:docs`, `npm run test:handoff-loop`, `npm run typecheck`, `npm test`를 한 번 실행한다.
- 도구 선택 fixture 6종, shell 구문, `git diff --check`와 변경 경로·공개 정보 검사를 수행한다.
- `.github/workflows/ci.yml`의 pull_request CI에서 validate와 e2e 결과를 최종 검토 담당자가 확인할 수 있도록 PR/head SHA를 인계한다.
- 제품 빌드·브라우저·실기기 QA는 로컬에서 실행하지 않는다. GitHub CI의 e2e job이 별도로 Playwright를 실행한다.
- 경로를 명시해 필요한 공개 파일만 스테이징하고 커밋 후 HANDOFF의 현재 상태와 다음 작업을 갱신한다.

### 검토 결과

- 11개 변경은 기존 Codex 동작을 유지하며 실제 적용된 하네스 계약을 설명·검증하는 데 필요하다.
- 로컬 백업 절대경로는 공개본에서 일반화했다. 원문은 로컬 백업에 보존했다.
- 제품 코드·의존성·knowledge·기존 완료 이력의 변경은 없다.
- 공개 반영 검증: shell 구문, knowledge(9 source·14 page), docs, handoff-loop 회귀, typecheck와 Vitest 19 files·110 tests가 모두 통과했다.
- 독립 도구 선택 fixture 6종도 예상과 일치했다. 현재/legacy Codex와 정상 standalone Claude import는 통과했고 invalid 도구·누락 import·fenced-only import는 거부됐다.
- 추가한 공개 본문과 새 완료계획에서 절대경로·URL·계정·민감값 패턴을 검사했고 새 비공개 정보는 없었다. 독립 읽기 전용 검토에서도 추가 결함과 제품 변경은 없었다.
- 커밋 후 인계 갱신과 PR 공개 상태는 실제 Git 브랜치·GitHub PR에서 확인한다. main 최종 반영은 이 준비 작업의 담당 범위가 아니다.
