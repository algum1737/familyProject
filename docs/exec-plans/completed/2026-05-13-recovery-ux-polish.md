# Recovery UX Polish

## Goal

웹과 Expo의 missed/recovery 흐름에서 `다시 지정` 차단 이유와 액션 상태가 같은 의미로 보이도록 시각 계층을 정리한다.

## Scope

- 웹 planner missed 카드의 차단 이유 표시가 충분히 눈에 띄는지 정리
- Expo Today missed 카드에서 차단된 `다시 지정` 액션도 비활성 상태로 보여 웹과 의미를 맞춤
- 관련 테스트 보강
- 결과를 `docs/HANDOFF.md`와 `docs/index.md`에 반영

## Out Of Scope

- 다시 지정 정책 변경
- 자동 축약/자동 분할
- 알림 QA
- Play Console 릴리스 대기열

## Assumptions

- `rescheduleBlockedReason` 계산은 공통 core/presentation 경로에서 이미 검증돼 있다.
- 이번 작업은 정책 변경이 아니라 사용자가 왜 액션을 못 하는지 더 잘 보이게 하는 UI polish다.

## Steps

1. 웹/Expo 회복 카드와 액션 표시 차이를 확인한다.
2. 웹 차단 이유 문구의 시각 계층을 유지/보강한다.
3. Expo missed 카드에서 차단된 `다시 지정` 버튼을 disabled 상태로 표시한다.
4. 관련 테스트와 타입체크/문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 Vitest 테스트가 통과해야 한다.
- 루트 `npm run typecheck`가 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo Today plan item view에 `rescheduleActionState`를 추가해 `enabled`, `blocked`, `hidden`을 구분하고, blocked missed 일정에서도 `다시 지정` 버튼을 비활성 상태로 보여주도록 정리했다. 웹 planner는 이미 차단 이유와 비활성 버튼을 함께 보여주므로 기존 시각 계층을 유지했다.

## Validation Result

- `npm test -- tests/expo-reschedule-visibility-reasons.test.ts tests/circular-planner-ui.test.tsx` 통과.
- `npm test -- tests/expo-theme-screen-style-snapshots.test.ts` 통과.
- `npm run typecheck` 통과.
- `bash scripts/validate-docs.sh` 통과.

## Open Work

- 실제 Android/iOS 화면에서 사람이 보는 시각 QA는 별도 후속 후보로 남긴다.
