import { memo, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CREW, CrewId } from '../data'
import { liveIslands, useStore } from '../store'

/*
 * Sheet I: the ship in profile, cut away to show who works where.
 * Every crew member is tied to you by a line of rigging. The stronger the bond, the tauter the line.
 */
const NS = { vectorEffect: 'non-scaling-stroke' } as const
const ease = [.22, 1, .36, 1] as const
const WL = 640
const HZ = 556
const HZT = { stroke: 'none', font: '500 4.2px Geist Mono, monospace', letterSpacing: '.1em', fill: 'var(--bone)' } as const
const HZS = { ...HZT, fill: 'var(--signal)' } as const

const YOU = { x: 362, y: 484 }
const ST: Record<CrewId, { x: number; y: number; slot: number }> = {
  B: { x: 404, y: 572, slot: 380 }, A: { x: 452, y: 482, slot: 516 }, D: { x: 650, y: 214, slot: 652 },
  C: { x: 914, y: 654, slot: 788 }, E: { x: 1010, y: 486, slot: 924 }, F: { x: 1132, y: 474, slot: 1060 },
}

const HULL = 'M300 498 L470 498 L470 526 Q700 548 960 520 L960 500 L1084 494 C1096 540 1092 600 1060 650 C1030 690 980 706 900 708 L380 708 C350 706 330 694 322 676 Z'
const CUT = 'M482 534 Q700 552 948 528 L948 690 Q940 700 900 700 L482 700 Z'

/* a square sail between two yards, its foot bellied by the wind */
const sail = (x: number, y1: number, w1: number, y2: number, w2: number) =>
  `M${x - w1} ${y1} L${x + w1} ${y1} C${x + w1 + 6} ${y1 + (y2 - y1) * .5} ${x + w2 + 8} ${y2 - 10} ${x + w2} ${y2} Q${x} ${y2 + 16} ${x - w2} ${y2} C${x - w2 - 8} ${y2 - 10} ${x - w1 - 6} ${y1 + (y2 - y1) * .5} ${x - w1} ${y1}Z`
const MAIN = { x: 650, foot: 535, top: 150 }, FORE = { x: 880, foot: 528, top: 196 }, MIZ = { x: 420, foot: 498, top: 300 }
const SAILS = [
  { x: MAIN.x, y1: 236, w1: 62, y2: 300, w2: 78 }, { x: MAIN.x, y1: 310, w1: 84, y2: 392, w2: 100 }, { x: MAIN.x, y1: 402, w1: 104, y2: 482, w2: 118 },
  { x: FORE.x, y1: 262, w1: 52, y2: 320, w2: 66 }, { x: FORE.x, y1: 330, w1: 70, y2: 404, w2: 86 }, { x: FORE.x, y1: 414, w1: 90, y2: 478, w2: 102 },
]

const Line = ({ d, w = .7, o = .7, dash }: { d: string; w?: number; o?: number; dash?: string }) => <path d={d} fill="none" stroke="var(--bone)" strokeWidth={w} opacity={o} strokeDasharray={dash} {...NS} />

/* ------------------------------------------------------------- sky + sea */
const Clouds = memo(function Clouds() {
  const c = [[180, 120, 1], [980, 96, .8], [1300, 210, 1.2], [520, 70, .7]]
  return <g className="clouds">{c.map(([x, y, s], i) => (
    <g key={i} className="cloud" style={{ animationDelay: `${-i * 9}s` }} transform={`translate(${x},${y}) scale(${s})`} opacity=".32">
      {[[-40, 0, 80], [-62, 6, 120], [-50, 12, 110], [-30, 18, 70], [-70, 24, 96], [-20, 30, 40]].map(([dx, dy, w], k) => <path key={k} d={`M${dx} ${dy} h${w}`} stroke="var(--bone)" strokeWidth=".6" {...NS} />)}
    </g>))}</g>
})
const Gulls = () => <g className="gulls" stroke="var(--bone)" strokeWidth=".8" fill="none" opacity=".6">
  {[[300, 210], [328, 196], [1040, 150]].map(([x, y], i) => <path key={i} className="gull" style={{ animationDelay: `${i * .7}s` }} d={`M${x - 7} ${y} q4 -5 7 0 q3 -5 7 0`} {...NS} />)}
