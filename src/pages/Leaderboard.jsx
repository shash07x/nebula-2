import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Crown, Medal, ChevronDown } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { LEADERBOARD_COMPETITORS } from '../data/courseData';
import './Leaderboard.css';

const COURSES = ['All', 'Operator', 'Programmer', 'Technician', 'Engineer'];

export default function Leaderboard() {
  const { playerName, xp, level, streak } = useGameStore();
  const [courseFilter, setCourseFilter] = useState('All');

  // User entry — default course is 'Operator'
  const userCourse = 'Operator';
  const userEntry = {
    id: 'user',
    name: playerName,
    initial: playerName.charAt(0).toUpperCase(),
    course: userCourse,
    xp: xp + (level - 1) * 150, // total XP (accumulated)
    streak,
    level,
    isUser: true,
  };

  // Cross-course: exclude same-course competitors, include user
  const allEntries = useMemo(() => {
    let list = LEADERBOARD_COMPETITORS
      .filter(c => c.course !== userCourse) // exclude same-course
      .concat(userEntry);

    if (courseFilter !== 'All') {
      list = list.filter(e => e.course === courseFilter || e.isUser);
    }

    return list.sort((a, b) => b.xp - a.xp);
  }, [courseFilter, xp, level, streak, playerName]);

  const top3 = allEntries.slice(0, 3);
  const remaining = allEntries.slice(3);

  const getMedalColor = (rank) => {
    if (rank === 0) return '#ffd700';
    if (rank === 1) return '#c0c0c0';
    if (rank === 2) return '#cd7f32';
    return '#666';
  };

  const getPodiumGradient = (rank) => {
    if (rank === 0) return 'linear-gradient(135deg, #fff8e1, #ffe082)';
    if (rank === 1) return 'linear-gradient(135deg, #f5f5f5, #e0e0e0)';
    if (rank === 2) return 'linear-gradient(135deg, #fbe9e7, #ffccbc)';
    return 'transparent';
  };

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <div className="lb-header-left">
          <Trophy size={24} className="lb-trophy" />
          <div>
            <h1>Leaderboard</h1>
            <p>Resets every Monday · Earn more XP completing Level 3 challenges</p>
          </div>
        </div>
        <div className="lb-course-filter">
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="lb-select-arrow" />
        </div>
      </div>

      {/* Cross-course info */}
      <div className="lb-info">
        <span>🔄 Cross-course competition: Candidates from </span>
        <strong>different</strong>
        <span> courses compete together. Same-course users are excluded.</span>
      </div>

      {/* Top 3 Podium */}
      <div className="lb-podium">
        {top3.map((entry, rank) => (
          <motion.div
            key={entry.id}
            className={`lb-podium-card ${entry.isUser ? 'is-user' : ''}`}
            style={{ background: getPodiumGradient(rank) }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
          >
            <div className="lb-medal" style={{ color: getMedalColor(rank) }}>
              {rank === 0 ? <Crown size={20} /> : <Medal size={18} />}
              <span className="lb-medal-num">{rank + 1}</span>
            </div>
            <div className="lb-avatar" style={{ borderColor: getMedalColor(rank) }}>
              {entry.initial}
            </div>
            <span className="lb-name">{entry.name}</span>
            <span className="lb-course-tag">{entry.course}</span>
            <div className="lb-xp-big">
              <Zap size={14} className="lb-xp-icon" /> {entry.xp.toLocaleString()}
            </div>
            <div className="lb-streak-small">
              <Flame size={11} /> {entry.streak}d
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full list */}
      <div className="lb-list">
        {allEntries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            className={`lb-row ${entry.isUser ? 'is-user' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
          >
            <div className="lb-rank">
              {idx < 3 ? (
                <Trophy size={14} style={{ color: getMedalColor(idx) }} />
              ) : (
                <span className="lb-rank-num">#{idx + 1}</span>
              )}
            </div>
            <div className="lb-row-avatar" style={idx < 3 ? { borderColor: getMedalColor(idx) } : {}}>
              {entry.initial}
            </div>
            <div className="lb-row-info">
              <span className="lb-row-name">
                {entry.name}
                {entry.isUser && <span className="lb-you-badge">you</span>}
              </span>
              <span className="lb-row-course">{entry.course}</span>
            </div>
            <div className="lb-row-stats">
              <span className="lb-row-streak"><Flame size={12} /> {entry.streak}d</span>
              <span className="lb-row-xp"><Zap size={12} /> {entry.xp.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
