import { create } from 'zustand'
import { ViewId, NOW_WEEK, ISLANDS, SHIPPED, SHIPPED_COUNT, Island, IslandKind } from './data'

export type IslandStatus = 'rescued' | 'dismissed' | 'done'
export interface Toast { id: number; title: string; body?: string }

interface State {
  route: ViewId
  shown: ViewId
  week: number
  priv: boolean
  selected: string | null
  status: Record<string, IslandStatus>
  names: Record<string, string>
  notes: Record<string, string>
  confirmed: Record<string, boolean>
  trials: Record<string, { confirmed: boolean; title?: string; story?: string }>
  epic: string | null
  extraShipped: string[]
  toasts: Toast[]
  intro: boolean
  tour: number
  legend: boolean
  palette: boolean
  menu: boolean
  plain: boolean
  setPlain: (b: boolean) => void
  setRoute: (r: ViewId) => void
  setWeek: (w: number) => void
  setPriv: (b: boolean) => void
  select: (id: string | null) => void
  setStatus: (id: string, s: IslandStatus) => void
  rename: (id: string, n: string) => void
  note: (id: string, n: string) => void
  confirm: (id: string, v?: boolean) => void
  trial: (id: string, patch: Partial<{ confirmed: boolean; title: string; story: string }>) => void
  setEpic: (e: string | null) => void
  toast: (title: string, body?: string) => void
  dismissToast: (id: number) => void
  set: (p: Partial<State>) => void
}

const VIEWS: ViewId[] = ['map', 'ithaca', 'calypso', 'log', 'trials', 'deck', 'recruit', 'ports', 'armada', 'chapters', 'gifts']
export const parseHash = (): ViewId => {
  const h = location.hash.replace(/^#\/?/, '') as ViewId
  return VIEWS.includes(h) ? h : 'map'
}
let tid = 1
const seen = (k: string) => { try { return sessionStorage.getItem(k) === '1' } catch { return false } }
const seenL = (k: string) => { try { return localStorage.getItem(k) === '1' } catch { return false } }
/* the simple dashboard is a per-person preference: ?view=plain or ?view=odyssey sets it, localStorage remembers it */
const startPlain = () => {
  const q = new URLSearchParams(location.search).get('view')
  try {
    if (q === 'plain' || q === 'odyssey') localStorage.setItem('view', q)
    return localStorage.getItem('view') === 'plain'
  } catch { return q === 'plain' }
}

export const useStore = create<State>((set, get) => ({
  route: parseHash(),
  shown: parseHash(),
  week: NOW_WEEK,
  priv: true,
  selected: null,
  status: {},
  names: {},
  notes: {},
  confirmed: {},
  trials: {},
  epic: null,
  extraShipped: [],
  toasts: [],
  intro: !seen('intro') && !startPlain(),
  tour: seenL('tour') ? -1 : 0,
  legend: false,
  palette: false,
  menu: false,
  plain: startPlain(),
  setPlain: (plain) => { try { localStorage.setItem('view', plain ? 'plain' : 'odyssey') } catch { /* ok */ } set({ plain, menu: false, palette: false, legend: false, selected: null, intro: false }) },
  setRoute: (route) => { if (location.hash !== '#/' + route) location.hash = '/' + route; set({ route, selected: null, menu: false }) },
  setWeek: (w) => set({ week: Math.min(NOW_WEEK, Math.max(40, w)), selected: null }),
  setPriv: (priv) => set({ priv, selected: null }),
  select: (selected) => set({ selected }),
  setStatus: (id, s) => set((st) => ({ status: { ...st.status, [id]: s }, selected: null })),
  rename: (id, n) => set((st) => ({ names: { ...st.names, [id]: n } })),
  note: (id, n) => set((st) => ({ notes: { ...st.notes, [id]: n } })),
  confirm: (id, v = true) => set((st) => ({ confirmed: { ...st.confirmed, [id]: v } })),
  trial: (id, p) => set((st) => ({ trials: { ...st.trials, [id]: { ...(st.trials[id] ?? { confirmed: false }), ...p } } })),
  setEpic: (epic) => set({ epic }),
  toast: (title, body) => {
    const id = tid++
    set((st) => ({ toasts: [...st.toasts, { id, title, body }].slice(-3) }))
    setTimeout(() => get().dismissToast(id), 4800)
  },
  dismissToast: (id) => set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) })),
  set: (p) => set(p as State),
}))

/* ---- derived helpers ---- */
export interface LiveIsland extends Island { state: IslandKind; label: string }
export const liveIslands = (week: number, status: Record<string, IslandStatus>, names: Record<string, string>): LiveIsland[] =>
  ISLANDS.filter((i) => i.born <= week && !status[i.id] || (status[i.id] === 'rescued' && i.born <= week))
    .map((i) => {
      const age = Math.max(1, i.age - 7 * (NOW_WEEK - week))
      let state: IslandKind = i.kind
      if (i.kind === 'sinking' && age < 12) state = 'active'
      if (i.kind === 'overdue' && week < NOW_WEEK - 1 && age < 2) state = 'active'
      if (status[i.id] === 'rescued') state = 'active'
      return { ...i, age, state, label: names[i.id] ?? i.name }
    })

export const landmarks = (week: number, extra: string[]) => [
  ...SHIPPED.filter((s) => s.w <= week).slice(-6).map((s) => ({ t: s.t, d: s.d, isNew: s.w === week })),
  ...(week === NOW_WEEK ? extra.map((t) => ({ t: 'Shipped: ' + t, d: 'Marked done from the chart.', isNew: true })) : []),
].slice(-8)
export const shippedCount = (week: number, extra: number) => SHIPPED_COUNT[week] + (week === NOW_WEEK ? extra : 0)

window.addEventListener('hashchange', () => {
  const r = parseHash()
  if (r !== useStore.getState().route) useStore.setState({ route: r, selected: null, menu: false })
})
