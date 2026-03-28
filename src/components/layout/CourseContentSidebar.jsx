import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Play, Lock, ChevronRight, BookOpen } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { MODULES } from '../../data/courseData';
import ProgressBar from '../ui/ProgressBar';
import './CourseContentSidebar.css';

// Map 7 learning steps to 3 phases
const PHASE_STEPS = [
  { phase: '', color: '#FF2D55', steps: [{ idx: 0, name: 'Hook' }, { idx: 1, name: 'Micro Learning' }] },
  { phase: '', color: '#4CD964', steps: [{ idx: 2, name: 'Guided Practice' }, { idx: 3, name: 'Challenge' }] },
  { phase: '', color: '#5AC8FA', steps: [{ idx: 4, name: 'Real-World' }, { idx: 5, name: 'Reflection' }, { idx: 6, name: 'Upgrade' }] },
];

function CourseContentSidebar({ currentModuleId, currentStep, completedSteps = new Set(), onStepChange }) {
  const navigate = useNavigate();
  const { completedModules, unlockedModules } = useGameStore();

  const totalModules = MODULES.length;
  const doneModules = completedModules.length;
  const currentModule = MODULES.find(m => m.id === currentModuleId);

  return (
    <div className="ccs-sidebar">
      {/* Header */}
      <div className="ccs-header">
        <BookOpen size={16} />
        <span className="ccs-title">Course Content</span>
      </div>

      {/* Progress */}
      <div className="ccs-progress">
        <ProgressBar
          value={Math.round((doneModules / totalModules) * 100)}
          gradient="linear-gradient(90deg, #3b6de0, #7c3aed)"
          height={5}
          showValue={false}
        />
        <span className="ccs-progress-label">{doneModules}/{totalModules} lessons</span>
      </div>

      {/* Flat module list */}
      <div className="ccs-module-list">
        {MODULES.map((mod, i) => {
          const isActive = mod.id === currentModuleId;
          const isDone = completedModules.includes(mod.id);
          const isLocked = !unlockedModules.includes(mod.id);

          return (
            <div key={mod.id} className="ccs-phase-group">
              <button
                className={`ccs-module-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && navigate(`/module/${mod.id}`)}
                disabled={isLocked}
              >
                <span className="ccs-item-icon">
                  {isDone ? (
                    <Check size={12} />
                  ) : isActive ? (
                    <Play size={10} />
                  ) : isLocked ? (
                    <Lock size={10} />
                  ) : (
                    <span className="ccs-item-dot" />
                  )}
                </span>
                <div className="ccs-item-info">
                  <span className="ccs-item-title">{mod.title}</span>
                  {isActive && (
                    <span className="ccs-now-playing">NOW PLAYING</span>
                  )}
                </div>
                {!isLocked && <ChevronRight size={12} className="ccs-item-arrow" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sub-topics & Learning Steps of current module — grouped by Spark/Build/Master */}
      {currentModule && (
        <div className="ccs-subtopics">
          <div className="ccs-subtopics-header">
            <span>Sub-topics</span>
          </div>
          {currentModule.topics.map((topic, ti) => (
            <button
              key={ti}
              className={`ccs-subtopic-item ${ti <= currentStep ? 'covered' : ''}`}
              onClick={() => onStepChange?.(1)}
              title={`Go to: ${topic}`}
            >
              <span className={`ccs-sub-dot ${ti < currentStep ? 'done' : ti === currentStep ? 'active' : ''}`} />
              <span>{topic}</span>
            </button>
          ))}

          {/* Learning Steps grouped by Phase */}
          {PHASE_STEPS.map((phaseGroup) => (
            <div key={phaseGroup.phase} className="ccs-steps-section">
              {phaseGroup.phase && (
                <div className="ccs-subtopics-header">
                  <span style={{ color: phaseGroup.color }}>{phaseGroup.phase}</span>
                </div>
              )}
              {phaseGroup.steps.map(({ idx, name }) => {
                const isStepDone = completedSteps.has(idx);
                const isStepAccessible = idx <= completedSteps.size;
                return (
                  <button
                    key={idx}
                    className={`ccs-subtopic-item clickable ${isStepDone ? 'covered' : ''} ${idx === currentStep ? 'current' : ''} ${!isStepAccessible ? 'step-locked' : ''}`}
                    onClick={() => isStepAccessible && onStepChange?.(idx)}
                    disabled={!isStepAccessible}
                    title={isStepAccessible ? `Navigate to: ${name}` : `Complete previous steps first`}
                  >
                    <span className={`ccs-sub-dot ${isStepDone ? 'done' : idx === currentStep ? 'active' : ''}`} />
                    <span>{name}</span>
                    {idx === currentStep && <span className="ccs-step-now">●</span>}
                    {!isStepAccessible && <Lock size={8} style={{ marginLeft: 'auto', opacity: 0.4 }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(CourseContentSidebar);
