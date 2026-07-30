---
id: SOURCE-NOTE-GOOGLE-PLAY-APP-SIGNING
type: source-note
title: Google Play App Signing
status: verified
confidence: high
tags: [google-play, signing, android-app-bundle]
sources: [SRC-GOOGLE-PLAY-APP-SIGNING]
created: 2026-07-30
updated: 2026-07-30
---

# Google Play App Signing

## Summary

Play App Signing에서는 Google Play이 최종 배포 APK를 서명하는 app signing key를 관리하고, 개발자는 AAB 업로드 신원을 확인하는 upload key를 보관한다.

## Supported Claims

- Play App Signing은 app signing key를 Google Play 인프라에서 관리해 Android App Bundle로부터 배포 APK를 서명한다. 근거: `SRC-GOOGLE-PLAY-APP-SIGNING`.
- upload key는 개발자가 보관하며 Play Console에 올리는 app bundle의 신원을 확인하는 데 사용된다. 근거: `SRC-GOOGLE-PLAY-APP-SIGNING`.
- 신규 앱은 첫 app bundle 업로드 과정에서 Google Play이 app signing key를 생성하도록 선택할 수 있다. 근거: `SRC-GOOGLE-PLAY-APP-SIGNING`.
- Play App Signing 설정에는 적절한 계정 권한과 약관 수락이 필요하다. 근거: `SRC-GOOGLE-PLAY-APP-SIGNING`.

## Project Interpretation

- 기존 로컬 debug signing release AAB는 permission preflight 증거일 뿐 Play 제출 산출물로 사용하지 않는다.
- EAS production AAB의 upload signing 경로와 Play App Signing 등록 결과를 첫 업로드에서 확인해야 한다.
- keystore, 인증서 비밀번호와 복구 정보는 knowledge 또는 Git에 기록하지 않는다.

## Open Questions

- EAS production credential의 upload certificate와 Play Console 등록 certificate가 일치하는가.
- app signing key를 Google 생성 기본값으로 둘지 별도 키를 제공할지 승인할 사람이 누구인가.
