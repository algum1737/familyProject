# Handoff

이 문서는 다른 세션에서 현재 상태를 빠르게 이어받기 위한 인계 문구다.

## Read First

다음 순서로 읽는다.

1. `AGENTS.md`
2. `README.md`
3. `ARCHITECTURE.md`
4. `docs/index.md`
5. `docs/MVP_SCOPE.md`
6. `docs/TECH_STACK.md`
7. `docs/WEB_TO_APP_TRANSITION.md`
8. `docs/exec-plans/active/2026-04-23-plan-editing.md`
9. `src/ui/planner/circular-planner.tsx`
10. `src/app/globals.css`

## Current Baseline

- 현재 브랜치: `main`
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: `overlap error message clarified`

## Current Product State

- Next.js + TypeScript 기반 웹 MVP가 있다.
- 24시간 원형 플래너가 렌더링된다.
- 현재 시간 포인터와 현재 계획 판정이 동작한다.
- 현재 계획 부채꼴은 비현재 구간보다 더 강하게 강조된다.
- 계획 등록, 삭제, 완료 토글이 구현돼 있다.
- 계획 수정 모드가 구현돼 있다.
- 수정 모드에서는 섹션 제목이 `계획 수정`, 제출 버튼이 `계획 저장`으로 바뀐다.
- 등록 모드의 `계획 추가` 버튼 최소 너비는 `180px`다.
- 계획 폼의 액션 버튼은 입력 필드들과 같은 라인에 정렬된다.
- 선택된 색상 미리보기는 폼 하단 별도 블록으로 유지된다.
- 시간 입력은 자유 분 단위다.
- 기존 일정과 겹치는 시간대는 저장되지 않는다.
- 일정 충돌 메시지는 등록하려는 일정이 아니라 기존 등록 일정의 제목과 시간대로 안내된다.
- 여러 기존 일정과 겹치더라도 첫 번째로 감지된 충돌 일정 1건만 안내된다.
- 색상 선택은 기본 팔레트 드롭다운과 `사용자 지정` 컬러 피커 흐름으로 정리돼 있다.
- 시계 숫자 라벨은 `0, 3, 6, 9, 12, 15, 18, 21`만 보인다.
- `0` 옆에는 달 아이콘, `12` 옆에는 해 아이콘이 표시된다.
- 저장은 현재 브라우저 `localStorage`를 사용한다.

## Working Rules

- 구현 변경은 사용자가 명시적으로 `진행하자`, `적용해`, `수정해`, `브랜치 만들어서 진행해`라고 말했을 때만 수행한다.
- 그 전에는 분석, 원인 파악, 제안까지만 한다.
- 새 실제 작업은 `main`에서 직접 하지 않고, 사용자가 승인하면 작업 브랜치를 만든다.
- `main` 머지는 사용자가 명시적으로 요청할 때만 한다.
- 커밋 후에는 `docs/HANDOFF.md`의 최근 반영 작업, 현재 상태, 다음 작업을 검토하고 갱신한다.
- 커밋 해시는 문서에 고정하지 말고 git 명령으로 확인하게 유지한다.
- 리포지터리 밖에만 있는 지식은 없는 것으로 간주한다.

## Suggested Next Work

1. 사용자 흐름 테스트 확장
2. `HANDOFF` 갱신 흐름이 실제 커밋 루프에서 잘 지켜지는지 점검
3. 충돌 메시지 정책을 실행 계획 문서에도 명시할지 검토

## Handoff Prompt

아래 문구를 새 세션에 그대로 넣으면 된다.

```text
이 프로젝트는 하네스 엔지니어링 방식으로 진행 중이다.

먼저 아래 파일을 읽고 현재 상태를 요약해라.
1. AGENTS.md
2. README.md
3. ARCHITECTURE.md
4. docs/index.md
5. docs/MVP_SCOPE.md
6. docs/TECH_STACK.md
7. docs/WEB_TO_APP_TRANSITION.md
8. docs/exec-plans/active/2026-04-23-plan-editing.md
9. src/ui/planner/circular-planner.tsx
10. src/app/globals.css

현재 기준:
- branch: `git branch --show-current`
- commit: `git rev-parse --short HEAD`
- latest progress: overlap error message clarified

현재 구현 상태:
- Next.js + TypeScript 기반 웹 MVP
- 24시간 원형 플래너
- 계획 등록/삭제/완료 토글/수정
- 현재 계획 강조 강화
- 계획 폼 액션 버튼 같은 라인 정렬
- 색상 미리보기 하단 별도 블록 유지
- 자유 분 단위 시간 입력
- 시간 겹침 일정 저장 차단
- 충돌 메시지는 기존 등록 일정 제목/시간 기준
- 첫 충돌 일정 1건만 안내
- 기본 팔레트 + 사용자 지정 색상 흐름
- 3시간 단위 숫자 라벨
- 0/12 라벨 보조 아이콘
- localStorage 저장

중요 규칙:
- 구현 변경은 내가 명시적으로 진행하라고 할 때만 수행해라.
- 그 전에는 분석과 제안까지만 해라.
- 새 실제 작업은 브랜치를 만들어서 진행하고, main 머지는 내가 요청할 때만 해라.
- 커밋 후에는 docs/HANDOFF.md를 갱신하되, 커밋 해시는 git 명령으로 확인하게 유지해라.

먼저 현재 상태를 요약하고, 내가 승인할 때만 실제 수정을 시작해라.
```
