# Android Route Boundary Smoke QA

## Context

`Expo Route Adapter Boundary`가 PR #8로 `main`에 머지됐다. 최신 `main` 기준 standalone Android APK를 실기기에 설치해 route adapter 변경 후 기본 화면 전환이 깨지지 않는지 확인한다.

## Scope

- Android 실기기 연결 상태 확인
- 최신 `main` 기준 standalone release APK 빌드
- 실기기 설치
- Metro 연결 없이 standalone 실행 상태 확인
- Today, 계획 편집 진입/취소, Motivation 탭, 알림 권한 초기 상태 smoke 확인
- 완료 결과를 docs index, handoff, completed plan에 기록

## Out of Scope

- 알림 예약/백그라운드 전달 장기 QA
- Play Console/EAS production 제출
- UI 레이아웃 수정
- route adapter 추가 구현

## Assumptions

- 사용자 요청의 `진행해`는 QA 브랜치 생성, 빌드/설치, 실기기 조작, 문서 기록 승인으로 본다.
- 현재 연결된 실기기 `SM_S908N`을 QA 대상 기기로 사용한다.
- 기존 설치본과 서명이 다르면 삭제 후 재설치가 필요할 수 있으며, 이 경우 앱 데이터는 초기화된다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `adb devices -l`
- `git rev-parse --short HEAD`

### Automated tests

- `./gradlew assembleRelease`
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- `adb reverse --list`가 비어 있는지 확인한다.
- 앱을 실행하고 foreground activity/process를 확인한다.
- 알림 권한 프롬프트 또는 권한 상태를 확인한다.
- 화면 전환 smoke: Today 렌더링, 계획 편집 진입/취소, Motivation 탭 진입.

### Skipped/Not Run

- 장기 알림 delivery QA는 이번 smoke 범위에서 제외한다.

## Completed Scope

- Android 실기기 `SM_S908N` / `R5CT31X2K2H` 연결을 확인했다.
- `main`의 `5d67d41` 기준 standalone release APK를 빌드했다.
- `apps/expo/android/app/build/outputs/apk/release/app-release.apk`를 실기기에 재설치했다.
- `adb reverse --list`가 비어 있는 Metro-free standalone 상태를 확인했다.
- 설치 패키지 `com.familyproject.todaydidyoufinish`의 `versionCode=1`, `versionName=0.1.0`, `targetSdk=36`, `POST_NOTIFICATIONS granted=true` 상태를 확인했다.
- Today 화면 렌더링, 계획 편집 진입/취소, 계획 저장, 저장된 계획 편집 진입/취소, Motivation 탭 진입을 smoke 확인했다.
- 3-button navigation bar가 있는 상태에서 계획 편집 화면 하단 `취소`/`저장` 버튼 bounds `[102,1927][805,2056]`, `[833,1927][980,2056]`가 navigation bar bounds `[0,2181][1080,2316]` 위에 있어 가려지지 않는 것을 확인했다.
- QA용 `QA-route-smoke` 계획을 삭제해 앱 데이터를 smoke 전 빈 상태로 되돌렸다.

## Steps

1. 실기기 연결과 기준 커밋을 확인한다.
2. standalone release APK를 빌드한다.
3. 실기기에 설치하고 필요 시 기존 패키지를 제거 후 재설치한다.
4. Metro reverse 없이 실행되는지 확인한다.
5. 기본 화면 전환 smoke를 수행한다.
6. 완료 범위와 검증 결과를 기록하고 completed plan으로 이동한 뒤 커밋한다.

## Validation Result

### Pre-flight checks

- `git status --short --branch`: `qa/android-route-boundary-smoke`에서 문서 변경만 있는 상태로 시작했다.
- `adb devices -l`: `R5CT31X2K2H device usb:1-1 product:b0qksx model:SM_S908N device:b0q transport_id:10`.
- `git rev-parse --short HEAD`: `5d67d41`.

### Automated tests

- `./gradlew assembleRelease` in `apps/expo/android`: passed.
- `bash scripts/validate-docs.sh`: passed.

### Manual/Runtime QA

- `adb install -r apps/expo/android/app/build/outputs/apk/release/app-release.apk`: passed.
- `adb reverse --list`: empty output, Metro reverse 없음.
- `adb shell am start -n com.familyproject.todaydidyoufinish/.MainActivity`: 앱 실행 확인.
- `adb shell pidof com.familyproject.todaydidyoufinish`: `30700`.
- Today 화면: `오늘 다 했니`, `현재 계획 없음`, `새 계획 추가`, bottom tabs 표시 확인.
- 계획 편집 생성 flow: `새 계획 추가` -> `계획 편집` -> `오늘 불러온 계획 수: 0` -> `취소` 복귀 확인.
- 계획 저장 flow: `QA-route-smoke` 입력 후 저장, Today 현재 계획과 오늘 계획 카드에 `QA-route-smoke` 표시 확인.
- 계획 편집 기존 항목 flow: 오늘 계획 카드의 `편집` -> `계획 편집`, `오늘 불러온 계획 수: 1`, 기존 제목 `QA-route-smoke` 표시 확인 후 `취소` 복귀.
- Motivation 탭: `동기`, `이달 요약`, `2026-05 체인 완료 0개`, `회복 기여` 표시 확인.
- Navigation bar overlap: 계획 편집 하단 액션은 navigation bar 위에 렌더링되어 가려지지 않았다.

### Skipped/Not Run

- 장기 알림 delivery QA는 이번 route boundary smoke 범위가 아니어서 실행하지 않았다.
