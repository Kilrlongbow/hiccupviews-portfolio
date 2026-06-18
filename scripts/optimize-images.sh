#!/usr/bin/env bash
#
# optimize-images.sh
# Generates web-optimized derivatives of the full-res photos in ../../imAGES
# using macOS's built-in `sips` (no external deps required).
#
# Source folders -> output folders (filenames overlap across folders, so each
# category gets its own subdir under public/photos):
#
#   imAGES/Homapage Selection/ -> public/photos/home/
#       <name>-thumb.jpg : 500x500 center-cropped square, q70  -> sphere nodes
#       <name>-full.jpg  : 1400px long edge, q80               -> sphere modal
#
#   imAGES/Potraits/ -> public/photos/portraits/
#   imAGES/Events/   -> public/photos/events/
#       <name>-grid.jpg  : 900px long edge, aspect preserved, q78 -> gallery grid
#       <name>-full.jpg  : 1600px long edge, aspect preserved, q82 -> lightbox
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/../../imAGES"
OUT="$SCRIPT_DIR/../public/photos"

# Fresh start: remove any previous derivatives (including the old flat layout).
rm -rf "$OUT"
mkdir -p "$OUT/home" "$OUT/portraits" "$OUT/events"

shopt -s nullglob nocaseglob

dims() { # $1=image -> echoes "W H"
  local w h
  w="$(sips -g pixelWidth  "$1" | awk '/pixelWidth/  {print $2}')"
  h="$(sips -g pixelHeight "$1" | awk '/pixelHeight/ {print $2}')"
  echo "$w $h"
}

# --- Homepage sphere: square thumb (500) + full (1400) -------------------------
home_count=0
for img in "$SRC/Homapage Selection"/*.jpg "$SRC/Homapage Selection"/*.jpeg; do
  [ -e "$img" ] || continue
  base="$(basename "$img")"; name="${base%.*}"
  read -r w h < <(dims "$img")

  if [ "$w" -ge "$h" ]; then
    sips --resampleHeight 500 -c 500 500 \
         -s format jpeg -s formatOptions 70 \
         "$img" --out "$OUT/home/${name}-thumb.jpg" >/dev/null
  else
    sips --resampleWidth 500 -c 500 500 \
         -s format jpeg -s formatOptions 70 \
         "$img" --out "$OUT/home/${name}-thumb.jpg" >/dev/null
  fi

  sips -Z 1400 -s format jpeg -s formatOptions 80 \
       "$img" --out "$OUT/home/${name}-full.jpg" >/dev/null

  home_count=$((home_count + 1))
  echo "  home [$home_count] $name (${w}x${h}) -> thumb + full"
done

# --- Gallery categories: grid (900) + full (1600), aspect preserved ------------
process_gallery() { # $1=source subdir  $2=output subdir  $3=label
  local srcdir="$SRC/$1" outdir="$OUT/$2" label="$3" count=0
  for img in "$srcdir"/*.jpg "$srcdir"/*.jpeg; do
    [ -e "$img" ] || continue
    local base name w h
    base="$(basename "$img")"; name="${base%.*}"
    read -r w h < <(dims "$img")

    sips -Z 900  -s format jpeg -s formatOptions 78 \
         "$img" --out "$outdir/${name}-grid.jpg" >/dev/null
    sips -Z 1600 -s format jpeg -s formatOptions 82 \
         "$img" --out "$outdir/${name}-full.jpg" >/dev/null

    count=$((count + 1))
    echo "  $label [$count] $name (${w}x${h}) -> grid + full"
  done
}

process_gallery "Potraits" "portraits" "portraits"
process_gallery "Events"   "events"    "events"

echo "Done. Optimized photos into $OUT/{home,portraits,events}"
