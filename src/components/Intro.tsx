import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Field } from './Field'
import { NOW_WEEK, PERSON, WEEKS } from '../data'

const ease = [.22, 1, .36, 1] as const
const WORD = 'Odyssey'

/** Coordinates that settle onto Ithaca, the way a fix comes in on a plotter. */
function Fix() {
  const [t, setT] = useState(0)
  useEffect(() => { const t0 = performance.now(); let raf = 0; const f = (n: number) => { const p = Math.min(1, (n - t0) / 2600); setT(1 - Math.pow(1 - p, 4)); if (p < 1) raf = requestAnimationFrame(f) }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf) }, [])
  const lat = 36 + (38.4167 - 36) * t, lon = 17 + (20.6667 - 17) * t
  const f = (v: number, p: string) => { const d = Math.floor(v), m = (v - d) * 60; return `${d}°${m.toFixed(2).padStart(5, '0')}′${p}` }
  return <>{f(lat, 'N')}<br />{f(lon, 'E')}</>
}

export function Intro({ onDone }: { onDone: () => void }) {
  return (
    <motion.section id="intro" aria-label="Welcome" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: [.76, 0, .24, 1] }}>
      <motion.div style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.4 }}>
        <Field alpha={0.13} levels={16} scale={0.0018} />
      </motion.div>
      <div className="i-vig" />
      <motion.i className="i-rule t" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease, delay: .2 }} />
      <motion.i className="i-rule b" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease, delay: .35 }} />
      <motion.p className="i-corner tl mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>Chart No. {NOW_WEEK} · the voyage of<br />{PERSON.name}, {PERSON.role}</motion.p>
      <motion.p className="i-corner tr mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}><Fix /></motion.p>
      <motion.p className="i-corner bl mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Surveyed by Athena<br />from Slack · Zoom · GitHub</motion.p>
      <motion.p className="i-corner br mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>{WEEKS[NOW_WEEK]} · {PERSON.city}<br />Demo · the crew is illustrative</motion.p>
      <div className="i-copy">
        <motion.p className="i-kicker eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: 1, ease }}><i />The Work<i /></motion.p>
        <h1 aria-label="The Work Odyssey">
          {WORD.split('').map((ch, i) => (
            <span key={i} className="mask"><motion.span className={`ch${i === 0 ? ' it' : ''}`} initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay: .7 + i * .07, duration: 1.4, ease }}>{ch}</motion.span></span>
          ))}
        </h1>
        <motion.p className="i-sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 1.1, ease }}>Your work, surveyed as a sea chart. A draft, never a verdict.</motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 1, ease }}>
          <button className="btn lg solid" onClick={onDone} data-cursor="Begin" autoFocus>Begin the voyage <span className="arr">→</span></button>
        </motion.div>
      </div>
    </motion.section>
  )
}
