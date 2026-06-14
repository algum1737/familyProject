#!/usr/bin/env bash

set -euo pipefail

required_files=(
  "README.md"
  "AGENTS.md"
  "ARCHITECTURE.md"
  "docs/index.md"
  "docs/DESIGN.md"
  "docs/FRONTEND.md"
  "docs/HANDOFF.md"
  "docs/MVP_SCOPE.md"
  "docs/PLANS.md"
  "docs/PRODUCT_SENSE.md"
  "docs/QUALITY_SCORE.md"
  "docs/RELIABILITY.md"
  "docs/SECURITY.md"
  "docs/TECH_STACK.md"
  "docs/WEB_TO_APP_TRANSITION.md"
  "docs/references/superpowers.md"
  "docs/design-docs/core-beliefs.md"
  "docs/product-specs/today-did-you-finish.md"
  "docs/exec-plans/completed/2026-04-17-bootstrap-harness.md"
  "scripts/check-handoff-loop.sh"
  "package.json"
  "tsconfig.json"
)

for path in "${required_files[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "missing required file: $path" >&2
    exit 1
  fi
done

agents_lines="$(wc -l < AGENTS.md | tr -d ' ')"
if [[ "$agents_lines" -gt 120 ]]; then
  echo "AGENTS.md is too long: ${agents_lines} lines" >&2
  exit 1
fi

if ! grep -q "Assumptions" docs/product-specs/today-did-you-finish.md && ! grep -q "Unknowns" docs/product-specs/today-did-you-finish.md; then
  echo "product spec must contain assumptions or unknowns" >&2
  exit 1
fi

if ! grep -q 'git branch --show-current' docs/HANDOFF.md; then
  echo "handoff must reference git branch command instead of hard-coded branch context" >&2
  exit 1
fi

if ! grep -q 'git rev-parse --short HEAD' docs/HANDOFF.md; then
  echo "handoff must reference git rev-parse command instead of hard-coded commit hash" >&2
  exit 1
fi

if ! find docs/exec-plans/completed -mindepth 1 -maxdepth 1 -type f -name '*.md' ! -name 'README.md' | grep -q .; then
  echo "missing completed exec plan history" >&2
  exit 1
fi

while IFS= read -r active_plan; do
  if ! grep -q '^## Open Work' "$active_plan"; then
    echo "active exec plan must include Open Work: $active_plan" >&2
    exit 1
  fi
done < <(find docs/exec-plans/active -mindepth 1 -maxdepth 1 -type f -name '*.md')

if ! grep -q 'check-handoff-loop.sh' .githooks/post-commit; then
  echo "post-commit hook must run scripts/check-handoff-loop.sh" >&2
  exit 1
fi

echo "docs validation passed"