</g>
const Sea = ({ front }: { front?: boolean }) => (
  <g className={`sea-lines${front ? ' front' : ''}`}>
    {(front ? [[660, .5, 0], [682, .4, 1], [710, .3, 2], [744, .22, 3], [880, .18, 4]] : [[572, .2, 0], [590, .26, 1], [610, .32, 2], [628, .4, 3]]).map(([y, o, i]) => (
      <path key={y} className="swell" style={{ animationDuration: `${14 + i * 4}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
        d={'M-200 ' + y + Array.from({ length: 30 }, (_, k) => ` q${30 + (k % 3) * 6} ${k % 2 ? 3 + i : -3 - i} ${66 + (k % 3) * 8} 0`).join('')} fill="none" stroke="var(--bone)" strokeWidth=".7" opacity={o} {...NS} />
    ))}
  </g>
)

/* things on the horizon: tiny to the eye, legible through the glass */
const Horizon = memo(function Horizon() {
  return (
    <g id="hz">
      <path d={`M-20 ${HZ} H1620`} stroke="var(--bone)" strokeWidth=".6" opacity=".5" {...NS} />
      <g transform={`translate(196,${HZ})`}>
        <path d="M-2 0 L-1.4 -15 H1.4 L2 0Z" fill="var(--bone)" /><path d="M-3 -15 h6 v-2 h-6z" fill="var(--bone)" />
        <path className="beam" d="M0 -17 L-22 -24 L-22 -12Z" fill="var(--signal)" opacity=".5" />
        <text y="7" textAnchor="middle" className="hz-t" style={HZT}>PR #EX-218</text><text y="12" textAnchor="middle" className="hz-t" style={HZT}>review waiting</text>
      </g>
      <g transform={`translate(236,${HZ})`}>
        {[0, 3, 6, 9].map((dy, k) => <path key={k} d={`M${-16 + k * 2} ${-26 + dy} h${30 - k * 3}`} stroke="var(--bone)" strokeWidth=".6" {...NS} />)}
        {[-8, -3, 2, 7].map((x, k) => <path key={k} d={`M${x} -14 l-2 10`} stroke="var(--signal)" strokeWidth=".6" {...NS} />)}
        <text y="7" textAnchor="middle" className="hz-t sig" style={HZS}>Q4 roadmap</text><text y="12" textAnchor="middle" className="hz-t sig" style={HZS}>storm · 3d over</text>
      </g>
      <g transform={`translate(278,${HZ})`}>
        <path d="M-24 0 Q-12 -9 0 -10 Q12 -9 24 0Z" fill="var(--ink)" stroke="var(--bone)" strokeWidth=".6" {...NS} />
        <path d="M-12 -4 Q0 -8 12 -4" fill="none" stroke="var(--bone)" strokeWidth=".4" {...NS} />
        <path d="M-3 -10 v-4 h6 v4 M-4 -14 h8 l-4 -2z" fill="none" stroke="var(--bone)" strokeWidth=".4" {...NS} />
        <text y="7" textAnchor="middle" className="hz-t" style={HZT}>Ithaca</text><text y="12" textAnchor="middle" className="hz-t" style={HZT}>API v2 · 62%</text>
      </g>
      <g transform={`translate(162,${HZ - 1})`}><path d="M-4 0 h8 l-1.5 2 h-5z M0 0 v-7 l3 5z" fill="var(--bone)" opacity=".8" /><text y="8" textAnchor="middle" className="hz-t" style={HZT}>Teammate O</text><text y="13" textAnchor="middle" className="hz-t" style={HZT}>inbound</text></g>
    </g>
  )
})

/* ------------------------------------------------------------- the ship */
const Rigging = memo(function Rigging() {
  const shrouds = (m: { x: number; top: number }, y0: number, xs: number[], deckY: number) => xs.map((dx, i) => <Line key={i} d={`M${m.x} ${y0} L${m.x + dx} ${deckY}`} w={.5} o={.45} />)
  const ratlines = (m: { x: number }, y0: number, dx: number, deckY: number) => Array.from({ length: 12 }, (_, k) => { const t = (k + 1) / 13, y = y0 + (deckY - y0) * t; return <Line key={k} d={`M${m.x - 2} ${y} L${m.x + dx * t} ${y}`} w={.4} o={.35} /> })
  return (
    <g className="rigging">
      {shrouds(MAIN, 236, [-70, -54, -38], 532)}{ratlines(MAIN, 236, -70, 532)}
      {shrouds(FORE, 262, [-60, -46], 524)}{ratlines(FORE, 262, -60, 524)}
      {shrouds(MIZ, 330, [-60, -44], 498)}
      <Line d={`M${MAIN.x} ${MAIN.top + 8} L${FORE.x} ${FORE.top + 40}`} w={.6} o={.55} />
      <Line d={`M${FORE.x} ${FORE.top + 6} L1214 460`} w={.6} o={.6} />
      <Line d={`M${MAIN.x} ${MAIN.top + 30} L${MIZ.x} ${MIZ.top + 6}`} w={.6} o={.55} />
      <Line d={`M${MIZ.x} ${MIZ.top + 4} L304 496`} w={.5} o={.45} />
      <Line d={`M${MAIN.x} 240 L960 500`} w={.4} o={.3} />
    </g>
  )
})

const Masts = memo(function Masts() {
  const mast = (m: { x: number; foot: number; top: number }, w: number) => <path d={`M${m.x - w} ${m.foot} L${m.x - w * .45} ${m.top} L${m.x + w * .45} ${m.top} L${m.x + w} ${m.foot}Z`} fill="var(--ink)" stroke="var(--bone)" strokeWidth=".8" {...NS} />
  return (
    <g>
      {SAILS.map((s, i) => (
        <g key={i} className="sail-g" style={{ animationDelay: `${-i * .6}s` }}>
          <path d={sail(s.x, s.y1, s.w1, s.y2, s.w2)} fill="#12171e" stroke="var(--bone)" strokeWidth=".8" {...NS} />
          <clipPath id={'sc' + i}><path d={sail(s.x, s.y1, s.w1, s.y2, s.w2)} /></clipPath>
          <g clipPath={`url(#sc${i})`} opacity=".22">{Array.from({ length: 16 }, (_, k) => <Line key={k} d={`M${s.x - s.w2 - 10 + k * ((s.w2 * 2 + 20) / 15)} ${s.y1} V${s.y2 + 20}`} w={.5} o={1} />)}</g>
          <Line d={`M${s.x - s.w1 - 10} ${s.y1} H${s.x + s.w1 + 10}`} w={1.6} o={.9} />
          {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={s.x - s.w1 + (k + .5) * (s.w1 * 2 / 5)} cy={s.y1 + 6} r="1" fill="var(--bone)" opacity=".5" />)}
        </g>
      ))}
      {/* spanker on the mizzen, boom out over the stern */}
      <g className="sail-g" style={{ animationDelay: '-2s' }}>
        <path d="M418 336 L330 356 Q312 420 300 478 L416 480 Z" fill="#12171e" stroke="var(--bone)" strokeWidth=".8" {...NS} />
        <Line d="M418 480 L262 474" w={1.4} o={.9} /><Line d="M418 334 L326 354" w={1.2} o={.9} />
      </g>
      {/* jibs to the bowsprit */}
      <path className="jib" d="M886 252 L1196 462 L1000 484 Z" fill="#12171e" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <path className="jib" d="M888 330 L1124 476 L968 490 Z" fill="#12171e" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      {mast(MAIN, 7)}{mast(FORE, 6)}{mast(MIZ, 5)}
      {/* main top and crow's nest */}
      <path d={`M${MAIN.x - 26} 232 h52 l-4 6 h-44z`} fill="var(--ink)" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <path d={`M${MAIN.x - 14} 202 h28 l-3 22 h-22z`} fill="var(--ink)" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      {[206, 212, 218].map((y) => <Line key={y} d={`M${MAIN.x - 13} ${y} h26`} w={.4} o={.4} />)}
      <path d={`M${FORE.x - 22} 258 h44 l-4 5 h-36z`} fill="var(--ink)" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      {/* pennant + ensign */}
      <path className="pennant" d={`M${MAIN.x} ${MAIN.top} l70 7 l-70 7z`} fill="var(--signal)" />
      <path className="ensign" d="M262 474 l0 -30 l34 4 q-6 10 0 20z" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <path d="M262 474 V440" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      {/* signal hoist: W-4-3 */}
      <Line d={`M${MIZ.x} ${MIZ.top} L340 420`} w={.4} o={.5} />
      <g className="hoist">
        <g transform="translate(398,330)"><rect width="14" height="14" fill="var(--ink)" stroke="var(--bone)" strokeWidth=".6" {...NS} /><rect x="3" y="3" width="8" height="8" fill="var(--bone)" /><rect x="5.5" y="5.5" width="3" height="3" fill="var(--signal)" /></g>
        <g transform="translate(380,354)"><path d="M0 0 h16 l-16 9z" fill="var(--signal)" /><circle cx="4" cy="3" r="1.6" fill="var(--bone)" /></g>
        <g transform="translate(364,376)"><path d="M0 0 h16 l-16 9z" fill="var(--bone)" /><path d="M5 0 v6.2 M10 0 v3.4" stroke="var(--signal)" strokeWidth="2" /></g>
      </g>
    </g>
  )
})

