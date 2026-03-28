import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ChevronRight, Cpu, Move, Wrench, Code, Timer, Shield, CheckCircle } from 'lucide-react';
import Button from './Button';
import GlassCard from './GlassCard';
import CapstoneWorkcell from '../3d/CapstoneWorkcell';

const PHASES = [
  { 
    id: 0, 
    icon: <Cpu size={20} />, 
    title: 'Select Robot Type', 
    desc: 'Choose the appropriate robot for an automotive welding application.',
    question: 'Which robot type provides the highest flexibility and reach for complex 3D welding paths?',
    options: ['SCARA Robot', 'Delta Robot', 'Articulated Robot', 'Cartesian Robot'],
    correct: 2,
    explanation: 'An articulated robot (often 6-axis) gives the highest flexibility, allowing the welding torch to reach around automotive frames from different angles.'
  },
  { 
    id: 1, 
    icon: <Move size={20} />, 
    title: 'Define Work Envelope', 
    desc: 'Expand the reach to cover the entire work zone without colliding with the fencing boundaries.',
    question: 'What defines the maximum physical volume a robot can reach?',
    options: ['Payload Capacity', 'Work Envelope / Workspace', 'Degrees of Freedom', 'TCP Velocity'],
    correct: 1,
    explanation: 'The Work Envelope is the precise 3D boundary representing the outermost limit of the robot\'s physical reach.'
  },
  { 
    id: 2, 
    icon: <Wrench size={20} />, 
    title: 'Choose EOAT', 
    desc: 'Attach the correct End-of-Arm Tooling for the welding task.',
    question: 'When a 5kg welding torch is attached, how does it affect the robot payload?',
    options: ['It increases the robot\'s lifting capacity', 'It does not affect payload if it\'s just a welding torch', 'It reduces the remaining allowable payload for the workpiece', 'It only affects speed, not payload'],
    correct: 2,
    explanation: 'The mass of the EOAT must be subtracted from the robot\'s maximum rated payload to determine how much part weight it can safely move.'
  },
  { 
    id: 3, 
    icon: <Code size={20} />, 
    title: 'Program Task Sequence', 
    desc: 'Set the pickup and placement positions. The path will be automatically generated.',
    question: 'Which motion type ensures the Tool Center Point (TCP) moves in a perfect straight line between two points?',
    options: ['Joint Motion (J)', 'Linear Motion (L)', 'Circular Motion (C)', 'Spline Motion'],
    correct: 1,
    explanation: 'Linear motion commands the controller to calculate the complex joint speeds required to keep the TCP strictly on a linear path.'
  },
  { 
    id: 4, 
    icon: <Timer size={20} />, 
    title: 'Optimize Cycle Time', 
    desc: 'Throttle the speed up to 3x multiplier to reduce cycle time.',
    question: 'What is a software method to reduce cycle time without changing hardware or max velocity?',
    options: ['Removing safety sensors', 'Using path blending (continuous path) between points', 'Changing to a heavier EOAT', 'Using only circular motions'],
    correct: 1,
    explanation: 'Path blending allows the robot to round corners without fully stopping at each intermediate waypoint, significantly speeding up cycle times.'
  },
  { 
    id: 5, 
    icon: <Shield size={20} />, 
    title: 'Safety Measures', 
    desc: 'Place physical safety perimeters around your active robotic cell.',
    question: 'According to ISO 10218, if a human breaks the light curtain perimeter, the robot must:',
    options: ['Sound an alarm but keep working', 'Immediately initiate a Safety Rated Monitored Stop or Protective Stop', 'Slow down by 10%', 'Disconnect main factory power'],
    correct: 1,
    explanation: 'Breaking a perimeter safety device requires the robot to immediately enter an active, monitored safety stop to prevent human injury.'
  }
];

