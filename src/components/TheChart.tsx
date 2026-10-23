import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkItem } from '../types';
import { mockUserProfile, getWorkItemById } from '../data/mockData';
import {
  generateIslandPath,
  generateShorelineRings,
  generateCloudPath,
  findNonOverlappingPosition,
  type Box,
} from '../utils/islandGenerator';

interface ChartProps {
  onNavigateToShip: () => void;
}

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1200;

export function TheChart({ onNavigateToShip }: ChartProps) {
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const workItems = mockUserProfile.workItems;
  const ship = mockUserProfile.ship;
  const selectedWork = selectedIsland ? getWorkItemById(selectedIsland) : null;
  const userName = mockUserProfile.name;

  // Fade hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Generate stable island positions with collision avoidance
  const islandData = useMemo(() => {
    const boxes: Box[] = [];
    const data = workItems
      .filter(item => item.status !== 'done')
      .map((item, idx) => {
        const size = 20 + item.size * 4;
        const padding = 70; // Extra space for labels
        let pos = findNonOverlappingPosition(boxes, size, { width: 900, height: 700 }, 100, padding);
        
        if (!pos) {
          // Fallback with offset to avoid overlap
          pos = { 
            x: 150 + (idx % 4) * 220, 
            y: 200 + Math.floor(idx / 4) * 180 
          };
        }
        
        boxes.push({ 
          x: pos.x - size - padding / 2, 
          y: pos.y - size - padding / 2, 
          width: size * 2 + padding, 
          height: size * 2 + padding + 40 // Extra for label
        });
        
        return {
          ...item,
          position: pos,
          size,
          path: generateIslandPath(pos.x, pos.y, size, item.id, idx),
          shorelines: generateShorelineRings(pos.x, pos.y, size, item.id, 1),
        };
      });
    
    return data;
  }, [workItems]);

  const doneItems = workItems.filter(item => item.status === 'done');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('map-layer')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev * delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIsland(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleIslandAction = (action: 'rescue' | 'dismiss' | 'done') => {
    if (!selectedWork) return;
    console.log(`Action ${action} on work item:`, selectedWork.id);
    setSelectedIsland(null);
  };

  const getIslandColor = (status: WorkItem['status']) => {
    switch (status) {
      case 'active': return '#c9af81';
      case 'needs-attention': return '#b8956f';
      case 'forgotten': return '#9d9183';
      case 'done': return '#7a6d5e';
    }
  };

  const getSourceIcon = (source: WorkItem['source']) => {
    switch (source) {
      case 'slack': return '💬';
      case 'github': return '⚙️';
      case 'zoom': return '📹';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e8dcc7]">
      {/* Hint text */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 bg-[#f4efe6]/95 backdrop-blur-sm px-8 py-4 rounded border border-[#8b7355]/20 shadow-lg"
          >
            <p className="text-sm text-[#2d2419] text-center font-serif italic">
              Pan with mouse • Zoom with scroll • Click islands for details
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Map Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-move map-layer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '50% 50%',
          }}
        >
          <defs>
            {/* Parchment texture */}
            <filter id="parchment-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0.03" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>

            {/* Vignette */}
            <radialGradient id="vignette">
              <stop offset="0%" stopColor="#e8dcc7" stopOpacity="0" />
              <stop offset="70%" stopColor="#e8dcc7" stopOpacity="0" />
              <stop offset="100%" stopColor="#2d2419" stopOpacity="0.3" />
            </radialGradient>

            {/* Ink hatching pattern for islands */}
            <pattern id="ink-hatching" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="6" x2="6" y2="0" stroke="#3f3320" strokeWidth="0.5" opacity="0.25" />
              <line x1="0" y1="3" x2="3" y2="0" stroke="#3f3320" strokeWidth="0.4" opacity="0.2" />
            </pattern>

            {/* Rich sea hatching pattern */}
            <pattern id="sea-hatching" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              {/* Horizontal lines */}
              <line x1="0" y1="5" x2="20" y2="5" stroke="#6b8e9d" strokeWidth="0.6" opacity="0.15" />
              <line x1="0" y1="15" x2="20" y2="15" stroke="#6b8e9d" strokeWidth="0.6" opacity="0.15" />
              {/* Diagonal cross-hatch */}
              <line x1="0" y1="20" x2="20" y2="0" stroke="#6b8e9d" strokeWidth="0.4" opacity="0.1" />
              <line x1="10" y1="20" x2="20" y2="10" stroke="#6b8e9d" strokeWidth="0.4" opacity="0.08" />
              <line x1="0" y1="10" x2="10" y2="0" stroke="#6b8e9d" strokeWidth="0.4" opacity="0.08" />
              {/* Contour curves */}
              <path d="M0 8 Q 5 6, 10 8 T 20 8" fill="none" stroke="#6b8e9d" strokeWidth="0.5" opacity="0.12" />
            </pattern>

            {/* Rain pattern for stormy islands */}
            <pattern id="rain" x="0" y="0" width="10" height="20" patternUnits="userSpaceOnUse">
              <line x1="5" y1="0" x2="3" y2="20" stroke="#4a5f75" strokeWidth="1" opacity="0.4">
                <animate attributeName="y1" values="0;20;0" dur="1s" repeatCount="indefinite" />
                <animate attributeName="y2" values="20;40;20" dur="1s" repeatCount="indefinite" />
              </line>
            </pattern>
          </defs>

          {/* Parchment background */}
          <rect
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            fill="#e8dcc7"
            filter="url(#parchment-texture)"
          />

          {/* Decorative border */}
          <rect
            x="20"
            y="20"
            width={MAP_WIDTH - 40}
            height={MAP_HEIGHT - 40}
            fill="none"
            stroke="#8b7355"
            strokeWidth="3"
            strokeDasharray="10,5"
            opacity="0.6"
          />
          <rect
            x="30"
            y="30"
            width={MAP_WIDTH - 60}
            height={MAP_HEIGHT - 60}
            fill="none"
            stroke="#8b7355"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Cartouche title */}
          <g transform="translate(80, 60)">
            <rect x="-10" y="-30" width="420" height="60" fill="#f4efe6" stroke="#8b7355" strokeWidth="2" rx="4" opacity="0.95" />
            <text
              x="0"
              y="0"
              fontFamily="Playfair Display"
              fontSize="24"
              fontWeight="700"
              fill="#2d2419"
            >
              The Voyage of {userName}
            </text>
            <text
              x="0"
              y="20"
              fontFamily="Inter"
              fontSize="12"
              fill="#5a4a3a"
              fontStyle="italic"
            >
              Week 43 · Anno MMXXVI
            </text>
          </g>

          {/* Compass rose */}
          <g transform="translate(1450, 100)">
            <circle cx="0" cy="0" r="50" fill="#f4efe6" stroke="#8b7355" strokeWidth="2" opacity="0.9" />
            <circle cx="0" cy="0" r="48" fill="none" stroke="#8b7355" strokeWidth="1" opacity="0.5" />
            {/* North point */}
            <polygon points="0,-40 -8,-15 8,-15" fill="#2d2419" />
            <polygon points="0,40 -8,15 8,15" fill="#8b7355" />
            <polygon points="-40,0 -15,-8 -15,8" fill="#8b7355" />
            <polygon points="40,0 15,-8 15,8" fill="#8b7355" />
            <text
              x="0"
              y="-50"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Playfair Display"
              fontSize="16"
              fontWeight="bold"
              fill="#2d2419"
            >
              N
            </text>
          </g>

          {/* Ocean with rich ink hatching */}
          <rect
            x="100"
            y="150"
            width="1000"
            height="900"
            fill="#b8d4e0"
            opacity="0.3"
          />
          <rect
            x="100"
            y="150"
            width="1000"
            height="900"
            fill="url(#sea-hatching)"
          />

          {/* Rhumb lines (subtle diagonal lines) */}
          {[...Array(8)].map((_, i) => (
            <line
              key={`rhumb-${i}`}
              x1={200 + i * 150}
              y1="150"
              x2={300 + i * 150}
              y2="1050"
              stroke="#8b7355"
              strokeWidth="0.5"
              strokeDasharray="5,10"
              opacity="0.15"
            />
          ))}

          {/* Dotted routes to teammates */}
          {mockUserProfile.crew.slice(0, 3).map((crew, idx) => {
            const endX = ship.position.x + (idx + 1) * 180 + (idx * 50);
            const endY = ship.position.y - (idx + 1) * 100;
            return (
              <g key={crew.id}>
                <path
                  d={`M ${ship.position.x} ${ship.position.y} Q ${(ship.position.x + endX) / 2} ${ship.position.y - 80} ${endX} ${endY}`}
                  fill="none"
                  stroke="#6b8e9d"
                  strokeWidth="2"
                  strokeDasharray="8,6"
                  opacity="0.4"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })}

          {/* Islands */}
          {islandData.map((item) => {
            const color = getIslandColor(item.status);
            const isStormy = item.status === 'needs-attention';
            const isSinking = item.status === 'forgotten';

            return (
              <g key={item.id} data-testid={`island-${item.id}`}>
                {/* Stormy weather */}
                {isStormy && (
                  <g style={{ pointerEvents: 'none' }}>
                    {[0, 1, 2].map(i => {
                      const cloudPath = generateCloudPath(item.position.x - 40 + i * 15, item.position.y - 60 - i * 10, 60, item.id + i);
                      return (
                        <path
                          key={`cloud-${i}`}
                          d={cloudPath}
                          fill="#6b7b8c"
                          opacity="0.6"
                        />
                      );
                    })}
                    <rect
                      x={item.position.x - item.size - 10}
                      y={item.position.y - item.size - 10}
                      width={item.size * 2 + 20}
                      height={item.size * 2 + 40}
                      fill="url(#rain)"
                      opacity="0.5"
                      style={{ pointerEvents: 'none' }}
                    />
                  </g>
                )}

                {/* Sinking ripples */}
                {isSinking && (
                  <g style={{ pointerEvents: 'none' }}>
                    {[1, 2, 3].map(i => (
                      <ellipse
                        key={`ripple-${i}`}
                        cx={item.position.x}
                        cy={item.position.y}
                        rx={item.size + i * 15}
                        ry={item.size * 0.3 + i * 5}
                        fill="none"
                        stroke="#6b8e9d"
                        strokeWidth="1.5"
                        opacity="0"
                      >
                        <animate
                          attributeName="opacity"
                          values="0;0.4;0"
                          dur="2s"
                          repeatCount="indefinite"
                          begin={`${i * 0.5}s`}
                        />
                        <animate
                          attributeName="rx"
                          values={`${item.size};${item.size + i * 15};${item.size + i * 20}`}
                          dur="2s"
                          repeatCount="indefinite"
                          begin={`${i * 0.5}s`}
                        />
                      </ellipse>
                    ))}
                  </g>
                )}

                {/* The island */}
                <g
                  role="button"
                  aria-label={`View details for ${item.title}`}
                  tabIndex={0}
                  className="island cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIsland(item.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedIsland(item.id);
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {/* Hit area */}
                  <circle
                    cx={item.position.x}
                    cy={item.position.y}
                    r={item.size + 20}
                    fill="transparent"
                    style={{ pointerEvents: 'all', cursor: 'pointer' }}
                  />

                  {/* Shoreline rings */}
                  {item.shorelines.map((shore, idx) => (
                    <path
                      key={`shore-${idx}`}
                      d={shore}
                      fill="none"
                      stroke="#8b7355"
                      strokeWidth="0.5"
                      opacity={isSinking ? "0.3" : "0.5"}
                      style={{ pointerEvents: 'none' }}
                    />
                  ))}

                  {/* Island body */}
                  <path
                    d={item.path}
                    fill={color}
                    stroke="#3f3320"
                    strokeWidth="2"
                    opacity={isSinking ? "0.5" : "1"}
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Terrain hatching */}
                  <path
                    d={item.path}
                    fill="url(#ink-hatching)"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Source icon */}
                  <text
                    x={item.position.x}
                    y={item.position.y - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    style={{ pointerEvents: 'none' }}
                  >
                    {getSourceIcon(item.source)}
                  </text>

                  {/* Label - full text, no truncation */}
                  <text
                    x={item.position.x}
                    y={item.position.y + item.size + 28}
                    textAnchor="middle"
                    fill="#2d2419"
                    fontSize="10"
                    fontFamily="Playfair Display"
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.title.length > 25 ? (
                      <>
                        <tspan x={item.position.x} dy="0">{item.title.slice(0, 25)}</tspan>
                        <tspan x={item.position.x} dy="12">{item.title.slice(25)}</tspan>
                      </>
                    ) : (
                      item.title
                    )}
                  </text>
                </g>
              </g>
            );
          })}

          {/* The Shipped Continent */}
          <g transform="translate(1100, 400)">
            {/* Coastline */}
            <path
              d="M 0,0 Q 30,-40 80,-50 T 180,-40 Q 230,-30 280,-10 T 350,30 Q 380,60 380,100 T 340,160 Q 300,180 240,190 T 120,190 Q 60,180 20,150 T 0,80 Z"
              fill="#8b7355"
              stroke="#3f3320"
              strokeWidth="2.5"
            />
            <path
              d="M 0,0 Q 30,-40 80,-50 T 180,-40 Q 230,-30 280,-10 T 350,30 Q 380,60 380,100 T 340,160 Q 300,180 240,190 T 120,190 Q 60,180 20,150 T 0,80 Z"
              fill="url(#ink-hatching)"
            />

            {/* Done items as ports */}
            {doneItems.slice(0, 3).map((item, idx) => (
              <g key={item.id} transform={`translate(${60 + idx * 120}, ${80 + idx * 20})`}>
                <circle cx="0" cy="0" r="5" fill="#3f3320" />
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Playfair Display"
                  fill="#2d2419"
                  fontStyle="italic"
                >
                  {item.title.slice(0, 12)}
                </text>
              </g>
            ))}

            <text
              x="190"
              y="-70"
              textAnchor="middle"
              fontFamily="Playfair Display"
              fontSize="20"
              fontWeight="bold"
              fill="#2d2419"
            >
              The Shipped Continent
            </text>
          </g>

          {/* Ithaca on the horizon */}
          <g transform="translate(1400, 200)">
            {/* Glow */}
            <circle cx="0" cy="0" r="40" fill="#f4d03f" opacity="0.3">
              <animate
                attributeName="r"
                values="35;45;35"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.4;0.2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Island */}
            <path
              d={generateIslandPath(0, 0, 25, 'ithaca')}
              fill="#c9af81"
              stroke="#8b7355"
              strokeWidth="2"
            />
            {/* Star */}
            <text
              x="0"
              y="-40"
              textAnchor="middle"
              fontSize="24"
            >
              ⭐
            </text>
            <text
              x="0"
              y="50"
              textAnchor="middle"
              fontFamily="Playfair Display"
              fontSize="16"
              fontWeight="bold"
              fill="#2d2419"
            >
              Ithaca
            </text>
            <text
              x="0"
              y="68"
              textAnchor="middle"
              fontSize="10"
              fill="#5a4a3a"
              fontStyle="italic"
            >
              Your North Star
            </text>
          </g>

          {/* Your ship */}
          <g
            data-testid="ship"
            role="button"
            aria-label="Board your ship and view crew"
            tabIndex={0}
            transform={`translate(${ship.position.x}, ${ship.position.y})`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToShip();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateToShip();
              }
            }}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Hit area */}
            <circle cx="0" cy="0" r="60" fill="transparent" style={{ pointerEvents: 'all', cursor: 'pointer' }} />

            {/* Wake trail */}
            <ellipse
              cx="0"
              cy="10"
              rx="25"
              ry="12"
              fill="none"
              stroke="#6b8e9d"
              strokeWidth="2"
              strokeDasharray="4,3"
              opacity="0.4"
              style={{ pointerEvents: 'none' }}
            >
              <animate
                attributeName="rx"
                values="25;30;25"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.2;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Detailed ship with bob animation */}
            <g style={{ pointerEvents: 'none' }}>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-3; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
              {/* Hull - more detailed */}
              <path
                d="M -22,5 Q -22,16 -10,19 Q 0,20 10,19 Q 22,16 22,5 L 18,-5 L 12,-7 L -12,-7 L -18,-5 Z"
                fill="#6b4423"
                stroke="#3f3320"
                strokeWidth="2"
              />
              {/* Hull planking detail */}
              <path
                d="M -18,5 Q -18,12 0,14 Q 18,12 18,5"
                fill="none"
                stroke="#5a3318"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M -15,2 Q -15,8 0,10 Q 15,8 15,2"
                fill="none"
                stroke="#5a3318"
                strokeWidth="0.8"
                opacity="0.4"
              />
              {/* Deck with railing */}
              <rect x="-18" y="-9" width="36" height="3" fill="#8b7355" stroke="#3f3320" strokeWidth="1" />
              <line x1="-16" y1="-9" x2="-16" y2="-12" stroke="#3f3320" strokeWidth="1" />
              <line x1="0" y1="-9" x2="0" y2="-12" stroke="#3f3320" strokeWidth="1" />
              <line x1="16" y1="-9" x2="16" y2="-12" stroke="#3f3320" strokeWidth="1" />
              {/* Mast with rigging */}
              <line x1="0" y1="-9" x2="0" y2="-40" stroke="#3f3320" strokeWidth="3" />
              <line x1="0" y1="-38" x2="-15" y2="-12" stroke="#3f3320" strokeWidth="0.8" opacity="0.5" />
              <line x1="0" y1="-38" x2="15" y2="-12" stroke="#3f3320" strokeWidth="0.8" opacity="0.5" />
              {/* Main sail with texture */}
              <path
                d="M 0,-38 Q 18,-28 18,-12 L 0,-9 Z"
                fill="#f4efe6"
                stroke="#3f3320"
                strokeWidth="1.8"
              />
              <path
                d="M 0,-38 Q 15,-30 15,-15"
                fill="none"
                stroke="#d4c5b0"
                strokeWidth="0.8"
              />
              <path
                d="M 0,-30 L 16,-22"
                fill="none"
                stroke="#d4c5b0"
                strokeWidth="0.6"
              />
              {/* Crow's nest */}
              <rect x="-3" y="-42" width="6" height="3" fill="#6b4423" stroke="#3f3320" strokeWidth="1" />
              {/* Flag with detail */}
              <path
                d="M 0,-42 L 14,-39 L 12,-36 L 0,-38 Z"
                fill="#c9524a"
                stroke="#3f3320"
                strokeWidth="0.8"
              />
              {/* Anchor detail on side */}
              <g transform="translate(-18, 0)">
                <path
                  d="M 0,-2 L 0,4 M -2,2 L 2,2"
                  stroke="#3f3320"
                  strokeWidth="1"
                  opacity="0.6"
                />
              </g>
            </g>

            <text
              x="0"
              y="40"
              textAnchor="middle"
              fill="#2d2419"
              fontSize="12"
              fontFamily="Playfair Display"
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {ship.name}
            </text>
          </g>

          {/* Vignette overlay */}
          <rect
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            fill="url(#vignette)"
            style={{ pointerEvents: 'none' }}
          />
        </svg>
      </div>

      {/* Island Detail Panel */}
      <AnimatePresence>
        {selectedWork && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2d2419] bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setSelectedIsland(null)}
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-[#f4efe6]/98 backdrop-blur-sm z-50 overflow-y-auto p-6 shadow-2xl border-l-2 border-[#8b7355]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#8b7355] uppercase tracking-wider font-sans">
                    {selectedWork.source} • {selectedWork.type}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[#2d2419] mt-1 leading-tight">
                    {selectedWork.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedIsland(null)}
                  className="text-[#5a4a3a] hover:text-[#2d2419] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-[#3f3320] mb-4 leading-relaxed">{selectedWork.description}</p>

              <div className="space-y-3 mb-6 border-t border-[#8b7355]/20 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a4a3a] font-sans">Status</span>
                  <span className="font-medium font-display capitalize">{selectedWork.status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a4a3a] font-sans">Created</span>
                  <span className="font-medium font-sans">{selectedWork.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a4a3a] font-sans">Last updated</span>
                  <span className="font-medium font-sans">{selectedWork.lastUpdated.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a4a3a] font-sans">Effort</span>
                  <span className="font-medium font-sans">{selectedWork.size}/10</span>
                </div>
              </div>

              {selectedWork.interactions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-[#2d2419] mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedWork.interactions.map((interaction) => (
                      <div key={interaction.id} className="text-sm bg-[#e8dcc7]/50 p-3 rounded border border-[#8b7355]/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span>
                            {interaction.type === 'slack-message' && '💬'}
                            {interaction.type === 'github-commit' && '⚙️'}
                            {interaction.type === 'zoom-meeting' && '📹'}
                          </span>
                          <span className="text-[#5a4a3a] text-xs font-sans">
                            {interaction.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[#3f3320]">{interaction.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-display font-semibold text-[#2d2419]">Actions</h3>
                <button
                  data-testid="action-rescue"
                  onClick={() => handleIslandAction('rescue')}
                  className="w-full px-6 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all duration-200 font-sans shadow-sm"
                  aria-label="Rescue this work item"
                >
                  ⚓ Rescue
                </button>
                <button
                  data-testid="action-done"
                  onClick={() => handleIslandAction('done')}
                  className="w-full px-6 py-3 bg-[#e8dcc7] text-[#2d2419] rounded font-medium hover:bg-[#d4c9b3] transition-all duration-200 border border-[#8b7355]/20 font-sans"
                  aria-label="Mark this work as done"
                >
                  ✓ Mark as Done
                </button>
                <button
                  data-testid="action-dismiss"
                  onClick={() => handleIslandAction('dismiss')}
                  className="w-full px-6 py-3 bg-[#e8dcc7] text-[#2d2419] rounded font-medium hover:bg-[#d4c9b3] transition-all duration-200 border border-[#8b7355]/20 font-sans"
                  aria-label="Dismiss this work item"
                >
                  🌊 Dismiss
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
