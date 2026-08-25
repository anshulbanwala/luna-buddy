import { useEffect, useState } from 'react'
import { getTemporalState } from '../core/time/TemporalEvent'
import type { TemporalState } from '../core/time/types'

export function useTemporalEvent(intervalMs = 1000): TemporalState {
  const [state, setState] = useState<TemporalState>(getTemporalState)

  useEffect(() => {
    const id = setInterval(() => setState(getTemporalState()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return state
}
