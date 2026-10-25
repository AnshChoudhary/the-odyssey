import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { GOALS, LOG, LogItem, NOW_WEEK, TRIALS, Trial } from '../data'
import { useStore } from '../store'
import { blob, pad, roman, useTypewriter } from '../lib'
import { NextChapter, Reveal } from './Pages'

const ease = [.22, 1, .36, 1] as const
const NS = { vectorEffect: 'non-scaling-stroke' } as const

/* ===================================================== Captain's Log */
function LogRow({ it, n }: { it: LogItem; n: number }) {
  const { confirmed, confirm, names, rename, notes, note, toast } = useStore()
  const [mode, setMode] = useState<'view' | 'edit' | 'note'>('view')
  const [val, setVal] = useState('')
  const title = names[it.id] ?? it.t
  const ok = confirmed[it.id]
  const save = () => {
    if (!val.trim()) return setMode('view')
    if (mode === 'edit') { rename(it.id, val.trim()); if (it.isl) rename(it.isl, val.trim()); toast('The chart is redrawn', 'Your correction is on the map.') }
    else note(it.id, val.trim())
    confirm(it.id); setMode('view')
  }
  return (
    <motion.li layout className={`entry${ok ? ' ok' : ''}`}>
      <span className="mono n">{pad(n)}</span>
      <div className="e-body">
        <b>{title}</b>
        <span className="d">{it.d}</span>
        {notes[it.id] && <em className="mine">“{notes[it.id]}”</em>}
        {mode === 'view' ? (
          <div className="e-acts">
            <button className="link" onClick={() => confirm(it.id, !ok)}>{ok ? 'Undo' : 'That’s right'}</button>
            <button className="link" onClick={() => { setVal(title); setMode('edit') }}>Not quite</button>
            <button className="link" onClick={() => { setVal(''); setMode('note') }}>Add context</button>
          </div>
        ) : (
          <div className="e-edit">
            <input autoFocus value={val} placeholder={mode === 'edit' ? 'What really happened?' : 'One line Athena missed…'} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { e.stopPropagation(); setMode('view') } }} />
            <button className="btn sm solid" onClick={save}>Save</button><button className="link" onClick={() => setMode('view')}>Cancel</button>
          </div>
        )}
      </div>
      <AnimatePresence>{ok && <motion.span className="entered mono" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
        <svg viewBox="0 0 16 16" width="12" height="12"><motion.path d="M2 8.5 L6.5 13 L14 3" fill="none" stroke="currentColor" strokeWidth="1.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .5, ease }} /></svg>Entered</motion.span>}</AnimatePresence>
    </motion.li>
  )
}

function Seal({ on }: { on: boolean }) {
  return (
    <motion.svg className="seal" viewBox="-60 -60 120 120" initial={{ opacity: 0, scale: 1.5, rotate: -40 }} animate={on ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0 }} transition={{ duration: .9, ease }} aria-hidden="true">
      <defs><path id="sealpath" d="M0 -41 A41 41 0 1 1 -0.1 -41" /></defs>
      <circle r="56" fill="var(--signal)" /><circle r="50" fill="none" stroke="var(--paper)" strokeWidth=".8" /><circle r="32" fill="none" stroke="var(--paper)" strokeWidth=".8" />
      <text className="seal-t"><textPath href="#sealpath">The Captain's Log · Week {NOW_WEEK} · Sealed · Private ·</textPath></text>
      <text y="10" textAnchor="middle" className="seal-c">W{NOW_WEEK}</text>
    </motion.svg>
  )
}

