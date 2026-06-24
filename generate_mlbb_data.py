#!/usr/bin/env python3
"""
generate_mlbb_data.py
----------------------
Generates ORIGINAL Mobile Legends: Bang Bang hero and item write-ups by
calling the Claude API (in your own words, not scraped/copied text), and
saves them as JSON files that the Void app can load into the info grid.

This does NOT scrape or copy Wikipedia / Liquipedia / the MLBB wiki. It
asks the model to produce original summaries (role, counters, suggested
build) for each hero/item name you give it. You control exactly how much
gets generated and when, so it's easy to keep API usage small.

USAGE
-----
1. Put your Anthropic API key in the environment:
     export ANTHROPIC_API_KEY=sk-ant-...

2. Edit HERO_LIST / ITEM_LIST below (or pass --heroes-file / --items-file
   with one name per line) to control exactly what gets generated.

3. Run:
     python3 generate_mlbb_data.py --heroes 10        # generate 10 heroes
     python3 generate_mlbb_data.py --heroes all        # generate all listed
     python3 generate_mlbb_data.py --items 15          # generate 15 items
     python3 generate_mlbb_data.py --heroes 5 --items 5 # both

   Output goes to ./output/heroes.json and ./output/items.json
   (re-running merges into existing files instead of overwriting, so you
   can build the library up in small batches over multiple runs).

Each run only calls the API once per hero/item that isn't already in the
output file, so re-running is cheap — it just fills in whatever's missing.
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

# Edit these lists to control what gets generated. Add/remove names freely.
HERO_LIST = [
    "Fanny", "Granger", "Lancelot", "Angela", "Tigreal", "Gusion",
    "Chou", "Ling", "Kagura", "Esmeralda", "Lesley", "Karrie",
    "Khufra", "Mathilda", "Beatrix", "Yu Zhong", "Paquito", "Valentina",
    "Aldous", "Hayabusa", "Saber", "Layla", "Miya", "Alucard",
    "Zilong", "Fredrinn", "Joy", "Arlott", "Suyou", "Lukas",
]

ITEM_LIST = [
    "Blade of Despair", "Clock of Destiny", "Demon Hunter Sword",
    "Holy Crystal", "Berserker's Fury", "Wind of Nature",
    "Immortality", "Athena's Shield", "Antique Cuirass",
    "Brute Force Breastplate", "Genius Wand", "Lightning Truncheon",
    "Endless Battle", "Malefic Roar", "Windtalker",
    "Rose Gold Meteor", "Blade Armor", "Dominance Ice",
]

HERO_PROMPT = """You are writing ORIGINAL reference content (not copied from any wiki) \
for a mobile app's gaming info section, about the Mobile Legends: Bang Bang hero "{name}".

Respond with ONLY a JSON object (no markdown fences, no preamble), in this exact shape:
{{
  "name": "{name}",
  "role": "primary role/class, e.g. Assassin, Marksman, Tank, etc",
  "difficulty": "Easy | Medium | Hard",
  "summary": "2-3 sentence original summary of the hero's playstyle and identity",
  "strengths": ["short phrase", "short phrase", "short phrase"],
  "weaknesses": ["short phrase", "short phrase"],
  "counters": [
    {{"hero": "Counter hero name", "why": "one short sentence on why they counter {name}"}},
    {{"hero": "Counter hero name", "why": "one short sentence"}},
    {{"hero": "Counter hero name", "why": "one short sentence"}}
  ],
  "countered_by_tip": "one sentence general tip for playing against {name}",
  "best_build": [
    "Item name — short reason",
    "Item name — short reason",
    "Item name — short reason",
    "Item name — short reason",
    "Item name — short reason",
    "Item name — short reason"
  ],
  "build_notes": "1-2 sentence note on build flexibility/situational swaps"
}}

Keep all text concise and in your own words. Use your general knowledge of the hero's \
kit and current meta role — do not fabricate exact numeric stats you're unsure of, keep \
descriptions qualitative. Output strictly valid JSON, nothing else."""

ITEM_PROMPT = """You are writing ORIGINAL reference content (not copied from any wiki) \
for a mobile app's gaming info section, about the Mobile Legends: Bang Bang item "{name}".

