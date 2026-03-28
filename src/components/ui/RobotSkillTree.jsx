import { useMemo } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { ROBOT_PARTS, MODULES } from '../../data/courseData';
import './RobotSkillTree.css';

// SVG path data for each robot body part (Nebula-inspired humanoid)
const PART_PATHS = {
  'left-foot':      { d: 'M155 440 L145 440 L140 460 L160 460 Z',                       cx: 150, cy: 450 },
  'right-foot':     { d: 'M245 440 L255 440 L260 460 L240 460 Z',                       cx: 250, cy: 450 },
  'left-leg':       { d: 'M148 370 L158 370 L160 440 L145 440 Z',                       cx: 153, cy: 405 },
  'right-leg':      { d: 'M242 370 L252 370 L255 440 L240 440 Z',                       cx: 247, cy: 405 },
  'lower-torso':    { d: 'M160 330 L240 330 L250 370 L150 370 Z',                       cx: 200, cy: 350 },
  'upper-torso':    { d: 'M155 250 L245 250 L250 330 L150 330 Z',                       cx: 200, cy: 290 },
  'left-arm':       { d: 'M155 260 L130 260 L115 350 L135 350 Z',                       cx: 133, cy: 305 },
  'right-arm':      { d: 'M245 260 L270 260 L285 350 L265 350 Z',                       cx: 267, cy: 305 },
  'left-hand':      { d: 'M115 350 L135 350 L138 380 L110 380 Z',                       cx: 124, cy: 365 },
  'right-hand':     { d: 'M265 350 L285 350 L290 380 L262 380 Z',                       cx: 276, cy: 365 },
  'neck':           { d: 'M185 225 L215 225 L215 250 L185 250 Z',                       cx: 200, cy: 237 },
  'head-shell':     { d: 'M165 150 L235 150 Q250 150 250 175 L250 225 L150 225 L150 175 Q150 150 165 150 Z', cx: 200, cy: 188 },
  'left-eye':       { d: 'M170 182 Q170 172 180 172 Q190 172 190 182 Q190 192 180 192 Q170 192 170 182 Z',   cx: 180, cy: 182, isCircle: true },
  'right-eye':      { d: 'M210 182 Q210 172 220 172 Q230 172 230 182 Q230 192 220 192 Q210 192 210 182 Z',   cx: 220, cy: 182, isCircle: true },
  'antenna':        { d: 'M195 130 L205 130 L205 150 L195 150 Z M192 120 Q200 105 208 120 Z',               cx: 200, cy: 130 },
  'chest-panel':    { d: 'M175 270 L225 270 L225 310 L175 310 Z',                       cx: 200, cy: 290, isPanel: true },
  'core-energy':    { cx: 200, cy: 290, r: 12, isEnergy: true },
  'shoulder-armor': { d: 'M140 248 L160 248 L155 270 L130 270 Z M240 248 L260 248 L270 270 L245 270 Z',     cx: 200, cy: 259 },
  'brain-circuits': { d: 'M170 165 L230 165 L230 200 L170 200 Z',                       cx: 200, cy: 182, isCircuit: true },
  'full-activation': { cx: 200, cy: 290, r: 180, isAura: true },
};

