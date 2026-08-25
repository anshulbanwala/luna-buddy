import { useEffect, useRef } from 'react'
import type { SkySnapshot } from './skyCalculator'
import { drawSkyFrame } from './drawSky'

interface AnimatedSkyCanvasProps {
  snapshot: SkySnapshot
  size?: number
  hoverId?: string | null
  onHover?: (starId: string | null) => void
  className?: string
}

export function AnimatedSkyCanvas({
  snapshot,
  size = 360,
  hoverId = null,
  onHover,
  className,
}: AnimatedSkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const paint = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawSkyFrame(ctx, snapshot, size, hoverId, reduced ? 0 : t)
      if (!reduced) rafRef.current = requestAnimationFrame(paint)
    }

    rafRef.current = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(rafRef.current)
  }, [snapshot, size, hoverId])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Animated star map"
      onMouseMove={(e) => {
        if (!onHover) return
        const rect = e.currentTarget.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        const cx = size / 2
        const cy = size / 2
        let best: string | null = null
        let bestD = 22
        for (const s of snapshot.stars) {
          const d = Math.hypot(mx - (cx + s.x), my - (cy + s.y))
          if (d < bestD) {
            bestD = d
            best = s.id
          }
        }
        onHover(best)
      }}
      onMouseLeave={() => onHover?.(null)}
    />
  )
}
