import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CheckCircle, Star, Clock, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProgressBar from '../components/ui/ProgressBar';
import useGameStore from '../store/gameStore';
import { MODULES, PHASES, BADGES } from '../data/courseData';
import './SkillTree.css';

// Layout nodes for 10 modules — Symmetrical Tree structure
const LAYOUT = {
  'mod-1': { x: 50, y: 8 },
  'mod-2': { x: 35, y: 24 }, 'mod-3': { x: 65, y: 24 },
  'mod-6': { x: 20, y: 42 }, 'mod-5': { x: 50, y: 42 }, 'mod-4': { x: 80, y: 42 },
  'mod-7': { x: 35, y: 60 }, 'mod-8': { x: 65, y: 60 },
  'mod-9': { x: 50, y: 78 },
  'mod-10': { x: 50, y: 92 },
};

const CONNECTIONS = [
  ['mod-1', 'mod-2'],
  ['mod-2', 'mod-3'],
  ['mod-3', 'mod-4'],
  ['mod-4', 'mod-5'],
  ['mod-5', 'mod-6'],
  ['mod-6', 'mod-7'],
  ['mod-7', 'mod-8'],
  ['mod-8', 'mod-9'],
  ['mod-9', 'mod-10'],
];

// Phase ring colors matching Apple Health style
const RING_COLORS = {
  spark: '#FF2D55',   // Pink
  build: '#4CD964',   // Green
  master: '#5AC8FA',  // Blue
};

// Steps 0-1 = Spark, Steps 2-3 = Build, Steps 4-6 = Master
const STEP_PHASE_MAP = { spark: [0, 1], build: [2, 3], master: [4, 5, 6] };
const TOTAL_STEPS = 7;

