# Recovery Observation Logbook

이 문서는 `Recovery Observation Runbook`을 실제로 실행할 때 같은 형식으로 관찰 결과를 남기기 위한 운영 로그북이다.

## Purpose

- `회고 다시 보기`, `다시 지정 다시 보기`, `다시 지정됨`, `다시 지정 곧 시작`, `다시 지정 불가` 신호를 비교 가능한 형식으로 기록한다.
- 종료 5분 전 회복 알림 정책을 앱 전환 전에 어떤 기준으로 조정할지 근거를 쌓는다.
- 다음 세션과 다음 주차에도 같은 기준으로 비교할 수 있는 기록을 남긴다.

## Minimum Observation Set

한 번의 관찰 세트에는 아래 3개를 모두 포함한다.

1. `missed` 일정 1건 이상 발생
2. `회고` 또는 `다시 지정` 행동 1회 이상 수행
3. `회복 관찰 로그`와 `리마인드 관찰 로그`를 함께 확인

최소 3세트 이상 쌓이기 전에는 정책을 바꾸지 않는다.

## Recording Rules

- 기록은 실제 사용 흐름 직후 바로 남긴다.
- `무엇을 했고 어떤 신호가 반복됐는지`를 먼저 적는다.
- `조정 검토`가 한 번 떠도 즉시 규칙을 바꾸지 않는다.
- `다시 지정 불가`가 났을 때는 당시 남은 빈 시간과 원래 일정 길이를 같이 적는다.
- 종료 5분 전 알림 검토는 별도 항목으로 남긴다.

## Session Template

```md
### Observation N

- Date:
- Device / Browser:
- Branch / Commit:

#### Scenario

- What happened:
- Which plan became `missed`:
- Whether reflection was saved:
- Whether reschedule was attempted:

#### Recovery Signals

- `회고 다시 보기`:
- `다시 지정 다시 보기`:
- `다시 지정됨`:
- `다시 지정 곧 시작`:
- `회복 진행 중`:
- `다시 지정 불가`:

#### Reminder Signals

- `표시`:
- `닫기`:
- `완료`:
- `닫기 비율`:
- `완료 전환율`:

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped:
- Which action would have been used:
- Would it feel early / late / right:

#### Notes

- User confusion observed:
- Candidate adjustment:
- Keep / Review / Hold:
```

## Weekly Summary Template

```md
## Weekly Recovery Observation Summary

- Observation count:
- Repeated recovery signal:
- Repeated reminder signal:
- Repeated `reschedule_unavailable` cases:
- End-5-minute alert reaction trend:

### Decision

- Keep as-is:
- Review next:
- Not enough evidence:

### Candidate changes

1.
2.
3.
```

## Enough Evidence Threshold

- `회고 다시 보기`가 3세트 이상 반복되면 회고 진입 단순화 또는 재노출 시점 조정을 검토한다.
- `다시 지정 곧 시작`이 3세트 이상 반복되면 `60분` 기준 축소 후보로 올린다.
- `다시 지정 불가`가 2세트 이상 반복되면 자동 축약 허용 여부 또는 수동 단축 안내 강화 후보로 올린다.
- 종료 5분 전 알림에 대해 `너무 이르다/늦다` 반응이 2세트 이상 반복되면 알림 시점을 다시 검토한다.

## Related Docs

- [WEB_TO_APP_TRANSITION.md](./WEB_TO_APP_TRANSITION.md)
- [HANDOFF.md](./HANDOFF.md)
- [Missed Plan Recovery Plan](./exec-plans/active/2026-04-28-missed-plan-recovery.md)
