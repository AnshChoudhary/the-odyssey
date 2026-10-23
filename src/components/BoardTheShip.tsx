import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUserProfile, getCrewMemberById } from '../data/mockData';
import type { CrewMember } from '../types';
import { CartographicBackground } from './CartographicBackground';

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

  const crewPositions = [
    { x: '25%', y: '40%' },
    { x: '50%', y: '35%' },
    { x: '75%', y: '40%' },
    { x: '35%', y: '60%' },
    { x: '65%', y: '60%' },
  ];

  return (
    <CartographicBackground title="Board The Persistent" subtitle="Your stalwart crew — click to view bond & interactions">
      <div className="relative w-full h-full">
        {/* Ship deck illustration */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" style={{ opacity: 0.15 }}>
          {/* Deck planks */}
          {[...Array(20)].map((_, i) => (
            <rect
              key={`plank-${i}`}
              x="100"
              y={150 + i * 30}
              width="800"
              height="28"
              fill="#8b7355"
              stroke="#5a4a3a"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {/* Mast */}
          <line x1="500" y1="100" x2="500" y2="700" stroke="#5a4a3a" strokeWidth="8" opacity="0.4" />
          {/* Rigging */}
          <line x1="500" y1="150" x2="200" y2="300" stroke="#5a4a3a" strokeWidth="2" opacity="0.3" />
          <line x1="500" y1="150" x2="800" y2="300" stroke="#5a4a3a" strokeWidth="2" opacity="0.3" />
        </svg>

        {/* Crew members */}
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
              transition={{ delay: index * 0.1, type: 'spring', damping: 15 }}
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
              {/* Illustrated crew member */}
              <div className="relative">
                {/* Circular portrait frame with ink border */}
                <div className="relative w-28 h-28">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {/* Parchment circle */}
                    <circle cx="50" cy="50" r="45" fill="#f4efe6" stroke="#8b7355" strokeWidth="3" />
                    <circle cx="50" cy="50" r="42" fill="#e8dcc7" />
                    {/* Inner portrait circle */}
                    <circle cx="50" cy="50" r="35" fill="#c9af81" stroke="#5a4a3a" strokeWidth="2" />
                    {/* Bond strength arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#6b8e9d"
                      strokeWidth="4"
                      strokeDasharray={`${member.bondStrength * 2.51} 251`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      opacity="0.8"
                    />
                  </svg>
                  
                  {/* Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    {member.avatar}
                  </div>
                </div>

                {/* Role badge */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#f4efe6] border-2 border-[#6b8e9d] flex items-center justify-center text-2xl shadow-lg">
                  {getRoleIcon(member.role)}
                </div>

                {/* Bond strength indicator */}
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#6b8e9d] text-[#f4efe6] text-sm font-bold flex items-center justify-center shadow-lg border-2 border-[#f4efe6]">
                  {member.bondStrength}
                </div>
              </div>

              {/* Name label with ink underline */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                <div className="font-display font-bold text-[#2d2419] text-lg">{member.name}</div>
                <div className="text-xs text-[#5a4a3a] font-serif italic">{getRoleName(member.role)}</div>
                <svg width="120" height="3" className="mt-1 mx-auto">
                  <line x1="0" y1="1" x2="120" y2="1" stroke="#8b7355" strokeWidth="1" strokeDasharray="3,2" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Crew Detail Panel */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2d2419] bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setSelectedCrew(null)}
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-[#f4efe6]/98 backdrop-blur-sm z-50 overflow-y-auto p-6 shadow-2xl border-l-2 border-[#8b7355]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#c9af81] border-2 border-[#8b7355] flex items-center justify-center text-4xl">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-[#2d2419]">
                      {selectedMember.name}
                    </h2>
                    <p className="text-[#5a4a3a] font-serif italic">{getRoleName(selectedMember.role)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCrew(null)}
                  className="text-[#5a4a3a] hover:text-[#2d2419] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Bond Strength */}
              <div className="mb-6 bg-[#e8dcc7]/50 p-4 rounded border border-[#8b7355]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display font-semibold text-[#2d2419]">Bond Strength</span>
                  <span className="text-3xl font-bold text-[#6b8e9d]">{selectedMember.bondStrength}</span>
                </div>
                <div className="w-full h-4 bg-[#d4c9b3] rounded overflow-hidden border border-[#8b7355]/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedMember.bondStrength}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-[#6b8e9d]"
                  />
                </div>
                <p className="text-xs text-[#5a4a3a] mt-2 italic">
                  {selectedMember.bondStrength >= 80 && 'Strong partnership — frequent & effective collaboration'}
                  {selectedMember.bondStrength >= 60 && selectedMember.bondStrength < 80 && 'Good working relationship — regular collaboration'}
                  {selectedMember.bondStrength < 60 && 'Growing connection — room to strengthen'}
                </p>
              </div>

              {/* Recent Interactions */}
              <div className="mb-6">
                <h3 className="font-display font-semibold text-[#2d2419] mb-3 flex items-center gap-2">
                  <span>Recent Interactions</span>
                  <svg width="60" height="2">
                    <line x1="0" y1="1" x2="60" y2="1" stroke="#8b7355" strokeWidth="1" />
                  </svg>
                </h3>
                {selectedMember.recentInteractions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMember.recentInteractions.map((interaction) => (
                      <div key={interaction.id} className="bg-[#e8dcc7]/50 p-3 rounded border border-[#8b7355]/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span>
                            {interaction.type === 'slack-message' && '💬'}
                            {interaction.type === 'github-commit' && '⚙️'}
                            {interaction.type === 'github-pr' && '🔄'}
                            {interaction.type === 'zoom-meeting' && '📹'}
                          </span>
                          <span className="text-xs text-[#5a4a3a] font-serif">
                            {interaction.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-[#3f3320]">{interaction.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#5a4a3a] italic">No recent interactions recorded</p>
                )}
              </div>

              {/* Shared Work */}
              <div>
                <h3 className="font-display font-semibold text-[#2d2419] mb-3 flex items-center gap-2">
                  <span>Shared Work</span>
                  <svg width="60" height="2">
                    <line x1="0" y1="1" x2="60" y2="1" stroke="#8b7355" strokeWidth="1" />
                  </svg>
                </h3>
                {selectedMember.workItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMember.workItems.map((workId) => {
                      const work = mockUserProfile.workItems.find(w => w.id === workId);
                      return work ? (
                        <div key={work.id} className="bg-[#e8dcc7]/50 p-3 rounded border border-[#8b7355]/10">
                          <div className="flex items-center gap-2">
                            <span>
                              {work.source === 'slack' && '💬'}
                              {work.source === 'github' && '⚙️'}
                              {work.source === 'zoom' && '📹'}
                            </span>
                            <span className="text-sm font-medium text-[#2d2419] font-display">{work.title}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#5a4a3a] italic">No shared work yet</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CartographicBackground>
  );
}
