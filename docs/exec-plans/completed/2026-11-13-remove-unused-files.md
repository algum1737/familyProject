# 중복·미사용 파일 정리

## Goal

사용자가 승인한 작업 브랜치에서 중복 기획서 PDF와 현재 앱에서 사용하지 않는 코드 및 Android 이미지 파일을 삭제한다.

## Scope

- 기획서 중복본 `기획/오늘_다했니_기획서.pdf` 1개
- 이전 Expo 진입점과 데모 셸 관련 파일 8개
  - `apps/expo/App.tsx`
  - `apps/expo/src/expo-app-shell.tsx`
  - `apps/expo/src/expo-planner-preview-shell.tsx`
  - `apps/expo/src/app-shell/expo-planner-screen-registry.tsx`
  - `apps/expo/src/app-shell/use-expo-planner-flow.ts`
  - `apps/expo/src/app-shell/use-expo-planner-preview-model.ts`
  - `apps/expo/src/components/expo-flow-tab-bar.tsx`
  - `apps/expo/src/components/expo-route-draft-screen.tsx`
- 초기 타입·저장소·알림 구현 3개
  - `src/features/planner/core/planner-state-machine.ts`
  - `src/providers/plans/async-plans.ts`
  - `src/providers/reminders/expo-local-reminder-provider.ts`
- `apps/expo/android/app/src/main/res/` 아래 `mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`의 `ic_launcher_foreground.webp` 5개
- Expo README의 현재 진입점 설명, 인계 문서의 삭제 파일 링크, 실행 계획 인덱스

## Assumptions

- 현재 지원하는 Expo 진입점은 패키지 및 네이티브 빌드가 해석하는 Expo Router다.
- 앱 아이콘은 Android manifest가 가리키는 밀도별 `ic_launcher.webp`를 사용한다. 추후 adaptive icon을 설정하면 Expo가 전경 이미지를 다시 생성할 수 있다.
- PDF의 본문과 동일한 Markdown을 편집 가능한 기획서로 보관한다. 원본 텍스트와 Pages 파일, 완료 계획과 릴리스 산출물은 범위 밖이다.

## Pre-flight checks

- [x] 깨끗한 `main`을 확인하고 사용자 승인 후 `docs/remove-unused-files` 브랜치를 만들었다.
- [x] PDF와 Markdown 본문 일치, 삭제 후보의 코드·테스트 참조, Expo 및 Android 빌드 진입점을 확인했다.
- [x] 삭제 전 문서 검증, 인계 검사 테스트, 웹·Expo 타입체크와 Vitest 110개가 통과했다.

## Steps

- [x] 범위에 명시한 17개 파일을 삭제하고 인계 문서의 끊어진 링크를 정리했다.
- [x] Expo README를 실제 진입점에 맞춰 갱신하고 설계 기록에 현재 구현 위치를 적었다.
- [x] 삭제 후 자동 검사와 앱 진입점·Android 리소스 확인을 실행했다.
- [x] 검증 결과를 기록하고 완료 계획과 문서 인덱스 및 인계를 갱신했다.

## Automated tests

- `npm run validate:docs`, `npm run test:handoff-loop`, `git diff --check`
- `npm run typecheck -- --incremental false`, `apps/expo/node_modules/.bin/tsc --noEmit -p apps/expo/tsconfig.json`, `npm test`
- Android 리소스 처리 `./gradlew --offline :app:processDebugResources`. 캐시에 필요한 의존성이 없으면 온라인으로 재시도한다. Gradle 환경 제약이 남으면 설치된 AAPT2로 앱 리소스를 컴파일하고 manifest의 런처 참조를 확인한다.

## Manual/Runtime QA

- Expo의 `resolveAppEntry`로 Android·iOS·웹 진입점이 모두 `expo-router/entry.js`인지 확인한다.
- Android manifest와 남아 있는 `ic_launcher.webp` 5개를 대조하고, 삭제 경로가 현재 코드와 빌드 설정에서 참조되지 않는지 확인한다.

## Skipped/Not Run

- 브라우저 E2E, 실기기·시뮬레이터 QA, 전체 릴리스 빌드는 화면·알림·릴리스 설정을 변경하지 않는 범위이므로 실행하지 않는다.

## Observation Log

- Git에 포함되지 않는 Finder 메타데이터 12개와 Next.js·Expo·TypeScript 캐시 경로 4개를 먼저 정리했다.
- Android 리소스 검사의 첫 실행은 Gradle 사용자 캐시의 잠금 파일 쓰기 권한에서 중단돼 권한을 받아 다시 실행했다.
- 오프라인 재시도는 `foojay-resolver-0.5.0.jar`와 `gson-2.9.1.jar` 캐시가 없어 중단됐다. 온라인 재시도는 성공했다.

## Open Work

- 파일 정리와 검증을 완료했다.

## Completion

- 기획서 PDF 1개, 미사용 코드 11개, Android 전경 아이콘 5개를 삭제했다.
- 기획서 Markdown·텍스트·Pages 파일을 보존했다. Expo README와 과거 설계 기록에서 현재 구현 위치를 확인할 수 있고, 인계 문서의 삭제 파일 참조는 과거 기록으로 남겼다.

## Validation Result

- 웹·Expo 타입체크, Vitest 19개 파일·110개 테스트, 인계 검사 테스트가 통과했다.
- 문서와 지식 검증 및 `git diff --check`가 통과했다.
- Android·iOS·웹에서 Expo 진입점이 모두 `expo-router/entry.js`로 해석됐다.
- AAPT2가 삭제 이후 남은 Android 앱 리소스 16개를 컴파일했다. Android manifest의 `@mipmap/ic_launcher`와 밀도별 런처 아이콘 5개를 확인했다.
- `./gradlew :app:processDebugResources` 온라인 재시도에서 Android 리소스 병합과 처리가 통과했다. 디버그 manifest 병합과 Gradle 지원 중단 경고가 출력됐다.
- 삭제 경로 17개, 기획서 원본 3개 형식, 추적 Markdown의 삭제 경로 링크 0건을 확인했다.
- 브라우저 E2E, 실기기·시뮬레이터 QA, 전체 릴리스 빌드는 계획대로 미실행했다.
