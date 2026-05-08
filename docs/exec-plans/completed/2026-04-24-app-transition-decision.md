# App Transition Decision Plan

## Goal

웹 MVP 검증 뒤 실제 앱 전환으로 넘어가기 위해, 지금 남아 있는 핵심 결정 항목과 선행 조건을 정리한다.

## Why Now

- 최종 목표는 웹 유지가 아니라 앱 전환이다.
- 현재 웹 MVP와 하네스는 상당 부분 갖춰졌지만, 앱 전환 경로와 초기 클라이언트 범위는 아직 열려 있다.
- 이 불확실성을 정리하지 않으면 이후 웹 작업 우선순위도 흔들린다.

## Scope

- 앱 전환 목표를 문서에 명시
- 앱 전환 결정을 막는 핵심 미결정 항목 정리
- 전환 옵션별 비교 기준 정의
- 웹 MVP에서 더 검증해야 할 항목과 바로 결정 가능한 항목 분리
- 다음 제품/기술 우선순위 재정렬

## Current State

- 웹 MVP에서 원형 플래너, 계획 CRUD, 완료 토글, 시간 겹침 검증, 로컬 저장이 동작한다.
- 사용자 흐름 테스트와 CI가 마련돼 있다.
- 앱 전환 자체는 여러 문서에서 언급되지만, 어떤 결정을 언제 내릴지 하나의 실행 계획으로 정리돼 있지 않았다.

## Key Decision Questions

1. 앱 전환 방식은 `Expo + React Native` 재구성인지, 하이브리드 래핑인지
2. 초기 앱 클라이언트에서 반드시 필요한 기능은 무엇인지
3. 웹 MVP에서 더 검증해야 하는 UX 가설은 무엇인지
4. 앱 전환 전에 도메인/provider 경계에서 추가로 분리해야 할 부분은 무엇인지
5. 알림, 저장, 계정 전략 중 무엇을 앱 전환 전에 결정해야 하는지

## Deliverables

- 앱 전환 우선순위 정리 문서 반영
- 전환 방식 비교 기준 정리
- 웹 MVP 잔여 검증 항목과 앱 전환 선행 조건 구분
- 다음 구현 우선순위 초안

## Completion Status

Completed. The decision work selected `Expo + React Native`, documented the transition boundaries, and produced the initial Expo app shell and route structure. Remaining implementation validation belongs in follow-up active plans, not this decision plan.

## Open Work

- None for this decision plan.
- Follow-up implementation work should use new active plans.

## Recent Changes

