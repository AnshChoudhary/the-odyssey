import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CREW, CrewId } from '../data'
import { useStore } from '../store'

const S = '#3b2a1a'
const POS: Record<CrewId, { x: number; y: number; flip?: boolean }> = {
  A: { x: 380, y: 598 }, B: { x: 560, y: 690 }, C: { x: 830, y: 690 }, D: { x: 1010, y: 300 }, E: { x: 1190, y: 690 }, F: { x: 1330, y: 690, flip: true },
}
const HAT: Record<string, JSX.Element> = {
  tri: <path d="M-17 -73 L0 -88 L17 -73 Q0 -79 -17 -73z" fill="#2b1d10" />,
  bun: <g><circle cx="0" cy="-82" r="6" fill="#2b1d10" /><path d="M-12 -70 q12 -14 24 0z" fill="#2b1d10" /></g>,
  band: <path d="M-12 -72 h24" stroke="#b5452f" strokeWidth="5" />,
  cap: <g><path d="M-12 -72 q12 -15 24 0z" fill="#3b2a1a" /><path d="M8 -72 l12 1" stroke={S} strokeWidth="3" /></g>,
  hair: <path d="M-12 -70 q12 -16 24 0 q-5 -6 -12 -5 q-7 -1 -12 5z" fill="#5b3a20" />,
  bun2: <g><circle cx="0" cy="-82" r="5" fill="#5b3a20" /><path d="M-12 -70 q12 -13 24 0z" fill="#5b3a20" /></g>,
}

function Sailor({ id, selected, onPick }: { id: CrewId; selected: boolean; onPick: () => void }) {
  const c = CREW[id], p = POS[id], d = id.charCodeAt(0) % 4
  return (
    <g transform={`translate(${p.x},${p.y})`} className={`sailor${selected ? ' sel' : ''}`} role="button" tabIndex={0} aria-label={`${c.name}, ${c.role}`} data-cursor={c.role} onClick={onPick} onKeyDown={(e) => e.key === 'Enter' && onPick()}>
      <g style={{ animationDelay: `${-d * 0.7}s` }} className="sailor-body" transform={p.flip ? 'scale(-1,1)' : undefined}>
        <path d="M-17 -4 L-12 -52 Q0 -58 12 -52 L17 -4Z" fill={c.col} stroke={S} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-12 -46 q-14 10 -16 24 M12 -46 q14 10 16 24" fill="none" stroke={S} strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="-62" r="13" fill="#f1d3ae" stroke={S} strokeWidth="2.2" />
        <circle cx="-4.5" cy="-63" r="1.5" fill={S} /><circle cx="4.5" cy="-63" r="1.5" fill={S} /><path d="M-4 -57 q4 3 8 0" fill="none" stroke={S} strokeWidth="1.6" strokeLinecap="round" />
        {HAT[c.hat]}
      </g>
      <g className="sailor-label" transform="translate(0,26)">
        <text className="crew-n" textAnchor="middle">{c.name}</text><text y="18" className="crew-r" textAnchor="middle">{c.role}</text>
      </g>
    </g>
  )
}

const Sail = ({ d, x, y }: { d: string; x: number; y: number }) => (
  <g transform={`translate(${x},${y})`}><path className="dsail" d={d} fill="#f4e8c8" stroke={S} strokeWidth="2.6" strokeLinejoin="round" /><path d={d.split(' ').slice(0, 0).join('')} /></g>
)

