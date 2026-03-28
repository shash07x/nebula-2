import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, AlertTriangle, Eye, Shield, X } from 'lucide-react';
import './FullscreenProctor.css';

export default function FullscreenProctor({ children, onTabSwitch }) {
  const [consented, setConsented] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen request denied:', err);
      // Still allow even if fullscreen fails
      setIsFullscreen(true);
    }
  }, []);

  // Handle consent
  const handleConsent = async () => {
    setConsented(true);
    await enterFullscreen();
  };

  // Detect tab switches (visibility change)
  useEffect(() => {
    if (!consented) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          if (onTabSwitch) onTabSwitch(newCount);
          return newCount;
        });
      } else {
        // User returned — show warning
        setWarningMsg(`Tab switch detected! This is switch #${tabSwitches + 1}. All switches are recorded.`);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [consented, tabSwitches, onTabSwitch]);

  // Detect fullscreen exit
  useEffect(() => {
    if (!consented) return;

    const handleFSChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setWarningMsg('Fullscreen mode exited! Please return to fullscreen to continue.');
        setShowWarning(true);
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, [consented]);

  // Consent dialog
  if (!consented) {
    return (
      <motion.div
        className="proctor-consent-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="proctor-consent-card"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="proctor-consent-icon">
            <Shield size={40} />
          </div>
          <h2>Assessment Mode</h2>
          <p className="proctor-consent-desc">
            This assessment requires <strong>fullscreen mode</strong>. The following will be monitored:
          </p>

          <div className="proctor-rules">
            <div className="proctor-rule">
              <Maximize size={16} />
              <span>Fullscreen will be activated</span>
            </div>
            <div className="proctor-rule">
              <Eye size={16} />
              <span>Tab switches will be detected and recorded</span>
            </div>
            <div className="proctor-rule">
              <AlertTriangle size={16} />
              <span>Exiting fullscreen will trigger a warning</span>
            </div>
          </div>

          <p className="proctor-consent-note">
            Please close all other tabs and applications before starting.
          </p>

          <motion.button
            className="proctor-start-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConsent}
          >
            <Shield size={16} />
            I Agree — Enter Assessment
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="proctor-active">
      {/* Status bar */}
      <div className="proctor-status-bar">
        <div className="proctor-status-left">
          <div className={`proctor-indicator ${isFullscreen ? 'active' : 'warning'}`} />
          <span>{isFullscreen ? 'Fullscreen Active' : 'Fullscreen Required'}</span>
        </div>
        <div className="proctor-status-right">
          <Eye size={13} />
          <span className={tabSwitches > 0 ? 'proctor-tab-warn' : ''}>
            Tab Switches: {tabSwitches}
          </span>
          {!isFullscreen && (
            <button className="proctor-reenter-btn" onClick={enterFullscreen}>
              <Maximize size={12} /> Re-enter Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* Warning overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="proctor-warning"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AlertTriangle size={16} />
            <span>{warningMsg}</span>
            <button onClick={() => setShowWarning(false)}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assessment content */}
      {children}
    </div>
  );
}
