# Expo Route Validation

## Goal

`expo-router` 기반 Expo 앱에서 `today -> editor -> reflection -> motivation` 흐름이 실제 route 전환과 앱 bootstrap 경로를 포함해 안정적으로 동작하는지 검증하고, 확인된 결함을 바로 수정한다.

## Scope

- Expo route entry와 overlay 흐름 점검
- 앱 bootstrap 이후 오늘 화면, 계획 편집, 회고, 동기부여 화면 진입 검증
- 로컬 타입체크 및 가능한 범위의 실행 검증
- 확인된 라우트/상태 연동 결함 수정
- 완료 시 검증 결과와 남은 작업 기록

## Assumptions

- 현재 작업은 기존 작업 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree에 이미 존재하는 문서 변경은 이번 작업 범위 밖이며 되돌리지 않는다.
- iOS simulator와 Expo development build는 현재 로컬 환경에 이미 준비돼 있다고 본다. 준비 상태가 다르면 검증 범위를 문서에 남긴다.

## Steps

1. Expo route 파일, route contract, 앱 bootstrap 연결 경로를 확인한다.
2. 로컬 검증 명령과 가능한 실행 흐름으로 `today -> editor -> reflection -> motivation` 전환을 확인한다.
3. 확인된 결함이 있으면 route/state/provider 경계 안에서 수정한다.
4. 수정 후 타입체크와 관련 검증을 다시 실행한다.
5. 완료 범위와 검증 결과를 기록하고, 남은 작업이 없으면 completed로 이동한다.

## Validation

- `apps/expo` 기준 타입체크가 통과해야 한다.
- route 진입 파일과 contract가 실제 화면 흐름과 일치해야 한다.
- 가능한 범위에서 오늘 화면에서 편집/회고/동기부여 화면으로 이동하는 경로를 재현하거나, 재현 한계를 명시해야 한다.

## Completion

Completed. `expo-router` route tree와 시뮬레이터 앱을 기준으로 `today -> editor -> reflection -> motivation` 흐름과 취소/충돌 저장 실패 복귀 동작을 직접 확인했다. 이번 검증에서는 route 전환 자체를 막는 결함은 재현되지 않아 코드 수정은 하지 않았다.

## Validation Result

- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- 실제 iOS 시뮬레이터에서 `새 계획 추가 -> Plan Editor`, `회고 -> Reflection`, `동기` 탭 전환, 각 화면의 `취소` 복귀를 확인했다.
- `Plan Editor`에서 기존 일정과 겹치는 시간으로 저장 시 화면에 남아 충돌 오류를 보여주는 것도 확인했다.
- `xcrun simctl spawn booted log show --last 10m --predicate 'process == "app"'`는 CoreSimulatorService 연결 오류로 실패했다. 로그 추적 대신 시뮬레이터 UI 재현으로 검증했다.

## Open Work

- None.
