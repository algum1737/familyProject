# Reschedule Failure UX

## Goal

`다시 지정`에 실패했을 때 사용자가 왜 실패했는지와 다음에 무엇을 해야 하는지 바로 이해할 수 있도록 웹/Expo 편집 흐름의 안내를 분리해 보강한다.

## Scope

- 현재 `다시 지정 불가`와 최대 횟수 초과 처리 경로 확인
- 웹/Expo 편집 화면의 실패 안내 문구와 후속 행동 안내 보강
- 관련 테스트 보강
- 완료 시 검증 결과와 문서 정리

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 자동 축약/자동 분할 같은 정책 변경이 아니라 실패 UX 명확화에 집중한다.

## Steps

1. 웹/Expo의 다시 지정 실패 처리와 현재 표시 문구를 확인한다.
2. `연속 빈 시간 부족`과 `재지정 3회 초과` 안내를 분리해 설계한다.
3. 화면 안내와 필요 시 view-model/helper를 수정한다.
4. 관련 테스트와 타입체크/문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. `다시 지정` 실패 문구를 공통 helper로 분리하고, 웹 원형 플래너, 앱 편집 화면, Expo today 화면이 `연속 빈 시간 부족`과 `재지정 3회 초과`를 같은 기준으로 해석해 다음 행동 안내를 보여주도록 정리했다. Expo route 엔트리와 screen registry 양쪽 경로에도 같은 helper를 연결해 direct route와 shell route가 서로 다르게 보이지 않게 맞췄다.

## Validation Result

- `npm test -- tests/circular-planner-ui.test.tsx tests/reschedule-failure-guidance.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- `rescheduleCount >= 3` 상태는 현재 UI에서 `다시 지정` 버튼이 숨겨져 있어 실사용 경로 테스트는 아직 없다.
