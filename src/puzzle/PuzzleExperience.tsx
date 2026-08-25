import { useState } from 'react'
import { ConstellationMatch } from './ConstellationMatch'
import { MemoryPuzzle } from './MemoryPuzzle'
import { StarSwapPuzzle } from './StarSwapPuzzle'
import styles from './PuzzleExperience.module.css'

export type PuzzleMode = 'slide' | 'swap' | 'match'

const MODES: { id: PuzzleMode; label: string; desc: string; icon: string }[] = [
  { id: 'slide', label: 'Orbit Slide', desc: 'Classic sliding tiles', icon: '☄️' },
  { id: 'swap', label: 'Star Swap', desc: 'Tap two tiles to swap — best for photos', icon: '🔄' },
  { id: 'match', label: 'Constellation Match', desc: 'Flip pairs of memories', icon: '✦' },
]

export function PuzzleExperience() {
  const [mode, setMode] = useState<PuzzleMode>('slide')

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.title}>Memory constellation</h2>
        <p className={styles.subtitle}>Three ways to play — pick your orbit</p>
      </header>

      <div className={styles.modePicker} role="tablist" aria-label="Puzzle mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
            onClick={() => setMode(m.id)}
          >
            <span className={styles.modeIcon}>{m.icon}</span>
            <span className={styles.modeLabel}>{m.label}</span>
            <span className={styles.modeDesc}>{m.desc}</span>
          </button>
        ))}
      </div>

      <div className={styles.stage} key={mode}>
        {mode === 'slide' && <MemoryPuzzle embedded />}
        {mode === 'swap' && <StarSwapPuzzle />}
        {mode === 'match' && <ConstellationMatch />}
      </div>
    </div>
  )
}
