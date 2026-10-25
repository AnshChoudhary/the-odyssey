import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CREW, CrewId, PERSON } from '../data'
import { useStore } from '../store'
import { Profile } from './DeckProfile'

const NS = { vectorEffect: 'non-scaling-stroke' } as const
const ease = [.22, 1, .36, 1] as const
const YOU = { x: 352, y: 450 }
const POS: Record<CrewId, { x: number; y: number; ly: number }> = {
  A: { x: 452, y: 392, ly: -1 }, B: { x: 566, y: 508, ly: 1 }, C: { x: 810, y: 450, ly: -1 },
  D: { x: 980, y: 450, ly: 1 }, E: { x: 1150, y: 404, ly: -1 }, F: { x: 1214, y: 500, ly: 1 },
}
const HULL = 'M300 362 C520 318 930 310 1150 358 C1262 382 1330 420 1384 450 C1330 480 1262 518 1150 542 C930 590 520 582 300 538 Z'
const DECK = 'M318 376 C530 336 925 330 1140 374 C1240 396 1300 426 1344 450 C1300 474 1240 504 1140 526 C925 570 530 564 318 524 Z'

const Draw = ({ d, delay = 0, w = 1, o = 1, dash }: { d: string; delay?: number; w?: number; o?: number; dash?: string }) => (
  <motion.path d={d} fill="none" stroke="var(--bone)" strokeWidth={w} opacity={o} strokeDasharray={dash} {...NS}
    initial={{ pathLength: dash ? 1 : 0, opacity: 0 }} animate={{ pathLength: 1, opacity: o }} transition={{ duration: 2, delay, ease }} />
)