export default function DeckView() {
  const { setRoute, week } = useStore()
  const [sel, setSel] = useState<CrewId | null>(null)
  const c = sel ? CREW[sel] : null
  return (
    <div className="deck">
      <div className="deck-sun" aria-hidden="true" />
      <div className="deck-clouds" aria-hidden="true"><i /><i /><i /></div>
      <button className="btn glass back" onClick={() => setRoute('map')} data-cursor="Chart">← Back to chart</button>
      <div className="deck-title"><p className="eyebrow">Your crew, as of week {week}</p><h1>The Deck</h1></div>

      <svg className="deck-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" onClick={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
        <defs>
          <linearGradient id="hull" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9a6a3c" /><stop offset="1" stopColor="#5e3d20" /></linearGradient>
          <linearGradient id="sea1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3a6d78" /><stop offset="1" stopColor="#10303a" /></linearGradient>
        </defs>
        {/* far fleets */}
        <g opacity=".7" fill="#1b2430" stroke="#1b2430">
          {[60, 140, 215].map((x, i) => <g key={x} transform={`translate(${x},${596 + (i % 2) * 6})`} className="far"><path d="M-14 0 L14 0 L8 7 L-8 7Z" /><path d="M0 0 V-24 M1 -22 q10 8 6 20 H1z" strokeWidth="1.5" /></g>)}
          {[1470, 1535].map((x, i) => <g key={x} transform={`translate(${x},${598 + i * 4})`} className="far"><path d="M-14 0 L14 0 L8 7 L-8 7Z" /><path d="M0 0 V-24 M1 -22 q10 8 6 20 H1z" strokeWidth="1.5" /></g>)}
        </g>
        <text x="28" y="540" className="hand-w">your fleet</text><text x="28" y="562" className="hand-w sm">7 who rely on you</text>
        <text x="1572" y="540" className="hand-w" textAnchor="end">circle of influence</text>
        <rect x="-50" y="610" width="1700" height="400" fill="url(#sea1)" />
        <g className="waves back">{[0, 1].map((k) => <path key={k} transform={`translate(${k * 0},0)`} d={'M-200 640 ' + Array.from({ length: 12 }, (_, i) => `q50 -22 100 0`).join(' ')} fill="none" stroke="#9bc3c4" strokeOpacity=".35" strokeWidth="2" />)}</g>

        <g className="ship-deck">
          {/* rigging */}
          <path d="M630 170 L1000 140 M1000 140 L1200 660 M630 170 L360 560" stroke={S} strokeWidth="1.8" fill="none" opacity=".8" />
          {/* masts */}
          <path d="M630 180 V650" stroke={S} strokeWidth="14" strokeLinecap="round" /><path d="M1000 160 V650" stroke={S} strokeWidth="14" strokeLinecap="round" />
          <path d="M540 220 H720 M910 262 H1090" stroke={S} strokeWidth="8" strokeLinecap="round" />
          <Sail x={0} y={0} d="M545 226 Q630 250 716 226 Q700 360 712 470 Q630 496 536 470 Q548 350 545 226Z" />
          <Sail x={0} y={0} d="M915 268 Q1000 292 1086 268 Q1072 400 1082 520 Q1000 546 906 520 Q918 390 915 268Z" />
          {/* crow's nest */}
          <path d="M960 210 H1050 L1038 262 H972Z" fill="#7a5530" stroke={S} strokeWidth="3" strokeLinejoin="round" />
          <path d="M1000 140 V90 l56 14 -56 14" fill="#b4432d" stroke={S} strokeWidth="2" />
          <Sailor id="D" selected={sel === 'D'} onPick={() => setSel('D')} />
          {/* hull */}
          <path d="M200 640 L1330 640 L1300 690 Q1180 880 860 892 Q430 890 250 700Z" fill="url(#hull)" stroke={S} strokeWidth="4" strokeLinejoin="round" />
          <path d="M240 700 Q700 760 1270 700 M300 760 Q760 820 1180 760" fill="none" stroke={S} strokeWidth="2" opacity=".5" />
          {[400, 520, 640, 760, 880, 1000, 1120].map((x) => <circle key={x} cx={x} cy="740" r="12" fill="#2a1a0c" stroke={S} strokeWidth="2" />)}
          {/* stern cabin + wheel */}
          <path d="M200 540 H390 V660 H200Z" fill="#8a5d33" stroke={S} strokeWidth="3.4" /><rect x="228" y="560" width="42" height="42" fill="#f1dca4" stroke={S} strokeWidth="2.4" /><rect x="296" y="560" width="42" height="42" fill="#f1dca4" stroke={S} strokeWidth="2.4" />
          <g transform="translate(330,490)" className="wheel"><circle r="38" fill="none" stroke={S} strokeWidth="6" /><circle r="8" fill={S} />{[0, 45, 90, 135].map((a) => <path key={a} d="M-48 0 H48" stroke={S} strokeWidth="5" strokeLinecap="round" transform={`rotate(${a})`} />)}</g>
          <Sailor id="A" selected={sel === 'A'} onPick={() => setSel('A')} />
          {/* rail + cargo */}
          <path d="M390 628 H1290" stroke={S} strokeWidth="7" /><path d="M390 640 H1290" stroke={S} strokeWidth="4" />
          {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${410 + i * 41} 628 V646`} stroke={S} strokeWidth="3" />)}
          <g transform="translate(770,580)"><rect width="64" height="60" fill="#c79a5a" stroke={S} strokeWidth="3" /><path d="M0 0 L64 60 M64 0 L0 60" stroke={S} strokeWidth="2" opacity=".6" /><rect x="52" y="-28" width="46" height="28" fill="#d2a864" stroke={S} strokeWidth="3" /><text x="76" y="-9" textAnchor="middle" className="crate-t">PR</text></g>
          <Sailor id="B" selected={sel === 'B'} onPick={() => setSel('B')} /><Sailor id="C" selected={sel === 'C'} onPick={() => setSel('C')} />
          <Sailor id="E" selected={sel === 'E'} onPick={() => setSel('E')} /><Sailor id="F" selected={sel === 'F'} onPick={() => setSel('F')} />
        </g>
        <g className="waves front"><path d="M-200 800 q50 -26 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H-200Z" fill="#17404c" opacity=".85" /><path className="w2" d="M-200 850 q50 -26 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H-200Z" fill="#0d2b35" /></g>
      </svg>

      <AnimatePresence>
        {c && sel && (
          <motion.aside key={sel} className="crew-card" initial={{ opacity: 0, y: 30, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <button className="x" onClick={() => setSel(null)} aria-label="Close">×</button>
            <p className="eyebrow">{c.role}</p><h2>{c.name}</h2>
            <div className="bond" aria-label={`Bond strength ${c.bond} of 5`}>{[1, 2, 3, 4, 5].map((n) => <motion.span key={n} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: n * .07, type: 'spring' }} className={n <= c.bond ? 'on' : ''}>⚓</motion.span>)}<small>bond {c.bond}/5</small></div>
            <p className="why">{c.why}</p>
            <h3>Recent interactions</h3>
            <ul>{c.it.map(([s, t, w], i) => <li key={i}><span className={`chip ${s}`}>{s}</span><span>{t}</span><em>{w}</em></li>)}</ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
