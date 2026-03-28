import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Zap, Lock, CheckCircle, Clock, ArrowRight, BookOpen, Layers, Crown } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { MODULES, PHASES, BADGES, CATALOG_GRADIENTS, CATALOG_RATINGS } from '../data/courseData';
import './CourseCatalog.css';

const FILTERS = [
  { key: 'all', label: 'All Modules' },
];

export default function CourseCatalog() {
  const navigate = useNavigate();
  const { completedModules, unlockedModules } = useGameStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const totalDone = completedModules.length;

  const filtered = useMemo(() => {
    return MODULES.filter(m => {
      if (search) {
        const s = search.toLowerCase();
        return m.title.toLowerCase().includes(s) || m.subtitle.toLowerCase().includes(s) ||
          m.topics.some(t => t.toLowerCase().includes(s));
      }
      return true;
    });
  }, [search]);

  // Find next uncompleted module for the featured banner
  const nextModule = MODULES.find(m => (m.id === 'mod-1' || unlockedModules.includes(m.id)) && !completedModules.includes(m.id));

  const getCategoryLabel = (phase) => {
    if (phase === 'spark') return 'FOUNDATION';
    if (phase === 'build') return 'PROGRAMMING';
    return 'ADVANCED';
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="catalog-header-left">
          <span className="catalog-breadcrumb">SILF-45 INDUSTRIAL ROBOTICS</span>
          <h1>Course Catalog</h1>
          <p>Master industrial automation across {MODULES.length} modules covering fundamentals, programming, and advanced integration.</p>
        </div>
      </div>

      {/* Search */}
      <div className="catalog-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search modules, lessons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Summary bar */}
      <div className="catalog-phase-bar">
        <div className="cpb-item">
          <BookOpen size={14} className="cpb-icon spark" />
          <span className="cpb-label">Total Modules</span>
          <span className="cpb-desc">Each module has 3 learning phases</span>
          <span className="cpb-count">{totalDone}/{MODULES.length} done</span>
        </div>
      </div>

      {/* Featured module banner */}
      {nextModule && (
        <motion.div
          className="catalog-featured"
          style={{ background: CATALOG_GRADIENTS[nextModule.id] }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="cf-content">
            <h2>{nextModule.title}</h2>
            <p>{nextModule.description.substring(0, 120)}...</p>
            <div className="cf-meta">
              <button className="cf-continue" onClick={() => navigate(`/module/${nextModule.id}`)}>
                Continue <ArrowRight size={14} />
              </button>
              <span className="cf-xp"><Clock size={12} /> {nextModule.duration} · <Star size={12} /> +{nextModule.xpReward} XP</span>
            </div>
          </div>
          <div className="cf-badge-area">
            <span className="cf-badge-icon">{BADGES[nextModule.badge]?.icon || '📘'}</span>
          </div>
        </motion.div>
      )}

      {/* Course card grid */}
      <div className="catalog-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((mod, i) => {
            const isCompleted = completedModules.includes(mod.id);
            const isLocked = mod.id !== 'mod-1' && !unlockedModules.includes(mod.id);
            const rating = CATALOG_RATINGS[mod.id] || 4.5;

            return (
              <motion.div
                key={mod.id}
                className={`catalog-card ${isLocked ? 'locked' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !isLocked && navigate(`/module/${mod.id}`)}
              >
                <div className="cc-gradient" style={{ background: CATALOG_GRADIENTS[mod.id] }}>
                  {isCompleted && (
                    <span className="cc-completed-badge"><CheckCircle size={12} /> COMPLETED</span>
                  )}
                  {isLocked && (
                    <span className="cc-lock-icon"><Lock size={16} /></span>
                  )}
                  <span className="cc-card-icon">{BADGES[mod.badge]?.icon || '📘'}</span>
                </div>
                <div className="cc-body">
                  <span className="cc-category" style={{ color: '#0ea5e9' }}>
                    MODULE {MODULES.indexOf(mod) + 1}
                  </span>
                  <h3>{mod.title}</h3>
                  <p>{mod.subtitle}</p>
                  <div className="cc-footer">
                    <span className="cc-author">by SILF-45</span>
                    <span className="cc-rating">
                      <Star size={10} className="cc-star" /> {rating}
                    </span>
                    <span className="cc-xp"><Zap size={10} /> +{mod.xpReward}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
