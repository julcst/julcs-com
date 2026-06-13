#!/usr/bin/env bash
# Build a teaser from a source clip:
#   public/teasers/<name>.webm  - preferred, used where the browser can play it
#   src/teasers/<name>.webp     - animated fallback (iOS etc.), optimized by Astro
#
# Usage: ./ffmpeg.sh input.mov name
set -euo pipefail

input="${1:-input.mov}"
name="${2:-output}"
tmp="$(mktemp -t teaser-XXXXXX).gif"

# Primary: compact 320x320 webm loop.
ffmpeg -y -i "$input" -an -crf 28 -r 30 -vf scale=320x320 "public/teasers/$name.webm"

# Fallback: this ffmpeg build has no libwebp encoder, so go via a high-quality
# 256-colour GIF and let sharp pack it into an animated WebP.
ffmpeg -y -i "$input" -loop 0 -vf \
  "fps=15,scale=320:320:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=diff[p];[s1][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" \
  "$tmp"
node -e "require('sharp')('$tmp',{pages:-1}).webp({loop:0,quality:72,effort:5}).toFile('src/teasers/$name.webp').then(()=>console.log('wrote src/teasers/$name.webp'))"
rm -f "$tmp"
