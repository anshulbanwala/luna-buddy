import { useEffect, useState } from 'react'
import styles from './SleepingPiggy.module.css'

type PigState = 'drifting' | 'sleeping' | 'snoring'

const WHISPERS = ['z z z…', 'oink…', 'dreaming of stars', '…']

export function SleepingPiggy() {
  const [state, setState] = useState<PigState>('drifting')
  const [lane, setLane] = useState(25)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const [whisper, setWhisper] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const schedule = () => {
      const delay = 12000 + Math.random() * 18000
      return window.setTimeout(() => {
        setVisible(true)
        setLane(12 + Math.random() * 58)
        setDirection(Math.random() > 0.5 ? 'ltr' : 'rtl')
        setState(Math.random() > 0.35 ? 'drifting' : 'sleeping')
        if (Math.random() > 0.6) {
          setWhisper(WHISPERS[Math.floor(Math.random() * WHISPERS.length)])
          window.setTimeout(() => setWhisper(null), 2400)
        }
      }, delay)
    }

    let id = schedule()
    const onEnd = () => {
      setVisible(false)
      window.clearTimeout(id)
      id = schedule()
    }

    const el = document.getElementById('sleeping-piggy')
    el?.addEventListener('animationend', onEnd)
    return () => {
      window.clearTimeout(id)
      el?.removeEventListener('animationend', onEnd)
    }
  }, [visible, direction, lane])

  if (!visible) return null

  return (
    <div
      id="sleeping-piggy"
      className={`${styles.piggy} ${styles[direction]} ${styles[state]}`}
      style={{ top: `${lane}%` }}
      aria-hidden
    >
      {whisper && <span className={styles.whisper}>{whisper}</span>}
      <div className={styles.body}>
        <div className={styles.ear} />
        <div className={styles.ear} />
        <div className={styles.face}>
          <span className={styles.eye} />
          <span className={styles.eye} />
          <span className={styles.snout}>
            <span className={styles.nostril} />
            <span className={styles.nostril} />
          </span>
        </div>
        <div className={styles.blanket} />
        {state === 'snoring' && <span className={styles.zzz}>z</span>}
      </div>
    </div>
  )
}
