import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTES, SHIPPED, VOYAGE, COUNSEL, NOW_WEEK, TRACK, HEADLINE, WEEKS, PERSON } from '../data'
import { LiveIsland, landmarks, liveIslands, shippedCount, useStore } from '../store'
import { NM_PER_UNIT, blob, contour, fmtLat, fmtLon, hash, noise3, pad, rng, useCountUp, useTypewriter } from '../lib'

const W = 1600, H = 1000
const ROSE = { x: 1092, y: 640 }
let counselShown = false
const NS = { vectorEffect: 'non-scaling-stroke' } as const

/* ------------------------------------------------------------------ coast */
const CS = 10
const COAST: [number, number][] = (() => { const p: [number, number][] = []; for (let y = -60; y <= H + 60; y += CS) p.push([396 + Math.sin(y / 150) * 24 + noise3(.5, y * .011, 3) * 34 + noise3(.5, y * .045, 7) * 7, y]); return p })()
const coastX = (y: number) => { const i = Math.max(0, Math.min(COAST.length - 2, Math.floor((y + 60) / CS))); const [x0, y0] = COAST[i], [x1] = COAST[i + 1]; const t = (y - y0) / CS; return x0 + (x1 - x0) * t }

/* ------------------------------------------------------------------ camera */
type Cam = { x: number; y: number; k: number }
function useCamera(stage: React.RefObject<HTMLDivElement>, world: React.RefObject<HTMLDivElement>, onFrame: (c: Cam, moving: boolean, t: number) => void) {
  const cur = useRef<Cam>({ x: 0, y: 0, k: 1 }), tgt = useRef<Cam>({ x: 0, y: 0, k: 1 })
  const frame = useRef(onFrame); frame.current = onFrame
  const cover = () => { const s = stage.current!; return Math.max(s.clientWidth / W, s.clientHeight / H) }
  const clamp = useCallback((c: Cam) => {
    const s = stage.current!, kc = cover()
    c.k = Math.min(kc * 4.5, Math.max(kc * 0.7, c.k))
    const fx = (lo: number, v: number) => (lo > 0 ? lo / 2 : Math.min(0, Math.max(lo, v)))
    c.x = fx(s.clientWidth - W * c.k, c.x); c.y = fx(s.clientHeight - H * c.k, c.y)
    return c
  }, [stage])
  const auto = useRef(true)
  const focus = useCallback((wx: number, wy: number, k: number, offX = 0) => {
    auto.current = false
    const s = stage.current!
    tgt.current = clamp({ k, x: s.clientWidth / 2 - offX - wx * k, y: s.clientHeight / 2 - wy * k })
  }, [clamp, stage])
  const fit = useCallback(() => { focus(W / 2, H / 2, cover() * 1.001); auto.current = true }, [focus])
  const zoomBy = useCallback((f: number, px?: number, py?: number) => {
    auto.current = false
    const s = stage.current!, t = tgt.current
    px ??= s.clientWidth / 2; py ??= s.clientHeight / 2
    const nk = Math.min(cover() * 4.5, Math.max(cover() * 0.7, t.k * f)), r = nk / t.k
    tgt.current = clamp({ k: nk, x: px - (px - t.x) * r, y: py - (py - t.y) * r })
  }, [clamp, stage])

  useEffect(() => {
    const s = stage.current!
    fit(); const t = tgt.current
    /* arrival: start low over the ship and pull back to the whole chart */
    const kc = cover(), [sx, sy] = TRACK[NOW_WEEK]
    cur.current = clamp({ k: kc * 2.6, x: s.clientWidth / 2 - sx * kc * 2.6, y: s.clientHeight / 2 - sy * kc * 2.6 }); tgt.current = t
    let raf = 0
    const tick = (now: number) => {
      const c = cur.current, g = tgt.current, e = 0.085
      const moving = Math.abs(g.x - c.x) + Math.abs(g.y - c.y) + Math.abs(g.k - c.k) * 400 > 0.05
      c.x += (g.x - c.x) * e; c.y += (g.y - c.y) * e; c.k += (g.k - c.k) * e
      world.current!.style.transform = `translate3d(${c.x}px,${c.y}px,0) scale(${c.k})`
      frame.current(c, moving, now)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onResize = () => { if (auto.current) fit(); else tgt.current = clamp({ ...tgt.current }) }
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize) }
  }, [clamp, fit, stage, world])
  return { cur, tgt, focus, fit, zoomBy, clamp, cover, auto }
}

