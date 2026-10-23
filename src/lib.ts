import { useEffect, useRef, useState } from 'react'

export const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 2147483647; return h || 1 }

/** A hand-drawn island coastline: noisy ellipse smoothed with Catmull-Rom. */
export function blob(seed: string, r: number, wob = 0.26, n = 14): string {
  const rand = rng(hash(seed))
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const k = 1 + (rand() - 0.5) * 2 * wob
    pts.push([Math.cos(a) * r * 1.25 * k, Math.sin(a) * r * 0.9 * k])
  }
  let d = ''
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    if (i === 0) d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

export function useCountUp(to: number, ms = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0; const t0 = performance.now(); const from = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - p, 3)
      setV(Math.round(from + (to - from) * e)); if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [to, ms])
  return v
}

export function useTypewriter(text: string, speed = 18, start = true) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0); if (!start) return
    let i = 0; const id = setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(id) }, speed)
    return () => clearInterval(id)
  }, [text, speed, start])
  return { text: text.slice(0, n), done: n >= text.length }
}

export const useReducedMotion = () => {
  const r = useRef(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  return r.current
}

export const roman = (n: number) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'][n] ?? String(n)
export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')
