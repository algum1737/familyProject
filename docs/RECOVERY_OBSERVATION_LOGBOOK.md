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

## Observation Harness Shortcut

- 개발 모드에서는 화면 상단 `관찰 시간 조정` 패널로 테스트 시간을 바로 바꿀 수 있다.
- `표본용 예정 일정 추가` 버튼으로 현재 시각 이후 첫 30분 빈 슬롯을 관찰용 `pending` 일정으로 즉시 채울 수 있다.
- `다음 시작 5분 전`, `다음 시작 직후`, `현재 종료 5분 전`, `현재 종료 직후` 버튼으로 리마인드/회복 표본을 빠르게 재현한다.
- 시간 오버라이드는 개발용 `localStorage` 키 `today-did-you-finish:test-now`에 저장되며, `현재 시각 복귀`로 바로 되돌린다.
- 실제 관찰 로그를 남기기 전에는 `회복 관찰 로그`와 `리마인드 관찰 로그`를 먼저 비우고 시작한다.

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

## 2026-04-30 Exploratory Run

`Assumptions`

- 이번 기록은 `localhost:3000`에서 Safari 비공개 브라우징으로 수행한 단일 탐색 세션이다.
- 동일한 `missed` 일정(`취침`)을 기준으로 회고 저장, 다시 지정 시도, 후속 재강조 확인을 순서대로 관찰했다.
- 리마인드 배너를 띄우는 별도 근접 시작 일정은 만들지 못해, 리마인드 로그는 세 관찰 모두 `0회` 상태를 확인하는 수준에 머물렀다.

### Observation 1

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `취침`이 이미 `missed` 상태인 화면에서 `회고`를 열고 메모를 저장했다.
- Which plan became `missed`: `취침` 01:00 - 07:00
- Whether reflection was saved: Yes
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 저장 전 진입 문구는 명확했지만, 저장 직후에도 같은 체인에서 회복 액션을 계속 요구하는 흐름이 보였다.
- `다시 지정 다시 보기`: 회고 저장 직후 `오늘 남은 빈 시간에 다시 지정할 수 있습니다.` 문구가 바로 이어졌다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 0회
- `닫기`: 0회
- `완료`: 0회
- `닫기 비율`: 0%
- `완료 전환율`: 0%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 조금은 도움될 수 있지만, 종료 직전에는 `회고 열기` 한 가지가 더 자연스럽게 느껴졌다.
- Which action would have been used: `회고 열기`
- Would it feel early / late / right: 시점은 대체로 맞지만 세 가지 액션을 한 번에 올리면 무겁게 느껴질 가능성이 있다.

#### Notes

- User confusion observed: 회고 진입은 이해됐지만, 메모를 바로 쓰게 하는 압박은 약간 abrupt했다.
- Candidate adjustment: 종료 5분 전에는 `회고 열기`를 우선 제안하고 `다시 지정`은 보조 액션으로 낮추는 안을 검토한다.
- Keep / Review / Hold: Review

### Observation 2

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 같은 `missed` 일정에서 `다시 지정`을 눌렀고, 남은 하루 구간에 원래 길이(`6시간`)를 유지할 연속 빈 시간이 없어 실패 안내를 봤다.
- Which plan became `missed`: `취침` 01:00 - 07:00
- Whether reflection was saved: Yes, already saved in the same session
- Whether reschedule was attempted: Yes, and it failed

#### Recovery Signals

- `회고 다시 보기`: 없음
- `다시 지정 다시 보기`: 실패 후에도 다시 지정 CTA는 유지됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 상단 오류 문구가 길이 유지 불가를 구체적으로 설명했다.

#### Reminder Signals

- `표시`: 0회
- `닫기`: 0회
- `완료`: 0회
- `닫기 비율`: 0%
- `완료 전환율`: 0%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 종료 전에 빈 슬롯 부족을 미리 알렸다면 더 도움이 됐을 가능성이 있다.
- Which action would have been used: `다시 지정`
- Would it feel early / late / right: 종료 직전보다는 `종료 5분 전` 쪽이 더 맞다. 실패를 더 일찍 알리는 편이 좋다.

