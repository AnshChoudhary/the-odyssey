import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';

export function RecruitCrew() {
  const suggestions = [
    { name: 'Jordan Lee', role: 'DevOps Engineer', reason: 'Shared infrastructure projects', avatar: '👨‍💼' },
    { name: 'Priya Sharma', role: 'UX Designer', reason: 'Dashboard redesign collaboration', avatar: '👩‍🎨' },
    { name: 'Alex Rivera', role: 'Data Scientist', reason: 'Analytics feature work', avatar: '👨‍🔬' },
  ];

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-parchment-50 to-parchment-200 parchment-texture">
      <div className="max-w-4xl mx-auto px-8 py-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-sm text-ink-700 mb-4">Suggested collaborators based on your work</p>
          <h1 className="font-display text-5xl font-bold text-ink-900">Recruit a Crew Member</h1>
        </motion.div>
        <div className="space-y-6">
          {suggestions.map((person, index) => (
            <motion.div key={person.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-panel p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-ocean-700 flex items-center justify-center text-3xl">{person.avatar}</div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-ink-900">{person.name}</h3>
                <p className="text-sm text-ink-700">{person.role}</p>
                <p className="text-xs text-ink-700 mt-1">{person.reason}</p>
              </div>
              <button className="btn-primary text-sm">Invite to Crew</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Ports() {
  const ports = [
    { name: 'Platform Harbor', team: 'Platform Team', description: 'Infrastructure & DevOps', connections: 3 },
    { name: 'Product Bay', team: 'Product Team', description: 'Feature planning & roadmap', connections: 5 },
    { name: 'Design Cove', team: 'Design Team', description: 'UI/UX collaboration', connections: 2 },
  ];

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-ocean-100 to-ocean-300">
      <div className="max-w-5xl mx-auto px-8 py-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-sm text-ink-700 mb-4">Cross-team harbours where your work connects</p>
          <h1 className="font-display text-5xl font-bold text-ink-900">Ports of Call</h1>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ports.map((port, index) => (
            <motion.div key={port.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="glass-panel p-6 text-center">
              <div className="text-4xl mb-3">⚓</div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-2">{port.name}</h3>
              <p className="text-sm text-ink-700 mb-1">{port.team}</p>
              <p className="text-xs text-ink-700 mb-4">{port.description}</p>
              <div className="text-sm text-ocean-700 font-semibold">{port.connections} active connections</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Armada() {
  const fleet = mockUserProfile.crew.slice(0, 4).map(c => ({ name: c.name, progress: Math.floor(Math.random() * 30) + 60 }));

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-ink-900 to-ocean-900">
      <div className="max-w-5xl mx-auto px-8 py-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-sm text-parchment-200 mb-4">Manager fleet view — outcomes only, no rankings</p>
          <h1 className="font-display text-5xl font-bold text-parchment-50">The Armada</h1>
        </motion.div>
        <div className="glass-panel p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Team Overview</h2>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div><div className="text-3xl font-bold text-ocean-700">{fleet.length}</div><div className="text-sm text-ink-700">Active Voyages</div></div>
            <div><div className="text-3xl font-bold text-ocean-700">12</div><div className="text-sm text-ink-700">Completed This Month</div></div>
          </div>
        </div>
        <div className="space-y-4">
          {fleet.map((member, index) => (
            <motion.div key={member.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-panel p-4 flex items-center justify-between">
              <span className="font-medium text-ink-900">{member.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-parchment-200 rounded-full overflow-hidden">
                  <div className="h-full bg-ocean-700 rounded-full" style={{ width: `${member.progress}%` }}></div>
                </div>
                <span className="text-sm text-ink-700 w-12 text-right">{member.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Athena() {
  const messages = mockUserProfile.athenaMessages;

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-ocean-700 to-ocean-900">
      <div className="max-w-3xl mx-auto px-8 py-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="text-6xl mb-4">🦉</div>
          <p className="text-sm text-parchment-200 mb-4">Gentle daily wisdom and nudges</p>
          <h1 className="font-display text-5xl font-bold text-parchment-50">Athena's Counsel</h1>
        </motion.div>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-ocean-700 text-parchment-50 rounded-full capitalize">{message.category}</span>
                <span className="text-xs text-ink-700">{message.date.toLocaleDateString()}</span>
              </div>
              <p className="text-ink-900">{message.message}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
