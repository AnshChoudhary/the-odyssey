import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile, getCrewMemberById } from '../data/mockData';
import type { CrewMember } from '../types';

export function BoardTheShip() {
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const crew = mockUserProfile.crew;
  const selectedMember = selectedCrew ? getCrewMemberById(selectedCrew) : null;

  const getRoleIcon = (role: CrewMember['role']) => {
    switch (role) {
      case 'first-mate': return '⚓';
      case 'navigator': return '🧭';
      case 'quartermaster': return '📦';
      case 'lookout': return '🔭';
      case 'deckhand': return '⛵';
    }
  };

  const getRoleName = (role: CrewMember['role']) => {
    switch (role) {
      case 'first-mate': return 'First Mate';
      case 'navigator': return 'Navigator';
      case 'quartermaster': return 'Quartermaster';
      case 'lookout': return 'Lookout';
      case 'deckhand': return 'Deckhand';
    }
  };

  const getRoleAction = (role: CrewMember['role']) => {
    switch (role) {
      case 'first-mate': return 'Charting the course';
      case 'navigator': return 'Reading the stars';
      case 'quartermaster': return 'Managing supplies';
      case 'lookout': return 'Scanning horizons';
      case 'deckhand': return 'Tending the rigging';
    }
  };

  const crewPositions = [
    { x: '25%', y: '45%' },
    { x: '50%', y: '35%' },
    { x: '75%', y: '45%' },
    { x: '35%', y: '65%' },
    { x: '65%', y: '65%' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-parchment-100 to-parchment-200 parchment-texture">
      {/* View title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 glass-panel px-6 py-3"
      >
        <p className="text-sm text-ink-900 text-center">
          Your crew — click a member to see your bond and recent interactions
        </p>
      </motion.div>

      {/* Ship Deck Background */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Deck planks */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
          <defs>
            <pattern id="planks" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <rect width="100" height="18" fill="#8b4513" />
              <rect width="100" height="2" y="18" fill="#654321" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#planks)" />
        </svg>

        {/* Ship wheel decoration */}
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-32 opacity-10"
        >
          <div className="text-[12rem] select-none">⚓</div>
        </motion.div>

        {/* Crew Members */}
        <div className="relative w-full h-full">
          {crew.map((member, index) => (
            <motion.div
              key={member.id}
              data-testid={`crew-${member.id}`}
              role="button"
              aria-label={`View details for ${member.name}, ${getRoleName(member.role)}`}
              tabIndex={0}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.15, type: 'spring', damping: 12 }}
              style={{
                position: 'absolute',
                left: crewPositions[index].x,
                top: crewPositions[index].y,
                transform: 'translate(-50%, -50%)',
              }}
              className="cursor-pointer group"
              onClick={() => setSelectedCrew(member.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCrew(member.id);
                }
              }}
            >
              {/* Action indicator */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-ink-700 bg-parchment-100 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {getRoleAction(member.role)}
                </span>
              </motion.div>

              {/* Crew member avatar */}
              <div className="relative">
                {/* Bond strength ring */}
                <svg className="absolute -inset-3" width="100" height="100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#4db8cc"
                    strokeWidth="4"
                    strokeDasharray={`${member.bondStrength * 2.64} 264`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Avatar circle */}
                <div className="w-20 h-20 rounded-full bg-ocean-700 flex items-center justify-center text-4xl border-4 border-parchment-50 shadow-xl group-hover:scale-110 transition-transform">
                  {member.avatar}
                </div>

                {/* Role badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-parchment-50 border-2 border-ocean-700 flex items-center justify-center text-xl shadow-lg">
                  {getRoleIcon(member.role)}
                </div>
              </div>

              {/* Name label */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                <div className="font-display font-semibold text-ink-900">{member.name}</div>
                <div className="text-xs text-ink-700">{getRoleName(member.role)}</div>
              </div>

              {/* Bond strength indicator */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ocean-700 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                {member.bondStrength}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Crew Member Detail Panel */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900 bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setSelectedCrew(null)}
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-96 glass-panel z-50 overflow-y-auto p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-ocean-700 flex items-center justify-center text-4xl">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-ink-900">
                      {selectedMember.name}
                    </h2>
                    <p className="text-ink-700">{getRoleName(selectedMember.role)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCrew(null)}
                  className="text-ink-700 hover:text-ink-900 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Bond Strength */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-ink-900">Bond Strength</span>
                  <span className="text-2xl font-bold text-ocean-700">{selectedMember.bondStrength}</span>
                </div>
                <div className="w-full h-3 bg-parchment-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedMember.bondStrength}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-ocean-500 to-ocean-700 rounded-full"
                  />
                </div>
                <p className="text-xs text-ink-700 mt-2">
                  {selectedMember.bondStrength >= 80 && 'Strong partnership — you collaborate frequently and effectively'}
                  {selectedMember.bondStrength >= 60 && selectedMember.bondStrength < 80 && 'Good working relationship — regular collaboration'}
                  {selectedMember.bondStrength < 60 && 'Growing connection — room to strengthen this partnership'}
                </p>
              </div>

              {/* Recent Interactions */}
              <div className="mb-6">
                <h3 className="font-semibold text-ink-900 mb-3">Recent Interactions</h3>
                {selectedMember.recentInteractions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMember.recentInteractions.map((interaction) => (
                      <div key={interaction.id} className="bg-parchment-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span>
                            {interaction.type === 'slack-message' && '💬'}
                            {interaction.type === 'github-commit' && '⚙️'}
                            {interaction.type === 'github-pr' && '🔄'}
                            {interaction.type === 'zoom-meeting' && '📹'}
                          </span>
                          <span className="text-xs text-ink-700">
                            {interaction.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-ink-900">{interaction.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-700 italic">No recent interactions recorded</p>
                )}
              </div>

              {/* Shared Work */}
              <div>
                <h3 className="font-semibold text-ink-900 mb-3">Shared Work</h3>
                {selectedMember.workItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMember.workItems.map((workId) => {
                      const work = mockUserProfile.workItems.find(w => w.id === workId);
                      return work ? (
                        <div key={work.id} className="bg-parchment-100 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span>
                              {work.source === 'slack' && '💬'}
                              {work.source === 'github' && '⚙️'}
                              {work.source === 'zoom' && '📹'}
                            </span>
                            <span className="text-sm font-medium text-ink-900">{work.title}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-ink-700 italic">No shared work yet</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
