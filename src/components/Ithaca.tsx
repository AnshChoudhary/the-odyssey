import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';

export function Ithaca() {
  const goals = mockUserProfile.goals;
  const northStar = goals.find(g => g.isNorthStar);

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-parchment-50 to-parchment-200 parchment-texture">
      <div className="max-w-5xl mx-auto px-8 py-24">
        {/* View title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-ink-700 mb-4">
            Your destination — progress toward Q4 goals, no grades or pressure
          </p>
          <h1 className="font-display text-5xl font-bold text-ink-900">
            Ithaca: Your North Star
          </h1>
        </motion.div>

        {/* North Star Goal */}
        {northStar && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 mb-8 border-4 border-ocean-700"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">⭐</span>
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
                  {northStar.title}
                </h2>
                <p className="text-ink-700 mb-4">{northStar.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-ink-900">Progress</span>
                <span className="text-2xl font-bold text-ocean-700">{northStar.progress}%</span>
              </div>
              <div className="w-full h-4 bg-parchment-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${northStar.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-ocean-500 to-ocean-700 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-ink-700">
              <span className="text-2xl">🧭</span>
              <span className="text-sm">Heading: {northStar.heading}°</span>
            </div>

            <div className="mt-6 bg-parchment-100 p-4 rounded-lg">
              <h3 className="font-semibold text-ink-900 mb-2">Athena's Coaching</h3>
              <p className="text-sm text-ink-700">
                You're making steady progress. Your authentication refactor work is building directly toward this goal. Consider documenting your approach—it could help the team navigate similar challenges.
              </p>
            </div>
          </motion.div>
        )}

        {/* Other Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.filter(g => !g.isNorthStar).map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-panel p-6"
            >
              <h3 className="font-display text-xl font-bold text-ink-900 mb-2">
                {goal.title}
              </h3>
              <p className="text-sm text-ink-700 mb-4">{goal.description}</p>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-ink-700">Progress</span>
                  <span className="text-sm font-bold text-ocean-700">{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-parchment-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-ocean-700 rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-ink-700 text-xs">
                <span>🧭</span>
                <span>Heading: {goal.heading}°</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-ink-700 italic"
        >
          No grades, no comparisons — just your journey toward Ithaca
        </motion.div>
      </div>
    </div>
  );
}
