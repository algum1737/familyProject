---
id: SRC-EXPO-NOTIFICATIONS
type: source
title: Notifications
status: verified
confidence: high
source_url: https://docs.expo.dev/versions/latest/sdk/notifications/
author: Expo
published: unknown
retrieved: 2026-07-30
---

# Notifications

## Source Role

`expo-notifications`의 권한, 예약·취소 API와 Android exact alarm manifest 요구사항을 설명하는 공식 SDK 문서다.

## Storage Decision

- 버전이 이동하는 latest URL을 공식 원본 포인터로 사용한다.
- 프로젝트가 사용하는 실제 Expo SDK와 package 버전은 저장소 설정에서 별도로 확인한다.
- 파생 요약은 원문이 보장하는 공개 API와 프로젝트가 확인한 native 동작을 구분한다.

## Trust Notes

- Expo 공개 API와 설정에 대한 1차 공식 자료다.
- latest 문서는 프로젝트에 설치된 버전과 차이가 날 수 있다.
- 문서는 예약 성공과 실제 OS 표시 시점을 동일하게 보장하지 않는다.
