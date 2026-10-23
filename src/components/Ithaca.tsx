import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import { CartographicBackground } from './CartographicBackground';

export function Ithaca() {
  const goals = mockUserProfile.goals;
  const northStar = goals.find(g => g.isNorthStar);

  return (
    <CartographicBackground title="Ithaca: Your North Star" subtitle="Your destination — progress toward Q4 goals, no grades">
      <div className="max-w-5xl mx-auto px-8 py-32">
        {northStar && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#f4efe6] p-8 mb-8 border-4 border-[#6b8e9d] rounded shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">⭐</span>
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold text-[#2d2419] mb-2">
                  {northStar.title}
                </h2>
                <p className="text-[#5a4a3a] mb-4 font-serif">{northStar.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#2d2419] font-display">Progress</span>
                <span className="text-3xl font-bold text-[#6b8e9d]">{northStar.progress}%</span>
              </div>
              <div className="w-full h-5 bg-[#d4c9b3] rounded-full overflow-hidden border-2 border-[#8b7355]/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${northStar.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-[#6b8e9d]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#5a4a3a] font-serif">
              <span className="text-2xl">🧭</span>
              <span>Heading: {northStar.heading}°</span>
            </div>

            <div className="mt-6 bg-[#e8dcc7]/50 p-4 rounded border border-[#8b7355]/20">
              <h3 className="font-display font-semibold text-[#2d2419] mb-2">Athena's Coaching</h3>
              <p className="text-sm text-[#5a4a3a] font-serif italic">
                You're making steady progress. Your authentication refactor work builds directly toward this goal.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.filter(g => !g.isNorthStar).map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-[#f4efe6] p-6 rounded border-2 border-[#8b7355]/50 shadow"
            >
              <h3 className="font-display text-xl font-bold text-[#2d2419] mb-2">
                {goal.title}
              </h3>
              <p className="text-sm text-[#5a4a3a] mb-4 font-serif">{goal.description}</p>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#5a4a3a] font-serif">Progress</span>
                  <span className="text-sm font-bold text-[#6b8e9d]">{goal.progress}%</span>
                </div>
                <div className="w-full h-3 bg-[#d4c9b3] rounded-full overflow-hidden border border-[#8b7355]/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-[#6b8e9d]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#5a4a3a] text-xs font-serif">
                <span>🧭</span>
                <span>Heading: {goal.heading}°</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-[#5a4a3a] italic font-serif"
        >
          No grades, no comparisons — just your journey toward Ithaca
        </motion.div>
      </div>
    </CartographicBackground>
  );
}
