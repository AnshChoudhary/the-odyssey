import { ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CHAPTERS, CREW, GIFTS, GOALS, PORTS, STUCK, SUGGESTIONS, TEAMS } from '../data'
import { useStore } from '../store'
import { roman } from '../lib'

const rise = (i: number) => ({ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { delay: .12 + i * .08, type: 'spring' as const, stiffness: 140, damping: 20 } })

function Page({ theme, eyebrow, title, sub, children }: { theme: string; eyebrow: string; title: string; sub: string; children: ReactNode }) {
  return (
    <div className={`view ${theme}`}><div className="page"><div className="page-inner">
      <motion.header className="page-head" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
        <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{sub}</p>
      </motion.header>{children}
    </div></div></div>
  )
}

/* ------------------------------------------------------------ Ithaca */
export function IthacaView() {
  const groups = [...new Set(GOALS.map((g) => g.grp))]
  return (
    <Page theme="theme-night ithaca" eyebrow="North star" title="Ithaca" sub="Where you are heading. Direction and coaching, never grades.">
      <div className="star-wrap" aria-hidden="true"><svg viewBox="-100 -100 200 200"><g className="star-spin"><path d="M0 -90 L12 -12 L90 0 L12 12 L0 90 L-12 12 L-90 0 L-12 -12Z" fill="#f4d588" /><path d="M-52 -52 L-8 -8 M52 -52 L8 -8 M-52 52 L-8 8 M52 52 L8 8" stroke="#f4d588" strokeWidth="3" opacity=".6" /></g><circle r="110" fill="none" stroke="#f4d588" strokeWidth="1" strokeDasharray="2 8" opacity=".5" /></svg></div>
      {groups.map((grp, gi) => (
        <section key={grp} className="goal-group"><h3 className="eyebrow">{grp}</h3>
          <div className="goal-grid">{GOALS.filter((g) => g.grp === grp).map((g, i) => (
            <motion.article key={g.id} className="goal glass" {...rise(gi * 2 + i)} whileHover={{ y: -4 }}>
              <Ring p={g.p} /><div><h2>{g.t}</h2>
                <div className="route-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${g.p * 100}%` }} transition={{ delay: .6 + i * .1, duration: 1.4, ease: [.22, 1, .36, 1] }} /><span style={{ left: `${g.p * 100}%` }}>⛵</span><em>⭐</em></div>
                <p className="coach"><span>🦉</span>{g.coach}</p></div>
            </motion.article>))}</div>
        </section>))}
    </Page>
  )
}
function Ring({ p }: { p: number }) {
  const R = 34, C = 2 * Math.PI * R
  return <svg className="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="6" /><motion.circle cx="40" cy="40" r={R} fill="none" stroke="#f4d588" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - p) }} transition={{ duration: 1.6, ease: [.22, 1, .36, 1], delay: .4 }} transform="rotate(-90 40 40)" /><text x="40" y="46" textAnchor="middle" fill="#fbf3dc" fontFamily="Cormorant Garamond" fontSize="20">{Math.round(p * 100)}%</text></svg>
}