// Color map for phase groups (matches phase colors)
const GROUP_COLORS = {
  spark:   { active: '#4f8cff', glow: 'rgba(79,140,255,0.4)' },
  build:   { active: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
  master:  { active: '#ff6d00', glow: 'rgba(255,109,0,0.5)' },
};

function RobotPart({ partId, partData, pathData, isUnlocked, index }) {
  const group = partData?.group || 'spark';
  const colors = GROUP_COLORS[group] || GROUP_COLORS.spark;
  const inactiveFill = 'rgba(0,0,0,0.05)';
  const inactiveStroke = 'rgba(0,0,0,0.2)';

  if (!pathData) return null;

  // Full activation aura
  if (pathData.isAura) {
    if (!isUnlocked) return null;
    return (
      <motion.circle
        cx={pathData.cx} cy={pathData.cy} r={pathData.r}
        fill="none"
        stroke={colors.active}
        strokeWidth="2"
        opacity={0.2}
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: pathData.r, opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }

  // Energy core circle
  if (pathData.isEnergy) {
    return (
      <motion.circle
        cx={pathData.cx} cy={pathData.cy} r={pathData.r}
        fill={isUnlocked ? colors.active : inactiveFill}
        stroke={isUnlocked ? colors.active : inactiveStroke}
        strokeWidth={isUnlocked ? 2 : 1}
        initial={isUnlocked ? { scale: 0 } : {}}
        animate={isUnlocked ? {
          scale: 1,
          filter: `drop-shadow(0 0 8px ${colors.glow})`,
        } : {}}
        transition={{ delay: index * 0.1, type: 'spring' }}
      >
        {isUnlocked && (
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </motion.circle>
    );
  }

  // Regular path parts
  return (
    <motion.path
      d={pathData.d}
      fill={isUnlocked ? colors.active : inactiveFill}
      stroke={isUnlocked ? colors.active : inactiveStroke}
      strokeWidth={isUnlocked ? 2 : 1.5}
      opacity={isUnlocked ? 1 : 0.6}
      initial={isUnlocked ? { opacity: 0, scale: 0.8 } : {}}
      animate={isUnlocked ? {
        opacity: 1,
        scale: 1,
        filter: `drop-shadow(0 0 6px ${colors.glow})`,
      } : {}}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformOrigin: `${pathData.cx}px ${pathData.cy}px` }}
    >
      <title>{partData?.label || partId}</title>
    </motion.path>
  );
}

export default function RobotSkillTree({ showLabels = false, size = 'md' }) {
  const completedModules = useGameStore(s => s.completedModules);

  const unlockedParts = useMemo(() => {
    const parts = {};
    completedModules.forEach(moduleId => {
      const robotPart = ROBOT_PARTS[moduleId];
      if (robotPart) {
        parts[robotPart.id] = true;
      }
    });
    return parts;
  }, [completedModules]);

  const totalParts = Object.keys(ROBOT_PARTS).length;
  const unlockedCount = Object.keys(unlockedParts).length;
  const progress = Math.round((unlockedCount / totalParts) * 100);

  const sizeClass = size === 'sm' ? 'rst-small' : size === 'lg' ? 'rst-large' : '';

  return (
    <div className={`robot-skill-tree ${sizeClass}`}>
      {/* Progress header */}
      <div className="rst-header">
        <span className="rst-title">NEBULA BUILD</span>
        <span className="rst-progress">{unlockedCount}/{totalParts} Skills</span>
      </div>

      {/* SVG Robot */}
      <div className="rst-svg-container">
        <svg viewBox="100 100 200 380" className="rst-svg" xmlns="http://www.w3.org/2000/svg">
          {/* Background grid lines */}
          <defs>
            <pattern id="rst-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="100" y="100" width="200" height="380" fill="url(#rst-grid)" />

          {/* Render all parts */}
          {Object.entries(PART_PATHS).map(([partId, pathData], index) => {
            // Find if this part is a primary mapped part
            const primaryPartEntry = Object.entries(ROBOT_PARTS).find(([_, data]) => data.id === partId);
            const partData = primaryPartEntry ? primaryPartEntry[1] : { id: partId, group: 'spark' };
            
            // If it's a primary part, it's unlocked if it's in unlockedParts.
            // If it is a decorative part (like core-energy), we unlock it if mod-10 is done.
            const isUnlocked = primaryPartEntry 
              ? !!unlockedParts[partId] 
              : completedModules.includes('mod-10'); // unlock decorative parts at the end

            return (
              <RobotPart
                key={partId}
                partId={partId}
                partData={partData}
                pathData={pathData}
                isUnlocked={isUnlocked}
                index={index}
              />
            );
          })}

          {/* Labels on hover */}
          {showLabels && Object.entries(ROBOT_PARTS).map(([moduleId, partData]) => {
            const pathData = PART_PATHS[partData.id];
            if (!pathData || pathData.isAura) return null;
            const isUnlocked = !!unlockedParts[partData.id];
            return (
              <text
                key={`label-${partData.id}`}
                x={pathData.cx}
                y={pathData.cy}
                fill={isUnlocked ? '#1a1a2e' : 'rgba(0,0,0,0.2)'}
                fontSize="6"
                fontFamily="'Orbitron', sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
                className="rst-label"
              >
                {partData.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Progress bar */}
      <div className="rst-bar-container">
        <div className="rst-bar-track">
          <motion.div
            className="rst-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <span className="rst-bar-label">{progress}%</span>
      </div>

      {/* Legend — Phase-based */}
      <div className="rst-legend">
        {Object.entries(GROUP_COLORS).map(([group, colors]) => (
          <div key={group} className="rst-legend-item">
            <span className="rst-legend-dot" style={{ background: colors.active }} />
            <span>{group.charAt(0).toUpperCase() + group.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
