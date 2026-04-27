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
8. `docs/exec-plans/active/2026-04-24-app-transition-decision.md`
9. `docs/exec-plans/active/2026-04-23-plan-editing.md`
10. `src/ui/planner/circular-planner.tsx`
11. `src/app/globals.css`

## Current Baseline

- 현재 브랜치: `docs/handoff-plan-alignment`
- 기준 커밋: `git rev-parse --short HEAD`로 확인
- 최근 반영 작업: `minimum web reminder prototype scope documented`

## Current Product State

- Next.js + TypeScript 기반 웹 MVP가 있다.
- 웹 MVP는 최종 상태가 아니라 앱 전환 전 검증 단계다.
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
- 저장소 계약(`plans-store`) 뒤에서 웹 `localStorage` 구현을 사용한다.
- 시간 소스는 `PlannerShell`에서 `CircularPlanner`로 주입된다.
- 편집 상태와 저장/검증 호출은 `use-planner-state`로 분리돼 있다.
- 리마인드 provider 계약과 웹 기본 `noop` 구현이 추가돼 있다.
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준이 문서로 정리돼 있다.
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현하기로 정리돼 있다.
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리돼 있다.
- Vitest 기반 UI 사용자 흐름 테스트가 추가돼 있다.
- Playwright 기반 브라우저 E2E 흐름 테스트가 추가돼 있다.
- 브라우저 테스트는 `build + start` 서버 기준으로 실행되며, 로컬은 시스템 Chrome 채널, CI는 번들 `chromium`을 사용한다.
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E가 자동 실행된다.
- `.githooks/post-commit`은 `scripts/check-handoff-loop.sh`를 호출해 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고한다.
- `npm run check:handoff-loop`로 같은 점검을 수동 실행할 수 있다.
- `npm run test:handoff-loop`로 점검 스크립트의 대표 경고 시나리오를 검증할 수 있다.
- 앱 전환 방식 비교 기준과 결정 입력 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 초기 앱 클라이언트 최소 범위가 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목이 `docs/WEB_TO_APP_TRANSITION.md`에 정리돼 있다.
- 현재 문서 기준 우선 권장 앱 전환안은 `Expo + React Native`다.
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리돼 있다.
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영돼 있다.
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영돼 있다.

## Working Rules

- 구현 변경은 사용자가 명시적으로 `진행하자`, `적용해`, `수정해`, `브랜치 만들어서 진행해`라고 말했을 때만 수행한다.
- 그 전에는 분석, 원인 파악, 제안까지만 한다.
- 새 실제 작업은 `main`에서 직접 하지 않고, 사용자가 승인하면 작업 브랜치를 만든다.
- `main` 머지는 사용자가 명시적으로 요청할 때만 한다.
- 커밋 후에는 `docs/HANDOFF.md`의 최근 반영 작업, 현재 상태, 다음 작업을 검토하고 갱신한다.
- 커밋 해시는 문서에 고정하지 말고 git 명령으로 확인하게 유지한다.
- 리포지터리 밖에만 있는 지식은 없는 것으로 간주한다.

## Suggested Next Work

1. 웹 리마인드 프로토타입을 배너/인라인 강조/상태 메시지 중 어떤 형태로 둘지 결정
2. 앱 UI 재사용 전략 기준으로 `use-planner-state` 아래 공용 view-model 계층이 더 필요한지 판단
3. 실제 운영 중 커밋 루프 점검 경고 노이즈가 과한지 관찰하고 필요하면 조건을 조정

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
8. docs/exec-plans/active/2026-04-24-app-transition-decision.md
9. docs/exec-plans/active/2026-04-23-plan-editing.md
10. src/ui/planner/circular-planner.tsx
11. src/app/globals.css

현재 기준:
- branch: `git branch --show-current`
- commit: `git rev-parse --short HEAD`
- latest progress: minimum web reminder prototype scope documented

현재 구현 상태:
- Next.js + TypeScript 기반 웹 MVP
- 웹 MVP는 앱 전환 전 검증 단계
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
- 저장소 계약 뒤에서 웹 localStorage 구현 사용
- 시간 소스는 PlannerShell에서 CircularPlanner로 주입
- 편집 상태와 저장/검증 호출은 use-planner-state로 분리
- 리마인드 provider 계약과 웹 기본 noop 구현 추가
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준 정리
- 리마인드는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 로컬 알림은 앱 전환 단계에서 구현
- 웹 리마인드 프로토타입 최소 범위는 시작 시점 근처 1회 신호, 현재 계획 정보, 완료로 이어지는 짧은 경로로 정리
- Vitest UI 사용자 흐름 테스트 추가
- Playwright 브라우저 E2E 테스트 추가
- E2E는 `build + start` 기준, 로컬은 시스템 Chrome 채널, CI는 번들 `chromium`
- 계획 편집 흐름의 기본 테스트 범위는 실행 계획 문서에 정리됨
- 테스트 확장 조건과 CI 실패 시 문서 갱신 기준은 실행 계획 문서에 정리됨
- GitHub Actions CI에서 문서 검증, 타입체크, Vitest, Playwright E2E 자동 실행
- post-commit 훅이 `HANDOFF` 갱신과 완료 계획 이동 점검을 함께 경고
- `npm run check:handoff-loop`로 같은 점검을 수동 실행 가능
- `npm run test:handoff-loop`로 대표 경고 시나리오 검증 가능
- 앱 전환 방식 비교 기준과 결정 입력 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 초기 앱 클라이언트 최소 범위는 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 웹에서 더 검증할 항목과 지금 바로 결정할 항목은 `docs/WEB_TO_APP_TRANSITION.md`에 정리됨
- 현재 우선 권장 앱 전환안은 `Expo + React Native`
- 앱 전환 전 남은 UX 검증 항목은 우선순위와 현재 증거 수준 기준으로 정리됨
- 저장소 계약 분리와 시간 소스 주입 경로 분리가 실제 코드에 반영됨
- 편집 상태와 저장/검증 호출 분리가 실제 코드에 반영됨

중요 규칙:
- 구현 변경은 내가 명시적으로 진행하라고 할 때만 수행해라.
- 그 전에는 분석과 제안까지만 해라.
- 새 실제 작업은 브랜치를 만들어서 진행하고, main 머지는 내가 요청할 때만 해라.
- 커밋 후에는 docs/HANDOFF.md를 갱신하되, 커밋 해시는 git 명령으로 확인하게 유지해라.
- CI 실패가 문서/계획 불일치와 연결되면 HANDOFF와 실행 계획도 함께 갱신해라.

먼저 현재 상태를 요약하고, 내가 승인할 때만 실제 수정을 시작해라.
```