const Hull = memo(function Hull() {
  return (
    <g>
      <clipPath id="hullc"><path d={HULL} /></clipPath>
      <path d={HULL} fill="#10151b" stroke="var(--bone)" strokeWidth="1.1" {...NS} />
      <g clipPath="url(#hullc)" opacity=".2">{Array.from({ length: 13 }, (_, k) => <Line key={k} d={`M280 ${512 + k * 15} Q700 ${534 + k * 15 + k * 1.2} 1100 ${506 + k * 15 - k * 2}`} w={.6} o={1} />)}</g>
      {/* wale + rail */}
      <Line d="M300 498 L470 498 L470 526 Q700 548 960 520 L960 500 L1084 494" w={1.2} o={.9} />
      <Line d="M300 490 L470 490 M960 492 L1080 486" w={.6} o={.6} />
      {Array.from({ length: 9 }, (_, k) => <Line key={k} d={`M${308 + k * 20} 490 V498`} w={.5} o={.5} />)}
      {Array.from({ length: 6 }, (_, k) => <Line key={k} d={`M${968 + k * 20} ${491.5 - k * .6} V${500 - k * 1}`} w={.5} o={.5} />)}
      {/* stern windows + gallery */}
      {[0, 1, 2].map((k) => <rect key={k} x={308 + k * 0} y={512 + k * 20} width="9" height="12" fill="none" stroke="var(--bone)" strokeWidth=".6" opacity=".7" {...NS} transform={`translate(${k * 2},0)`} />)}
      {/* bowsprit + figurehead */}
      <path d="M1076 498 L1218 458" stroke="var(--bone)" strokeWidth="2" {...NS} />
      <path d="M1084 494 q16 -2 22 10 q-8 2 -14 8" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      {/* anchor */}
      <g transform="translate(1040,560)" opacity=".8"><path d="M0 0 V22 M-8 16 Q0 26 8 16 M-5 3 H5" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} /><circle cy="-2" r="2" fill="none" stroke="var(--bone)" strokeWidth=".6" {...NS} /><path d="M0 -4 Q12 -40 30 -64" fill="none" stroke="var(--bone)" strokeWidth=".5" strokeDasharray="2 2" opacity=".6" {...NS} /></g>
      {/* portholes fore */}
      {[0, 1, 2].map((k) => <circle key={k} cx={972 + k * 26} cy={548 + k * 2} r="5" fill="none" stroke="var(--bone)" strokeWidth=".6" opacity=".6" {...NS} />)}
      {/* helm */}
      <g transform="translate(452,476)" className="wheel"><circle r="13" fill="none" stroke="var(--bone)" strokeWidth=".8" {...NS} /><circle r="3" fill="var(--bone)" />{[0, 30, 60, 90, 120, 150].map((a) => <g key={a} transform={`rotate(${a})`}><Line d="M-17 0 H17" w={.7} o={.9} /></g>)}</g>
      <Line d="M452 489 V498" w={1} o={.8} />
    </g>
  )
})

