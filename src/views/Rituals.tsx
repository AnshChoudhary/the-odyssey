import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GOALS, LOG, LogItem, TRIALS, Trial } from '../data'
import { useStore } from '../store'
import { useTypewriter } from '../lib'

/* ===================================================== Captain's Log */
function LogRow({ it }: { it: LogItem }) {
  const { confirmed, confirm, names, rename, notes, note, toast } = useStore()
  const [mode, setMode] = useState<'view' | 'edit' | 'note'>('view')
  const [val, setVal] = useState('')
  const title = names[it.id] ?? it.t
  const ok = confirmed[it.id]
  const save = () => {
    if (!val.trim()) return setMode('view')
    if (mode === 'edit') { rename(it.id, val.trim()); if (it.isl) rename(it.isl, val.trim()); toast('The chart is redrawn', 'Your correction is on the map.', '🗺️') }
    else note(it.id, val.trim())
    confirm(it.id); setMode('view')
  }
  return (
    <motion.li layout className={`log-row${ok ? ' ok' : ''}`}>
      <div className="log-text"><b>{title}</b><span>{it.d}</span>{notes[it.id] && <em>“{notes[it.id]}”</em>}</div>
      {ok && <motion.span className="stamp" initial={{ scale: 2.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>Confirmed</motion.span>}
      {mode === 'view' && <div className="log-actions">
        <button className="btn ink sm" onClick={() => confirm(it.id, !ok)}>{ok ? 'Undo' : 'Aye, that\'s right'}</button>
        <button className="btn ink sm" onClick={() => { setVal(title); setMode('edit') }}>Not quite</button>
        <button className="btn ink sm" onClick={() => { setVal(''); setMode('note') }}>Missing context</button>
      </div>}
      {mode !== 'view' && <div className="log-edit">
        <input autoFocus value={val} placeholder={mode === 'edit' ? 'What really happened?' : 'One line Athena missed…'} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { e.stopPropagation(); setMode('view') } }} />
        <button className="btn ink primary sm" onClick={save}>Save</button><button className="btn ink sm" onClick={() => setMode('view')}>Cancel</button>
      </div>}
    </motion.li>
  )
}

export function LogView() {
  const { confirmed, priv, set, setRoute, toast } = useStore()
  const [sealed, setSealed] = useState(false)
  const intro = useTypewriter("Here is your week, Captain. I may have read the sea wrong, so correct me wherever I did. Only you decide what is true.", 16)
  const rows = [...LOG.reached, ...LOG.storm, ...(priv ? LOG.sinking : [])]
  const done = rows.filter((r) => confirmed[r.id]).length
  const g = GOALS[0]
  const Section = ({ title, sub, items, tone }: { title: string; sub: string; items: LogItem[]; tone: string }) => (
    <section className={`log-sec ${tone}`}><header><h3>{title}</h3><span>{sub}</span></header><ul>{items.map((i) => <LogRow key={i.id} it={i} />)}</ul></section>
  )
  return (
    <div className="view ritual theme-desk">
      <div className="candle" aria-hidden="true" />
      <motion.article className="scroll" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.6, ease: [.22, 1, .36, 1], delay: .5 }}>
        <div className="roll top" /><div className="roll bot" />
        <div className="scroll-in">
          <p className="eyebrow">Weekly · about 2 minutes</p>
          <h1>The Captain's Log</h1>
          <div className="athena-row"><span className="owl">🦉</span><p className="athena">{intro.text}<i className="caret" /></p></div>
          <div className="progress"><i style={{ width: `${(done / rows.length) * 100}%` }} /><small>{done} of {rows.length} reviewed</small></div>
          <Section title="Islands reached" sub="work you completed" items={LOG.reached} tone="good" />
          <Section title="Stormy waters" sub="needs attention" items={LOG.storm} tone="storm" />
          {priv ? <Section title="Sinking islands" sub="forgotten promises · private to you" items={LOG.sinking} tone="sink" />
            : <p className="log-lock">🧭 Manager lens is on. Forgotten waters stay hidden. <button className="link ink" onClick={() => set({ priv: true })}>Switch to private view</button></p>}
          <section className="horizon">
            <h3>The horizon</h3>
            <div className="hz-grid">
              <div className="hz-card"><b>Ithaca · Q4</b><p>{g.t}</p><div className="route-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${g.p * 100}%` }} transition={{ delay: 1.8, duration: 1.4, ease: [.22, 1, .36, 1] }} /><span style={{ left: `${g.p * 100}%` }}>⛵</span><em>🏛️</em></div><small>{g.coach}</small></div>
              <div className="hz-card"><b>The Sirens</b><p>{LOG.sirens}</p><small>Distractions, not failures.</small></div>
              <div className="hz-card"><b>Crew gifts</b>{LOG.gifts.map((x) => <p key={x.from} className="gift-q">“{x.text}” <em>{x.from}</em></p>)}</div>
            </div>
          </section>
          <footer className="log-foot">
            <span className="draft">Draft · you're the captain</span>
            <button className="btn ink primary lg" disabled={sealed} onClick={() => { setSealed(true); toast('Log sealed', 'Your corrections are private until you choose to share.', '🕯️'); setTimeout(() => setRoute('map'), 1600) }}>{sealed ? 'Sealed' : 'Sign & seal the log'}</button>
            <AnimatePresence>{sealed && <motion.span className="wax" initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>⚓</motion.span>}</AnimatePresence>
          </footer>
        </div>
      </motion.article>
    </div>
  )
}

