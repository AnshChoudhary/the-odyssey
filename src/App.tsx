import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate } from 'framer-motion'
import { ALL_NAV, ViewId } from './data'
import { useStore } from './store'
import { pad } from './lib'
import { Hud } from './components/Hud'
import { Menu } from './components/Menu'
import { Cursor } from './components/Cursor'
import { Toasts } from './components/Toasts'
import { Palette } from './components/Palette'
import { Legend } from './components/Legend'
import { Intro } from './components/Intro'
import { Tour } from './components/Tour'
import MapView from './views/MapView'
import DeckView from './views/DeckView'
import { LogView, TrialsView } from './views/Rituals'
import { IthacaView, CalypsoView, ChaptersView, GiftsView, ArmadaView, RecruitView, PortsView } from './views/Pages'

const VIEWS: Record<ViewId, () => JSX.Element> = {
  map: MapView, deck: DeckView, log: LogView, trials: TrialsView, ithaca: IthacaView, calypso: CalypsoView,
  chapters: ChaptersView, gifts: GiftsView, armada: ArmadaView, recruit: RecruitView, ports: PortsView,
}

export default function App() {
  const { route, intro, menu, set, setRoute } = useStore()
  const [tick, setTick] = useState(0)
  const shown = useStore((s) => s.shown)
  const setShown = (v: ViewId) => set({ shown: v })
  const curtain = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const idx = ALL_NAV.findIndex((n) => n.id === route)

  /* the curtain: an ink panel rises, the view changes behind it, the panel lifts away */
  useEffect(() => {
    if (route === shown || busy.current) return
    busy.current = true
    const el = curtain.current!
    const ease = [.76, 0, .24, 1] as const
    animate(el, { clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'] }, { duration: .7, ease }).then(() => {
      setShown(useStore.getState().route)
      return animate(el, { clipPath: ['inset(0 0 0% 0)', 'inset(0 0 100% 0)'] }, { duration: .8, delay: .35, ease })
    }).then(() => { busy.current = false; setTick((t) => t + 1) })
  }, [route, shown, tick])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); set({ palette: !useStore.getState().palette }) }
      if (e.key === 'Escape') {
        const s = useStore.getState()
        if (s.palette || s.legend || s.menu) set({ palette: false, legend: false, menu: false })
        else if (s.selected) set({ selected: null })
        else if (s.route !== 'map') setRoute('map')
      }
    }
    addEventListener('keydown', key); return () => removeEventListener('keydown', key)
  }, [set, setRoute])

  const View = VIEWS[shown]
  const nav = ALL_NAV[idx]
  return (
    <>
      <main id="views"><View key={shown} /></main>
      <Hud />
      {(shown === 'map' || shown === 'deck') && <p className="corner-note mono">Demo · crew and events illustrative · a draft, never a verdict</p>}
      <AnimatePresence>{menu && <Menu />}</AnimatePresence>
      <div id="curtain" ref={curtain} aria-hidden="true">
        <div className="c-in">
          <p className="c-n eyebrow"><i />{pad(idx + 1)} / {pad(ALL_NAV.length)}<i /></p>
          <p className="c-t">{nav?.label}</p>
        </div>
        <div className="c-foot mono"><span>{nav?.sec}</span><span>{nav?.desc}</span></div>
      </div>
      <Toasts /><Palette /><Legend /><Tour />
      <AnimatePresence>{intro && <Intro onDone={() => { try { sessionStorage.setItem('intro', '1') } catch { /* ok */ } set({ intro: false }) }} />}</AnimatePresence>
      <div id="grain" aria-hidden="true" />
      <Cursor />
    </>
  )
}
