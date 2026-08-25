# Luna Buddy — design research

References gathered for reimagining look, feel, and mechanics.

## Ambient characters (piggy + friends)

| Project | What to borrow | Link |
|---------|----------------|------|
| [YourTomo](https://github.com/prsdx/YourTomo) | State machine: sleeping, zoomies, content, hungry — time + activity driven | GitHub |
| [Nomlings badge](https://github.com/Nomlings/badge) | Pixel pets with mood states (sleeping after quiet week) | GitHub |
| [Browser-Buddy](https://github.com/sachsom95/Browser-Buddy) | Sprite walk/idle/play, follows cursor, random idle actions | GitHub |
| [Claude readme mascot](https://github.com/blackscythe123/claude-readme-mascot) | Live status SVG, nap vs active | GitHub |

**Luna direction:** Piggy drifts across viewport in random lanes with states (sleep, snore, wave, peek). Tap triggers reaction. Phase 2: add Luna moon blob + star companion as second wanderer.

## Star maps

| Project | What to borrow | Link |
|---------|----------------|------|
| [d3-celestial](https://github.com/ofrohn/d3-celestial) | Constellation lines, labels, Milky Way band, zoom/rotate | GitHub |
| [GitPulse](https://github.com/rahulagarwal18/gitpulse) | Particle connections, glass panels, cinematic story sections | GitHub |
| [my-constellation-bg](https://github.com/anupamraj176/my-constellation-bg) | Aurora themes, meteor clicks, star clusters | npm |

**Luna direction:** Canvas sky with labeled constellations, hover star cards, birth-vs-today compare, horizon glow. Phase 3: optional d3-celestial embed for print-quality maps.

## Puzzles (beyond sliding blocks)

| Project | Mode | Link |
|---------|------|------|
| [Snap Puzzle](https://github.com/masabqurban/Snap-Puzzle-Game) | Photo upload + tile snap | GitHub |
| [ImageJigsawApp](https://github.com/tituslhy/ImageJigsawApp) | Bezier jigsaw pieces, cluster snap | GitHub |
| [SELFIE-SHUFFLE](https://github.com/thechampgit/SELFIE-SHUFFLE) | Drag-and-swap grid, difficulty levels | GitHub |
| [memory-game](https://github.com/scottdreinhart/memory-game) | Flip-card concentration pairs | GitHub |

**Luna direction:** Three modes — **Orbit Slide** (classic), **Star Swap** (tap two tiles to swap — best for photos), **Constellation Match** (flip pairs tied to daily memories). Phase 4: true jigsaw curves.

## UI / “Webflow feel”

| Project | What to borrow | Link |
|---------|----------------|------|
| [Lumine](https://github.com/Cl0ud-9/Lumine) | Glassmorphism, parallax, Framer Motion celebrations | GitHub |
| [JustBeMyValentine](https://github.com/VoxHash/JustBeMyValentine) | Frosted panels, particle bg, theme presets | GitHub |
| [Celestia UI](https://github.com/jasl/celestia-ui) | Violet/pink gradients, floating orbs, motion | GitHub |
| Glassmorphism best practices | 10–30% opacity, vibrant gradient behind glass, depth via blur | UX Pilot |

**Luna direction:** Floating orbs, glass cards, tab cross-fades, Inter + italic accents, photo drop folder in `public/photos/`.

## Photo assets

Drop images in `public/photos/` — see `public/photos/README.md`. Name as `day-01.jpg` … `day-18.jpg` or set per-memory in `src/config/memories.ts`.
