import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, Star, ArrowRight, ChevronLeft } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import useGameStore from '../store/gameStore';
import { PHASES, getModulesByPhase, BADGES } from '../data/courseData';
import './PhasePage.css';

export default function PhasePage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const { completedModules, unlockedModules, getPhaseProgress } = useGameStore();
  const phase = PHASES[phaseId];
  const modules = getModulesByPhase(phaseId);
  const progress = getPhaseProgress(phaseId);

  if (!phase) return <div className="phase-page">Phase not found</div>;

  return (
    <div className="phase-page">
      {/* Header */}
      <motion.div
        className="phase-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="phase-back" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </button>

        <div className="phase-hero" style={{ backgroundImage: `url(${phase.image})` }}>
          <div className="phase-hero-overlay" style={{ background: `linear-gradient(135deg, ${phase.color}33, transparent)` }} />
          <div className="phase-hero-content">
            <div className="phase-pill" style={{ borderColor: `${phase.color}44`, background: `${phase.color}15`, color: phase.color }}>
              Hours {phase.hours}
            </div>
            <h1>{phase.name} <span>Phase</span></h1>
            <p className="phase-subtitle">{phase.description}</p>
            <ProgressBar value={progress} gradient={phase.gradient} height={8} label={`${progress}% Complete`} showValue={false} />
          </div>
        </div>

        {/* Outcomes */}
        <div className="phase-outcomes">
          <h3>Learning Outcomes</h3>
          <div className="phase-outcomes-list">
            {phase.outcomes.map((outcome, i) => (
              <motion.div
                key={i}
                className="phase-outcome"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CheckCircle size={16} style={{ color: phase.color }} />
                <span>{outcome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modules grid */}
      <div className="phase-modules">
        <h2>Modules</h2>
        <div className="phase-modules-list">
          {modules.map((mod, i) => {
            const isCompleted = completedModules.includes(mod.id);
            const isUnlocked = unlockedModules.includes(mod.id);
            const isLocked = !isUnlocked;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard
                  className={`module-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={!isLocked ? () => navigate(`/module/${mod.id}`) : undefined}
                  glow={isCompleted ? 'green' : isUnlocked ? 'blue' : undefined}
                >
                  <div className="module-card-number" style={{ color: isCompleted ? 'var(--accent-green)' : phase.color }}>
                    {isCompleted ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : <span>{String(mod.order).padStart(2, '0')}</span>}
                  </div>
                  <div className="module-card-content">
                    <h4>{mod.title}</h4>
                    <p>{mod.subtitle}</p>
                    <div className="module-card-meta">
                      <span><Clock size={12} /> {mod.duration}</span>
                      <span><Star size={12} /> +{mod.xpReward} XP</span>
                    </div>
                  </div>
                  {!isLocked && (
                    <div className="module-card-action">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
