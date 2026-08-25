import { useCallback, useEffect, useState } from 'react'
import { DRIFT_WHISPERS, MOOCHI_REACTIONS } from '../../luna/companionVoices'
import styles from './MochiWorld.module.css'

type DriftState = 'sleeping' | 'drifting' | 'snoring' | 'wave' | 'peek' | 'balloon' | 'spin'

const DRIFT_STATES: DriftState[] = [
  'drifting', 'drifting', 'sleeping', 'snoring', 'wave', 'peek', 'balloon', 'spin',
]

/** Persistent corner buddy on home — tap for reaction chain */
export function MochiCorner({ visible }: { visible: boolean }) {
  const [boops, setBoops] = useState(0)
  const [reaction, setReaction] = useState<(typeof MOOCHI_REACTIONS)[number] | null>(null)
  const [wiggle, setWiggle] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  const boop = () => {
    const next = (boops + 1) % MOOCHI_REACTIONS.length
    setBoops(next)
    setReaction(MOOCHI_REACTIONS[next])
    setWiggle(true)
    const id = Date.now()
    setSparkles((s) => [...s.slice(-4), { id, x: 20 + Math.random() * 40, y: Math.random() * 30 }])
    window.setTimeout(() => setWiggle(false), 500)
    window.setTimeout(() => setReaction(null), 3200)
  }

  if (!visible) return null

  return (
    <div className={styles.corner}>
      {reaction && (
        <div className={styles.bubble}>
          <span>{reaction.emoji}</span>
          {reaction.line}
        </div>
      )}
      {sparkles.map((s) => (
        <span key={s.id} className={styles.sparkle} style={{ left: s.x, top: s.y }}>
          ✦
        </span>
      ))}
      <button type="button" className={`${styles.mochi} ${wiggle ? styles.wiggle : ''}`} onClick={boop} aria-label="Mochi the piggy">
        <PigBody state="idle" />
        <span className={styles.cornerTag}>Mochi</span>
      </button>
    </div>
  )
}

/** Random sky visitor — crosses the screen */
export function MochiDrifter() {
  const [state, setState] = useState<DriftState>('drifting')
  const [lane, setLane] = useState(30)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const [whisper, setWhisper] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const launch = useCallback(() => {
    setVisible(true)
    setLane(8 + Math.random() * 70)
    setDirection(Math.random() > 0.5 ? 'ltr' : 'rtl')
    setState(DRIFT_STATES[Math.floor(Math.random() * DRIFT_STATES.length)])
    if (Math.random() > 0.4) {
      setWhisper(DRIFT_WHISPERS[Math.floor(Math.random() * DRIFT_WHISPERS.length)])
      window.setTimeout(() => setWhisper(null), 2600)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t0 = window.setTimeout(launch, 6000)
    const interval = window.setInterval(() => {
      if (!visible) launch()
    }, 14000 + Math.random() * 10000)
    return () => {
      window.clearTimeout(t0)
      window.clearInterval(interval)
    }
  }, [launch, visible])

  if (!visible) return null

  return (
    <button
      type="button"
      className={`${styles.drifter} ${styles[direction]} ${styles[`drift_${state}`]}`}
      style={{ top: `${lane}%` }}
      onAnimationEnd={() => setVisible(false)}
      onClick={(e) => {
        e.stopPropagation()
        setWhisper('caught me! ♥')
        setState('wave')
      }}
      aria-label="Mochi drifting by"
    >
      {whisper && <span className={styles.driftWhisper}>{whisper}</span>}
      <PigBody state={state === 'spin' ? 'spin' : state === 'sleeping' || state === 'snoring' ? 'sleep' : 'drift'} />
    </button>
  )
}

function PigBody({ state }: { state: 'idle' | 'sleep' | 'drift' | 'spin' }) {
  return (
    <div className={`${styles.body} ${styles[`body_${state}`]}`}>
      <div className={styles.cheek} />
      <div className={styles.cheek} />
      <div className={styles.ear} />
      <div className={styles.ear} />
      <div className={styles.face}>
        <span className={`${styles.eye} ${state === 'sleep' ? styles.eyeSleep : ''}`} />
        <span className={`${styles.eye} ${state === 'sleep' ? styles.eyeSleep : ''}`} />
        <span className={styles.snout}>
          <span className={styles.nostril} />
          <span className={styles.nostril} />
        </span>
        {state === 'spin' && <span className={styles.spinStar}>✦</span>}
      </div>
      <div className={styles.blanket} />
      {state === 'sleep' && <span className={styles.zzz}>z z z</span>}
    </div>
  )
}

export function AmbientCompanion({ showCorner }: { showCorner?: boolean }) {
  return (
    <>
      <MochiDrifter />
      <MochiCorner visible={!!showCorner} />
    </>
  )
}
