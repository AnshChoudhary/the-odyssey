import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const STEPS = [
  ['Welcome aboard', 'I am Athena. This chart is your work as a voyage: islands are commitments, storms are things that need you, and the continent on the left is everything you have shipped.'],
  ['Find your way', 'The rail on the left holds every place: your Ithaca goals, check-ins, crew and chronicle. Press ⌘K any time to chart a course by name, and Esc to come home.'],
  ['Your ship, your truth', 'Click your ship to board and meet your crew. Anything faded or sinking is private by default. Nothing here is a verdict, only a mirror you get to correct.'],
]
export function Tour() {
  const { tour, set, intro } = useStore()
  const end = () => { try { localStorage.setItem('tour', '1') } catch { /* private mode */ } set({ tour: -1 }) }
  const s = STEPS[tour]
  return (
    <AnimatePresence>
      {!intro && tour >= 0 && s && (
        <motion.div className="tour glass" role="dialog" aria-label="Athena's tour" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="owl" aria-hidden="true">🦉</div>
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
