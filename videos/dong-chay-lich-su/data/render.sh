#!/bin/bash
# Render video thành nhiều phần (chạy lại được từng phần nếu lỗi), ghép lại rồi gắn tiếng.
# Cách chạy: bash data/render.sh video01 Video01 [số phần]
set -euo pipefail
VID=$1; COMP=$2; PARTS=${3:-6}
cd "$(dirname "$0")/.."
BROWSER=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
OUT=build/$VID/parts; mkdir -p "$OUT"
TOTAL=$(python3 -c "import json;print(json.load(open('src/$VID/timeline.json'))['durationInFrames'])")
rm -rf build/bundle && npx remotion bundle src/index.ts --out-dir build/bundle --log=error
STEP=$(( (TOTAL + PARTS - 1) / PARTS ))
# render từ phần cuối lên để phần đầu (nhiều ảnh nhất) chạy sau cùng
for ((i=PARTS-1; i>=0; i--)); do
  A=$(( i * STEP )); B=$(( A + STEP - 1 )); (( B >= TOTAL )) && B=$(( TOTAL - 1 ))
  F="$OUT/part$i.mp4"
  if [ ! -s "$F" ]; then
    npx remotion render build/bundle "$COMP" "$F.tmp.mp4" --frames=$A-$B --muted --concurrency=4 --crf=18 \
      --browser-executable="$BROWSER" --log=error
    mv "$F.tmp.mp4" "$F"
  fi
  echo "xong phần $i ($A-$B)"
done
: > "$OUT/list.txt"
for ((i=0; i<PARTS; i++)); do echo "file 'part$i.mp4'" >> "$OUT/list.txt"; done
ffmpeg -v error -y -f concat -safe 0 -i "$OUT/list.txt" -i "build/$VID/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest "build/$VID/$VID.mp4"
echo "xong build/$VID/$VID.mp4"
