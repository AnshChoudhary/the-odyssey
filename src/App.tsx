import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation, ViewName } from './components/Navigation';
import { TheChart } from './components/TheChart';
import { BoardTheShip } from './components/BoardTheShip';
import { CaptainsLog } from './components/CaptainsLog';
import { ThreeTrials } from './components/ThreeTrials';
import { Ithaca } from './components/Ithaca';
import { Chapters } from './components/Chapters';
import { CalypsoIsland } from './components/CalypsoIsland';
import { Gifts } from './components/Gifts';
import { RecruitCrew, PortsOfCall, TheArmada, AthenasCounsel } from './components/SimpleViews';

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('chart');
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if this is first visit
    const hasSeenTour = localStorage.getItem('odyssey-tour-seen');
    if (!hasSeenTour) {
      setShowTour(true);
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCurrentView('chart');
      } else if (e.key === '?') {
        // Legend is handled by Navigation component
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: ViewName) => {
    setCurrentView(view);
  };

  const handleSkipTour = () => {
    localStorage.setItem('odyssey-tour-seen', 'true');
    setShowTour(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chart':
        return <TheChart onNavigateToShip={() => handleNavigate('ship')} />;
      case 'ship':
        return <BoardTheShip />;
      case 'captains-log':
        return <CaptainsLog />;
      case 'trials':
        return <ThreeTrials />;
      case 'ithaca':
        return <Ithaca />;
      case 'chapters':
        return <Chapters />;
      case 'calypso':
        return <CalypsoIsland />;
      case 'gifts':
        return <Gifts />;
      case 'recruit':
        return <RecruitCrew />;
      case 'ports':
        return <PortsOfCall />;
      case 'armada':
        return <TheArmada />;
      case 'athena':
        return <AthenasCounsel />;
      default:
        return <TheChart onNavigateToShip={() => handleNavigate('ship')} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden grain">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* First-run tour */}
      <AnimatePresence>
        {showTour && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900 bg-opacity-80 z-50 backdrop-blur-md flex items-center justify-center p-4"
              onClick={handleSkipTour}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-panel p-12 max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <h1 className="font-display text-5xl font-bold text-ink-900 mb-4">
                    Welcome to The Work Odyssey
                  </h1>
                  <p className="text-lg text-ink-900 mb-6 leading-relaxed">
                    Your work is a voyage on an old sea chart. Every task is an island, your teammates are your crew, and Ithaca—your goals—shines on the horizon.
                  </p>
                  <div className="bg-parchment-100 p-6 rounded-lg mb-6 text-left space-y-3">
                    <p className="text-sm text-ink-900">
                      <strong>🗺️ The Chart:</strong> Your living map of work. Pan, zoom, click islands.
                    </p>
                    <p className="text-sm text-ink-900">
                      <strong>⚓ Navigation:</strong> Click the anchor button or press Esc to return home.
                    </p>
                    <p className="text-sm text-ink-900">
                      <strong>🦉 Weekly Check-ins:</strong> Athena helps keep your map accurate (~2 min).
                    </p>
                    <p className="text-sm text-ink-900">
                      <strong>🔒 Your Privacy:</strong> No scores, no rankings. Your corrections stay private.
                    </p>
                  </div>
                  <p className="text-sm text-ink-700 mb-6 italic">
                    This is not evaluation—it's a delightful way to see your journey.
                  </p>
                  <button onClick={handleSkipTour} className="btn-primary text-lg px-12 py-4">
                    Begin Your Voyage ⚓
                  </button>
                  <p className="text-xs text-ink-700 mt-4">
                    Press ? anytime for help • Esc returns to The Chart
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
