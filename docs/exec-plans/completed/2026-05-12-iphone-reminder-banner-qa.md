# iPhone Reminder Banner QA

## Goal

실제 iPhone 환경에서 Expo 로컬 알림의 시작 5분 전, 종료 5분 전 OS 배너가 사용자 눈에 보이는지 검증한다.

## Scope

- 현재 환경에서 연결된 실제 iPhone 존재 여부 확인
- 가능하면 iPhone에서 Expo 앱 실행 상태와 알림 권한 상태 점검
- 시작 5분 전, 종료 5분 전 배너 가시성 확인
- 결과 문서화

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 실제 iPhone 연결 여부는 현재 세션에서 보장되지 않는다.
- 실제 iPhone이 없으면 그 사실과 남은 제약을 명시적으로 기록한다.

## Steps

1. 연결된 실제 iPhone과 QA 가능 전제를 확인한다.
2. 실제 iPhone이 있으면 짧은 미래 일정으로 배너 가시성을 검증한다.
3. 결과와 제약을 기록하고 completed로 이동한다.

## Validation

- 실제 iPhone이 있으면 시작 또는 종료 알림 중 최소 한 경로의 배너 가시성 여부를 기록해야 한다.
- 실제 iPhone이 없으면 환경 제약을 명시해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Open Work

- 실제 iPhone이 없거나 접근이 막히면, 연결 가능한 기기 확보 후 같은 시나리오를 다시 수행해야 한다.

## Result

- `xcrun devicectl list devices`와 `xcrun xctrace list devices`로 현재 환경의 물리 기기 연결 상태를 확인했다.
- `devicectl`은 `No provider was found.`와 함께 `No devices found.`를 반환했고, `xctrace`도 실제 기기 목록에는 `MacBook Pro`만 표시했다.
- 즉 현재 세션에서는 연결된 실제 iPhone이 없어, 시작 5분 전 또는 종료 5분 전 OS 배너의 실기 검증을 진행할 수 없었다.

## Validation Result

- 물리 기기 연결 여부를 `devicectl`과 `xctrace` 두 경로로 교차 확인했다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.
