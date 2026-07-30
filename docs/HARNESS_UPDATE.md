# Harness Update

이 프로젝트에 적용된 하네스 버전은 루트 `.harness-version`으로 확인한다. 하네스 원본과 프로젝트 레지스트리는 `https://github.com/algum1737/harness_algum`에서 관리한다.

## Marker

```text
version=2026.07.30.1
profile=tracked
validation=passed
```

- `version`: 실제 병합한 하네스 배포 버전
- `profile`: 이 프로젝트는 marker와 하네스 파일을 Git으로 추적하므로 `tracked`
- `validation`: 병합 중에는 `pending`, 검증 계약을 모두 통과한 뒤에만 `passed`

marker가 없거나 `validation=passed`가 아니면 중앙 감사에서 설치 버전을 확정하지 않는다.

## Update Flow

1. `main`과 원격 상태, 작업 트리, 현재 marker를 감사한다.
2. 사용자 승인을 받고 작업 브랜치와 active exec plan을 만든다.
3. 하네스 원본의 `HARNESS_VERSION`과 `template-repo/`를 현재 프로젝트와 비교한다.
4. 프로젝트 고유 문서, 제품 사실, knowledge와 작업 이력을 보존하며 필요한 운영 계약만 병합한다.
5. marker를 `pending`으로 유지한 채 exec plan의 검증 계약을 실행한다.
6. `npm run validate:knowledge`, `npm run validate:docs`, `npm run test:handoff-loop`, `npm run typecheck`, `npm test`를 통과한 뒤에만 `validation=passed`로 확정한다.
7. active 계획을 completed로 이동하고 `docs/index.md`와 `docs/HANDOFF.md`를 갱신한다.
8. 중앙 감사에서 이 프로젝트가 `current`인지 확인한다.

제품 코드나 의존성을 건드리는 하네스 업데이트라면 해당 변경에 맞는 build, 브라우저 또는 실기기 QA를 검증 계약에 추가한다.
