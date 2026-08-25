import { TEMPORAL_EVENT } from '../../config/personal'
import type { TemporalPhase, TemporalState, TimeRemaining } from './types'

let devTimeOverride: number | null = null

export function setDevTimeOverride(timestamp: number | null): void {
  if (!import.meta.env.DEV) return
  devTimeOverride = timestamp
}

function getTargetTimestamp(): number {
  const { YEAR, MONTH, DAY, HOUR, MINUTE, SECOND } = TEMPORAL_EVENT
  return new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE, SECOND).getTime()
}

function now(): number {
  if (import.meta.env.DEV && devTimeOverride !== null) return devTimeOverride
  return Date.now()
}

function computeRemaining(targetMs: number, currentMs: number): TimeRemaining {
  const totalMs = Math.max(0, targetMs - currentMs)
  const seconds = Math.floor(totalMs / 1000)
  return {
    totalMs,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

function computePhase(totalMs: number, isReached: boolean): TemporalPhase {
  if (isReached) return 'reached'
  const hours = totalMs / (1000 * 60 * 60)
  if (hours <= 1 / 60) return 'final-1m'
  if (hours <= 10 / 60) return 'final-10m'
  if (hours <= 1) return 'final-1h'
  if (hours <= 6) return 'final-6h'
  if (hours <= 24) return 'final-24h'
  if (hours <= 168) return 'approaching'
  return 'distant'
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatRemaining(r: TimeRemaining, long = false): string {
  if (long) {
    return `${r.days}d ${pad(r.hours)}h ${pad(r.minutes)}m ${pad(r.seconds)}s`
  }
  if (r.days > 0) {
    return `${r.days}d ${pad(r.hours)}:${pad(r.minutes)}:${pad(r.seconds)}`
  }
  return `${pad(r.hours)}:${pad(r.minutes)}:${pad(r.seconds)}`
}

export function getTemporalState(): TemporalState {
  const targetMs = getTargetTimestamp()
  const currentMs = now()
  const isReached = currentMs >= targetMs
  const remaining = computeRemaining(targetMs, currentMs)
  const phase = computePhase(remaining.totalMs, isReached)

  return {
    remaining,
    phase,
    isReached,
    formatted: isReached ? 'Today is the day' : formatRemaining(remaining),
    formattedLong: isReached ? 'Today is the day' : formatRemaining(remaining, true),
  }
}

export { getTargetTimestamp }