#### Notes

- User confusion observed: 실패 이유는 이해됐지만, 바로 이어서 무엇을 바꾸면 되는지까지는 한 번 더 생각해야 했다.
- Candidate adjustment: `다시 지정 불가` 뒤에는 더 짧은 새 시간으로 직접 다시 지정 저장하라는 후속 문구를 붙이는 쪽이 맞다.
- Keep / Review / Hold: Review

### Observation 3

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 회고 저장과 다시 지정 실패 뒤 관찰 패널을 다시 열어 누적 신호를 확인했다.
- Which plan became `missed`: `취침` 01:00 - 07:00
- Whether reflection was saved: Yes
- Whether reschedule was attempted: Yes

#### Recovery Signals

- `회고 다시 보기`: 관찰 패널에 `2회` 누적으로 보였고, 정책 상태는 아직 `관찰 더 필요`였다.
- `다시 지정 다시 보기`: CTA는 카드에서 다시 노출됐지만, 이번 세션에서는 패널 누적 주신호로 올라오지 않았다.
- `다시 지정됨`: 0회
- `다시 지정 곧 시작`: 0회
- `회복 진행 중`: 0회
- `다시 지정 불가`: 이번 탐색에서는 오류 문구로 확인했지만, 별도 반복 표본은 더 필요하다.

#### Reminder Signals

- `표시`: 0회
- `닫기`: 0회
- `완료`: 0회
- `닫기 비율`: 0%
- `완료 전환율`: 0%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 현재 증거로는 `회고` 쪽 이해는 가능하지만, 시작 리마인드와 별개로 종료 직전 3액션을 모두 싣는 것은 아직 과해 보인다.
- Which action would have been used: `회고 열기`, 경우에 따라 `다시 지정`
- Would it feel early / late / right: 시점은 맞을 수 있으나, 액션 수는 줄이는 쪽이 더 자연스러워 보였다.

#### Notes

- User confusion observed: 같은 세션, 같은 일정만으로는 `회고 다시 보기`가 반복된다는 신호는 보였지만 `다시 지정 곧 시작`이나 실제 리마인드 반응은 아직 비어 있다.
- Candidate adjustment: 다음 표본은 반드시 `시작 5분 전` 창에 실제로 들어가는 짧은 일정으로 리마인드 `표시/닫기/완료`를 확보한다.
- Keep / Review / Hold: Hold

## Weekly Recovery Observation Summary

- Observation count: 3
- Repeated recovery signal: `회고 다시 보기`
- Repeated reminder signal: 아직 없음
- Repeated `reschedule_unavailable` cases: 1회
- End-5-minute alert reaction trend: 종료 직전 액션은 `회고 열기` 쪽이 더 자연스럽고, 3액션 동시 제시는 무겁게 느껴질 가능성이 보였다.

### Decision

- Keep as-is: 회고 저장 뒤 후속 회복 액션을 이어주는 기본 흐름
- Review next: 종료 5분 전 알림에서 기본 액션 수를 줄여야 하는지
- Not enough evidence: 실제 리마인드 `표시/닫기/완료` 반응, `다시 지정 곧 시작` 60분 창의 적정성

### Candidate changes

1. 종료 5분 전 알림 초기안은 `회고 열기` 중심으로 단순화하고 `다시 지정`은 보조 액션으로 낮추는 안을 검토한다.
2. `다시 지정 불가` 문구는 `길이 그대로는 불가`와 `더 짧게 다시 지정 저장`을 함께 안내하는 방향으로 유지한다.
3. 다음 관찰에서는 실제 시작 리마인드가 뜨는 짧은 일정을 만들어 `표시/닫기/완료` 표본을 우선 확보한다.

## 2026-04-30 Reminder Harness Run

`Assumptions`

- 이번 기록은 개발 모드 `관찰 시간 조정` 패널로 같은 날 저녁 구간을 강제로 재현한 관찰 세트다.
- 시작 리마인드 반응을 보기 위해 먼저 `저녁` 18:01, 이후 `운동` 20:55로 점프했다.
- 이번 세트는 리마인드 정책 관찰에 집중했고, 회복 쪽 신규 행동은 만들지 않았다.