export function LogView() {
  const { confirmed, priv, set, setRoute, toast } = useStore()
  const [sealed, setSealed] = useState(false)
  const intro = useTypewriter('Here is your week, Ansh. I may have read the sea wrong, so correct me wherever I did. Only you decide what is true.', 22)
  const rows = [...LOG.reached, ...LOG.storm, ...(priv ? LOG.sinking : [])]
  const done = rows.filter((r) => confirmed[r.id]).length
  const g = GOALS[0]
  const sec = (k: number, title: string, sub: string, items: LogItem[], tone: string, start: number) => (
    <Reveal className={`log-sec ${tone}`}>
      <header><span className="mono">{roman(k)}.</span><h3>{title}</h3><span className="mono dim">{sub}</span></header>
      <ul>{items.map((i, j) => <LogRow key={i.id} it={i} n={start + j + 1} />)}</ul>
    </Reveal>
  )
  return (
    <div className="view paper log">
      <div className="log-wrap">
        <aside className="log-side">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><i />Weekly check-in · two minutes</motion.p>
          <h1><span className="mask"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: .2 }}>The Captain's</motion.span></span><span className="mask"><motion.span className="it" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: .3 }}>Log</motion.span></span></h1>
          <p className="athena"><span className="mono">Athena</span>{intro.text}<i className="caret" /></p>
          <div className="prog">
            <b>{pad(done)}<small>/{pad(rows.length)}</small></b>
            <div><span className="mono dim">Entries reviewed</span><i><motion.u initial={{ scaleX: 0 }} animate={{ scaleX: done / rows.length }} transition={{ duration: .8, ease }} /></i></div>
          </div>
          <div className="seal-row">
            <button className="btn solid lg" disabled={sealed} onClick={() => { setSealed(true); toast('Log sealed', 'Your corrections stay private until you choose to share them.'); setTimeout(() => setRoute('map'), 2200) }}>{sealed ? 'Sealed' : 'Sign & seal the log'} <span className="arr">→</span></button>
            <Seal on={sealed} />
          </div>
          <p className="mono dim fine">A draft, never a verdict. Nothing leaves this page until you seal it, and then only what you choose.</p>
        </aside>
        <main className="log-main">
          {sec(1, 'Islands reached', 'Work you completed', LOG.reached, 'good', 0)}
          {sec(2, 'Stormy waters', 'Needs attention', LOG.storm, 'storm', LOG.reached.length)}
          {priv ? sec(3, 'Slipping under', 'Forgotten promises · private to you', LOG.sinking, 'sink', LOG.reached.length + LOG.storm.length)
            : <Reveal className="log-sec"><header><span className="mono">III.</span><h3 className="faded">Slipping under</h3><span className="mono dim">Hidden in the manager lens</span></header><p className="lock">Forgotten promises are private to you. <button className="link" onClick={() => set({ priv: true })}>Switch to the private view</button></p></Reveal>}
          <Reveal className="log-sec horizon">
            <header><span className="mono">IV.</span><h3>The horizon</h3><span className="mono dim">Looking ahead</span></header>
            <div className="hz">
              <div><p className="mono dim">Ithaca · Q4</p><b>{g.t}</b><div className="hz-line"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: g.p }} viewport={{ once: true }} transition={{ duration: 1.4, ease }} /><span className="mono">{Math.round(g.p * 100)}%</span></div><p>{g.coach}</p></div>
              <div><p className="mono dim">The Sirens</p><b>Distractions, not failures.</b><p>{LOG.sirens}</p></div>
              <div><p className="mono dim">Gifts from the crew</p>{LOG.gifts.map((x) => <p key={x.from} className="gift">“{x.text}” <span className="mono dim">— {x.from}</span></p>)}</div>
            </div>
          </Reveal>
          <NextChapter id="trials" />
        </main>
      </div>
    </div>
  )
}