export default function InteractiveCapstoneWizard({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // 3D Scene State
  const [robotType, setRobotType] = useState('Articulated');
  const [envelopeRadius, setEnvelopeRadius] = useState(2);
  const [eoat, setEoat] = useState('welder');
  const [pathPoints, setPathPoints] = useState([ [-2, 0.5, 0], [2, 0.5, 0] ]);
  const [speed, setSpeed] = useState(1);
  const [safetyPlaced, setSafetyPlaced] = useState(false);

  const phaseData = PHASES[currentPhase];

  const handleAnswer = (index) => {
    if (questionAnswered) return;
    setSelectedAnswer(index);
    if (index === phaseData.correct) {
      setQuestionAnswered(true);
    }
  };

  const handleNextPhase = () => {
    if (currentPhase < PHASES.length - 1) {
      setCurrentPhase(prev => prev + 1);
      setQuestionAnswered(false);
      setSelectedAnswer(null);
    } else {
      onComplete(); // Trigger final assessment
    }
  };

  // Phase Controls Instruction
  const renderControls = () => {
    switch(currentPhase) {
      case 0:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click on one of the three floating robot models (Articulated, SCARA, Delta) in the environment to select your chassis.</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Current Selection: {robotType}</p>
          </div>
        );
      case 1:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click on the blue Work Envelope boundary in the 3D scene to expand its radius (Cycles between 1m - 4m).</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Current Radius: {envelopeRadius}m</p>
          </div>
        );
      case 2:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click on the floating End-of-Arm Tooling items around the robot to attach them.</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Current Tool: <span style={{ textTransform: 'capitalize' }}>{eoat}</span></p>
          </div>
        );
      case 3:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click on the Pick (Purple) or Place (Green) targets to cycle their positions along the conveyor line.</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Path length initialized.</p>
          </div>
        );
      case 4:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click directly on the moving robot to increase the cycle speed multiplier.</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Current Speed: {speed}x</p>
          </div>
        );
      case 5:
        return (
          <div className="wizard-controls">
            <p><strong>3D Interaction:</strong> Click the yellow perimeter hazard zones to install physical safety fencing.</p>
            <p style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>Safety Active: {safetyPlaced ? 'Yes' : 'No'}</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="interactive-capstone-container">
      {/* Left Panel - UI & Questions */}
      <div className="icc-sidebar">
        
        <div className="icc-header">
          <div className="icc-phase-indicator">
            PHASE {currentPhase + 1} OF 6
          </div>
          <h2 className="icc-title">{phaseData.title}</h2>
          <p className="icc-desc">{phaseData.desc}</p>
        </div>

        {/* 3D Interaction Controls */}
        <GlassCard glow="blue" className="icc-controls-card">
          <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>Simulation Mission</h4>
          {renderControls()}
        </GlassCard>

        {/* Mastery Question Gate */}
        <div className="icc-question-section">
          <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Mastery Question Check</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            {phaseData.question}
          </p>
          
          <div className="icc-options">
            {phaseData.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = phaseData.correct === i;
              
              let btnClass = 'icc-option ';
              if (questionAnswered) {
                if (isCorrect) btnClass += 'correct';
                else if (isSelected) btnClass += 'wrong';
                else btnClass += 'disabled';
              } else if (isSelected) {
                btnClass += 'selected';
              }

              return (
                <button 
                  key={i} 
                  className={btnClass}
                  onClick={() => handleAnswer(i)}
                  disabled={questionAnswered}
                >
                  <span className="icc-opt-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {questionAnswered && (
              <motion.div 
                className="icc-success-msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '8px' }}>
                  <CheckCircle size={16} /> 
                  <span>Correct!</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{phaseData.explanation}</p>
                <Button variant="primary" size="lg" glow onClick={handleNextPhase} className="icc-next-btn">
                  {currentPhase === 5 ? 'Finalize Workcell' : 'Proceed to Next Phase'} <ChevronRight size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Right Panel - 3D Canvas */}
      <div className="icc-canvas-wrapper">
        <Canvas shadows camera={{ position: [5, 4, 5], fov: 50 }}>
          <color attach="background" args={['#0a0a16']} />
          <fog attach="fog" args={['#0a0a16', 5, 20]} />
          
          <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go below floor
          />
          
          <Environment preset="warehouse" />
          
          <CapstoneWorkcell 
            phase={currentPhase}
            robotType={robotType}
            setRobotType={setRobotType}
            envelopeRadius={envelopeRadius}
            setEnvelopeRadius={setEnvelopeRadius}
            eoat={eoat}
            setEoat={setEoat}
            pathPoints={pathPoints}
            setPathPoints={setPathPoints}
            animationSpeed={speed}
            setAnimationSpeed={setSpeed}
            safetyPlaced={safetyPlaced}
            setSafetyPlaced={setSafetyPlaced}
          />
        </Canvas>
        
        {/* Floating phase hint over canvas */}
        <div className="icc-canvas-overlay">
          <div className="icon-wrap">{phaseData.icon}</div>
          <span>Phase {currentPhase + 1}: {phaseData.title}</span>
        </div>
      </div>
    </div>
  );
}
