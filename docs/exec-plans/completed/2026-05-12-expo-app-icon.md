# Expo App Icon

## Goal

`오늘 다 했니`의 모바일 홈 화면용 앱 아이콘을 새로 만들고, Expo 설정과 현재 iOS 자산에 연결한다.

## Scope

- 현재 Expo 앱 아이콘 설정과 자산 경로 확인
- 새 앱 아이콘 bitmap 생성
- Expo `app.json`과 iOS AppIcon 자산 연결
- 기본 검증과 문서 반영

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 별도 브랜드 가이드가 없으므로 현재 앱의 warm/calm theme 톤과 `시간판 + 완료` 개념을 반영한 단순 아이콘으로 진행한다.
- 우선 1024x1024 단일 마스터 아이콘을 기준으로 Expo와 iOS 자산에 적용한다.

## Steps

1. 현재 앱 아이콘 설정과 자산 경로를 확인한다.
2. 홈 화면용 앱 아이콘 이미지를 생성한다.
3. Expo 설정과 iOS 앱 아이콘 자산에 연결한다.
4. 관련 검증과 문서 업데이트를 수행한다.

## Validation

- 생성된 아이콘 파일이 프로젝트 자산 경로에 존재해야 한다.
- `apps/expo`에서 타입체크 또는 설정 검증이 통과해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. `오늘 다 했니`의 모바일 홈 화면용 앱 아이콘을 새로 만들고 Expo 설정과 현재 iOS 자산에 연결했다. 생성한 아이콘은 [app-icon-1024.png](/Users/hun/workspace/familyProject/apps/expo/assets/app-icon-1024.png)로 프로젝트에 보관했고, [app.json](/Users/hun/workspace/familyProject/apps/expo/app.json)에는 공통 Expo 아이콘 경로를 추가했다. 현재 iOS 개발 빌드가 바로 참조하는 [App-Icon-1024x1024@1x.png](/Users/hun/workspace/familyProject/apps/expo/ios/app/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png)도 같은 자산으로 교체했다.

## Validation Result

- `apps/expo/assets/app-icon-1024.png`와 iOS AppIcon 마스터 PNG가 모두 `1024x1024` 규격임을 확인했다.
- `apps/expo`에서 `npx tsc --noEmit -p tsconfig.json`이 통과했다.
- `app.json`의 `expo.icon` 경로가 `./assets/app-icon-1024.png`로 설정된 것을 확인했다.
