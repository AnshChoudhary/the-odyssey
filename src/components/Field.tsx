import { useEffect, useRef } from 'react'
import { contour, noise3 } from '../lib'

/**
 * A drifting bathymetric field: simplex noise traced into contour lines.
 * Used behind the intro, the index and the night pages so every surface reads as the same sea.
 */
export function Field({ className, scale = 0.0021, speed = 1, alpha = 0.16, levels = 14, cell = 12, tint = '170,196,206', fps = 30, mouse = true }:
  { className?: string; scale?: number; speed?: number; alpha?: number; levels?: number; cell?: number; tint?: string; fps?: number; mouse?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!, g = c.getContext('2d')!
    let w = 0, h = 0, cols = 0, rows = 0, v = new Float32Array(0), raf = 0, last = 0
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    const fit = () => {
      const d = Math.min(1.5, devicePixelRatio || 1)
      w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; g.setTransform(d, 0, 0, d, 0, 0)
      cols = Math.ceil(w / cell) + 2; rows = Math.ceil(h / cell) + 2; v = new Float32Array(cols * rows)
    }
    fit()
    const ro = new ResizeObserver(fit); ro.observe(c)
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.tx = e.clientX - r.left; m.ty = e.clientY - r.top }
    if (mouse) addEventListener('pointermove', move)
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 1000 / fps) return
      last = t
      m.x += (m.tx - m.x) * 0.06; m.y += (m.ty - m.y) * 0.06
      const z = t * 0.000045 * speed
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const px = x * cell, py = y * cell
        const dx = px - m.x, dy = py - m.y
        const bump = Math.exp(-(dx * dx + dy * dy) / 26000) * 0.55
        v[y * cols + x] = noise3(px * scale, py * scale, z) * 0.8 + noise3(px * scale * 2.6, py * scale * 2.6, z * 1.6) * 0.22 + bump
      }
      g.clearRect(0, 0, w, h)
      g.lineWidth = 1
      for (let i = 0; i < levels; i++) {
        const lv = -0.9 + (i / (levels - 1)) * 1.8
        const major = i % 4 === 0
        g.strokeStyle = `rgba(${tint},${major ? alpha * 1.7 : alpha})`
        contour(g, v, cols, rows, cell, lv)
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', move) }
  }, [scale, speed, alpha, levels, cell, tint, fps, mouse])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}
