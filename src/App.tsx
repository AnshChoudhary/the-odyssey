import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate } from 'framer-motion'
import { NAV, ViewId } from './data'
import { useStore } from './store'
import { Hud, Rail } from './components/Hud'
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
const titleOf = (id: ViewId) => NAV.flatMap((s) => s.items).find((i) => i[0] === id)![1]

export default function App() {
  const { route, intro, set, setRoute } = useStore()
  const [shown, setShown] = useState<ViewId>(route)
  const wipe = useRef<HTMLDivElement>(null)
  const [wipeTitle, setWipeTitle] = useState('')
  const first = useRef(true)

  /* wave-wipe between views: sea rises, view swaps behind it, sea falls */
  useEffect(() => {
    if (route === shown) return
    if (first.current) { first.current = false }
    setWipeTitle(titleOf(route))
    const el = wipe.current!
    animate(el, { y: ['130%', '0%'] }, { duration: .55, ease: [.76, 0, .24, 1] }).then(() => {
      setShown(route); document.querySelector('.view')?.scrollTo(0, 0)
      animate(el, { y: ['0%', '-130%'] }, { duration: .7, delay: .22, ease: [.76, 0, .24, 1] })
    })
  }, [route, shown])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); set({ palette: !useStore.getState().palette }) }
      if (e.key === 'Escape') {
        const s = useStore.getState()
        if (s.palette || s.legend) set({ palette: false, legend: false })
        else if (s.selected) set({ selected: null })
        else if (s.route !== 'map') setRoute('map')
      }
    }
    addEventListener('keydown', key); return () => removeEventListener('keydown', key)
  }, [set, setRoute])

  const View = VIEWS[shown]
  return (
    <>
      <div id="grain" aria-hidden="true" />
      <Hud /><Rail />
      <main id="views"><View key={shown} /></main>
      <div id="wipe" ref={wipe} aria-hidden="true">
        <svg viewBox="0 0 1600 140" preserveAspectRatio="none"><path d={'M0 140 V60 ' + Array.from({ length: 8 }, (_, i) => `Q${i * 200 + 100} ${i % 2 ? 100 : 20} ${i * 200 + 200} 60`).join(' ') + ' V140Z'} /></svg>
        <div className="body"><span>{wipeTitle}</span></div>
      </div>
      <Toasts /><Palette /><Legend /><Tour /><Cursor />
      <AnimatePresence>{intro && <Intro onDone={() => { try { sessionStorage.setItem('intro', '1') } catch { /* ok */ } set({ intro: false }) }} />}</AnimatePresence>
    </>
  )
}
