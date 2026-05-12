# Expo Global Theme Presets

## Goal

Expo 앱에서 톱니 메뉴를 통해 전반적인 색감 테마를 `Sand`, `Mint`, `Night Ink` 3개 프리셋으로 전환할 수 있게 만든다.

## Scope

- Expo 전역 테마 상태와 프리셋 팔레트 정의
- today 화면 톱니 메뉴에 테마 선택 추가
- today, editor, reflection, motivation, app shell 공통 화면 색상 반영
- 필요한 helper/test, Expo 타입체크, 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 Expo 앱 전역 프리셋 테마 도입에 집중하며, 웹 MVP 테마 기능은 범위에 넣지 않는다.

## Steps

1. Expo 테마 구조와 톱니 메뉴 연결 경로를 다시 읽는다.
2. 3개 테마 프리셋과 전역 상태 위치를 정한다.
3. 전역 테마 적용 구조와 today 설정 메뉴를 구현한다.
4. helper/test, Expo 타입체크, 문서 검증을 실행한다.
5. 완료 범위와 검증 결과를 기록하고 completed로 이동한다.

## Validation

- 관련 테스트가 통과해야 한다.
- `apps/expo` 타입체크가 통과해야 한다.
- 문서 검증 스크립트가 통과해야 한다.

## Completion

Completed. Expo 앱에 `Sand`, `Mint`, `Night Ink` 3개 전역 테마 프리셋을 추가했고, today 화면 톱니 메뉴에서 시간 표시 형식과 함께 테마도 바꿀 수 있게 연결했다. 정적 `expoTheme`는 프리셋 기반 factory와 theme provider 구조로 바뀌었고, today/editor/reflection/motivation 화면과 app shell, router shell, tab bar가 선택된 테마를 따라가도록 정리했다. 선택 상태는 AsyncStorage에 저장해 재실행 후에도 유지된다.

## Validation Result

- `npm test -- tests/expo-theme.test.ts tests/expo-circular-planner-layout.test.ts tests/expo-router-route-actions.test.ts tests/reschedule-failure-guidance.test.ts`가 통과했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `bash scripts/validate-docs.sh`가 통과했다.

## Open Work

- 실제 React Native 렌더 스냅샷 테스트는 아직 없어서 theme별 픽셀 레벨 시각 회귀는 별도 QA가 필요하다.
