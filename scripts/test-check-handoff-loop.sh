#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

setup_repo() {
  local scenario_dir="$1"

  mkdir -p "$scenario_dir"
  cd "$scenario_dir"
  git init -q
  git config user.name "Codex"
  git config user.email "codex@example.com"

  mkdir -p docs/exec-plans/active docs/exec-plans/completed src tests .github/workflows scripts
  cp "$repo_root/scripts/check-handoff-loop.sh" scripts/check-handoff-loop.sh
  chmod +x scripts/check-handoff-loop.sh

  cat <<'EOF' > docs/HANDOFF.md
# Handoff
EOF
  cat <<'EOF' > docs/index.md
# Docs Index
EOF
  cat <<'EOF' > docs/exec-plans/active/sample.md
# Active Plan
EOF

  git add .
  git commit -q -m "base"
}

assert_contains() {
  local output="$1"
  local expected="$2"

  if ! grep -Fq "$expected" <<<"$output"; then
    echo "expected output to contain: $expected" >&2
    echo "$output" >&2
    exit 1
  fi
}

assert_not_contains() {
  local output="$1"
  local unexpected="$2"

  if grep -Fq "$unexpected" <<<"$output"; then
    echo "expected output to not contain: $unexpected" >&2
    echo "$output" >&2
    exit 1
  fi
}

scenario_missing_handoff() {
  local scenario_dir="$tmp_dir/missing-handoff"
  setup_repo "$scenario_dir"

  cat <<'EOF' > src/example.ts
export const value = 1;
EOF
  git add src/example.ts
  git commit -q -m "change src only"

  local output
  output="$(./scripts/check-handoff-loop.sh HEAD)"
  assert_contains "$output" "docs/HANDOFF.md was not updated"
  assert_contains "$output" "Session-context files changed without a handoff update"
  assert_contains "$output" "src/example.ts"
}

scenario_handoff_updated() {
  local scenario_dir="$tmp_dir/handoff-updated"
  setup_repo "$scenario_dir"

  cat <<'EOF' > src/example.ts
export const value = 2;
EOF
  cat <<'EOF' > docs/HANDOFF.md
# Handoff
updated
EOF
  git add src/example.ts docs/HANDOFF.md
  git commit -q -m "change src with handoff"

  local output
  output="$(./scripts/check-handoff-loop.sh HEAD)"
  assert_not_contains "$output" "docs/HANDOFF.md was not updated"
  assert_not_contains "$output" "Session-context files changed without a handoff update"
}

scenario_completed_move_without_index() {
  local scenario_dir="$tmp_dir/completed-move-missing-index"
  setup_repo "$scenario_dir"

  git mv docs/exec-plans/active/sample.md docs/exec-plans/completed/sample.md
  cat <<'EOF' > docs/HANDOFF.md
# Handoff
plan moved
EOF
  git add docs/HANDOFF.md
  git commit -q -m "move plan without index"

  local output
  output="$(./scripts/check-handoff-loop.sh HEAD)"
  assert_contains "$output" "Exec plan location changed, but docs/index.md was not updated"
  assert_contains "$output" "docs/exec-plans/completed/sample.md"
}

scenario_completed_move_with_docs() {
  local scenario_dir="$tmp_dir/completed-move-with-docs"
  setup_repo "$scenario_dir"

  git mv docs/exec-plans/active/sample.md docs/exec-plans/completed/sample.md
  cat <<'EOF' > docs/HANDOFF.md
# Handoff
plan moved
EOF
  cat <<'EOF' > docs/index.md
# Docs Index
updated
EOF
  git add docs/HANDOFF.md docs/index.md
  git commit -q -m "move plan with docs"

  local output
  output="$(./scripts/check-handoff-loop.sh HEAD)"
  assert_not_contains "$output" "Completed exec plan was added"
  assert_not_contains "$output" "Exec plan location changed, but docs/index.md was not updated"
}

scenario_missing_handoff
scenario_handoff_updated
scenario_completed_move_without_index
scenario_completed_move_with_docs

echo "check-handoff-loop scenarios passed"