/* ---------------------------------------------------- bathymetry (canvas) */
type Bump = { x: number; y: number; r: number; a: number; to: number }
function useSea(canvas: React.RefObject<HTMLCanvasElement>) {
  const st = useRef({ w: 0, h: 0, d: 1, cols: 0, rows: 0, v: new Float32Array(0), last: 0, lastCam: '' })
  const bumps = useRef(new Map<string, Bump>())
  useEffect(() => {
    const c = canvas.current!
    const fit = () => { const s = st.current; s.d = Math.min(1.5, devicePixelRatio || 1); s.w = c.clientWidth; s.h = c.clientHeight; c.width = s.w * s.d; c.height = s.h * s.d; s.lastCam = '' }
    fit(); const ro = new ResizeObserver(fit); ro.observe(c); return () => ro.disconnect()
  }, [canvas])
  const draw = useCallback((cam: Cam, moving: boolean, now: number) => {
    const s = st.current, c = canvas.current; if (!c || !s.w) return
    let settling = false
    bumps.current.forEach((b, id) => { const d = b.to - b.a; if (Math.abs(d) > .002) { b.a += d * .05; settling = true } else if (b.to === 0) bumps.current.delete(id) })
    if (!moving && !settling && now - s.last < 66) return
    s.last = now
    const g = c.getContext('2d')!
    g.setTransform(s.d, 0, 0, s.d, 0, 0)
    const cs = moving ? 13 : 10
    const cols = Math.ceil(s.w / cs) + 2, rows = Math.ceil(s.h / cs) + 2
    if (s.v.length < cols * rows) s.v = new Float32Array(cols * rows)
    const v = s.v, z = now * 0.000028, bs = [...bumps.current.values()]
    for (let y = 0; y < rows; y++) {
      const wy = (y * cs - cam.y) / cam.k, cxw = coastX(wy)
      for (let x = 0; x < cols; x++) {
        const wx = (x * cs - cam.x) / cam.k
        let f = -0.62 + noise3(wx * 0.0032, wy * 0.0032, z) * 0.3 + noise3(wx * 0.011, wy * 0.011, z * 1.5) * 0.07
        f += 1.35 / (1 + Math.exp(-(cxw - wx) / 46))
        for (const b of bs) { const dx = (wx - b.x) / 1.25, dy = (wy - b.y) / 0.9, rr = b.r * 1.15; f += b.a * Math.exp(-(dx * dx + dy * dy) / (2 * rr * rr)) }
        v[y * cols + x] = f
      }
    }
    g.clearRect(0, 0, s.w, s.h)
    /* land */
    g.save(); g.beginPath()
    for (let wy = -60; wy <= H + 60; wy += CS) { const px = coastX(wy) * cam.k + cam.x, py = wy * cam.k + cam.y; wy === -60 ? g.moveTo(px, py) : g.lineTo(px, py) }
    g.lineTo(-2000 * cam.k + cam.x, (H + 60) * cam.k + cam.y); g.lineTo(-2000 * cam.k + cam.x, -60 * cam.k + cam.y); g.closePath()
    g.fillStyle = '#10151b'; g.fill()
    g.lineWidth = 1.1; g.strokeStyle = 'rgba(233,228,216,.62)'; g.stroke()
    g.clip()
    g.lineWidth = .7
    for (let i = 0; i < 13; i++) { g.strokeStyle = `rgba(233,228,216,${i % 4 === 0 ? .2 : .1})`; contour(g, v, cols, rows, cs, 0.16 + i * 0.085) }
    g.restore()
    /* sea */
    g.save(); g.beginPath(); g.rect(0, 0, s.w, s.h)
    for (let wy = -60; wy <= H + 60; wy += CS) { const px = coastX(wy) * cam.k + cam.x, py = wy * cam.k + cam.y; wy === -60 ? g.moveTo(px, py) : g.lineTo(px, py) }
    g.lineTo(-2000 * cam.k + cam.x, (H + 60) * cam.k + cam.y); g.lineTo(-2000 * cam.k + cam.x, -60 * cam.k + cam.y); g.closePath()
    g.clip('evenodd')
    g.lineWidth = .8
    for (let i = 0; i < 9; i++) {
      const lv = -0.6 + i * 0.07
      g.strokeStyle = `rgba(160,190,202,${(i % 3 === 2 ? .2 : .1) + i * .012})`
      contour(g, v, cols, rows, cs, lv)
    }
    g.restore()
  }, [canvas])
  return { draw, bumps }
}

