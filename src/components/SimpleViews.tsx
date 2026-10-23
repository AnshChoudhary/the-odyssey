import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import { CartographicBackground } from './CartographicBackground';

export function RecruitCrew() {
  return (
    <CartographicBackground title="Recruit Crew" subtitle="Invite teammates to join your voyage">
      <div className="max-w-3xl mx-auto px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f4efe6] p-8 rounded border-2 border-[#8b7355] shadow-xl"
        >
          <div className="text-6xl text-center mb-6">⚓</div>
          <h2 className="font-display text-2xl font-bold text-[#2d2419] text-center mb-4">
            Build Your Crew
          </h2>
          <p className="text-[#5a4a3a] text-center mb-6 font-serif">
            Your crew grows naturally from Slack, GitHub, and Zoom interactions. Work together and watch bonds form!
          </p>
          <div className="bg-[#e8dcc7]/50 p-6 rounded border border-[#8b7355]/20 mb-6">
            <p className="text-sm text-[#2d2419] font-serif italic">
              <strong>Current crew:</strong> {mockUserProfile.crew.length} members
            </p>
            <div className="flex justify-center gap-2 mt-3">
              {mockUserProfile.crew.slice(0, 5).map(member => (
                <span key={member.id} className="text-3xl">{member.avatar}</span>
              ))}
            </div>
          </div>
          <button className="w-full px-6 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif">
            View Full Crew
          </button>
        </motion.div>
      </div>
    </CartographicBackground>
  );
}

export function PortsOfCall() {
  return (
    <CartographicBackground title="Ports of Call" subtitle="Integration with your tools">
      <div className="max-w-4xl mx-auto px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Slack', icon: '💬', status: 'connected', description: 'Messages & channels' },
            { name: 'GitHub', icon: '⚙️', status: 'connected', description: 'Commits & pull requests' },
            { name: 'Zoom', icon: '📹', status: 'connected', description: 'Meetings & recordings' },
            { name: 'Linear', icon: '🎯', status: 'available', description: 'Issue tracking' },
            { name: 'Jira', icon: '📋', status: 'available', description: 'Project management' },
            { name: 'Notion', icon: '📝', status: 'available', description: 'Documentation' },
          ].map((port, index) => (
            <motion.div
              key={port.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f4efe6] p-6 text-center rounded border-2 border-[#8b7355] shadow"
            >
              <div className="text-5xl mb-3">{port.icon}</div>
              <h3 className="font-display text-lg font-bold text-[#2d2419] mb-2">{port.name}</h3>
              <p className="text-sm text-[#5a4a3a] mb-4 font-serif">{port.description}</p>
              {port.status === 'connected' ? (
                <span className="text-xs px-3 py-1 bg-[#6b8e9d] text-[#f4efe6] rounded-full font-serif">
                  ⚓ Connected
                </span>
              ) : (
                <button className="text-xs px-3 py-1 bg-[#e8dcc7] text-[#2d2419] rounded-full border border-[#8b7355]/30 hover:bg-[#d4c9b3] transition-all font-serif">
                  Connect
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </CartographicBackground>
  );
}

export function TheArmada() {
  return (
    <CartographicBackground title="The Armada" subtitle="Organization-wide fleet view (manager/admin)">
      <div className="max-w-5xl mx-auto px-8 py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#f4efe6] p-12 text-center rounded border-2 border-[#8b7355] shadow-xl"
        >
          <div className="text-7xl mb-4">⛵⛵⛵</div>
          <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-4">
            Fleet Overview
          </h2>
          <p className="text-[#5a4a3a] mb-6 font-serif">
            See the whole organization's ships sailing together. Available to managers and admins.
          </p>
          <div className="bg-[#e8dcc7]/50 p-6 rounded border border-[#8b7355]/20 max-w-2xl mx-auto">
            <p className="text-sm text-[#2d2419] font-serif italic">
              <strong>Purpose:</strong> High-level visibility into team progress without individual surveillance.
              See themes, bottlenecks, and collaboration patterns across your fleet.
            </p>
          </div>
        </motion.div>
      </div>
    </CartographicBackground>
  );
}

export function AthenasCounsel() {
  return (
    <CartographicBackground title="Athena's Counsel" subtitle="AI guidance and coaching">
      <div className="max-w-4xl mx-auto px-8 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#f4efe6] p-8 rounded border-2 border-[#8b7355] shadow-xl"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="text-7xl">🦉</div>
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-3">
                Athena's Wisdom
              </h2>
              <p className="text-[#5a4a3a] font-serif leading-relaxed">
                Ask Athena for coaching on goals, blockers, crew collaboration, or navigating challenges. 
                Your goddess of wisdom observes your voyage and offers guidance.
              </p>
            </div>
          </div>

          <div className="bg-[#e8dcc7]/50 p-6 rounded border border-[#8b7355]/20 mb-6">
            <h3 className="font-display font-semibold text-[#2d2419] mb-3">Recent Counsel</h3>
            <div className="space-y-3">
              <div className="bg-[#f4efe6] p-3 rounded border border-[#8b7355]/10">
                <p className="text-sm text-[#2d2419] mb-1 font-display font-semibold">
                  On your authentication refactor
                </p>
                <p className="text-sm text-[#5a4a3a] italic font-serif">
                  "This work strengthens your ship's foundation. Consider involving your Quartermaster early."
                </p>
              </div>
              <div className="bg-[#f4efe6] p-3 rounded border border-[#8b7355]/10">
                <p className="text-sm text-[#2d2419] mb-1 font-display font-semibold">
                  On your Q4 North Star
                </p>
                <p className="text-sm text-[#5a4a3a] italic font-serif">
                  "You're 45% toward your goal. Your current trials directly serve this journey."
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-display font-semibold text-[#2d2419] mb-2">
              Ask Athena
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded focus:outline-none focus:border-[#6b8e9d] bg-[#f4efe6] font-serif"
              rows={4}
              placeholder="What guidance do you seek?"
            />
            <button className="mt-3 px-8 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif">
              Seek Counsel 🦉
            </button>
          </div>
        </motion.div>
      </div>
    </CartographicBackground>
  );
}
