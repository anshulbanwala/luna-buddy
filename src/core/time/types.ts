export type TemporalPhase =
  | 'distant'
  | 'approaching'
  | 'final-24h'
  | 'final-6h'
  | 'final-1h'
  | 'final-10m'
  | 'final-1m'
  | 'reached'

export interface TimeRemaining {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface TemporalState {
  remaining: TimeRemaining
  phase: TemporalPhase
  isReached: boolean
  formatted: string
  formattedLong: string
}
