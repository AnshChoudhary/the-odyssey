import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div id="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className="toast" layout initial={{ opacity: 0, y: 24, clipPath: 'inset(100% 0 0 0)' }} animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
            <b>{t.title}</b>
            <button className="x" onClick={() => dismissToast(t.id)} aria-label="Dismiss">Close</button>
            {t.body && <p>{t.body}</p>}
            <motion.i className="bar" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 4.8, ease: 'linear' }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