Respond with ONLY a JSON object (no markdown fences, no preamble), in this exact shape:
{{
  "name": "{name}",
  "category": "Physical | Magic | Defense | Movement | Roaming, etc",
  "summary": "1-2 sentence original description of what the item does and its identity",
  "key_effects": ["short bullet of a key stat/passive", "short bullet", "short bullet"],
  "best_for": ["Hero role or 2-3 example heroes that benefit most"],
  "tip": "one sentence buying/timing tip"
}}

Keep all text concise, qualitative, and in your own words. Output strictly valid JSON, \
nothing else."""


def call_claude(prompt: str) -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: Set the ANTHROPIC_API_KEY environment variable first.", file=sys.stderr)
        sys.exit(1)

    body = json.dumps({
        "model": MODEL,
        "max_tokens": 1000,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                parts = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
                return "".join(parts).strip()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(5)
                continue
            print(f"API error {e.code}: {e.read().decode('utf-8')}", file=sys.stderr)
            raise
    raise RuntimeError("Failed after retries")


def parse_json_response(text: str, fallback_name: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    try:
        return json.loads(cleaned.strip())
    except json.JSONDecodeError:
        print(f"  WARN: couldn't parse JSON for {fallback_name}, skipping.", file=sys.stderr)
        return None


def load_existing(path: str) -> dict:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save(path: str, data: dict):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def generate_batch(names: list, prompt_template: str, out_path: str, label: str):
    existing = load_existing(out_path)
    todo = [n for n in names if n not in existing]

    if not todo:
        print(f"All requested {label} already present in {out_path}. Nothing to do.")
        return

    print(f"Generating {len(todo)} {label} (skipping {len(names) - len(todo)} already saved)...")
    for i, name in enumerate(todo, 1):
        print(f"  [{i}/{len(todo)}] {name} ...", end=" ", flush=True)
        prompt = prompt_template.format(name=name)
        try:
            raw = call_claude(prompt)
        except Exception as e:
            print(f"FAILED ({e})")
            continue
        parsed = parse_json_response(raw, name)
        if parsed is None:
            continue
        existing[name] = parsed
        save(out_path, existing)  # save incrementally so progress isn't lost
        print("done")
        time.sleep(0.5)  # small delay to be polite to rate limits

    print(f"Saved {len(existing)} total {label} to {out_path}")


def resolve_count(value: str, total: int) -> int:
    if value.lower() == "all":
        return total
    return min(int(value), total)


def main():
    parser = argparse.ArgumentParser(description="Generate original MLBB hero/item data via Claude API.")
    parser.add_argument("--heroes", help="Number of heroes to generate, or 'all'", default=None)
    parser.add_argument("--items", help="Number of items to generate, or 'all'", default=None)
    parser.add_argument("--heroes-file", help="Optional text file, one hero name per line, overrides built-in list")
    parser.add_argument("--items-file", help="Optional text file, one item name per line, overrides built-in list")
    args = parser.parse_args()

    if not args.heroes and not args.items:
        parser.print_help()
        sys.exit(0)

    heroes = HERO_LIST
    if args.heroes_file:
        with open(args.heroes_file) as f:
            heroes = [line.strip() for line in f if line.strip()]

    items = ITEM_LIST
    if args.items_file:
        with open(args.items_file) as f:
            items = [line.strip() for line in f if line.strip()]

    if args.heroes:
        n = resolve_count(args.heroes, len(heroes))
        generate_batch(heroes[:n], HERO_PROMPT, os.path.join(OUTPUT_DIR, "heroes.json"), "heroes")

    if args.items:
        n = resolve_count(args.items, len(items))
        generate_batch(items[:n], ITEM_PROMPT, os.path.join(OUTPUT_DIR, "items.json"), "items")


if __name__ == "__main__":
    main()
