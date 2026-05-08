# Harness Exec Plan Cleanup

## Goal

완료된 실행 계획을 `active/`에서 `completed/`로 이동하고, 앞으로 큰 작업은 시작과 종료 시점에 반드시 계획 문서를 기록하도록 운영 규칙을 강화한다.

## Scope

- 완료된 실행 계획 분류
- 완료 계획을 `completed/`로 이동
- 완료 범위와 검증 결과 기록
- `docs/index.md`와 `docs/HANDOFF.md`의 active/completed 참조 갱신
- 실행 계획 운영 규칙 보강

## Assumptions

- `Plan Editing UI`, `App Transition Decision`, `Missed Plan Recovery`는 현재 구현과 문서 상태 기준으로 완료 처리한다.
- `Harness Template Kit`은 산출물이 아직 확인되지 않아 active에 남긴다.

## Steps

1. active 계획별 완료 여부를 분류한다. 완료.
2. 완료 계획을 completed로 이동한다. 완료.
3. 완료 계획에 completion note와 validation 결과를 남긴다. 완료.
4. 문서 인덱스와 HANDOFF의 next work를 현재 상태로 갱신한다. 완료.
5. 하네스 점검과 문서 검증을 실행한다. 완료.
6. 정리 계획 자체를 completed로 이동한다. 완료.

## Completion Status

Completed. `Plan Editing UI`, `App Transition Decision`, `Missed Plan Recovery`를 completed로 이동했고, `Harness Template Kit`만 active에 남겼다. 반복 운영 규칙은 `AGENTS.md`와 `docs/exec-plans/README.md`에 명시했다.

## Validation

- `docs/exec-plans/active/`에는 실제 미완료 계획만 남아야 한다. 통과.
- `docs/index.md`의 Active Work와 Completed Work가 실제 파일 위치와 일치해야 한다. 통과.
- `docs/HANDOFF.md`가 completed 계획을 active 계획으로 안내하지 않아야 한다. 통과.
- `npm run check:handoff-loop` 통과.
- `npm run validate:docs` 통과.
