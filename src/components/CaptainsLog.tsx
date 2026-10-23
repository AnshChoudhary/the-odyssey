import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import type { CheckInCard } from '../types';
import { CartographicBackground } from './CartographicBackground';

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
    <CartographicBackground title="Captain's Log" subtitle="Weekly check-in with Athena (~2 min)">
      <div className="relative w-full h-full flex items-center justify-center pt-32">
        {/* Athena owl */}
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12 }}
          className="absolute top-40 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-7xl">🦉</div>
          <p className="text-[#5a4a3a] font-display text-xl mt-2 text-center">Athena</p>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute top-56 left-1/2 transform -translate-x-1/2 w-80">
          <div className="flex justify-between text-[#5a4a3a] text-sm mb-2 font-serif">
            <span>Entry {Math.min(currentIndex + 1, cards.length)} of {cards.length}</span>
            <span>{Math.min(currentIndex + 1, cards.length)}/{cards.length}</span>
          </div>
          <div className="w-full h-2 bg-[#d4c9b3] rounded-full overflow-hidden border border-[#8b7355]/30">
            <motion.div
              className="h-full bg-[#6b8e9d]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Logbook page */}
        <div className="relative w-[540px] h-[380px] mt-12">
          <AnimatePresence>
            {!isComplete && currentCard && (
              <motion.div
                key={currentCard.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.8, opacity: 0, rotateZ: -5 }}
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
                className="absolute inset-0 bg-[#f4efe6] p-8 rounded border-2 border-[#8b7355] shadow-2xl cursor-grab active:cursor-grabbing"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                }}
              >
                {/* Logbook header */}
                <div className="flex items-start gap-3 mb-4 border-b-2 border-[#8b7355]/30 pb-3">
                  <span className="text-5xl">{getCardIcon(currentCard.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-[#2d2419]">
                      {getCardTitle(currentCard.type)}
                    </h3>
                    <p className="text-xs text-[#5a4a3a] font-serif italic">
                      Logged {currentCard.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Entry text */}
                <p className="text-[#2d2419] text-base leading-relaxed mb-6 font-serif">
                  {currentCard.content}
                </p>

                {/* Edit mode */}
                {responses[currentCard.id] === 'not-quite' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2d2419] mb-2 font-display">
                      Add your perspective:
                    </label>
                    <textarea
                      value={edits[currentCard.id] || ''}
                      onChange={(e) => setEdits(prev => ({ ...prev, [currentCard.id]: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-[#8b7355]/30 rounded bg-[#f4efe6] focus:outline-none focus:border-[#6b8e9d] font-serif"
                      rows={3}
                      placeholder="Add context..."
                    />
                  </div>
                )}

                {/* Swipe hint */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 text-sm text-[#5a4a3a] font-serif italic">
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

          {/* Next page preview */}
          {!isComplete && currentIndex < cards.length - 1 && (
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 0.95, y: 10 }}
              className="absolute inset-0 bg-[#e8dcc7] opacity-50 -z-10 rounded border-2 border-[#8b7355]"
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
              className="px-8 py-3 bg-[#e8dcc7] text-[#2d2419] rounded font-medium hover:bg-[#d4c9b3] transition-all duration-200 border-2 border-[#8b7355]/40 font-serif shadow"
              aria-label="Mark as not quite accurate"
            >
              Not quite
            </button>
            <button
              data-testid="btn-aye"
              onClick={() => handleSwipe('right')}
              className="px-8 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all duration-200 font-serif shadow"
              aria-label="Confirm as accurate"
            >
              Aye ⚓
            </button>
          </motion.div>
        )}

        {/* Completion */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f4efe6] p-12 rounded border-2 border-[#8b7355] shadow-2xl text-center max-w-lg"
          >
            <div className="text-6xl mb-4">⚓</div>
            <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-4">
              Log Entry Complete
            </h2>
            <p className="text-[#2d2419] mb-6 font-serif">
              Your insights have been recorded. Athena will use them to keep your chart accurate.
            </p>
            <div className="bg-[#e8dcc7]/50 p-4 rounded border border-[#8b7355]/20 mb-6">
              <p className="text-sm text-[#5a4a3a] font-serif italic">
                <strong>Remember:</strong> Your corrections are private by default.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setResponses({});
                setEdits({});
              }}
              className="px-8 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif"
            >
              Review Responses
            </button>
          </motion.div>
        )}
      </div>
    </CartographicBackground>
  );
}
