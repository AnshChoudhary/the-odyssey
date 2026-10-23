import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TITLE = 'Odyssey'
export function Intro({ onDone }: { onDone: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = cv.current!, g = c.getContext('2d')!
    let w = 0, h = 0, raf = 0
    const stars = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random() * 0.7, r: Math.random() * 1.3 + .2, p: Math.random() * 6 }))
    const fit = () => { const d = devicePixelRatio || 1; w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; g.setTransform(d, 0, 0, d, 0, 0) }
    fit(); addEventListener('resize', fit)
    const draw = (t: number) => {
      g.clearRect(0, 0, w, h)
      for (const s of stars) { g.globalAlpha = .35 + .65 * Math.abs(Math.sin(t / 1400 + s.p)); g.fillStyle = '#f6e6bf'; g.beginPath(); g.arc(s.x * w, s.y * h, s.r, 0, 6.3); g.fill() }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit) }
  }, [])
  return (
    <motion.section id="intro" aria-label="Welcome" exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>
      <canvas ref={cv} />
      <div className="intro-sea" aria-hidden="true">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none">
          {[['w1', 120], ['w2', 170], ['w3', 230]].map(([k, y]) => <path key={k} className={'w ' + k} d={`M-400 ${y} ` + Array.from({ length: 10 }, (_, i) => `Q${-300 + i * 200} ${+y - 40} ${-200 + i * 200} ${y}`).join(' ') + ' V400 H-400Z'} />)}
        </svg>
      </div>
      <svg className="intro-ship" viewBox="-60 -130 160 150" aria-hidden="true">
        <g><path d="M-50 0 Q-20 22 40 22 Q70 20 92 -14 L-44 -14Z" fill="#05090d" /><path d="M-2 -14 V-118" stroke="#05090d" strokeWidth="3" />
          <path d="M2 -112 Q54 -80 46 -28 L2 -26Z" fill="#0b141c" stroke="#05090d" strokeWidth="2" /><path d="M-4 -100 Q-40 -66 -34 -26 L-4 -26Z" fill="#0b141c" stroke="#05090d" strokeWidth="2" /><path d="M-2 -118 l24 -6 -24 -6z" fill="#b4432d" /></g>
      </svg>
      <div className="intro-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: 1 }}>An AI-guided voyage through your work</motion.p>
        <h1 className="intro-title" aria-label="The Work Odyssey">
          <motion.span className="the" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5, duration: 1.2 }}>The Work</motion.span>
          {TITLE.split('').map((ch, i) => (
            <motion.span key={i} className="ch" initial={{ opacity: 0, y: '60%', rotate: 6, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }} transition={{ delay: .7 + i * .09, duration: 1.1, ease: [.22, 1, .36, 1] }}>{ch}</motion.span>
          ))}
        </h1>
        <motion.p className="intro-sub" initial={{ opacity: 0 }} animate={{ opacity: .85 }} transition={{ delay: 1.9, duration: 1 }}>Your work, charted as an epic.</motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: .9 }} style={{ display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn primary lg" onClick={onDone} data-cursor="Begin">Set sail <span aria-hidden="true">→</span></button>
        </motion.div>
        <motion.p className="intro-foot" initial={{ opacity: 0 }} animate={{ opacity: .5 }} transition={{ delay: 2.7 }}>Example data · a mirror, not a verdict</motion.p>
      </div>
    </motion.section>
  )
}