### Observation 4

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `관찰 시간 조정` 패널에서 `저녁` 시작 직후(18:01)로 이동해 시작 리마인드 배너를 확인하고 `지금 완료`를 눌렀다.
- Which plan became `missed`: 없음. 이번 표본은 `pending` 시작 리마인드 반응 관찰이다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 기존 `missed` 일정 카드에는 계속 보였지만 이번 관찰의 핵심 신호는 아니었다.
- `다시 지정 다시 보기`: 이번 표본에서는 새 행동 없음
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: `저녁` 시작 리마인드 1회
- `닫기`: 0회
- `완료`: `저녁`에서 1회
- `닫기 비율`: 0%
- `완료 전환율`: 100%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 이번 케이스는 시작 직후 완료로 이어져 종료 5분 전 알림 필요가 거의 없었다.
- Which action would have been used: `계속 진행` 또는 알림 없이 바로 완료
- Would it feel early / late / right: 종료 5분 전 알림은 오히려 불필요하게 늦은 편에 가깝다.

#### Notes

- User confusion observed: 시작 직후 리마인드에서 `지금 완료`는 매우 자연스러웠다.
- Candidate adjustment: 시작 리마인드 자체는 현 구조 유지 가능성이 높다.
- Keep / Review / Hold: Keep

### Observation 5

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 같은 패널에서 `운동` 시작 5분 전(20:55)으로 이동해 시작 리마인드 배너를 확인하고 `닫기`를 눌렀다.
- Which plan became `missed`: 없음. 이번 표본은 시작 전 리마인드 `닫기` 반응 관찰이다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 기존 `missed` 카드에는 유지됐지만 이번 세트의 핵심은 아니었다.
- `다시 지정 다시 보기`: 새 행동 없음
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: `운동` 시작 리마인드 1회
- `닫기`: `운동`에서 1회
- `완료`: 0회
- `닫기 비율`: 누적 기준 50%
- `완료 전환율`: 누적 기준 50%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 시작 5분 전 리마인드를 닫은 흐름이라, 종료 5분 전 알림이 있다면 그때는 `회고 열기`보다 `계속 진행` 또는 무시가 더 자연스러울 수 있다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 종료 5분 전은 아직 판단 보류다. 시작 전 닫기 1회만으로는 늦다/이르다를 정하기 어렵다.

#### Notes

- User confusion observed: 시작 전에는 `지금 완료`가 숨겨지고 `닫기`만 남는 규칙은 이해 가능했다.
- Candidate adjustment: 종료 5분 전 알림도 초기에 액션 수를 줄여 `계속 진행` 중심으로 보이게 할지 검토 후보가 된다.
- Keep / Review / Hold: Hold

### Observation 6

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 개발 모드 `표본용 예정 일정 추가` 버튼으로 `관찰 표본 1`(22:00 - 22:30)을 만든 뒤, `다음 시작 직후`로 이동해 시작 리마인드 배너가 실제로 다시 뜨는지 확인했다.
- Which plan became `missed`: 없음. 이번 표본도 시작 리마인드 `표시` 누적 관찰이 목적이었다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 기존 `missed` 카드에서는 계속 유지됐지만 이번 표본의 핵심은 아니었다.
- `다시 지정 다시 보기`: 새 행동 없음
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: `관찰 표본 1` 시작 직후 1회 추가, 누적 `3회`
- `닫기`: 누적 `1회`
- `완료`: 누적 `1회`
- `닫기 비율`: 누적 기준 33%
- `완료 전환율`: 누적 기준 33%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 이번 표본은 시작 직후 리마인드가 이미 자연스럽게 동작했기 때문에, 종료 5분 전까지 별도 회복 알림을 더하지 않아도 된다는 쪽에 가깝다.
- Which action would have been used: `계속 진행` 또는 아무 행동 없음
- Would it feel early / late / right: 종료 5분 전 알림을 추가하더라도 지금은 가볍게 유지하는 편이 맞아 보인다.

#### Notes

