import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';

export function Gifts() {
  const [kudos, setKudos] = useState(mockUserProfile.kudos);

  const handleOpenChest = (id: string) => {
    setKudos(kudos.map(k => k.id === id ? { ...k, isOpened: true } : k));
  };

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-parchment-100 to-parchment-200 parchment-texture">
      <div className="max-w-5xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-ink-700 mb-4">
            Recognition from your crew — treasure to celebrate
          </p>
          <h1 className="font-display text-5xl font-bold text-ink-900">
            Gifts from the Gods
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kudos.map((chest, index) => (
            <motion.div
              key={chest.id}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.15 }}
              className="glass-panel p-6 text-center"
            >
              <AnimatePresence mode="wait">
                {!chest.isOpened ? (
                  <motion.div
                    key="closed"
                    initial={{ scale: 1 }}
                    exit={{ scale: 0, rotateZ: 180 }}
                  >
                    <div className="text-6xl mb-4 cursor-pointer hover:scale-110 transition-transform"
                         onClick={() => handleOpenChest(chest.id)}>
                      🎁
                    </div>
                    <p className="text-sm text-ink-700">From {chest.from}</p>
                    <p className="text-xs text-ink-700 mt-1">{chest.date.toLocaleDateString()}</p>
                    <button
                      onClick={() => handleOpenChest(chest.id)}
                      className="btn-primary text-sm mt-4"
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
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="text-sm font-medium text-ink-700 mb-2">From {chest.from}</p>
                    <div className="bg-parchment-100 p-4 rounded-lg mb-3">
                      <p className="text-sm text-ink-900 italic">"{chest.message}"</p>
                    </div>
                    <p className="text-xs text-ink-700">{chest.date.toLocaleDateString()}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
