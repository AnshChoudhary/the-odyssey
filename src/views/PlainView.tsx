import { useState } from 'react'
import { CREW, GIFTS, GOALS, LOG, NOW_WEEK, PERSON, PLAIN_SUMMARY, SHIPPED, SHIPPED_COUNT, STUCK, SUGGESTIONS, TEAMS, TRIALS, WEEKS } from '../data'
import { LiveIsland, liveIslands, shippedCount, useStore } from '../store'
import { cx } from '../lib'

/* The same data and the same actions as the Odyssey, as a conventional dashboard for people who prefer one. */
type Tab = 'overview' | 'checkin' | 'goals' | 'people' | 'team'
const TABS: [Tab, string][] = [['overview', 'Overview'], ['checkin', 'Check-in'], ['goals', 'Goals'], ['people', 'People'], ['team', 'Team']]
const BOND = ['', 'Occasional', 'Occasional', 'Regular', 'Frequent', 'Closest']

const status = (i: LiveIsland, rescued: boolean) =>
  rescued ? ['Back on track', 'ok']
    : i.state === 'overdue' ? ['Overdue', 'bad']
    : i.state === 'sinking' ? ['No activity', 'warn']
    : i.flare ? ['Review requested', 'bad']
    : ['On track', 'ok']

function Section({ title, note, children, id }: { title: string; note?: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="pl-card" id={id}>
      <header><h2>{title}</h2>{note && <p>{note}</p>}</header>
      {children}
    </section>
  )
}

function Overview() {
  const st = useStore()
  const { week, priv, status: stat, names, extraShipped, setStatus, toast } = st
  const all = liveIslands(week, stat, names)
  const open = all.filter((i) => i.state !== 'sinking')
  const attention = open.filter((i) => i.state === 'overdue' || i.flare)
  const stalled = all.filter((i) => i.state === 'sinking')
  const shipped = shippedCount(week, extraShipped.length)
  const act = (i: LiveIsland, a: 'done' | 'rescued' | 'dismissed') => {
    if (a === 'done') st.set({ extraShipped: [...extraShipped, i.label] })
    setStatus(i.id, a)
    toast(a === 'done' ? 'Marked as shipped' : a === 'rescued' ? 'Moved back to open work' : 'Removed from your list', i.label)
  }
  const row = (i: LiveIsland) => {
    const [s, tone] = status(i, stat[i.id] === 'rescued')
    return (
      <li key={i.id} className="pl-row">
        <div className="pl-main"><b>{i.label}</b><small>{i.who ? `Shared with ${i.who} · ` : ''}{i.link}</small></div>
        <span className={cx('pl-pill', tone)}>{s}</span>
        <span className="pl-age">{i.age}d</span>
        <div className="pl-acts">
          {i.state === 'sinking'
            ? <><button onClick={() => act(i, 'rescued')}>Pick up</button><button onClick={() => act(i, 'dismissed')}>Drop</button></>
            : <><button onClick={() => act(i, 'done')}>Mark done</button><button onClick={() => act(i, 'dismissed')}>Drop</button></>}
        </div>
      </li>
    )
  }
  const done = [...SHIPPED.filter((s) => s.w === week), ...(week === NOW_WEEK ? extraShipped.map((t) => ({ w: week, t: 'Shipped: ' + t, d: 'Marked done this week.' })) : [])]
  return (
    <>
      <div className="pl-kpis">
        <div><small>Shipped this week</small><b>{shipped}</b><span>{week > 40 ? `${shipped - SHIPPED_COUNT[week - 1] >= 0 ? '+' : ''}${shipped - SHIPPED_COUNT[week - 1]} vs last week` : 'First tracked week'}</span></div>
        <div><small>Open commitments</small><b>{open.length}</b><span>{open.filter((i) => i.who).length} shared with others</span></div>
        <div className={attention.length ? 'hot' : ''}><small>Needs attention</small><b>{attention.length}</b><span>Overdue or waiting on you</span></div>
        <div><small>No recent activity</small><b>{priv ? stalled.length : '—'}</b><span>{priv ? 'Only you can see this' : 'Hidden in the manager view'}</span></div>
      </div>

      <Section title="Week summary" note="Drafted by AI from Slack, Zoom and GitHub. Correct it in Check-in.">
        <p className="pl-summary">{PLAIN_SUMMARY[week]}</p>
      </Section>

      <div className="pl-grid">
        <Section title="Open work" note={`${open.length} items, most urgent first`}>
          <ul className="pl-list">{[...attention, ...open.filter((i) => !attention.includes(i))].map(row)}</ul>
        </Section>
        <Section title="Shipped" note={WEEKS[week]}>
          <ul className="pl-list simple">{done.map((s) => <li key={s.t}><b>{s.t}</b><small>{s.d}</small></li>)}</ul>
          <div className="pl-weeks">{[40, 41, 42, 43].map((w) => <span key={w} className={w === week ? 'on' : ''}>W{w}<b>{shippedCount(w, w === NOW_WEEK ? extraShipped.length : 0)}</b></span>)}</div>
        </Section>
      </div>

      {priv
        ? <Section title="Possibly forgotten" note="Commitments with no activity for two weeks or more. Only you can see this list.">
            {stalled.length ? <ul className="pl-list">{stalled.map(row)}</ul> : <p className="pl-empty">Nothing here. Every commitment has recent activity.</p>}
          </Section>
        : <Section title="Possibly forgotten" note="Private to the employee. The manager view shows outcomes only."><p className="pl-empty">Hidden in the manager view.</p></Section>}
    </>
  )
}

