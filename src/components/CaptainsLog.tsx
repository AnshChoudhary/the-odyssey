import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import type { CheckInCard } from '../types';

export function CaptainsLog() {
  const [cards] = useState(mockUserProfile.checkIns);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [responses, setResponses] = useState<Record<string, CheckInCard['userResponse']>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});

  const currentCard = cards[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    const response = direction === 'right' ? 'aye' : 'not-quite';
    setResponses(prev => ({ ...prev, [currentCard.id]: response }));
    setExitDirection(direction);
    
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);
      }
    }, 300);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const getCardIcon = (type: CheckInCard['type']) => {
    switch (type) {
      case 'work-item': return '🗺️';
      case 'crew-kudos': return '⭐';
      case 'siren-distraction': return '🌊';
      case 'ithaca-coaching': return '🎯';
    }
  };

  const getCardTitle = (type: CheckInCard['type']) => {
    switch (type) {
      case 'work-item': return 'Voyage Progress';
      case 'crew-kudos': return 'Crew Recognition';
      case 'siren-distraction': return "Siren's Call";
      case 'ithaca-coaching': return "Athena's Wisdom";
    }
  };

  const isComplete = currentIndex >= cards.length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-700 to-ink-900">
      {/* View title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 glass-panel px-6 py-3"
      >
        <p className="text-sm text-ink-900 text-center">
          Weekly check-in with Athena (~2 min) — swipe right for "Aye", left for "Not quite"
        </p>
      </motion.div>

      {/* Athena figure */}
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 12 }}
        className="absolute top-32 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-6xl">🦉</div>
        <p className="text-parchment-100 font-display text-lg mt-2 text-center">Athena</p>
      </motion.div>

      {/* Progress indicator */}
      <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-64">
        <div className="flex justify-between text-parchment-200 text-sm mb-2">
          <span>Progress</span>
          <span>{Math.min(currentIndex + 1, cards.length)}/{cards.length}</span>
        </div>
        <div className="w-full h-2 bg-ocean-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-parchment-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="absolute top-64 left-1/2 transform -translate-x-1/2 w-[480px] h-[320px]">
        <AnimatePresence>
          {!isComplete && currentCard && (
            <motion.div
              key={currentCard.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.8, opacity: 0, rotateZ: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateZ: 0,
                x: exitDirection === 'right' ? 1000 : exitDirection === 'left' ? -1000 : 0
              }}
              exit={{ 
                x: exitDirection === 'right' ? 1000 : -1000, 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute inset-0 glass-panel p-8 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{getCardIcon(currentCard.type)}</span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">
                    {getCardTitle(currentCard.type)}
                  </h3>
                  <p className="text-xs text-ink-700">
                    {currentCard.date.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-ink-900 text-lg leading-relaxed mb-6">
                {currentCard.content}
              </p>

              {/* Edit mode for "not quite" */}
              {responses[currentCard.id] === 'not-quite' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    Add your perspective:
                  </label>
                  <textarea
                    value={edits[currentCard.id] || ''}
                    onChange={(e) => setEdits(prev => ({ ...prev, [currentCard.id]: e.target.value }))}
                    className="w-full px-3 py-2 border border-ink-700 border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-parchment-50"
                    rows={3}
                    placeholder="Share more context..."
                  />
                </div>
              )}

              {/* Swipe hint */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 text-sm text-ink-700">
                <div className="flex items-center gap-2">
                  <span>←</span>
                  <span>Not quite</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Aye</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next card preview */}
        {!isComplete && currentIndex < cards.length - 1 && (
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 0.95, y: 10 }}
            className="absolute inset-0 glass-panel opacity-50 -z-10"
          />
        )}
      </div>

      {/* Action buttons */}
      {!isComplete && currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-4 z-50"
        >
          <button
            data-testid="btn-not-quite"
            onClick={() => handleSwipe('left')}
            className="px-8 py-3 bg-parchment-200 text-ink-900 rounded-lg font-medium hover:bg-parchment-300 transition-all duration-200 border border-ink-700 border-opacity-20 focus:outline-none focus:ring-2 focus:ring-ocean-500"
            aria-label="Mark as not quite accurate"
          >
            Not quite
          </button>
          <button
            data-testid="btn-aye"
            onClick={() => handleSwipe('right')}
            className="px-8 py-3 bg-ocean-700 text-parchment-50 rounded-lg font-medium hover:bg-ocean-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
            aria-label="Confirm as accurate"
          >
            Aye ⚓
          </button>
        </motion.div>
      )}

      {/* Completion state */}
      {isComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-panel p-12 text-center max-w-lg"
        >
          <div className="text-6xl mb-4">⚓</div>
          <h2 className="font-display text-3xl font-bold text-ink-900 mb-4">
            Check-in Complete
          </h2>
          <p className="text-ink-900 mb-6">
            Your insights have been recorded. Athena will use them to keep your chart accurate and offer timely counsel.
          </p>
          <div className="bg-parchment-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-ink-700">
              <strong>Remember:</strong> Your corrections are private by default. They help refine the map without being shared unless you choose to.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setResponses({});
              setEdits({});
            }}
            className="btn-primary"
          >
            Review Responses
          </button>
        </motion.div>
      )}

      {/* Background waves */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#f9f6ed"
          fillOpacity="1"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}
