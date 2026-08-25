import { useEffect, useRef, useState } from 'react'
import { getOrbitalAge } from '../../config/personal'
import { useTemporalEvent } from '../../hooks/useTemporalEvent'
import {
  formatCountdown,
  getCountdownMessage,
  getDailyMessage,
  getGreeting,
  isLoveMode,
} from '../../luna/messages'
import type { LunaReaction } from '../../luna/reactions'
import { getReactionWhisper } from '../../luna/reactions'
import { AmbientCompanion } from '../ambient/MochiWorld'
import { FloatingOrbs, ParallaxGlow } from '../ambient/FloatingOrbs'
import { PuzzleExperience } from '../../puzzle/PuzzleExperience'
import { HomeTerrace } from '../../shell/HomeTerrace'
import { StarMapView } from '../../starmap/StarMapView'
import { LunaCharacter } from './LunaCharacter'
import { LunaPreviewPanel } from './LunaPreviewPanel'
import { RomanticAura } from './RomanticAura'
import { Starfield } from './Starfield'
import styles from './LunaBuddyWeb.module.css'

type Journey = 'terrace' | 'sky' | 'keepsakes'

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

const NAV: { id: Journey; label: string; icon: string }[] = [
  { id: 'terrace', label: 'Tonight', icon: '🏠' },
  { id: 'sky', label: 'Sky book', icon: '🌌' },
  { id: 'keepsakes', label: 'Keepsakes', icon: '🧩' },
]

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export function LunaBuddyWeb() {
  const temporal = useTemporalEvent()
  const [journey, setJourney] = useState<Journey>('terrace')
  const [whisper, setWhisper] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(
    () => new URLSearchParams(window.location.search).has('preview'),
  )
  const [preview, setPreview] = useState<LunaPreviewState>(defaultPreview)
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const love = preview.loveMode || isLoveMode()
  const usingPreviewDays = preview.daysLeft >= 0
  const days = usingPreviewDays ? preview.daysLeft : temporal.remaining.days
  const isReached = usingPreviewDays ? preview.daysLeft === 0 : temporal.isReached
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

  const daily = whisper ?? getDailyMessage(fakeDate)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [journey])

  const showWhisper = (reaction: LunaReaction) => {
    const text = getReactionWhisper(reaction, love)
    setWhisper(text)
    if (whisperTimer.current) clearTimeout(whisperTimer.current)
    whisperTimer.current = setTimeout(() => setWhisper(null), 3200)
  }

  return (
    <div className={styles.page}>
      <FloatingOrbs />
      <ParallaxGlow />
      <RomanticAura />
      <Starfield count={40} />
      <AmbientCompanion showCorner={journey === 'terrace'} />

      <nav className={styles.dock} aria-label="Journey">
        {NAV.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.dockBtn} ${journey === id ? styles.dockBtnActive : ''}`}
            onClick={() => setJourney(id)}
          >
            <span className={styles.dockIcon}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button type="button" className={styles.previewFab} onClick={() => setPreviewOpen(true)}>
        ✦ Preview
      </button>

      <main className={styles.main} key={journey}>
        {journey === 'terrace' && (
          <>
            <div className={styles.lunaFloat}>
              <LunaCharacter size={100} loveMode={love} onReaction={showWhisper} />
            </div>
            <HomeTerrace
              greeting={getGreeting(fakeDate)}
              daily={daily}
              countdownMsg={countdownMsg}
              liveCountdown={liveCountdown}
              countdownFmt={countdownFmt}
              orbital={orbital}
              onOpenSky={() => setJourney('sky')}
              onOpenKeepsakes={() => setJourney('keepsakes')}
            />
          </>
        )}
        {journey === 'sky' && <StarMapView />}
        {journey === 'keepsakes' && <PuzzleExperience />}
      </main>

      {previewOpen && (
        <LunaPreviewPanel
          preview={preview}
          onChange={setPreview}
          onClose={() => setPreviewOpen(false)}
          onPlayReaction={showWhisper}
        />
      )}
    </div>
  )
}
