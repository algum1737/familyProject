# Expo Hidden Reschedule Reason

## Goal

Expo `Today` 화면에서 `다시 지정` 버튼이 숨겨질 때, 사용자가 이유를 바로 알 수 있도록 missed 카드에 차단 사유 문구를 노출한다.

## Scope

- shared today plan item 모델에서 `다시 지정` 차단 사유 계산
- Expo `Today` 화면 missed 카드에 이유 문구 표시
- focused 테스트 추가
- 타입체크와 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 `다시 지정` 정책 자체 변경이 아니라 숨김 상태의 이유 노출 UX 보강에 집중한다.

## Steps

1. today plan item 모델 경로에서 `다시 지정` 차단 사유 계산 지점을 정한다.
2. Expo `Today` 화면에 missed 카드용 이유 문구를 연결한다.
3. 관련 focused 테스트를 추가한다.
4. 관련 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 focused 테스트가 통과해야 한다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Expo `Today` 화면의 missed 카드에는 이제 `다시 지정` 버튼이 숨겨질 때 이유 문구가 함께 표시된다. shared core plan item 모델에 `rescheduleBlockedReason`을 추가해 `다시 지정 3/3 사용 완료`와 `이미 다시 지정된 후속 일정이 있음`을 구분하고, Expo today 카드가 이를 렌더링하도록 연결했다. 구현 중 드러난 체인 follow-up 판정 버그도 함께 수정해, 같은 체인의 이전 일정이 후속 일정으로 잘못 잡혀 후속 일정 카드까지 `다시 지정`이 숨겨지던 문제를 막았다.

## Validation Result

- `npm test -- tests/expo-reschedule-visibility-reasons.test.ts tests/expo-router-route-actions.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- web planner 쪽에는 아직 같은 차단 이유 문구가 직접 노출되지 않는다.
