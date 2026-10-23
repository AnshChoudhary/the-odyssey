import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div id="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className="toast glass" layout initial={{ opacity: 0, x: 60, scale: .95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 60 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <span className="ico" aria-hidden="true">{t.icon ?? '🦉'}</span>
            <div><b>{t.title}</b>{t.body && <p>{t.body}</p>}</div>
            <button className="x" onClick={() => dismissToast(t.id)} aria-label="Dismiss">×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
