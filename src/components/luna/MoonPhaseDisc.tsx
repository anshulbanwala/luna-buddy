import { getLunarState } from '../../utils/lunar'
import styles from './MoonPhaseDisc.module.css'

interface MoonPhaseDiscProps {
  size?: number
  date?: Date
  dim?: boolean
  illumination?: number
}

export function MoonPhaseDisc({ size = 120, date = new Date(), dim = false, illumination }: MoonPhaseDiscProps) {
  const lunar = getLunarState(date)
  const lit = (illumination ?? lunar.illumination) / 100

  return (
    <div
      className={`${styles.disc} ${dim ? styles.dim : ''}`}
      style={{ width: size, height: size }}
      aria-label={`Moon phase: ${lunar.phase}, ${lunar.illumination}% illuminated`}
    >
      <div className={styles.surface} />
      <div
        className={styles.shadow}
        style={{
          width: size,
          height: size,
          transform: `translateX(${(1 - lit * 2) * (size / 2)}px)`,
        }}
      />
      <svg className={styles.ring} viewBox="0 0 100 100" style={{ width: size + 20, height: size + 20 }}>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(209, 184, 122, 0.45)"
          strokeWidth="2"
          strokeDasharray={`${lit * 289} 289`}
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  )
}
