import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Trophy, Flame, BookOpen, Clock, Award, RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import ConfidenceMeter from '../components/ui/ConfidenceMeter';
import Button from '../components/ui/Button';
import useGameStore from '../store/gameStore';
import { BADGES, MODULES, PHASES } from '../data/courseData';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { playerName, xp, level, streak, badges, completedModules, getTotalProgress, getPhaseProgress, confidenceRatings, resetProgress, preAssessmentScores } = useGameStore();
  const xpForNext = level * 150;

  const sparkBadges = Object.entries(BADGES).filter(([_, b]) => b.phase === 'spark');
  const buildBadges = Object.entries(BADGES).filter(([_, b]) => b.phase === 'build');
  const masterBadges = Object.entries(BADGES).filter(([_, b]) => b.phase === 'master');

  const completedModuleData = MODULES.filter(m => completedModules.includes(m.id));

  const avgConfidence = Object.values(confidenceRatings).length > 0
    ? (Object.values(confidenceRatings).reduce((a, b) => a + b, 0) / Object.values(confidenceRatings).length).toFixed(1)
    : 0;

  // Pre-test vs current progress comparison
  const currentScore = getTotalProgress();
  const preScore = preAssessmentScores && preAssessmentScores.total > 0 
    ? Math.round((preAssessmentScores.score / preAssessmentScores.total) * 100) 
    : 0;

  return (
    <div className="profile-page">
      <button className="profile-back" onClick={() => navigate('/dashboard')}>
        <ChevronLeft size={20} />
        <span>Dashboard</span>
      </button>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="profile-header" glow="blue">
          <div className="profile-avatar-large">
            <span>{playerName.charAt(0).toUpperCase()}</span>
            <div className="profile-level-badge">Lv.{level}</div>
          </div>
          <div className="profile-info">
            <h1>{playerName}</h1>
            <p className="profile-title">Industrial Robotics {level >= 5 ? 'Expert' : level >= 3 ? 'Engineer' : 'Cadet'}</p>
            <div className="profile-xp-area">
              <ProgressBar value={xp} max={xpForNext} gradient="linear-gradient(90deg, #00e676, #00e5ff)" height={8} label={`${xp}/${xpForNext} XP to Level ${level + 1}`} showValue={false} />
            </div>
          </div>
          <div className="profile-stats-grid">
            <div className="profile-stat">
              <Star size={18} className="stat-icon-cyan" />
              <span className="pstat-val">{level}</span>
              <span className="pstat-lbl">Level</span>
            </div>
            <div className="profile-stat">
              <Flame size={18} className="stat-icon-orange" />
              <span className="pstat-val">{streak}</span>
              <span className="pstat-lbl">Streak</span>
            </div>
            <div className="profile-stat">
              <BookOpen size={18} className="stat-icon-blue" />
              <span className="pstat-val">{completedModules.length}</span>
              <span className="pstat-lbl">Modules</span>
            </div>
            <div className="profile-stat">
              <Trophy size={18} className="stat-icon-purple" />
              <span className="pstat-val">{badges.length}</span>
              <span className="pstat-lbl">Badges</span>
            </div>
            <div className="profile-stat">
              <Award size={18} className="stat-icon-green" />
              <span className="pstat-val">{avgConfidence || 'N/A'}</span>
              <span className="pstat-lbl">Avg Conf.</span>
            </div>
            <div className="profile-stat">
              <Clock size={18} className="stat-icon-cyan" />
              <span className="pstat-val">{Math.round(completedModules.length * 2.25)}h</span>
              <span className="pstat-lbl">Hours</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Pre-test vs Current comparison */}
      <div className="profile-section">
        <h2><TrendingUp size={20} /> Learning Progress Comparison</h2>
        <GlassCard className="profile-comparison-card">
          <div className="comparison-bars">
            <div className="comp-row">
              <span className="comp-label">Pre-Assessment</span>
              <div className="comp-bar-container">
                <div className="comp-bar pre" style={{ width: `${preScore}%` }} />
              </div>
              <span className="comp-value">{preScore}%</span>
            </div>
            <div className="comp-row">
              <span className="comp-label">Current Progress</span>
              <div className="comp-bar-container">
                <div className="comp-bar current" style={{ width: `${currentScore}%` }} />
              </div>
              <span className="comp-value">{currentScore}%</span>
            </div>
            {currentScore > preScore && (
              <div className="comp-improvement">
                <TrendingUp size={14} />
                <span>+{currentScore - preScore}% improvement since pre-assessment</span>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Confidence Meter */}
      <div className="profile-section">
        <h2><BarChart3 size={20} /> Confidence Ratings</h2>
        {Object.keys(confidenceRatings).length > 0 ? (
          <div className="profile-confidence-grid">
            {completedModuleData.map(mod => (
              <GlassCard key={mod.id} className="profile-conf-item">
                <h4>{mod.title}</h4>
                <ConfidenceMeter value={confidenceRatings[mod.id] || 0} max={5} />
              </GlassCard>
            ))}
          </div>
        ) : (
          <p className="profile-empty">Complete modules to see your confidence ratings.</p>
        )}
      </div>

      {/* Phase progress */}
      <div className="profile-section">
        <h2>Phase Progress</h2>
        <div className="profile-progress-cards">
          {Object.values(PHASES).map(phase => (
            <GlassCard key={phase.id} className="profile-progress-card">
              <div className="pp-header">
                <span className="pp-name" style={{ color: phase.color }}>{phase.name}</span>
                <span className="pp-percent">{getPhaseProgress(phase.id)}%</span>
              </div>
              <ProgressBar value={getPhaseProgress(phase.id)} gradient={phase.gradient} height={6} showValue={false} />
            </GlassCard>
          ))}
        </div>
        <div className="profile-total-progress">
          <ProgressBar value={getTotalProgress()} gradient="var(--gradient-primary)" height={8} label="Overall Course Progress" />
        </div>
      </div>

      {/* Badges */}
      <div className="profile-section">
        <h2>Badge Collection</h2>

        {[
          { id: 'spark', data: sparkBadges, color: PHASES.spark.color },
          { id: 'build', data: buildBadges, color: PHASES.build.color },
          { id: 'master', data: masterBadges, color: PHASES.master.color },
        ].map(group => (
          <div key={group.id} className="badge-group">
            <div className="badge-group-grid">
              {group.data.map(([id, badge]) => (
                <Badge key={id} icon={badge.icon} name={badge.name} earned={badges.includes(id)} description={badge.description} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completed modules */}
      <div className="profile-section">
        <h2>Completed Modules</h2>
        {completedModuleData.length === 0 ? (
          <p className="profile-empty">No modules completed yet. Start your journey!</p>
        ) : (
          <div className="profile-completed-list">
            {completedModuleData.map(mod => (
              <GlassCard key={mod.id} className="profile-completed-item" onClick={() => navigate(`/module/${mod.id}`)}>
                <h4>{mod.title}</h4>
                <div className="pci-meta">
                  <span>+{mod.xpReward} XP</span>
                  {confidenceRatings[mod.id] && <span>⭐ {confidenceRatings[mod.id]}/5</span>}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="profile-section profile-danger">
        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Reset all progress?')) resetProgress(); }} icon={<RefreshCw size={14} />}>
          Reset Progress
        </Button>
      </div>
    </div>
  );
}
