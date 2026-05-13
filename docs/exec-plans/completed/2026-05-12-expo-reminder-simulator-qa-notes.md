# Expo Reminder Simulator QA Notes

## Goal

Expo 로컬 알림 QA에서 iOS 시뮬레이터 배너 미노출 현상과 실제 확인 기준을 운영 문서로 분리해, 이후 세션이 `전달 성공`과 `화면 배너 가시성`을 혼동하지 않게 한다.

## Scope

- 기존 알림 정책 문서와 completed QA 기록 검토
- 시뮬레이터에서 확인 가능한 것과 불가능한 것을 분리한 운영 문서 추가
- 관련 문서 인덱스와 handoff 연결
- 문서 검증

## Assumptions

- 현재 작업은 기존 브랜치 `feature/app-bootstrap-skeleton`에서 이어간다.
- working tree의 기존 변경은 보존한다.
- 이번 작업은 제품 로직 변경이 아니라 QA 운영 문서 정리다.

## Steps

1. 기존 로컬 알림 정책과 시뮬레이터/실기 QA 기록을 정리한다.
2. 시뮬레이터 알림 QA 운영 문서를 추가한다.
3. 관련 문서 인덱스와 handoff에서 접근 경로를 연결한다.
4. 문서 검증을 실행한다.

## Validation

- 새 운영 문서가 시뮬레이터에서 확인 가능한 신호와 실기 확인이 필요한 항목을 분리해 설명해야 한다.
- `bash scripts/validate-docs.sh`가 통과해야 한다.

## Completion

Completed. iOS 시뮬레이터에서 Expo 로컬 알림을 점검할 때 `전달/예약 성공`과 `OS 배너 가시성`을 분리해 해석하도록 운영 문서를 추가했다. 새 [APP_REMINDER_SIMULATOR_QA.md](/Users/hun/workspace/familyProject/docs/APP_REMINDER_SIMULATOR_QA.md)는 pending 예약, delivered 기록, foreground 인앱 상태, screenshot 증거 우선순위를 정리하고, 실제 기기 QA가 필요한 범위를 별도로 분리한다. [APP_LOCAL_REMINDER_PLAN.md](/Users/hun/workspace/familyProject/docs/APP_LOCAL_REMINDER_PLAN.md), [docs/index.md](/Users/hun/workspace/familyProject/docs/index.md), [docs/HANDOFF.md](/Users/hun/workspace/familyProject/docs/HANDOFF.md)에서도 이 운영 기준을 바로 찾을 수 있게 연결했다.

## Validation Result

- `bash scripts/validate-docs.sh`가 통과했다.