- User confusion observed: `표본용 예정 일정 추가`와 즉시 점프 조합으로 실제 표본을 안정적으로 반복 재현할 수 있었다.
- Candidate adjustment: 리마인드 정책은 지금 단계에서 바꾸기보다, `우선 유지` 상태가 추가 표본에서도 유지되는지 더 보는 편이 낫다.
- Keep / Review / Hold: Keep

### Observation 7

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `Observation 6`에서 띄운 같은 시작 리마인드 창에서 `지금 완료`를 눌러 `관찰 표본 1`을 즉시 완료 처리했다.
- Which plan became `missed`: 없음. 이번 표본은 동일 리마인드 창의 후속 `완료` 전환을 더 확인하는 목적이었다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 기존 `missed` 카드에서는 계속 유지됐지만 이번 표본의 핵심은 아니었다.
- `다시 지정 다시 보기`: 새 행동 없음
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 누적 `3회`
- `닫기`: 누적 `1회`
- `완료`: `관찰 표본 1`에서 1회 추가, 누적 `2회`
- `닫기 비율`: 누적 기준 33%
- `완료 전환율`: 누적 기준 67%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 시작 직후 리마인드에서 바로 완료로 전환됐기 때문에 종료 5분 전 회복 알림 필요성은 더 낮아졌다.
- Which action would have been used: `계속 진행` 또는 알림 없이 바로 완료
- Would it feel early / late / right: 종료 5분 전보다 시작 근처의 가벼운 리마인드가 더 맞다는 쪽 증거가 조금 더 강해졌다.

#### Notes

- User confusion observed: 같은 리마인드 창에서 `표시 -> 완료` 전환이 자연스럽게 이어졌다.
- Candidate adjustment: 지금은 종료 5분 전 알림을 늘리기보다, 시작 리마인드 현 정책을 유지하면서 종료 직전 알림은 더 가볍게 검토하는 편이 낫다.
- Keep / Review / Hold: Keep

### Observation 8

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `표본용 예정 일정 추가`로 `관찰 표본 2`(22:30 - 23:00)를 만든 뒤 `다음 시작 5분 전`으로 이동하고, 시작 전 리마인드에서 `닫기`를 눌렀다.
- Which plan became `missed`: 없음. 이번 표본은 완료 전환이 강한 상태에서 추가 `닫기` 반응을 쌓는 목적이었다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 기존 `missed` 카드에서는 유지됐지만 이번 표본의 핵심은 아니었다.
- `다시 지정 다시 보기`: 새 행동 없음
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: `관찰 표본 2` 시작 5분 전 1회 추가, 누적 `4회`
- `닫기`: `관찰 표본 2`에서 1회 추가, 누적 `2회`
- `완료`: 누적 `2회`
- `닫기 비율`: 누적 기준 50%
- `완료 전환율`: 누적 기준 50%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 시작 5분 전 닫기 반응이 다시 나왔기 때문에, 종료 5분 전 알림을 넣더라도 액션 수는 가볍게 유지하는 편이 자연스럽다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 종료 직전 회복 알림은 여전히 더 가볍게 다뤄야 한다는 쪽 증거가 유지됐다.

#### Notes

- User confusion observed: 시작 전에는 `닫기`만 남는 현재 규칙이 여전히 이해 가능했다.
- Candidate adjustment: `닫기 비율`이 50%까지 올라와도 정책 상태가 `우선 유지`로 남는 현재 기준은 당장 바꾸지 않아도 된다.
- Keep / Review / Hold: Keep

### Observation 9

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `관찰 표본 2` 체인에서 시작 5분 전 리마인드를 `닫기`한 뒤, 같은 일정의 종료 직후(23:01)로 이동해 `missed` 전환과 후속 회복 신호를 확인했다.
- Which plan became `missed`: `관찰 표본 2` 22:30 - 23:00
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 종료 직후 `관찰 표본 2` 카드가 바로 `회고 다시 보기`로 전환됐다.
- `다시 지정 다시 보기`: 종료 직후에도 함께 노출됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 이번 체인에서 이미 누적된 `4회` 상태를 유지했다.
- `닫기`: 이번 체인 시작 구간에서 추가된 누적 `2회`
- `완료`: 누적 `2회`
- `닫기 비율`: 누적 기준 50%
- `완료 전환율`: 누적 기준 50%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 시작 전에는 닫았지만 종료 직후에는 `회고 다시 보기`가 바로 이어졌기 때문에, 종료 직전 알림은 별도 확장보다 회고 진입을 가볍게 연결하는 쪽이 더 자연스러워 보였다.
- Which action would have been used: `회고 열기`
- Would it feel early / late / right: 종료 직후 전환은 자연스러웠고, 종료 5분 전 알림을 넣더라도 액션 수를 늘리기보다 회고 중심으로 가볍게 두는 편이 맞아 보였다.