/* -------------------------------------------------------------- chart art */
const Rose = memo(function Rose() {
  const R = 58
  return (
    <g transform={`translate(${ROSE.x},${ROSE.y})`} className="rose" fill="none" stroke="var(--bone)">
      <circle r={R} strokeWidth=".8" {...NS} opacity=".7" /><circle r={R - 9} strokeWidth=".5" {...NS} opacity=".5" />
      {Array.from({ length: 72 }, (_, i) => { const a = (i * 5 * Math.PI) / 180, l = i % 18 === 0 ? 12 : i % 2 === 0 ? 7 : 4; return <path key={i} d={`M${Math.sin(a) * R} ${-Math.cos(a) * R} L${Math.sin(a) * (R - l)} ${-Math.cos(a) * (R - l)}`} strokeWidth=".6" {...NS} opacity=".7" /> })}
      {Array.from({ length: 8 }, (_, i) => { const a = (i * 45 * Math.PI) / 180, l = i % 2 ? R * .55 : R - 12, w = i % 2 ? 4 : 6.5; const px = Math.sin(a), py = -Math.cos(a), qx = Math.cos(a), qy = Math.sin(a)
        return <g key={i}><path d={`M0 0 L${px * l} ${py * l} L${qx * w} ${qy * w}Z`} fill={i === 0 ? 'var(--signal)' : 'var(--bone)'} stroke="none" opacity={i === 0 ? 1 : .8} /><path d={`M0 0 L${px * l} ${py * l} L${-qx * w} ${-qy * w}Z`} strokeWidth=".6" {...NS} fill="var(--ink)" /></g> })}
      <circle r="2.4" fill="var(--bone)" stroke="none" />
      <text y={-R - 8} textAnchor="middle" className="rose-n">N</text>
      <text y={R + 18} textAnchor="middle" className="micro">VAR 4°E · 2026</text>
    </g>
  )
})

const Rhumbs = memo(function Rhumbs() {
  return <g stroke="var(--bone)" strokeWidth=".5" opacity=".075" {...NS}>
    {Array.from({ length: 32 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return <path key={i} d={`M${ROSE.x} ${ROSE.y} L${ROSE.x + Math.cos(a) * 2400} ${ROSE.y + Math.sin(a) * 2400}`} {...NS} /> })}
  </g>
})

const Graticule = memo(function Graticule() {
  const xs = Array.from({ length: 15 }, (_, i) => (i + 1) * 100), ys = Array.from({ length: 9 }, (_, i) => (i + 1) * 100)
  return <g className="grat">
    <g stroke="var(--bone)" strokeWidth=".5" opacity=".07">{xs.map((x) => <path key={x} d={`M${x} 0V${H}`} {...NS} />)}{ys.map((y) => <path key={y} d={`M0 ${y}H${W}`} {...NS} />)}</g>
    {xs.filter((x) => x % 200 === 0 && x > 400).map((x) => <text key={x} x={x + 4} y={H - 8} className="micro">{fmtLon(x)}</text>)}
    {ys.filter((y) => y % 200 === 0).map((y) => <text key={y} x={coastX(y) + 12} y={y - 4} className="micro">{fmtLat(y)}</text>)}
  </g>
})

const Soundings = memo(function Soundings({ avoid }: { avoid: { x: number; y: number; r: number }[] }) {
  const pts = useMemo(() => {
    const r = rng(19), out: { x: number; y: number; d: number }[] = []
    for (let i = 0; i < 400 && out.length < 74; i++) {
      const x = 430 + r() * 1150, y = 90 + r() * 880
      if (x < coastX(y) + 34) continue
      if (avoid.some((a) => Math.hypot((x - a.x) / 1.25, (y - a.y) / .9) < a.r * 1.7 + 40)) continue
      if (Math.hypot(x - ROSE.x, y - ROSE.y) < 90) continue
      if (out.some((o) => Math.hypot(o.x - x, o.y - y) < 46)) continue
      out.push({ x, y, d: Math.round(8 + r() * 70 + (x - 400) / 30) })
    }
    return out
  }, [avoid])
  return <g className="soundings">{pts.map((p, i) => <text key={i} x={p.x} y={p.y}>{p.d}<tspan dy="3" fontSize="7">{(p.d * 7) % 9}</tspan></text>)}</g>
})

function Track({ week }: { week: number }) {
  const weeks = Object.keys(TRACK).map(Number).filter((w) => w <= week)
  const pts = weeks.map((w) => TRACK[w])
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ')
  return (
    <g className="track">
      <path d={d} fill="none" stroke="var(--bone)" strokeWidth=".9" strokeDasharray="5 4" opacity=".55" {...NS} />
      {weeks.slice(0, -1).map((w) => <g key={w} transform={`translate(${TRACK[w][0]},${TRACK[w][1]})`}>
        <circle r="3.4" fill="var(--ink)" stroke="var(--bone)" strokeWidth=".8" {...NS} opacity=".8" /><text x="8" y="-6" className="micro">W{w}</text></g>)}
    </g>
  )
}

