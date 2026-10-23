import { motion } from 'framer-motion';
import { useState } from 'react';

export type ViewName = 
  | 'chart' 
  | 'ship' 
  | 'captains-log' 
  | 'trials' 
  | 'chapters'
  | 'calypso'
  | 'gifts'
  | 'recruit'
  | 'ports'
  | 'armada'
  | 'athena'
  | 'ithaca';

interface NavigationProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

const navItems = [
  {
    group: 'My Voyage',
    items: [
      { id: 'chart' as const, label: 'The Chart', subtitle: 'Map your work' },
      { id: 'ship' as const, label: 'Board the Ship', subtitle: 'Your crew' },
      { id: 'ithaca' as const, label: 'Ithaca North Star', subtitle: 'Goals & heading' },
    ],
  },
  {
    group: 'Check-ins',
    items: [
      { id: 'captains-log' as const, label: "Captain's Log", subtitle: 'Weekly check-in' },
      { id: 'trials' as const, label: 'Three Trials', subtitle: 'Monthly challenges' },
      { id: 'athena' as const, label: "Athena's Counsel", subtitle: 'Daily wisdom' },
    ],
  },
  {
    group: 'Crew & Fleet',
    items: [
      { id: 'recruit' as const, label: 'Recruit a Crew Member', subtitle: 'Suggested collaborators' },
      { id: 'ports' as const, label: 'Ports of Call', subtitle: 'Cross-team harbours' },
      { id: 'armada' as const, label: 'The Armada', subtitle: 'Fleet view' },
    ],
  },
  {
    group: 'Chronicle',
    items: [
      { id: 'chapters' as const, label: 'Chapters of the Epic', subtitle: 'Monthly prose' },
      { id: 'calypso' as const, label: "Calypso's Island", subtitle: 'Stuck work' },
      { id: 'gifts' as const, label: 'Gifts from the Gods', subtitle: 'Kudos chests' },
    ],
  },
];

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  return (
    <>
      {/* Compass Button - Always visible */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 left-6 z-50 w-14 h-14 rounded-full bg-ocean-700 text-parchment-50 shadow-xl hover:bg-ocean-600 transition-all duration-200 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open navigation"
      >
        ⚓
      </motion.button>

      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-parchment-200 text-ink-900 shadow-xl hover:bg-parchment-300 transition-all duration-200 flex items-center justify-center text-xl border border-ink-700 border-opacity-20 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
        onClick={() => setShowLegend(!showLegend)}
        aria-label="Show legend"
      >
        ?
      </motion.button>

      {/* Navigation Panel */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-900 bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-parchment-50 shadow-2xl z-50 overflow-y-auto parchment-texture"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-ink-900">Navigate</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-ink-700 hover:text-ink-900 text-2xl focus:outline-none"
                  aria-label="Close navigation"
                >
                  ×
                </button>
              </div>

              <nav className="space-y-6">
                {navItems.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-2">
                      {group.group}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsOpen(false);
                          }}
                          className={`compass-item w-full text-left ${
                            currentView === item.id ? 'active' : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className={`text-sm ${currentView === item.id ? 'text-parchment-200' : 'text-ink-700'}`}>
                              {item.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-ink-700 border-opacity-20">
                <p className="text-sm text-ink-700 italic">
                  "The sea does not reward those who are too anxious, too greedy, or too impatient."
                </p>
                <p className="text-xs text-ink-700 mt-2">— Anne Morrow Lindbergh</p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Legend Modal */}
      {showLegend && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-900 bg-opacity-50 z-40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLegend(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-display font-bold text-ink-900 mb-6">Legend</h2>
              
              <div className="space-y-6 text-ink-900">
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">Navigation</h3>
                  <ul className="space-y-2 text-sm">
                    <li><kbd className="px-2 py-1 bg-parchment-200 rounded text-xs">Esc</kbd> Return to The Chart</li>
                    <li><kbd className="px-2 py-1 bg-parchment-200 rounded text-xs">?</kbd> Show/hide this legend</li>
                    <li><kbd className="px-2 py-1 bg-parchment-200 rounded text-xs">⚓</kbd> Open navigation menu</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">The Chart</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Islands</span> — Your tasks and commitments (size = importance)</li>
                    <li><span className="font-medium">Stormy water</span> — Work that needs attention</li>
                    <li><span className="font-medium">Sinking islands</span> — Forgotten work (private to you)</li>
                    <li><span className="font-medium">The Shipped Continent</span> — Completed work</li>
                    <li><span className="font-medium">Dotted routes</span> — Connections to teammates</li>
                    <li><span className="font-medium">Ithaca on horizon</span> — Your Q4 goals</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">Your Privacy</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Corrections are private by default</li>
                    <li>✓ No scores, rankings, or comparisons</li>
                    <li>✓ You control what's shared in chapters</li>
                    <li>✓ Manager fleet view shows outcomes only</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowLegend(false)}
                className="btn-primary mt-6 w-full"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}