/* ===================================================== Three Trials: engraved plates */
function Cyclops() {
  const ref = useRef<SVGSVGElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 14 }), sy = useSpring(my, { stiffness: 60, damping: 14 })
  useEffect(() => {
    const f = (e: PointerEvent) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1; mx.set((dx / d) * Math.min(16, d / 18)); my.set((dy / d) * Math.min(9, d / 28)) }
    addEventListener('pointermove', f); return () => removeEventListener('pointermove', f)
  }, [mx, my])
  return (
    <svg ref={ref} viewBox="-120 -120 240 240" className="emblem">
      {Array.from({ length: 8 }, (_, k) => <g key={k} opacity={1 - k * .1}><path d={`M-110 0 Q0 ${-96 + k * 10} 110 0`} fill="none" stroke="var(--bone)" strokeWidth=".7" {...NS} /><path d={`M-110 0 Q0 ${96 - k * 10} 110 0`} fill="none" stroke="var(--bone)" strokeWidth=".7" {...NS} /></g>)}
      <motion.g style={{ x: sx, y: sy }}>
        <circle r="40" fill="var(--ink)" stroke="var(--bone)" strokeWidth=".9" {...NS} />
        <g className="iris">{Array.from({ length: 96 }, (_, i) => { const a = (i / 96) * Math.PI * 2, r1 = 16 + (i % 3) * 2.5; return <path key={i} d={`M${(Math.cos(a) * r1).toFixed(1)} ${(Math.sin(a) * r1).toFixed(1)} L${(Math.cos(a) * 39).toFixed(1)} ${(Math.sin(a) * 39).toFixed(1)}`} stroke="var(--bone)" strokeWidth=".5" opacity=".7" {...NS} /> })}</g>
        <circle r="14" fill="var(--signal)" /><circle r="3.5" cx="-5" cy="-5" fill="var(--bone)" />
      </motion.g>
    </svg>
  )
}
function Storm() {
  const g = useRef<SVGGElement>(null)
  useEffect(() => {
    let raf = 0
    const tick = (t: number) => {
      const paths = g.current?.children; if (!paths) return
      for (let i = 0; i < paths.length; i++) {
        const y0 = -100 + i * 8.4, amp = 4 + 22 * Math.exp(-((y0 + 6) ** 2) / 2600)
        let d = ''
        for (let x = -112; x <= 112; x += 7) { const y = y0 + Math.sin(x * .035 + i * .45 + t * .0011) * amp * Math.exp(-(x * x) / 9000) + Math.sin(x * .09 - t * .002 + i) * 1.4; d += (x === -112 ? 'M' : 'L') + x + ' ' + y.toFixed(1) }
        paths[i].setAttribute('d', d)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <svg viewBox="-120 -120 240 240" className="emblem">
      <g ref={g} fill="none" stroke="var(--bone)" strokeWidth=".7" opacity=".85">{Array.from({ length: 25 }, (_, i) => <path key={i} {...NS} />)}</g>
      <path className="bolt" d="M18 -96 L-6 -34 L12 -30 L-14 30 L4 34 L-20 96" fill="none" stroke="var(--signal)" strokeWidth="1.4" strokeLinejoin="bevel" {...NS} />
    </svg>
  )
}
function Scylla() {
  const arms = useMemo(() => Array.from({ length: 4 }, (_, a) => { let d = ''; for (let i = 0; i <= 140; i++) { const t = (i / 140) * 4.4 * Math.PI, r = 2.6 * Math.exp(.235 * t), ang = t + (a * Math.PI) / 2; d += (i ? 'L' : 'M') + (Math.cos(ang) * r).toFixed(1) + ' ' + (Math.sin(ang) * r * .7).toFixed(1) } return d }), [])
  const rock = useMemo(() => [1, .74, .5, .28].map((s, i) => blob('scylla' + i, 30 * s, .3, 14)), [])
  return (
    <svg viewBox="-120 -120 240 240" className="emblem">
      <g transform="translate(20,26)"><g className="whirl">{arms.map((d, i) => <path key={i} d={d} fill="none" stroke={i === 0 ? 'var(--signal)' : 'var(--bone)'} strokeWidth=".8" opacity={i === 0 ? 1 : .7} {...NS} />)}</g></g>
      <g transform="translate(-74,-62)">{rock.map((d, i) => <path key={i} d={d} fill={i === 0 ? 'var(--ink)' : 'none'} stroke="var(--bone)" strokeWidth=".7" opacity={1 - i * .15} {...NS} />)}</g>
      <text x="-74" y="-14" textAnchor="middle" className="micro">Scylla</text>
      <text x="20" y="104" textAnchor="middle" className="micro">Charybdis</text>
    </svg>
  )
}
const EMBLEM: Record<Trial['type'], () => JSX.Element> = { cyclops: Cyclops, storm: Storm, scylla: Scylla }
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
  const ty = useTypewriter(text, 16, !!epic)
  const sealedN = TRIALS.filter((t) => trials[t.id]?.confirmed).length
  return (
    <div className="view trials">
      <div className="t-wrap">
        <header className="t-head">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><i />Monthly check-in · five minutes · October</motion.p>
          <h1><span className="mask"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: .2 }}>The Three <em>Trials</em></motion.span></span></h1>
          <div className="t-sub">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: 1, ease }}>Athena found the three hardest things you faced this month. Confirm them, swap one for something harder, or tell the story behind it. Then she writes the chapter.</motion.p>
            <div className="t-count"><b>{pad(sealedN)}<small>/03</small></b><span className="mono dim">Trials sealed</span></div>
          </div>
        </header>
        <div className="plates">
          {TRIALS.map((t, i) => {
            const x = trials[t.id] ?? { confirmed: false }
            const E = EMBLEM[t.type]
            return (
              <motion.article key={t.id} className={`plate${x.confirmed ? ' sealed' : ''}`} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 + i * .14, duration: 1.1, ease }}>
                <div className="p-art"><E /><span className="p-rn">{roman(i + 1)}</span><span className="mono p-kind">{t.kind}</span>{x.confirmed && <span className="mono p-seal">Sealed</span>}</div>
                <h2>{t.name}</h2>
                <h4>{x.title ?? t.title}</h4>
                <p className="ai">{t.ai}</p>
                <div className="tstats">{t.stats.map(([nn, l]) => <div key={l}><b>{nn}</b><small className="mono">{l}</small></div>)}</div>
                {x.story && <p className="mine">“{x.story}”</p>}
                {swap === t.id && <div className="e-edit"><input autoFocus placeholder="Name a harder challenge…" value={tmp} onChange={(e) => setTmp(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && tmp.trim()) { trial(t.id, { title: tmp.trim(), confirmed: true }); setSwap(null) } }} /><button className="btn sm solid" onClick={() => { if (tmp.trim()) trial(t.id, { title: tmp.trim(), confirmed: true }); setSwap(null) }}>Swap</button></div>}
                {story === t.id && <div className="e-edit col"><textarea autoFocus rows={3} placeholder={FIELDS[t.type] + ' Who helped? What would you do differently?'} value={tmp} onChange={(e) => setTmp(e.target.value)} /><button className="btn sm solid" onClick={() => { if (tmp.trim()) trial(t.id, { story: tmp.trim(), confirmed: true }); setStory(null) }}>Add backstory</button></div>}
                {swap !== t.id && story !== t.id && <div className="p-acts">
                  <button className={`btn sm${x.confirmed ? '' : ' solid'}`} onClick={() => trial(t.id, { confirmed: !x.confirmed })}>{x.confirmed ? 'Unseal' : 'Confirm'}</button>
                  <button className="link" onClick={() => { setTmp(''); setSwap(t.id); setStory(null) }}>Swap it</button>
                  <button className="link" onClick={() => { setTmp(x.story ?? ''); setStory(t.id); setSwap(null) }}>Backstory</button></div>}
              </motion.article>
            )
          })}
        </div>

        <AnimatePresence>
          {all && !epic && (
            <motion.div className="epic-cta" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .8, ease }}>
              <p>All three sealed. Shall Athena <em>sing your month?</em></p>
              <button className="btn lg solid" onClick={() => setEpic(text)} data-cursor="Write">Write the chapter <span className="arr">→</span></button>
            </motion.div>
          )}
          {epic && (
            <motion.div className="epic" initial={{ opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.2, ease }}>
              <p className="eyebrow"><i />Chapter X · October</p>
              <h2>Three <em>Trials</em></h2>
              <p className="epic-text">{ty.text}<i className="caret" /></p>
              <div className="epic-foot">
                <label className="share"><input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} /><i className="box" />Share with my manager<span className="mono dim">{share ? 'Visible to them' : 'Private by default'}</span></label>
                <button className="btn solid" onClick={() => { setEpic(text); toast('Saved to the Chronicle', 'Chapter X is now in your Chapters.'); setRoute('chapters') }}>Save to the Chronicle <span className="arr">→</span></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <NextChapter id="deck" />
      </div>
    </div>
  )
}
