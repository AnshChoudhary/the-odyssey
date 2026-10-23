import { NAV, NOW_WEEK, WEEKS } from '../data'
import { useStore } from '../store'
import { Icon } from './Icons'

export function Hud() {
  const { week, setWeek, priv, setPriv, route, set } = useStore()
  const sec = NAV.find((s) => s.items.some((i) => i[0] === route))
  const label = sec?.items.find((i) => i[0] === route)?.[1]
  const weekly = route === 'map' || route === 'deck' || route === 'log'
  return (
    <header id="hud">
      <a className="brand glass" href="#/map" data-cursor="Home" aria-label="The Work Odyssey, home">
        <svg viewBox="-20 -34 52 46" width="26" height="24" aria-hidden="true"><path d="M-18 0 Q-6 8 12 8 Q22 6 30 -6 L-14 -6Z" fill="currentColor" /><path d="M4 -6V-30" stroke="currentColor" strokeWidth="1.6" /><path d="M6 -28 Q22 -18 18 -8 L6 -8Z" fill="currentColor" opacity=".85" /><path d="M2 -24 Q-10 -16 -8 -8 L2 -8Z" fill="currentColor" opacity=".7" /></svg>
        <span>The Work Odyssey</span>
      </a>
      <nav className="crumbs glass" aria-label="Breadcrumb"><span>{sec?.sec}</span><i>/</i><b>{label}</b></nav>
      <div className="hud-right">
        <span className="badge">Example data</span>
        {weekly && (
          <div className="week glass" role="group" aria-label="Week">
            <button onClick={() => setWeek(week - 1)} disabled={week <= 40} aria-label="Previous week" data-cursor="Back">‹</button>
            <span>Week {week} · {WEEKS[week]}</span>
            <button onClick={() => setWeek(week + 1)} disabled={week >= NOW_WEEK} aria-label="Next week" data-cursor="Forward">›</button>
          </div>
        )}
        <label className="priv glass" data-cursor="Toggle">
          <span aria-hidden="true">{priv ? '🔒' : '🧭'}</span>
          <span className="priv-t">{priv ? 'Private view' : 'Manager lens'}</span>
          <input type="checkbox" checked={priv} onChange={(e) => setPriv(e.target.checked)} />
          <i className="sw" aria-hidden="true" />
        </label>
        <button className="glass round" onClick={() => set({ palette: true })} aria-label="Open command menu" data-cursor="⌘K"><kbd>⌘K</kbd></button>
        <button className="glass round" onClick={() => set({ legend: true })} aria-label="Legend" data-cursor="Legend">?</button>
      </div>
    </header>
  )
}

export function Rail() {
  const route = useStore((s) => s.route)
  return (
    <nav id="rail" className="glass" aria-label="Voyage navigation">
      {NAV.map((s, si) => (
        <div key={s.sec}>
          {si > 0 && <div className="sep" />}
          <p className="sec">{s.sec}</p>
          {s.items.map(([id, label, icon]) => (
            <a key={id} href={'#/' + id} className={route === id ? 'on' : ''} aria-current={route === id ? 'page' : undefined} aria-label={label} data-cursor={label.split(' ')[0]}>
              <Icon name={icon} /><span>{label}</span>
            </a>
          ))}
        </div>
      ))}
    </nav>
  )
}
