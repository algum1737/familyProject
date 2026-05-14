# Android Time Picker Safe Area

## Context

Android 실기기 `SM_S908N` QA 중 시간 설정 UI의 하단 `취소`/`확인` 액션이 기기 navigation bar에 가려지는 문제가 관찰됐다. 이 작업은 시간 설정 UI가 Android navigation bar가 있는 환경과 gesture/navigation bar가 사실상 없는 환경 모두에서 하단 액션을 안전하게 노출하도록 수정한다.

## Scope

- Expo plan editor 시간 설정 UI의 하단 액션 레이아웃 확인
- navigation bar/safe area/inset 대응 수정
- 관련 snapshot 또는 단위 테스트 갱신
- 문서와 handoff 갱신

## Out of Scope

- Android background OS notification 미표시 원인 수정
- 새 EAS cloud build 생성
- Google Play Console 또는 릴리스 절차
- 디자인 전면 개편

## Assumptions

- 사용자의 `진행하자`는 직전 논의한 time picker navigation bar 겹침 수정 승인으로 본다.
- 실기기에서 관찰된 `취소`/`확인`은 앱 내부 time picker 하단 액션이며, 앱 코드에서 safe area/inset 또는 여백으로 해결할 수 있다.

## Verification Contract

### Pre-flight checks

- `git status --short --branch`
- `docs/exec-plans/active/`에 이 계획만 활성 상태인지 확인

### Automated tests

- 변경 영향 범위에 맞는 Expo 테스트 또는 타입체크 실행
- `bash scripts/validate-docs.sh`

### Manual/Runtime QA

- 가능하면 Android 실기기에서 plan editor 시간 설정 UI를 열고 `취소`/`확인`이 navigation bar에 가려지지 않는지 확인한다.
- 실기기 QA를 즉시 수행하지 못하면 실행하지 못한 이유와 대체 검증을 `Validation Result`에 남긴다.

### Skipped/Not Run

- 새 preview APK/EAS build가 필요한 경우, 사용자가 별도 승인하기 전에는 수행하지 않는다.

## Open Work

- Android 실기기에서 수정 후 time picker 하단 액션이 navigation bar 위로 올라오는지 확인해야 한다.
- 새 APK 빌드/설치가 필요하면 별도 승인 또는 후속 QA 작업으로 분리한다.

## Steps

1. 현재 브랜치와 작업 트리를 확인한다.
2. 시간 설정 UI 구현과 스타일 정의를 찾는다.
3. 하단 액션이 Android safe area/inset을 피하도록 최소 수정한다.
4. 관련 테스트 또는 snapshot을 갱신한다.
5. 자동 검증을 실행한다.
6. 완료 범위와 검증 결과를 기록하고 계획을 completed로 이동한다.

## Completion

- 완료일: 2026-05-14
- 작업 브랜치: `feature/android-real-device-notification-qa`
- `apps/expo/src/screens/plan-editor-screen.tsx`에서 `useSafeAreaInsets()`를 사용해 time picker bottom sheet의 하단 padding을 동적으로 적용했다.
- `apps/expo/src/app-shell/expo-time-picker-safe-area.ts`에 하단 inset padding 계산을 분리했다.
- inset이 없는 gesture 환경은 기존 `28` padding을 유지하고, navigation bar 등 bottom inset이 있는 환경은 `ceil(bottomInset) + 18` padding으로 하단 액션을 올린다.
- `tests/expo-time-picker-safe-area.test.ts`로 inset `0`, 큰 Android navigation inset, 음수/소수 inset 계산을 고정했다.

## Validation Result

- `git status --short --branch`: 통과. `feature/android-real-device-notification-qa`에서 작업했다.
- `npm test -- --run tests/expo-time-picker-safe-area.test.ts`: 통과.
- `npm run typecheck`: 통과.
- `npm test -- --run tests/expo-time-picker-safe-area.test.ts tests/expo-theme-screen-style-snapshots.test.ts`: 통과.
- `bash scripts/validate-docs.sh`: 통과.
- Android 실기기 런타임 QA: 미실행. 현재 설치된 preview APK에는 이번 소스 변경이 반영되지 않으며, 새 빌드/설치는 별도 승인 또는 후속 QA가 필요하다.

## Status

Completed. time picker 하단 액션은 bottom safe area inset을 반영해 Android navigation bar가 있는 환경에서도 위로 올라오도록 수정됐다. 남은 작업은 새 Android 빌드/설치 후 실기기에서 `취소`/`확인` 버튼의 실제 가시성을 확인하는 것이다.
