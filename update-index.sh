#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"
INDEX_FILE="$SCRIPT_DIR/index.md"

entries=()
for file in "$REPORTS_DIR"/*.md; do
    [ -f "$file" ] || continue
    base=$(basename "$file")

    title=$(sed -n '1s/^# Match Report: \(.*\) vs \(.*\)/\1|\2/p' "$file")
    date_line=$(sed -n '3s/^\*\*Date:\*\* \([0-9-]*\).*\*\*Final Score:\*\* \([0-9]*\) – \([0-9]*\)/\1|\2|\3/p' "$file")

    IFS='|' read -r team_a team_b <<< "${title:-}" 2>/dev/null || continue
    IFS='|' read -r date score_a score_b <<< "${date_line:-}" 2>/dev/null || continue

    [ -z "$date" ] && continue
    entries+=("$date|$team_a|$team_b|$score_a|$score_b|$base")
done

if [ ${#entries[@]} -eq 0 ]; then
    echo "No match reports found in $REPORTS_DIR"
    exit 0
fi

IFS=$'\n' sorted=($(sort -t'|' -k1r <<< "${entries[*]}"))
unset IFS

# Generate the replacement content into a temp file
tmp=$(mktemp)
cat > "$tmp" << 'EOF'
## Match Reports

| Date | Teams | Score | Report |
|------|-------|-------|--------|
EOF
for entry in "${sorted[@]}"; do
    IFS='|' read -r date team_a team_b score_a score_b base <<< "$entry"
    printf '| %s | %s vs %s | %s – %s | [View](reports/%s) |\n' \
        "$date" "$team_a" "$team_b" "$score_a" "$score_b" "$base" >> "$tmp"
done

# Replace content between <!-- SECTION:reports --> markers
awk -v tmpfile="$tmp" '
BEGIN { in_section = 0 }
/^<!-- SECTION:reports -->$/ {
    print
    if (in_section == 0) {
        in_section = 1
        while ((getline line < tmpfile) > 0) print line
        close(tmpfile)
    } else {
        in_section = 0
    }
    next
}
in_section { next }
{ print }
' "$INDEX_FILE" > "${INDEX_FILE}.tmp" && mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

rm -f "$tmp"
echo "Updated reports table in $INDEX_FILE"
