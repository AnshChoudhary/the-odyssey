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
        <svg viewBox="0 0 1800 500" preserveAspectRatio="none">
          {[['w1', 140, 120], ['w2', 200, 170], ['w3', 280, 230]].map(([k, y1, y2]) => <path key={k} className={'w ' + k} d={`M-600 ${y2} ` + Array.from({ length: 13 }, (_, i) => `Q${-500 + i * 200} ${+y1} ${-400 + i * 200} ${y2}`).join(' ') + ' V500 H-600Z'} />)}
        </svg>
      </div>
      <svg className="intro-ship" viewBox="-70 -140 180 160" aria-hidden="true">
        <g><path d="M-54 0 Q-22 24 44 24 Q76 22 100 -16 L-48 -16Z" fill="#05090d" /><path d="M-2 -16 V-126" stroke="#05090d" strokeWidth="3.5" />
          <path d="M2 -120 Q60 -86 50 -32 L2 -30Z" fill="#0b141c" stroke="#05090d" strokeWidth="2.2" /><path d="M-4 -106 Q-44 -70 -38 -30 L-4 -30Z" fill="#0b141c" stroke="#05090d" strokeWidth="2.2" /><path d="M-2 -126 l26 -7 -26 -7z" fill="#b4432d" /></g>
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
