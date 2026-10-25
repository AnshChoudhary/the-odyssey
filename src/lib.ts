import { useEffect, useRef, useState } from 'react'

export const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 2147483647; return h || 1 }

/** A surveyed coastline: noisy ellipse smoothed with Catmull-Rom. */
export function blob(seed: string, r: number, wob = 0.22, n = 18): string {
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

/* ---------------------------------------------------------- simplex noise */
const G3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]]
const PERM = (() => { const r = rng(4242), p = Array.from({ length: 256 }, (_, i) => i); for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]] } return new Uint8Array([...p, ...p]) })()
export function noise3(x: number, y: number, z: number): number {
  const F = 1 / 3, G = 1 / 6
  const s = (x + y + z) * F, i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s)
  const t = (i + j + k) * G, x0 = x - i + t, y0 = y - j + t, z0 = z - k + t
  let i1, j1, k1, i2, j2, k2
  if (x0 >= y0) { if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 } else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 } else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 } }
  else { if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 } else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 } else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 } }
  const c = [[x0, y0, z0, 0, 0, 0], [x0 - i1 + G, y0 - j1 + G, z0 - k1 + G, i1, j1, k1], [x0 - i2 + 2 * G, y0 - j2 + 2 * G, z0 - k2 + 2 * G, i2, j2, k2], [x0 - 1 + 3 * G, y0 - 1 + 3 * G, z0 - 1 + 3 * G, 1, 1, 1]]
  const ii = i & 255, jj = j & 255, kk = k & 255
  let n = 0
  for (const [a, b, d, oi, oj, ok] of c) {
    let tt = 0.6 - a * a - b * b - d * d
    if (tt < 0) continue
    const g = G3[PERM[ii + oi + PERM[jj + oj + PERM[kk + ok]]] % 12]
    tt *= tt; n += tt * tt * (g[0] * a + g[1] * b + g[2] * d)
  }
  return 32 * n
}

/** Marching squares over a grid of samples; strokes every level into its own path. */
export function contour(g: CanvasRenderingContext2D, v: Float32Array, cols: number, rows: number, cs: number, level: number) {
  g.beginPath()
  for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
    const i = y * cols + x
    const a = v[i], b = v[i + 1], c = v[i + cols + 1], d = v[i + cols]
    const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0)
    if (idx === 0 || idx === 15) continue
    const px = x * cs, py = y * cs
    const T = () => [px + cs * (level - a) / (b - a), py] as const
    const R = () => [px + cs, py + cs * (level - b) / (c - b)] as const
    const B = () => [px + cs * (level - d) / (c - d), py + cs] as const
    const L = () => [px, py + cs * (level - a) / (d - a)] as const
    const seg = (p: readonly [number, number], q: readonly [number, number]) => { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]) }
    switch (idx) {
      case 1: case 14: seg(L(), B()); break
      case 2: case 13: seg(B(), R()); break
      case 3: case 12: seg(L(), R()); break
      case 4: case 11: seg(T(), R()); break
      case 5: seg(L(), T()); seg(B(), R()); break
      case 6: case 9: seg(T(), B()); break
      case 7: case 8: seg(L(), T()); break
      case 10: seg(T(), R()); seg(L(), B()); break
    }
  }
  g.stroke()
}

/* ------------------------------------------- the chart is the Ionian Sea */
export const toLat = (wy: number) => 38.95 - (wy / 1000) * 1.1
export const toLon = (wx: number) => 19.9 + (wx / 1600) * 1.9
const dm = (v: number, p: string, n: string) => { const a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60; return `${d}°${m.toFixed(1).padStart(4, '0')}′${v >= 0 ? p : n}` }
export const fmtLat = (wy: number) => dm(toLat(wy), 'N', 'S')
export const fmtLon = (wx: number) => dm(toLon(wx), 'E', 'W')
/** nautical miles per world unit, horizontally */
export const NM_PER_UNIT = (1.9 * 60 * Math.cos((38.4 * Math.PI) / 180)) / 1600

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
    let i = 0; const id = setInterval(() => { i += 2; setN(i); if (i >= text.length) clearInterval(id) }, speed)
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
export const pad = (n: number) => String(n).padStart(2, '0')
