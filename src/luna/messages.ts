import { getLunarState } from '../utils/lunar'

export function getGreeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good morning ☀️'
  if (hour >= 12 && hour < 17) return 'Hello, sunshine'
  if (hour >= 17 && hour < 21) return 'Good evening 🌙'
  return 'Sweet dreams ahead'
}

export function getCountdownMessage(days: number, isReached: boolean): string {
  if (isReached) return 'I can barely contain myself!'
  if (days === 0) return 'I barely slept.'
  if (days === 1) return 'Tomorrow feels magical.'
  if (days <= 5) return 'So close!'
  if (days <= 10) return "I can't keep the secret much longer."
  if (days <= 20) return "I've been preparing something."
  if (days <= 30) return 'Something wonderful is getting closer.'
  return "We've just begun."
}

export function formatCountdown(days: number, hours: number, minutes: number, isReached: boolean): string {
  if (isReached) return 'Today is the day!'
  if (days > 0) return `${days} little moons left`
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m left`
  return `${minutes}m left`
}

const morning = [
  'The morning belongs to you.',
  'You are softer than sunrise.',
  'I woke up thinking of you.',
  'Today holds something gentle for you.',
  'Your light is already showing.',
]

const afternoon = [
  'You are doing beautifully.',
  'Pause — breathe — you are enough.',
  'The afternoon sun agrees: you shine.',
  'Somewhere, the stars are cheering.',
]

const evening = [
  'Look outside — the sky is for you.',
  'The moon rose just to see you.',
  'Evening feels like a love letter.',
  'Let the day soften around you.',
]

const night = [
  'Rest, my favorite soul.',
  'The moon is keeping watch tonight.',
  'Dream of warm, golden things.',
  'Close your eyes — I am still here.',
]

const weekend = [
  'Slow down — the world can wait.',
  "Dance like the stars can't look away.",
  'Weekends are for soft hearts.',
]

export function getDailyMessage(date = new Date()): string {
  const lunar = getLunarState(date)
  if (lunar.phase === 'Full Moon') return "Today's moon is smiling."

  const day = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const hour = date.getHours()
  const seed = day * 7 + hour * 3
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  const pool = isWeekend
    ? weekend
    : hour < 12
      ? morning
      : hour < 17
        ? afternoon
        : hour < 21
          ? evening
          : night

  return pool[seed % pool.length]
}

export function isLoveMode(date = new Date()): boolean {
  const day = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return (day * 31) % 1000 / 1000 < 0.22
}
