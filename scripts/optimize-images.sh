#!/usr/bin/env bash
#
# optimize-images.sh
# Generates web-optimized derivatives of the full-res photos in ../../imAGES
# using macOS's built-in `sips` (no external deps required).
#
#   <name>-thumb.jpg : 500x500 center-cropped square, q70  -> sphere nodes
#   <name>-full.jpg  : 1400px long edge, q80               -> lightbox / modal
#
# Output: ../public/photos/
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/../../imAGES"
OUT="$SCRIPT_DIR/../public/photos"

mkdir -p "$OUT"

shopt -s nullglob
count=0
for img in "$SRC"/*.jpg "$SRC"/*.JPG "$SRC"/*.jpeg; do
  [ -e "$img" ] || continue
  base="$(basename "$img")"
  name="${base%.*}"

  # Read dimensions to decide which side to fit for the square crop.
  w="$(sips -g pixelWidth  "$img" | awk '/pixelWidth/  {print $2}')"
  h="$(sips -g pixelHeight "$img" | awk '/pixelHeight/ {print $2}')"

  # --- square thumbnail: fit the SHORT side to 500, then center-crop 500x500
  if [ "$w" -ge "$h" ]; then
    sips --resampleHeight 500 -c 500 500 \
         -s format jpeg -s formatOptions 70 \
         "$img" --out "$OUT/${name}-thumb.jpg" >/dev/null
  else
    sips --resampleWidth 500 -c 500 500 \
         -s format jpeg -s formatOptions 70 \
         "$img" --out "$OUT/${name}-thumb.jpg" >/dev/null
  fi

  # --- full version: longest side 1400, aspect preserved
  sips -Z 1400 \
       -s format jpeg -s formatOptions 80 \
       "$img" --out "$OUT/${name}-full.jpg" >/dev/null

  count=$((count + 1))
  echo "  [$count] $name  (${w}x${h}) -> thumb + full"
done

echo "Done. Optimized $count photo(s) into $OUT"
