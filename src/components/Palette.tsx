import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ALL_NAV } from '../data'
import { useStore } from '../store'
import { pad } from '../lib'

export function Palette() {
  const { palette, set, setRoute, priv, setPriv } = useStore()
  const [q, setQ] = useState(''); const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const items = useMemo(() => {
    const all: { label: string; hint: string; run: () => void }[] = [
      ...ALL_NAV.map((n, k) => ({ label: n.label, hint: `${pad(k + 1)} · ${n.sec}`, run: () => setRoute(n.id) })),
      { label: priv ? 'Switch to the manager lens' : 'Switch to the private view', hint: 'Lens', run: () => setPriv(!priv) },
      { label: 'Replay the introduction tour', hint: 'Help', run: () => { setRoute('map'); set({ tour: 0 }) } },
      { label: 'Read the chart legend', hint: 'Help', run: () => set({ legend: true }) },
    ]
    return all.filter((a) => (a.label + a.hint).toLowerCase().includes(q.toLowerCase()))
  }, [q, priv, setRoute, setPriv, set])
  useEffect(() => { if (palette) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 30) } }, [palette])
  const close = () => set({ palette: false })
  const run = (n: number) => { items[n]?.run(); close() }
  return (
    <AnimatePresence>
      {palette && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div className="palette" role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>
            <input ref={input} value={q} placeholder="Set a course for…" aria-label="Search"
              onChange={(e) => { setQ(e.target.value); setI(0) }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % Math.max(1, items.length)) }
                if (e.key === 'ArrowUp') { e.preventDefault(); setI((i - 1 + items.length) % Math.max(1, items.length)) }
                if (e.key === 'Enter') run(i)
              }} />
            <ul>{items.map((a, n) => <li key={a.label} className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onClick={() => run(n)}><span>{a.label}</span><small className="mono">{a.hint}</small></li>)}
              {!items.length && <li><span style={{ fontStyle: 'italic', opacity: .6 }}>Uncharted waters. Try another word.</span></li>}</ul>
            <div className="p-foot mono"><span>↑↓ choose</span><span>↵ sail</span><span>Esc close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
