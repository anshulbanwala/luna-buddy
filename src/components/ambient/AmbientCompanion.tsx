import { useCallback, useEffect, useState } from 'react'
import styles from './AmbientCompanion.module.css'

type CompanionState = 'sleeping' | 'drifting' | 'snoring' | 'wave' | 'peek' | 'balloon'

const WHISPERS: Record<CompanionState, string[]> = {
  sleeping: ['z z z…', 'dreaming of chai', '…'],
  drifting: ['oink…', 'just passing through', '✦'],
  snoring: ['Z Z Z', 'snore…'],
  wave: ['hi!', 'oink hi!', '👋'],
  peek: ['…👀', 'boo'],
  balloon: ['up we go', '☁️'],
}

const STATE_WEIGHTS: CompanionState[] = [
  'drifting', 'drifting', 'sleeping', 'sleeping', 'snoring', 'wave', 'peek', 'balloon',
]

function pickState(): CompanionState {
  return STATE_WEIGHTS[Math.floor(Math.random() * STATE_WEIGHTS.length)]
}

export function AmbientCompanion() {
  const [state, setState] = useState<CompanionState>('drifting')
  const [lane, setLane] = useState(30)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const [whisper, setWhisper] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [bounce, setBounce] = useState(false)

  const launch = useCallback(() => {
    const next = pickState()
    setVisible(true)
    setLane(10 + Math.random() * 62)
    setDirection(Math.random() > 0.5 ? 'ltr' : 'rtl')
    setState(next)
    const lines = WHISPERS[next]
    if (Math.random() > 0.45) {
      setWhisper(lines[Math.floor(Math.random() * lines.length)])
      window.setTimeout(() => setWhisper(null), 2800)
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const initial = window.setTimeout(launch, 4000)
    const interval = window.setInterval(() => {
      if (!visible) launch()
    }, 16000 + Math.random() * 12000)

    return () => {
      window.clearTimeout(initial)
      window.clearInterval(interval)
    }
  }, [launch, visible])

  const onAnimEnd = () => {
    setVisible(false)
  }

  const onTap = () => {
    setBounce(true)
    setState('wave')
    setWhisper('you found me! ♥')
    window.setTimeout(() => {
      setBounce(false)
      setWhisper(null)
    }, 2000)
  }

  if (!visible) return null

  return (
    <button
      type="button"
      className={`${styles.companion} ${styles[direction]} ${styles[state]} ${bounce ? styles.bounce : ''}`}
      style={{ top: `${lane}%` }}
      onAnimationEnd={onAnimEnd}
      onClick={onTap}
      aria-label="Sleeping piggy companion"
    >
      {whisper && <span className={styles.whisper}>{whisper}</span>}
      {state === 'balloon' && <span className={styles.balloonString} />}
      <div className={styles.body}>
        <div className={styles.ear} />
        <div className={styles.ear} />
        <div className={styles.face}>
          <span className={`${styles.eye} ${state === 'peek' ? styles.eyeOpen : ''}`} />
          <span className={`${styles.eye} ${state === 'peek' ? styles.eyeOpen : ''}`} />
          <span className={styles.snout}>
            <span className={styles.nostril} />
            <span className={styles.nostril} />
          </span>
          {state === 'wave' && <span className={styles.waveHand}>🐾</span>}
        </div>
        <div className={styles.blanket} />
        {(state === 'snoring' || state === 'sleeping') && (
          <span className={styles.zzz}>z</span>
        )}
      </div>
    </button>
  )
}
