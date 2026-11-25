#!/bin/bash
# Join the rendered parts (concat demuxer, -c copy), lay the final mix on top once, encode the delivery files.
set -e
cd "$(dirname "$0")/.."
ls renders/parts/part-*.mp4 | sort | sed "s#^renders/parts/#file '#; s#\$#'#" > renders/parts/list.txt
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i renders/parts/list.txt -c copy -an renders/joined.mp4
# final grade: a gentle shadow curve so ink reads as true black (darkest pixels < 35); no blur, no lift.
# master: 1920x1080, 30 fps, H.264 High, yuv420p, ~8 Mbps, AAC-LC stereo 48 kHz, faststart
ffmpeg -hide_banner -loglevel error -y -i renders/joined.mp4 -i audio/mix.wav -map 0:v:0 -map 1:a:0 -vf "curves=all='0/0 0.18/0.125 0.5/0.49 1/1'" \
  -c:v libx264 -preset medium -profile:v high -pix_fmt yuv420p -b:v 8M -maxrate 10M -bufsize 16M -r 30 \
  -c:a aac -profile:a aac_low -b:a 192k -ar 48000 -ac 2 -shortest -movflags +faststart master.mp4
# review copy for the phone
ffmpeg -hide_banner -loglevel error -y -i master.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset medium -profile:v high -pix_fmt yuv420p -b:v 2.5M -c:a aac -b:a 128k -movflags +faststart review.mp4
ls -la master.mp4 review.mp4