#### Notes

- User confusion observed: 같은 일정 체인에서 `닫기` 후 `missed` 전환이 이어져도 흐름 자체는 이해 가능했다.
- Candidate adjustment: 종료 5분 전 회복 알림을 별도로 넣는다면 `회고 열기` 우선의 더 가벼운 조합을 먼저 검토하는 편이 낫다.
- Keep / Review / Hold: Review

### Observation 10

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `표본용 예정 일정 추가`로 만든 `관찰 표본 3` 체인에서 시작 직후 리마인드만 확인한 뒤, 별도 행동 없이 `현재 종료 5분 전`과 `현재 종료 직후`로 연속 이동했다.
- Which plan became `missed`: `관찰 표본 3` 23:00 - 23:30
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 종료 직후 `관찰 표본 3` 카드에서 즉시 다시 보였다.
- `다시 지정 다시 보기`: 종료 직후에도 함께 노출됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 시작 직후 `관찰 표본 3`에서 1회 추가, 누적 `5회`
- `닫기`: 누적 `2회`
- `완료`: 누적 `2회`
- `닫기 비율`: 누적 기준 40%
- `완료 전환율`: 누적 기준 40%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 시작 배너가 이미 한 번 노출된 체인에서는 종료 5분 전에도 현재 계획 인지가 유지돼, 추가 종료 알림 필요가 크지 않았다.
- Which action would have been used: 넣는다면 `계속 진행` 정도의 아주 가벼운 확인이 더 자연스럽고, `회고 열기`는 종료 직후가 더 맞아 보였다.
- Would it feel early / late / right: 종료 5분 전 알림을 새로 넣으면 다소 중복되고 무겁게 느껴질 가능성이 있다.

#### Notes

- User confusion observed: 종료 5분 전에는 별도 배너가 없어도 현재 계획 카드와 리스트만으로 맥락 파악이 충분했다.
- Candidate adjustment: 시작 배너가 이미 노출된 체인에는 종료 5분 전 회복 알림을 생략하거나, 넣더라도 `계속 진행` 1액션 수준으로 매우 가볍게 제한하는 안이 더 적절해 보인다.
- Keep / Review / Hold: Keep

### Observation 11

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 개발 모드 `관찰 표본 4`(23:30 - 24:00)를 만든 뒤 `현재 종료 5분 전`으로 이동해, 새 실험 배너 `종료 전 확인`이 실제 화면에 뜨는지 확인했다.
- Which plan became `missed`: 이번 턴에서는 종료 직후까지 이어서 확인하지 못했다.
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 이번 턴에서는 종료 직후까지 이어서 확인하지 못했다.
- `다시 지정 다시 보기`: 이번 턴에서는 종료 직후까지 이어서 확인하지 못했다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 리마인드 관찰 로그 누적 수치는 이번 턴에 늘리지 않았다.
- `닫기`: 변화 없음
- `완료`: 변화 없음
- `닫기 비율`: 누적 기준 변화 없음
- `완료 전환율`: 누적 기준 변화 없음

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 실험 배너가 실제 화면에 단일 액션으로 노출되는 것까지는 자연스러웠다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 최소 1액션 배너로 줄인 상태에서는 과도하게 무겁지 않아 보였지만, 닫은 뒤 종료 직후 회고 흐름까지는 한 번 더 이어서 봐야 한다.

#### Notes

