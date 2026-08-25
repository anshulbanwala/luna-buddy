import { useMemo, useState } from 'react'
import { SKY_INTROS } from '../luna/companionVoices'
import {
  BIRTH_YEAR,
  PERSONAL,
  STAR_DATES,
  formatBirthTime,
  parseBirthDateTime,
} from '../config/personal'
import { AnimatedSkyCanvas } from './AnimatedSkyCanvas'
import { getSeptember12Facts } from './dayFacts'
import { computeSkySnapshot, getConstellationHighlights } from './skyCalculator'
import styles from './StarMapView.module.css'

export function StarMapView() {
  const [year, setYear] = useState(BIRTH_YEAR)
  const [chapter, setChapter] = useState(0)
  const [compare, setCompare] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [selectedDateKey, setSelectedDateKey] = useState(STAR_DATES[0]?.date ?? PERSONAL.BIRTH_DATE)

  const intro = SKY_INTROS[chapter % SKY_INTROS.length]

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
  const hoverStar = snapshot.stars.find((s) => s.id === hoverId) ?? null

  const selectChapter = (index: number) => {
    setChapter(index)
    const entry = STAR_DATES[index]
    if (entry) {
      setSelectedDateKey(entry.date)
      const y = Number(entry.date.split('-')[0])
      if (Number.isFinite(y)) setYear(y)
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <p className={styles.kicker}>Sky book</p>
        <h2 className={styles.title}>The ceiling of your first night</h2>
        <p className={styles.intro}>{intro}</p>
        <div className={styles.timeBadge}>
          <span>🕥</span>
          <div>
            <strong>{formatBirthTime()}</strong>
            <span>{PERSONAL.BIRTH_PLACE} · {viewDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className={styles.chapters} role="tablist" aria-label="Sky chapters">
        {STAR_DATES.map((entry, i) => (
          <button
            key={entry.date}
            type="button"
            role="tab"
            aria-selected={chapter === i}
            className={`${styles.chapter} ${chapter === i ? styles.chapterActive : ''}`}
            onClick={() => selectChapter(i)}
          >
            <span className={styles.chapterYear}>{entry.date.split('-')[0]}</span>
            <span className={styles.chapterLabel}>{entry.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.mapShell}>
        <button
          type="button"
          className={`${styles.compareBtn} ${compare ? styles.compareBtnActive : ''}`}
          onClick={() => setCompare((c) => !c)}
        >
          {compare ? '✦ Single page' : '⇆ Compare with birth night'}
        </button>

        <div className={`${styles.mapStage} ${compare ? styles.mapCompare : ''}`}>
          <div className={styles.mapPane}>
            {compare && <span className={styles.mapLabel}>{year}</span>}
            <AnimatedSkyCanvas
              snapshot={snapshot}
              size={compare ? 260 : 340}
              hoverId={hoverId}
              onHover={setHoverId}
              className={styles.canvas}
            />
          </div>
          {compare && (
            <div className={styles.mapPane}>
              <span className={styles.mapLabel}>{BIRTH_YEAR} · birth</span>
              <AnimatedSkyCanvas snapshot={birthSnapshot} size={260} className={styles.canvas} />
            </div>
          )}
        </div>

        {hoverStar && (
          <div className={styles.starCard}>
            <strong>{hoverStar.name}</strong>
            <span>{hoverStar.constellation}</span>
            <small>alt {Math.round(hoverStar.altitude)}° · magnitude {hoverStar.magnitude.toFixed(1)}</small>
          </div>
        )}

        <p className={styles.mapMeta}>
          {snapshot.meta.visibleCount} stars whispering · {highlights.join(' · ')}
        </p>
      </div>

      <label className={styles.yearSlider}>
        <span>Slide through every September 12</span>
        <input
          type="range"
          min={BIRTH_YEAR}
          max={2026}
          value={year}
          onChange={(e) => {
            const y = Number(e.target.value)
            setYear(y)
            setSelectedDateKey(`${y}-09-12`)
            setChapter(STAR_DATES.findIndex((d) => d.date.startsWith(String(y))))
          }}
        />
        <strong>{year}</strong>
      </label>

      <section className={styles.storyCard}>
        <h3>{dayFacts.headline}</h3>
        <p className={styles.moonFact}>
          Moon that night: <strong>{dayFacts.moonPhase}</strong> · {dayFacts.moonGlow}% soft glow
        </p>
        <ul>
          {dayFacts.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
