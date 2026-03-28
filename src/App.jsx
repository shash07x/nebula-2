import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PhasePage from './pages/PhasePage';
import ModulePlayer from './pages/ModulePlayer';
import Capstone from './pages/Capstone';
import Profile from './pages/Profile';
import SkillTree from './pages/SkillTree';
import CourseCatalog from './pages/CourseCatalog';
import Leaderboard from './pages/Leaderboard';
import BadgesPage from './pages/BadgesPage';
import Portfolio from './pages/Portfolio';
import InteractiveRobot from './components/ui/InteractiveRobot';
import useGameStore from './store/gameStore';
import { MODULES } from './data/courseData';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { initTheme, playerName, completedModules, currentStep } = useGameStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  if (isLanding) {
    return <Landing />;
  }

  // Determine robot visibility
  const isDashboard = location.pathname === '/dashboard';
  const isCapstone = location.pathname === '/capstone';
  const isModule = location.pathname.startsWith('/module/');

  // Hide robot during quiz/assessment steps (practice=2, challenge=3), on capstone, and on module pages (has course sidebar)
  const isQuizStep = isModule && (currentStep === 2 || currentStep === 3);
  const showRobot = !isDashboard && !isCapstone && !isModule;

  // Next module for robot navigation
  const nextModule = MODULES.find(m => !completedModules.includes(m.id));
  const nextModulePath = nextModule ? `/module/${nextModule.id}` : '/dashboard';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-bg" />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<CourseCatalog />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/phase/:phaseId" element={<PhasePage />} />
            <Route path="/module/:moduleId" element={<ModulePlayer />} />
            <Route path="/capstone" element={<Capstone />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {/* Persistent robot overlay — draggable, hidden on Dashboard and Capstone */}
      {showRobot && (
        <motion.div
          className="global-robot-overlay"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          whileDrag={{ scale: 1.05 }}
        >
          <InteractiveRobot playerName={playerName} nextModulePath={nextModulePath} compact />
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
