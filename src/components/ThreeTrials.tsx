import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile, getCrewMemberById } from '../data/mockData';
import type { Trial } from '../types';

export function ThreeTrials() {
  const [trials, setTrials] = useState(mockUserProfile.trials);
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const [backstories, setBackstories] = useState<Record<string, string>>({});
  const [selectedCrew, setSelectedCrew] = useState<Record<string, string[]>>({});

  const selectedTrialData = trials.find(t => t.id === selectedTrial);

  const getMonsterImage = (monster: Trial['monster']) => {
    switch (monster) {
      case 'cyclops': return '👁️';
      case 'poseidon': return '🔱';
      case 'scylla-charybdis': return '🌪️';
    }
  };

  const getMonsterName = (monster: Trial['monster']) => {
    switch (monster) {
      case 'cyclops': return 'The Cyclops';
      case 'poseidon': return "Poseidon's Storm";
      case 'scylla-charybdis': return 'Scylla & Charybdis';
    }
  };

  const getMonsterDescription = (monster: Trial['monster']) => {
    switch (monster) {
      case 'cyclops': return 'A singular, massive challenge requiring focused strength';
      case 'poseidon': return 'Forces beyond your control creating chaos';
      case 'scylla-charybdis': return 'Two terrible choices with no clear right answer';
    }
  };

  const handleConfirmTrial = (trialId: string) => {
    setTrials(trials.map(t => 
      t.id === trialId ? { ...t, confirmed: true } : t
    ));
  };

  const handleSwapTrial = (trialId: string) => {
    // In a real app, this would open a dialog to select a different challenge
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-ink-900 via-ocean-900 to-ink-800">
      {/* View title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 glass-panel px-6 py-3"
      >
        <p className="text-sm text-ink-900 text-center">
          Three Trials — identify your month's biggest challenges as epic monsters
        </p>
      </motion.div>

      {/* Trials Grid */}
      <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-4xl font-bold text-parchment-100 text-center mb-12"
        >
          The Three Trials of {trials[0]?.month}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trials.map((trial, index) => (
            <motion.div
              key={trial.id}
              data-testid={`trial-${trial.id}`}
              role="button"
              aria-label={`View details for ${trial.title}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-panel p-6 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedTrial(trial.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedTrial(trial.id);
                }
              }}
            >
              {/* Monster icon */}
              <div className="text-6xl text-center mb-4 filter drop-shadow-lg">
                {getMonsterImage(trial.monster)}
              </div>

              {/* Trial info */}
              <h3 className="font-display text-xl font-bold text-ink-900 text-center mb-2">
                {trial.title}
              </h3>
              <p className="text-sm text-ink-700 text-center mb-4">
                {getMonsterName(trial.monster)}
              </p>
              <p className="text-sm text-ink-900 text-center mb-4">
                {trial.description}
              </p>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2">
                {trial.confirmed ? (
                  <span className="text-xs px-3 py-1 bg-ocean-700 text-parchment-50 rounded-full">
                    ⚓ Confirmed
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 bg-parchment-200 text-ink-900 rounded-full">
                    Review needed
                  </span>
                )}
              </div>

              {/* Crew tags */}
              {trial.involvedCrew.length > 0 && (
                <div className="mt-4 flex justify-center gap-2">
                  {trial.involvedCrew.slice(0, 3).map(crewId => {
                    const member = getCrewMemberById(crewId);
                    return member ? (
                      <span key={crewId} className="text-xl" title={member.name}>
                        {member.avatar}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Complete button */}
        {allConfirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 text-center"
          >
            <button className="btn-primary text-lg px-12 py-4">
              Generate This Month's Chapter ⚓
            </button>
            <p className="text-parchment-200 text-sm mt-4">
              Your trials will be woven into an epic tale
            </p>
          </motion.div>
        )}
      </div>

      {/* Trial Detail Panel */}
      <AnimatePresence>
        {selectedTrialData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900 bg-opacity-70 z-40 backdrop-blur-sm"
              onClick={() => setSelectedTrial(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl glass-panel p-8 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-5xl mb-4">{getMonsterImage(selectedTrialData.monster)}</div>
                  <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
                    {selectedTrialData.title}
                  </h2>
                  <p className="text-ink-700">{getMonsterName(selectedTrialData.monster)}</p>
                </div>
                <button
                  onClick={() => setSelectedTrial(null)}
                  className="text-ink-700 hover:text-ink-900 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-parchment-100 p-4 rounded-lg mb-6">
                <p className="text-sm text-ink-700 italic">
                  {getMonsterDescription(selectedTrialData.monster)}
                </p>
              </div>

              <p className="text-ink-900 mb-6">{selectedTrialData.description}</p>

              {/* Backstory */}
              <div className="mb-6">
                <label className="block font-semibold text-ink-900 mb-2">
                  Add backstory (optional)
                </label>
                <p className="text-xs text-ink-700 mb-2">
                  What led to this challenge? This helps generate a richer chapter.
                </p>
                <textarea
                  value={backstories[selectedTrialData.id] || selectedTrialData.backstory || ''}
                  onChange={(e) => setBackstories(prev => ({ ...prev, [selectedTrialData.id]: e.target.value }))}
                  onBlur={(e) => handleAddBackstory(selectedTrialData.id, e.target.value)}
                  className="w-full px-3 py-2 border border-ink-700 border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-parchment-50"
                  rows={4}
                  placeholder="Describe how this challenge emerged..."
                />
              </div>

              {/* Tag crew */}
              <div className="mb-6">
                <label className="block font-semibold text-ink-900 mb-2">
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
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        (selectedCrew[selectedTrialData.id] || selectedTrialData.involvedCrew).includes(member.id)
                          ? 'bg-ocean-700 text-parchment-50 border-ocean-700'
                          : 'bg-parchment-100 text-ink-900 border-ink-700 border-opacity-20'
                      }`}
                    >
                      <span className="text-xl">{member.avatar}</span>
                      <span className="text-sm">{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!selectedTrialData.confirmed ? (
                  <>
                    <button
                      data-testid="btn-confirm-trial"
                      onClick={() => {
                        handleConfirmTrial(selectedTrialData.id);
                        setSelectedTrial(null);
                      }}
                      className="btn-primary flex-1"
                      aria-label="Confirm this trial"
                    >
                      ⚓ Confirm This Trial
                    </button>
                    <button
                      data-testid="btn-swap-trial"
                      onClick={() => handleSwapTrial(selectedTrialData.id)}
                      className="btn-secondary flex-1"
                      aria-label="Swap for a different challenge"
                    >
                      Swap for Different Challenge
                    </button>
                  </>
                ) : (
                  <button
                    data-testid="btn-close-trial"
                    onClick={() => setSelectedTrial(null)}
                    className="btn-primary w-full"
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

      {/* Background storm effects */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(77, 184, 204, 0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
