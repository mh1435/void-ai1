# Fixes for Void AI1

## Issue 1: Unwanted Bar at Top
- The issue is likely the viewport meta tag or safe area calculations
- Check if the bar appears in specific sections like Heroes/Items tabs

## Issue 2: Missing MLBB Hero & Item Images

### Root Causes:
1. **Image paths not properly constructed** - The JSON files (heroes.json, items.json) don't include image file paths
2. **No image URL generation** - The JavaScript doesn't generate proper image URLs from hero/item names
3. **Images directory** - Need to ensure images are properly referenced with correct paths

### Solution:

You need to:

1. **Update the image directory structure** - Ensure you have:
   - `images/heroes/` folder with hero images named like: `fanny.png`, `granger.png`, etc.
   - `images/items/` folder with item images named like: `blade-of-despair.png`, etc.

2. **Update the JSON files** to include image paths

3. **Update app.js** to properly load and display images for MLBB content

4. **Fix the navbar/bar issue** in CSS

---

## Implementation Steps:

### Step 1: Fix heroes.json and items.json
Add `image` field to each hero and item with the proper filename

### Step 2: Update app.js
When rendering MLBB game tiles, construct image URLs correctly:
- Hero image: `images/heroes/{heroName.toLowerCase()}.png`
- Item image: `images/items/{itemName.toLowerCase().replace(/ /g, '-')}.png`

### Step 3: Fix CSS bar issue
Check the `.view` positioning and the bottom navigation z-index
