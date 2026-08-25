import { useEffect, useRef } from 'react'
import styles from './FloatingOrbs.module.css'

export function FloatingOrbs() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={styles.grain} />
    </div>
  )
}

export function ParallaxGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const x = (e.clientX / window.innerWidth - 0.5) * 24
      const y = (e.clientY / window.innerHeight - 0.5) * 24
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <div ref={ref} className={styles.parallaxGlow} aria-hidden />
}
