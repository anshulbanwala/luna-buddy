import { PuzzlePreviewGallery } from '../../puzzle/PuzzlePreviewGallery'
import type { LunaPreviewState } from './LunaBuddyWeb'
import { getCountdownMessage, formatCountdown, getDailyMessage, getGreeting } from '../../luna/messages'
import type { LunaReaction } from '../../luna/reactions'
import { MoonPhaseDisc } from './MoonPhaseDisc'
import styles from './LunaPreviewPanel.module.css'

interface LunaPreviewPanelProps {
  preview: LunaPreviewState
  onChange: (next: LunaPreviewState) => void
  onClose: () => void
  onPlayReaction: (reaction: LunaReaction) => void
}

const reactions: { id: LunaReaction; label: string; emoji: string }[] = [
  { id: 'tap', label: 'Tap', emoji: '👆' },
  { id: 'hearts', label: 'Double-tap', emoji: '♥' },
  { id: 'hug', label: 'Hold hug', emoji: '🤗' },
  { id: 'spin', label: 'Spin', emoji: '✨' },
  { id: 'kiss', label: 'Kiss', emoji: '💋' },
]

const countdownDays = [30, 20, 10, 5, 1, 0]

const greetingHours = [
  { hour: 8, label: 'Morning' },
  { hour: 14, label: 'Afternoon' },
  { hour: 19, label: 'Evening' },
  { hour: 23, label: 'Night' },
]

const moonPhases = [0, 25, 50, 75, 100]

function MiniWidget({ variant }: { variant: 'small' | 'medium' | 'lock' }) {
  const days = 19
  const msg = getDailyMessage()
  const countdown = formatCountdown(days, 0, 0, false)

  if (variant === 'small') {
    return (
      <div className={`${styles.widget} ${styles.widgetSmall}`}>
        <div className={styles.widgetRow}>
          <span className={styles.miniLuna}>●</span>
          <MoonPhaseDisc illumination={72} size={24} />
        </div>
        <p className={styles.widgetMsg}>{msg}</p>
      </div>
    )
  }

  if (variant === 'lock') {
    return (
      <div className={`${styles.widget} ${styles.widgetLock}`}>
        <MoonPhaseDisc illumination={72} size={28} />
        <div>
          <p className={styles.widgetCountdown}>{countdown}</p>
          <p className={styles.widgetSub}>{getCountdownMessage(days, false)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.widget} ${styles.widgetMedium}`}>
      <div className={styles.widgetLeft}>
        <span className={styles.miniLunaLg}>●</span>
        <MoonPhaseDisc illumination={72} size={28} />
      </div>
      <div className={styles.widgetRight}>
        <p className={styles.widgetHeadline}>{getCountdownMessage(days, false)}</p>
        <p className={styles.widgetCountdown}>{countdown}</p>
        <p className={styles.widgetMsg}>{msg}</p>
      </div>
    </div>
  )
}

export function LunaPreviewPanel({ preview, onChange, onClose, onPlayReaction }: LunaPreviewPanelProps) {
  const patch = (partial: Partial<LunaPreviewState>) => onChange({ ...preview, ...partial })

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Luna preview gallery">
        <header className={styles.header}>
          <h2>Preview everything</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className={styles.scroll}>
          <section className={styles.section}>
            <h3>Interactions</h3>
            <div className={styles.chipRow}>
              {reactions.map((r) => (
                <button key={r.id} type="button" className={styles.chip} onClick={() => onPlayReaction(r.id)}>
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Love mode</h3>
            <div className={styles.chipRow}>
              <button
                type="button"
                className={`${styles.chip} ${!preview.loveMode ? styles.chipActive : ''}`}
                onClick={() => patch({ loveMode: false })}
              >
                Normal
              </button>
              <button
                type="button"
                className={`${styles.chip} ${preview.loveMode ? styles.chipActive : ''}`}
                onClick={() => patch({ loveMode: true })}
              >
                ♥ Love mode
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Countdown messages</h3>
            <div className={styles.chipRow}>
              {countdownDays.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.chip} ${preview.daysLeft === d ? styles.chipActive : ''}`}
                  onClick={() => patch({ daysLeft: d })}
                >
                  {d === 0 ? 'Today' : `${d}d`}
                </button>
              ))}
              <button
                type="button"
                className={`${styles.chip} ${preview.daysLeft < 0 ? styles.chipActive : ''}`}
                onClick={() => patch({ daysLeft: -1 })}
              >
                Live
              </button>
            </div>
            <p className={styles.previewText}>
              {getCountdownMessage(preview.daysLeft >= 0 ? preview.daysLeft : 19, preview.daysLeft === 0)}
            </p>
          </section>

          <section className={styles.section}>
            <h3>Greetings</h3>
            <div className={styles.chipRow}>
              {greetingHours.map((g) => (
                <button
                  key={g.hour}
                  type="button"
                  className={`${styles.chip} ${preview.greetingHour === g.hour ? styles.chipActive : ''}`}
                  onClick={() => patch({ greetingHour: g.hour })}
                >
                  {g.label}
                </button>
              ))}
              <button
                type="button"
                className={`${styles.chip} ${preview.greetingHour === null ? styles.chipActive : ''}`}
                onClick={() => patch({ greetingHour: null })}
              >
                Live
              </button>
            </div>
            <p className={styles.previewText}>
              {getGreeting(preview.greetingHour !== null ? new Date(2026, 0, 15, preview.greetingHour) : new Date())}
            </p>
          </section>

          <section className={styles.section}>
            <h3>Widget previews</h3>
            <div className={styles.widgetGrid}>
              <div>
                <span className={styles.widgetLabel}>Small</span>
                <MiniWidget variant="small" />
              </div>
              <div>
                <span className={styles.widgetLabel}>Medium</span>
                <MiniWidget variant="medium" />
              </div>
              <div>
                <span className={styles.widgetLabel}>Lock screen</span>
                <MiniWidget variant="lock" />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Memory puzzles</h3>
            <PuzzlePreviewGallery />
          </section>

          <section className={styles.section}>
            <h3>Moon glow</h3>
            <div className={styles.moonRow}>
              {moonPhases.map((pct) => (
                <div key={pct} className={styles.moonPreview}>
                  <MoonPhaseDisc illumination={pct} size={44} />
                  <span>{pct}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
