/**
 * Personal configuration — edit .env or this file before gifting.
 * Birth: 12 September 1991, 10:35 PM, Najafgarh, Haryana
 */

function env(key: keyof ImportMetaEnv, fallback: string): string {
  return import.meta.env[key] ?? fallback
}

function envNum(key: keyof ImportMetaEnv, fallback: number): number {
  const raw = import.meta.env[key]
  if (raw === undefined || raw === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

export const PERSONAL = {
  NAME: env('VITE_SUBJECT_NAME', 'Arpind'),
  BIRTH_DATE: env('VITE_BIRTH_DATE', '1991-09-12'),
  BIRTH_TIME: env('VITE_BIRTH_TIME', '22:35'),
  BIRTH_LAT: envNum('VITE_BIRTH_LAT', 28.6092),
  BIRTH_LON: envNum('VITE_BIRTH_LON', 77.0429),
  BIRTH_PLACE: env('VITE_BIRTH_PLACE', 'Najafgarh, Haryana'),
  FINAL_MESSAGE: env(
    'VITE_FINAL_MESSAGE',
    'Some distances cannot be measured in light-years. They are measured in moments shared, in orbits completed together.',
  ),
} as const

export const TEMPORAL_EVENT = {
  YEAR: envNum('VITE_TARGET_YEAR', 2026),
  MONTH: envNum('VITE_TARGET_MONTH', 9),
  DAY: envNum('VITE_TARGET_DAY', 12),
  HOUR: 0,
  MINUTE: 0,
  SECOND: 0,
} as const

export const BIRTH_YEAR = 1991
export const TARGET_YEAR = TEMPORAL_EVENT.YEAR
export const SEPTEMBER_DAY = 12

export const MEMORY_START = env('VITE_MEMORY_START', '2026-01-01')

export interface StarDateEntry {
  date: string
  label: string
}

export function parseStarDates(raw: string | undefined): StarDateEntry[] {
  const source =
    raw ??
    '1991-09-12|The night you arrived — 10:35 PM,2016-09-12|Twenty-five trips around the sun,2020-09-12|A quiet terrace birthday,2024-09-12|One more solo orbit,2026-09-12|The sky opens everything'

  return source.split(',').map((entry) => {
    const [date, ...labelParts] = entry.trim().split('|')
    return { date: date.trim(), label: labelParts.join('|').trim() || date.trim() }
  })
}

export const STAR_DATES = parseStarDates(import.meta.env.VITE_STAR_DATES)

export function parseBirthDateTime(year?: number): Date {
  const [y, m, d] = PERSONAL.BIRTH_DATE.split('-').map(Number)
  const [hh, mm] = PERSONAL.BIRTH_TIME.split(':').map(Number)
  return new Date(year ?? y, m - 1, d, hh, mm, 0)
}

export function formatBirthTime(): string {
  const [hh, mm] = PERSONAL.BIRTH_TIME.split(':').map(Number)
  const d = new Date(2000, 0, 1, hh, mm)
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function getOrbitalAge(now = new Date()): { years: number; days: number; totalDays: number } {
  const birth = parseBirthDateTime()
  const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000)
  const years = Math.floor(totalDays / 365.25)
  const days = Math.floor(totalDays - years * 365.25)
  return { years, days, totalDays }
}
