import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CREW, CrewId } from '../data'
import { useStore } from '../store'
import { GreekGalley, CrewMember } from '../components/GreekGalley'

const POS: Record<CrewId, { x: number; y: number; flip?: boolean }> = {
  A: { x: 340, y: 580 },
  B: { x: 580, y: 690 },
  C: { x: 760, y: 690 },
  D: { x: 1050, y: 310 },
  E: { x: 1120, y: 690 },
  F: { x: 1260, y: 690, flip: true },
}

export default function DeckView() {
  const { setRoute, week } = useStore()
  const [sel, setSel] = useState<CrewId | null>(null)
  const c = sel ? CREW[sel] : null
  
  const crewData = Object.entries(CREW).map(([id, member]) => ({
    id,
    ...POS[id as CrewId],
    name: member.name,
    role: member.role,
    color: member.col,
    hat: member.hat,
  }))
  
  return (
    <div className="deck">
      <div className="deck-sun" aria-hidden="true" />
      <div className="deck-clouds" aria-hidden="true"><i /><i /><i /></div>
      <button className="btn glass back" onClick={() => setRoute('map')} data-cursor="Chart">← Back to chart</button>
      <div className="deck-title"><p className="eyebrow">Your crew, as of week {week}</p><h1>The Deck</h1></div>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} onClick={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
        <GreekGalley crew={crewData} />
        {Object.entries(POS).map(([id, pos]) => {
          const member = CREW[id as CrewId]
          return (
            <CrewMember
              key={id}
              id={id}
              x={pos.x}
              y={pos.y}
              name={member.name}
              role={member.role}
              color={member.col}
              hat={member.hat}
              selected={sel === id}
              flip={pos.flip}
              onSelect={() => setSel(id as CrewId)}
            />
          )
        })}
      </div>

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
