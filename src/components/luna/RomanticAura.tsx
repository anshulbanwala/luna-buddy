import { useEffect, useRef } from 'react'
import styles from './RomanticAura.module.css'

export function RomanticAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let frame: number
    const draw = (t: number) => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Soft aurora bands
      const bands = [
        { y: height * 0.15, color: '235, 140, 158', amp: 0.02 },
        { y: height * 0.7, color: '209, 184, 122', amp: 0.015 },
      ]

      for (const band of bands) {
        const grad = ctx.createLinearGradient(0, band.y - 80, 0, band.y + 80)
        const pulse = reduced ? 0.08 : 0.06 + Math.sin(t * 0.0008) * band.amp
        grad.addColorStop(0, `rgba(${band.color}, 0)`)
        grad.addColorStop(0.5, `rgba(${band.color}, ${pulse})`)
        grad.addColorStop(1, `rgba(${band.color}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, band.y - 80, width, 160)
      }

      // Vignette
      const vig = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.2,
        width / 2, height / 2, height * 0.85,
      )
      vig.addColorStop(0, 'rgba(10, 10, 13, 0)')
      vig.addColorStop(1, 'rgba(10, 10, 13, 0.55)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, width, height)

      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
}
