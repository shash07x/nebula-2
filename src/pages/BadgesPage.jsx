import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Award, Sparkles, CheckCircle, Lock } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import useGameStore from '../store/gameStore';
import { MODULES, BADGES, PHASES } from '../data/courseData';
import RobotSkillTree from '../components/ui/RobotSkillTree';
import './BadgesPage.css';

export default function BadgesPage() {
  const navigate = useNavigate();
  const { badges, completedModules, unlockedModules } = useGameStore();

  const totalSkills = MODULES.length;
  const completedCount = completedModules.length;

  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Group modules by phase for the skill list
  const phases = ['spark', 'build', 'master'];
  const sparkDone = completedModules.filter(m => m.startsWith('spark-')).length;
  const buildDone = completedModules.filter(m => m.startsWith('build-')).length;
  const masterDone = completedModules.filter(m => m.startsWith('master-')).length;

  return (
    <div className="badges-page">
      <button className="bp-back" onClick={() => navigate('/dashboard')}>
        <ChevronLeft size={20} /> Dashboard
      </button>

      <div className="bp-header">
        <h1><Award size={24} /> Badges & Skill Progress</h1>
        <p className="bp-subtitle">Your achievements and skill-building journey</p>
      </div>

      <div className="bp-layout">
        {/* Left: Robot Build — skills from modules */}
        <GlassCard className="bp-robot-card">
          <div className="bp-robot-header">
            <span className="bp-robot-title">NEBULA BUILD</span>
            <span className="bp-robot-count">{completedCount}/{totalSkills} Skills</span>
          </div>

          <div className="bp-robot-content">
            <div className="bp-robot-visual">
              <svg viewBox="0 0 120 200" className="bp-robot-svg">
                {/* Head */}
                <rect x="35" y="10" width="50" height="40" rx="10"
                  className={`bp-part ${masterDone >= 4 ? 'master' : buildDone >= 5 ? 'build' : sparkDone >= 6 ? 'spark' : 'locked'}`}
                  onMouseEnter={() => setHoveredSkill('head')} onMouseLeave={() => setHoveredSkill(null)} />
                <circle cx="50" cy="28" r="5" className={`bp-part ${buildDone >= 6 ? 'build' : 'locked'}`} />
                <circle cx="70" cy="28" r="5" className={`bp-part ${buildDone >= 7 ? 'build' : 'locked'}`} />
                <line x1="60" y1="10" x2="60" y2="2" strokeWidth="3" className={`bp-part-line ${buildDone >= 8 ? 'build' : 'locked'}`} />
                <circle cx="60" cy="2" r="3" className={`bp-part ${buildDone >= 8 ? 'build' : 'locked'}`} />
                {/* Neck */}
                <rect x="50" y="50" width="20" height="10" rx="3" className={`bp-part ${buildDone >= 4 ? 'build' : 'locked'}`} />
                {/* Body */}
                <rect x="25" y="60" width="70" height="60" rx="12" className={`bp-part ${sparkDone >= 5 ? 'spark' : 'locked'}`} />
                <circle cx="60" cy="85" r="10" className={`bp-part ${masterDone >= 2 ? 'master' : 'locked'}`} />
                <rect x="38" y="92" width="44" height="15" rx="5" className={`bp-part ${masterDone >= 1 ? 'master' : 'locked'}`} />
                {/* Arms */}
                <rect x="5" y="65" width="18" height="50" rx="8" className={`bp-part ${sparkDone >= 7 ? 'spark' : 'locked'}`} />
                <rect x="97" y="65" width="18" height="50" rx="8" className={`bp-part ${buildDone >= 1 ? 'build' : 'locked'}`} />
                <circle cx="14" cy="120" r="7" className={`bp-part ${buildDone >= 2 ? 'build' : 'locked'}`} />
                <circle cx="106" cy="120" r="7" className={`bp-part ${buildDone >= 3 ? 'build' : 'locked'}`} />
                {/* Legs */}
                <rect x="32" y="122" width="18" height="45" rx="8" className={`bp-part ${sparkDone >= 3 ? 'spark' : 'locked'}`} />
                <rect x="70" y="122" width="18" height="45" rx="8" className={`bp-part ${sparkDone >= 4 ? 'spark' : 'locked'}`} />
                {/* Feet */}
                <rect x="25" y="165" width="32" height="12" rx="6" className={`bp-part ${sparkDone >= 1 ? 'spark' : 'locked'}`} />
                <rect x="63" y="165" width="32" height="12" rx="6" className={`bp-part ${sparkDone >= 2 ? 'spark' : 'locked'}`} />
                <path d="M25,65 Q15,55 25,50 L30,60 Z" className={`bp-part ${masterDone >= 3 ? 'master' : 'locked'}`} />
              </svg>

              <ProgressBar
                value={Math.round((completedCount / totalSkills) * 100)}
                gradient="linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-orange))"
                height={6}
                showValue={false}
              />
            </div>

            {/* Skills list — flat module list */}
            <div className="bp-parts-list">
              <h4>Skills</h4>
              {MODULES.map(mod => {
                const isDone = completedModules.includes(mod.id);
                const isUnlocked = unlockedModules.includes(mod.id);
                const isHovered = hoveredSkill === mod.id;
                return (
                  <div
                    key={mod.id}
                    className={`bp-part-item ${isDone ? 'unlocked' : 'locked'} ${isHovered ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHoveredSkill(mod.id)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className="bp-part-dot" />
                    <div className="bp-part-info">
                      <span className="bp-part-name">{mod.title}</span>
                      {isHovered && (
                        <motion.span
                          className="bp-part-desc"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          {mod.subtitle}
                        </motion.span>
                      )}
                    </div>
                    {isDone ? (
                      <CheckCircle size={14} className="bp-skill-check" />
                    ) : !isUnlocked ? (
                      <Lock size={12} className="bp-skill-lock" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Right: Badges */}
        <div className="bp-badges-section">
          <h2><Sparkles size={18} /> Your Achievements</h2>
          <p className="bp-badges-count">{badges.length} / {Object.keys(BADGES).length} earned</p>

          <div className="bp-badges-grid">
            {Object.entries(BADGES).map(([id, badge]) => (
              <Badge
                key={id}
                icon={badge.icon}
                name={badge.name}
                earned={badges.includes(id)}
                description={badge.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Nebula Robot Build (full width, separate section below) ── */}
      <div className="bp-full-robot-section">
        <GlassCard className="bp-full-robot-card">
          <h2 className="bp-full-robot-title">🤖 Nebula Robot Build</h2>
          <p className="bp-full-robot-sub">Complete modules to build your robot — each skill powers a component</p>
          <div className="bp-full-robot-container">
            <RobotSkillTree size="lg" showLabels />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
