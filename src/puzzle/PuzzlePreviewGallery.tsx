import { DAILY_MEMORIES } from '../config/memories'
import { PuzzleBoard, PuzzleBoardPreview } from './PuzzleBoard'
import { previewBoard } from './puzzleCore'
import styles from './PuzzlePreviewGallery.module.css'

export function PuzzlePreviewGallery() {
  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Each day unlocks a memory. The puzzle uses emoji tiles by default — upload a photo on the Memories tab to
        convert it into tile slices.
      </p>

      <div className={styles.states}>
        <div className={styles.stateCard}>
          <span className={styles.label}>Shuffled</span>
          <PuzzleBoardPreview emoji="🌙" />
        </div>
        <div className={styles.stateCard}>
          <span className={styles.label}>Solved</span>
          <PuzzleBoardPreview emoji="🌙" solved />
        </div>
        <div className={styles.stateCard}>
          <span className={styles.label}>Photo mode</span>
          <div className={styles.photoDemo}>
            <div className={styles.photoTile} style={{ backgroundPosition: '0% 0%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '50% 0%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '100% 0%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '0% 50%' }} />
            <div className={styles.photoEmpty} />
            <div className={styles.photoTile} style={{ backgroundPosition: '100% 50%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '0% 100%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '50% 100%' }} />
            <div className={styles.photoTile} style={{ backgroundPosition: '100% 100%' }} />
          </div>
        </div>
      </div>

      <h4 className={styles.gridTitle}>All daily puzzles</h4>
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
