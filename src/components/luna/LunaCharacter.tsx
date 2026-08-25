import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import type { LunaReaction } from '../../luna/reactions'
import styles from './LunaCharacter.module.css'

interface LunaCharacterProps {
  loveMode?: boolean
  size?: number
  onReaction?: (reaction: LunaReaction) => void
}

export interface LunaCharacterHandle {
  play: (reaction: LunaReaction) => void
}

interface Particle {
  id: number
  x: number
  y: number
  type: 'heart' | 'sparkle' | 'star'
  angle: number
}

export const LunaCharacter = forwardRef<LunaCharacterHandle, LunaCharacterProps>(
  function LunaCharacter({ loveMode = false, size = 100, onReaction }, ref) {
    const [eyesOpen, setEyesOpen] = useState(true)
    const [happy, setHappy] = useState(false)
    const [reaction, setReaction] = useState<LunaReaction>('idle')
    const [particles, setParticles] = useState<Particle[]>([])
    const [pressing, setPressing] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    const lastTap = useRef(0)
    const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const particleId = useRef(0)
    const didLongPress = useRef(false)

    useEffect(() => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }, [])

    useEffect(() => {
      if (reducedMotion) return
      const blink = setInterval(() => {
        setEyesOpen(false)
        setTimeout(() => setEyesOpen(true), 100)
      }, 3800)
      return () => clearInterval(blink)
    }, [reducedMotion])

    const spawnParticles = useCallback((type: Particle['type'], count: number, upward = false) => {
      const next: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: particleId.current++,
        x: (Math.random() - 0.5) * size * 0.25,
        y: upward ? size * 0.05 : (Math.random() - 0.5) * size * 0.15,
        type,
        angle: upward
          ? 200 + (i / count) * 140 + Math.random() * 20
          : (i / count) * 360 + Math.random() * 30,
      }))
      setParticles((prev) => [...prev, ...next])
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !next.find((n) => n.id === p.id)))
      }, 1400)
    }, [size])

    const triggerReaction = useCallback((r: LunaReaction) => {
      setReaction(r)
      onReaction?.(r)

      if (r === 'tap' || r === 'spin') {
        setHappy(true)
        spawnParticles('sparkle', 6, true)
        setTimeout(() => setHappy(false), 600)
      }
      if (r === 'hearts' || r === 'kiss') {
        setHappy(true)
        spawnParticles('heart', 10, true)
        spawnParticles('star', 4, true)
      }
      if (r === 'hug') {
        spawnParticles('heart', 6, true)
      }

      const duration = r === 'hearts' || r === 'kiss' ? 1600 : r === 'hug' ? 2000 : r === 'spin' ? 700 : 500
      setTimeout(() => setReaction('idle'), duration)
    }, [onReaction, spawnParticles])

    useImperativeHandle(ref, () => ({
      play: triggerReaction,
    }), [triggerReaction])

    const onSingleTap = useCallback(() => {
      const rolls = loveMode ? ['tap', 'tap', 'kiss', 'spin'] : ['tap', 'tap', 'spin']
      const pick = rolls[Math.floor(Math.random() * rolls.length)] as LunaReaction
      triggerReaction(pick)
    }, [loveMode, triggerReaction])

    const onDoubleTap = useCallback(() => {
      triggerReaction('hearts')
    }, [triggerReaction])

    const onLongPress = useCallback(() => {
      didLongPress.current = true
      triggerReaction('hug')
    }, [triggerReaction])

    const clearTapTimer = () => {
      if (tapTimer.current) {
        clearTimeout(tapTimer.current)
        tapTimer.current = null
      }
    }

    const handlePointerDown = (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      setPressing(true)
      didLongPress.current = false
      longPressTimer.current = setTimeout(onLongPress, 520)
    }

    const handlePointerUp = () => {
      setPressing(false)
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      if (didLongPress.current) return

      const now = Date.now()
      if (now - lastTap.current < 340) {
        clearTapTimer()
        lastTap.current = 0
        onDoubleTap()
        return
      }

      lastTap.current = now
      clearTapTimer()
      tapTimer.current = setTimeout(() => {
        onSingleTap()
        tapTimer.current = null
      }, 340)
    }

    const handlePointerCancel = () => {
      setPressing(false)
      clearTapTimer()
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    return (
      <div
        className={`${styles.stage} ${loveMode ? styles.loveStage : ''}`}
        style={{ width: size * 1.5, height: size * 1.35 }}
      >
        <div className={styles.halo} style={{ width: size * 1.35, height: size * 1.35 }} />
        <div className={`${styles.haloInner} ${loveMode ? styles.haloLove : ''}`} style={{ width: size * 1.1, height: size * 1.1 }} />

        <button
          type="button"
          className={`${styles.wrapper} ${styles[reaction]} ${pressing ? styles.pressing : ''}`}
          style={{ width: size, height: size * 1.2 }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
          aria-label="Luna — tap, double-tap, or hold"
        >
          <div className={styles.shadow} style={{ width: size * 0.65, height: size * 0.1 }} />

          <div className={`${styles.floatLayer} ${reducedMotion ? '' : styles.float}`}>
            <div className={styles.body} style={{ width: size, height: size }}>
              <div className={styles.moon}>
                <div className={styles.moonSheen} />
                <div className={styles.moonCrater} />
                <div className={styles.moonCrater2} />
              </div>

              <div className={styles.blush} style={{ gap: size * 0.36 }}>
                <span className={styles.blushDot} style={{ width: size * 0.13, height: size * 0.09 }} />
                <span className={styles.blushDot} style={{ width: size * 0.13, height: size * 0.09 }} />
              </div>

              <div className={styles.eyes} style={{ gap: size * 0.17 }}>
                <span
                  className={`${styles.eye} ${happy ? styles.eyeHappy : ''}`}
                  style={{ width: size * 0.09, height: eyesOpen ? (happy ? size * 0.06 : size * 0.12) : size * 0.02 }}
                />
                <span
                  className={`${styles.eye} ${happy ? styles.eyeHappy : ''}`}
                  style={{ width: size * 0.09, height: eyesOpen ? (happy ? size * 0.06 : size * 0.12) : size * 0.02 }}
                />
              </div>

              <div
                className={`${styles.mouth} ${happy ? styles.mouthHappy : ''}`}
                style={{ width: size * 0.12, height: size * 0.06, top: size * 0.54 }}
              />

              <svg
                className={styles.scarf}
                viewBox="0 0 40 40"
                style={{ width: size * 0.38, right: -size * 0.06, top: size * 0.26 }}
                aria-hidden
              >
                <path d="M4 8 Q16 2 26 16 Q34 26 38 12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </button>

        <div className={`${styles.starCompanion} ${loveMode ? styles.starCompanionLove : ''}`}>✦</div>

        <div className={styles.particles} aria-hidden>
          {particles.map((p) => (
            <span
              key={p.id}
              className={`${styles.particle} ${styles[p.type]}`}
              style={{
                left: `calc(50% + ${p.x}px)`,
                top: `calc(42% + ${p.y}px)`,
                ['--angle' as string]: `${p.angle}deg`,
              }}
            >
              {p.type === 'heart' ? '♥' : p.type === 'star' ? '✦' : '·'}
            </span>
          ))}
        </div>
      </div>
    )
  },
)