export default function DeckView() {
  const { setRoute, week } = useStore()
  const [sel, setSel] = useState<CrewId | null>(null)
  const [hov, setHov] = useState<CrewId | null>(null)
  const [sheet, setSheet] = useState<'profile' | 'plan'>('profile')
  const c = sel ? CREW[sel] : null
  const ids = Object.keys(CREW) as CrewId[]
  const lit = hov ?? sel
  return (
    <div className="view deck">
      <div className="deck-grid" aria-hidden="true" />
      <header className="deck-head">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><i />{sheet === 'profile' ? 'Inboard profile' : 'Plan of the deck'} · W{week}</motion.p>
        <h1><span className="mask"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: .2 }}>The <em>Deck</em></motion.span></span></h1>
        <motion.div className="sheets mono" role="tablist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {(['profile', 'plan'] as const).map((k, i) => <button key={k} role="tab" aria-selected={sheet === k} className={sheet === k ? 'on' : ''} onClick={() => setSheet(k)} data-cursor={k === 'profile' ? 'Profile' : 'Plan'}>Sheet {i ? 'II' : 'I'} · {k === 'profile' ? 'Profile' : 'Plan'}</button>)}
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={sheet} className={`deck-stage ${sheet}`} initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }} exit={{ opacity: 0 }} transition={{ duration: .9, ease }}>
          {sheet === 'profile' ? <Profile sel={sel} setSel={setSel} lit={lit} setHov={setHov} /> : <Plan sel={sel} setSel={setSel} lit={lit} setHov={setHov} />}
        </motion.div>
      </AnimatePresence>

      <aside className="manifest" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {c && sel ? (
            <motion.div key={sel} className="m-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .5, ease }}>
              <p className="eyebrow"><i />{c.role} · {c.station}</p>
              <p className="mono dim" style={{ marginTop: -8 }}>{c.title}</p>
              <h2>{c.name}</h2>
              <Bond n={c.bond} />
              <p className="why">{c.why}</p>
              <p className="mono dim">Recent interactions</p>
              <ul className="ints">{c.it.map(([s, t, w], i) => <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .15 + i * .06 }}><span className="mono src">{s}</span><span>{t}</span><span className="mono w">{w}</span></motion.li>)}</ul>
              <button className="link" onClick={() => setSel(null)}>← The whole crew</button>
            </motion.div>
          ) : (
            <motion.div key="all" className="m-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .5, ease }}>
              <p className="eyebrow"><i />Crew manifest</p>
              <p className="lede">The six people you sail with most, at their stations. Each is tied to you by a line of rigging: the stronger the bond, the tauter it runs.</p>
              <ol className="roster">{ids.map((id) => (
                <li key={id}><button onClick={() => setSel(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)} data-cursor="Open">
                  <span className="mono k">{id}</span><span className="nm"><b>{CREW[id].name}</b><small className="mono">{CREW[id].role}</small></span><Bond n={CREW[id].bond} small />
                </button></li>))}</ol>
              <p className="fine mono dim">Drawn from shared threads, calls and reviews. Nobody is ranked; the lines only show where you already sail together.</p>
              <button className="btn wide" onClick={() => setRoute('map')} data-cursor="Chart">← Back to the chart</button>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

function Plan({ sel, setSel, lit, setHov }: { sel: CrewId | null; setSel: (c: CrewId | null) => void; lit: CrewId | null; setHov: (c: CrewId | null) => void }) {
  const week = useStore((s) => s.week)
  const ids = Object.keys(CREW) as CrewId[]
  return (
        <svg viewBox="200 214 1340 506" preserveAspectRatio="xMidYMid meet" onClick={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
    <defs><clipPath id="hullclip"><path d={DECK} /></clipPath></defs>
    {/* dimension lines */}
    <g className="dims" stroke="var(--bone)" strokeWidth=".6" opacity=".45">
      <path d="M300 250 H1384 M300 242 V258 M1384 242 V258" {...NS} />
      <path d="M246 362 V538 M238 362 H254 M238 538 H254" {...NS} />
    </g>
    <text x="842" y="240" textAnchor="middle" className="micro">Length over all · six stations</text>
    <text x="232" y="450" textAnchor="middle" className="micro" transform="rotate(-90 232 450)">Beam</text>

    {/* the hull */}
    <Draw d={HULL} w={1.2} />
    <Draw d={DECK} w={.6} o={.6} delay={.3} />
    <g clipPath="url(#hullclip)" opacity=".22">{[392, 414, 436, 464, 486, 508].map((y) => <path key={y} d={`M300 ${y} H1400`} stroke="var(--bone)" strokeWidth=".5" {...NS} />)}</g>
    <path d="M282 450 H1500" stroke="var(--bone)" strokeWidth=".6" strokeDasharray="18 4 2 4" opacity=".4" {...NS} />
    <text x="1508" y="454" className="micro">CL</text>
    <Draw d="M1384 450 L1478 450" w={1} delay={.6} />
    {/* stern cabin, helm, masts, hold */}
    <rect x="318" y="398" width="76" height="104" fill="none" stroke="var(--bone)" strokeWidth=".6" strokeDasharray="3 3" opacity=".5" {...NS} />
    <g transform={`translate(${YOU.x},${YOU.y})`} opacity=".7">{[0, 45, 90, 135].map((a) => <path key={a} d="M-20 0 H20" stroke="var(--bone)" strokeWidth=".6" transform={`rotate(${a})`} {...NS} />)}<circle r="15" fill="none" stroke="var(--bone)" strokeWidth=".6" {...NS} /></g>
    {[[640, 17], [980, 15]].map(([x, r]) => <g key={x}>
      <path d={`M${x} 332 V568`} stroke="var(--bone)" strokeWidth=".6" strokeDasharray="6 4" opacity=".4" {...NS} />
      <circle cx={x} cy="450" r={r} fill="var(--ink)" stroke="var(--bone)" strokeWidth=".9" {...NS} /><circle cx={x} cy="450" r={r * .45} fill="none" stroke="var(--bone)" strokeWidth=".6" {...NS} />
    </g>)}
    <g opacity=".6"><rect x="764" y="420" width="92" height="60" fill="none" stroke="var(--bone)" strokeWidth=".7" {...NS} /><path d="M764 420 L856 480 M856 420 L764 480" stroke="var(--bone)" strokeWidth=".5" {...NS} /></g>
    <text x="810" y="500" textAnchor="middle" className="micro">Hold</text>
    <text x="640" y="590" textAnchor="middle" className="micro">Main mast</text>
    <text x="980" y="590" textAnchor="middle" className="micro">Fore mast</text>

    {/* bonds */}
    {ids.map((id, i) => {
      const p = POS[id], b = CREW[id].bond, mx = (YOU.x + p.x) / 2, my = (YOU.y + p.y) / 2 + (p.y < YOU.y ? -40 : p.y > YOU.y ? 40 : (i % 2 ? 46 : -46))
      const on = lit === id
      return <motion.path key={id} d={`M${YOU.x} ${YOU.y} Q${mx} ${my} ${p.x} ${p.y}`} fill="none" className={`bond-line${on ? ' on' : ''}`}
        stroke={on ? 'var(--signal)' : 'var(--bone)'} strokeWidth={.5 + b * .45} {...NS}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: lit && !on ? .12 : .25 + b * .1 }} transition={{ pathLength: { duration: 1.6, delay: 1 + i * .1, ease }, opacity: { duration: .4 } }} />
    })}

    {/* you */}
    <g transform={`translate(${YOU.x},${YOU.y})`}>
      <circle r="16" className="you-ring" fill="none" stroke="var(--signal)" strokeWidth=".8" {...NS} />
      <circle r="6" fill="var(--signal)" />
      <text y="-28" textAnchor="middle" className="crew-n">{PERSON.first}</text>
      <text y="40" textAnchor="middle" className="micro">You · captain</text>
    </g>

    {/* crew */}
    {ids.map((id, i) => {
      const p = POS[id], m = CREW[id]
      return (
        <motion.g key={id} transform={`translate(${p.x},${p.y})`} className={`crew${sel === id ? ' sel' : ''}${lit && lit !== id ? ' dim' : ''}`}
          role="button" tabIndex={0} aria-label={`${m.name}, ${m.role}`} data-cursor={m.role}
          onClick={() => setSel(sel === id ? null : id)} onKeyDown={(e) => e.key === 'Enter' && setSel(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + i * .1, duration: .8 }}>
          <circle r="30" fill="transparent" />
          <circle r="15" className="node" {...NS} />
          <text y="4" textAnchor="middle" className="crew-id">{id}</text>
          <g transform={`translate(0,${p.ly * 34})`}>
            <text y={p.ly < 0 ? -18 : 10} textAnchor="middle" className="crew-n">{m.short}</text>
            <text y={p.ly < 0 ? 0 : 28} textAnchor="middle" className="micro">{m.role} · {m.station}</text>
          </g>
        </motion.g>
      )
    })}

    {/* title block */}
    <g transform="translate(1250,612)" className="tblock">
      <rect width="270" height="92" fill="none" stroke="var(--bone)" strokeWidth=".6" opacity=".5" {...NS} />
      <path d="M0 30 H270 M135 30 V92" stroke="var(--bone)" strokeWidth=".6" opacity=".35" {...NS} />
      <text x="14" y="21" className="micro">Plan of the deck</text>
      <text x="14" y="54" className="micro">Week {week}</text><text x="14" y="78" className="micro">By Athena</text>
      <text x="149" y="54" className="micro">Scale · trust</text><text x="149" y="78" className="micro">Example</text>
    </g>
        </svg>
  )
}

const Bond = ({ n, small }: { n: number; small?: boolean }) => (
  <span className={`bond${small ? ' sm' : ''}`} aria-label={`Works together: ${n} of 5`}>
    {[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= n ? 'on' : ''} />)}
    {!small && <small className="mono">Works together {n}/5</small>}
  </span>
)
