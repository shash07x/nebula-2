import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Calendar, BookOpen, Trash2, Plus, Award, Target, Trophy, CheckCircle, Star } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { MODULES } from '../data/courseData';
import './Portfolio.css';

const STORAGE_KEY = 'nebula-portfolio';

function loadPortfolio() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePortfolio(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const OUTPUT_TYPES = [
  { value: 'process-flow', label: 'Applied Process Flow', icon: '🔄' },
  { value: 'safety-checklist', label: 'Safety Checklist', icon: '🛡️' },
  { value: 'sensor-matrix', label: 'Sensor Selection Matrix', icon: '📡' },
  { value: 'robot-design', label: 'Robot System Design', icon: '🤖' },
  { value: 'capstone', label: 'Capstone Project', icon: '👑' },
  { value: 'report', label: 'Research Report', icon: '📝' },
  { value: 'diagram', label: 'Architecture Diagram', icon: '📊' },
  { value: 'other', label: 'Other', icon: '📁' },
];

export default function Portfolio() {
  const [items, setItems] = useState(loadPortfolio);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'process-flow', title: '', module: '', content: '' });
  const [activeTab, setActiveTab] = useState('evidence'); // 'evidence' | 'outputs'

  // Game Store Data for Employability Proof
  const xp = useGameStore(s => s.xp);
  const level = useGameStore(s => s.level);
  const completedModules = useGameStore(s => s.completedModules);
  const masteryResults = useGameStore(s => s.masteryResults);
  const badges = useGameStore(s => s.badges);
  const postAssessmentScores = useGameStore(s => s.postAssessmentScores);

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const item = {
      id: Date.now(),
      type: newItem.type,
      title: newItem.title.trim(),
      module: newItem.module.trim(),
      content: newItem.content.trim(),
      date: new Date().toISOString(),
    };
    const updated = [item, ...items];
    setItems(updated);
    savePortfolio(updated);
    setNewItem({ type: 'process-flow', title: '', module: '', content: '' });
    setShowAdd(false);
  };

  const deleteItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    savePortfolio(updated);
  };

  const downloadItem = (item) => {
    const text = `${item.title}\n${'='.repeat(40)}\nType: ${OUTPUT_TYPES.find(t => t.value === item.type)?.label || item.type}\nModule: ${item.module || 'General'}\nDate: ${new Date(item.date).toLocaleDateString()}\n\n${item.content}\n\n---\nExported from Nebula KnowLab Portfolio`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeInfo = (value) => OUTPUT_TYPES.find(t => t.value === value) || OUTPUT_TYPES[OUTPUT_TYPES.length - 1];

  // Calculate Average Mastery Score
  const masteryKeys = Object.keys(masteryResults).filter(k => k !== 'capstone');
  const avgMastery = masteryKeys.length 
    ? Math.round(masteryKeys.reduce((acc, key) => {
        const res = masteryResults[key];
        return acc + (res.score / Math.max(res.total, 1)) * 100;
      }, 0) / masteryKeys.length)
    : 0;

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div className="portfolio-header-left">
          <span className="portfolio-breadcrumb">FOUNDATION OF ROBOTICS</span>
          <h1>My Portfolio</h1>
          <p>Your comprehensive record of skills, achievements, and tangible outputs.</p>
        </div>
        {activeTab === 'outputs' && (
            <button className="portfolio-add-btn" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Output
            </button>
        )}
      </div>

      <div className="portfolio-tabs">
        <button className={`pf-tab ${activeTab === 'evidence' ? 'active' : ''}`} onClick={() => setActiveTab('evidence')}>
          <Award size={18} /> Course Evidence
        </button>
        <button className={`pf-tab ${activeTab === 'outputs' ? 'active' : ''}`} onClick={() => setActiveTab('outputs')}>
          <FileText size={18} /> My Outputs
        </button>
      </div>

      {activeTab === 'evidence' && (
        <motion.div className="pf-evidence-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Performance Scores */}
          <section className="pf-section">
            <h2 className="pf-section-title"><Target size={20} /> Performance Scores</h2>
            <div className="pf-stats-grid">
              <div className="pf-stat-card">
                <div className="pf-stat-val">{level}</div>
                <div className="pf-stat-lbl">Current Level (XP: {xp})</div>
              </div>
              <div className="pf-stat-card">
                <div className="pf-stat-val">{completedModules.length} / 10</div>
                <div className="pf-stat-lbl">Modules Completed</div>
              </div>
              <div className="pf-stat-card">
                <div className="pf-stat-val">{avgMastery}%</div>
                <div className="pf-stat-lbl">Avg Mastery Score</div>
              </div>
            </div>
          </section>

          {/* Capstone Project */}
          <section className="pf-section">
            <h2 className="pf-section-title"><Trophy size={20} /> Capstone Project</h2>
            {postAssessmentScores ? (
                <div className="pf-capstone-card completed">
                    <div className="pf-capstone-icon">👑</div>
                    <div className="pf-capstone-info">
                        <h3>Robotics Foundation Final Assessment</h3>
                        <p>Certified Level: <strong>{postAssessmentScores.level.toUpperCase()}</strong></p>
                        <p>Score: {postAssessmentScores.score} / {postAssessmentScores.total}</p>
                    </div>
                </div>
            ) : (
                <div className="pf-capstone-card locked">
                    <div className="pf-capstone-icon">🔒</div>
                    <div className="pf-capstone-info">
                        <h3>Final Capstone Not Yet Completed</h3>
                        <p>Complete all 10 modules to unlock and attempt the proctored capstone assessment.</p>
                    </div>
                </div>
            )}
          </section>

          {/* Skill Badges */}
          <section className="pf-section">
            <h2 className="pf-section-title"><Award size={20} /> Skill Badges</h2>
            {badges.length > 0 ? (
                <div className="pf-badges-grid">
                    {badges.map(b => (
                        <div key={b} className="pf-badge-item">
                            <div className="pf-badge-icon">🎖️</div>
                            <div className="pf-badge-name">{b.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="pf-empty-text">No badges earned yet. Complete modules to collect skill badges.</p>
            )}
          </section>

          {/* Solved Challenges & Mini Projects */}
          <section className="pf-section">
            <h2 className="pf-section-title"><CheckCircle size={20} /> Solved Challenges & Mini Projects</h2>
            {masteryKeys.length > 0 ? (
                <div className="pf-challenges-list">
                    {masteryKeys.map(moduleId => {
                        const modData = MODULES.find(m => m.id === moduleId);
                        const result = masteryResults[moduleId];
                        if (!modData || !result) return null;
                        const pct = Math.round((result.score / result.total) * 100);
                        return (
                            <div key={moduleId} className="pf-challenge-item">
                                <div className="pf-challenge-main">
                                    <div className="pf-challenge-icon"><Star size={16} fill={pct >= 70 ? "#10b981" : "transparent"} color={pct >= 70 ? "#10b981" : "#cbd5e1"} /></div>
                                    <div>
                                        <h4>{modData.title} Mini Project</h4>
                                        <p>Demonstrated mastery of: {modData.outcomes ? modData.outcomes[0] : 'Core concepts'}</p>
                                    </div>
                                </div>
                                <div className="pf-challenge-score">
                                    <span className={`pf-score-pill ${pct >= 70 ? 'pass' : 'fail'}`}>{pct}% Score</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="pf-empty-text">No solved challenges recorded. Pass module Mastery exercises to build this list.</p>
            )}
          </section>

        </motion.div>
      )}

      {activeTab === 'outputs' && (
        <motion.div className="pf-outputs-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Add form overlay */}
            <AnimatePresence>
                {showAdd && (
                <motion.div className="portfolio-add-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="portfolio-add-form" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                    <h3>Add Portfolio Output</h3>
                    <label>Type</label>
                    <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })}>
                        {OUTPUT_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                    </select>
                    <label>Title</label>
                    <input type="text" placeholder="e.g., Warehouse Robot Sensor Plan" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                    <label>Source Module</label>
                    <input type="text" placeholder="e.g., Sensors in Robotics" value={newItem.module} onChange={e => setNewItem({ ...newItem, module: e.target.value })} />
                    <label>Content</label>
                    <textarea placeholder="Describe your output, findings, or design..." value={newItem.content} onChange={e => setNewItem({ ...newItem, content: e.target.value })} rows={6} />
                    <div className="portfolio-add-actions">
                        <button className="pf-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="pf-save" onClick={addItem} disabled={!newItem.title.trim()}>Save to Portfolio</button>
                    </div>
                    </motion.div>
                </motion.div>
                )}
            </AnimatePresence>

            {/* Portfolio grid */}
            {items.length === 0 ? (
                <div className="portfolio-empty">
                <FileText size={48} className="portfolio-empty-icon" />
                <h3>Your manually added outputs are here</h3>
                <p>Complete module Apply tasks and add your custom reports or designs.</p>
                </div>
            ) : (
                <div className="portfolio-grid">
                {items.map((item, i) => {
                    const type = typeInfo(item.type);
                    return (
                    <motion.div key={item.id} className="portfolio-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className="pf-card-type">{type.icon} {type.label}</div>
                        <h3 className="pf-card-title">{item.title}</h3>
                        <p className="pf-card-content">{item.content ? item.content.substring(0, 120) + (item.content.length > 120 ? '...' : '') : 'No description'}</p>
                        <div className="pf-card-meta">
                        <span><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                        {item.module && <span><BookOpen size={12} /> {item.module}</span>}
                        </div>
                        <div className="pf-card-actions">
                        <button onClick={() => downloadItem(item)} title="Download"><Download size={14} /></button>
                        <button onClick={() => deleteItem(item.id)} title="Delete" className="pf-delete"><Trash2 size={14} /></button>
                        </div>
                    </motion.div>
                    );
                })}
                </div>
            )}
        </motion.div>
      )}
    </div>
  );
}
