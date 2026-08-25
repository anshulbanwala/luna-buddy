const SYNODIC_MONTH = 29.530588853

export type LunarPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

export interface LunarState {
  phase: LunarPhaseName
  illumination: number
  age: number
  nextPhase: LunarPhaseName
  moonAngle: number
  earthRotation: number
}

function getPhaseName(angle: number): LunarPhaseName {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  const deg = (normalized / (Math.PI * 2)) * 360

  if (deg < 22.5 || deg >= 337.5) return 'New Moon'
  if (deg < 67.5) return 'Waxing Crescent'
  if (deg < 112.5) return 'First Quarter'
  if (deg < 157.5) return 'Waxing Gibbous'
  if (deg < 202.5) return 'Full Moon'
  if (deg < 247.5) return 'Waning Gibbous'
  if (deg < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}

function getNextPhase(current: LunarPhaseName): LunarPhaseName {
  const phases: LunarPhaseName[] = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ]
  const idx = phases.indexOf(current)
  return phases[(idx + 1) % phases.length]
}

export function getLunarState(date: Date = new Date()): LunarState {
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime()
  const ms = date.getTime() - knownNewMoon
  const age = ((ms / 86400000) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH
  const moonAngle = (age / SYNODIC_MONTH) * Math.PI * 2
  const illumination = (1 - Math.cos(moonAngle)) / 2

  const phase = getPhaseName(moonAngle)
  const hours = date.getHours() + date.getMinutes() / 60
  const earthRotation = (hours / 24) * Math.PI * 2

  return {
    phase,
    illumination: Math.round(illumination * 1000) / 10,
    age: Math.round(age * 10) / 10,
    nextPhase: getNextPhase(phase),
    moonAngle,
    earthRotation,
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
