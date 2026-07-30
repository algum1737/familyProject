# Android And Play Release Knowledge

## Goal

Android 알림 신뢰성과 Google Play 출시 준비 경험을 공식 출처와 프로젝트 증거로 추적 가능한 knowledge 페이지로 정리한다.

## Scope

- Android exact alarm과 Expo 알림 예약 관련 공식 출처를 등록한다.
- Google Play testing, Data Safety, exact alarm 정책 관련 공식 출처를 등록한다.
- 각 출처의 source note를 작성한다.
- Android 알림 신뢰성 synthesis와 Google Play 출시 준비 synthesis를 작성한다.
- knowledge index와 append-only log를 갱신한다.
- 완료 시 문서 인덱스, 계획 상태와 HANDOFF를 정리한다.

## Out Of Scope

- 제품 코드, Android manifest, Expo 설정 변경
- Play Console 실제 계정 생성, app record 생성 또는 AAB 업로드
- 회복 UX 관찰 synthesis와 제품 entity 페이지
- `ARCHITECTURE.md`의 현재 상태 정정
- Google Play 정책을 제품 규범으로 자동 승격하는 작업

## Assumptions

- 사용자 승인 `진행하자`는 직전 답변에서 우선순위로 제안한 Android 알림 신뢰성과 Google Play 출시 준비 knowledge 작성 범위로 해석한다.
- 외부 정책은 `2026-07-30` 검색 시점의 공식 문서를 기준으로 기록하며 영구 사실로 취급하지 않는다.
- 프로젝트별 결정과 관찰은 기존 체크리스트, HANDOFF, completed exec plan을 내부 증거로 연결하고 외부 출처가 직접 지지하는 주장과 구분한다.
- 회복 UX와 제품 entity는 이번 범위에 포함하지 않고 후속 후보로 남긴다.

## Pre-flight checks

- [x] `main`과 `origin/main`이 일치한다.
- [x] 작업 시작 전 worktree가 깨끗하다.
- [x] `docs/android-play-release-knowledge` 브랜치를 생성했다.
- [x] `docs/knowledge/README.md`와 `scripts/validate-knowledge.sh`의 저장·검증 계약을 확인했다.
- [x] 기존 knowledge index에는 제품 entity가 없고 Android/Play synthesis가 없음을 확인했다.

## Steps

- [x] 공식 출처를 조사하고 출처 메타데이터와 지원 범위를 확인한다.
- [x] source record와 source note를 작성한다.
- [x] Android 알림 신뢰성 synthesis를 작성한다.
- [x] Google Play 출시 준비 synthesis를 작성한다.
- [x] knowledge index와 log를 갱신한다.
- [x] 자동 검증과 수동 추적 검토를 수행한다.
- [ ] 완료 범위와 검증 결과를 기록하고 completed로 이동한다.
- [ ] `docs/index.md`와 `docs/HANDOFF.md`를 갱신한다.

## Automated tests

- `bash scripts/validate-knowledge.sh`
- `bash scripts/validate-docs.sh`
- `bash scripts/test-check-handoff-loop.sh`
- `git diff --check`

## Manual/Runtime QA

- `docs/knowledge/index.md`에서 새 synthesis와 source note로 이동 가능한지 확인한다.
- 각 supported claim을 source record의 공식 원본 URL까지 역추적한다.
- 프로젝트 해석이 외부 정책 주장과 분리돼 있는지 검토한다.
- `rg`로 exact alarm, internal testing, Data Safety 관련 지식이 검색되는지 확인한다.

## Skipped/Not Run

- 웹/Expo/Android 런타임 QA: 제품 런타임을 변경하지 않는 문서 작업이므로 실행하지 않는다.
- Android build와 EAS build: manifest나 빌드 구성을 변경하지 않으므로 실행하지 않는다.
- Play Console 실제 조작: 계정, 결제, 본인 인증과 외부 상태 변경이 필요한 후속 업무이므로 실행하지 않는다.
- 전체 TypeScript/Vitest/E2E: 제품 코드와 테스트 코드를 변경하지 않으므로 로컬 검증 계약에서는 제외하고 PR CI 결과를 별도로 확인한다.

## Observation Log

- 2026-07-30: 기존 knowledge 계층에는 지식관리 방법론만 있고 Android 알림과 Google Play 출시 경험은 일반 문서와 completed plan에 흩어져 있다.
- 2026-07-30: `APP_EXPO_RELEASE_CHECKLIST.md`와 `APP_PLAY_CONSOLE_SUBMISSION_PREP.md`에는 재사용 가능한 판단이 있으나 공식 출처 레코드와 knowledge synthesis가 없다.
- 2026-07-30: Android Developers, Expo, Google Play Console Help의 공식 문서 8개를 source record와 source note로 등록했다.
- 2026-07-30: Android 알림 synthesis에는 공식 권한 기준과 프로젝트 실기기·AAB 증거를 분리해 기록했다.
- 2026-07-30: Google Play synthesis에는 app record, signing, internal testing, 신규 개인 계정, Data Safety checkpoint를 연결했다.
- 2026-07-30: knowledge/docs validation, handoff-loop test, diff check와 `rg` 수동 검색이 통과했다.

## Open Work

- 완료 계획 이동, 문서 인덱스와 HANDOFF 갱신, PR 제출이 남아 있다.

## Completion

- 상태: 진행 중

## Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Knowledge validation | 통과 | `bash scripts/validate-knowledge.sh` — source 9개, knowledge page 14개 |
| Docs validation | 통과 | `bash scripts/validate-docs.sh` |
| Handoff-loop scenarios | 통과 | `bash scripts/test-check-handoff-loop.sh` |
| Diff check | 통과 | `git diff --check` |
| Manual repository search | 통과 | `rg`로 index, source note, synthesis와 source record 검색 확인 |
| Runtime/build/Play Console | 미실행 | 문서 작업이며 외부 계정 변경은 범위 밖 |
