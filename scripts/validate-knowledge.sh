#!/usr/bin/env bash

set -euo pipefail

knowledge_root="docs/knowledge"
source_root="docs/references/sources"
index_file="${knowledge_root}/index.md"
log_file="${knowledge_root}/log.md"
failures=0

ids_file="$(mktemp)"
source_ids_file="$(mktemp)"

cleanup() {
  rm -f "$ids_file" "$source_ids_file"
}
trap cleanup EXIT

fail() {
  echo "knowledge validation error: $*" >&2
  failures=$((failures + 1))
}

frontmatter_field() {
  local file="$1"
  local key="$2"

  awk -v key="$key" '
    NR == 1 && $0 != "---" { exit }
    NR > 1 && $0 == "---" { exit }
    index($0, key ":") == 1 {
      sub("^" key ":[[:space:]]*", "")
      print
      exit
    }
  ' "$file"
}

check_common_fields() {
  local file="$1"
  local field

  for field in id type title status confidence; do
    if [[ -z "$(frontmatter_field "$file" "$field")" ]]; then
      fail "missing frontmatter field '$field': $file"
    fi
  done
}

check_frontmatter_delimiters() {
  local file="$1"
  local delimiter_count

  if [[ "$(sed -n '1p' "$file")" != "---" ]]; then
    fail "frontmatter must start on the first line: $file"
  fi

  delimiter_count="$(grep -c '^---$' "$file" || true)"
  if [[ "$delimiter_count" -lt 2 ]]; then
    fail "frontmatter must have opening and closing delimiters: $file"
  fi
}

check_status_and_confidence() {
  local file="$1"
  local status
  local confidence

  status="$(frontmatter_field "$file" status)"
  confidence="$(frontmatter_field "$file" confidence)"

  if [[ ! "$status" =~ ^(draft|verified|disputed|deprecated)$ ]]; then
    fail "invalid status '$status': $file"
  fi

  if [[ ! "$confidence" =~ ^(low|medium|high)$ ]]; then
    fail "invalid confidence '$confidence': $file"
  fi
}

required_paths=(
  "$knowledge_root/README.md"
  "$index_file"
  "$log_file"
  "$knowledge_root/source-notes"
  "$knowledge_root/concepts"
  "$knowledge_root/entities"
  "$knowledge_root/syntheses"
  "$source_root"
  "docs/generated/knowledge-lint/README.md"
)

for path in "${required_paths[@]}"; do
  if [[ ! -e "$path" ]]; then
    fail "missing required path: $path"
  fi
done