- 제품/아키텍처/전환 문서에 앱 전환이 최종 목표라는 점을 명시
- `docs/WEB_TO_APP_TRANSITION.md`에 전환 옵션 비교 기준과 결정 입력 항목을 추가
- `docs/WEB_TO_APP_TRANSITION.md`에 초기 앱 클라이언트 최소 범위를 확정
- `docs/WEB_TO_APP_TRANSITION.md`에 웹에서 더 검증할 항목과 지금 바로 결정할 항목을 분리
- 현재 코드 구조를 기준으로 옵션 평가를 수행했고, `Expo + React Native`를 우선 권장안으로 정리
- 앱 전환 전 분리해야 할 저장소, 시간 소스, 편집 상태, 리마인드 provider 경계를 체크리스트로 정리
- 앱 전환 우선안 확정 전에 남은 UX 검증 항목을 우선순위와 현재 증거 수준 기준으로 정리
- 앱 전환 전 경계 분리 순서를 저장소 -> 시간 소스 -> 편집 상태 -> 리마인드 provider로 정리
- 저장소 계약(`plans-store`)을 추가하고 웹 `localStorage` 구현을 해당 계약 뒤로 이동
- 시간 소스를 `PlannerShell`에서 `CircularPlanner`로 주입하는 경로로 정리
- 편집 상태와 저장/검증 호출을 `use-planner-state`로 분리
- 리마인드 provider 계약과 웹 기본 `noop` 구현을 추가
- 앱 전환 시 재사용할 계층과 앱에서 재구성할 UI 계층 기준을 문서로 정리
- 리마인드 provider는 웹에서 얇은 프로토타입으로 의미를 검증하고, 네이티브 알림은 앱 전환 단계에서 구현하기로 결정
- 웹 리마인드 프로토타입의 최소 범위를 "시작 시점 근처 1회 알림, 현재 계획 정보, 완료로 이어지는 짧은 경로"로 정리
- 웹 리마인드 프로토타입을 배너 형태로 실제 UI에 연결하고 기본 테스트를 추가
- `use-planner-state` 위에 `use-planner-view-model` 계층을 추가해 현재 계획/요약/리마인드 화면 상태를 공용 hook으로 올림
- 웹 리마인드 기본 정책을 `시작 5분 전 ~ 시작 후 10분`, 닫기는 현재 리마인드 창에만 적용으로 보정
- 현재 계획 시간 문구, 리스트 상태 라벨, 섹션 제목, 제출 버튼 문구도 `use-planner-view-model`로 올려 앱 UI 재사용 범위를 넓힘
- 리마인드 표시, 닫기, 완료를 최근 5건까지 확인할 수 있는 관찰 로그를 웹 UI와 `localStorage`에 추가
- 관찰 로그에 `표시`, `닫기`, `완료`, `완료 전환율` 요약과 정책 판단용 힌트를 추가
- 관찰 패널에 기록 범위와 `관찰 더 필요`, `조정 검토`, `우선 유지` 정책 상태를 추가
- `닫기 비율`을 추가하고, 표본 3회 이상에서만 `조정 검토`와 `우선 유지`가 갈리도록 기준을 고정
- 시작 전 리마인드에서는 `지금 완료`를 숨기고 `닫기`만 노출하도록 보정
- `오늘 계획` 리스트에서도 시작 전 pending 일정의 완료 버튼을 비활성화해 같은 규칙으로 맞춤
- 종료 시각이 지난 pending 일정은 자동으로 `missed` 상태로 전환하는 도메인 기초를 추가
- `rescheduleCount` 메타데이터와 별도 `Missed Plan Recovery Plan`을 추가해 회고/재지정 후속 작업을 분리
- 앱 전환 문서에 `App Transition Readiness`, `First App Build Order`, `Immediate Next Documentation` 기준을 추가해 실행 직전 판단과 첫 구현 순서를 고정
- 앱 저장소 후보 비교 문서를 추가하고, 첫 앱 저장소 기본안은 `AsyncStorage` 계열, 중장기 확장 재검토 후보는 `SQLite` 계열로 정리
- 월간 동기부여 페이지를 현재 버전에 포함하는 방향을 문서에 반영하고, 날짜 기반 데이터 모델 초안을 추가
- 월간 selector 계층과 저장 계약 개정 방향 문서를 추가해, 화면이 raw 저장 값을 직접 해석하지 않도록 기준을 고정
- 앱 로컬 알림 구현 초안을 추가하고, 시작 리마인드는 OS 로컬 알림 + 인앱 배너, 종료 5분 전은 인앱 `계속 진행`만 유지하는 방향을 고정
- 웹 공용 계층과 앱 전용 UI 계층 경계 초안을 추가해, 어떤 파일을 재사용하고 어떤 파일은 앱에서 새로 만들지 기준을 고정
- 앱 타입 초안을 추가해 `date` 포함 기록 모델, selector 출력 타입, 저장 계약 이름 초안을 고정
- `use-planner-view-model` core 분리 초안을 추가해, 계산과 웹 문구/관찰 패널을 어디서 나눌지 기준을 고정
- 앱 프로젝트 초기화 시 첫 파일 배치안을 추가해, 실제 앱 브랜치에서 어떤 폴더와 파일을 먼저 만들지 기준을 고정
- 기존 `DailyPlan` 점진 이행 계획을 추가해, 날짜 기반 기록 모델로 넘어가는 순서를 고정

## Current Focus

- Completed. Expo app transition follow-up now lives in the current codebase and should be tracked through new active implementation plans.

## Decision Snapshot

- 현재 우선 권장안: `Expo + React Native`
- 이유 1: 최종 목표가 실제 앱이며, 로컬 알림과 모바일 상호작용 요구에 가장 직접적으로 맞는다.
- 이유 2: 현재 UI는 웹 전용 결합이 강해 하이브리드 래핑만으로 얻는 재사용 이점이 제한적이다.
- 이유 3: 도메인 로직과 일정 규칙은 이미 상대적으로 재사용 가능한 구조다.
- 현재 판단: 웹 검증은 제품 방향을 고정하기에 충분한 수준까지 왔고, 다음 결정의 성격은 UX 탐색보다 앱 구현 준비에 가깝다.

## Validation

- `docs/HANDOFF.md`에 최종 목표와 다음 작업 우선순위가 일관되게 반영돼야 한다.
- `docs/WEB_TO_APP_TRANSITION.md`, `docs/MVP_SCOPE.md`, 제품 명세 문서의 표현이 서로 충돌하지 않아야 한다.
- 실행 계획이 끝나면 앱 전환 직전까지 남은 질문 목록이 더 좁아져야 한다.
