import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile, getCrewMemberById } from '../data/mockData';
import type { Trial } from '../types';
import { CartographicBackground } from './CartographicBackground';

export function ThreeTrials() {
  const [trials, setTrials] = useState(mockUserProfile.trials);
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const [backstories, setBackstories] = useState<Record<string, string>>({});
  const [selectedCrew, setSelectedCrew] = useState<Record<string, string[]>>({});

  const selectedTrialData = trials.find(t => t.id === selectedTrial);

  const getMonsterIllustration = (monster: Trial['monster']) => {
    switch (monster) {
      case 'cyclops': return (
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" fill="#7a6d5e" stroke="#3f3320" strokeWidth="2" />
          <circle cx="50" cy="45" r="15" fill="#f4efe6" stroke="#3f3320" strokeWidth="2" />
          <circle cx="50" cy="45" r="8" fill="#2d2419" />
        </svg>
      );
      case 'poseidon': return (
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M 50,20 L 45,50 L 50,80 L 55,50 Z" fill="#6b8e9d" stroke="#3f3320" strokeWidth="2" />
          <path d="M 30,30 L 50,50 L 70,30" fill="none" stroke="#3f3320" strokeWidth="3" />
          <circle cx="40" cy="35" r="3" fill="#4db8cc" />
          <circle cx="60" cy="35" r="3" fill="#4db8cc" />
        </svg>
      );
      case 'scylla-charybdis': return (
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M 30,50 Q 30,30 50,30 Q 70,30 70,50 Q 70,70 50,70 Q 30,70 30,50" fill="#8b7355" stroke="#3f3320" strokeWidth="2" />
          <circle cx="40" cy="45" r="4" fill="#2d2419" />
          <circle cx="60" cy="45" r="4" fill="#2d2419" />
          <path d="M 35,60 Q 50,65 65,60" fill="none" stroke="#3f3320" strokeWidth="2" />
        </svg>
      );
    }
  };

  const getMonsterName = (monster: Trial['monster']) => {
    switch (monster) {
      case 'cyclops': return 'The Cyclops';
      case 'poseidon': return "Poseidon's Storm";
      case 'scylla-charybdis': return 'Scylla & Charybdis';
    }
  };

  const handleConfirmTrial = (trialId: string) => {
    setTrials(trials.map(t => 
      t.id === trialId ? { ...t, confirmed: true } : t
    ));
  };

  const handleSwapTrial = (trialId: string) => {
    console.log('Swap trial:', trialId);
  };

  const handleAddBackstory = (trialId: string, backstory: string) => {
    setTrials(trials.map(t =>
      t.id === trialId ? { ...t, backstory } : t
    ));
    setBackstories(prev => ({ ...prev, [trialId]: backstory }));
  };

  const handleTagCrew = (trialId: string, crewIds: string[]) => {
    setTrials(trials.map(t =>
      t.id === trialId ? { ...t, involvedCrew: crewIds } : t
    ));
    setSelectedCrew(prev => ({ ...prev, [trialId]: crewIds }));
  };

  const allConfirmed = trials.every(t => t.confirmed);

  return (
    <CartographicBackground title={`The Three Trials of ${trials[0]?.month}`} subtitle="Epic monsters representing your greatest challenges">
      <div className="relative w-full h-full pt-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {trials.map((trial, index) => (
              <motion.div
                key={trial.id}
                data-testid={`trial-${trial.id}`}
                role="button"
                aria-label={`View details for ${trial.title}`}
                tabIndex={0}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="bg-[#f4efe6] p-6 rounded border-2 border-[#8b7355] cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedTrial(trial.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTrial(trial.id);
                  }
                }}
              >
                {/* Monster illustration */}
                <div className="flex justify-center mb-4">
                  {getMonsterIllustration(trial.monster)}
                </div>

                <h3 className="font-display text-xl font-bold text-[#2d2419] text-center mb-2">
                  {trial.title}
                </h3>
                <p className="text-sm text-[#5a4a3a] text-center mb-3 font-serif italic">
                  {getMonsterName(trial.monster)}
                </p>
                <p className="text-sm text-[#3f3320] text-center mb-4 font-serif">
                  {trial.description}
                </p>

                <div className="flex items-center justify-center gap-2">
                  {trial.confirmed ? (
                    <span className="text-xs px-3 py-1 bg-[#6b8e9d] text-[#f4efe6] rounded-full font-serif">
                      ⚓ Confirmed
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 bg-[#e8dcc7] text-[#2d2419] rounded-full border border-[#8b7355]/30 font-serif">
                      Review needed
                    </span>
                  )}
                </div>

                {trial.involvedCrew.length > 0 && (
                  <div className="mt-4 flex justify-center gap-2">
                    {trial.involvedCrew.slice(0, 3).map(crewId => {
                      const member = getCrewMemberById(crewId);
                      return member ? (
                        <span key={crewId} className="text-2xl" title={member.name}>
                          {member.avatar}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {allConfirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <button className="px-12 py-4 bg-[#6b8e9d] text-[#f4efe6] rounded text-lg font-medium hover:bg-[#5a7d8c] transition-all font-serif shadow-lg">
                Generate This Month's Chapter ⚓
              </button>
              <p className="text-[#5a4a3a] text-sm mt-4 font-serif italic">
                Your trials will be woven into an epic tale
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trial Detail Panel */}
      <AnimatePresence>
        {selectedTrialData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2d2419] bg-opacity-70 z-40 backdrop-blur-sm"
              onClick={() => setSelectedTrial(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#f4efe6] p-8 z-50 max-h-[80vh] overflow-y-auto rounded border-2 border-[#8b7355] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="mb-4">{getMonsterIllustration(selectedTrialData.monster)}</div>
                  <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-2">
                    {selectedTrialData.title}
                  </h2>
                  <p className="text-[#5a4a3a] font-serif italic">{getMonsterName(selectedTrialData.monster)}</p>
                </div>
                <button
                  onClick={() => setSelectedTrial(null)}
                  className="text-[#5a4a3a] hover:text-[#2d2419] text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-[#2d2419] mb-6 font-serif">{selectedTrialData.description}</p>

              <div className="mb-6">
                <label className="block font-display font-semibold text-[#2d2419] mb-2">
                  Add backstory (optional)
                </label>
                <textarea
                  value={backstories[selectedTrialData.id] || selectedTrialData.backstory || ''}
                  onChange={(e) => setBackstories(prev => ({ ...prev, [selectedTrialData.id]: e.target.value }))}
                  onBlur={(e) => handleAddBackstory(selectedTrialData.id, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#8b7355]/30 rounded focus:outline-none focus:border-[#6b8e9d] bg-[#f4efe6] font-serif"
                  rows={4}
                  placeholder="Describe how this challenge emerged..."
                />
              </div>

              <div className="mb-6">
                <label className="block font-display font-semibold text-[#2d2419] mb-2">
                  Tag crew members involved
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockUserProfile.crew.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        const current = selectedCrew[selectedTrialData.id] || selectedTrialData.involvedCrew;
                        const newSelection = current.includes(member.id)
                          ? current.filter(id => id !== member.id)
                          : [...current, member.id];
                        handleTagCrew(selectedTrialData.id, newSelection);
                      }}
                      className={`flex items-center gap-2 p-2 rounded border-2 transition-all font-serif ${
                        (selectedCrew[selectedTrialData.id] || selectedTrialData.involvedCrew).includes(member.id)
                          ? 'bg-[#6b8e9d] text-[#f4efe6] border-[#6b8e9d]'
                          : 'bg-[#e8dcc7] text-[#2d2419] border-[#8b7355]/30'
                      }`}
                    >
                      <span className="text-xl">{member.avatar}</span>
                      <span className="text-sm">{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {!selectedTrialData.confirmed ? (
                  <>
                    <button
                      data-testid="btn-confirm-trial"
                      onClick={() => {
                        handleConfirmTrial(selectedTrialData.id);
                        setSelectedTrial(null);
                      }}
                      className="flex-1 px-6 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif"
                      aria-label="Confirm this trial"
                    >
                      ⚓ Confirm This Trial
                    </button>
                    <button
                      data-testid="btn-swap-trial"
                      onClick={() => handleSwapTrial(selectedTrialData.id)}
                      className="flex-1 px-6 py-3 bg-[#e8dcc7] text-[#2d2419] rounded font-medium hover:bg-[#d4c9b3] transition-all border-2 border-[#8b7355]/30 font-serif"
                      aria-label="Swap for a different challenge"
                    >
                      Swap Challenge
                    </button>
                  </>
                ) : (
                  <button
                    data-testid="btn-close-trial"
                    onClick={() => setSelectedTrial(null)}
                    className="w-full px-6 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif"
                    aria-label="Close trial details"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CartographicBackground>
  );
}
