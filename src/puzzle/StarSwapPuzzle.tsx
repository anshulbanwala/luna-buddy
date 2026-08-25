import { useCallback, useEffect, useRef, useState } from 'react'
import { getTodaysMemory } from '../config/memories'
import { MEMORY_START } from '../config/personal'
import { fileToDataUrl, normalizeImageDataUrl } from './imagePuzzle'
import { PuzzleBoard } from './PuzzleBoard'
import { isSolved, shuffleBoard } from './puzzleCore'
import styles from './StarSwapPuzzle.module.css'

const STORAGE_KEY = 'luna-puzzle-image'

function loadStoredImage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** Tap two tiles to swap — inspired by Selfie Shuffle / Snap Puzzle */
export function StarSwapPuzzle() {
  const [board, setBoard] = useState(shuffleBoard)
  const [selected, setSelected] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(() => loadStoredImage())
  const fileRef = useRef<HTMLInputElement>(null)
  const todaysMemory = getTodaysMemory(new Date(), MEMORY_START)

  const onTile = useCallback(
    (index: number) => {
      if (won || board[index] === 0) return
      if (selected === null) {
        setSelected(index)
        return
      }
      if (selected === index) {
        setSelected(null)
        return
      }
      const next = [...board]
      ;[next[selected], next[index]] = [next[index], next[selected]]
      setBoard(next)
      setSelected(null)
      setMoves((m) => m + 1)
      if (isSolved(next)) setWon(true)
    },
    [board, selected, won],
  )

  useEffect(() => {
    if (!won) setWon(isSolved(board))
  }, [board, won])

  const emoji = todaysMemory?.emoji ?? '✦'

  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>Tap two tiles to swap them — easier for photo memories.</p>
      <div className={`${styles.gridWrap} ${selected !== null ? styles.gridSelecting : ''}`}>
        <PuzzleBoard
          board={board}
          imageUrl={imageUrl}
          emoji={emoji}
          size="lg"
          interactive
          won={won}
          onTileClick={onTile}
          showNumbers={!imageUrl}
          highlightIndex={selected}
        />
      </div>
      <div className={styles.stats}>
        <span>{moves} swaps</span>
        {won && <span className={styles.win}>Picture restored ✦</span>}
        <button type="button" onClick={() => { setBoard(shuffleBoard()); setMoves(0); setWon(false); setSelected(null) }}>
          Shuffle
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const normalized = await normalizeImageDataUrl(await fileToDataUrl(f))
          setImageUrl(normalized)
          localStorage.setItem(STORAGE_KEY, normalized)
        }}
      />
      <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
        {imageUrl ? 'Replace photo' : 'Upload photo'}
      </button>
    </div>
  )
}
