import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkItem } from '../types';
import { mockUserProfile, getWorkItemById } from '../data/mockData';

interface ChartProps {
  onNavigateToShip: () => void;
}

export function TheChart({ onNavigateToShip }: ChartProps) {
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const workItems = mockUserProfile.workItems;
  const ship = mockUserProfile.ship;
  const selectedWork = selectedIsland ? getWorkItemById(selectedIsland) : null;

  // Pan handlers
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

  // Zoom handlers
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
    
    // In a real app, this would update the backend
    console.log(`Action ${action} on work item:`, selectedWork.id);
    setSelectedIsland(null);
    
    // Animate the change
    // For now, just close the panel
  };

  const getIslandColor = (status: WorkItem['status']) => {
    switch (status) {
      case 'active': return '#4db8cc';
      case 'needs-attention': return '#e07a5f';
      case 'forgotten': return '#81b29a';
      case 'done': return '#3d5a80';
    }
  };

  const getIslandSize = (size: number) => {
    return 30 + size * 5;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-ocean-100 via-ocean-300 to-ocean-500">
      {/* View title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 glass-panel px-6 py-3"
      >
        <p className="text-sm text-ink-900 text-center">
          Your living map of work — pan with mouse, zoom with scroll, click islands for details
        </p>
      </motion.div>

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
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '50% 50%',
          }}
        >
          <defs>
            {/* Water texture pattern */}
            <pattern id="water" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M0 50 Q 25 45, 50 50 T 100 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              >
                <animate
                  attributeName="d"
                  values="M0 50 Q 25 45, 50 50 T 100 50;M0 50 Q 25 55, 50 50 T 100 50;M0 50 Q 25 45, 50 50 T 100 50"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </pattern>

            {/* Stormy water for needs-attention items */}
            <filter id="turbulence">
              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2">
                <animate
                  attributeName="baseFrequency"
                  values="0.05;0.08;0.05"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="10" />
            </filter>
          </defs>

          {/* Background water */}
          <rect x="0" y="0" width="2000" height="2000" fill="url(#water)" opacity="0.3" />

          {/* Routes to teammates (dotted lines) */}
          {mockUserProfile.crew.slice(0, 3).map((crew, idx) => (
            <line
              key={crew.id}
              x1={ship.position.x}
              y1={ship.position.y}
              x2={ship.position.x + (idx + 1) * 150}
              y2={ship.position.y - (idx + 1) * 80}
              stroke="#2a6b7a"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.4"
            />
          ))}

          {/* Islands (work items) */}
          {workItems.map((item) => {
            const size = getIslandSize(item.size);
            const color = getIslandColor(item.status);
            const isStormyWater = item.status === 'needs-attention';

            return (
              <g key={item.id} data-testid={`island-${item.id}`}>
                {/* Stormy water around urgent items */}
                {isStormyWater && (
                  <circle
                    cx={item.position.x}
                    cy={item.position.y}
                    r={size + 20}
                    fill="rgba(224, 122, 95, 0.2)"
                    filter="url(#turbulence)"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* The island - clickable group */}
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
                  {/* Larger invisible hit area */}
                  <circle
                    cx={item.position.x}
                    cy={item.position.y}
                    r={size + 15}
                    fill="transparent"
                    style={{ pointerEvents: 'all', cursor: 'pointer' }}
                  />

                  {/* Island shadow */}
                  <ellipse
                    cx={item.position.x}
                    cy={item.position.y + size * 0.8}
                    rx={size * 0.8}
                    ry={size * 0.3}
                    fill="rgba(26, 64, 72, 0.3)"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Island body */}
                  <circle
                    cx={item.position.x}
                    cy={item.position.y}
                    r={size}
                    fill={color}
                    stroke="#1a4048"
                    strokeWidth="2"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Sinking visual for forgotten items */}
                  {item.status === 'forgotten' && (
                    <>
                      <circle
                        cx={item.position.x}
                        cy={item.position.y + size * 0.4}
                        r={size * 0.3}
                        fill="rgba(26, 64, 72, 0.5)"
                        style={{ pointerEvents: 'none' }}
                      />
                      <text
                        x={item.position.x}
                        y={item.position.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="20"
                        style={{ pointerEvents: 'none' }}
                      >
                        💤
                      </text>
                    </>
                  )}

                  {/* Source icon */}
                  <text
                    x={item.position.x}
                    y={item.position.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="24"
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.source === 'slack' && '💬'}
                    {item.source === 'github' && '⚙️'}
                    {item.source === 'zoom' && '📹'}
                  </text>

                  {/* Label */}
                  <text
                    x={item.position.x}
                    y={item.position.y + size + 20}
                    textAnchor="middle"
                    fill="#1a1512"
                    fontSize="12"
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.title.slice(0, 20)}
                    {item.title.length > 20 && '...'}
                  </text>
                </g>
              </g>
            );
          })}

          {/* The Shipped Continent (done work) */}
          <g transform="translate(750, 250)">
            <ellipse
              cx="0"
              cy="0"
              rx="180"
              ry="120"
              fill="#3d5a80"
              stroke="#1a4048"
              strokeWidth="3"
            />
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
              fontFamily="Playfair Display"
            >
              The Shipped
            </text>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
              fontFamily="Playfair Display"
            >
              Continent
            </text>
          </g>

          {/* Ithaca on the horizon (goals) */}
          <g transform="translate(1200, 100)">
            <circle cx="0" cy="0" r="60" fill="#c9af81" stroke="#1a4048" strokeWidth="2" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#1a1512"
              fontSize="20"
              fontWeight="bold"
              fontFamily="Playfair Display"
            >
              Ithaca
            </text>
            <text
              x="0"
              y="-75"
              textAnchor="middle"
              fill="#1a1512"
              fontSize="12"
              opacity="0.7"
            >
              ⭐ Your North Star
            </text>
          </g>

          {/* Your ship */}
          <g
            data-testid="ship"
            role="button"
            aria-label="Board your ship and view crew"
            tabIndex={0}
            className="ship cursor-pointer"
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
            {/* Larger invisible hit area */}
            <circle cx="0" cy="0" r="60" fill="transparent" style={{ pointerEvents: 'all', cursor: 'pointer' }} />
            
            <circle cx="0" cy="0" r="40" fill="#8b4513" stroke="#1a4048" strokeWidth="3" style={{ pointerEvents: 'none' }} />
            <polygon points="0,-30 -15,0 0,10 15,0" fill="#f9f6ed" stroke="#1a4048" strokeWidth="2" style={{ pointerEvents: 'none' }} />
            <text
              x="0"
              y="60"
              textAnchor="middle"
              fill="#1a1512"
              fontSize="14"
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              {ship.name}
            </text>
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="white"
              fontSize="24"
              style={{ pointerEvents: 'none' }}
            >
              🚢
            </text>
          </g>
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
              className="fixed inset-0 bg-ink-900 bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setSelectedIsland(null)}
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-96 glass-panel z-50 overflow-y-auto p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-ocean-700 uppercase tracking-wider">
                    {selectedWork.source} • {selectedWork.type}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-ink-900 mt-1">
                    {selectedWork.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedIsland(null)}
                  className="text-ink-700 hover:text-ink-900 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-ink-900 mb-4">{selectedWork.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Status</span>
                  <span className="font-medium capitalize">{selectedWork.status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Created</span>
                  <span className="font-medium">{selectedWork.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Last updated</span>
                  <span className="font-medium">{selectedWork.lastUpdated.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Size</span>
                  <span className="font-medium">{selectedWork.size}/10</span>
                </div>
              </div>

              {selectedWork.interactions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-ink-900 mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedWork.interactions.map((interaction) => (
                      <div key={interaction.id} className="text-sm bg-parchment-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span>
                            {interaction.type === 'slack-message' && '💬'}
                            {interaction.type === 'github-commit' && '⚙️'}
                            {interaction.type === 'zoom-meeting' && '📹'}
                          </span>
                          <span className="text-ink-700 text-xs">
                            {interaction.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-ink-900">{interaction.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-ink-900">Actions</h3>
                <button
                  data-testid="action-rescue"
                  onClick={() => handleIslandAction('rescue')}
                  className="btn-primary w-full"
                  aria-label="Rescue this work item"
                >
                  ⚓ Rescue (move closer, prioritize)
                </button>
                <button
                  data-testid="action-done"
                  onClick={() => handleIslandAction('done')}
                  className="btn-secondary w-full"
                  aria-label="Mark this work as done"
                >
                  ✓ Mark as Done
                </button>
                <button
                  data-testid="action-dismiss"
                  onClick={() => handleIslandAction('dismiss')}
                  className="btn-secondary w-full"
                  aria-label="Dismiss this work item"
                >
                  🌊 Dismiss (let drift)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
