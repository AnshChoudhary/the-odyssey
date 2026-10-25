import { ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ALL_NAV, CHAPTERS, CREW, GIFTS, GOALS, PORTS, STUCK, SUGGESTIONS, TEAMS, ViewId } from '../data'
import { useStore } from '../store'
import { pad } from '../lib'
import { Field } from '../components/Field'

const ease = [.22, 1, .36, 1] as const

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease, delay }}>{children}</motion.div>
}

export function NextChapter({ id }: { id: ViewId }) {
  const i = ALL_NAV.findIndex((n) => n.id === id), n = ALL_NAV[i]
  return (
    <a className="next" href={'#/' + id} data-cursor="Sail on">
      <span className="mono dim">Next · {pad(i + 1)} · {n.sec}</span>
      <b>{n.label} <span className="arr">→</span></b>
      <span className="mono dim">{n.desc}</span>
      <span className="mono dim colophon">The Work Odyssey · Demo · crew and events illustrative · A draft, never a verdict</span>
    </a>
  )
}

function Page({ id, tone, title, lede, children, field }: { id: ViewId; tone: 'ink' | 'paper'; title: ReactNode; lede: string; children: ReactNode; field?: { speed?: number; alpha?: number } }) {
  const i = ALL_NAV.findIndex((n) => n.id === id), n = ALL_NAV[i]
  const order = ALL_NAV.map((x) => x.id), next = order[(i + 1) % order.length]
  return (
    <div className={`view page ${tone} p-${id}`}>
      {field && <div className="bgfield"><Field alpha={field.alpha ?? .07} speed={field.speed ?? .6} levels={12} mouse={false} /></div>}
      <div className="p-wrap">
        <header className="p-hero">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><i />{pad(i + 1)} · {n.sec}</motion.p>
          <h1><span className="mask"><motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: .2 }}>{title}</motion.span></span></h1>
          <motion.p className="lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: 1, ease }}>{lede}</motion.p>
        </header>
        {children}
        <NextChapter id={next} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Ithaca */
