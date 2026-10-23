/** Refined Greek galley deck illustration - realistic trireme style */

export function GreekGalley({ crew }: { crew: Array<{ id: string; x: number; y: number; flip?: boolean }> }) {
  return (
    <svg className="deck-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="hull-refined" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#9a6a3c" />
          <stop offset="0.5" stopColor="#7a5530" />
          <stop offset="1" stopColor="#5e3d20" />
        </linearGradient>
        <linearGradient id="sea-refined" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a6d78" />
          <stop offset="0.5" stopColor="#2a5563" />
          <stop offset="1" stopColor="#10303a" />
        </linearGradient>
        <linearGradient id="sail-light" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9f1d8" />
          <stop offset="50%" stopColor="#f4e8c8" />
          <stop offset="100%" stopColor="#ead9ae" />
        </linearGradient>
        <pattern id="deck-planks" width="100" height="12" patternUnits="userSpaceOnUse">
          <rect width="100" height="12" fill="#6a4a30" />
          <line x1="0" y1="11.5" x2="100" y2="11.5" stroke="#4a3a20" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Distant fleet silhouettes */}
      <g opacity="0.5" fill="#1b2430">
        {[80, 160, 240, 1380, 1470, 1535].map((x, i) => (
          <g key={x} transform={`translate(${x}, ${600 + (i % 3) * 4})`} className="far-fleet">
            <path d="M-18 0 L18 0 L12 10 L-12 10 Z" />
            <path d="M0 0 V-32 M2 -30 Q14 -20 10 -6 H2 Z" strokeWidth="1.5" stroke="#1b2430" />
          </g>
        ))}
      </g>

      {/* Sea and horizon */}
      <rect x="-50" y="620" width="1700" height="400" fill="url(#sea-refined)" />
      <g className="waves back" opacity="0.4">
        {[0, 1].map((k) => (
          <path 
            key={k}
            transform={`translate(${k * 0}, 0)`} 
            d={'M-200 650 ' + Array.from({ length: 14 }, (_, i) => `q50 -20 100 0`).join(' ')} 
            fill="none" 
            stroke="#9bc3c4" 
            strokeWidth="2" 
          />
        ))}
      </g>

      {/* Main galley structure */}
      <g className="galley-body">
        {/* Hull - elegant curved trireme shape */}
        <path 
          d="M240 670 Q300 650 400 645 L1250 645 Q1320 648 1360 672 L1320 710 Q1200 780 900 790 Q600 785 320 710 Z"
          fill="url(#hull-refined)"
          stroke="#2a1a0a"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        
        {/* Deck planking */}
        <path d="M280 670 Q700 650 1300 670" fill="url(#deck-planks)" />
        
        {/* Hull detail bands */}
        <path d="M280 690 Q800 670 1300 690" stroke="#2a1a0a" strokeWidth="2" opacity="0.6" fill="none" />
        <path d="M320 710 Q800 695 1260 710" stroke="#2a1a0a" strokeWidth="2" opacity="0.5" fill="none" />
        
        {/* Oar ports */}
        {Array.from({ length: 18 }, (_, i) => {
          const x = 380 + i * 50
          return (
            <g key={i} opacity="0.8">
              <ellipse cx={x} cy="695" rx="10" ry="7" fill="#1a0a0a" stroke="#2a1a0a" strokeWidth="1.5" />
            </g>
          )
        })}

        {/* Masts - realistic proportions */}
        <g className="mainmast">
          <path d="M700 200 V670" stroke="#3a2a1a" strokeWidth="12" strokeLinecap="round" />
          <path d="M700 220 L720 210 L680 210 Z" fill="#b4432d" stroke="#2a1a0a" strokeWidth="1.5" />
          
          {/* Main sail - elegant draping */}
          <path 
            className="sail-main"
            d="M560 290 Q700 310 840 290 Q830 440 838 540 Q700 560 560 540 Q568 430 560 290 Z"
            fill="url(#sail-light)"
            stroke="#3a2a1a"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          
          {/* Sail details - panels and stitching */}
          <path d="M700 290 V540" stroke="#c9a868" strokeWidth="1.5" opacity="0.5" />
          <path d="M630 380 Q700 385 770 380" stroke="#c9a868" strokeWidth="1" opacity="0.4" />
          <path d="M625 460 Q700 465 775 460" stroke="#c9a868" strokeWidth="1" opacity="0.4" />
          
          {/* Yardarm */}
          <path d="M560 305 L840 305" stroke="#3a2a1a" strokeWidth="8" strokeLinecap="round" />
        </g>

        <g className="foremast">
          <path d="M1050 260 V670" stroke="#3a2a1a" strokeWidth="11" strokeLinecap="round" />
          <path d="M1050 275 L1068 266 L1032 266 Z" fill="#b4432d" stroke="#2a1a0a" strokeWidth="1.5" />
          
          {/* Fore sail */}
          <path 
            className="sail-fore"
            d="M930 350 Q1050 368 1170 350 Q1162 480 1168 570 Q1050 588 930 570 Q936 470 930 350 Z"
            fill="url(#sail-light)"
            stroke="#3a2a1a"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          
          <path d="M1050 350 V570" stroke="#c9a868" strokeWidth="1.5" opacity="0.5" />
          <path d="M980 440 Q1050 444 1120 440" stroke="#c9a868" strokeWidth="1" opacity="0.4" />
          
          {/* Yardarm */}
          <path d="M930 362 L1170 362" stroke="#3a2a1a" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Rigging */}
        <g opacity="0.6" stroke="#4a3a2a" strokeWidth="1.5">
          <path d="M700 220 L560 650 M700 220 L840 650" />
          <path d="M1050 275 L930 650 M1050 275 L1170 650" />
          <path d="M700 220 L1050 275" />
        </g>

        {/* Stern castle/cabin */}
        <g className="stern">
          <path 
            d="M240 580 L420 580 L420 665 L240 665 Z"
            fill="#8a5d33"
            stroke="#2a1a0a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          
          {/* Windows */}
          {[270, 340].map(x => (
            <rect 
              key={x}
              x={x} 
              y="600" 
              width="50" 
              height="50" 
              rx="6"
              fill="#f1dca4" 
              stroke="#2a1a0a" 
              strokeWidth="2.5"
            />
          ))}
          
          {/* Roof */}
          <path d="M230 580 L430 580 L420 570 L240 570 Z" fill="#6a4a30" stroke="#2a1a0a" strokeWidth="2" />
          
          {/* Decorative stern post */}
          <path 
            d="M200 600 Q190 550 200 520 L210 520 Q220 550 210 600 Z"
            fill="#7a5530"
            stroke="#2a1a0a"
            strokeWidth="2"
          />
          <circle cx="205" cy="515" r="8" fill="#d3a444" stroke="#2a1a0a" strokeWidth="2" />
        </g>

        {/* Ship's wheel */}
        <g transform="translate(340, 530)" className="wheel">
          <circle r="42" fill="none" stroke="#3a2a1a" strokeWidth="7" />
          <circle r="10" fill="#3a2a1a" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line 
              key={angle}
              x1="0" 
              y1="0" 
              x2="0" 
              y2="-42"
              stroke="#3a2a1a"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Bow figurehead */}
        <g transform="translate(1360, 650)">
          <path 
            d="M0 0 Q20 -40 25 -80 L30 -80 Q35 -40 40 0"
            fill="#6a4a30"
            stroke="#2a1a0a"
            strokeWidth="2.5"
          />
          <path 
            d="M25 -80 Q15 -95 20 -110 L30 -110 Q35 -95 25 -80"
            fill="#d3a444"
            stroke="#2a1a0a"
            strokeWidth="2"
          />
        </g>

        {/* Deck rail */}
        <path d="M420 665 L1320 665" stroke="#3a2a1a" strokeWidth="8" />
        <path d="M420 658 L1320 658" stroke="#3a2a1a" strokeWidth="5" />
        
        {/* Rail posts */}
        {Array.from({ length: 24 }, (_, i) => {
          const x = 440 + i * 38
          return <line key={i} x1={x} y1="658" x2={x} y2="673" stroke="#3a2a1a" strokeWidth="4" />
        })}

        {/* Cargo crates */}
        <g transform="translate(820, 600)">
          <rect width="70" height="65" fill="#c79a5a" stroke="#2a1a0a" strokeWidth="3" />
          <path d="M0 0 L70 65 M70 0 L0 65" stroke="#2a1a0a" strokeWidth="2" opacity="0.6" />
          <text x="35" y="40" textAnchor="middle" className="crate-label" fill="#2a1a0a" fontSize="18" fontWeight="bold">PR</text>
        </g>
        
        <rect x="920" y="625" width="55" height="45" fill="#d2a864" stroke="#2a1a0a" strokeWidth="3" />
      </g>

      {/* Front waves with foam */}
      <g className="waves front">
        <path 
          d="M-200 810 q50 -24 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H-200 Z" 
          fill="#17404c" 
          opacity="0.85" 
        />
        <path 
          className="foam-wave"
          d="M-200 860 q50 -24 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H-200 Z" 
          fill="#0d2b35" 
        />
      </g>
    </svg>
  )
}