/* ===================================================== Three Trials */
const Monster = ({ type }: { type: Trial['type'] }) => (
  <svg viewBox="0 0 200 200" className="monster" aria-hidden="true">
    <defs><radialGradient id={'m' + type}><stop offset="0" stopColor="#3a2a1a" stopOpacity=".1" /><stop offset="1" stopColor="#3a2a1a" stopOpacity=".5" /></radialGradient></defs>
    <circle cx="100" cy="100" r="92" fill="#e6cf98" stroke="#3a2a1a" strokeWidth="3" /><circle cx="100" cy="100" r="80" fill="none" stroke="#3a2a1a" strokeWidth="1" strokeDasharray="2 6" />
    {type === 'cyclops' && <g stroke="#3a2a1a" strokeWidth="3" strokeLinejoin="round"><path d="M20 168 Q40 70 100 56 Q160 70 180 168Z" fill="#8a6a45" /><ellipse cx="100" cy="104" rx="46" ry="28" fill="#f4e8c8" /><circle className="pupil" cx="100" cy="104" r="19" fill="#b4432d" /><circle cx="100" cy="104" r="8" fill="#17110c" /><path d="M56 82 q44 -26 88 0" fill="none" /><path d="M64 150 q36 20 72 0" fill="none" /></g>}
    {type === 'storm' && <g stroke="#3a2a1a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"><path d="M30 60 q20 -30 50 -10 q20 -26 46 -2 q30 -6 34 24 H30z" fill="#9a9a98" /><path className="zap" d="M104 84 l-22 44 20 -4 -14 40 40 -56 -22 4z" fill="#f4cf5a" /><path d="M24 150 q20 -16 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#2f6b73" /></g>}
    {type === 'scylla' && <g fill="none" stroke="#3a2a1a" strokeWidth="3" strokeLinecap="round"><g className="whirl" style={{ transformOrigin: '100px 110px' }}><path d="M100 110 m-8 0 a8 8 0 1 1 16 0 a16 16 0 1 1 -32 0 a26 26 0 1 1 52 0 a38 38 0 1 1 -76 0 a52 52 0 1 1 104 0" stroke="#2f6b73" /></g><path d="M40 60 q-14 -22 6 -34 q14 2 8 18 M66 54 q-6 -26 16 -30" /><circle cx="48" cy="34" r="2.5" fill="#3a2a1a" /></g>}
  </svg>
)
const FIELDS = { cyclops: 'What made it a single point of failure?', storm: 'What did the first hour look like?', scylla: 'Why was there no good choice?' } as const

