# Web Reschedule Blocked Reason

## Goal

웹 planner의 missed 일정 카드에서도 Expo Today 화면처럼 `다시 지정` 버튼이 숨겨진 이유를 직접 보여준다.

## Scope

- 웹 원형 플래너의 missed 일정 카드에서 `rescheduleBlockedReason` 노출 여부 확인
- `다시 지정 3/3 사용 완료`, `이미 다시 지정된 후속 일정이 있음` 같은 차단 이유를 사용자에게 직접 표시
- 관련 UI 테스트 보강
- 결과를 `docs/HANDOFF.md`와 `docs/index.md`에 반영

## Out Of Scope

- 다시 지정 정책 변경
- 자동 축약/자동 분할 구현
- Expo Today 화면 변경
- Play Console 릴리스 대기열

## Assumptions

- 공통 core view model에는 이미 `rescheduleBlockedReason`이 계산돼 있다.
- 이번 작업은 웹 UI가 이미 계산된 이유를 누락 없이 표시하도록 연결하는 수준이다.

## Steps

1. 웹 planner missed 카드 렌더링과 현재 테스트를 확인한다.
2. `rescheduleBlockedReason` 표시 위치와 문구를 최소 변경으로 연결한다.
3. `rescheduleCount >= 3` 및 후속 일정 존재 케이스 테스트를 추가한다.
4. 관련 테스트, 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 UI 테스트가 통과해야 한다.
- 루트 `npm run typecheck`가 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. 웹 planner missed 카드가 공통 core model의 `rescheduleBlockedReason`을 presentation model로 전달하고, 카드 본문에 `다시 지정 3/3 사용 완료` 또는 `이미 다시 지정된 후속 일정이 있음`을 직접 표시하도록 연결했다. 버튼은 기존처럼 비활성화 상태를 유지한다.

## Validation Result

- `npm test -- tests/circular-planner-ui.test.tsx` 통과.
- `npm run typecheck` 통과.
- `bash scripts/validate-docs.sh` 통과.

## Open Work

- 실제 브라우저 시각 확인은 이번 변경에서 생략했다. 필요하면 다음 UI polish 작업에서 확인한다.
