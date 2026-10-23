import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const STEPS = [
  ['Welcome aboard', 'I am Athena. This chart shows your work as a voyage: islands are commitments, storms signal what needs attention, and the continent holds everything shipped.'],
  ['Find your way', 'The rail on the left holds every place: your goals, check-ins, crew and chronicle. Press ⌘K anytime to chart a course by name.'],
  ['Your ship, your truth', 'Click your ship to board and meet your crew. Anything faded or sinking is private by default. Nothing here is a verdict, only a mirror you control.'],
]
export function Tour() {
  const { tour, set, intro } = useStore()
  const end = () => { try { localStorage.setItem('tour', '1') } catch { /* private mode */ } set({ tour: -1 }) }
  const s = STEPS[tour]
  return (
    <AnimatePresence>
      {!intro && tour >= 0 && tour < STEPS.length && s && (
        <motion.div className="tour glass" role="dialog" aria-label="Athena's tour" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="owl" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="#3a2a1a" strokeWidth="2">
              <circle cx="20" cy="18" r="14" fill="#f4e6c8" />
              <circle cx="15" cy="17" r="3" fill="#3a2a1a" />
              <circle cx="25" cy="17" r="3" fill="#3a2a1a" />
              <path d="M12 12 L8 6 M28 12 L32 6" strokeLinecap="round" />
              <path d="M17 23 Q20 25 23 23" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait"><motion.div key={tour} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .25 }}>
              <h3>{s[0]}</h3><p>{s[1]}</p>
            </motion.div></AnimatePresence>
            <div className="row">
              <button className="btn primary sm" onClick={() => (tour === STEPS.length - 1 ? end() : set({ tour: tour + 1 }))}>{tour === STEPS.length - 1 ? 'Start exploring' : 'Next'}</button>
              <button className="link" onClick={end}>Skip tour</button>
              <div className="dots">{STEPS.map((_, i) => <i key={i} className={i === tour ? 'on' : ''} />)}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