function CheckIn() {
  const { confirmed, confirm, rename, names, priv, trials, trial, toast } = useStore()
  const [edit, setEdit] = useState<string | null>(null)
  const [val, setVal] = useState('')
  const groups: [string, typeof LOG.reached][] = [['Completed', LOG.reached], ['Needs attention', LOG.storm], ...(priv ? [['No recent activity (private)', LOG.sinking] as [string, typeof LOG.reached]] : [])]
  const rows = groups.flatMap((g) => g[1])
  const n = rows.filter((r) => confirmed[r.id]).length
  return (
    <>
      <Section title="Weekly check-in" note={`${WEEKS[NOW_WEEK]} · about two minutes · ${n} of ${rows.length} confirmed`}>
        <div className="pl-bar"><i style={{ width: `${(n / rows.length) * 100}%` }} /></div>
        {groups.map(([g, items]) => (
          <div key={g} className="pl-group">
            <h3>{g}</h3>
            <ul className="pl-list">
              {items.map((it) => (
                <li key={it.id} className="pl-row">
                  <div className="pl-main">
                    {edit === it.id
                      ? <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} aria-label="Correct this entry"
                          onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { rename(it.id, val.trim()); if (it.isl) rename(it.isl, val.trim()); confirm(it.id); setEdit(null); toast('Correction saved', 'Both views now show your wording.') } }} />
                      : <b>{names[it.id] ?? it.t}</b>}
                    <small>{it.d}</small>
                  </div>
                  <span className={cx('pl-pill', confirmed[it.id] ? 'ok' : 'idle')}>{confirmed[it.id] ? 'Confirmed' : 'Draft'}</span>
                  <div className="pl-acts">
                    <button onClick={() => confirm(it.id, !confirmed[it.id])}>{confirmed[it.id] ? 'Undo' : 'Confirm'}</button>
                    <button onClick={() => { setEdit(edit === it.id ? null : it.id); setVal(names[it.id] ?? it.t) }}>{edit === it.id ? 'Cancel' : 'Correct'}</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="pl-fine">{LOG.sirens}</p>
      </Section>
      <Section title="Monthly highlights" note="October · the three hardest problems, drafted by AI">
        <ul className="pl-list">
          {TRIALS.map((t) => (
            <li key={t.id} className="pl-row">
              <div className="pl-main"><b>{t.title}</b><small>{t.ai}</small></div>
              <span className="pl-pill idle">{t.kind}</span>
              <div className="pl-acts"><button onClick={() => trial(t.id, { confirmed: !trials[t.id]?.confirmed })}>{trials[t.id]?.confirmed ? 'Confirmed' : 'Confirm'}</button></div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

function Goals() {
  return (
    <>
      <Section title="Goals" note="Q4 · progress is self-reported and AI-assisted, not a score">
        <ul className="pl-list simple">
          {GOALS.map((g) => (
            <li key={g.id} className="pl-goal">
              <div className="pl-goal-h"><b>{g.t}</b><span>{Math.round(g.p * 100)}%</span></div>
              <div className="pl-bar"><i style={{ width: `${g.p * 100}%` }} /></div>
              <small><em>{g.grp}.</em> {g.coach}</small>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Stalled work" note="Started, then stopped">
        <ul className="pl-list">
          {STUCK.map((s) => <li key={s.id} className="pl-row"><div className="pl-main"><b>{s.t}</b><small>{s.last} · {s.why}</small></div><span className="pl-age">{s.days}d</span></li>)}
        </ul>
      </Section>
    </>
  )
}

function People() {
  return (
    <>
      <Section title="Collaborators" note="From shared threads, calls and pull requests this quarter">
        <ul className="pl-list">
          {Object.values(CREW).sort((a, b) => b.bond - a.bond).map((c) => (
            <li key={c.name} className="pl-row">
              <div className="pl-main"><b>{c.name}</b><small>{c.title} · last: {c.it[0][1]}, {c.it[0][2]}</small></div>
              <span className="pl-pill idle">{BOND[c.bond]}</span>
              <span className="pl-age">{c.it.length} recent</span>
            </li>
          ))}
        </ul>
      </Section>
      <div className="pl-grid even">
        <Section title="Recognition" note={`${GIFTS.length} thank-yous`}>
          <ul className="pl-list simple">{GIFTS.map((g) => <li key={g.id}><b>{g.from} <span>· {g.src}, {g.when}</span></b><small>“{g.text}”</small></li>)}</ul>
        </Section>
        <Section title="Suggested connections" note="Overlapping work, little contact">
          <ul className="pl-list simple">{SUGGESTIONS.map((s) => <li key={s.n}><b>{s.n} <span>· {s.team}</span></b><small>{s.why}</small></li>)}</ul>
        </Section>
      </div>
    </>
  )
}

function Team() {
  return (
    <Section title="Team overview" note="For managers · outcomes and load only, never private items">
      {TEAMS.map((t) => (
        <div key={t.name} className="pl-group">
          <h3>{t.name}</h3>
          <div className="pl-table" role="table">
            <div className="pl-tr head" role="row"><span role="columnheader">Person</span><span role="columnheader">Shipped (4 wk)</span><span role="columnheader">Load</span><span role="columnheader">Collaboration</span></div>
            {t.ships.map((s) => (
              <div key={s.n} className="pl-tr" role="row">
                <span role="cell">{s.n}</span>
                <span role="cell">{s.out}</span>
                <span role="cell"><span className={cx('pl-load', s.load >= 0.95 && 'high')}><i style={{ width: `${s.load * 100}%` }} /></span>{Math.round(s.load * 100)}%</span>
                <span role="cell">{s.alone ? <span className="pl-pill warn">Working alone</span> : <span className="pl-pill ok">With others</span>}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

export default function PlainView() {
  const { week, setWeek, priv, setPriv, setPlain } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  return (
    <div className="plain">
      <header className="pl-top">
        <div className="pl-who">
          <b>{PERSON.name}</b>
          <span>{PERSON.role} · {PERSON.team} · {PERSON.city}</span>
        </div>
        <div className="pl-ctrls">
          {tab === 'overview' && (
            <div className="pl-week" role="group" aria-label="Week">
              <button onClick={() => setWeek(week - 1)} disabled={week <= 40} aria-label="Previous week">‹</button>
              <span>Week {week} · {WEEKS[week]}</span>
              <button onClick={() => setWeek(week + 1)} disabled={week >= NOW_WEEK} aria-label="Next week">›</button>
            </div>
          )}
          <div className="pl-seg" role="group" aria-label="Who is looking">
            <button className={priv ? 'on' : ''} onClick={() => setPriv(true)} aria-pressed={priv}>My view</button>
            <button className={!priv ? 'on' : ''} onClick={() => setPriv(false)} aria-pressed={!priv}>Manager view</button>
          </div>
          <button className="pl-switch" onClick={() => setPlain(false)}>Open the Odyssey</button>
        </div>
      </header>
      <nav className="pl-tabs" aria-label="Sections">
        {TABS.map(([id, l]) => <button key={id} className={tab === id ? 'on' : ''} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>{l}</button>)}
      </nav>
      <main className="pl-body">
        {tab === 'overview' && <Overview />}
        {tab === 'checkin' && <CheckIn />}
        {tab === 'goals' && <Goals />}
        {tab === 'people' && <People />}
        {tab === 'team' && <Team />}
        <p className="pl-foot">Demo data · collaborators and events are illustrative · AI drafts are never a verdict</p>
      </main>
    </div>
  )
}
