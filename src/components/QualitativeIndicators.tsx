/** Qualitative progress indicators - no scores, only journey stages */
import { motion } from 'framer-motion'

/** Journey stage indicator: stars brightening to show progress without numbers */
export function JourneyStage({ progress }: { progress: number }) {
  const stages = [
    { threshold: 0, label: 'Setting out', stars: 1 },
    { threshold: 0.33, label: 'Under way', stars: 2 },
    { threshold: 0.66, label: 'Ithaca in sight', stars: 3 },
    { threshold: 0.9, label: 'At the shore', stars: 4 }
  ]
  const stage = [...stages].reverse().find(s => progress >= s.threshold) || stages[0]
  
  return (
    <div className="journey-stage">
      <div className="constellation" aria-label={stage.label}>
        {[...Array(4)].map((_, i) => (
          <motion.svg
            key={i}
            className={`star ${i < stage.stars ? 'lit' : 'dim'}`}
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: i < stage.stars ? 1 : 0.2,
              scale: i < stage.stars ? 1 : 0.7
            }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <path d="M12 2l2.4 5.6 6 .6-4.5 4 1.4 6-5.3-3.2L6.7 18.2l1.4-6-4.5-4 6-.6z" fill="currentColor" />
          </motion.svg>
        ))}
      </div>
      <span className="stage-label">{stage.label}</span>
    </div>
  )
}

/** Voyage path visualization - qualitative progress with ship position */
export function VoyagePath({ progress }: { progress: number }) {
  return (
    <div className="voyage-path">
      <svg viewBox="0 0 200 40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--sepia)" opacity="0.3" />
            <stop offset={`${progress * 100}%`} stopColor="var(--teal)" />
            <stop offset={`${progress * 100}%`} stopColor="var(--sepia)" opacity="0.15" />
          </linearGradient>
        </defs>
        <path 
          d="M0 20 Q50 10, 100 20 T200 20" 
          stroke="url(#path-grad)" 
          strokeWidth="3" 
          fill="none"
          strokeDasharray="4 6"
        />
      </svg>
      <motion.div 
        className="ship-marker" 
        initial={{ left: 0 }}
        animate={{ left: `${progress * 100}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        ⛵
      </motion.div>
      <div className="harbor-marker">🏛</div>
    </div>
  )
}

/** Ink marks for counting without numbers - traditional tally marks */
export function InkMarks({ count, label }: { count: number; label: string }) {
  const groups = Math.floor(count / 5)
  const remainder = count % 5
  
  return (
    <div className="ink-marks" aria-label={`${count} ${label}`}>
      <svg className="tallies" viewBox="0 0 200 30">
        {[...Array(groups)].map((_, i) => (
          <g key={`group-${i}`} transform={`translate(${i * 24}, 0)`}>
            <line x1="3" y1="2" x2="3" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="7" y1="2" x2="7" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="11" y1="2" x2="11" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="15" y1="2" x2="15" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(-20 9 15)" />
          </g>
        ))}
        {[...Array(remainder)].map((_, i) => (
          <line key={`single-${i}`} x1={groups * 24 + i * 4 + 3} y1="2" x2={groups * 24 + i * 4 + 3} y2="28" stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <span className="tally-label">{label}</span>
    </div>
  )
}