/* the cutaway: cabin aft, berths and the hold amidships */
function Interior({ week, onCrate }: { week: number; onCrate: (id: string) => void }) {
  const { status, names, priv } = useStore()
  const isl = liveIslands(week, status, names).filter((i) => priv || i.state !== 'sinking')
  const [hov, setHov] = useState<string | null>(null)
  const crates = useMemo(() => {
    let x = 500, row = 0; const out: { id: string; x: number; y: number; w: number; h: number; state: string; label: string; age: number }[] = []
    isl.forEach((i) => { const w = 30 + i.r * .42, h = w * .72; if (x + w > 880) { x = 512 + row * 20; row++ } const sink = i.state === 'sinking'; out.push({ id: i.id, x, y: 690 - h - row * 46 + (sink ? 8 : 0), w, h, state: i.state, label: i.label, age: i.age }); x += w + 6 })
    return out
  }, [isl.map((i) => i.id + i.state + i.label).join()]) // eslint-disable-line react-hooks/exhaustive-deps
  const hc = crates.find((c) => c.id === hov)
  return (
    <g className="interior">
      <path d={CUT} fill="#0b0f14" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <clipPath id="cutc"><path d={CUT} /></clipPath>
      <g clipPath="url(#cutc)">
        {/* deck beams + berth deck */}
        {Array.from({ length: 10 }, (_, k) => <rect key={k} x={492 + k * 48} y="540" width="8" height="8" fill="none" stroke="var(--bone)" strokeWidth=".5" opacity=".5" {...NS} />)}
        <Line d="M482 604 H948" w={.8} o={.7} />
        {Array.from({ length: 7 }, (_, k) => <path key={k} className="hammock" style={{ animationDelay: `${-k * .5}s` }} d={`M${520 + k * 58} 556 Q${540 + k * 58} 576 ${560 + k * 58} 556`} fill="none" stroke="var(--bone)" strokeWidth=".7" opacity=".55" {...NS} />)}
        {/* ladder */}
        {[0, 1, 2, 3, 4].map((k) => <Line key={k} d={`M584 ${612 + k * 16} h18`} w={.5} o={.5} />)}<Line d="M584 604 V700 M602 604 V700" w={.6} o={.5} />
        {/* bilge */}
        <path className="bilge" d="M470 682 q20 -3 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V720 H470Z" fill="rgba(150,182,194,.08)" stroke="var(--bone)" strokeWidth=".5" strokeDasharray="2 3" opacity=".8" {...NS} />
      </g>
      {crates.map((c) => (
        <g key={c.id} className={`crate ${c.state}${hov === c.id ? ' on' : ''}`} transform={`translate(${c.x},${c.y})`} onMouseEnter={() => setHov(c.id)} onMouseLeave={() => setHov(null)} onClick={(e) => { e.stopPropagation(); onCrate(c.id) }}
          role="button" tabIndex={0} aria-label={`Cargo: ${c.label}`} data-cursor="Find on chart" onKeyDown={(e) => e.key === 'Enter' && onCrate(c.id)}>
          <rect width={c.w} height={c.h} className="box" {...NS} />
          <path d={`M0 0 L${c.w} ${c.h} M${c.w} 0 L0 ${c.h}`} className="brace" {...NS} />
          <path d={`M0 ${c.h * .5} H${c.w}`} className="brace" {...NS} />
        </g>
      ))}
      <AnimatePresence>{hc && (
        <motion.g key={hc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transform={`translate(${hc.x + hc.w / 2},${hc.y - 8})`} pointerEvents="none">
          <text textAnchor="middle" className="crate-t">{hc.label}</text>
          <text y="13" textAnchor="middle" className={`micro${hc.state === 'overdue' ? ' sig' : ''}`}>{hc.state === 'overdue' ? `overdue · ${hc.age}d` : hc.state === 'sinking' ? 'taking on water' : `${hc.age}d aboard`}</text>
        </motion.g>)}</AnimatePresence>
      {/* captain's cabin */}
      <path d="M318 504 H466 V598 H330 Q322 560 318 504Z" fill="#0b0f14" stroke="var(--bone)" strokeWidth=".8" {...NS} />
      <rect x="376" y="566" width="64" height="5" fill="none" stroke="var(--bone)" strokeWidth=".7" {...NS} />
      <Line d="M382 571 V596 M434 571 V596" w={.6} o={.7} />
      <path d="M380 566 q8 -6 16 -2 q10 -4 18 0 q8 -3 18 1" fill="none" stroke="var(--bone)" strokeWidth=".5" opacity=".7" {...NS} />
      <g className="lantern"><Line d="M424 504 V520" w={.5} o={.7} /><path d="M419 520 h10 l-1 12 h-8z" fill="none" stroke="var(--bone)" strokeWidth=".7" {...NS} /><circle cx="424" cy="526" r="2.4" fill="var(--signal)" className="flame" /></g>
      <text x="392" y="520" className="micro" textAnchor="middle">Cabin</text>
      <text x="700" y="598" className="micro" textAnchor="middle">Berths</text>
      <text x="760" y="622" className="micro" textAnchor="middle">The hold · {crates.length} in cargo</text>
    </g>
  )
}

/* ------------------------------------------------------------- the sheet */
export function Profile({ sel, setSel, lit, setHov }: { sel: CrewId | null; setSel: (c: CrewId | null) => void; lit: CrewId | null; setHov: (c: CrewId | null) => void }) {
  const { week, setRoute, select } = useStore()
  const svg = useRef<SVGSVGElement>(null)
  const [glass, setGlass] = useState<{ x: number; y: number } | null>(null)
  const ids = Object.keys(CREW) as CrewId[]
  const move = (e: React.PointerEvent) => {
    const s = svg.current; if (!s) return
    const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY
    const q = p.matrixTransform(s.getScreenCTM()!.inverse())
    setGlass(q.x < 300 && q.y > 480 && q.y < 625 ? { x: q.x, y: q.y } : null)
  }
  const onCrate = (id: string) => { setRoute('map'); setTimeout(() => select(id), 1400) }
  return (
    <svg ref={svg} className="pf" viewBox="110 70 1140 780" preserveAspectRatio="xMidYMid meet" onPointerMove={move} onPointerLeave={() => setGlass(null)} onClick={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
      <defs>
        <mask id="nohull" maskUnits="userSpaceOnUse" x="-200" y="0" width="2000" height="900"><rect x="-200" y="0" width="2000" height="900" fill="#fff" /><path d={HULL} fill="#000" className="ship-rock" /></mask>
        <clipPath id="lens"><circle r="74" cx={glass?.x ?? -999} cy={glass?.y ?? -999} /></clipPath></defs>
      <Clouds /><Gulls />
      <Horizon />
      <text x="226" y="606" textAnchor="middle" className="micro hint">Hover the horizon</text><text x="226" y="620" textAnchor="middle" className="micro hint">for the lookout's glass</text>
      <Sea />
      <g className="ship-rock">
        <Rigging /><Masts /><Hull />
        <Interior week={week} onCrate={onCrate} />
        <Line d={`M296 ${WL} H1092`} w={.7} o={.6} dash="10 4 2 4" />
        <text x="1100" y={WL + 3} className="micro">LWL</text>
        {/* lines of rigging, one per crew member: the stronger the bond, the tauter the line */}
        {ids.map((id, i) => {
          const p = ST[id], b = CREW[id].bond, on = lit === id
          const sag = on ? 0 : (6 - b) * 16 + 10
          const mx = (YOU.x + p.x) / 2, my = Math.max(YOU.y, p.y) + sag - (id === 'D' ? 120 : 0)
          return <motion.path key={id} fill="none" className={`rope${on ? ' on' : ''}`} stroke={on ? 'var(--signal)' : 'var(--bone)'} strokeWidth={.5 + b * .4} {...NS}
            initial={{ pathLength: 0, opacity: 0, d: `M${YOU.x} ${YOU.y} Q${mx} ${my} ${p.x} ${p.y}` }}
            animate={{ pathLength: 1, opacity: lit && !on ? .1 : .22 + b * .08, d: `M${YOU.x} ${YOU.y} Q${mx} ${my} ${p.x} ${p.y}` }}
            transition={{ pathLength: { duration: 1.6, delay: 1 + i * .1, ease }, d: { type: 'spring', stiffness: 120, damping: 9 }, opacity: { duration: .4 } }} />
        })}
        <g transform={`translate(${YOU.x},${YOU.y})`}>
          <circle r="14" className="you-ring" fill="none" stroke="var(--signal)" strokeWidth=".8" {...NS} />
          <circle r="5.5" fill="var(--signal)" />
          <text x="-24" y="-12" textAnchor="end" className="crew-n">You</text>
          <text x="-24" y="4" textAnchor="end" className="micro">Captain · quarterdeck</text>
        </g>
        {ids.map((id, i) => {
          const p = ST[id], m = CREW[id], on = lit === id
          return (
            <motion.g key={id} className={`crew${sel === id ? ' sel' : ''}${lit && !on ? ' dim' : ''}`} role="button" tabIndex={0} aria-label={`${m.name}, ${m.role}`} data-cursor={m.role}
              onClick={(e) => { e.stopPropagation(); setSel(sel === id ? null : id) }} onKeyDown={(e) => e.key === 'Enter' && setSel(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + i * .08, duration: .8 }}>
              <path d={`M${p.x} ${p.y + 14} V762 H${p.slot} V774`} fill="none" className="leader" stroke={on ? 'var(--signal)' : 'var(--bone)'} strokeWidth=".6" strokeDasharray="1.5 3" {...NS} />
              <circle cx={p.x} cy={p.y} r="24" fill="transparent" />
              <circle cx={p.x} cy={p.y} r="12" className="node" {...NS} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" className="crew-id">{id}</text>
              <g transform={`translate(${p.slot},796)`}>
                <rect x="-68" y="-22" width="136" height="70" fill="transparent" />
                <text textAnchor="middle" className="crew-n">{m.name}</text>
                <text y="20" textAnchor="middle" className="micro">{m.role}</text>
                <text y="36" textAnchor="middle" className="micro dimmer">{m.station}</text>
              </g>
            </motion.g>
          )
        })}
      </g>
      <g mask="url(#nohull)" pointerEvents="none"><Sea front /></g>

      {/* the lookout's glass */}
      <AnimatePresence>{glass && (
        <motion.g key="glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} pointerEvents="none">
          <circle cx={glass.x} cy={glass.y} r="74" fill="var(--ink)" />
          <g clipPath="url(#lens)"><use href="#hz" transform={`translate(${glass.x},${glass.y}) scale(3.4) translate(${-glass.x},${-glass.y})`} /></g>
          <circle cx={glass.x} cy={glass.y} r="74" fill="none" stroke="var(--bone)" strokeWidth="1.2" {...NS} />
          <circle cx={glass.x} cy={glass.y} r="80" fill="none" stroke="var(--bone)" strokeWidth=".5" opacity=".5" {...NS} />
          <path d={`M${glass.x - 74} ${glass.y} h18 M${glass.x + 56} ${glass.y} h18 M${glass.x} ${glass.y - 74} v18 M${glass.x} ${glass.y + 56} v18`} stroke="var(--bone)" strokeWidth=".6" {...NS} />
        </motion.g>)}</AnimatePresence>

      <g transform="translate(152,662)" className="tblock">
        <rect width="136" height="84" fill="none" stroke="var(--bone)" strokeWidth=".6" opacity=".5" {...NS} />
        <path d="M0 24 H136" stroke="var(--bone)" strokeWidth=".6" opacity=".35" {...NS} />
        <text x="10" y="16" className="micro">Sheet I · profile</text>
        <text x="10" y="42" className="micro">Week {week}</text><text x="10" y="58" className="micro">Signal · W{week}</text><text x="10" y="74" className="micro">By Athena</text>
      </g>
    </svg>
  )
}
