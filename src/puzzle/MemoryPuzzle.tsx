import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DAILY_MEMORIES, getTodaysMemory, getUnlockedMemoryCount } from '../config/memories'
import { MEMORY_START } from '../config/personal'
import { fileToDataUrl, normalizeImageDataUrl } from './imagePuzzle'
import { PuzzleBoard } from './PuzzleBoard'
import { GRID, isSolved, shuffleBoard } from './puzzleCore'
import styles from './MemoryPuzzle.module.css'

const STORAGE_KEY = 'luna-puzzle-image'

function loadStoredImage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function MemoryPuzzle() {
  const [board, setBoard] = useState(shuffleBoard)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(() => loadStoredImage())
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const unlocked = getUnlockedMemoryCount(new Date(), MEMORY_START, DAILY_MEMORIES.length)
  const todaysMemory = getTodaysMemory(new Date(), MEMORY_START)
  const envImage = import.meta.env.VITE_PUZZLE_IMAGE

  useEffect(() => {
    if (envImage && !imageUrl) setImageUrl(envImage)
  }, [envImage, imageUrl])

  const tryMove = useCallback(
    (index: number) => {
      if (won) return
      const empty = board.indexOf(0)
      const row = Math.floor(index / GRID)
      const col = index % GRID
      const emptyRow = Math.floor(empty / GRID)
      const emptyCol = empty % GRID
      const adjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      if (!adjacent) return

      const next = [...board]
      ;[next[index], next[empty]] = [next[empty], next[index]]
      setBoard(next)
      setMoves((m) => m + 1)
      if (isSolved(next)) setWon(true)
    },
    [board, won],
  )

  useEffect(() => {
    if (won) return
    setWon(isSolved(board))
  }, [board, won])

  const reset = () => {
    setBoard(shuffleBoard())
    setMoves(0)
    setWon(false)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const raw = await fileToDataUrl(file)
      const normalized = await normalizeImageDataUrl(raw)
      setImageUrl(normalized)
      localStorage.setItem(STORAGE_KEY, normalized)
      reset()
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setImageUrl(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const puzzleEmoji = useMemo(() => todaysMemory?.emoji ?? '✦', [todaysMemory])

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.title}>Memory constellation</h2>
        <p className={styles.subtitle}>
          {unlocked} of {DAILY_MEMORIES.length} memories · slide tiles to reveal today&apos;s
        </p>
      </header>

      {todaysMemory && (
        <article className={`${styles.memoryCard} ${won ? styles.memoryCardRevealed : ''}`}>
          <span className={styles.emoji}>{todaysMemory.emoji}</span>
          <div>
            <h3>{won ? todaysMemory.title : "Today's memory is hidden"}</h3>
            <p>{won ? todaysMemory.body : 'Complete the puzzle — each tile is a piece of the picture.'}</p>
          </div>
        </article>
      )}

      <div className={styles.puzzleWrap}>
        <PuzzleBoard
          board={board}
          imageUrl={imageUrl}
          emoji={puzzleEmoji}
          size="lg"
          interactive
          won={won}
          onTileClick={tryMove}
          showNumbers={!imageUrl}
        />

        <div className={styles.stats}>
          <span>{moves} moves</span>
          <button type="button" className={styles.resetBtn} onClick={reset}>
            Shuffle
          </button>
        </div>

        <div className={styles.uploadRow}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleUpload(f)
            }}
          />
          <button
            type="button"
            className={styles.uploadBtn}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Processing…' : imageUrl ? 'Replace photo puzzle' : 'Upload your photo'}
          </button>
          {imageUrl && (
            <button type="button" className={styles.clearBtn} onClick={clearImage}>
              Clear
            </button>
          )}
        </div>
        <p className={styles.uploadHint}>
          Drop any photo — it slices into 8 tiles automatically. Perfect for memories.
        </p>
      </div>

      <section className={styles.gallery}>
        <h3>Unlocked memories</h3>
        <div className={styles.memoryList}>
          {DAILY_MEMORIES.slice(0, unlocked).map((mem, i) => (
            <div key={mem.title} className={styles.memoryItem}>
              <span>{mem.emoji}</span>
              <div>
                <strong>
                  Day {i + 1} · {mem.title}
                </strong>
                <p>{mem.body}</p>
              </div>
            </div>
          ))}
          {unlocked < DAILY_MEMORIES.length && (
            <p className={styles.lockedHint}>Come back tomorrow for the next piece of the constellation.</p>
          )}
        </div>
      </section>
    </div>
  )
}
