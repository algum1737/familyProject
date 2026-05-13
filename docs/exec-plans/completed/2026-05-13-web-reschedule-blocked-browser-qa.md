# Web Reschedule Blocked Browser QA

## Goal

웹 planner의 `다시 지정` 차단 이유 표시가 jsdom 단위 테스트뿐 아니라 실제 브라우저 렌더 경로에서도 보이는지 확인한다.

## Scope

- Playwright E2E에 `rescheduleCount >= 3` 차단 이유 표시 케이스 추가
- 실제 `build + start` 기반 브라우저 테스트로 missed 카드의 문구와 버튼 비활성화 확인
- 결과를 `docs/HANDOFF.md`와 `docs/index.md`에 반영

## Out Of Scope

- UI 스타일 재설계
- 다시 지정 정책 변경
- Android 실기기 알림 QA
- Play Console 릴리스 대기열

## Assumptions

- 현재 Playwright 설정은 `npm run build && npm run start`로 실제 Next.js 렌더 경로를 검증한다.
- 브라우저 시각 확인은 자동화된 DOM 가시성 검증으로 충분히 기록한다.

## Steps

1. 기존 Playwright planner flow의 seed 방식과 locator 구조를 확인한다.
2. 차단 이유가 보이는 missed 일정 seed를 추가한다.
3. 문구 표시와 `다시 지정` 버튼 disabled 상태를 E2E로 검증한다.
4. 관련 E2E, 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- `npm run test:e2e -- tests/e2e/planner-flow.spec.ts`가 통과해야 한다.
- 루트 `npm run typecheck`가 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. Playwright planner browser flow에 `rescheduleCount >= 3` missed 일정 seed를 추가해 실제 Next.js `build + start` 렌더 경로에서 `다시 지정 3/3 사용 완료` 문구와 `다시 지정` 버튼 비활성화를 확인했다. 테스트 전역 seed와 충돌하지 않도록 해당 케이스는 별도 browser context의 init script로 storage를 주입한다.

## Validation Result

- `npm run test:e2e -- tests/e2e/planner-flow.spec.ts` 통과.
- `npm run typecheck` 통과.
- `bash scripts/validate-docs.sh` 통과.

## Open Work

- 실제 사람이 브라우저에서 눈으로 보는 polish 확인은 별도 디자인 QA 후보로 남긴다.
