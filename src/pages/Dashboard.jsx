import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Zap, Layers, Crown, Flame, Star, Trophy, ArrowRight, Clock, BookOpen } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RobotMascot3D from '../components/3d/RobotMascot3D';
import RobotSkillTree from '../components/ui/RobotSkillTree';
import DiagnosticQuiz from '../components/ui/DiagnosticQuiz';
import SpinWheel from '../components/ui/SpinWheel';
import RecapPanel from '../components/ui/RecapPanel';
import useGameStore from '../store/gameStore';
import { PHASES, MODULES, BADGES } from '../data/courseData';
import NextSkillPipeline from '../components/ui/NextSkillPipeline';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { playerName, xp, level, streak, badges, completedModules, getTotalProgress, getPhaseProgress, diagnosticComplete, setDiagnosticComplete } = useGameStore();
  const xpForNext = level * 150;

  const nextModule = MODULES.find(m => !completedModules.includes(m.id));
  const nextModulePath = nextModule ? `/module/${nextModule.id}` : '/dashboard';
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

  const handleDiagnosticComplete = (track, startModuleId) => {
    setDiagnosticComplete(track, startModuleId);
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      {/* Pre-course assessment quiz */}
      {!diagnosticComplete && (
        <DiagnosticQuiz playerName={playerName} onComplete={handleDiagnosticComplete} />
      )}
      {/* Welcome header — always visible at top */}
      <motion.div
        className="dashboard-welcome"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Welcome back, <span className="glow-text">{playerName}</span></h1>
          <p className="dashboard-subtitle">Continue your journey to robotics mastery</p>
        </div>
        <div className="dashboard-streak">
          <Flame size={24} className="streak-fire" />
          <div>
            <span className="streak-count">{streak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
      </motion.div>

      {/* Stats + Robot row */}
      <div className="dashboard-top">
        <div className="dashboard-top-left">
          {/* Stats row */}
          <div className="dashboard-stats">
            <GlassCard className="dashboard-stat-card" glow="cyan">
              <div className="stat-icon-wrap cyan">
                <Star size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">Lv. {level}</span>
                <span className="stat-label">Level</span>
              </div>
              <ProgressBar value={xp} max={xpForNext} gradient="linear-gradient(90deg, #00e676, #00e5ff)" height={4} showValue={false} />
              <span className="stat-xp">{xp}/{xpForNext} XP</span>
            </GlassCard>

            <GlassCard className="dashboard-stat-card" glow="blue">
              <div className="stat-icon-wrap blue">
                <BookOpen size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{completedModules.length}/{MODULES.length}</span>
                <span className="stat-label">Modules</span>
              </div>
            </GlassCard>

            <GlassCard className="dashboard-stat-card" glow="purple">
              <div className="stat-icon-wrap purple">
                <Trophy size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{badges.length}</span>
                <span className="stat-label">Badges</span>
              </div>
            </GlassCard>

            <GlassCard className="dashboard-stat-card" glow="green">
              <div className="stat-icon-wrap green">
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{Math.round(completedModules.length * 2.25)}h</span>
                <span className="stat-label">Time Spent</span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Interactive Robot + Skill Tree */}
        <motion.div
          className="dashboard-robot"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <RobotSkillTree size="md" />
        </motion.div>
      </div>

      {/* Next up */}
      {nextModule && (
        <div className="dashboard-next">
          <h2>Continue Learning</h2>
          <GlassCard className="dashboard-next-card" glow="blue" onClick={() => navigate(`/module/${nextModule.id}`)}>
            <div className="next-card-phase" style={{ color: PHASES[nextModule.phase].color }}>
              {nextModule.phase.toUpperCase()}
            </div>
            <h3>{nextModule.title}</h3>
            <p>{nextModule.subtitle}</p>
            <div className="next-card-meta">
              <span><Clock size={14} /> {nextModule.duration}</span>
              <span><Star size={14} /> +{nextModule.xpReward} XP</span>
            </div>
            <Button variant={nextModule.phase} size="sm" icon={<ArrowRight size={14} />}>
              Start Module
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Badges */}
      <div className="dashboard-badges">
        <h2>Achievements</h2>
        <div className="dashboard-badges-grid">
          {Object.entries(BADGES).slice(0, 10).map(([id, badge]) => (
            <Badge
              key={id}
              icon={badge.icon}
              name={badge.name}
              earned={badges.includes(id)}
              description={badge.description}
            />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="view-all-btn">
          View All Achievements <ArrowRight size={14} />
        </Button>
      </div>

      {/* 3D Robot Mascot — visible only on Dashboard */}
      <RobotMascot3D
        onOpenSpinWheel={() => setShowSpinWheel(true)}
        onOpenRecap={() => setShowRecap(true)}
      />

      {/* Spin Wheel overlay */}
      {showSpinWheel && <SpinWheel onClose={() => setShowSpinWheel(false)} />}

      {/* Recap Panel */}
      <RecapPanel isOpen={showRecap} onClose={() => setShowRecap(false)} />

      {/* Next Skill Pipeline — visible after course completion */}
      {completedModules.length >= MODULES.length && (
        <NextSkillPipeline unlocked={true} />
      )}
      {completedModules.length > 0 && completedModules.length < MODULES.length && (
        <NextSkillPipeline unlocked={false} />
      )}
    </div>
  );
}
