# Plan Editing UI Plan

## Goal

웹 MVP의 계획 관리 흐름을 실제 사용 가능한 수준으로 올린다.

## Scope

- 계획 수정 모드 추가
- 수정 모드에서 등록 폼 재사용
- 시간 겹침 검증 유지
- 색상 선택 UX 단순화
- 수정/등록 모드 버튼 레이아웃 분기

## Current State

- 브랜치: `feature/edit-form-layout`
- 계획 등록, 삭제, 완료 토글은 이미 동작한다.
- 수정 버튼을 누르면 폼이 기존 값으로 채워지고 수정 모드로 전환된다.
- 수정 모드에서는 섹션 제목이 `계획 수정`, 제출 버튼이 `계획 저장`으로 바뀐다.
- 색상 선택은 기본 팔레트 드롭다운 + `사용자 지정` 컬러 피커로 정리됐다.
- 시간 입력은 자유 분 단위이며, 기존 일정과 겹치는 시간은 저장되지 않는다.

## Recent Changes

- 수정 모드 취소 버튼 추가
- 수정 모드 버튼 폭 축소
- 등록 모드 `계획 추가` 버튼 최소 너비를 `180px`로 유지
- 수정 모드 액션 영역이 왼쪽 입력 필드를 침범하지 않도록 정렬 조정
- 색상 미리보기는 폼 하단 별도 블록으로 유지
- `시간 자유 입력` 보조 문구 제거
- 액션 버튼은 입력 필드들과 같은 라인에 정렬

## Open Work

1. 겹침 오류 메시지를 어떤 일정과 충돌하는지까지 보여줄지 결정
2. 사용자 흐름 테스트 확장

## Current Focus

- 수정 모드 버튼/색상 필드 레이아웃 미세 조정 완료
- 색상 선택은 입력 행에 두고, 선택된 색상 미리보기는 하단 별도 블록으로 유지
- 등록 모드와 수정 모드 모두 버튼이 입력 필드들과 같은 라인에 위치

## Validation

- `npm run typecheck`
- `npm test`
- `npm run build`
- `./scripts/validate-docs.sh`

## Handoff

다음 세션에서는 아래 순서로 읽고 이어간다.

1. `AGENTS.md`
2. `docs/index.md`
3. `docs/MVP_SCOPE.md`
4. `docs/exec-plans/active/2026-04-23-plan-editing.md`
5. `src/ui/planner/circular-planner.tsx`
6. `src/app/globals.css`
