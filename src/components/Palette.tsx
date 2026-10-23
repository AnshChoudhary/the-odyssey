import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, ViewId } from '../data'
import { useStore } from '../store'

export function Palette() {
  const { palette, set, setRoute, priv, setPriv } = useStore()
  const [q, setQ] = useState(''); const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const items = useMemo(() => {
    const all: { label: string; hint: string; run: () => void }[] = [
      ...NAV.flatMap((s) => s.items.map(([id, label]) => ({ label: 'Go to ' + label, hint: s.sec, run: () => setRoute(id as ViewId) }))),
      { label: priv ? 'Switch to Manager lens' : 'Switch to Private view', hint: 'View', run: () => setPriv(!priv) },
      { label: 'Replay the Athena tour', hint: 'Help', run: () => { setRoute('map'); set({ tour: 0 }) } },
      { label: 'Show the legend', hint: 'Help', run: () => set({ legend: true }) },
    ]
    return all.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))
  }, [q, priv, setRoute, setPriv, set])
  useEffect(() => { if (palette) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 30) } }, [palette])
  const close = () => set({ palette: false })
  const run = (n: number) => { items[n]?.run(); close() }
  return (
    <AnimatePresence>
      {palette && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div className="palette glass" onClick={(e) => e.stopPropagation()} initial={{ y: -20, scale: .96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
            <input ref={input} value={q} placeholder="Chart a course…" aria-label="Command"
              onChange={(e) => { setQ(e.target.value); setI(0) }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % items.length) }
                if (e.key === 'ArrowUp') { e.preventDefault(); setI((i - 1 + items.length) % items.length) }
                if (e.key === 'Enter') run(i)
              }} />
            <ul>{items.map((a, n) => <li key={a.label} className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onClick={() => run(n)}><span>{a.label}</span><small>{a.hint}</small></li>)}
              {!items.length && <li><span>Uncharted waters. Try another word.</span></li>}</ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
