import { motion } from 'framer-motion'
import { NAV, NOW_WEEK, PERSON, WEEKS } from '../data'
import { useStore } from '../store'
import { pad } from '../lib'
import { Field } from './Field'

const ease = [.76, 0, .24, 1] as const
export function Menu() {
  const route = useStore((s) => s.route)
  let n = 0
  return (
    <motion.nav id="menu" aria-label="Index" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .8, ease }}>
      <Field alpha={0.09} levels={12} />
      <motion.div className="m-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45, duration: .8 }}>
        <p className="lead">A sea chart of your work. <em>Islands</em> are commitments, <em>storms</em> are what needs you, and the <em>continent</em> is everything you have shipped.</p>
        <div className="m-meta mono">
          <span>Captain</span><b>{PERSON.name}</b>
          <span>Post</span><b>{PERSON.role} · {PERSON.team}</b>
          <span>Home port</span><b>{PERSON.city}</b>
          <span>Survey</span><b>Week {NOW_WEEK} · {WEEKS[NOW_WEEK]}</b>
          <span>Sources</span><b>Slack · Zoom · GitHub</b>
          <span>Posture</span><b>Private by default</b>
          <span>Shortcuts</span><b>⌘K search · Esc home</b>
        </div>
      </motion.div>
      <div className="m-list">
        {NAV.map((s) => (
          <div key={s.sec}>
            <p className="m-sec mono">{s.sec}</p>
            {s.items.map(([id, label, desc]) => {
              const k = n++
              return (
                <motion.a key={id} href={'#/' + id} className={`m-item${route === id ? ' on' : ''}`} aria-current={route === id ? 'page' : undefined} data-cursor="Sail"
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 + k * .035, duration: .9, ease: [.22, 1, .36, 1] }}>
                  <span className="n mono">{pad(k + 1)}</span><b>{label}</b><small className="mono">{desc}</small>
                </motion.a>
              )
            })}
          </div>
        ))}
      </div>
    </motion.nav>
  )
}
