---
id: SOURCE-NOTE-GOOGLE-PLAY-DATA-SAFETY
type: source-note
title: Google Play Data Safety
status: verified
confidence: high
tags: [google-play, data-safety, privacy]
sources: [SRC-GOOGLE-PLAY-DATA-SAFETY]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play Data Safety

## Summary

Data Safety form은 앱과 포함된 SDK가 사용자 데이터를 수집·공유·보호하는 방식을 개발자가 선언하는 Play Console 절차다. internal testing에만 활성화된 앱은 면제되지만 closed, open 또는 production 트랙으로 이동하면 요구된다.

## Supported Claims

- closed, open 또는 production testing 트랙에 게시된 앱은 Data Safety form을 작성해야 한다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.
- internal testing에만 활성화된 앱은 Data Safety section 포함 의무에서 면제된다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.
- 사용자 데이터를 수집하지 않는 앱도 적용 트랙에서는 form을 작성하고 privacy policy 링크를 제공해야 한다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.
- 앱에 포함된 third-party library와 SDK의 off-device 전송도 개발자가 검토하고 선언에 반영해야 한다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.
- 기기 안에서만 처리되고 밖으로 전송되지 않는 데이터는 Data Safety의 collection으로 신고할 필요가 없다. 근거: `SRC-GOOGLE-PLAY-DATA-SAFETY`.

## Project Interpretation

- 현재의 `서버 전송 없음`, `계정 없음`, `광고 없음`, `로컬 저장 중심` 판단은 코드와 production AAB의 SDK를 다시 대조한 뒤에만 제출 답변으로 확정한다.
- internal testing 면제는 준비 생략 사유가 아니다. closed testing 전환 가능성이 있으므로 privacy policy와 draft를 미리 맞춘다.
- notification, analytics, crash reporting, backup 또는 sync SDK가 추가되면 기존 초안을 무효로 보고 재검토한다.

## Open Questions

- production AAB에 포함된 Expo 및 Google SDK가 실제로 어떤 데이터를 off-device로 전송하는가.
- 공개 privacy policy URL과 개발자 identity 표기는 최종 배포 정보와 일치하는가.