/** Refined crew member - elegant stylized figures */
export function CrewMember({ 
  id, 
  x, 
  y, 
  name, 
  role, 
  color, 
  hat, 
  selected, 
  flip,
  onSelect 
}: {
  id: string
  x: number
  y: number
  name: string
  role: string
  color: string
  hat: string
  selected: boolean
  flip?: boolean
  onSelect: () => void
}) {
  const hatStyles: Record<string, JSX.Element> = {
    tri: <path d="M-20 -76 L0 -94 L20 -76 Q0 -83 -20 -76 Z" fill="#2b1d10" />,
    bun: <><circle cx="0" cy="-86" r="7" fill="#2b1d10" /><path d="M-14 -73 Q14 -87 14 -73 Z" fill="#2b1d10" /></>,
    band: <path d="M-14 -75 h28" stroke="#b5452f" strokeWidth="6" strokeLinecap="round" />,
    cap: <><path d="M-14 -75 Q14 -92 14 -75 Z" fill="#3b2a1a" /><line x1="10" y1="-76" x2="22" y2="-75" stroke="#5b4630" strokeWidth="3" /></>,
    hair: <path d="M-14 -73 Q0 -90 14 -73 Q8 -80 0 -78 Q-8 -80 -14 -73 Z" fill="#5b3a20" />,
    bun2: <><circle cx="0" cy="-86" r="6" fill="#5b3a20" /><path d="M-14 -73 Q14 -87 14 -73 Z" fill="#5b3a20" /></>
  }

  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      className={`crew-figure${selected ? ' sel' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${name}, ${role}`}
      data-cursor={role}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <g 
        className="crew-body"
        transform={flip ? 'scale(-1, 1)' : undefined}
        style={{ animationDelay: `${-(id.charCodeAt(0) % 4) * 0.7}s` }}
      >
        {/* Body - tunic */}
        <path 
          d="M-20 -8 L-14 -56 Q0 -64 14 -56 L20 -8 Z"
          fill={color}
          stroke="#2a1a0a"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        
        {/* Belt */}
        <path d="M-18 -30 L18 -30" stroke="#4a3a2a" strokeWidth="3" strokeLinecap="round" />
        
        {/* Arms */}
        <path 
          d="M-14 -50 Q-20 -35 -22 -18 M14 -50 Q20 -35 22 -18"
          fill="none"
          stroke="#2a1a0a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        
        {/* Hands */}
        <circle cx="-22" cy="-18" r="4" fill="#f1d3ae" stroke="#2a1a0a" strokeWidth="1.5" />
        <circle cx="22" cy="-18" r="4" fill="#f1d3ae" stroke="#2a1a0a" strokeWidth="1.5" />
        
        {/* Head */}
        <circle cx="0" cy="-66" r="15" fill="#f1d3ae" stroke="#2a1a0a" strokeWidth="2.4" />
        
        {/* Face - refined features */}
        <circle cx="-5" cy="-67" r="2" fill="#2a1a0a" />
        <circle cx="5" cy="-67" r="2" fill="#2a1a0a" />
        <path d="M-5 -61 Q0 -59 5 -61" fill="none" stroke="#2a1a0a" strokeWidth="1.8" strokeLinecap="round" />
        
        {/* Hat/hair */}
        {hatStyles[hat]}
      </g>
      
      {/* Label */}
      <g className="crew-label" transform="translate(0, 32)">
        <text 
          className="crew-name" 
          textAnchor="middle"
          fill="#fff3d4"
          stroke="#2a1a0a"
          strokeWidth="5"
          paintOrder="stroke"
          fontFamily="var(--hand)"
          fontSize="28"
          fontWeight="600"
        >
          {name}
        </text>
        <text 
          y="22"
          className="crew-role"
          textAnchor="middle"
          fill="#fff3d4"
          stroke="#2a1a0a"
          strokeWidth="4"
          paintOrder="stroke"
          fontFamily="var(--display)"
          fontSize="18"
          fontStyle="italic"
        >
          {role}
        </text>
      </g>
    </g>
  )
}
