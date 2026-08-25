# Memory photos

Drop your images here. Luna Buddy will slice them into puzzles automatically.

## Naming

| File | Used for |
|------|----------|
| `hero.jpg` | Default puzzle image (also set `VITE_PUZZLE_IMAGE=/photos/hero.jpg`) |
| `day-01.jpg` … `day-18.jpg` | One photo per daily memory (wired in `src/config/memories.ts`) |
| `birth-sky.jpg` | Optional overlay for star map reveal |

## Tips

- Square or portrait works — app crops to square center
- 800×800 px or larger recommended
- JPG/WebP under 500 KB for fast mobile load

After adding files, update `image` fields in `src/config/memories.ts`:

```ts
{ emoji: '🌙', title: 'First orbit', body: '...', image: '/photos/day-01.jpg' }
```
