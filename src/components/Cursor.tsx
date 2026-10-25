import { useEffect, useRef } from 'react'

/** A ring that trails the pointer and names what a click will do. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.body.classList.add('has-cursor')
    const el = ref.current!, dot = el.querySelector<HTMLElement>('.dot')!, ring = el.querySelector<HTMLElement>('.ring')!, label = el.querySelector('em')!
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18
      dot.style.transform = `translate(${tx}px,${ty}px)`
      ring.style.transform = `translate(${x}px,${y}px)`; label.style.transform = `translate(${x}px,${y}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY
      const t = (e.target as HTMLElement).closest?.('[data-cursor], button, a, input, textarea, label') as HTMLElement | null
      el.classList.toggle('hover', !!t)
      if (t) label.textContent = t.dataset.cursor ?? (t.matches('input,textarea') ? 'Write' : 'Open')
    }
    const down = () => el.classList.add('down'), up = () => el.classList.remove('down')
    addEventListener('pointermove', move); addEventListener('pointerdown', down); addEventListener('pointerup', up)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); removeEventListener('pointerup', up); document.body.classList.remove('has-cursor') }
  }, [])
  return <div id="cursor" ref={ref} aria-hidden="true"><span className="dot" /><span className="ring" /><em /></div>
}
