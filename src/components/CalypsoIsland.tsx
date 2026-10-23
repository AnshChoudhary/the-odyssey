import { motion } from 'framer-motion';
import { getWorkItemsByStatus } from '../data/mockData';
import { CartographicBackground } from './CartographicBackground';

export function CalypsoIsland() {
  const stuckWork = getWorkItemsByStatus('forgotten');

  return (
    <CartographicBackground title="Calypso's Island" subtitle="Work that's been forgotten or stuck">
      <div className="max-w-4xl mx-auto px-8 py-32">
        {stuckWork.length > 0 ? (
          <div className="space-y-6">
            {stuckWork.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#f4efe6] p-6 rounded border-2 border-[#8b7355] shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">
                    {item.source === 'slack' && '💬'}
                    {item.source === 'github' && '⚙️'}
                    {item.source === 'zoom' && '📹'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-[#2d2419] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5a4a3a] mb-3 font-serif">{item.description}</p>
                    <div className="flex gap-2 text-xs text-[#5a4a3a] mb-4 font-serif">
                      <span>Created: {item.createdAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Last updated: {item.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-[#6b8e9d] text-[#f4efe6] rounded text-sm font-medium hover:bg-[#5a7d8c] transition-all font-serif">
                        ⛵ Set Sail
                      </button>
                      <button className="px-4 py-2 bg-[#e8dcc7] text-[#2d2419] rounded text-sm font-medium hover:bg-[#d4c9b3] transition-all border border-[#8b7355]/30 font-serif">
                        👥 Ask Crew
                      </button>
                      <button className="px-4 py-2 bg-[#e8dcc7] text-[#2d2419] rounded text-sm font-medium hover:bg-[#d4c9b3] transition-all border border-[#8b7355]/30 font-serif">
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
            className="bg-[#f4efe6] p-12 text-center rounded border-2 border-[#8b7355] shadow-xl"
          >
            <div className="text-7xl mb-4">⚓</div>
            <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-2">
              No Stuck Work
            </h2>
            <p className="text-[#5a4a3a] font-serif">
              You haven't been stranded. All your work is active or complete!
            </p>
          </motion.div>
        )}
      </div>
    </CartographicBackground>
  );
}
