import { motion } from 'framer-motion';
import { getWorkItemsByStatus } from '../data/mockData';

export function CalypsoIsland() {
  const stuckWork = getWorkItemsByStatus('forgotten');

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-ocean-900 via-ocean-700 to-ocean-500">
      <div className="max-w-4xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-parchment-200 mb-4">
            Work that's been forgotten or stuck — set sail, ask crew, or let go
          </p>
          <div className="text-6xl mb-4">🏝️</div>
          <h1 className="font-display text-5xl font-bold text-parchment-50">
            Calypso's Island
          </h1>
        </motion.div>

        {stuckWork.length > 0 ? (
          <div className="space-y-6">
            {stuckWork.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">
                    {item.source === 'slack' && '💬'}
                    {item.source === 'github' && '⚙️'}
                    {item.source === 'zoom' && '📹'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-ink-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-ink-700 mb-3">{item.description}</p>
                    <div className="flex gap-2 text-xs text-ink-700 mb-4">
                      <span>Created: {item.createdAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Last updated: {item.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-primary text-sm">
                        ⛵ Set Sail (restart)
                      </button>
                      <button className="btn-secondary text-sm">
                        👥 Ask Crew for Help
                      </button>
                      <button className="btn-secondary text-sm">
                        🌊 Let Go
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 text-center"
          >
            <div className="text-6xl mb-4">⚓</div>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
              No Stuck Work
            </h2>
            <p className="text-ink-700">
              You haven't been stranded on Calypso's Island. All your work is active or complete!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