function Ship({ week, onBoard }: { week: number; onBoard: () => void }) {
  const ws = Object.keys(TRACK).map(Number).filter((w) => w <= week)
  const [x, y] = TRACK[week], prev = TRACK[ws[ws.length - 2]] ?? [x - 60, y + 10]
  const hd = (Math.atan2(y - prev[1], x - prev[0]) * 180) / Math.PI
  return (
    <motion.g className="ship" initial={false} animate={{ x, y }} transition={{ duration: 1.4, ease: [.65, 0, .35, 1] }}
      role="button" tabIndex={0} aria-label="Board your ship and meet the crew" data-ship data-cursor="Board" onKeyDown={(e) => e.key === 'Enter' && onBoard()}>
      <circle r="34" className="ship-hit" />
      <circle r="20" className="ship-ring" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <circle r="20" className="ship-ring r2" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <motion.g animate={{ rotate: hd }} transition={{ duration: 1.4 }}>
        <path d="M40 0 H90" stroke="var(--bone)" strokeWidth=".8" strokeDasharray="2 4" {...NS} opacity=".7" />
        <path d="M16 0 C 8 -6, -6 -7, -14 -5 L -14 5 C -6 7, 8 6, 16 0Z" fill="var(--bone)" />
        <path d="M-14 -5 L-14 5" stroke="var(--ink)" strokeWidth="1" />
      </motion.g>
      <text x="0" y="40" textAnchor="middle" className="ship-t">{PERSON.first} · W{week}</text>
      <text x="0" y="54" textAnchor="middle" className="micro ship-sub">board the ship</text>
    </motion.g>
  )
}

const Ring = ({ id, r, s, w, o }: { id: string; r: number; s: number; w: number; o: number }) => <path d={blob(id + s, r * s, .3, 16)} fill="none" stroke="currentColor" strokeWidth={w} opacity={o} {...NS} />

