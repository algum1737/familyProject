# Expo App Skeleton

이 디렉터리는 `오늘 다 했니`의 실제 앱 런타임 전환을 위한 Expo 뼈대입니다.

현재 상태:

- 브라우저 프리뷰와 별도로 React Native/Expo 진입점을 분리했다.
- `expo-router`와 관련 필수 의존성이 설치됐다.
- `package.json`의 main은 이제 `expo-router/entry`를 사용한다.
- `App.tsx`는 더 이상 기본 엔트리가 아니며, 실제 앱 root는 `apps/expo/app/` route tree가 담당한다.
- 실제 앱 셸은 이제 `오늘/동기` 하단 탭과 `편집/회고` 보조 화면을 분리한 탭+오버레이 구조를 가진다.
- 이 네비게이션 계약은 `docs/APP_EXPO_NAVIGATION_CONTRACT.md`에 정리돼 있다.
- 실제 navigator 기본 채택안은 `expo-router`이며, 이유와 도입 순서는 `docs/APP_EXPO_NAVIGATOR_DECISION.md`에 정리돼 있다.
- `apps/expo/app/` 아래에 `expo-router` 파일 구조 초안과 route/state constants가 추가됐다.
- `apps/expo/app/` route file들은 이제 실제 shell/model 계층을 읽는 adapter가 연결된 상태다.
- `ExpoAppShell`은 router 이전 셸이 아니라, 현재 route adapter가 재사용하는 실제 앱 상태 조립 계층이다.
- `Today`, `PlanEditor`, `Reflection`, `Motivation` 화면 파일을 Expo 쪽으로 분리하기 시작했다.
- `AsyncStorage` 저장소 초안과 `expo-notifications` 시작 리마인드 provider 초안을 추가했다.
- 날짜 누적 `PlannerRecordMap` 저장소 초안을 분리했고, 현재 날짜 계획 store는 이 record store를 함께 갱신한다.
- `react-native-svg` 기반 원형 시간판 초안을 `Today` 화면에 연결했다.
- Expo 프리뷰 셸은 여전히 개발용으로 남아 있고, 실제 앱 root와 분리된 shell/model/action/flow 구조를 검증하는 용도로 사용한다.
- Expo 프리뷰용 demo seed와 실제 앱 부트스트랩 데이터 전략은 분리하기로 정리됐고, 기준은 `docs/APP_EXPO_BOOTSTRAP_DATA_STRATEGY.md`에 있다.
- 루트 Next.js 타입체크와 충돌하지 않도록 루트 `tsconfig.json`에서는 제외된다.

다음 작업:

1. `expo-notifications` 기반 시작 리마인드 provider를 실제 제품 규칙과 연결
2. 원형 시간판을 앱 시각 품질 기준으로 다듬기
3. preview shell과 실제 app shell의 공용 계산 계층을 더 줄이기
4. 필요하면 `ExpoAppShell`을 더 얇게 줄이고 router adapter 쪽 책임을 재조정

실행 준비:

1. 이 디렉터리에서 `npm install`
2. `npm run dev`
3. Expo Go 또는 시뮬레이터로 확인

패키지 기준:

- Expo SDK 55
- React Native 0.83
- React 19.2

버전 근거는 Expo 공식 SDK 문서와 SDK 포함 패키지 문서를 따른다.
