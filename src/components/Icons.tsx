const P: Record<string, string> = {
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',
  star: 'M12 3l2.4 5.6 6 .6-4.5 4 1.4 6-5.3-3.2L6.7 19.2l1.4-6-4.5-4 6-.6z',
  island: 'M3 17c3 2 6 2 9 0s6-2 9 0M7 14c0-3 2-5 5-5s5 2 5 5M12 9V4l4 1.5L12 7',
  scroll: 'M7 4h11v13a3 3 0 01-3 3H6a3 3 0 003-3V6a2 2 0 00-2-2zM11 9h4M11 13h4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  crew: 'M9 11a3.2 3.2 0 100-6.4A3.2 3.2 0 009 11zM3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16.5 5.2a3 3 0 010 5.6M18 14c2 .6 3 2.2 3 4.5',
  plus: 'M12 5v14M5 12h14M12 2a10 10 0 100 20 10 10 0 000-20z',
  anchor: 'M12 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 8v13M6 13H3c0 4 4 8 9 8s9-4 9-8h-3M8 12h8',
  fleet: 'M3 15l2 4h14l2-4zM12 15V4l6 9zM11 6L6 13h5',
  book: 'M4 5a2 2 0 012-2h6v17H6a2 2 0 00-2 2zM20 5a2 2 0 00-2-2h-6v17h6a2 2 0 012 2z',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0',
}
export function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={P[name]} /></svg>
}
