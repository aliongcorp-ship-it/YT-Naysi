#!/usr/bin/env bash
# One command, from numbers to master file.
set -euo pipefail
cd "$(dirname "$0")"
node scripts/simulate.mjs          # measured statistics -> src/data/queue.json
node scripts/build-timeline.mjs    # VO durations -> acts + word timings -> src/data/timeline.json
python3 scripts/score.py           # procedural score + sfx + VO mix -> audio/mix/raw.wav
ffmpeg -y -v error -i audio/mix/raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -ac 2 public/audio/master.wav
npx remotion render src/index.ts Naysi out/naysi_master.mp4 \
  --browser-executable="$(pwd)/.bin/chrome-wrapper" \
  --codec=h264 --crf=18 --concurrency=2 --jpeg-quality=95 --pixel-format=yuv420p \
  --audio-codec=aac --audio-bitrate=320k --overwrite
