#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"
INDEX_FILE="$SCRIPT_DIR/index.md"

entries=()
for file in "$REPORTS_DIR"/*.md; do
    [ -f "$file" ] || continue
    base=$(basename "$file")

    # Parse: "# Match Report: TeamA vs TeamB"
    title=$(sed -n '1s/^# Match Report: \(.*\) vs \(.*\)/\1|\2/p' "$file")

    # Parse: "**Date:** 2026-07-05 ... **Final Score:** 48 – 6"
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

# Sort by date descending (newest first)
IFS=$'\n' sorted=($(sort -t'|' -k1r <<< "${entries[*]}"))
unset IFS

# Build table rows
table_rows="| Date | Teams | Score | Report |\n|------|-------|-------|--------|\n"
for entry in "${sorted[@]}"; do
    IFS='|' read -r date team_a team_b score_a score_b base <<< "$entry"
    table_rows+="| $date | $team_a vs $team_b | $score_a – $score_b | [View](reports/$base) |\n"
done
table_rows="${table_rows%\\n}"

# Replace content between <!-- SECTION:reports --> markers
awk -v replacement="$table_rows" '
/^<!-- SECTION:reports -->$/ && !in_section {
    print
    in_section = 1
    next
}
in_section && /^<!-- SECTION:reports -->$/ {
    printf "%s\n%s\n", replacement, $0
    in_section = 0
    next
}
in_section { next }
{ print }
' "$INDEX_FILE" > "${INDEX_FILE}.tmp" && mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

echo "Updated reports table in $INDEX_FILE"
