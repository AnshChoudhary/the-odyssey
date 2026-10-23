import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import { CartographicBackground } from './CartographicBackground';

export function Gifts() {
  const [kudos, setKudos] = useState(mockUserProfile.kudos);

  const handleOpenChest = (id: string) => {
    setKudos(kudos.map(k => k.id === id ? { ...k, isOpened: true } : k));
  };

  return (
    <CartographicBackground title="Gifts from the Gods" subtitle="Recognition from your crew — treasure to celebrate">
      <div className="max-w-5xl mx-auto px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kudos.map((chest, index) => (
            <motion.div
              key={chest.id}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#f4efe6] p-6 text-center rounded border-2 border-[#8b7355] shadow-lg"
            >
              <AnimatePresence mode="wait">
                {!chest.isOpened ? (
                  <motion.div
                    key="closed"
                    initial={{ scale: 1 }}
                    exit={{ scale: 0, rotateZ: 180 }}
                  >
                    <div className="text-7xl mb-4 cursor-pointer hover:scale-110 transition-transform"
                         onClick={() => handleOpenChest(chest.id)}>
                      🎁
                    </div>
                    <p className="text-sm text-[#5a4a3a] font-display">From {chest.from}</p>
                    <p className="text-xs text-[#5a4a3a] mt-1 font-serif">{chest.date.toLocaleDateString()}</p>
                    <button
                      data-testid={`btn-open-chest-${chest.id}`}
                      onClick={() => handleOpenChest(chest.id)}
                      className="px-4 py-2 bg-[#6b8e9d] text-[#f4efe6] rounded text-sm font-medium hover:bg-[#5a7d8c] transition-all mt-4 font-serif"
                      aria-label={`Open gift from ${chest.from}`}
                    >
                      Open Chest
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="opened"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <div className="text-6xl mb-4">⭐</div>
                    <p className="text-sm font-medium text-[#5a4a3a] mb-2 font-display">From {chest.from}</p>
                    <div className="bg-[#e8dcc7]/50 p-4 rounded border border-[#8b7355]/20 mb-3">
                      <p className="text-sm text-[#2d2419] italic font-serif">"{chest.message}"</p>
                    </div>
                    <p className="text-xs text-[#5a4a3a] font-serif">{chest.date.toLocaleDateString()}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </CartographicBackground>
  );
}
