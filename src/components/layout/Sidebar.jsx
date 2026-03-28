import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Layers, Crown, User, Trophy, ChevronLeft, ChevronRight, Rocket, StickyNote, RotateCcw, BookOpen, GitBranch, Medal, Award, FileText } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import ProgressBar from '../ui/ProgressBar';
import ThemeToggle from '../ui/ThemeToggle';
import NotesPanel from './NotesPanel';
import RecapPanel from '../ui/RecapPanel';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/catalog', icon: BookOpen, label: 'Catalog' },
  { path: '/skill-tree', icon: GitBranch, label: 'Skill Tree' },
  { path: '/leaderboard', icon: Medal, label: 'Leaderboard' },
  { path: '/badges', icon: Award, label: 'Badges' },
  { path: '/portfolio', icon: FileText, label: 'Portfolio' },
  { path: '/capstone', icon: Trophy, label: 'Capstone' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const location = useLocation();
  const { xp, level, playerName, getTotalProgress } = useGameStore();
  const xpForNext = level * 150;

  return (
    <>
      <motion.aside
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo + Theme Toggle */}
        <div className="sidebar-logo">
          <img src="/nebula-logo.png" alt="Nebula" className="sidebar-logo-icon" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="sidebar-logo-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                NEBULA
              </motion.span>
            )}
          </AnimatePresence>
          <div className="sidebar-theme-toggle">
            <ThemeToggle />
          </div>
        </div>

        {/* Player card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar-player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="sidebar-avatar">
                <span>{playerName.charAt(0).toUpperCase()}</span>
                <div className="sidebar-level">Lv.{level}</div>
              </div>
              <div className="sidebar-player-info">
                <span className="sidebar-player-name">{playerName}</span>
                <ProgressBar
                  value={xp}
                  max={xpForNext}
                  gradient="linear-gradient(90deg, #00e676, #00e5ff)"
                  height={4}
                  showValue={false}
                />
                <span className="sidebar-xp-text">{xp} / {xpForNext} XP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="sidebar-avatar-mini">
            <span>{playerName.charAt(0).toUpperCase()}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="sidebar-nav-icon">
                  <Icon size={20} />
                  {isActive && <div className="sidebar-active-dot" />}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="sidebar-nav-label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}

          {/* Notes button */}
          <button
            className={`sidebar-nav-item sidebar-notes-btn ${notesOpen ? 'active' : ''}`}
            onClick={() => setNotesOpen(!notesOpen)}
            title={collapsed ? 'Notes' : undefined}
          >
            <div className="sidebar-nav-icon">
              <StickyNote size={20} />
              {notesOpen && <div className="sidebar-active-dot" />}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="sidebar-nav-label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Notes
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Recap button */}
          <button
            className={`sidebar-nav-item sidebar-notes-btn ${recapOpen ? 'active' : ''}`}
            onClick={() => setRecapOpen(!recapOpen)}
            title={collapsed ? 'Recap' : undefined}
          >
            <div className="sidebar-nav-icon">
              <RotateCcw size={20} />
              {recapOpen && <div className="sidebar-active-dot" />}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="sidebar-nav-label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Recap
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Progress */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressBar
                value={getTotalProgress()}
                label="Course Progress"
                gradient="var(--gradient-primary)"
                height={6}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </motion.aside>

      {/* Notes panel overlay */}
      <NotesPanel isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
      {notesOpen && (
        <div className="notes-overlay" onClick={() => setNotesOpen(false)} />
      )}

      {/* Recap panel */}
      <RecapPanel isOpen={recapOpen} onClose={() => setRecapOpen(false)} />
    </>
  );
}
