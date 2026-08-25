import { getLunarState } from '../utils/lunar'

export interface DayFact {
  headline: string
  facts: string[]
  moonPhase: string
  moonGlow: number
}

const STATIC_FACTS: Record<number, string[]> = {
  1991: [
    'USSR formally dissolved — a world order ending as yours began.',
    'Linux kernel first released — open-source stars aligning.',
    'World Wide Web opened to the public — the internet learned to breathe.',
    'India economic reforms reshaped a generation\'s horizons.',
  ],
  2001: [
    'The world changed in September — you had already turned ten, steady as a fixed star.',
    'India won the Test series vs. England at The Oval.',
    'Wikipedia launched — collective memory found a new orbit.',
  ],
  2011: [
    'India won the Cricket World Cup — streets erupted like a meteor shower.',
    'The last Space Shuttle mission landed.',
    'Your twentieth orbit around the Sun — two full decades of gravity.',
  ],
  2016: [
    'India\'s demonetization reshaped everyday life overnight.',
    'Gravitational waves detected for the first time — ripples in spacetime confirmed.',
    'Your silver orbit — twenty-five years under the same September sky.',
  ],
  2020: [
    'The world paused — yet the sky kept turning, indifferent and faithful.',
    'Monsoon arrived late over Delhi NCR; Najafgarh fields held their breath.',
    'A quiet birthday, maybe the last before everything changes.',
  ],
  2024: [
    'Chandrayaan-3 made India the first to land near the lunar south pole.',
    'A year before the reveal — Luna was already preparing.',
  ],
  2026: [
    'Thirty-five orbits complete. The countdown ends. The sky opens.',
    'Everything hidden becomes visible — star maps, memories, and more.',
  ],
}

export function getSeptember12Facts(year: number): DayFact {
  const date = new Date(year, 8, 12, 22, 0, 0)
  const lunar = getLunarState(date)
  const facts = STATIC_FACTS[year] ?? [
    `On this September 12, the moon was ${lunar.phase.toLowerCase()} — ${lunar.illumination}% illuminated.`,
    `From Najafgarh, the ecliptic arced ${year > 2000 ? 'high' : 'gracefully'} through the evening sky.`,
    `${year - 1991} orbits since a certain birth — each one worth remembering.`,
  ]

  const headlines: Record<number, string> = {
    1991: 'The night you arrived',
    2026: 'The day everything opens',
  }

  return {
    headline: headlines[year] ?? `September 12, ${year}`,
    facts,
    moonPhase: lunar.phase,
    moonGlow: lunar.illumination,
  }
}

export function getBirthYearRange(birthYear: number, targetYear: number): number[] {
  const years: number[] = []
  for (let y = birthYear; y <= targetYear; y++) years.push(y)
  return years
}
