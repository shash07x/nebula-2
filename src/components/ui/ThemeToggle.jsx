import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useGameStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="theme-toggle-track">
        <motion.div
          className="theme-toggle-thumb"
          animate={{ x: isDark ? 0 : 24 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
        <Sun size={12} className="theme-icon sun" />
        <Moon size={12} className="theme-icon moon" />
      </div>
      <div className="theme-toggle-glow" />
    </motion.button>
  );
}
