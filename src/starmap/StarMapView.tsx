import { useEffect, useMemo, useRef, useState } from 'react'
import { BIRTH_YEAR, PERSONAL, STAR_DATES, parseBirthDateTime } from '../config/personal'
import { getSeptember12Facts } from './dayFacts'
import { computeSkySnapshot, getConstellationHighlights, starSize } from './skyCalculator'
import styles from './StarMapView.module.css'

export function StarMapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [year, setYear] = useState(BIRTH_YEAR)
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

  const snapshot = useMemo(
    () => computeSkySnapshot(viewDate, PERSONAL.BIRTH_LAT, PERSONAL.BIRTH_LON, PERSONAL.BIRTH_PLACE),
    [viewDate],
  )

  const dayFacts = useMemo(() => getSeptember12Facts(viewDate.getFullYear()), [viewDate])
  const highlights = useMemo(() => getConstellationHighlights(snapshot), [snapshot])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 360
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 24

    ctx.clearRect(0, 0, size, size)

    // Sky gradient
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    grad.addColorStop(0, 'rgba(20, 16, 40, 0.95)')
    grad.addColorStop(0.7, 'rgba(8, 8, 16, 0.98)')
    grad.addColorStop(1, 'rgba(4, 4, 8, 1)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()

    // Horizon ring
    ctx.strokeStyle = 'rgba(209, 184, 122, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Cardinal labels
    ctx.fillStyle = 'rgba(209, 184, 122, 0.6)'
    ctx.font = '11px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('N', cx, cy - radius + 14)
    ctx.fillText('S', cx, cy + radius - 6)
    ctx.fillText('E', cx + radius - 8, cy + 4)
    ctx.fillText('W', cx - radius + 8, cy + 4)

    // Constellation lines
    ctx.strokeStyle = 'rgba(120, 160, 220, 0.22)'
    ctx.lineWidth = 1
    for (const line of snapshot.lines) {
      ctx.beginPath()
      ctx.moveTo(cx + line.x1, cy + line.y1)
      ctx.lineTo(cx + line.x2, cy + line.y2)
      ctx.stroke()
    }

    // Stars
    for (const star of snapshot.stars) {
      const r = starSize(star.magnitude)
      const alpha = Math.min(1, 0.35 + (3 - star.magnitude) * 0.2)
      ctx.fillStyle = `rgba(245, 240, 230, ${alpha})`
      ctx.beginPath()
      ctx.arc(cx + star.x, cy + star.y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Planets
    for (const planet of snapshot.planets) {
      ctx.fillStyle = 'rgba(212, 188, 130, 0.95)'
      ctx.beginPath()
      ctx.arc(cx + planet.x, cy + planet.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(212, 188, 130, 0.7)'
      ctx.font = '10px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText(planet.name, cx + planet.x + 7, cy + planet.y + 3)
    }

    // Moon
    if (snapshot.moon) {
      ctx.fillStyle = 'rgba(255, 249, 240, 0.95)'
      ctx.beginPath()
      ctx.arc(cx + snapshot.moon.x, cy + snapshot.moon.y, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255, 249, 240, 0.7)'
      ctx.font = '10px system-ui'
      ctx.fillText('Moon', cx + snapshot.moon.x + 9, cy + snapshot.moon.y + 3)
    }

    // Moon highlight ring reserved for future tap-to-identify
  }, [snapshot])

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.title}>Birth star map</h2>
        <p className={styles.subtitle}>
          {PERSONAL.BIRTH_PLACE} · {viewDate.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </header>

      <div className={styles.controls}>
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

      <div className={styles.mapCard}>
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Star map" />
        <p className={styles.mapMeta}>
          {snapshot.meta.visibleCount} stars visible · {highlights.join(' · ')}
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
