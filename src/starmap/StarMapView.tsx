import { useEffect, useMemo, useRef, useState } from 'react'
import { BIRTH_YEAR, PERSONAL, STAR_DATES, parseBirthDateTime } from '../config/personal'
import { getSeptember12Facts } from './dayFacts'
import type { SkyPoint, SkySnapshot } from './skyCalculator'
import { computeSkySnapshot, getConstellationHighlights, starSize } from './skyCalculator'
import styles from './StarMapView.module.css'

function drawSky(
  ctx: CanvasRenderingContext2D,
  snapshot: SkySnapshot,
  size: number,
  hoverId: string | null,
) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 24

  ctx.clearRect(0, 0, size, size)

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  grad.addColorStop(0, 'rgba(28, 22, 52, 0.98)')
  grad.addColorStop(0.55, 'rgba(10, 8, 20, 0.99)')
  grad.addColorStop(1, 'rgba(2, 2, 6, 1)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  // Milky Way band (inspired by d3-celestial)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()
  const mw = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy + radius * 0.3)
  mw.addColorStop(0, 'transparent')
  mw.addColorStop(0.35, 'rgba(180, 170, 220, 0.06)')
  mw.addColorStop(0.5, 'rgba(220, 210, 255, 0.1)')
  mw.addColorStop(0.65, 'rgba(180, 170, 220, 0.05)')
  mw.addColorStop(1, 'transparent')
  ctx.fillStyle = mw
  ctx.fillRect(cx - radius, cy - radius * 0.4, radius * 2, radius * 0.8)
  ctx.restore()

  ctx.strokeStyle = 'rgba(209, 184, 122, 0.2)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(209, 184, 122, 0.55)'
  ctx.font = '10px Inter, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('N', cx, cy - radius + 12)
  ctx.fillText('S', cx, cy + radius - 4)
  ctx.fillText('E', cx + radius - 6, cy + 3)
  ctx.fillText('W', cx - radius + 6, cy + 3)

  ctx.strokeStyle = 'rgba(120, 160, 220, 0.28)'
  ctx.setLineDash([4, 6])
  for (const line of snapshot.lines) {
    ctx.beginPath()
    ctx.moveTo(cx + line.x1, cy + line.y1)
    ctx.lineTo(cx + line.x2, cy + line.y2)
    ctx.stroke()
  }
  ctx.setLineDash([])

  for (const star of snapshot.stars) {
    const r = starSize(star.magnitude)
    const alpha = Math.min(1, 0.4 + (3 - star.magnitude) * 0.22)
    const isHover = hoverId === star.id
    if (isHover) {
      ctx.fillStyle = 'rgba(235, 140, 158, 0.35)'
      ctx.beginPath()
      ctx.arc(cx + star.x, cy + star.y, r + 8, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = `rgba(245, 240, 230, ${alpha})`
    ctx.beginPath()
    ctx.arc(cx + star.x, cy + star.y, r, 0, Math.PI * 2)
    ctx.fill()
    if (star.magnitude < 1.2) {
      ctx.fillStyle = `rgba(255, 249, 240, ${alpha * 0.3})`
      ctx.beginPath()
      ctx.arc(cx + star.x, cy + star.y, r * 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  for (const planet of snapshot.planets) {
    ctx.fillStyle = 'rgba(212, 188, 130, 0.95)'
    ctx.beginPath()
    ctx.arc(cx + planet.x, cy + planet.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  if (snapshot.moon) {
    ctx.fillStyle = 'rgba(255, 249, 240, 0.95)'
    ctx.beginPath()
    ctx.arc(cx + snapshot.moon.x, cy + snapshot.moon.y, 7, 0, Math.PI * 2)
    ctx.fill()
  }
}

function findNearestStar(stars: SkyPoint[], mx: number, my: number, cx: number, cy: number): SkyPoint | null {
  let best: SkyPoint | null = null
  let bestD = 20
  for (const s of stars) {
    const d = Math.hypot(mx - (cx + s.x), my - (cy + s.y))
    if (d < bestD) {
      bestD = d
      best = s
    }
  }
  return best
}

export function StarMapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const compareRef = useRef<HTMLCanvasElement>(null)
  const [year, setYear] = useState(BIRTH_YEAR)
  const [compare, setCompare] = useState(false)
  const [hoverStar, setHoverStar] = useState<SkyPoint | null>(null)
  const [selectedDateKey, setSelectedDateKey] = useState(STAR_DATES[0]?.date ?? PERSONAL.BIRTH_DATE)

  const viewDate = useMemo(() => {
    const preset = STAR_DATES.find((d) => d.date === selectedDateKey)
    if (preset) {
      const [y, m, d] = preset.date.split('-').map(Number)
      const [hh, mm] = PERSONAL.BIRTH_TIME.split(':').map(Number)
      return new Date(y, m - 1, d, hh, mm, 0)
    }
    return parseBirthDateTime(year)
  }, [selectedDateKey, year])

  const birthDate = useMemo(() => parseBirthDateTime(BIRTH_YEAR), [])

  const snapshot = useMemo(
    () => computeSkySnapshot(viewDate, PERSONAL.BIRTH_LAT, PERSONAL.BIRTH_LON, PERSONAL.BIRTH_PLACE),
    [viewDate],
  )

  const birthSnapshot = useMemo(
    () => computeSkySnapshot(birthDate, PERSONAL.BIRTH_LAT, PERSONAL.BIRTH_LON, PERSONAL.BIRTH_PLACE),
    [birthDate],
  )

  const dayFacts = useMemo(() => getSeptember12Facts(viewDate.getFullYear()), [viewDate])
  const highlights = useMemo(() => getConstellationHighlights(snapshot), [snapshot])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const size = compare ? 280 : 360
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawSky(ctx, snapshot, size, hoverStar?.id ?? null)
  }, [snapshot, hoverStar, compare])

  useEffect(() => {
    if (!compare) return
    const canvas = compareRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const size = 280
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawSky(ctx, birthSnapshot, size, null)
  }, [birthSnapshot, compare])

  const onCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const size = compare ? 280 : 360
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const cx = size / 2
    const cy = size / 2
    setHoverStar(findNearestStar(snapshot.stars, mx, my, cx, cy))
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.title}>Birth star map</h2>
        <p className={styles.subtitle}>
          {PERSONAL.BIRTH_PLACE} · {viewDate.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </header>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.compareBtn} ${compare ? styles.compareBtnActive : ''}`}
          onClick={() => setCompare((c) => !c)}
        >
          {compare ? 'Single sky' : 'Compare birth vs this year'}
        </button>

        <label className={styles.control}>
          <span>Special dates</span>
          <select
            value={selectedDateKey}
            onChange={(e) => {
              setSelectedDateKey(e.target.value)
              const y = Number(e.target.value.split('-')[0])
              if (Number.isFinite(y)) setYear(y)
            }}
          >
            {STAR_DATES.map((entry) => (
              <option key={entry.date} value={entry.date}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          <span>Any year · Sep 12</span>
          <input
            type="range"
            min={BIRTH_YEAR}
            max={2026}
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value)
              setYear(y)
              setSelectedDateKey(`${y}-09-12`)
            }}
          />
          <strong>{year}</strong>
        </label>
      </div>

      <div className={`${styles.mapCard} ${compare ? styles.mapCompare : ''}`}>
        <div className={styles.mapPane}>
          {compare && <span className={styles.mapLabel}>{year}</span>}
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-label="Star map"
            onMouseMove={onCanvasMove}
            onMouseLeave={() => setHoverStar(null)}
          />
        </div>
        {compare && (
          <div className={styles.mapPane}>
            <span className={styles.mapLabel}>{BIRTH_YEAR} · birth</span>
            <canvas ref={compareRef} className={styles.canvas} aria-label="Birth star map" />
          </div>
        )}
        {hoverStar && (
          <div className={styles.starCard}>
            <strong>{hoverStar.name}</strong>
            <span>{hoverStar.constellation}</span>
            <small>alt {Math.round(hoverStar.altitude)}° · mag {hoverStar.magnitude.toFixed(1)}</small>
          </div>
        )}
        <p className={styles.mapMeta}>
          {snapshot.meta.visibleCount} stars · {highlights.join(' · ')}
        </p>
      </div>

      <section className={styles.facts}>
        <h3>{dayFacts.headline}</h3>
        <p className={styles.moonFact}>
          Moon on this night: <strong>{dayFacts.moonPhase}</strong> ({dayFacts.moonGlow}% glow)
        </p>
        <ul>
          {dayFacts.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      <section className={styles.timeline}>
        <h3>Every September 12 orbit</h3>
        <div className={styles.orbitGrid}>
          {Array.from({ length: 2026 - BIRTH_YEAR + 1 }, (_, i) => BIRTH_YEAR + i).map((y) => (
            <button
              key={y}
              type="button"
              className={`${styles.orbitChip} ${y === year ? styles.orbitChipActive : ''}`}
              onClick={() => {
                setYear(y)
                setSelectedDateKey(`${y}-09-12`)
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
