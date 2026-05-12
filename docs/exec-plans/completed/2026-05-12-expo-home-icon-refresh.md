# Expo Home Icon Refresh

## Goal

새로 추가한 Expo 앱 아이콘이 iOS 시뮬레이터 홈 화면에 실제로 보이도록 dev build를 다시 설치하고 결과를 확인한다.

## Scope

- 현재 시뮬레이터/앱 설치 상태 확인
- 필요한 경우 iOS dev build 재설치
- 홈 화면 아이콘 반영 여부 확인
- 결과 문서화

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 현재 세션에서 사용할 대상은 iOS 시뮬레이터다.

## Steps

1. 시뮬레이터와 설치된 앱 상태를 확인한다.
2. 새 아이콘이 반영되도록 iOS dev build를 다시 설치한다.
3. 홈 화면 screenshot 또는 앱 아이콘 상태를 확인한다.
4. 결과를 문서화하고 completed로 이동한다.

## Validation

- 시뮬레이터에 설치된 앱이 새 아이콘을 사용해야 한다.
- 필요하면 홈 화면 screenshot으로 확인한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. 새 앱 아이콘이 iOS 시뮬레이터 홈 화면에 실제로 보이도록 Expo iOS dev build를 다시 설치했다. `npx expo run:ios -d "iPhone 17 Pro" --no-build-cache`로 새 번들을 재설치했고, 이후 Simulator에 `⌘⇧H`를 보내 홈 화면으로 이동한 뒤 screenshot으로 아이콘 반영을 확인했다.

## Validation Result

- iPhone 17 Pro 시뮬레이터에 새 dev build 설치가 완료됐다.
- 홈 화면 screenshot에서 `오늘 다 했니` 앱이 새 원형 시간판/체크 아이콘으로 표시되는 것을 확인했다.
- `bash scripts/validate-docs.sh`가 통과했다.