const IslandArt = memo(function IslandArt({ isl, selected }: { isl: LiveIsland; selected: boolean }) {
  const d = useMemo(() => blob(isl.id, isl.r), [isl.id, isl.r])
  const shoal = useMemo(() => blob(isl.id + 'sh', isl.r * 1.3, .12), [isl.id, isl.r])
  const rocks = useMemo(() => { const r = rng(hash(isl.id + 'k')); return Array.from({ length: 5 }, () => { const a = r() * Math.PI * 2, k = 1.35 + r() * .2; return [Math.cos(a) * isl.r * 1.25 * k, Math.sin(a) * isl.r * .9 * k] }) }, [isl.id, isl.r])
  const sink = isl.state === 'sinking', over = isl.state === 'overdue'
  const ex = isl.r * 1.25, ey = isl.r * .9
  const lx = isl.lab === 'r' ? ex + 16 : isl.lab === 'l' ? -ex - 16 : 0, ly = isl.lab === 'b' ? ey + 26 : -2
  const anchor = isl.lab === 'r' ? 'start' : isl.lab === 'l' ? 'end' : 'middle'
  const meta = `${isl.src} · ${isl.age}d${over ? ' · overdue' : ''}${isl.who ? ' · with ' + isl.who.split(' ')[0] : ''}`
  return (
    <g className={`isl ${isl.state}${selected ? ' sel' : ''}`}>
      <ellipse rx={ex * 1.35} ry={ey * 1.35} className="hit" />
      <path d={shoal} className="shoal" fill="none" strokeWidth=".7" strokeDasharray="1 3.5" strokeLinecap="round" {...NS} />
      {sink && [0, 1].map((i) => <ellipse key={i} className="ripple" style={{ animationDelay: `${i * 2}s` }} rx={ex} ry={ey} fill="none" stroke="var(--bone)" strokeWidth=".6" {...NS} />)}
      {over && <g className="danger"><circle r={isl.r * 1.75} fill="none" stroke="var(--signal)" strokeWidth=".8" strokeDasharray="2 5" {...NS} />
        {rocks.map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`} stroke="var(--signal)" strokeWidth=".8"><path d="M-3.5 0H3.5M0 -3.5V3.5" {...NS} /></g>)}</g>}
      <g className="land">
        <path d={d} className="coast" strokeWidth={over ? 1.3 : 1} strokeDasharray={sink ? '4 3' : undefined} {...NS} />
        {!sink && <path d={d} fill="url(#hatch)" stroke="none" />}
        <Ring id={isl.id} r={isl.r} s={.74} w={.6} o={.55} /><Ring id={isl.id} r={isl.r} s={.5} w={.6} o={.45} /><Ring id={isl.id} r={isl.r} s={.27} w={.6} o={.4} />
        <circle r="1.6" fill="currentColor" opacity=".8" />
      </g>
      {isl.flare && (
        <g transform={`translate(${ex * .72},${-ey * .95})`} className="light">
          <path className="flash" d="M0 0 C-7 -9 -5 -21 0 -24 C5 -21 7 -9 0 0Z" fill="var(--signal)" />
          <circle r="2.6" fill="var(--bone)" />
          <text x="10" y="-12" className="micro sig">FL R · 6h</text>
        </g>
      )}
      <g className="label" transform={`translate(${lx},${ly})`}>
        <text textAnchor={anchor} className="isl-t">{sink ? isl.quote.split('·')[0].trim() : isl.label}{sink && <tspan className="ed"> (E.D.)</tspan>}</text>
        <text textAnchor={anchor} y="15" className={`micro${over ? ' sig' : ''}`}>{meta}</text>
      </g>
      {selected && <g className="brackets" stroke="var(--bone)" strokeWidth="1" fill="none">
        {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => <path key={sx + ',' + sy} d={`M${sx * (ex + 22)} ${sy * (ey + 22) - sy * 12} V${sy * (ey + 22)} H${sx * (ex + 22) - sx * 12}`} {...NS} />)}
      </g>}
    </g>
  )
})

const Continent = memo(function Continent({ marks, selected, shipped, week }: { marks: { t: string; d: string; isNew: boolean }[]; selected: string | null; shipped: number; week: number }) {
  return (
    <g className="continent">
      <text x="44" y="118" className="cont-t">The Shipped</text>
      <text x="44" y="160" className="cont-t it">Continent</text>
      <text x="46" y="190" className="micro">{shipped} landings · week {week}</text>
      <path d="M46 206 H300" stroke="var(--bone)" strokeWidth=".6" opacity=".35" {...NS} />
      {marks.map((m, i) => {
        const x = 56 + (i % 2) * 22, y = 252 + i * 82
        return (
          <g key={m.t} data-sh={i} role="button" tabIndex={0} data-cursor="Read" className={`landmark${selected === 'sh:' + i ? ' sel' : ''}${m.isNew ? ' fresh' : ''}`}>
            <rect x={x - 14} y={y - 20} width="300" height="40" fill="transparent" />
            {m.isNew && <circle cx={x} cy={y} r="5" className="pulse" fill="none" stroke="var(--brass)" strokeWidth=".8" {...NS} />}
            <circle cx={x} cy={y} r="5" fill="var(--ink)" stroke="var(--brass)" strokeWidth=".9" {...NS} /><circle cx={x} cy={y} r="1.7" fill="var(--brass)" />
            <path d={`M${x + 9} ${y} H${x + 22}`} stroke="var(--brass)" strokeWidth=".7" {...NS} opacity=".7" />
            <text x={x + 28} y={y + 5} className="mark-t">{m.t.replace(/^[\w-]+: ?/, '')}</text>
            <text x={x + 28} y={y + 20} className="micro">{(m.t.match(/^([\w-]+):/)?.[1] ?? 'Shipped')}{m.isNew ? ' · this week' : ''}</text>
          </g>
        )
      })}
    </g>
  )
})

/* ------------------------------------------------------------- landing ring */
const Landing = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`} pointerEvents="none">
    {[0, 1, 2].map((i) => <motion.circle key={i} fill="none" stroke={i ? 'var(--bone)' : 'var(--brass)'} strokeWidth="1" {...NS} initial={{ r: 20, opacity: .9 }} animate={{ r: 160 + i * 40, opacity: 0 }} transition={{ duration: 1.6, delay: i * .18, ease: [.22, 1, .36, 1] }} />)}
  </g>
)

/* --------------------------------------------------------------- the view */
export default function MapView() {
  const st = useStore()
  const { week, priv, selected, status, names, extraShipped, select, setStatus, setRoute } = st
  const stage = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null), sea = useRef<HTMLCanvasElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null), coordRef = useRef<HTMLSpanElement>(null)
  const { draw, bumps } = useSea(sea)
  const onFrame = useCallback((c: Cam, moving: boolean, t: number) => {
    draw(c, moving, t)
    const el = scaleRef.current; if (!el) return
    const nm = [1, 2, 5, 10, 20].find((n) => (n / NM_PER_UNIT) * c.k > 70) ?? 20
    el.style.width = `${(nm / NM_PER_UNIT) * c.k}px`; if (el.nextElementSibling) el.nextElementSibling.textContent = `${nm} nautical miles`
  }, [draw])
  const cam = useCamera(stage, world, onFrame)
  const [landings, setLandings] = useState<{ id: number; x: number; y: number }[]>([])
  const drag = useRef({ on: false, moved: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, isl: '', sh: '', ship: false })

  const all = liveIslands(week, status, names)
  const islands = priv ? all : all.filter((i) => i.state !== 'sinking')
  const sel = islands.find((i) => i.id === selected)
  const marks = landmarks(week, extraShipped)
  const selMark = selected?.startsWith('sh:') ? marks[+selected.slice(3)] : null
  const avoid = useMemo(() => islands.map((i) => ({ x: i.x, y: i.y, r: i.r })), [islands.map((i) => i.id).join()]) // eslint-disable-line react-hooks/exhaustive-deps

  /* feed the bathymetry: islands raise the sea floor, resolved ones sink back */
  useEffect(() => {
    const m = bumps.current, live = new Set(islands.map((i) => i.id))
    islands.forEach((i) => { const to = i.state === 'sinking' ? .4 : .62, b = m.get(i.id); if (b) b.to = to; else m.set(i.id, { x: i.x, y: i.y, r: i.r, a: 0, to }) })
    m.forEach((b, id) => { if (!live.has(id)) b.to = 0 })
  })

  useEffect(() => {
    const target = sel ?? (selMark && selected ? { x: 180, y: 252 + (+selected.slice(3)) * 82 } : null)
    if (target) cam.focus(target.x, target.y, cam.cover() * 1.7, window.innerWidth > 900 ? 210 : 0)
    else cam.fit()
  }, [selected, week]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (counselShown || week !== NOW_WEEK) return
    counselShown = true
    const id = setTimeout(() => st.toast('Athena · counsel', COUNSEL[0]), 9000)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.drawer,.map-ctl')) return
    const tg = e.target as Element
    drag.current = { on: true, moved: 0, x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: performance.now(), isl: (tg.closest('[data-isl]') as HTMLElement | null)?.dataset.isl ?? '', sh: (tg.closest('[data-sh]') as HTMLElement | null)?.dataset.sh ?? '', ship: !!tg.closest('[data-ship]') }
    stage.current!.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const c = cam.cur.current
    if (coordRef.current) { const r = stage.current!.getBoundingClientRect(); const wx = (e.clientX - r.left - c.x) / c.k, wy = (e.clientY - r.top - c.y) / c.k; coordRef.current.textContent = `${fmtLat(wy)}  ${fmtLon(wx)}` }
    const d = drag.current; if (!d.on) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y; d.moved += Math.abs(dx) + Math.abs(dy)
    const now = performance.now(), dt = Math.max(1, now - d.t); d.vx = dx / dt; d.vy = dy / dt; d.t = now; d.x = e.clientX; d.y = e.clientY
    if (d.moved < 6) return
    cam.auto.current = false
    const t = cam.tgt.current; cam.tgt.current = cam.clamp({ ...t, x: t.x + dx, y: t.y + dy })
    cam.cur.current.x += dx * 0.6; cam.cur.current.y += dy * 0.6
    stage.current!.classList.add('dragging')
  }
  const onPointerUp = () => {
    const d = drag.current; if (!d.on) return
    d.on = false; stage.current!.classList.remove('dragging')
    if (d.moved < 6) {
      if (d.ship) board(); else if (d.isl) select(d.isl); else if (d.sh) select('sh:' + d.sh); else if (selected) select(null)
    } else { const t = cam.tgt.current; cam.tgt.current = cam.clamp({ ...t, x: t.x + d.vx * 160, y: t.y + d.vy * 160 }) }
  }
  useEffect(() => {
    const el = stage.current!
    const wheel = (e: WheelEvent) => { if ((e.target as HTMLElement).closest('.drawer')) return; e.preventDefault(); cam.zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)), e.clientX, e.clientY) }
    el.addEventListener('wheel', wheel, { passive: false }); return () => el.removeEventListener('wheel', wheel)
  }, [cam])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches('input,textarea')) return
      const t = cam.tgt.current, s = 90
      if (e.key === '+' || e.key === '=') cam.zoomBy(1.25); else if (e.key === '-') cam.zoomBy(0.8)
      else if (e.key === 'ArrowLeft') cam.tgt.current = cam.clamp({ ...t, x: t.x + s }); else if (e.key === 'ArrowRight') cam.tgt.current = cam.clamp({ ...t, x: t.x - s })
      else if (e.key === 'ArrowUp') cam.tgt.current = cam.clamp({ ...t, y: t.y + s }); else if (e.key === 'ArrowDown') cam.tgt.current = cam.clamp({ ...t, y: t.y - s })
    }
    addEventListener('keydown', key); return () => removeEventListener('keydown', key)
  }, [cam])

  const board = () => { const [x, y] = TRACK[week]; cam.focus(x, y, cam.cover() * 4.5); setTimeout(() => setRoute('deck'), 650) }
  const land = (x: number, y: number) => { const id = Date.now(); setLandings((b) => [...b, { id, x, y }]); setTimeout(() => setLandings((b) => b.filter((q) => q.id !== id)), 2000) }
  const act = (i: LiveIsland, a: 'rescued' | 'dismissed' | 'done') => {
    if (a === 'done') st.set({ extraShipped: [...st.extraShipped, i.label] })
    land(i.x, i.y)
    setStatus(i.id, a)
    st.toast(a === 'done' ? 'Landed · the Shipped Continent' : a === 'rescued' ? 'Rescued from the deep' : 'Let go, gently', i.label)
  }

  const needs = islands.filter((i) => i.state === 'overdue' || i.flare)
  const sinking = all.filter((i) => i.state === 'sinking').length
  const shipped = shippedCount(week, extraShipped.length)
  const order = islands.map((i) => i.id)

  return (
    <div className="view map-stage" ref={stage} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <canvas ref={sea} className="sea" aria-hidden="true" />
      <div className="map-world" ref={world} style={{ width: W, height: H }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Sea chart of your work">
          <defs>
            <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><path d="M0 0V5" stroke="#e9e4d8" strokeWidth=".6" opacity=".16" /></pattern>
          </defs>
          <Graticule /><Rhumbs /><Soundings avoid={avoid} />
          <g fill="none" stroke="var(--bone)" strokeWidth=".8" strokeDasharray="1 5" strokeLinecap="round" opacity=".5">
            {ROUTES.map(([a, b]) => {
              const A = islands.find((i) => i.id === a), B = islands.find((i) => i.id === b); if (!A || !B) return null
              const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.14, my = (A.y + B.y) / 2 - (B.x - A.x) * 0.14
              return <path key={a + b} className="route" d={`M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`} {...NS} />
            })}
          </g>
          <Rose />
          <Continent marks={marks} selected={selected} shipped={shipped} week={week} />
          <Track week={week} />
          <AnimatePresence>
            {islands.map((i) => (
              <g key={i.id} transform={`translate(${i.x},${i.y})`} data-isl={i.id} tabIndex={0} role="button" aria-label={`${i.label}, ${i.state}`} data-cursor="Survey" onKeyDown={(e) => e.key === 'Enter' && select(i.id)}>
                <motion.g initial={{ opacity: 0, scale: .85 }} animate={{ opacity: i.state === 'sinking' ? .5 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .9, transition: { duration: .6 } }} transition={{ duration: 1.1, ease: [.22, 1, .36, 1], delay: .2 + order.indexOf(i.id) * .05 }}>
                  <IslandArt isl={i} selected={selected === i.id} />
                </motion.g>
              </g>
            ))}
          </AnimatePresence>
          <Ship week={week} onBoard={board} />
          {landings.map((b) => <Landing key={b.id} x={b.x} y={b.y} />)}
        </svg>
      </div>
      <div className="map-vignette" aria-hidden="true" />

      <div className="map-ctl" role="group" aria-label="Chart controls">
        <div className="zoom">
          <button onClick={() => cam.zoomBy(1.3)} aria-label="Zoom in" data-cursor="Closer">+</button>
          <button onClick={() => cam.zoomBy(0.77)} aria-label="Zoom out" data-cursor="Wider">−</button>
          <button onClick={() => { select(null); cam.fit() }} aria-label="Whole chart" data-cursor="Whole chart" className="fit"><i /></button>
        </div>
        <div className="scale mono"><div className="bar" ref={scaleRef} /><span>5 nautical miles</span></div>
        <p className="coord mono"><span ref={coordRef}>{fmtLat(500)}  {fmtLon(800)}</span></p>
        <button className="link" onClick={() => st.set({ legend: true })}>Legend</button>
      </div>

      <aside className="drawer" aria-live="polite" onPointerDown={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {sel ? <IslandCard key={sel.id} sel={sel} n={order.indexOf(sel.id) + 1} act={act} /> : selMark ? (
            <Panel key={selected}>
              <p className="eyebrow"><i />The Shipped Continent</p>
              <h2>{selMark.t.replace(/^[\w-]+: ?/, '')}</h2>
              <div className="tags"><span className="tag brass"><span className="dot" />{selMark.t.match(/^([\w-]+):/)?.[1] ?? 'Shipped'}</span><span className="tag">Week {SHIPPED.find((s) => s.t === selMark.t)?.w ?? NOW_WEEK}</span></div>
              <p className="body">{selMark.d}</p>
              <button className="link back" onClick={() => select(null)}>← Back to the voyage log</button>
            </Panel>
          ) : (
            <Panel key={'log' + week}>
              <p className="eyebrow"><i />{PERSON.first}'s voyage log · W{week}</p>
              <p className="wk mono dim">{WEEKS[week]}</p>
              <h2>{HEADLINE[week]}</h2>
              <div className="stats">
                <Stat n={shipped} l="Shipped" /><Stat n={needs.length} l="Needs you" tone="signal" />
                {priv ? <Stat n={sinking} l="Slipping" /> : <div className="stat lock"><b>—</b><small className="mono">Hidden</small></div>}
              </div>
              <Survey text={VOYAGE[week]} />
              {needs.length > 0 && <div className="needs">
                <p className="mono dim">Needs you</p>
                {needs.map((i) => <button key={i.id} className="need" onClick={() => select(i.id)} data-cursor="Survey"><span className="mono n">{pad(order.indexOf(i.id) + 1)}</span><b>{i.label}</b><small className="mono">{i.flare ? 'review · 6h' : `${i.age}d over`}</small><span className="arr">→</span></button>)}
              </div>}
              <button className="btn solid wide" onClick={() => setRoute('log')} data-cursor="Open">Open the Captain's Log <span className="arr">→</span></button>
              <p className="fine mono">{priv ? 'Private view · forgotten islands are visible only to you' : 'Manager lens · outcomes only, no forgotten waters'}<br />Slack · Zoom · GitHub · synced 7:30 PM</p>
            </Panel>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <motion.div className="drawer-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
)

function IslandCard({ sel, n, act }: { sel: LiveIsland; n: number; act: (i: LiveIsland, a: 'rescued' | 'dismissed' | 'done') => void }) {
  const { status, notes, select } = useStore()
  return (
    <Panel>
      <p className="eyebrow"><i />Survey · island {pad(n)}</p>
      <p className="wk mono dim">{fmtLat(sel.y)} · {fmtLon(sel.x)}</p>
      <h2>{sel.label}</h2>
      <div className="tags">
        <span className="tag">{sel.src}</span>
        {sel.state === 'overdue' && <span className="tag signal"><span className="dot" />Overdue</span>}
        {sel.state === 'sinking' && <span className="tag">Slipping · private</span>}
        {sel.flare && <span className="tag signal"><span className="dot" />{sel.flare}</span>}
        {status[sel.id] === 'rescued' && <span className="tag brass">Rescued</span>}
        {sel.who && <span className="tag">with {sel.who}</span>}
      </div>
      <blockquote>{sel.quote}</blockquote>
      <p className="body">{sel.note}</p>
      <dl className="mono">
        <dt>Source</dt><dd>{sel.link}</dd>
        <dt>Age</dt><dd>{sel.age} days{sel.state === 'overdue' ? ' · in rough water' : ''}</dd>
        <dt>First seen</dt><dd>Week {sel.born}</dd>
        {notes[sel.id] && <><dt>Your note</dt><dd>{notes[sel.id]}</dd></>}
      </dl>
      <div className="actions">
        {sel.state === 'sinking' && <button className="btn solid" onClick={() => act(sel, 'rescued')}>Rescue it</button>}
        <button className={`btn${sel.state === 'sinking' ? '' : ' solid'}`} onClick={() => act(sel, 'done')}>Mark shipped</button>
        <button className="btn" onClick={() => act(sel, 'dismissed')}>Let it go</button>
      </div>
      <button className="link back" onClick={() => select(null)}>← Back to the voyage log</button>
    </Panel>
  )
}

const Stat = ({ n, l, tone }: { n: number; l: string; tone?: string }) => { const v = useCountUp(n); return <div className={`stat ${tone ?? ''}`}><b>{pad(v)}</b><small className="mono">{l}</small></div> }
const Survey = ({ text }: { text: string }) => { const t = useTypewriter(text, 16); return <p className="survey"><span className="mono">Athena's survey</span>{t.text}<i className="caret" /></p> }
