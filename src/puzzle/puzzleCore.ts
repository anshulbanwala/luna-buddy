export const GRID = 3
export const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]

export function shuffleBoard(): number[] {
  const board = [...SOLVED]
  do {
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[board[i], board[j]] = [board[j], board[i]]
    }
  } while (!isSolvable(board) || isSolved(board))
  return board
}

export function isSolvable(board: number[]): boolean {
  let inversions = 0
  const filtered = board.filter((n) => n !== 0)
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++
    }
  }
  return inversions % 2 === 0
}

export function isSolved(board: number[]): boolean {
  return board.every((v, i) => v === SOLVED[i])
}

/** Deterministic shuffle for previews (same seed = same board) */
export function previewBoard(seed: number): number[] {
  const board = [...SOLVED]
  let s = seed
  for (let i = board.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[board[i], board[j]] = [board[j], board[i]]
  }
  if (!isSolvable(board)) {
    const a = board.indexOf(1)
    const b = board.indexOf(2)
    ;[board[a], board[b]] = [board[b], board[a]]
  }
  return board
}

export function getTileSlice(value: number): { row: number; col: number } | null {
  if (value === 0) return null
  const idx = value - 1
  return { row: Math.floor(idx / GRID), col: idx % GRID }
}