/* ------------------------------------------------------------ Calypso */
export function CalypsoView() {
  const toast = useStore((s) => s.toast)
  const [gone, setGone] = useState<string[]>([]); const [open, setOpen] = useState<{ id: string; mode: 'sail' | 'crew' } | null>(null); const [step, setStep] = useState('')
  return (
    <Page theme="theme-dusk calypso" eyebrow="Projects stuck too long" title="Calypso's Island" sub="Nothing is wrong with you. Some voyages stall. Decide gently what each one deserves.">
      <div className="palm" aria-hidden="true">🌴</div>
      <div className="stuck-grid"><AnimatePresence>{STUCK.filter((s) => !gone.includes(s.id)).map((s, i) => (
        <motion.article key={s.id} layout className="stuck glass" {...rise(i)} exit={{ opacity: 0, y: 160, rotate: 18, scale: .8, transition: { duration: .9 } }}>
          <div className="sand" aria-hidden="true"><i style={{ height: `${Math.min(100, s.days * 1.6)}%` }} /></div>
          <div className="stuck-b"><h2>{s.t}</h2><p className="mut">Marooned {s.days} days · {s.last}</p><p className="why-s">“{s.why}”</p>
            {open?.id === s.id && open.mode === 'sail' && <div className="log-edit"><input autoFocus className="dark" placeholder="Smallest next step…" value={step} onChange={(e) => setStep(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && step && (toast('Course set', step, '⛵'), setGone([...gone, s.id]), setOpen(null))} /><button className="btn primary sm" onClick={() => { if (step) { toast('Course set', step, '⛵'); setGone([...gone, s.id]); setOpen(null) } }}>Go</button></div>}
            {open?.id === s.id && open.mode === 'crew' && <div className="pick">{(['A', 'B', 'C'] as const).map((k) => <button key={k} className="btn sm" onClick={() => { toast('Signal sent', `${CREW[k].name} will lend a hand. Nothing was actually sent.`, '🤝'); setGone([...gone, s.id]); setOpen(null) }}>{CREW[k].name}</button>)}</div>}
            <div className="log-actions"><button className="btn primary sm" onClick={() => { setStep(''); setOpen({ id: s.id, mode: 'sail' }) }}>⛵ Set sail</button><button className="btn sm" onClick={() => setOpen({ id: s.id, mode: 'crew' })}>🤝 Ask crew for help</button><button className="btn sm" onClick={() => { setGone([...gone, s.id]); toast('Let go', s.t + ' drifts away. That is a fine choice.', '🌊') }}>🌊 Let it go</button></div></div>
        </motion.article>))}</AnimatePresence></div>
      {gone.length === STUCK.length && <motion.p className="calm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>The island is quiet. Nothing left stranded.</motion.p>}
    </Page>
  )
}

/* ------------------------------------------------------------ Chapters */
export function ChaptersView() {
  const { epic } = useStore(); const [open, setOpen] = useState<string | null>(null)
  const chap = CHAPTERS.map((c) => (c.id === 'c10' ? { ...c, text: epic } : c))
  const cur = chap.find((c) => c.id === open)
  return (
    <Page theme="theme-parch chapters" eyebrow="Chronicle" title="Chapters of the Epic" sub="Each month, told as mock-epic prose. Edit it, annotate it, share only what you choose.">
      <div className="chap-row">{chap.map((c, i) => (
        <motion.button key={c.id} className="chap" {...rise(i)} whileHover={{ y: -10, rotate: i % 2 ? 1 : -1 }} onClick={() => setOpen(c.id)} data-cursor="Read">
          <span className="rn">{c.n}</span><small>{c.month}</small><h2>{c.title}</h2><p>{c.text ? c.text.slice(0, 110) + '…' : 'Not yet written. Finish your Three Trials to render this chapter.'}</p>
        </motion.button>))}</div>
      <AnimatePresence>{cur && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
          <motion.div className="epic-book reader" onClick={(e) => e.stopPropagation()} initial={{ y: 60, rotateX: 18, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
            <p className="eyebrow">Chapter {cur.n} · {cur.month}</p><h2>{cur.title}</h2>
            {cur.text ? <p className="epic-text" contentEditable suppressContentEditableWarning>{cur.text}</p> : <p className="epic-text">This chapter waits for your Three Trials.</p>}
            <div className="log-actions"><small style={{ marginRight: 'auto', opacity: .6 }}>Click the text to edit it. Private unless you share.</small><button className="btn ink primary" onClick={() => setOpen(null)}>Close book</button></div>
          </motion.div></motion.div>)}</AnimatePresence>
    </Page>
  )
}

/* ------------------------------------------------------------ Gifts */
export function GiftsView() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Page theme="theme-night gifts" eyebrow="Kudos & recognition" title="Gifts from the Gods" sub="Every thank-you you have been sent, kept safe in chests. Open one when you need it.">
      <div className="chest-grid">{GIFTS.map((g, i) => { const o = open === g.id; return (
        <motion.div key={g.id} className={`chest-wrap${o ? ' open' : ''}`} {...rise(i)}>
          <button className="chest" onClick={() => setOpen(o ? null : g.id)} aria-expanded={o} data-cursor={o ? 'Close' : 'Open'}>
            <svg viewBox="0 0 160 130"><ellipse cx="80" cy="120" rx="62" ry="8" fill="#000" opacity=".3" />
              <g className="glowbox"><rect x="24" y="60" width="112" height="56" rx="6" fill="#8a5a2c" stroke="#2a1a0c" strokeWidth="3" /><path d="M24 80 H136" stroke="#2a1a0c" strokeWidth="3" /><rect x="70" y="72" width="20" height="22" rx="4" fill="#d3a444" stroke="#2a1a0c" strokeWidth="2.5" /></g>
              <g className="lid"><path d="M24 60 Q24 22 80 22 Q136 22 136 60Z" fill="#a06b36" stroke="#2a1a0c" strokeWidth="3" /><path d="M24 48 H136" stroke="#2a1a0c" strokeWidth="2" opacity=".6" /></g>
              <g className="rays"><path d="M80 56 L40 -6 M80 56 L80 -14 M80 56 L120 -6" stroke="#ffe08a" strokeWidth="4" strokeLinecap="round" /></g></svg>
            <span className="from">{g.from}</span><small>{g.when} · {g.src}</small>
          </button>
          <AnimatePresence>{o && <motion.div className="gift-msg" initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><p>“{g.text}”</p><small><span className={`chip ${g.src}`}>{g.src}</span> {g.from} · for <b>{g.why}</b> · {g.when}</small></motion.div>}</AnimatePresence>
        </motion.div>) })}</div>
    </Page>
  )
}

/* ------------------------------------------------------------ Armada */
export function ArmadaView() {
  return (
    <Page theme="theme-night armada" eyebrow="Manager view" title="The Armada" sub="Each team as a fleet. Outcomes only: no message content, no rankings. Look for ships sailing alone and crews carrying heavy loads.">
      {TEAMS.map((t, ti) => (
        <motion.section key={t.name} className="fleet" {...rise(ti)}>
          <header><h2>{t.name}</h2><p>{t.note}</p></header>
          <div className="fleet-sea">{t.ships.map((s, i) => (
            <div key={s.n} className={`fship${s.alone ? ' alone' : ''}${s.load >= .95 ? ' heavy' : ''}`} style={{ animationDelay: `${-i * 0.8}s` }} tabIndex={0}>
              <svg viewBox="0 0 90 90"><g style={{ transform: `translateY(${(s.load - .5) * 14}px)` }}><path d="M8 54 L82 54 L72 70 Q45 76 18 70Z" fill="#8a5a2c" stroke="#2a1a0c" strokeWidth="2" /><path d="M45 54 V12" stroke="#2a1a0c" strokeWidth="2" /><path d="M47 14 Q74 28 68 50 H47Z" fill="#f4e8c8" stroke="#2a1a0c" strokeWidth="1.6" /><path d="M43 20 Q26 32 30 50 H43Z" fill="#e6d4a6" stroke="#2a1a0c" strokeWidth="1.6" />
                {s.load >= .95 && <g fill="#c79a5a" stroke="#2a1a0c"><rect x="14" y="46" width="12" height="8" /><rect x="58" y="46" width="12" height="8" /></g>}</g></svg>
              {s.alone && <i className="lone" aria-label="Sailing alone" />}
              <b>{s.n}</b><small>{s.out} outcomes</small>
              <div className="tip">{s.alone ? 'Sailing alone: few shared islands.' : s.load >= .95 ? 'Heavy cargo: carrying more than usual.' : 'Steady sailing.'}</div>
            </div>))}</div>
        </motion.section>))}
    </Page>
  )
}

/* ------------------------------------------------------------ Recruit */
export function RecruitView() {
  const toast = useStore((s) => s.toast); const [sent, setSent] = useState<string[]>([])
  return (
    <Page theme="theme-parch recruit" eyebrow="Overlapping islands" title="Recruit a Crew Member" sub="People whose work touches yours, but whom you rarely work with. A friendly ahoy goes a long way.">
      <div className="sug-grid">{SUGGESTIONS.map((s, i) => (
        <motion.article key={s.n} className="sug" {...rise(i)} whileHover={{ y: -6 }}>
          <div className="venn" aria-hidden="true"><i /><i /><b>{s.overlap}</b></div>
          <h2>{s.n}</h2><p className="mut">{s.team} · {s.area}</p><p>{s.why}</p>
          <button className="btn ink primary" disabled={sent.includes(s.n)} onClick={() => { setSent([...sent, s.n]); toast('Ahoy sent', `A signal flare for ${s.n}. (Prototype: nothing was actually sent.)`, '✉️') }}>{sent.includes(s.n) ? '✓ Ahoy sent' : 'Say ahoy'}</button>
        </motion.article>))}</div>
    </Page>
  )
}

/* ------------------------------------------------------------ Ports */
export function PortsView() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Page theme="theme-night ports" eyebrow="Cross-team projects" title="Ports of Call" sub="Harbors where several ships dock. Click one to see who is moored there and what they share.">
      <div className="port-grid">{PORTS.map((p, i) => (
        <motion.article key={p.id} className={`port glass${open === p.id ? ' open' : ''}`} {...rise(i)} layout>
          <button onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id} data-cursor="Dock">
            <div className="harbor" aria-hidden="true">{Array.from({ length: p.docked }, (_, k) => <svg key={k} viewBox="0 0 60 60" style={{ animationDelay: `${-k * 0.9}s` }}><path d="M6 38 L54 38 L48 48 Q30 52 12 48Z" fill="#8a5a2c" stroke="#2a1a0c" strokeWidth="1.5" /><path d="M30 38 V8 M32 10 Q50 20 46 36 H32Z" fill="#f4e8c8" stroke="#2a1a0c" strokeWidth="1.4" /></svg>)}<u /></div>
            <h2>{p.name}</h2><p className="mut">{p.status} · {p.docked} teams docked</p>
            <div className="route-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${p.p * 100}%` }} transition={{ duration: 1.3, delay: .4 + i * .1 }} /></div>
          </button>
          <AnimatePresence>{open === p.id && <motion.div className="port-more" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <h4>Teams docked</h4><div className="tags">{p.teams.map((t) => <span key={t} className="chip kind">{t}</span>)}</div>
            <h4>Shared islands</h4><ul>{p.shared.map((s) => <li key={s}>{s}</li>)}</ul></motion.div>}</AnimatePresence>
        </motion.article>))}</div>
    </Page>
  )
}
export { roman }
