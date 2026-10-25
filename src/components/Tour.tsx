import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const STEPS: [string, string, string][] = [
  ['This is your week,', 'surveyed.', 'Each island is something you are carrying. Red marks what needs you. The landmass on the left holds everything you have shipped.'],
  ['Read it,', 'then correct it.', 'Click any island to see where it came from. Athena drafts the chart from Slack, Zoom and GitHub; you decide what is true.'],
  ['Forgotten islands', 'stay yours.', 'Faded islands are promises slipping under. Only you see them. Switch to the manager lens to see what anyone else would.'],
]
export function Tour() {
  const { tour, set, intro, route } = useStore()
  const end = () => { try { localStorage.setItem('tour', '1') } catch { /* private mode */ } set({ tour: -1 }) }
  const s = STEPS[tour]
  return (
    <AnimatePresence>
      {!intro && route === 'map' && tour >= 0 && s && (
        <motion.div className="tour" role="dialog" aria-label="Introduction" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: .7, ease: [.22, 1, .36, 1], delay: .6 }}>
          <div className="t-head mono"><span>A note from Athena</span><span>0{tour + 1} / 0{STEPS.length}</span></div>
          <AnimatePresence mode="wait"><motion.div key={tour} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }}>
            <h3>{s[0]} <em>{s[1]}</em></h3><p>{s[2]}</p>
          </motion.div></AnimatePresence>
          <div className="row">
            <button className="btn sm solid" onClick={() => (tour === STEPS.length - 1 ? end() : set({ tour: tour + 1 }))}>{tour === STEPS.length - 1 ? 'Begin' : 'Next'} <span className="arr">→</span></button>
            <button className="link" onClick={end}>Skip</button>
            <div className="steps" aria-hidden="true">{STEPS.map((_, i) => <i key={i} className={i === tour ? 'on' : ''} />)}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