export function TrialsView() {
  const { trials, trial, epic, setEpic, toast, setRoute } = useStore()
  const [swap, setSwap] = useState<string | null>(null)
  const [story, setStory] = useState<string | null>(null)
  const [tmp, setTmp] = useState('')
  const [share, setShare] = useState(false)
  const all = TRIALS.every((t) => trials[t.id]?.confirmed)
  const text = useMemo(() => {
    const bits = TRIALS.map((t, i) => {
      const x = trials[t.id] ?? {}
      const lead = (['First came', 'Then rose', 'Last, between two perils, stood'] as const)[i]
      const body = x.title ? `${x.title.replace(/\.$/, '')}` : t.title
      return `${lead} ${t.name}: ${body.charAt(0).toLowerCase() + body.slice(1)}. ${x.story ? x.story.replace(/\.$/, '') + '. ' : t.ai.split('. ')[0] + '. '}`
    })
    return `In the waning days of October, you faced three trials. ${bits.join('')}And the ship, bruised but whole, sailed on toward Ithaca.`
  }, [trials])
  const ty = useTypewriter(text, 14, !!epic)
  const confirmedN = TRIALS.filter((t) => trials[t.id]?.confirmed).length
  return (
    <div className="view ritual theme-desk">
      <div className="page trials">
        <div className="page-inner">
          <header className="page-head"><p className="eyebrow">Monthly · about 5 minutes</p><h1>The Three Trials</h1><p>October, as an epic. Athena found the three hardest things you faced. Confirm them, swap them, or tell the story behind each.</p>
            <div className="runes">{TRIALS.map((t) => <i key={t.id} className={trials[t.id]?.confirmed ? 'on' : ''}>{t.glyph}</i>)}<small>{confirmedN} of 3 sealed</small></div></header>
          <div className="trial-grid">
            {TRIALS.map((t, i) => {
              const x = trials[t.id] ?? { confirmed: false }
              return (
                <motion.article key={t.id} className={`trial${x.confirmed ? ' sealed' : ''}`} initial={{ opacity: 0, y: 60, rotate: i === 1 ? 0 : i ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: .15 + i * .15, type: 'spring', stiffness: 120, damping: 18 }} whileHover={{ y: -6 }}>
                  <Monster type={t.type} />
                  <span className="chip kind">{t.kind}</span>
                  <h2>{t.name}</h2>
                  <h4>{x.title ?? t.title}</h4>
                  <p>{t.ai}</p>
                  <div className="tstats">{t.stats.map(([n, l]) => <div key={l}><b>{n}</b><small>{l}</small></div>)}</div>
                  {x.story && <p className="mine">“{x.story}”</p>}
                  {swap === t.id && <div className="log-edit"><input autoFocus placeholder="Name a harder challenge…" value={tmp} onChange={(e) => setTmp(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (trial(t.id, { title: tmp, confirmed: true }), setSwap(null))} /><button className="btn ink primary sm" onClick={() => { if (tmp.trim()) trial(t.id, { title: tmp.trim(), confirmed: true }); setSwap(null) }}>Swap</button></div>}
                  {story === t.id && <div className="log-edit col"><textarea autoFocus rows={3} placeholder={FIELDS[t.type] + ' Who helped? What would you do differently?'} value={tmp} onChange={(e) => setTmp(e.target.value)} /><button className="btn ink primary sm" onClick={() => { if (tmp.trim()) trial(t.id, { story: tmp.trim(), confirmed: true }); setStory(null) }}>Add backstory</button></div>}
                  {swap !== t.id && story !== t.id && <div className="log-actions">
                    <button className="btn ink primary sm" onClick={() => trial(t.id, { confirmed: !x.confirmed })}>{x.confirmed ? '✓ Sealed' : 'Confirm'}</button>
                    <button className="btn ink sm" onClick={() => { setTmp(''); setSwap(t.id); setStory(null) }}>Swap for a harder one</button>
                    <button className="btn ink sm" onClick={() => { setTmp(x.story ?? ''); setStory(t.id); setSwap(null) }}>Add backstory</button></div>}
                </motion.article>
              )
            })}
          </div>

          <AnimatePresence>
            {all && !epic && (
              <motion.div className="epic-cta" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p>All three trials sealed. Shall I sing your month?</p>
                <button className="btn primary lg" onClick={() => setEpic(text)} data-cursor="Render">Render my epic ✦</button>
              </motion.div>
            )}
            {epic && (
              <motion.div className="epic-book" initial={{ opacity: 0, y: 60, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }}>
                <p className="eyebrow">Chapter X · October</p><h2>Three Trials</h2>
                <p className="epic-text">{ty.text}<i className="caret" /></p>
                <div className="log-actions">
                  <label className="share"><input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} /> Share with my manager <small>{share ? 'visible to them' : 'private by default'}</small></label>
                  <button className="btn ink primary" onClick={() => { setEpic(text); toast('Saved to the Chronicle', 'Chapter X is in your Chapters of the Epic.', '📜'); setRoute('chapters') }}>Save to Chronicle</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
