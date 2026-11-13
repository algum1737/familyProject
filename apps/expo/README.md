# Expo App Skeleton

이 디렉터리는 `오늘 다 했니`의 실제 앱 런타임 전환을 위한 Expo 뼈대입니다.

현재 상태:

- 브라우저 프리뷰와 별도로 React Native/Expo 진입점을 분리했다.
- `expo-router`와 관련 필수 의존성이 설치됐다.
- `package.json`의 main은 이제 `expo-router/entry`를 사용한다.
- 앱의 루트는 `apps/expo/app/_layout.tsx`이며, 화면 경로는 `apps/expo/app/`에서 정의한다.
- 실제 앱 셸은 이제 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 이 네비게이션 계약은 `docs/APP_EXPO_NAVIGATION_CONTRACT.md`에 정리돼 있다.
- 실제 navigator 기본 채택안은 `expo-router`이며, 이유와 도입 순서는 `docs/APP_EXPO_NAVIGATOR_DECISION.md`에 정리돼 있다.
- 루트 레이아웃의 `ExpoRouterAppProvider`가 `useExpoAppModel`로 앱 상태를 조립하고 각 화면에 제공한다.
- `Today`, `PlanEditor`, `Reflection`, `Motivation` 화면 파일을 Expo 쪽으로 분리하기 시작했다.
- `AsyncStorage` 저장소 초안과 `expo-notifications` 시작 리마인드 provider 초안을 추가했다.
- 날짜 누적 `PlannerRecordMap` 저장소 초안을 분리했고, 현재 날짜 계획 store는 이 record store를 함께 갱신한다.
- `react-native-svg` 기반 원형 시간판 초안을 `Today` 화면에 연결했다.
- 앱 시작 시 `useExpoAppBootstrap`이 저장된 기록 복구, 기존 계획 데이터 마이그레이션, 빈 상태 초기화를 처리한다. 설계 배경은 `docs/APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md`에 있다.
- 루트 Next.js 타입체크와 충돌하지 않도록 루트 `tsconfig.json`에서는 제외된다.
- `eas.json` 기본 build profile이 추가돼 `development`, `preview`, `production` 경로를 구분할 수 있다.
- `expo-updates`를 아직 쓰지 않으므로 EAS build profile에는 `channel`을 두지 않는다.

다음 작업:

1. Android production build와 Play Console 제출 준비 구체화
2. 실제 Android 기기에서 알림 배너 가시성 확인
3. 스토어 제출 메타데이터와 자격증명 연결 상태 정리

실행 준비:

1. 이 디렉터리에서 `npm install`
2. `npm run dev`
3. Expo Go 또는 시뮬레이터로 확인

패키지 기준:

- Expo SDK 55
- React Native 0.83
- React 19.2

버전 근거는 Expo 공식 SDK 문서와 SDK 포함 패키지 문서를 따른다.
