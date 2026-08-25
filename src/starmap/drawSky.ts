import type { SkySnapshot } from './skyCalculator'
import { starSize } from './skyCalculator'

export function drawSkyFrame(
  ctx: CanvasRenderingContext2D,
  snapshot: SkySnapshot,
  size: number,
  hoverId: string | null,
  twinkleT: number,
) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 28

  ctx.clearRect(0, 0, size, size)

  // Cute sticker frame
  ctx.fillStyle = 'rgba(255, 228, 240, 0.08)'
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2)
  ctx.fill()

  const grad = ctx.createRadialGradient(cx, cy - radius * 0.15, 0, cx, cy, radius)
  grad.addColorStop(0, 'rgba(45, 35, 75, 0.98)')
  grad.addColorStop(0.5, 'rgba(18, 14, 38, 0.99)')
  grad.addColorStop(1, 'rgba(8, 6, 18, 1)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()
  const mw = ctx.createLinearGradient(cx - radius, cy - 20, cx + radius, cy + radius * 0.4)
  mw.addColorStop(0, 'transparent')
  mw.addColorStop(0.4, 'rgba(205, 180, 219, 0.12)')
  mw.addColorStop(0.55, 'rgba(255, 200, 221, 0.08)')
  mw.addColorStop(1, 'transparent')
  ctx.fillStyle = mw
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 1.2)
  ctx.restore()

  ctx.strokeStyle = 'rgba(255, 200, 221, 0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255, 220, 200, 0.65)'
  ctx.font = '600 10px Inter, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('N', cx, cy - radius + 14)
  ctx.fillText('S', cx, cy + radius - 6)
  ctx.fillText('E', cx + radius - 8, cy + 4)
  ctx.fillText('W', cx - radius + 8, cy + 4)

  // Constellation lines + labels
  const labelSpots = new Map<string, { x: number; y: number; count: number }>()
  ctx.strokeStyle = 'rgba(180, 200, 255, 0.32)'
  ctx.lineWidth = 1.2
  ctx.setLineDash([5, 7])
  for (const line of snapshot.lines) {
    ctx.beginPath()
    ctx.moveTo(cx + line.x1, cy + line.y1)
    ctx.lineTo(cx + line.x2, cy + line.y2)
    ctx.stroke()
    const mx = (line.x1 + line.x2) / 2
    const my = (line.y1 + line.y2) / 2
    const prev = labelSpots.get(line.name)
    if (prev) {
      prev.x += mx
      prev.y += my
      prev.count++
    } else {
      labelSpots.set(line.name, { x: mx, y: my, count: 1 })
    }
  }
  ctx.setLineDash([])

  ctx.font = '500 9px Inter, system-ui'
  ctx.fillStyle = 'rgba(205, 180, 219, 0.75)'
  for (const [name, spot] of labelSpots) {
    const lx = cx + spot.x / spot.count
    const ly = cy + spot.y / spot.count
    ctx.fillText(name, lx, ly - 6)
  }

  for (const star of snapshot.stars) {
    const tw = 0.65 + 0.35 * Math.sin(twinkleT * 0.002 + star.x * 0.1 + star.y * 0.07)
    const r = starSize(star.magnitude) * (0.9 + tw * 0.15)
    const alpha = Math.min(1, (0.45 + (3 - star.magnitude) * 0.2) * tw)
    const isHover = hoverId === star.id

    if (isHover) {
      ctx.fillStyle = 'rgba(255, 180, 200, 0.4)'
      ctx.beginPath()
      ctx.arc(cx + star.x, cy + star.y, r + 10, 0, Math.PI * 2)
      ctx.fill()
    }

    if (star.magnitude < 1.5) {
      ctx.fillStyle = `rgba(255, 230, 250, ${alpha * 0.25})`
      ctx.beginPath()
      ctx.arc(cx + star.x, cy + star.y, r * 2.5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = `rgba(255, 248, 240, ${alpha})`
    ctx.beginPath()
    ctx.arc(cx + star.x, cy + star.y, r, 0, Math.PI * 2)
    ctx.fill()

    if (star.magnitude < 0.5) {
      ctx.strokeStyle = `rgba(255, 220, 180, ${alpha * 0.5})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx + star.x - r * 2, cy + star.y)
      ctx.lineTo(cx + star.x + r * 2, cy + star.y)
      ctx.moveTo(cx + star.x, cy + star.y - r * 2)
      ctx.lineTo(cx + star.x, cy + star.y + r * 2)
      ctx.stroke()
    }
  }

  for (const planet of snapshot.planets) {
    ctx.fillStyle = 'rgba(255, 210, 160, 0.95)'
    ctx.beginPath()
    ctx.arc(cx + planet.x, cy + planet.y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '500 9px Inter, system-ui'
    ctx.fillStyle = 'rgba(255, 220, 200, 0.8)'
    ctx.textAlign = 'left'
    ctx.fillText(planet.name, cx + planet.x + 8, cy + planet.y + 3)
  }

  if (snapshot.moon) {
    ctx.fillStyle = 'rgba(255, 252, 245, 0.98)'
    ctx.beginPath()
    ctx.arc(cx + snapshot.moon.x, cy + snapshot.moon.y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255, 230, 210, 0.75)'
    ctx.fillText('Moon', cx + snapshot.moon.x + 10, cy + snapshot.moon.y + 3)
  }
}

export function findNearestStar(
  snapshot: SkySnapshot,
  mx: number,
  my: number,
  size: number,
): (typeof snapshot.stars)[0] | null {
  const cx = size / 2
  const cy = size / 2
  let best: (typeof snapshot.stars)[0] | null = null
  let bestD = 22
  for (const s of snapshot.stars) {
    const d = Math.hypot(mx - (cx + s.x), my - (cy + s.y))
    if (d < bestD) {
      bestD = d
      best = s
    }
  }
  return best
}
