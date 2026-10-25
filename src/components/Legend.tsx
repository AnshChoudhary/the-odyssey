import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const B = '#e9e4d8', R = '#ff5a36', A = '#c9a86a'
const isle = 'M-22 -2 C-22 -12 -8 -15 4 -14 C16 -13 24 -6 22 3 C20 12 6 15 -6 14 C-16 13 -22 7 -22 -2Z'
const rows: [JSX.Element, string, string, string][] = [
  [<svg viewBox="-32 -22 64 44"><path d={isle} fill="#151b22" stroke={B} strokeWidth="1" /><path d={isle} transform="scale(.6)" fill="none" stroke={B} strokeWidth=".7" opacity=".5" /><path d={isle} transform="scale(.3)" fill="none" stroke={B} strokeWidth=".7" opacity=".4" /></svg>, 'Island', '', 'A task or commitment you are carrying. Rings are its weight: more rings, more of you it needs.'],
  [<svg viewBox="-32 -22 64 44"><circle r="20" fill="none" stroke={R} strokeWidth=".8" strokeDasharray="2 3" /><path d={isle} transform="scale(.7)" fill="#151b22" stroke={R} strokeWidth="1" /></svg>, 'Danger area', 'OVERDUE', 'Overdue, or someone is waiting on you. Marked in red, the only colour on the chart.'],
  [<svg viewBox="-32 -22 64 44"><path d={isle} fill="none" stroke={B} strokeWidth=".9" strokeDasharray="3 3" opacity=".5" /><text x="0" y="4" textAnchor="middle" fill={B} opacity=".6" fontFamily="Instrument Serif" fontStyle="italic" fontSize="11">E.D.</text></svg>, 'Existence doubtful', 'E.D.', 'A forgotten promise slipping under. Private by default: only you can see these.'],
  [<svg viewBox="-32 -22 64 44"><path d="M0 4 C-6 -4 -4 -14 0 -16 C4 -14 6 -4 0 4Z" fill={R} /><circle r="3" cy="4" fill={B} /></svg>, 'Light', 'FL R', 'A review or reply has been requested of you, flashing until you answer.'],
  [<svg viewBox="-32 -22 64 44"><path d="M-28 10 Q0 -22 28 6" fill="none" stroke={B} strokeWidth=".9" strokeDasharray="1 4" strokeLinecap="round" /></svg>, 'Route', '', 'A collaboration between two islands.'],
  [<svg viewBox="-32 -22 64 44"><path d="M-26 8 L-8 4 L8 -6 L22 -10" fill="none" stroke={B} strokeWidth=".9" strokeDasharray="4 3" /><path d="M22 -10 l-14 -3 2 6z" fill={B} /><circle cx="-8" cy="4" r="2" fill="none" stroke={B} /></svg>, 'Track', 'W40–43', 'Where your ship has been, week by week. Step back through the weeks to replay it.'],
  [<svg viewBox="-32 -22 64 44"><circle r="5" fill="none" stroke={A} /><circle r="1.6" fill={A} /><path d="M8 0 H26" stroke={A} strokeWidth=".8" /></svg>, 'Landing', 'SHIPPED', 'Finished work on the Shipped Continent. It grows with every landing.'],
]
export function Legend() {
  const { legend, set } = useStore()
  return (
    <AnimatePresence>
      {legend && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set({ legend: false })}>
          <motion.div className="sheet" role="dialog" aria-label="Legend" onClick={(e) => e.stopPropagation()} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>
            <p className="eyebrow"><i />Symbols &amp; abbreviations</p>
            <h2>Reading the <em>chart</em></h2>
            <div className="legend-grid">{rows.map(([i, t, c, d]) => [<div key={t + 'i'}>{i}</div>, <div key={t}><b>{t}{c && <code>{c}</code>}</b><small>{d}</small></div>])}</div>
            <div className="s-foot"><p>A mirror first, an appraisal input second. No scores, no rankings, only direction.</p><button className="btn" onClick={() => set({ legend: false })}>Close</button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
