import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ISLANDS, ROUTES, SHIPPED, VOYAGE, COUNSEL, NOW_WEEK } from '../data'
import { LiveIsland, landmarks, liveIslands, shippedCount, useStore } from '../store'
import { blob, hash, rng, useCountUp, useTypewriter } from '../lib'

const W = 1600, H = 1000
const SHIP = { x: 770, y: 585 }
let counselShown = false

/* ------------------------------------------------------------------ camera */
function useCamera(stage: React.RefObject<HTMLDivElement>, world: React.RefObject<HTMLDivElement>) {
  const cur = useRef({ x: 0, y: 0, k: 1 }), tgt = useRef({ x: 0, y: 0, k: 1 })
  const cover = () => { const s = stage.current!; return Math.max(s.clientWidth / W, s.clientHeight / H) }
  const clamp = useCallback((c: { x: number; y: number; k: number }) => {
    const s = stage.current!, kc = cover()
    c.k = Math.min(kc * 4.5, Math.max(kc * 0.62, c.k))
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
  const fitK = useRef(0)
  const fit = useCallback(() => { fitK.current = cover() * 1.001; focus(W / 2, H / 2, fitK.current); auto.current = true }, [focus])
  const zoomBy = useCallback((f: number, px?: number, py?: number) => {
    auto.current = false
    const s = stage.current!, t = tgt.current
    px ??= s.clientWidth / 2; py ??= s.clientHeight / 2
    const nk = Math.min(cover() * 4.5, Math.max(cover() * 0.62, t.k * f)), r = nk / t.k
    tgt.current = clamp({ k: nk, x: px - (px - t.x) * r, y: py - (py - t.y) * r })
  }, [clamp, stage])

  useEffect(() => {
    const s = stage.current!
    fit(); const t = tgt.current
    /* arrival: start zoomed on the ship and ease out to the full chart */
    const kc = cover(); cur.current = clamp({ k: kc * 3, x: s.clientWidth / 2 - SHIP.x * kc * 3, y: s.clientHeight / 2 - SHIP.y * kc * 3 }); tgt.current = t
    let raf = 0
    const tick = () => {
      const c = cur.current, g = tgt.current, e = 0.11
      c.x += (g.x - c.x) * e; c.y += (g.y - c.y) * e; c.k += (g.k - c.k) * e
      world.current!.style.transform = `translate3d(${c.x}px,${c.y}px,0) scale(${c.k})`
      s.style.setProperty('--px', String(c.x * 0.02)); s.style.setProperty('--py', String(c.y * 0.02))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onResize = () => { if (auto.current) fit(); else tgt.current = clamp({ ...tgt.current }) }
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize) }
  }, [clamp, fit, stage, world])
  return { cur, tgt, focus, fit, zoomBy, clamp, cover, auto }
}

/* -------------------------------------------------------------- chart art */
const Mountains = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`} fill="#c6a56a" stroke="#5b4630" strokeWidth="2" strokeLinejoin="round">
    <path d="M0 0 L26 -48 L52 0Z" /><path d="M40 0 L72 -66 L104 0Z" /><path d="M96 0 L118 -38 L140 0Z" />
    <path d="M26 -48 l-8 14 8 -4 6 6z" fill="#efdcae" stroke="none" /><path d="M72 -66 l-10 18 10 -5 8 6z" fill="#efdcae" stroke="none" />
  </g>
)
const Compass = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`} className="compass">
    <circle r="86" fill="none" stroke="#5b4630" strokeWidth="2" /><circle r="72" fill="none" stroke="#5b4630" strokeWidth="1" strokeDasharray="2 5" />
    <g className="rose"><path d="M0 -84 L12 -12 L0 0 L-12 -12Z" fill="#b4432d" /><path d="M0 84 L12 12 L0 0 L-12 12Z" fill="#5b4630" /><path d="M-84 0 L-12 -12 L0 0 L-12 12Z" fill="#8a6a3d" /><path d="M84 0 L12 -12 L0 0 L12 12Z" fill="#8a6a3d" />
      <path d="M-40 -40 L-6 -6 M40 -40 L6 -6 M-40 40 L-6 6 M40 40 L6 6" stroke="#5b4630" strokeWidth="2" /></g>
    <text y="-96" textAnchor="middle" className="cap-t">N</text>
  </g>
)
const Dragon = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`} className="dragon" opacity=".5" fill="none" stroke="#5b4630" strokeWidth="2.4" strokeLinecap="round">
    <path d="M0 40 q20 -60 50 -20 t50 -10 t50 -4" /><path d="M150 6 q22 -26 8 -42 q-20 -4 -20 14" /><circle cx="150" cy="-20" r="2" fill="#5b4630" />
    <path d="M30 22 q10 20 26 10 M80 0 q8 22 24 14 M-30 52 q16 -20 32 -6" />
    <text x="0" y="94" className="hand-t" fill="#5b4630" stroke="none">here be dragons</text>
  </g>
)
const Waves = memo(function Waves() {
  const r = rng(11)
  const marks = Array.from({ length: 54 }, () => ({ x: 430 + r() * 1100, y: 40 + r() * 920, s: 0.7 + r() * 0.8, d: r() * 6 }))
  return <g fill="none" stroke="#7d6544" strokeWidth="1.6" strokeLinecap="round" opacity=".55">
    {marks.map((m, i) => <path key={i} className="wv" style={{ animationDelay: `${m.d}s` }} transform={`translate(${m.x},${m.y}) scale(${m.s})`} d="M0 0 q8 -9 16 0 t16 0 t16 0" />)}
  </g>
})

const Ship = ({ onBoard }: { onBoard: () => void }) => (
  <g transform={`translate(${SHIP.x},${SHIP.y})`} className="ship" role="button" tabIndex={0} aria-label="Board your ship" data-ship data-cursor="Board" onKeyDown={(e) => e.key === 'Enter' && onBoard()}>
    <ellipse cx="0" cy="22" rx="86" ry="12" className="wake" fill="none" stroke="#5b4630" strokeWidth="1.5" />
    <ellipse cx="0" cy="22" rx="56" ry="7" className="wake w2" fill="none" stroke="#5b4630" strokeWidth="1.2" />
    <g className="ship-body">
      <path d="M-44 0 Q-22 22 22 22 Q40 20 52 -6 L-40 -6Z" fill="#7a5530" stroke="#3a2a1a" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M-34 6 H40" stroke="#3a2a1a" strokeWidth="1" opacity=".6" />
      <path d="M0 -6 V-78" stroke="#3a2a1a" strokeWidth="3" />
      <path className="sail" d="M3 -74 Q46 -50 38 -12 L3 -10Z" fill="#f4e8c8" stroke="#3a2a1a" strokeWidth="2" strokeLinejoin="round" />
      <path className="sail s2" d="M-3 -66 Q-30 -46 -26 -12 L-3 -10Z" fill="#ead9ae" stroke="#3a2a1a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M0 -78 l20 -6 -20 -6z" fill="#b4432d" stroke="#3a2a1a" strokeWidth="1.2" />
    </g>
    <text y="58" textAnchor="middle" className="hand-t ship-cap">click to board</text>
  </g>
)

function Storm({ r, seed }: { r: number; seed: string }) {
  const d = (hash(seed) % 5) * 0.7
  return (
    <g className="storm" transform={`translate(${r * 0.2},${-r - 38})`}>
      <g className="cloud" style={{ animationDelay: `${-d}s` }}>
        <ellipse cx="0" cy="0" rx="42" ry="17" fill="#7c7a78" /><circle cx="-18" cy="-10" r="17" fill="#858381" /><circle cx="8" cy="-16" r="21" fill="#8f8d8a" /><circle cx="28" cy="-6" r="14" fill="#858381" />
      </g>
      {[-18, -4, 12, 26].map((x, i) => <path key={x} className="rain" style={{ animationDelay: `${i * 0.18}s` }} d={`M${x} 18 l-6 18`} stroke="#4c6671" strokeWidth="2" strokeLinecap="round" />)}
      <path className="bolt" style={{ animationDelay: `${d}s` }} d="M6 14 l-8 16 8 -2 -6 18" fill="none" stroke="#f4cf5a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  )
}

const IslandArt = memo(function IslandArt({ isl, selected, onBurst }: { isl: LiveIsland; selected: boolean; onBurst?: () => void }) {
  void onBurst
  const d = useMemo(() => blob(isl.id, isl.r), [isl.id, isl.r])
  const d2 = useMemo(() => blob(isl.id + 'x', isl.r * 1.02, 0.2), [isl.id, isl.r])
  const deco = useMemo(() => { const r = rng(hash(isl.id + 'd')); return Array.from({ length: 4 + Math.floor(isl.r / 18) }, () => ({ x: (r() - .5) * isl.r * 1.3, y: (r() - .5) * isl.r * .8, t: r() > .45 })) }, [isl.id, isl.r])
  const sink = isl.state === 'sinking', over = isl.state === 'overdue'
  return (
    <g className={`isl ${isl.state}${selected ? ' sel' : ''}`}>
      <g className="isl-hover">
        <path d={d} transform="scale(1.18)" className="shoal" />
        {sink && [1.25, 1.5].map((s, i) => <ellipse key={s} className="ripple" style={{ animationDelay: `${i * 1.4}s` }} rx={isl.r * 1.25} ry={isl.r * .9} fill="none" stroke="#7d6544" strokeWidth="1.5" />)}
        <path d={d} className="land" stroke={over ? '#b4432d' : '#5b4630'} strokeWidth={over ? 3.6 : 2.4} strokeDasharray={sink ? '5 4' : undefined} />
        <path d={d2} transform="translate(2,2)" fill="none" stroke={over ? '#b4432d' : '#5b4630'} strokeWidth="1" opacity=".4" />
        <path d={d} transform="scale(.7)" fill="none" stroke="#5b4630" strokeWidth="1" opacity=".3" />
        <path d={d} transform="scale(.42)" fill="none" stroke="#5b4630" strokeWidth="1" opacity=".25" />
        {deco.map((p, i) => p.t
          ? <path key={i} transform={`translate(${p.x},${p.y})`} d="M0 0 l-5 12 h10z M0 12 v5" fill="#7d9360" stroke="#3a4a2a" strokeWidth="1.2" strokeLinejoin="round" />
          : <path key={i} transform={`translate(${p.x},${p.y})`} d="M-9 8 l9 -16 l9 16 M-3 0 l3 -5 l3 5" fill="none" stroke="#5b4630" strokeWidth="1.4" strokeLinejoin="round" />)}
        <g transform={`translate(0,${isl.r * 0.78})`}>
          <rect x="-26" y="-9" width="52" height="18" rx="9" className={`src src-${isl.src}`} />
          <text y="4" textAnchor="middle" className="src-t">{isl.src}</text>
        </g>
        <text y={isl.r * 0.78 + 36} textAnchor="middle" className={`isl-label${sink ? ' faint' : ''}`}>{sink ? isl.quote.split('·')[0].trim() : isl.label}</text>
        {over && <text y={isl.r * 0.78 + 58} textAnchor="middle" className="sm-t red">overdue {isl.age}d</text>}
        {sink && <text y={isl.r * 0.78 + 56} textAnchor="middle" className="sm-t">{isl.src}, {isl.age}d</text>}
      </g>
      {over && <Storm r={isl.r} seed={isl.id} />}
      {isl.flare && (
        <g transform={`translate(${isl.r * .8},${-isl.r * .9})`}>
          <circle className="flare-ring" r="12" fill="none" stroke="#e8742c" strokeWidth="2" /><circle r="7" fill="#e8742c" />
          <text x="14" y="-14" className="sm-t red" transform="rotate(-8)">{isl.flare}</text>
        </g>
      )}
      {selected && <circle className="sel-ring" r={isl.r * 1.5} fill="none" stroke="#2f6b73" strokeWidth="2.4" strokeDasharray="10 8" />}
    </g>
  )
})

/* --------------------------------------------------------------- the view */
export default function MapView() {
  const st = useStore()
  const { week, priv, selected, status, names, extraShipped, select, setStatus, setRoute } = st
  const stage = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null)
  const cam = useCamera(stage, world)
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([])
  const drag = useRef({ on: false, moved: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, isl: '', sh: '', ship: false })

  const all = liveIslands(week, status, names)
  const islands = priv ? all : all.filter((i) => i.state !== 'sinking')
  const sel = islands.find((i) => i.id === selected)
  const marks = landmarks(week, extraShipped)
  const selMark = selected?.startsWith('sh:') ? marks[+selected.slice(3)] : null

  /* camera follows selection */
  useEffect(() => {
    const target = sel ?? (selMark && selected ? { x: 190, y: 220 + (+selected.slice(3)) * 110, r: 80 } : null)
    if (target) cam.focus(target.x, target.y, cam.cover() * 1.75, window.innerWidth > 900 ? 190 : 0)
    else cam.fit()
  }, [selected, week]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Athena's gentle counsel, once (but not during tour) */
  useEffect(() => {
    if (counselShown || week !== NOW_WEEK || st.tour >= 0) return
    counselShown = true
    const id = setTimeout(() => st.toast("Athena's counsel", COUNSEL[0], '🦉'), 9000)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.drawer,.map-ctl')) return
    const tg = e.target as Element
    drag.current = { on: true, moved: 0, x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: performance.now(), isl: (tg.closest('[data-isl]') as HTMLElement | null)?.dataset.isl ?? '', sh: (tg.closest('[data-sh]') as HTMLElement | null)?.dataset.sh ?? '', ship: !!tg.closest('[data-ship]') }
    stage.current!.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
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
    const wheel = (e: WheelEvent) => { e.preventDefault(); cam.zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)), e.clientX, e.clientY) }
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

  const board = () => { cam.focus(SHIP.x, SHIP.y - 20, cam.cover() * 5.5); setTimeout(() => setRoute('deck'), 700) }
  const burst = (x: number, y: number) => { const id = Date.now(); setBursts((b) => [...b, { id, x, y }]); setTimeout(() => setBursts((b) => b.filter((q) => q.id !== id)), 1400) }
  const act = (i: LiveIsland, a: 'rescued' | 'dismissed' | 'done') => {
    if (a === 'done') { st.set({ extraShipped: [...st.extraShipped, i.label] }); burst(i.x, i.y) }
    if (a === 'rescued') burst(i.x, i.y)
    setStatus(i.id, a)
    st.toast(a === 'done' ? 'Landed on the continent' : a === 'rescued' ? 'Rescued from the deep' : 'Let go, gently', i.label, a === 'done' ? '🚩' : a === 'rescued' ? '🛟' : '🌊')
  }

  const needs = islands.filter((i) => i.state === 'overdue' || i.flare).length
  const sinking = all.filter((i) => i.state === 'sinking').length
  const shipped = shippedCount(week, extraShipped.length)

  return (
    <div className="map-stage" ref={stage} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="map-world" ref={world} style={{ width: W, height: H }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Sea chart of your work">
          <defs>
            <pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V16" stroke="#8a6a3d" strokeWidth="1" opacity=".12" /></pattern>
            <radialGradient id="stormfog"><stop offset="0" stopColor="#6c6a68" stopOpacity=".4" /><stop offset="1" stopColor="#6c6a68" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#hatch)" />
          {/* graticule */}
          <g stroke="#8a6a3d" strokeWidth="1" opacity=".22" fill="none">{[1, 2, 3, 4].map((n) => <path key={n} d={`M0 ${n * 200} H${W}`} strokeDasharray="1 9" strokeLinecap="round" />)}{[5, 7, 9, 11, 13, 15].map((n) => <path key={n} d={`M${n * 100} 0 V${H}`} strokeDasharray="1 9" strokeLinecap="round" />)}</g>
          <Waves />
          <circle cx="760" cy="420" r="260" fill="url(#stormfog)" className="fog" />
          <Compass x={650} y={110} /><Dragon x={1230} y={950} />

          {/* routes */}
          <g fill="none" stroke="#5b4630" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 9" opacity=".75">
            {ROUTES.map(([a, b]) => {
              const A = islands.find((i) => i.id === a), B = islands.find((i) => i.id === b); if (!A || !B) return null
              const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.12, my = (A.y + B.y) / 2 - (B.x - A.x) * 0.12
              return <path key={a + b} className="route" d={`M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`} />
            })}
          </g>

          {/* shipped continent */}
          <Continent marks={marks} selected={selected} shipped={shipped} week={week} />

          {/* islands */}
          <AnimatePresence>
            {islands.map((i) => (
              <g key={i.id} transform={`translate(${i.x},${i.y})`} data-isl={i.id} tabIndex={0} role="button" aria-label={`${i.label}, ${i.state}`} data-cursor="Inspect" onKeyDown={(e) => e.key === 'Enter' && select(i.id)}>
                <motion.g initial={{ opacity: 0, scale: .7, y: 24 }} animate={{ opacity: i.state === 'sinking' ? .55 : 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .6, y: 40 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
                  <IslandArt isl={i} selected={selected === i.id} />
                </motion.g>
              </g>
            ))}
          </AnimatePresence>
          <Ship onBoard={board} />
          {bursts.map((b) => <Burst key={b.id} x={b.x} y={b.y} />)}
        </svg>
      </div>
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-clouds" aria-hidden="true"><i /><i /><i /></div>

      <div className="map-ctl glass" role="group" aria-label="Zoom">
        <button onClick={() => cam.zoomBy(1.3)} aria-label="Zoom in" data-cursor="Zoom in">+</button>
        <button onClick={() => cam.zoomBy(0.77)} aria-label="Zoom out" data-cursor="Zoom out">−</button>
        <button onClick={() => select(null)} aria-label="Recenter" data-cursor="Recenter" onClickCapture={() => cam.fit()}>⌖</button>
        <span>drag · scroll to explore</span>
      </div>

      <aside className="drawer" aria-live="polite">
        <AnimatePresence mode="wait">
          {sel ? (
            <motion.div key={sel.id} className="drawer-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <p className="eyebrow">Selected island</p>
              <h2>{sel.label}</h2>
              <div className="tags"><span className={`chip ${sel.src}`}>{sel.src}</span>
                {sel.state === 'overdue' && <span className="chip warn">Needs attention</span>}
                {sel.state === 'sinking' && <span className="chip red">Sinking · private</span>}
                {sel.flare && <span className="chip warn">{sel.flare}</span>}
                {st.status[sel.id] === 'rescued' && <span className="chip ok">Rescued</span>}</div>
              <p className="quote">{sel.quote}</p>
              <p>{sel.note}</p>
              <dl><dt>Source</dt><dd>{sel.link}</dd><dt>Age</dt><dd>{sel.age} days{sel.state === 'overdue' ? ' · drifting toward rough water' : ''}</dd>
                {st.notes[sel.id] && <><dt>Your note</dt><dd>{st.notes[sel.id]}</dd></>}</dl>
              <div className="actions">
                {sel.state === 'sinking' && <button className="btn teal" onClick={() => act(sel, 'rescued')}>🛟 Rescue</button>}
                <button className="btn ink" onClick={() => act(sel, 'dismissed')}>Dismiss</button>
                <button className="btn ink primary" onClick={() => act(sel, 'done')}>✓ Done</button>
              </div>
              <button className="link ink" onClick={() => select(null)}>← back to voyage log</button>
            </motion.div>
          ) : selMark ? (
            <motion.div key={selected} className="drawer-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
              <p className="eyebrow">The Shipped Continent</p><h2>{selMark.t}</h2><p>{selMark.d}</p>
              <p className="quote">Landed in week {SHIPPED.find((s) => s.t === selMark.t)?.w ?? NOW_WEEK}</p>
              <button className="link ink" onClick={() => select(null)}>← back to voyage log</button>
            </motion.div>
          ) : (
            <motion.div key="log" className="drawer-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
              <p className="eyebrow">Voyage log · week {week}</p>
              <div className="log-prose">
                <p><span className="log-mark">⚓</span> <strong>{shipped}</strong> {shipped === 1 ? 'landing' : 'landings'} reached the continent this week</p>
                {needs > 0 && <p className="warn-text"><span className="log-mark">⚠</span> <strong>{needs}</strong> {needs === 1 ? 'island needs' : 'islands need'} attention</p>}
                {priv && sinking > 0 && <p className="muted-text"><span className="log-mark">🌊</span> <strong>{sinking}</strong> drifting into deeper waters</p>}
                {!priv && <p className="muted-text"><span className="log-mark">🔒</span> Manager lens active · private waters hidden</p>}
              </div>
              <Log text={VOYAGE[week]} />
              <button className="btn ink primary" onClick={() => setRoute('log')}>Open the Captain's Log →</button>
              <p className="fine">{priv ? '🔒 Private view: only you can see forgotten islands.' : '🧭 Manager lens: outcomes only, no forgotten waters.'} Sources: Slack · Zoom · GitHub · synced 7:30 PM. Example data.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

const Stat = ({ n, l, tone }: { n: number; l: string; tone?: string }) => { const v = useCountUp(n); return <div className={`stat ${tone ?? ''}`}><b>{v}</b><small>{l}</small></div> }
const Log = ({ text }: { text: string }) => { const t = useTypewriter(text, 14); return <p className="athena">{t.text}<i className="caret" /></p> }

const Burst = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`} pointerEvents="none">
    {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <motion.circle key={i} fill={i % 2 ? '#d3a444' : '#b4432d'} initial={{ cx: 0, cy: 0, opacity: 1, r: i % 3 ? 4 : 6 }} animate={{ cx: Math.cos(a) * 120, cy: Math.sin(a) * 90 - 30, opacity: 0, r: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }} /> })}
    <motion.circle fill="none" stroke="#d3a444" strokeWidth="3" initial={{ r: 10, opacity: 1 }} animate={{ r: 110, opacity: 0 }} transition={{ duration: 1 }} />
  </g>
)

