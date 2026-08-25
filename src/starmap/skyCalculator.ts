import { Body, Equator, Horizon, Observer } from 'astronomy-engine'
import { CATALOG_STARS, CONSTELLATION_LINES, STAR_BY_ID, type CatalogStar } from './brightStars'

export interface SkyPoint {
  id: string
  name: string
  x: number
  y: number
  altitude: number
  azimuth: number
  magnitude: number
  constellation: string
  kind: 'star' | 'planet' | 'moon'
}

export interface ConstellationLine {
  name: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface SkySnapshot {
  stars: SkyPoint[]
  lines: ConstellationLine[]
  planets: SkyPoint[]
  moon: SkyPoint | null
  meta: {
    date: Date
    latitude: number
    longitude: number
    place: string
    visibleCount: number
  }
}

const PLANETS: { body: Body; label: string }[] = [
  { body: Body.Mercury, label: 'Mercury' },
  { body: Body.Venus, label: 'Venus' },
  { body: Body.Mars, label: 'Mars' },
  { body: Body.Jupiter, label: 'Jupiter' },
  { body: Body.Saturn, label: 'Saturn' },
]

function starSize(mag: number): number {
  return Math.max(0.8, 4.2 - mag * 0.85)
}

function project(alt: number, az: number, radius: number): { x: number; y: number } | null {
  if (alt < 5) return null
  const r = ((90 - alt) / 90) * radius
  const azRad = (az * Math.PI) / 180
  return {
    x: r * Math.sin(azRad),
    y: -r * Math.cos(azRad),
  }
}

function computeStarPoint(
  star: CatalogStar,
  date: Date,
  observer: Observer,
  radius: number,
): SkyPoint | null {
  const hor = Horizon(date, observer, star.ra, star.dec, 'normal')
  const pos = project(hor.altitude, hor.azimuth, radius)
  if (!pos) return null
  return {
    id: star.id,
    name: star.name,
    x: pos.x,
    y: pos.y,
    altitude: hor.altitude,
    azimuth: hor.azimuth,
    magnitude: star.mag,
    constellation: star.constellation,
    kind: 'star',
  }
}

function computeBodyPoint(
  body: Body,
  label: string,
  date: Date,
  observer: Observer,
  radius: number,
  kind: 'planet' | 'moon',
): SkyPoint | null {
  const equ = Equator(body, date, observer, true, true)
  const hor = Horizon(date, observer, equ.ra, equ.dec, 'normal')
  const pos = project(hor.altitude, hor.azimuth, radius)
  if (!pos) return null
  return {
    id: label,
    name: label,
    x: pos.x,
    y: pos.y,
    altitude: hor.altitude,
    azimuth: hor.azimuth,
    magnitude: kind === 'moon' ? -2 : 0,
    constellation: '',
    kind,
  }
}

export function computeSkySnapshot(
  date: Date,
  latitude: number,
  longitude: number,
  place: string,
  canvasRadius = 180,
): SkySnapshot {
  const observer = new Observer(latitude, longitude, 220)
  const starMap = new Map<string, SkyPoint>()

  for (const star of CATALOG_STARS) {
    const pt = computeStarPoint(star, date, observer, canvasRadius)
    if (pt) starMap.set(star.id, pt)
  }

  const lines: ConstellationLine[] = []
  for (const group of CONSTELLATION_LINES) {
    for (const [a, b] of group.pairs) {
      const sa = starMap.get(a)
      const sb = starMap.get(b)
      if (sa && sb) {
        lines.push({ name: group.name, x1: sa.x, y1: sa.y, x2: sb.x, y2: sb.y })
      }
    }
  }

  const planets = PLANETS.map(({ body, label }) =>
    computeBodyPoint(body, label, date, observer, canvasRadius, 'planet'),
  ).filter((p): p is SkyPoint => p !== null)

  const moon = computeBodyPoint(Body.Moon, 'Moon', date, observer, canvasRadius, 'moon')

  return {
    stars: [...starMap.values()].sort((a, b) => a.magnitude - b.magnitude),
    lines,
    planets,
    moon,
    meta: {
      date,
      latitude,
      longitude,
      place,
      visibleCount: starMap.size,
    },
  }
}

export function getConstellationHighlights(snapshot: SkySnapshot): string[] {
  const counts = new Map<string, number>()
  for (const star of snapshot.stars) {
    counts.set(star.constellation, (counts.get(star.constellation) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)
}

export { starSize, STAR_BY_ID }
