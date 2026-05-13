# Expo Route Provider Integration Tests

## Goal

Expo `expo-router` route 엔트리와 provider 기반 앱 모델 연결이 핵심 화면 전환과 상태 반영에서 어긋나지 않도록 통합 테스트를 보강한다.

## Scope

- Expo route 엔트리와 provider/app model 연결 경로 확인
- 핵심 화면 전환 또는 상태 반영 경로 1개 이상 선정
- 필요한 테스트 helper 또는 작은 구조 정리
- focused 테스트, 타입체크, 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 기능 확장보다 route/provider 연결 검증 보강에 집중한다.

## Steps

1. Expo route 엔트리, provider, 앱 모델 연결 지점을 다시 읽는다.
2. 현재 테스트 공백 중 회귀 위험이 큰 경로를 선정한다.
3. 필요한 최소 구조 정리와 focused 통합 테스트를 추가한다.
4. 테스트, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 추가한 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. Expo route 파일의 model/router 연결 분기를 `expo-router-route-actions` helper로 분리해 `today`, `editor`, `reflection` route가 같은 규칙으로 create/edit/reschedule/reflection 초기화와 복귀를 처리하도록 정리했다. `expo-router` 패키지를 vitest에서 직접 파싱하기 어려운 제약 때문에 helper를 중심으로 route/provider 계약을 focused 테스트로 고정했고, today 리마인드 문구 계산도 같은 helper로 묶었다.

## Validation Result

- `npm test -- tests/expo-router-route-actions.test.ts tests/circular-planner-ui.test.tsx tests/reschedule-failure-guidance.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- `expo-router` route component 자체를 직접 렌더링하는 테스트는 라이브러리 파싱 제약 때문에 아직 없다.