const Continent = memo(function Continent({ marks, selected, shipped, week }: { marks: { t: string; d: string; isNew: boolean }[]; selected: string | null; shipped: number; week: number }) {
  const d = useMemo(() => {
    const r = rng(77); let p = `M-20 -20 H${360}`
    const pts: [number, number][] = []
    for (let y = -20; y <= H + 20; y += 60) pts.push([500 + Math.sin(y / 120) * 26 + (r() - .5) * 46, y])
    p = `M-30 -30 L${pts[0][0]} ${pts[0][1]}` + pts.slice(1).map(([x, y]) => ` L${x.toFixed(0)} ${y}`).join('') + ` L-30 ${H + 30}Z`
    return p
  }, [])
  return (
    <g className="continent">
      <path d={d} fill="#d8bb80" stroke="#5b4630" strokeWidth="3.4" strokeLinejoin="round" />
      <path d={d} transform="translate(-14,0)" fill="none" stroke="#5b4630" strokeWidth="1.4" strokeDasharray="3 7" opacity=".5" />
      <g stroke="#8a6a3d" strokeWidth="1" opacity=".3">{Array.from({ length: 30 }, (_, i) => <path key={i} d={`M0 ${i * 36 + 20} H${300 + (i % 3) * 16}`} strokeDasharray="1 6" />)}</g>
      <text x="112" y="108" className="cont-t">THE SHIPPED</text><text x="112" y="152" className="cont-t">CONTINENT</text>
      <text x="114" y="184" className="hand-t sm2">{shipped} landings this week</text>
      {marks.map((m, i) => {
        const x = 112 + (i % 2) * 18, y = 250 + i * 84
        return (
          <g key={m.t} data-sh={i} role="button" tabIndex={0} data-cursor="Read" className={`landmark${selected === 'sh:' + i ? ' sel' : ''}${m.isNew && week > 0 ? ' fresh' : ''}`} style={{ animationDelay: `${i * 0.09}s` }}>
            <path d={`M${x} ${y} v-34`} stroke="#3a2a1a" strokeWidth="3" strokeLinecap="round" /><path className="flag" d={`M${x} ${y - 34} h26 l-7 8 7 8 h-26z`} fill="#b4432d" stroke="#3a2a1a" strokeWidth="1.6" strokeLinejoin="round" />
            <text x={x + 40} y={y - 6} className="mark-t">{m.t}</text>
          </g>
        )
      })}
      <Mountains x={130} y={975} />
    </g>
  )
})
