#!/bin/bash
# Render the episode in <=60 s ranges (each well under the 10-minute command limit), sequentially.
S=/root/.claude/skills/synced/c7dc3b91-9147-4a37-ab21-4644db371c09_7f026cfa-5a00-418e-ab6c-65da15704ddc
cd "$(dirname "$0")/.."
mkdir -p renders/parts
TOTAL=$(python3 -c "import json;print(json.load(open('shotlist.json'))['total'])")
RANGES=${RANGES:-"0:60 60:120 120:180 180:240 240:300 300:360 360:$TOTAL"}
for r in $RANGES; do
  a=${r%:*}; b=${r#*:}
  out=renders/parts/part-$(printf %03d ${a%.*}).mp4
  echo "=== $a-$b $(date +%T)"
  node $S/hyperframes/scripts/plugin-cli.mjs render hf --start $a --end $b -o $out --quality looks --quiet > renders/parts/log-${a%.*}.txt 2>&1
  echo "done $out rc=$? $(date +%T)"
done
echo ALLDONE