source_count=0
while IFS= read -r file; do
  source_count=$((source_count + 1))
  check_frontmatter_delimiters "$file"
  check_common_fields "$file"
  check_status_and_confidence "$file"

  id="$(frontmatter_field "$file" id)"
  type="$(frontmatter_field "$file" type)"
  source_url="$(frontmatter_field "$file" source_url)"
  published="$(frontmatter_field "$file" published)"
  retrieved="$(frontmatter_field "$file" retrieved)"

  if [[ ! "$id" =~ ^SRC-[A-Z0-9-]+$ ]]; then
    fail "source id must match SRC-[A-Z0-9-]+: $file"
  fi
  if [[ "$type" != "source" ]]; then
    fail "source record type must be 'source': $file"
  fi
  if [[ -z "$source_url" ]]; then
    fail "missing source_url: $file"
  fi
  if [[ ! "$published" =~ ^([0-9]{4}-[0-9]{2}-[0-9]{2}|unknown)$ ]]; then
    fail "published must use YYYY-MM-DD or 'unknown': $file"
  fi
  if [[ ! "$retrieved" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    fail "retrieved must use YYYY-MM-DD: $file"
  fi

  printf '%s\n' "$id" >> "$ids_file"
  printf '%s\n' "$id" >> "$source_ids_file"
done < <(find "$source_root" -type f -name '*.md' ! -name 'README.md' | sort)

if [[ "$source_count" -eq 0 ]]; then
  fail "at least one source record is required"
fi

knowledge_count=0
while IFS= read -r file; do
  knowledge_count=$((knowledge_count + 1))
  check_frontmatter_delimiters "$file"
  check_common_fields "$file"
  check_status_and_confidence "$file"

  id="$(frontmatter_field "$file" id)"
  type="$(frontmatter_field "$file" type)"
  sources="$(frontmatter_field "$file" sources)"
  created="$(frontmatter_field "$file" created)"
  updated="$(frontmatter_field "$file" updated)"
  relative="${file#"$knowledge_root"/}"

  case "$relative" in
    source-notes/*) expected_type="source-note" ;;
    concepts/*) expected_type="concept" ;;
    entities/*) expected_type="entity" ;;
    syntheses/*) expected_type="synthesis" ;;
    *)
      fail "knowledge page is outside a supported content directory: $file"
      expected_type=""
      ;;
  esac

  if [[ "$type" != "$expected_type" ]]; then
    fail "type '$type' does not match expected '$expected_type': $file"
  fi
  if [[ ! "$id" =~ ^[A-Z][A-Z0-9-]+$ ]]; then
    fail "knowledge id must use uppercase letters, digits, and hyphens: $file"
  fi
  if [[ ! "$created" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    fail "created must use YYYY-MM-DD: $file"
  fi
  if [[ ! "$updated" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    fail "updated must use YYYY-MM-DD: $file"
  fi
  if [[ ! "$sources" =~ ^\[[^]]+\]$ ]]; then
    fail "sources must be a non-empty inline list: $file"
  else
    source_list="${sources#[}"
    source_list="${source_list%]}"
    IFS=',' read -r -a referenced_sources <<< "$source_list"
    for raw_source_id in "${referenced_sources[@]}"; do
      source_id="$(printf '%s' "$raw_source_id" | tr -d '[:space:]')"
      if ! grep -Fxq "$source_id" "$source_ids_file"; then
        fail "unknown source id '$source_id': $file"
      fi
    done
  fi

  for heading in "## Summary" "## Supported Claims" "## Project Interpretation" "## Open Questions"; do
    if ! grep -Fqx "$heading" "$file"; then
      fail "missing required section '$heading': $file"
    fi
  done

  if ! grep -Fq "(./$relative)" "$index_file"; then
    fail "knowledge page is missing from index.md: $relative"
  fi

  printf '%s\n' "$id" >> "$ids_file"
done < <(
  find \
    "$knowledge_root/source-notes" \
    "$knowledge_root/concepts" \
    "$knowledge_root/entities" \
    "$knowledge_root/syntheses" \
    -type f -name '*.md' ! -name 'README.md' | sort
)

if [[ "$knowledge_count" -eq 0 ]]; then
  fail "at least one derived knowledge page is required"
fi

duplicate_ids="$(sort "$ids_file" | uniq -d)"
if [[ -n "$duplicate_ids" ]]; then
  while IFS= read -r duplicate_id; do
    fail "duplicate id: $duplicate_id"
  done <<< "$duplicate_ids"
fi

while IFS= read -r file; do
  while IFS= read -r link; do
    case "$link" in
      http://*|https://*|mailto:*|\#*|"") continue ;;
    esac

    link_path="${link%%#*}"
    if [[ "$link_path" == /* ]]; then
      continue
    fi

    if [[ ! -e "$(dirname "$file")/$link_path" ]]; then
      fail "broken relative link '$link' in $file"
    fi
  done < <(perl -ne 'while (/\[[^]]+\]\(([^)]+)\)/g) { print "$1\n" }' "$file")
done < <(find "$knowledge_root" -type f -name '*.md' | sort)

while IFS= read -r heading; do
  if [[ ! "$heading" =~ ^##\ \[[0-9]{4}-[0-9]{2}-[0-9]{2}\]\ (ingest|query|lint)\ \|\ .+ ]]; then
    fail "invalid knowledge log heading: $heading"
  fi
done < <(grep '^## ' "$log_file" || true)

while IFS= read -r source_id; do
  if ! grep -R -Fq "sources: [" "$knowledge_root" \
    || ! grep -R -F "sources: [" "$knowledge_root" | grep -Fq "$source_id"; then
    fail "source record is not referenced by derived knowledge: $source_id"
  fi
done < "$source_ids_file"

if [[ "$failures" -gt 0 ]]; then
  echo "knowledge validation failed with $failures error(s)" >&2
  exit 1
fi

echo "knowledge validation passed: ${source_count} source(s), ${knowledge_count} knowledge page(s)"