- User confusion observed: `종료 전 확인` 단일 액션 구성 자체는 간단해서 이해 부담이 낮아 보였다.
- Candidate adjustment: 지금 실험 형태는 `계속 진행` 1액션으로 충분히 가벼워 보이므로, 다음 관찰에서는 실제 `계속 진행 -> 종료 직후 회고 다시 보기` 체인이 자연스럽게 이어지는지만 확인하면 된다.
- Keep / Review / Hold: Hold

### Observation 12

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: `관찰 표본 1`(15:45 - 16:15)을 `현재 종료 5분 전`으로 넘겨 `종료 전 확인` 배너에서 `계속 진행`을 눌렀고, 이어서 `현재 종료 직후`로 넘겨 같은 일정의 `missed` 전환과 후속 회복 신호를 확인했다.
- Which plan became `missed`: `관찰 표본 1` 15:45 - 16:15
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: `계속 진행`으로 종료 직전 배너를 닫은 뒤에도, 종료 직후 카드가 바로 `회고 다시 보기`로 전환됐다.
- `다시 지정 다시 보기`: 종료 직후에도 함께 노출됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 이번 체인은 종료 직전 실험 배너 관찰이 목적이라 시작 리마인드 누적 수치는 별도로 늘리지 않았다.
- `닫기`: 변화 없음
- `완료`: 변화 없음
- `닫기 비율`: 누적 기준 변화 없음
- `완료 전환율`: 누적 기준 변화 없음

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: `계속 진행` 1액션 실험 배너는 종료 직전 맥락 확인 용도로는 충분히 가벼웠고, 종료 직후 회고 흐름도 방해하지 않았다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 현재 실험 형태에서는 시점과 무게가 대체로 맞았다.

#### Notes

- User confusion observed: 종료 직전에는 `계속 진행`만 남겨 둔 구성이 간단해서 이해 부담이 낮았고, 종료 직후 `회고 다시 보기` 전환도 자연스러웠다.
- Candidate adjustment: 종료 5분 전 알림을 유지한다면 지금처럼 `계속 진행` 1액션으로 두고, 회고/다시 지정은 종료 직후 카드 흐름에 맡기는 구성이 우선 후보가 된다.
- Keep / Review / Hold: Keep

### Observation 13

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 같은 개발 하네스에서 새 `관찰 표본 2`(16:26 - 16:56)를 만든 뒤 시작 직후 리마인드를 확인했고, 이어서 `현재 종료 5분 전`의 `종료 전 확인` 배너에서 `계속 진행`을 누른 뒤 `현재 종료 직후`까지 넘겨 같은 일정의 `missed` 전환과 후속 회복 신호를 다시 확인했다.
- Which plan became `missed`: `관찰 표본 2` 16:26 - 16:56
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 두 번째 표본에서도 종료 직후 카드가 다시 `회고 다시 보기`로 전환됐다.
- `다시 지정 다시 보기`: 종료 직후에도 함께 노출됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: `관찰 표본 2` 시작 직후 1회 추가
- `닫기`: 변화 없음
- `완료`: 변화 없음
- `닫기 비율`: 누적 기준 변화 없음
- `완료 전환율`: 누적 기준 변화 없음

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 두 번째 표본에서도 `계속 진행` 1액션이 종료 직전 확인 용도로 충분했고, 종료 직후 회고 흐름을 방해하지 않았다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 같은 날 두 번째 표본에서도 시점과 무게가 대체로 맞았다.

#### Notes

- User confusion observed: 시작 직후 리마인드, 종료 직전 단일 액션, 종료 직후 회고 전환이 같은 표본 안에서 다시 이어져도 흐름 이해에 무리가 없었다.
- Candidate adjustment: 종료 5분 전 알림을 유지한다면 현재 `계속 진행` 1액션 구성을 우선안으로 보고, 추가 액션은 넣지 않는 쪽이 더 안전하다.
- Keep / Review / Hold: Keep

### Observation 14

- Date: 2026-04-30
- Device / Browser: macOS Safari private browsing
- Branch / Commit: `docs/recovery-observation-logbook` / `2e345b4`

#### Scenario

