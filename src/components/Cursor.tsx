import { useEffect, useRef } from 'react'

/** A compass-ring cursor that eases after the pointer and names what you are about to do. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.body.classList.add('has-cursor')
    const el = ref.current!, label = el.querySelector('em')!
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0, idleTimer = 0
    const tick = () => { x += (tx - x) * 0.22; y += (ty - y) * 0.22; el.style.transform = `translate(${x}px,${y}px)`; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY
      el.classList.remove('hidden')
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => el.classList.add('hidden'), 2000) as unknown as number
      const t = (e.target as HTMLElement).closest?.('[data-cursor], button, a, input, textarea, label') as HTMLElement | null
      el.classList.toggle('hover', !!t)
      if (t) label.textContent = t.dataset.cursor ?? (t.matches('input,textarea') ? 'Write' : 'Open')
    }
    const leave = () => el.classList.add('hidden')
    const enter = () => el.classList.remove('hidden')
    const down = () => el.classList.add('down'), up = () => el.classList.remove('down')
    addEventListener('pointermove', move); addEventListener('pointerdown', down); addEventListener('pointerup', up)
    addEventListener('mouseleave', leave); document.addEventListener('mouseenter', enter)
    return () => { 
      cancelAnimationFrame(raf); clearTimeout(idleTimer)
      removeEventListener('pointermove', move); removeEventListener('pointerdown', down); removeEventListener('pointerup', up)
      removeEventListener('mouseleave', leave); document.removeEventListener('mouseenter', enter)
      document.body.classList.remove('has-cursor')
    }
  }, [])
  return <div id="cursor" ref={ref} aria-hidden="true"><span /><em /></div>
}