// 3-ring Apple Health style ring for each node — shows Spark/Build/Master progress per module
function NodeTripleRing({ sparkPct, buildPct, masterPct, size = 56 }) {
  const center = size / 2;
  const strokeWidth = 4;
  const gap = 2;
  const rings = [
    { pct: sparkPct, color: RING_COLORS.spark, radius: (size / 2) - strokeWidth / 2 - 1 },
    { pct: buildPct, color: RING_COLORS.build, radius: (size / 2) - strokeWidth - gap - strokeWidth / 2 - 1 },
    { pct: masterPct, color: RING_COLORS.master, radius: (size / 2) - 2 * (strokeWidth + gap) - strokeWidth / 2 - 1 },
  ];

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {rings.map((ring, i) => {
        const circumference = 2 * Math.PI * ring.radius;
        const offset = circumference - (Math.min(ring.pct, 100) / 100) * circumference;
        return (
          <g key={i}>
            <circle cx={center} cy={center} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={strokeWidth} opacity={0.15} />
            <circle cx={center} cy={center} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={strokeWidth}
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 3px ${ring.color}40)` }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Central 3-ring activity summary (Apple Health style)
function ActivityRingsSummary({ sparkPct, buildPct, masterPct }) {
  const size = 160;
  const center = size / 2;
  const strokeWidth = 16;
  const gap = 4;

  const rings = [
    { pct: sparkPct, color: RING_COLORS.spark, label: '', radius: (size / 2) - strokeWidth / 2 - 2 },
    { pct: buildPct, color: RING_COLORS.build, label: '', radius: (size / 2) - strokeWidth - gap - strokeWidth / 2 - 2 },
    { pct: masterPct, color: RING_COLORS.master, label: '', radius: (size / 2) - 2 * (strokeWidth + gap) - strokeWidth / 2 - 2 },
  ];

  return (
    <div className="activity-rings-summary">
      <div className="rings-container">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {rings.map((ring, i) => {
            const circumference = 2 * Math.PI * ring.radius;
            const offset = circumference - (Math.min(ring.pct, 100) / 100) * circumference;
            return (
              <g key={i}>
                <circle cx={center} cy={center} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={strokeWidth} opacity={0.15} />
                <circle cx={center} cy={center} r={ring.radius} fill="none" stroke={ring.color} strokeWidth={strokeWidth}
                  strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${ring.color}40)` }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rings-legend">
        {rings.map((ring, i) => (
          <div key={i} className="ring-legend-item">
            <span className="ring-dot" style={{ background: ring.color }} />
            <span className="ring-label">{ring.label}</span>
            <span className="ring-value">{ring.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillTree() {
  const navigate = useNavigate();
  const { completedModules, unlockedModules, masteryResults, moduleProgress } = useGameStore();
  const [selectedNode, setSelectedNode] = useState(null);

  const totalSkills = MODULES.length;
  const completedCount = completedModules.length;
  const selectedModule = selectedNode ? MODULES.find(m => m.id === selectedNode) : null;

  // Calculate per-phase progress across ALL modules using step-based tracking
  const calcPhaseProgress = (phase) => {
    const steps = STEP_PHASE_MAP[phase] || [];
    const totalPossible = MODULES.length * steps.length;
    if (totalPossible === 0) return 0;
    let done = 0;
    MODULES.forEach(m => {
      const progress = moduleProgress?.[m.id] || [];
      steps.forEach(s => { if (progress.includes(s)) done++; });
    });
    return Math.round((done / totalPossible) * 100);
  };

  const sparkPct = calcPhaseProgress('spark');
  const buildPct = calcPhaseProgress('build');
  const masterPct = calcPhaseProgress('master');

  // Per-node phase ring progress — what percent of each phase's steps the user has done in this module
  const getNodePhaseProgress = (mod) => {
    const progress = moduleProgress?.[mod.id] || [];
    const calc = (steps) => {
      if (steps.length === 0) return 0;
      const done = steps.filter(s => progress.includes(s)).length;
      return Math.round((done / steps.length) * 100);
    };
    // If module is completed, show 100% for all rings
    if (completedModules.includes(mod.id)) return { spark: 100, build: 100, master: 100 };
    // If unlocked but no progress, show a small hint arc
    if (unlockedModules.includes(mod.id) && progress.length === 0) return { spark: 8, build: 0, master: 0 };
    return {
      spark: calc(STEP_PHASE_MAP.spark),
      build: calc(STEP_PHASE_MAP.build),
      master: calc(STEP_PHASE_MAP.master),
    };
  };

  // Confidence summary
  const confidenceData = completedModules.map(id => {
    const result = masteryResults?.[id];
    return { id, confidence: result?.confidence || 0 };
  }).filter(d => d.confidence > 0);

  const avgConfidence = confidenceData.length > 0
    ? (confidenceData.reduce((sum, d) => sum + d.confidence, 0) / confidenceData.length).toFixed(1)
    : 0;

  return (
    <div className="skill-tree-page">
      <button className="st-back" onClick={() => navigate('/dashboard')}>
        <ChevronLeft size={20} /> <span>Dashboard</span>
      </button>

      <div className="st-header">
        <div>
          <h1><Sparkles size={24} /> Skill Tree</h1>
          <p className="st-subtitle">Navigate through the Foundation of Robotics curriculum.</p>
        </div>
        <div className="st-header-stats">
          <div className="st-stat-chip">
            <span className="st-stat-num">{completedCount}/{totalSkills}</span>
            <span className="st-stat-lbl">Completed</span>
          </div>
          <div className="st-stat-chip">
            <span className="st-stat-num">{Math.round((completedCount / totalSkills) * 100)}%</span>
            <span className="st-stat-lbl">Mastery</span>
          </div>
        </div>
      </div>

      {/* Apple Health Activity Rings Summary */}
      <ActivityRingsSummary sparkPct={sparkPct} buildPct={buildPct} masterPct={masterPct} />

      {/* Full-width graph */}
      <div className="st-graph">
        {/* Connection lines */}
        <svg className="st-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
          {CONNECTIONS.map(([fromId, toId]) => {
            const from = LAYOUT[fromId];
            const to = LAYOUT[toId];
            if (!from || !to) return null;
            const isActive = completedModules.includes(fromId);
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x + 2} y1={from.y + 1.5}
                x2={to.x + 2} y2={to.y + 1.5}
                className={`st-line ${isActive ? 'active' : ''}`}
              />
            );
          })}
        </svg>

        {/* Skill nodes with triple Activity Rings */}
        {MODULES.map((mod, i) => {
          const pos = LAYOUT[mod.id];
          if (!pos) return null;
          const isCompleted = completedModules.includes(mod.id);
          const isUnlocked = unlockedModules.includes(mod.id);
          const isLocked = !isUnlocked;
          const isSelected = selectedNode === mod.id;
          const badge = BADGES[mod.badge];
          const phaseProgress = getNodePhaseProgress(mod);

          return (
            <motion.div
              key={mod.id}
              className={`st-node ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              onClick={() => setSelectedNode(isSelected ? null : mod.id)}
            >
              <div className="st-node-ring-wrap">
                <NodeTripleRing sparkPct={phaseProgress.spark} buildPct={phaseProgress.build} masterPct={phaseProgress.master} size={56} />
                <div className={`st-node-inner ${isCompleted ? 'done' : isLocked ? 'lock' : 'open'}`}>
                  {isLocked ? (
                    <Lock size={14} />
                  ) : isCompleted ? (
                    <CheckCircle size={14} />
                  ) : (
                    <span className="st-node-emoji">{badge?.icon || '📘'}</span>
                  )}
                </div>
              </div>
              <span className="st-node-label">{mod.title.length > 18 ? mod.title.substring(0, 16) + '…' : mod.title}</span>
            </motion.div>
          );
        })}

        {/* Selected module popup */}
        {selectedModule && (
          <motion.div
            className="st-popup"
            style={{
              left: `${(LAYOUT[selectedModule.id]?.x || 50) + 5}%`,
              top: `${(LAYOUT[selectedModule.id]?.y || 50)}%`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="st-popup-card">
              <span className="st-popup-phase" style={{ color: '#0ea5e9' }}>
                MODULE {MODULES.indexOf(selectedModule) + 1}
              </span>
              <h3>{selectedModule.title}</h3>
              <p>{selectedModule.subtitle}</p>
              <div className="st-popup-meta">
                <span><Clock size={12} /> {selectedModule.duration}</span>
                <span><Star size={12} /> +{selectedModule.xpReward} XP</span>
              </div>
              {/* Phase progress mini rings */}
              {(() => {
                const pp = getNodePhaseProgress(selectedModule);
                return (
                  <div style={{ display: 'flex', gap: 12, margin: '8px 0', justifyContent: 'center' }}>
                    {[
                      { id: 'spark', label: '', pct: pp.spark, color: RING_COLORS.spark },
                      { id: 'build', label: '', pct: pp.build, color: RING_COLORS.build },
                      { id: 'master', label: '', pct: pp.master, color: RING_COLORS.master },
                    ].map(p => (
                      <div key={p.id} style={{ textAlign: 'center', fontSize: '0.6rem' }}>
                        <div style={{ color: p.color, fontWeight: 700 }}>{p.pct}%</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: 1 }}>{p.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
              {unlockedModules.includes(selectedModule.id) && (
                <button className="st-popup-btn" onClick={() => navigate(`/module/${selectedModule.id}`)}>
                  {completedModules.includes(selectedModule.id) ? 'Review' : 'Start'} <ArrowRight size={14} />
                </button>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Confidence meter summary */}
      {confidenceData.length > 0 && (
        <div className="st-confidence-bar">
          <div className="st-conf-header">
            <BarChart3 size={16} />
            <span>Completed Confidence</span>
            <span className="st-conf-avg">Avg: {avgConfidence}/5</span>
          </div>
          <div className="st-conf-items">
            {confidenceData.map(d => {
              const mod = MODULES.find(m => m.id === d.id);
              const pct = (d.confidence / 5) * 100;
              return (
                <div key={d.id} className="st-conf-item">
                  <span className="st-conf-name">{mod?.title?.substring(0, 20) || d.id}</span>
                  <div className="st-conf-meter">
                    <div className="st-conf-fill" style={{ width: `${pct}%`, background: pct >= 60 ? 'var(--accent-green)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-orange)' }} />
                  </div>
                  <span className="st-conf-val">{d.confidence}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="st-bottom-progress">
        <ProgressBar
          value={Math.round((completedCount / totalSkills) * 100)}
          gradient="linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-orange))"
          height={6}
        />
      </div>
    </div>
  );
}
