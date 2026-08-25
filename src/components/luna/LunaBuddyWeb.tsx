import { useEffect, useRef, useState } from 'react'
import { getOrbitalAge, TARGET_YEAR } from '../../config/personal'
import { useTemporalEvent } from '../../hooks/useTemporalEvent'
import { getLunarState } from '../../utils/lunar'
import {
  formatCountdown,
  getCountdownMessage,
  getDailyMessage,
  getGreeting,
  isLoveMode,
} from '../../luna/messages'
import type { LunaReaction } from '../../luna/reactions'
import { getReactionWhisper } from '../../luna/reactions'
import { AmbientCompanion } from '../ambient/AmbientCompanion'
import { FloatingOrbs, ParallaxGlow } from '../ambient/FloatingOrbs'
import { PuzzleExperience } from '../../puzzle/PuzzleExperience'
import { StarMapView } from '../../starmap/StarMapView'
import type { LunaCharacterHandle } from './LunaCharacter'
import { LunaCharacter } from './LunaCharacter'
import { LunaPreviewPanel } from './LunaPreviewPanel'
import { MoonPhaseDisc } from './MoonPhaseDisc'
import { RomanticAura } from './RomanticAura'
import { Starfield } from './Starfield'
import styles from './LunaBuddyWeb.module.css'

type Tab = 'home' | 'sky' | 'memories'

export interface LunaPreviewState {
  loveMode: boolean
  daysLeft: number
  greetingHour: number | null
}

const defaultPreview: LunaPreviewState = {
  loveMode: false,
  daysLeft: -1,
  greetingHour: null,
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export function LunaBuddyWeb() {
  const temporal = useTemporalEvent()
  const [tab, setTab] = useState<Tab>('home')
  const [appeared, setAppeared] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [whisper, setWhisper] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(
    () => new URLSearchParams(window.location.search).has('preview'),
  )
  const [preview, setPreview] = useState<LunaPreviewState>(defaultPreview)
  const lunaRef = useRef<LunaCharacterHandle>(null)
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const love = preview.loveMode || isLoveMode()
  const usingPreviewDays = preview.daysLeft >= 0
  const days = usingPreviewDays ? preview.daysLeft : temporal.remaining.days
  const isReached = usingPreviewDays ? preview.daysLeft === 0 : temporal.isReached
  const lunar = getLunarState()
  const orbital = getOrbitalAge()

  const fakeDate = preview.greetingHour !== null
    ? new Date(2026, 0, 15, preview.greetingHour, 0)
    : new Date()

  const countdownMsg = getCountdownMessage(days, isReached)
  const liveCountdown = isReached
    ? '00:00:00'
    : `${pad(temporal.remaining.days)}d ${pad(temporal.remaining.hours)}:${pad(temporal.remaining.minutes)}:${pad(temporal.remaining.seconds)}`

  const countdownFmt = usingPreviewDays
    ? formatCountdown(days, 4, 32, isReached)
    : formatCountdown(
        temporal.remaining.days,
        temporal.remaining.hours,
        temporal.remaining.minutes,
        temporal.isReached,
      )

  useEffect(() => {
    const t1 = setTimeout(() => setAppeared(true), 80)
    const t2 = setTimeout(() => setShowMessage(true), 700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const showWhisper = (reaction: LunaReaction) => {
    const text = getReactionWhisper(reaction, love)
    setWhisper(text)
    if (whisperTimer.current) clearTimeout(whisperTimer.current)
    whisperTimer.current = setTimeout(() => setWhisper(null), 3200)
  }

  const handleReaction = (reaction: LunaReaction) => {
    showWhisper(reaction)
  }

  const handlePreviewReaction = (reaction: LunaReaction) => {
    lunaRef.current?.play(reaction)
    showWhisper(reaction)
  }

  return (
    <div className={styles.page}>
      <FloatingOrbs />
      <ParallaxGlow />
      <RomanticAura />
      <Starfield count={55} />
      <AmbientCompanion />

      {tab === 'home' && (
        <div className={styles.bgMoon}>
          <MoonPhaseDisc size={220} dim />
        </div>
      )}

      <nav className={styles.nav} aria-label="Main">
        {(['home', 'sky', 'memories'] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={`${styles.navBtn} ${tab === id ? styles.navBtnActive : ''}`}
            onClick={() => setTab(id)}
          >
            {id === 'home' ? 'Luna' : id === 'sky' ? 'Star map' : 'Memories'}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className={styles.previewFab}
        onClick={() => setPreviewOpen(true)}
        aria-label="Open preview gallery"
      >
        ✦ Preview
      </button>

      <main className={`${styles.main} ${styles[`tab_${tab}`]}`}>
        {tab === 'home' && (
          <>
            <section className={`${styles.hero} ${appeared ? styles.heroIn : ''}`}>
              <LunaCharacter
                ref={lunaRef}
                size={120}
                loveMode={love}
                onReaction={handleReaction}
              />
            </section>

            {showMessage && (
              <div className={styles.messages}>
                <h1 className={styles.greeting}>{getGreeting(fakeDate)}</h1>
                <p className={`${styles.daily} ${whisper ? styles.dailyWhisper : ''}`}>
                  {whisper ?? getDailyMessage(fakeDate)}
                </p>
                {love && !whisper && <p className={styles.love}>You make today brighter.</p>}
              </div>
            )}

            <section className={styles.countdownCard}>
              <span className={styles.countdownLabel}>until 12 september {TARGET_YEAR}</span>
              <p className={styles.countdownMsg}>{countdownMsg}</p>
              <p className={styles.countdownLive} aria-live="polite">{liveCountdown}</p>
              <p className={styles.countdownFmt}>{countdownFmt}</p>
            </section>

            <section className={styles.orbitBadge}>
              <span className={styles.orbitLabel}>orbital age</span>
              <p>{orbital.years} years · {orbital.days} days · {orbital.totalDays.toLocaleString()} sunrises</p>
            </section>

            <section className={styles.moonClock}>
              <MoonPhaseDisc size={88} />
              <div className={styles.moonData}>
                <p className={styles.phaseName}>{lunar.phase}</p>
                <div className={styles.stats}>
                  <div>
                    <span className={styles.statLabel}>glow</span>
                    <span className={styles.statValue}>{lunar.illumination}%</span>
                  </div>
                  <div>
                    <span className={styles.statLabel}>age</span>
                    <span className={styles.statValue}>{lunar.age}d</span>
                  </div>
                </div>
              </div>
            </section>

            <button type="button" className={styles.skyCta} onClick={() => setTab('sky')}>
              ✦ See the sky you were born under
            </button>

            <p className={styles.hint}>tap · double-tap ♥ · hold to hug</p>
          </>
        )}

        {tab === 'sky' && <StarMapView />}
        {tab === 'memories' && <PuzzleExperience />}
      </main>

      {previewOpen && (
        <LunaPreviewPanel
          preview={preview}
          onChange={setPreview}
          onClose={() => setPreviewOpen(false)}
          onPlayReaction={handlePreviewReaction}
        />
      )}
    </div>
  )
}
