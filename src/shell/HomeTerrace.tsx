import { formatBirthTime, PERSONAL, TARGET_YEAR, MEMORY_START } from '../config/personal'
import { getTodaysMemory, getUnlockedMemoryCount } from '../config/memories'
import { getLunarState } from '../utils/lunar'
import { TERRACE_GREETINGS } from '../luna/companionVoices'
import { MoonPhaseDisc } from '../components/luna/MoonPhaseDisc'
import styles from './HomeTerrace.module.css'

interface HomeTerraceProps {
  greeting: string
  daily: string
  countdownMsg: string
  liveCountdown: string
  countdownFmt: string
  orbital: { years: number; days: number; totalDays: number }
  onOpenSky: () => void
  onOpenKeepsakes: () => void
}

export function HomeTerrace({
  greeting,
  daily,
  countdownMsg,
  liveCountdown,
  countdownFmt,
  orbital,
  onOpenSky,
  onOpenKeepsakes,
}: HomeTerraceProps) {
  const lunar = getLunarState()
  const terraceLine = TERRACE_GREETINGS[Math.floor(Date.now() / 86400000) % TERRACE_GREETINGS.length]
  const unlocked = getUnlockedMemoryCount(new Date(), MEMORY_START, 18)
  const today = getTodaysMemory(new Date(), MEMORY_START)

  return (
    <div className={styles.terrace}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{terraceLine}</p>
        <h1 className={styles.greeting}>{greeting}</h1>
        <p className={styles.daily}>{daily}</p>
      </header>

      <section className={styles.giftBox}>
        <div className={styles.ribbon}>opens 12 sep {TARGET_YEAR}</div>
        <p className={styles.giftMsg}>{countdownMsg}</p>
        <p className={styles.giftTimer} aria-live="polite">{liveCountdown}</p>
        <p className={styles.giftSub}>{countdownFmt}</p>
      </section>

      <div className={styles.bento}>
        <button type="button" className={`${styles.tile} ${styles.tileSky}`} onClick={onOpenSky}>
          <span className={styles.tileEmoji}>🌌</span>
          <strong>Sky book</strong>
          <span className={styles.tileDesc}>
            {formatBirthTime()} · {PERSONAL.BIRTH_PLACE}
          </span>
          <span className={styles.tileCta}>Open the night you were born →</span>
        </button>

        <button type="button" className={`${styles.tile} ${styles.tileKeepsake}`} onClick={onOpenKeepsakes}>
          <span className={styles.tileEmoji}>🧩</span>
          <strong>Tonight&apos;s keepsake</strong>
          <span className={styles.tileDesc}>
            {today ? `${today.emoji} ${today.title}` : `${unlocked} memories unlocked`}
          </span>
          <span className={styles.tileCta}>Play a tiny game →</span>
        </button>

        <div className={`${styles.tile} ${styles.tileMoon}`}>
          <MoonPhaseDisc size={56} />
          <div>
            <strong>{lunar.phase}</strong>
            <span>{lunar.illumination}% glow tonight</span>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.tileAge}`}>
          <span className={styles.tileEmoji}>🎂</span>
          <div>
            <strong>{orbital.years} years young</strong>
            <span>{orbital.totalDays.toLocaleString()} sunrises and counting</span>
          </div>
        </div>
      </div>

      <p className={styles.hint}>Luna loves taps · Mochi lives in the corner · wander slowly</p>
    </div>
  )
}
