import { ALL_NAV, NOW_WEEK, ViewId, WEEKS } from '../data'
import { useStore } from '../store'
import { pad } from '../lib'

const PAPER: ViewId[] = ['log', 'chapters', 'recruit']
export const isPaper = (v: ViewId) => PAPER.includes(v)

export function Hud() {
  const { week, setWeek, priv, setPriv, shown, menu, set } = useStore()
  const i = ALL_NAV.findIndex((n) => n.id === shown)
  const weekly = shown === 'map' || shown === 'deck' || shown === 'log'
  return (
    <header id="hud" className={`${isPaper(shown) ? 'on-paper' : ''}${shown === 'map' || shown === 'deck' ? ' on-map' : ''}${menu ? ' menu-open' : ''}`}>
      <a className="brand" href="#/map" data-cursor="Home" aria-label="The Work Odyssey, home">
        <b>The Work <em>Odyssey</em></b>
        <span className="mono">{pad(i + 1)} — {ALL_NAV[i]?.label}</span>
      </a>
      <div className="hud-mid mono">
        {weekly && !menu && (
          <div className="week" role="group" aria-label="Week">
            <button onClick={() => setWeek(week - 1)} disabled={week <= 40} aria-label="Previous week" data-cursor="Earlier">←</button>
            <span>W{week}<span className="wk-range"> · {WEEKS[week]}</span></span>
            <button onClick={() => setWeek(week + 1)} disabled={week >= NOW_WEEK} aria-label="Next week" data-cursor="Later">→</button>
          </div>
        )}
        {weekly && !menu && <i className="vsep" />}
        {!menu && (
          <label className="lens" data-cursor={priv ? 'Manager lens' : 'Private view'}>
            <span className="lens-t">{priv ? 'Private view' : 'Manager lens'}</span>
            <input type="checkbox" checked={priv} onChange={(e) => setPriv(e.target.checked)} aria-label="Private view" />
            <i className="sw" aria-hidden="true" />
          </label>
        )}
        {!menu && <i className="vsep" />}
        {!menu && <button className="hud-btn kbd-hint" onClick={() => set({ palette: true })} data-cursor="Search">Search <span style={{ opacity: .5 }}>⌘K</span></button>}
        <button className="hud-btn" onClick={() => set({ menu: !menu })} aria-expanded={menu} data-cursor={menu ? 'Close' : 'Index'}>
          {menu ? 'Close' : 'Index'}<span className="burger" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
  )
}
