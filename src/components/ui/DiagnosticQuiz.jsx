import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import './DiagnosticQuiz.css';

export default function DiagnosticQuiz({ playerName, onComplete }) {
  const savePreAssessment = useGameStore(s => s.savePreAssessment);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'PRE_ASSESSMENT_COMPLETE') {
        const score = event.data.score;
        let level = 'beginner';
        if (score >= 6) level = 'advanced';
        else if (score >= 4) level = 'intermediate';

        // Save progress to the store
        savePreAssessment({ 
          score, 
          total: 8, 
          level, 
          timePerQuestion: [], 
          mode: '3d-interactive', 
          timestamp: Date.now() 
        });

        // Determine starting module
        const startModule = level === 'advanced' ? 'mod-8' : level === 'intermediate' ? 'mod-4' : 'mod-1';
        if (onComplete) {
          onComplete(level, startModule);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete, savePreAssessment]);

  return (
    <motion.div 
      className="diagnostic-overlay" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0f172a', /* Match iframe background */
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {loading && <div style={{ color: 'white', position: 'absolute' }}>Loading 3D Assessment...</div>}
      <iframe
        src="/pre-assessment-3d.html"
        title="3D Pre-Assessment Assessment"
        style={{ width: '100vw', height: '100vh', border: 'none', display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
        allow="fullscreen; accelerometer; gyroscope;"
      />
    </motion.div>
  );
}
