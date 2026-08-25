import { DAILY_MEMORIES } from '../config/memories'
import { PuzzleBoard, PuzzleBoardPreview } from './PuzzleBoard'
import { previewBoard } from './puzzleCore'
import styles from './PuzzlePreviewGallery.module.css'

export function PuzzlePreviewGallery() {
  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Three puzzle styles — inspired by Snap Puzzle, Selfie Shuffle, and memory-game repos.
        Upload photos on the Memories tab; drop files in <code>public/photos/</code>.
      </p>

      <div className={styles.modeRow}>
        <div className={styles.modeCard}>
          <h4>☄️ Orbit Slide</h4>
          <PuzzleBoardPreview emoji="🌙" />
          <span>Classic empty-tile slide</span>
        </div>
        <div className={styles.modeCard}>
          <h4>🔄 Star Swap</h4>
          <PuzzleBoard board={[1, 2, 3, 4, 0, 6, 7, 5, 8]} emoji="📸" size="sm" showNumbers />
          <span>Tap two tiles to swap</span>
        </div>
        <div className={styles.modeCard}>
          <h4>✦ Constellation Match</h4>
          <div className={styles.miniFlip}>
            <div className={styles.flipOpen}>🌙</div>
            <div className={styles.flipBack}>✦</div>
          </div>
          <span>Flip memory pairs</span>
        </div>
      </div>

      <h4 className={styles.gridTitle}>All 18 daily puzzles (emoji tiles)</h4>
      <div className={styles.memoryGrid}>
        {DAILY_MEMORIES.map((mem, i) => (
          <article key={mem.title} className={styles.memoryPreview}>
            <PuzzleBoard board={previewBoard(i + 1)} emoji={mem.emoji} size="sm" showNumbers />
            <div className={styles.meta}>
              <strong>Day {i + 1}</strong>
              <span>{mem.emoji} {mem.title}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
