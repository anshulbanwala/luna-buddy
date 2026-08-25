# Luna Buddy

A standalone personal gift — Luna companion, live countdown to 12 September 2026, birth star maps from Najafgarh, daily memory puzzle, and moon phases.

Separate from Orbital Archive so you can share this first.

## Quick start

```bash
cd luna-buddy
cp .env.example .env   # edit names, memories, star dates
npm install
npm run dev            # http://localhost:5180
```

## Features

- **Luna** — tap, double-tap hearts, long-press hug
- **Live countdown** — days, hours, minutes, seconds until 12 Sep 2026
- **Star map** — sky over Najafgarh on birth night (12 Sep 1991) and any year since; constellations, planets, moon
- **Day facts** — why each September 12 was special + moon phase that night
- **Memory puzzle** — daily unlocked memories + 3×3 sliding puzzle to reveal today's
- **Orbital age** — years and days since birth

## Config

Edit `.env` (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `VITE_SUBJECT_NAME` | Recipient name |
| `VITE_BIRTH_*` | Birth date, time, Najafgarh coordinates |
| `VITE_STAR_DATES` | Preset star-map moments (`date\|label,...`) |
| `VITE_MEMORY_START` | First day daily memories unlock |
| `VITE_TARGET_*` | Countdown destination (default 12 Sep 2026) |

Memories: edit `src/config/memories.ts`

## Preview mode

Open `?preview` or tap **Preview** to see all puzzle states, Luna reactions, and widget mockups.

## Photo puzzles

On the Memories tab, tap **Upload your photo** — any image is cropped square and sliced into 8 tiles. Or set `VITE_PUZZLE_IMAGE` in `.env`.

## Deploy

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or any static host
```

Works on mobile web and desktop. Add to home screen for a widget-like feel.

## Integrate elsewhere

This repo is standalone. To embed in another project:

```bash
npm install github:anshulbanwala/luna-buddy
# or clone and copy dist/ after build
```

Or link from Orbital Archive via iframe / separate Vercel deploy.

## Dev preview

Append `?preview` to open the full gallery (puzzles, reactions, widgets).
