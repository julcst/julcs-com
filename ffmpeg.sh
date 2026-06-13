#!/usr/bin/env bash
# Convert a source clip into a teaser webm + a poster frame.
# Usage: ./ffmpeg.sh input.mov name
#   -> public/teasers/<name>.webm  (animated loop)
#   -> public/teasers/<name>.jpg   (static preview / autoplay fallback)
set -euo pipefail

input="${1:-input.mov}"
name="${2:-output}"
out="public/teasers"

ffmpeg -y -i "$input" -an -crf 28 -r 30 -vf scale=320x320 "$out/$name.webm"
ffmpeg -y -i "$out/$name.webm" -vf "thumbnail" -frames:v 1 -q:v 3 "$out/$name.jpg"
