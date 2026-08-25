import { GRID, getTileSlice } from './puzzleCore'
import { getImageTileStyle } from './imagePuzzle'
import styles from './PuzzleBoard.module.css'

interface PuzzleBoardProps {
  board: number[]
  imageUrl?: string | null
  emoji?: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  won?: boolean
  onTileClick?: (index: number) => void
  showNumbers?: boolean
}

export function PuzzleBoard({
  board,
  imageUrl,
  emoji = '✦',
  size = 'md',
  interactive = false,
  won = false,
  onTileClick,
  showNumbers = false,
}: PuzzleBoardProps) {
  return (
    <div
      className={`${styles.grid} ${styles[size]} ${won ? styles.gridWon : ''} ${interactive ? styles.gridInteractive : ''}`}
      style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
    >
      {board.map((value, index) => {
        const isEmpty = value === 0
        const imageStyle = imageUrl && value > 0 ? getImageTileStyle(imageUrl, value) : undefined

        return (
          <button
            key={`${index}-${value}`}
            type="button"
            className={`${styles.tile} ${isEmpty ? styles.tileEmpty : ''}`}
            style={imageStyle}
            disabled={!interactive || isEmpty}
            onClick={() => onTileClick?.(index)}
            aria-label={isEmpty ? 'Empty' : `Tile ${value}`}
          >
            {!imageUrl && !isEmpty && (
              <>
                <span className={styles.tileEmoji}>{emoji}</span>
                {showNumbers && <span className={styles.tileNum}>{value}</span>}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function PuzzleBoardPreview({
  imageUrl,
  emoji,
  solved = false,
}: {
  imageUrl?: string | null
  emoji?: string
  solved?: boolean
}) {
  const board = solved ? [1, 2, 3, 4, 5, 6, 7, 8, 0] : [1, 2, 3, 4, 0, 6, 7, 5, 8]
  return <PuzzleBoard board={board} imageUrl={imageUrl} emoji={emoji} size="sm" showNumbers={!imageUrl} />
}

export { getTileSlice }
