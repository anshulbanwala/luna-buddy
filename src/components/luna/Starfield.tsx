import { useEffect, useRef } from 'react'
import styles from './Starfield.module.css'

export function Starfield({ count = 45 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: count }, (_, i) => ({
      x: ((Math.sin(i * 97 + 13) * 0.5 + 0.5) * canvas.width) || 0,
      y: ((Math.cos(i * 97 * 1.3 + 13) * 0.5 + 0.5) * canvas.height) || 0,
      seed: i * 97 + 13,
      r: 1 + (i % 3),
    }))

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const star of stars) {
        const twinkle = reducedMotion ? 0.5 : 0.3 + 0.7 * Math.abs(Math.sin(t * 0.0005 + star.seed))
        ctx.fillStyle = `rgba(209, 184, 122, ${twinkle * 0.55})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
}