- What happened: 새 `관찰 표본 2`(16:26 - 16:56)를 만든 뒤 `다음 시작 직후`로 이동해 시작 리마인드를 확인했고, 이어서 `현재 종료 5분 전`의 `종료 전 확인` 배너에서 `계속 진행`을 누른 뒤 `현재 종료 직후`로 넘겨 다시 `missed` 전환과 후속 회복 신호를 확인했다.
- Which plan became `missed`: `관찰 표본 2` 16:26 - 16:56
- Whether reflection was saved: No
- Whether reschedule was attempted: No

#### Recovery Signals

- `회고 다시 보기`: 반복 표본에서도 종료 직후 카드가 다시 `회고 다시 보기`로 전환됐다.
- `다시 지정 다시 보기`: 종료 직후에도 함께 노출됐다.
- `다시 지정됨`: 없음
- `다시 지정 곧 시작`: 없음
- `회복 진행 중`: 없음
- `다시 지정 불가`: 없음

#### Reminder Signals

- `표시`: 시작 직후 `관찰 표본 2`에서 1회 추가, 누적 `7회`
- `닫기`: 누적 `2회`
- `완료`: 누적 `2회`
- `닫기 비율`: 누적 기준 29%
- `완료 전환율`: 누적 기준 29%

#### End-5-Minute Alert Review

- Would a `종료 5분 전` alert have helped: 세 번째 반복 체인에서도 `계속 진행` 1액션이 종료 직전 확인 용도로 충분했고, 종료 직후 회고 흐름을 방해하지 않았다.
- Which action would have been used: `계속 진행`
- Would it feel early / late / right: 세 번째 반복에서도 시점과 무게가 대체로 맞았다.

#### Notes

- User confusion observed: 시작 리마인드와 종료 직전 단일 액션, 종료 직후 회고 전환이 다른 시간대 표본에서도 다시 이어져도 흐름이 안정적이었다.
- Candidate adjustment: 종료 5분 전 알림은 현재 `계속 진행` 1액션 구성을 최종안으로 보고, 회고/다시 지정은 종료 직후 카드로 분리하는 쪽이 맞다.
- Keep / Review / Hold: Keep

## Weekly Recovery Observation Summary Update

- Observation count: 14
- Repeated recovery signal: `회고 다시 보기`
- Repeated reminder signal: `표시` 7회, `닫기` 2회, `완료` 2회
- Repeated `reschedule_unavailable` cases: 1회
- End-5-minute alert reaction trend: 시작 배너가 이미 한 번 노출된 체인에서는 종료 5분 전 추가 알림이 꼭 필요하지 않았고, 종료 직후 `회고 다시 보기`가 자연스럽게 이어졌다. 새 실험 배너를 `계속 진행` 1액션으로 줄였을 때 실제 화면 노출도 자연스럽고, 닫은 뒤 종료 직후 회고 전환까지도 세 표본 연속으로 흐름을 깨지 않았다.

### Decision

- Keep as-is: 시작 리마인드 기본 정책과 종료 5분 전 `계속 진행` 1액션 실험안
- Review next: 종료 5분 전 실험 배너를 계속 유지할지, 아니면 실제 운영에서 생략해도 충분한지
- Not enough evidence: 실제 운영 환경에서 이 비율과 회고 전환 흐름이 반복되는지

### Candidate changes

1. 종료 5분 전 알림은 현재처럼 `계속 진행` 1액션 실험형으로 유지한 채, 실제 운영에 가까운 일정 체인에서 반복 관찰한다.
2. 실제 운영에 가까운 일정 체인에서 시작 리마인드와 종료 직전 행동을 더 연속으로 관찰해, 지금의 `우선 유지`와 종료 직후 회고 전환이 반복되는지 본다.
3. 회복 표본과 리마인드 표본을 같은 일정 체인에서 더 길게 이어, 종료 직전 행동과 `missed` 이후 행동의 연결감을 비교한다.

## Related Docs

- [WEB_TO_APP_TRANSITION.md](./WEB_TO_APP_TRANSITION.md)
- [HANDOFF.md](./HANDOFF.md)
- [Missed Plan Recovery Plan](./exec-plans/active/2026-04-28-missed-plan-recovery.md)
