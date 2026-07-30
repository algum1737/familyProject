# Harness Version Marker

## Goal

`familyProject`의 현재 하네스 구성을 배포 버전 `2026.07.30.1` 계약과 비교하고, 필요한 최소 차이를 적용한 뒤 검증된 버전 marker를 남긴다.

## Scope

- 프로젝트 루트 `.harness-version` 추가
- 하네스 업데이트 절차 문서 추가
- README, docs index, HANDOFF에 버전 확인 경로 연결
- `scripts/validate-docs.sh`에 marker 계약 검증 추가
- 중앙 하네스 감사에서 `current` 판정 확인

## Assumptions

- 하네스 버전은 템플릿 파일의 바이트 단위 복제본이 아니라 적용된 운영 계약과 검증 결과를 나타낸다.
- 프로젝트 고유 지식과 문서 이력은 보존하며, Ponytail 지식 문서는 이 프로젝트 버전 판정의 필수 항목이 아니다.
- 이 작업은 하네스 문서와 검증만 변경하며 제품 코드와 의존성은 변경하지 않는다.

## Validation Contract

### Pre-flight checks

- `main`이 `origin/main`과 동기화되어 있고 작업 트리가 깨끗한지 확인한다.
- 기존 하네스 문서, knowledge 계층, 검증 스크립트가 존재하는지 확인한다.

### Automated tests

- `npm run validate:knowledge`
- `npm run validate:docs`
- `npm run test:handoff-loop`
- `npm run typecheck`
- `npm test`
- `git diff --check`

### Manual/Runtime QA

- `.harness-version`의 version, profile, validation 값을 직접 확인한다.
- 중앙 감사 스크립트에서 `familyProject`가 `current`로 판정되는지 확인한다.

### Skipped/Not Run

- 제품 코드를 변경하지 않으므로 브라우저, Expo, Android 실기기 QA는 실행하지 않는다.
- 의존성을 변경하지 않으므로 새 설치나 빌드는 필수 검증에서 제외한다.

## Open Work

- [x] 현재 하네스와 작업 트리 감사
- [x] 버전 marker와 업데이트 문서 적용
- [x] 문서 인덱스와 검증 스크립트 갱신
- [x] 전체 자동 검증
- [ ] HANDOFF 갱신
- [ ] marker를 `passed`로 확정하고 중앙 감사 확인
- [ ] 완료 계획 이동과 커밋

## Observation Log

- `main`은 `origin/main`과 동기화됐고 작업 트리는 깨끗했다.
- agent loop, knowledge 계층, docs/knowledge/handoff 검증은 이미 적용돼 있다.
- 현재 빠진 배포 계약 파일은 `.harness-version`과 `docs/HARNESS_UPDATE.md`다.
- marker를 `pending`으로 둔 상태에서 자동 검증 계약이 모두 통과했다.

## Validation Result

- `npm run validate:knowledge`: 통과, source 9개와 knowledge page 14개
- `npm run validate:docs`: 통과
- `npm run test:handoff-loop`: 통과
- `npm run typecheck`: 통과
- `npm test`: 통과, test file 19개와 test 110개
- `git diff --check`: 통과
- 브라우저, Expo, Android 실기기 QA: 제품 코드를 변경하지 않아 실행하지 않음
- 중앙 감사: 구현 커밋 후 깨끗한 작업 트리에서 실행 예정