export function IthacaView() {
  return (
    <Page id="ithaca" tone="ink" field={{ alpha: .06, speed: .4 }} title={<>Ithaca</>} lede="Where you are heading. Direction and coaching, never grades. The distance is an estimate from merged work and open threads; correct it whenever it is wrong.">
      <div className="goals">
        {GOALS.map((g, i) => (
          <Reveal key={g.id} className="goal" delay={i * .05}>
            <span className="mono n">{pad(i + 1)}</span>
            <div className="g-main">
              <p className="mono dim">{g.grp}</p>
              <h2>{g.t}</h2>
              <div className="passage" aria-label={`${Math.round(g.p * 100)} percent of the way`}>
                {Array.from({ length: 11 }, (_, k) => <i key={k} style={{ left: `${k * 10}%` }} className={k % 5 === 0 ? 'maj' : ''} />)}
                <motion.u initial={{ scaleX: 0 }} whileInView={{ scaleX: g.p }} viewport={{ once: true }} transition={{ duration: 1.6, ease, delay: .2 }} />
                <motion.span className="pos" initial={{ left: '0%' }} whileInView={{ left: `${g.p * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease, delay: .2 }}><svg viewBox="-12 -6 24 12"><path d="M10 0 C6 -4 -3 -4 -9 -3 L-9 3 C-3 4 6 4 10 0Z" fill="currentColor" /></svg></motion.span>
                <span className="mono end">Ithaca</span>
              </div>
              <p className="coach"><span className="mono">Athena</span>{g.coach}</p>
            </div>
            <div className="pct"><b>{Math.round(g.p * 100)}</b><small className="mono">% of the way</small></div>
          </Reveal>
        ))}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------ Calypso */
export function CalypsoView() {
  const toast = useStore((s) => s.toast)
  const [gone, setGone] = useState<string[]>([]); const [open, setOpen] = useState<{ id: string; mode: 'sail' | 'crew' } | null>(null); const [step, setStep] = useState('')
  const sail = (id: string) => { if (!step.trim()) return; toast('Course set', step.trim()); setGone([...gone, id]); setOpen(null) }
  return (
    <Page id="calypso" tone="ink" field={{ alpha: .05, speed: .15 }} title={<>Calypso's <em>Island</em></>} lede="Nothing is wrong with you. Some voyages stall. Decide gently what each one deserves: a small next step, a hand from the crew, or permission to let it go.">
      <div className="calm-list">
        <AnimatePresence>{STUCK.filter((s) => !gone.includes(s.id)).map((s, i) => (
          <motion.article key={s.id} layout className="becalmed" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 80, transition: { duration: .7, ease } }} transition={{ duration: 1, ease, delay: .3 + i * .08 }}>
            <div className="days"><b>{s.days}</b><small className="mono">days becalmed</small></div>
            <div className="b-main">
              <h2>{s.t}</h2>
              <p className="mono dim">{s.last}</p>
              <p className="why">“{s.why}”</p>
              <svg className="flat" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 H400" /><path className="rip" d="M180 6 q10 -4 20 0 t20 0" /></svg>
              {open?.id === s.id && open.mode === 'sail' && <div className="e-edit"><input autoFocus placeholder="The smallest next step…" value={step} onChange={(e) => setStep(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sail(s.id)} /><button className="btn sm solid" onClick={() => sail(s.id)}>Set course</button></div>}
              {open?.id === s.id && open.mode === 'crew' && <div className="pick">{(['A', 'B', 'C'] as const).map((k) => <button key={k} className="btn sm" onClick={() => { toast('Signal raised', `${CREW[k].name} will lend a hand. In this prototype nothing was sent.`); setGone([...gone, s.id]); setOpen(null) }}>{CREW[k].name}</button>)}</div>}
              <div className="b-acts">
                <button className="btn sm solid" onClick={() => { setStep(''); setOpen({ id: s.id, mode: 'sail' }) }}>Set sail</button>
                <button className="link" onClick={() => setOpen({ id: s.id, mode: 'crew' })}>Ask the crew</button>
                <button className="link" onClick={() => { setGone([...gone, s.id]); toast('Let go', `${s.t} drifts away. That is a fine choice.`) }}>Let it go</button>
              </div>
            </div>
          </motion.article>))}</AnimatePresence>
        {gone.length === STUCK.length && <motion.p className="calm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>The island is quiet. Nothing left stranded.</motion.p>}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------ Chapters */
export function ChaptersView() {
  const { epic } = useStore(); const [open, setOpen] = useState<string | null>(null)
  const chap = CHAPTERS.map((c) => (c.id === 'c10' ? { ...c, text: epic } : c))
  const cur = chap.find((c) => c.id === open)
  return (
    <Page id="chapters" tone="paper" title={<>Chapters of the <em>Epic</em></>} lede="Each month, told as prose. Edit it, annotate it, and share only what you choose. Unwritten chapters wait for their Three Trials.">
      <div className="volumes">{chap.map((c, i) => (
        <Reveal key={c.id} delay={i * .08}>
          <button className={`volume${c.text ? '' : ' blank'}`} onClick={() => setOpen(c.id)} data-cursor={c.text ? 'Read' : 'Unwritten'}>
            <span className="mono dim">{c.month} · Chapter</span>
            <span className="rn">{c.n}</span>
            <h2>{c.title}</h2>
            <p>{c.text ? c.text.slice(0, 120) + '…' : 'Not yet written. Seal your Three Trials and Athena will write it.'}</p>
            <span className="mono read">{c.text ? 'Read the chapter →' : 'Awaiting the trials'}</span>
          </button>
        </Reveal>))}</div>
      <AnimatePresence>{cur && (
        <motion.div className="reader" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .9, ease: [.76, 0, .24, 1] }}>
          <div className="r-in">
            <div className="r-top"><span className="mono dim">Chapter {cur.n} · {cur.month}</span><button className="link" onClick={() => setOpen(null)}>Close</button></div>
            <h2>{cur.title}</h2>
            {cur.text ? <p className="r-text" contentEditable suppressContentEditableWarning>{cur.text}</p> : <p className="r-text empty">This chapter waits for your Three Trials.</p>}
            <p className="mono dim">Click the text to edit it. Private unless you share it.</p>
          </div>
        </motion.div>)}</AnimatePresence>
    </Page>
  )
}

/* ------------------------------------------------------------ Gifts */
export function GiftsView() {
  const [open, setOpen] = useState<string | null>(GIFTS[0].id)
  return (
    <Page id="gifts" tone="ink" field={{ alpha: .05, speed: .3 }} title={<>Gifts from the <em>Gods</em></>} lede="Every thank-you you have been sent, kept in one place. Open one on a hard day.">
      <ol className="letters">{GIFTS.map((g, i) => { const o = open === g.id; return (
        <Reveal key={g.id} delay={i * .05}>
          <li className={`letter${o ? ' open' : ''}`}>
            <button onClick={() => setOpen(o ? null : g.id)} aria-expanded={o} data-cursor={o ? 'Fold' : 'Unfold'}>
              <span className="mono n">No. {pad(i + 1)}</span><b>{g.from}</b><span className="mono dim">for {g.why}</span><span className="mono dim">{g.src} · {g.when}</span><span className="plus" aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>{o && <motion.div className="l-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .7, ease }}>
              <p>“{g.text}”</p>
            </motion.div>}</AnimatePresence>
          </li>
        </Reveal>) })}</ol>
    </Page>
  )
}

/* ------------------------------------------------------------ Armada */
export function ArmadaView() {
  return (
    <Page id="armada" tone="ink" field={{ alpha: .05, speed: .5 }} title={<>The <em>Armada</em></>} lede="Each team as a fleet, for managers. Outcomes only: no message content, no rankings. Look for ships sailing alone and crews riding low under heavy cargo.">
      <div className="fleets">
        <div className="f-key mono dim"><span><i className="k-line" />Sails together</span><span><i className="k-alone" />Sailing alone</span><span><i className="k-deep" />Riding low · heavy load</span></div>
        {TEAMS.map((t, ti) => (
          <Reveal key={t.name} className="fleet" delay={ti * .05}>
            <header><span className="mono n">{pad(ti + 1)}</span><h2>{t.name}</h2><p>{t.note}</p></header>
            <svg viewBox="0 0 1000 170" className="waterline" preserveAspectRatio="xMidYMid meet">
              <path d="M0 80 H1000" stroke="var(--bone)" strokeWidth=".8" vectorEffect="non-scaling-stroke" opacity=".5" />
              {t.ships.map((s, i) => { const x = 90 + i * (820 / Math.max(1, t.ships.length - 1)); const nx = 90 + (i + 1) * (820 / Math.max(1, t.ships.length - 1))
                return <g key={s.n}>
                  {!s.alone && i < t.ships.length - 1 && !t.ships[i + 1].alone && <path d={`M${x} 64 Q${(x + nx) / 2} 28 ${nx} 64`} fill="none" stroke="var(--bone)" strokeWidth=".7" strokeDasharray="2 4" opacity=".5" vectorEffect="non-scaling-stroke" />}
                  <g transform={`translate(${x},80)`} className={`fs${s.alone ? ' alone' : ''}${s.load >= .95 ? ' heavy' : ''}`} tabIndex={0}>
                    <path d="M-26 -6 L26 -6 L18 6 Q0 10 -18 6Z" fill="var(--ink)" stroke="var(--bone)" strokeWidth=".9" vectorEffect="non-scaling-stroke" transform={`translate(0,${(s.load - .5) * 10})`} />
                    <path d={`M0 -6 V-${30 - s.load * 6}`} stroke="var(--bone)" strokeWidth=".9" vectorEffect="non-scaling-stroke" />
                    <motion.path d={`M0 12 V${12 + s.load * 50}`} stroke={s.load >= .95 ? 'var(--signal)' : 'var(--bone)'} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".7" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: .3 + i * .08, ease }} />
                    {s.alone && <circle r="42" cy="-6" fill="none" stroke="var(--bone)" strokeWidth=".7" strokeDasharray="1 4" opacity=".7" vectorEffect="non-scaling-stroke" />}
                    <text y="-46" textAnchor="middle" className="fs-n">{s.n}</text>
                    <text y={80 + s.load * 0} textAnchor="middle" className="micro" dy="0">{s.out} outcomes · {Math.round(s.load * 100)}% load</text>
                  </g>
                </g> })}
            </svg>
          </Reveal>
        ))}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------ Recruit */
export function RecruitView() {
  const toast = useStore((s) => s.toast); const [sent, setSent] = useState<string[]>([])
  return (
    <Page id="recruit" tone="paper" title={<>Recruit a <em>crew member</em></>} lede="People whose work touches yours, but whom you rarely work with. A short hello goes a long way.">
      <div className="recruits">{SUGGESTIONS.map((s, i) => (
        <Reveal key={s.n} className="recruit" delay={i * .06}>
          <svg className="venn" viewBox="-60 -34 120 68" aria-hidden="true"><circle cx="-16" r="28" /><circle cx="16" r="28" /><text y="6" textAnchor="middle">{s.overlap}</text></svg>
          <div className="r-main"><p className="mono dim">{s.team} · {s.area}</p><h2>{s.n}</h2><p>{s.why}</p></div>
          <div className="r-side"><span className="mono dim">{s.overlap} shared islands</span>
            <button className="btn" disabled={sent.includes(s.n)} onClick={() => { setSent([...sent, s.n]); toast('Hail sent', `A hello to ${s.n}. In this prototype nothing was sent.`) }}>{sent.includes(s.n) ? 'Hail sent' : 'Send a hail'} <span className="arr">→</span></button></div>
        </Reveal>))}</div>
    </Page>
  )
}

/* ------------------------------------------------------------ Ports */
export function PortsView() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Page id="ports" tone="ink" field={{ alpha: .05, speed: .5 }} title={<>Ports of <em>Call</em></>} lede="Harbours where several ships dock: the cross-team projects your work flows into. Open one to see who is moored there and what they share.">
      <div className="ports">{PORTS.map((p, i) => { const o = open === p.id; return (
        <Reveal key={p.id} delay={i * .06}>
          <article className={`port${o ? ' open' : ''}`}>
            <button onClick={() => setOpen(o ? null : p.id)} aria-expanded={o} data-cursor={o ? 'Close' : 'Dock'}>
              <span className="mono n">{pad(i + 1)}</span>
              <div className="pt-main"><h2>{p.name}</h2><p className="mono dim">{p.status}</p></div>
              <div className="berths" aria-label={`${p.docked} teams docked`}>{Array.from({ length: 5 }, (_, k) => <i key={k} className={k < p.docked ? 'on' : ''} />)}<small className="mono dim">{p.docked} docked</small></div>
              <div className="pt-prog"><b>{Math.round(p.p * 100)}</b><small className="mono dim">%</small></div>
              <span className="plus" aria-hidden="true" />
            </button>
            <div className="pt-line"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: p.p }} viewport={{ once: true }} transition={{ duration: 1.4, ease, delay: .2 }} /></div>
            <AnimatePresence initial={false}>{o && <motion.div className="pt-more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .6, ease }}>
              <div><p className="mono dim">Teams docked</p><div className="tags">{p.teams.map((t) => <span key={t} className="tag">{t}</span>)}</div></div>
              <div><p className="mono dim">Shared islands</p><ul>{p.shared.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </motion.div>}</AnimatePresence>
          </article>
        </Reveal>) })}</div>
    </Page>
  )
}
