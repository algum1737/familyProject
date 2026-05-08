# Tech Stack

## Chosen Stack For Web MVP

- Framework: `Next.js`
- Language: `TypeScript`
- UI: `React`
- Styling: CSS modules-free global CSS with design tokens
- Visualization: native `SVG`
- Validation: `Zod`
- Date utilities: `date-fns`
- Testing: `Vitest`, `Testing Library`, `Playwright`
- Quality: `ESLint`, `TypeScript`

## Why This Stack

- 원형 24시간 계획판은 SVG로 직접 제어하는 편이 가장 단순하다.
- Next.js는 빠른 MVP 개발, 모바일 우선 웹앱, 추후 배포에 유리하다.
- TypeScript는 시간 슬롯과 일정 규칙을 안전하게 유지하는 데 필요하다.
- 검증 후 앱 전환 시 재사용할 도메인 로직을 분리하기 쉽다.

## App Transition Constraints

- 웹 전용 구현은 `src/ui`와 `src/app`에 가둔다.
- 일정 규칙과 시간 계산은 `src/domains`와 `src/shared`에 둔다.
- 저장소와 시간 소스는 provider 인터페이스 뒤로 숨긴다.

## Current App Direction

- 실제 앱 런타임은 `Expo + React Native` 기준으로 진행 중이다.
- 첫 실제 navigator 기본안은 `expo-router`다.
- route 구조는 `today`, `motivation` 탭과 `editor`, `reflection` 오버레이를 기본 계약으로 둔다.

## Initial Dependency Policy

- 상태 관리는 React 기본 상태를 우선 사용한다.
- 별도 전역 상태 라이브러리는 실제 복잡도가 생길 때만 도입한다.
- 차트 라이브러리는 사용하지 않는다.
