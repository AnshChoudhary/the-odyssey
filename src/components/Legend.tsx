import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const rows: [JSX.Element, string, string][] = [
  [<svg viewBox="0 0 56 40"><ellipse cx="28" cy="22" rx="20" ry="13" fill="#e8d3a2" stroke="#5b4630" strokeWidth="2" /></svg>, 'Island', 'A task or commitment you are carrying.'],
  [<svg viewBox="0 0 56 40"><ellipse cx="28" cy="24" rx="20" ry="13" fill="#e8d3a2" stroke="#b4432d" strokeWidth="3" /><circle cx="22" cy="8" r="7" fill="#777" /><circle cx="32" cy="9" r="6" fill="#8a8a8a" /></svg>, 'Stormy waters', 'Overdue, or someone is waiting on you.'],
  [<svg viewBox="0 0 56 40"><ellipse cx="28" cy="22" rx="20" ry="13" fill="#e8d3a2" stroke="#5b4630" strokeWidth="2" opacity=".35" strokeDasharray="4 3" /></svg>, 'Sinking island', 'A forgotten promise. Private by default; only you see it.'],
  [<svg viewBox="0 0 56 40"><circle cx="28" cy="20" r="6" fill="#e8742c" /><circle cx="28" cy="20" r="13" fill="none" stroke="#e8742c" strokeWidth="2" opacity=".5" /></svg>, 'Flare', 'A review or reply has been requested of you.'],
  [<svg viewBox="0 0 56 40"><path d="M2 30 Q16 4 30 22 T54 12" fill="none" stroke="#5b4630" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" /></svg>, 'Route', 'A collaboration between two islands.'],
  [<svg viewBox="0 0 56 40"><path d="M6 10h40v22H6z" fill="#d3b47a" stroke="#5b4630" strokeWidth="2" /><path d="M12 6v14l10-4z" fill="#b4432d" /></svg>, 'The Shipped Continent', 'Your finished work, growing with every landing.'],
]
export function Legend() {
  const { legend, set } = useStore()
  return (
    <AnimatePresence>
      {legend && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set({ legend: false })}>
          <motion.div className="sheet" role="dialog" aria-label="Legend" onClick={(e) => e.stopPropagation()} initial={{ y: 40, opacity: 0, rotate: -1 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
            <p className="eyebrow" style={{ color: 'var(--red)' }}>Reading the chart</p>
            <h2>Every symbol, in plain English</h2>
            <div className="legend-grid">{rows.map(([i, t, d]) => [<div key={t + 'i'}>{i}</div>, <div key={t}><b>{t}</b><small>{d}</small></div>])}</div>
            <p style={{ fontSize: 15, opacity: .75, marginTop: 20 }}>The map is a mirror first and an appraisal input second. There are no scores or rankings, only direction.</p>
            <button className="btn ink primary" style={{ marginTop: 6 }} onClick={() => set({ legend: false })}>Got it</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
