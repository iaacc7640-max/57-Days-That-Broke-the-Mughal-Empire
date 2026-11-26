#!/bin/bash
# Normalise the pre-mix to -14 LUFS with a brick-wall limiter so true peak stays under -1 dBTP even after AAC encoding.
set -e
cd "$(dirname "$0")/.."
ffmpeg -hide_banner -loglevel error -y -i audio/mix_pre.wav -af "loudnorm=I=-14:TP=-2.0:LRA=11,alimiter=limit=0.79:attack=1:release=50:level=disabled" -ar 48000 -ac 2 -c:a pcm_s16le audio/mix.wav
ffmpeg -hide_banner -i audio/mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:"
