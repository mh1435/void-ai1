#!/bin/bash
# Fix MLBB item image filenames to match what app.js expects
# Run from images/items/ directory

# Remove "-png" suffix from all files
cd images/items/

# Rename files with pattern: name-png.png -> name.png
for file in *-png.png; do
  if [ -f "$file" ]; then
    newname="${file%-png.png}.png"
    mv "$file" "$newname"
    echo "Renamed: $file -> $newname"
  fi
done

# Rename files with pattern: name-png-min.png -> name.png  
for file in *-png-min.png; do
  if [ -f "$file" ]; then
    newname="${file%-png-min.png}.png"
    mv "$file" "$newname"
    echo "Renamed: $file -> $newname"
  fi
done

echo "Done! Item images should now load properly."
