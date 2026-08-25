import { useCallback, useMemo, useState } from 'react'
import { DAILY_MEMORIES, getUnlockedMemoryCount } from '../config/memories'
import { MEMORY_START } from '../config/personal'
import styles from './ConstellationMatch.module.css'

interface Card {
  id: number
  pairId: number
  emoji: string
  label: string
  flipped: boolean
  matched: boolean
}

function buildDeck(unlocked: number): Card[] {
  const pool = DAILY_MEMORIES.slice(0, Math.min(unlocked, 6))
  const pairs = pool.flatMap((mem, i) => [
    { id: i * 2, pairId: i, emoji: mem.emoji, label: mem.title, flipped: false, matched: false },
    { id: i * 2 + 1, pairId: i, emoji: mem.emoji, label: mem.title, flipped: false, matched: false },
  ])
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs
}

export function ConstellationMatch() {
  const unlocked = getUnlockedMemoryCount(new Date(), MEMORY_START, DAILY_MEMORIES.length)
  const [cards, setCards] = useState(() => buildDeck(unlocked))
  const [selected, setSelected] = useState<number | null>(null)
  const [lock, setLock] = useState(false)
  const [moves, setMoves] = useState(0)

  const matched = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards])
  const won = matched === cards.length / 2 && cards.length > 0

  const flip = useCallback(
    (id: number) => {
      if (lock) return
      const card = cards.find((c) => c.id === id)
      if (!card || card.flipped || card.matched) return

      const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      setCards(next)

      if (selected === null) {
        setSelected(id)
        return
      }

      setMoves((m) => m + 1)
      const first = next.find((c) => c.id === selected)!
      if (first.pairId === card.pairId) {
        setCards(next.map((c) => (c.pairId === card.pairId ? { ...c, matched: true } : c)))
        setSelected(null)
      } else {
        setLock(true)
        window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === id || c.id === selected ? { ...c, flipped: false } : c)),
          )
          setSelected(null)
          setLock(false)
        }, 900)
      }
    },
    [cards, lock, selected],
  )

  const reset = () => {
    setCards(buildDeck(unlocked))
    setSelected(null)
    setMoves(0)
    setLock(false)
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>Flip two cards — match memory pairs from your constellation.</p>
      <div className={styles.grid}>
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`${styles.card} ${card.flipped || card.matched ? styles.cardOpen : ''} ${card.matched ? styles.cardMatched : ''}`}
            onClick={() => flip(card.id)}
            disabled={card.matched}
          >
            <div className={styles.inner}>
              <div className={styles.back}>✦</div>
              <div className={styles.front}>
                <span>{card.emoji}</span>
                <small>{card.label}</small>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className={styles.stats}>
        <span>{moves} flips · {matched}/{cards.length / 2} pairs</span>
        {won && <span className={styles.win}>Constellation complete ✦</span>}
        <button type="button" onClick={reset}>Shuffle</button>
      </div>
    </div>
  )
}
