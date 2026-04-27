#!/usr/bin/env bash

set -euo pipefail

target_ref="${1:-HEAD}"
changed_files="$(git show --name-only --pretty='' "$target_ref")"

if [[ -z "$changed_files" ]]; then
  exit 0
fi

handoff_changed=false
if grep -qx 'docs/HANDOFF.md' <<<"$changed_files"; then
  handoff_changed=true
fi

index_changed=false
if grep -qx 'docs/index.md' <<<"$changed_files"; then
  index_changed=true
fi

non_handoff_changes="$(grep -vx 'docs/HANDOFF.md' <<<"$changed_files" || true)"
plan_changes="$(grep '^docs/exec-plans/' <<<"$changed_files" || true)"
completed_plan_additions="$(grep '^docs/exec-plans/completed/.*\.md$' <<<"$changed_files" || true)"
active_plan_deletions="$(
  git diff-tree --no-commit-id --name-status -r "$target_ref" \
    | awk '$1 == "D" && $2 ~ /^docs\/exec-plans\/active\/.*\.md$/ { print $2 }'
)"
session_context_changes="$(grep -E '^(src/|tests/|package\.json$|playwright\.config\.ts$|\.github/workflows/)' <<<"$changed_files" || true)"
plan_location_changes="$(
  git diff-tree --no-commit-id --name-status -r "$target_ref" \
    | awk '$2 ~ /^docs\/exec-plans\/(active|completed)\/.*\.md$/ { print $0 }'
)"

if [[ -n "$non_handoff_changes" && "$handoff_changed" == false ]]; then
  echo "[handoff-loop] docs/HANDOFF.md was not updated in this commit."
  echo "[handoff-loop] Review recent progress, current state, and suggested next work."
fi

if [[ -n "$session_context_changes" && "$handoff_changed" == false ]]; then
  echo "[handoff-loop] Session-context files changed without a handoff update:"
  echo "$session_context_changes" | sed 's/^/[handoff-loop]   - /'
fi

if [[ -n "$plan_changes" && -z "$completed_plan_additions" && -n "$active_plan_deletions" ]]; then
  echo "[handoff-loop] Active exec plan was removed without a completed plan addition."
  echo "[handoff-loop] Verify whether the plan should move to docs/exec-plans/completed/."
fi

if [[ -n "$completed_plan_additions" && "$handoff_changed" == false ]]; then
  echo "[handoff-loop] Completed exec plan was added, but docs/HANDOFF.md did not change."
  echo "[handoff-loop] Confirm the handoff reflects completed-plan movement."
fi

if [[ -n "$plan_location_changes" && "$index_changed" == false ]]; then
  echo "[handoff-loop] Exec plan location changed, but docs/index.md was not updated."
  echo "$plan_location_changes" | sed 's/^/[handoff-loop]   - /'
fi
