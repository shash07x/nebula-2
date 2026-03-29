export const PHASES = {
  spark: {
    id: 'spark',
    name: '',
    subtitle: 'Curiosity + Confidence',
    hours: '1–12',
    goal: 'I can understand robotics.',
    color: '#4f8cff',
    gradient: 'linear-gradient(135deg, #4f8cff, #00e5ff)',
    image: `${import.meta.env.BASE_URL}hero_spark.png`,
    description: 'Build curiosity and confidence with foundational robotics concepts — robot types, components, and sensor systems.',
    outcomes: ['Understand what robots are and their history', 'Identify robot components and architecture', 'Recognize sensors used in robotics'],
    mode: 'theory',
  },
  build: {
    id: 'build',
    name: '',
    subtitle: 'Skill Development',
    hours: '13–30',
    goal: 'I can build and program a robot.',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #e040fb)',
    image: `${import.meta.env.BASE_URL}hero_build.png`,
    description: 'Master practical skills — actuators, kinematics, programming, and control systems for real robot applications.',
    outcomes: ['Work with actuators and motion systems', 'Apply forward and inverse kinematics', 'Program basic robot behaviors', 'Understand control system principles'],
    mode: 'practical',
  },
  master: {
    id: 'master',
    name: '',
    subtitle: 'Real Application',
    hours: '31–45',
    goal: 'I can apply robotics professionally.',
    color: '#ff6d00',
    gradient: 'linear-gradient(135deg, #ff6d00, #ffd600)',
    image: `${import.meta.env.BASE_URL}hero_master.png`,
    description: 'Apply advanced skills to real-world scenarios — industry applications, task automation, and a capstone robotics project.',
    outcomes: ['Analyze robot applications across industries', 'Design robot task planning systems', 'Build a complete robotics project'],
    mode: 'advanced',
  }
};

export const MODULES = [
  // Phase 1 — Spark (Modules 1-3)
  {
    id: 'mod-1', phase: 'spark', order: 1,
    title: 'Introduction to Robotics',
    subtitle: 'How robots work and where they\'re used',
    duration: '3 hrs', difficulty: 'beginner',
    description: 'Explore the world of robotics — what robots are, their history, types, applications, components, and degrees of freedom. Discover how robots perform tasks automatically.',
    topics: ['What is a robot?', 'History of robotics', 'Robot vs Automation', 'Types of robots', 'Robot applications', 'Robot components', 'Degrees of freedom'],
    learningPath: [
      {
        phase: 'Spark (Curiosity + Context)',
        items: [
          'What is industrial robotics (with real factory examples)',
          'Where robots are used: automotive, electronics, packaging',
          'Human vs robot: speed, repeatability, precision',
          'Demo: Watch a pick-and-place cycle and identify actions'
        ]
      },
      {
        phase: 'Build (Foundations)',
        items: [
          'Types of robots: Cartesian, SCARA, Articulated, Delta',
          'Robot anatomy: base, joints, links, end-effector',
          'Degrees of Freedom (DOF)',
          'Workspace & reach'
        ]
      },
      {
        phase: 'Practice',
        items: [
          'Identify robot types from images/videos',
          'Label robot parts on a diagram',
          'Match robot type to application'
        ]
      },
      {
        phase: 'Master (Application Task)',
        items: [
          'Choose the correct robot for: palletizing boxes, PCB assembly, welding',
          'Justify selection (speed, reach, payload)'
        ]
      }
    ],
    hook: 'Robots work in factories, hospitals, farms, and warehouses — but how do they perform tasks automatically without a human controlling every move?',
    learningOutcomes: {
      title: 'Learning Outcomes',
      summary: 'Learner can identify, understand, and select appropriate robots for basic industrial tasks.',
      items: [
        'Explain the role of industrial robots and their advantages',
        'Identify robot types and key components',
        'Understand DOF, workspace, and reach',
        'Match robots to suitable applications',
        'Justify robot selection based on task requirements',
      ],
    },
    xpReward: 100,
    badge: 'robotics-explorer',
    showcase: 'Write a short report on a robot used in industry.',
    reflectPrompts: ['Where are robots used?', 'What tasks should robots perform?', 'Can robots replace humans?'],
  },
  {
    id: 'mod-2', phase: 'spark', order: 2,
    title: 'Robot Components & Architecture',
    subtitle: 'The anatomy of a robot',
    duration: '3 hrs', difficulty: 'beginner',
    description: 'Break down a robot into its core elements — structure, controller, sensors, actuators, power supply, end effectors. Understand embedded systems in robotics.',
    topics: ['Robot structure', 'Controller', 'Sensors', 'Actuators', 'Power supply', 'End effector', 'Robot architecture', 'Embedded systems'],
    hook: 'A robot arm has dozens of hidden components working in perfect harmony. If you removed just one, the entire system fails. Which component is the "brain"?',
    xpReward: 120,
    badge: 'component-architect',
    applyTask: 'Design a robot for warehouse / hospital / agriculture.',
    miniTask: 'Draw robot architecture diagram.',
  },
  {
    id: 'mod-3', phase: 'spark', order: 3,
    title: 'Sensors in Robotics',
    subtitle: 'Giving robots the ability to sense',
    duration: '4 hrs', difficulty: 'beginner',
    description: 'Learn about the sensors that give robots awareness — distance sensors, IR, ultrasonic, temperature, pressure, vision cameras, IMU, GPS, and sensor data processing.',
    topics: ['Distance sensors', 'IR sensor', 'Ultrasonic sensor', 'Temperature sensor', 'Pressure sensor', 'Vision camera', 'IMU & GPS', 'Sensor data processing'],
    hook: 'A warehouse robot navigates through a maze of shelves without bumping into anything. It has no eyes. How does it "see"?',
    xpReward: 140,
    badge: 'sensor-specialist',
    applyTask: 'Design sensor system for line follower / obstacle avoidance / smart irrigation robot.',
  },

  // Phase 2 — Build (Modules 4-7)
  {
    id: 'mod-4', phase: 'build', order: 1,
    title: 'Actuators & Motion Systems',
    subtitle: 'Making robots move',
    duration: '4 hrs', difficulty: 'intermediate',
    description: 'Study the actuators that power robot movement — DC motors, servo motors, stepper motors, hydraulic and pneumatic actuators. Compare wheels, tracks, and legs.',
    topics: ['DC Motors', 'Servo motors', 'Stepper motors', 'Hydraulic actuators', 'Pneumatic actuators', 'Drive systems', 'Wheels vs Tracks vs Legs', 'Motion control'],
    hook: 'A surgical robot positions a scalpel with 0.1mm accuracy. A factory robot lifts 200kg. They use completely different motors. Why?',
    xpReward: 180,
    badge: 'actuator-master',
  },
  {
    id: 'mod-5', phase: 'build', order: 2,
    title: 'Robot Kinematics',
    subtitle: 'The math behind robot motion',
    duration: '5 hrs', difficulty: 'intermediate',
    description: 'Understand how robots plan and execute motion — degrees of freedom, forward and inverse kinematics, coordinate systems, workspace analysis, and path planning.',
    topics: ['Degrees of freedom', 'Forward kinematics', 'Inverse kinematics', 'Coordinate systems', 'Robot workspace', 'Path planning basics'],
    hook: 'A robot arm says it can\'t reach a target that\'s clearly within its arm length. The math says it\'s impossible. Why?',
    xpReward: 200,
    badge: 'kinematics-solver',
  },
  {
    id: 'mod-6', phase: 'build', order: 3,
    title: 'Robot Programming Basics',
    subtitle: 'Teaching robots what to do',
    duration: '5 hrs', difficulty: 'intermediate',
    description: 'Learn robot programming fundamentals — control logic, sensor-actuator integration, path programming, task automation, robot languages, and ROS basics.',
    topics: ['Programming concepts', 'Control logic', 'Sensor-actuator integration', 'Path programming', 'Task automation', 'Robot languages', 'ROS basics'],
    hook: 'A junior engineer writes 200 lines of robot code. A senior does the same task in 15 lines. What does the senior know that the junior doesn\'t?',
    xpReward: 220,
    badge: 'robot-programmer',
  },
  {
    id: 'mod-7', phase: 'build', order: 4,
    title: 'Control Systems in Robotics',
    subtitle: 'Feedback, stability, and precision',
    duration: '4 hrs', difficulty: 'intermediate',
    description: 'Master open-loop and closed-loop control, feedback systems, PID control basics, robot stability, and motion control systems that keep robots precise.',
    topics: ['Open loop control', 'Closed loop control', 'Feedback systems', 'PID control basics', 'Robot stability', 'Motion control systems'],
    hook: 'A robot arm keeps overshooting its target by 2mm then correcting back. It oscillates forever. One parameter change fixes it. What is it?',
    xpReward: 220,
    badge: 'control-engineer',
  },

  // Phase 3 — Master (Modules 8-10)
  {
    id: 'mod-8', phase: 'master', order: 1,
    title: 'Robot Applications & Industry 4.0',
    subtitle: 'Robots in the real world',
    duration: '4 hrs', difficulty: 'expert',
    description: 'Deep dive into industrial, collaborative, medical, agricultural, service, and autonomous robots. Understand smart factories, IoT+Robotics, and AI+Robotics.',
    topics: ['Industrial robots', 'Collaborative robots', 'Medical robots', 'Agricultural robots', 'Service robots', 'Autonomous vehicles', 'Smart factories', 'IoT + Robotics', 'AI + Robotics'],
    hook: 'A smart factory runs 24/7 with zero human operators on the floor. Robots, AI, and IoT handle everything. Is this the future of all manufacturing?',
    xpReward: 280,
    badge: 'application-expert',
    applyTask: 'Case study: Smart factory with robotic automation.',
  },
  {
    id: 'mod-9', phase: 'master', order: 2,
    title: 'Robot Task Planning & Automation',
    subtitle: 'Coordinating intelligent systems',
    duration: '4 hrs', difficulty: 'expert',
    description: 'Learn task planning, path planning, scheduling, multi-robot systems, fleet management, warehouse robotics, and complete automation workflows.',
    topics: ['Task planning', 'Path planning', 'Scheduling', 'Multi-robot systems', 'Fleet management', 'Warehouse robots', 'Automation workflow'],
    hook: 'Amazon\'s warehouse has 750,000 robots working alongside humans. How do they coordinate without crashing into each other?',
    xpReward: 300,
    badge: 'automation-architect',
    practiceTask: 'Design robot workflow for warehouse automation.',
  },
  {
    id: 'mod-10', phase: 'master', order: 3,
    title: 'Capstone: Robotics Project',
    subtitle: 'Your masterpiece',
    duration: '5 hrs', difficulty: 'expert',
    description: 'Build a complete robotics project — from problem statement through system architecture, sensor/actuator selection, control logic, task flow, and final presentation.',
    topics: ['Problem statement', 'System architecture', 'Sensor & actuator selection', 'Control logic', 'Task flow diagram', 'Simulation', 'Report & Presentation'],
    hook: 'You\'ve learned everything. Now build something real. Pick a problem, design a robot system, and prove it works.',
    xpReward: 500,
    badge: 'capstone-champion',
    projectIdeas: [
      'Line follower robot system design',
      'Warehouse robot simulation',
      'Smart irrigation robot',
      'Robot arm pick and place system',
      'Delivery robot system',
      'Hospital service robot',
      'Autonomous farm robot',
      'Multi-robot coordination system',
    ],
  },
];

export const BADGES = {
  // Spark badges
  'robotics-explorer': { name: 'Robotics Explorer', icon: '🤖', phase: 'spark', description: 'Discovered the world of robotics' },
  'component-architect': { name: 'Component Architect', icon: '🔧', phase: 'spark', description: 'Mastered robot components and architecture' },
  'sensor-specialist': { name: 'Sensor Specialist', icon: '📡', phase: 'spark', description: 'Expert in robotic sensor systems' },

  // Build badges
  'actuator-master': { name: 'Actuator Master', icon: '⚙️', phase: 'build', description: 'Commands motors and motion systems' },
  'kinematics-solver': { name: 'Kinematics Solver', icon: '📐', phase: 'build', description: 'Unlocked the math of robot motion' },
  'robot-programmer': { name: 'Robot Programmer', icon: '💻', phase: 'build', description: 'Programs robots to perform tasks' },
  'control-engineer': { name: 'Control Engineer', icon: '🎛️', phase: 'build', description: 'Masters feedback and control systems' },

  // Master badges
  'application-expert': { name: 'Application Expert', icon: '🏭', phase: 'master', description: 'Knows robots across every industry' },
  'automation-architect': { name: 'Automation Architect', icon: '🏗️', phase: 'master', description: 'Designs multi-robot automation systems' },
  'capstone-champion': { name: 'Capstone Champion', icon: '👑', phase: 'master', description: 'Built a complete robotics project' },
};

export const QUIZ_QUESTIONS = {
  'mod-1': [
    {
      question: 'Look at the image above. What distinguishes a robot from simple automation?',
      image: `${import.meta.env.BASE_URL}quiz-robot-types.png`,
      imageCaption: 'Different types of industrial robots used across manufacturing',
      options: ['Robots are always humanoid in shape', 'Robots can be reprogrammed for different tasks', 'Robots must have wheels for movement', 'Robots only work in factories'],
      correct: 1,
      explanation: 'Unlike fixed automation, robots are reprogrammable machines that can be adapted for multiple tasks without physical modification.'
    },
    {
      question: 'Observe the robot types shown. Which field was the first to adopt industrial robots?',
      image: `${import.meta.env.BASE_URL}quiz-robot-types.png`,
      imageCaption: 'Industrial robots in various configurations',
      options: ['Healthcare', 'Agriculture', 'Automotive manufacturing', 'Food processing'],
      correct: 2,
      explanation: 'The automotive industry pioneered industrial robotics — the first robot (Unimate) was installed at a GM plant in 1961.'
    },
    {
      question: 'Looking at the articulated robot arm, what does "degrees of freedom" refer to?',
      image: `${import.meta.env.BASE_URL}quiz-robot-types.png`,
      imageCaption: 'Notice how different robot types have different joint configurations',
      options: ['How many tasks a robot can do', 'The number of independent movements a robot can make', 'The cost tiers available', 'The number of sensors installed'],
      correct: 1,
      explanation: 'Degrees of freedom (DOF) refers to the number of independent axes of motion — a 6-DOF robot can move in 6 independent directions.'
    }
  ],
  'mod-2': [
    {
      question: 'Study the labeled robot diagram. What is the primary function of a robot controller?',
      image: `${import.meta.env.BASE_URL}quiz-robot-components.png`,
      imageCaption: 'Internal components of a robot arm — controller, motors, encoders, and end effector',
      options: ['Supply electrical power', 'Process commands and coordinate motion', 'Hold the workpiece', 'Provide safety fencing'],
      correct: 1,
      explanation: 'The controller is the brain — it processes commands, calculates trajectories, and coordinates all joint movements.'
    },
    {
      question: 'From the component diagram, which converts electrical energy into mechanical motion?',
      image: `${import.meta.env.BASE_URL}quiz-robot-components.png`,
      imageCaption: 'Robot architecture showing the relationship between controller, motors, and sensors',
      options: ['Sensor', 'Actuator/Motor', 'Controller', 'End effector'],
      correct: 1,
      explanation: 'Actuators (servo motors) convert electrical signals into precise mechanical motion at each joint.'
    },
    {
      question: 'Look at the robot wrist area in the diagram. What is an end effector?',
      image: `${import.meta.env.BASE_URL}quiz-robot-components.png`,
      imageCaption: 'The end effector is the tool attached at the wrist of the robot arm',
      options: ['The robot\'s power supply', 'A safety device', 'The tool attached to the robot\'s wrist', 'The programming interface'],
      correct: 2,
      explanation: 'The end effector is the "hand" of the robot — it could be a gripper, welding torch, suction cup, or any tool for the specific task.'
    }
  ],
  'mod-3': [
    {
      question: 'Examine the sensor types shown. Which would you use to detect distance without contact?',
      image: `${import.meta.env.BASE_URL}quiz-sensors.png`,
      imageCaption: 'Common sensor types in robotics — ultrasonic, IR, vision, force/torque, and IMU',
      options: ['Temperature sensor', 'Ultrasonic sensor', 'Pressure sensor', 'IMU'],
      correct: 1,
      explanation: 'Ultrasonic sensors emit sound waves and measure the echo return time to calculate distance — perfect for non-contact distance measurement.'
    },
    {
      question: 'Find the IMU in the sensor diagram. What does it measure?',
      image: `${import.meta.env.BASE_URL}quiz-sensors.png`,
      imageCaption: 'The IMU (Inertial Measurement Unit) combines multiple sensing elements',
      options: ['Temperature and humidity', 'Acceleration and angular velocity', 'Light intensity', 'Magnetic field only'],
      correct: 1,
      explanation: 'An IMU combines accelerometers and gyroscopes to measure acceleration and rotation — critical for balance and orientation in mobile robots.'
    },
    {
      question: 'Look at the vision camera sensor. Why is it increasingly important in robotics?',
      image: `${import.meta.env.BASE_URL}quiz-sensors.png`,
      imageCaption: 'Vision cameras enable advanced object recognition and inspection capabilities',
      options: ['They make robots look more human', 'They enable object recognition and visual inspection', 'They replace all other sensors', 'They are cheaper than all alternatives'],
      correct: 1,
      explanation: 'Vision systems enable robots to identify, inspect, and locate objects — powering applications like quality control, bin picking, and navigation.'
    }
  ],
  'mod-4': [
    {
      question: 'Study the actuator comparison. What is the key advantage of a stepper motor over a DC motor?',
      image: `${import.meta.env.BASE_URL}quiz-actuators.png`,
      imageCaption: 'Comparison of motor types — DC, Servo, Stepper, Hydraulic, and Pneumatic actuators',
      options: ['Higher maximum speed', 'Precise position control without feedback', 'Lower cost in all applications', 'Simpler wiring requirements'],
      correct: 1,
      explanation: 'Stepper motors move in discrete steps, providing precise position control without needing an encoder — ideal for applications like 3D printers.'
    },
    {
      question: 'Compare the hydraulic and electric actuators in the diagram. When would you choose hydraulic?',
      image: `${import.meta.env.BASE_URL}quiz-actuators.png`,
      imageCaption: 'Notice the size difference between hydraulic (high force) and electric (precision) actuators',
      options: ['For lightweight precision tasks', 'For very high force/payload applications', 'For battery-powered mobile robots', 'For quiet indoor environments'],
      correct: 1,
      explanation: 'Hydraulic actuators excel in high-force applications (excavators, heavy press machines) where electric motors cannot match the power density.'
    }
  ],
  'mod-5': [
    {
      question: 'Study the kinematics diagram. What does forward kinematics calculate?',
      image: `${import.meta.env.BASE_URL}quiz-kinematics.png`,
      imageCaption: 'Forward kinematics: from joint angles (θ₁, θ₂, θ₃) to end-effector position (X, Y, Z)',
      options: ['Joint angles from end-effector position', 'End-effector position from joint angles', 'Motor torque requirements', 'Sensor calibration values'],
      correct: 1,
      explanation: 'Forward kinematics takes known joint angles and calculates where the end-effector ends up in 3D space.'
    },
    {
      question: 'Look at the inverse kinematics arrows. Why is it computationally harder than forward?',
      image: `${import.meta.env.BASE_URL}quiz-kinematics.png`,
      imageCaption: 'Inverse kinematics: from desired position to required joint angles — multiple solutions possible',
      options: ['It requires more sensors', 'Multiple joint configurations can reach the same point', 'It needs a bigger controller', 'The motors run backwards'],
      correct: 1,
      explanation: 'Inverse kinematics is harder because multiple joint angle combinations can achieve the same end-effector position — the system must choose the best solution.'
    }
  ],
  'mod-6': [
    {
      question: 'What is ROS (Robot Operating System)?',
      options: ['A commercial operating system like Windows', 'An open-source framework for robot software development', 'A physical robot controller', 'A sensor calibration tool'],
      correct: 1,
      explanation: 'ROS is an open-source middleware framework that provides tools, libraries, and conventions for writing robot software across different platforms.'
    },
    {
      question: 'What is the purpose of a wait state in robot programming?',
      options: ['To save power', 'To pause execution until a condition is met', 'To reset the controller', 'To calibrate sensors automatically'],
      correct: 1,
      explanation: 'Wait states pause program execution until a specific condition (sensor signal, timer, I/O input) is satisfied — critical for synchronizing with external equipment.'
    }
  ],
  'mod-7': [
    {
      question: 'Study the PID control diagram. What is the main advantage of closed-loop control over open-loop?',
      image: `${import.meta.env.BASE_URL}quiz-control-systems.png`,
      imageCaption: 'PID control loop: Set Point → Error → P/I/D → Plant → Output → Feedback',
      options: ['It is simpler to implement', 'It can correct errors using feedback', 'It uses less power', 'It is always faster'],
      correct: 1,
      explanation: 'Closed-loop control uses sensor feedback to continuously compare actual output with desired output and correct any deviation.'
    },
    {
      question: 'In PID control, what does the "I" (Integral) term correct?',
      options: ['Instantaneous error', 'Accumulated steady-state error over time', 'Rate of error change', 'Sensor noise'],
      correct: 1,
      explanation: 'The Integral term accumulates past errors and eliminates persistent steady-state offset that the Proportional term alone cannot fix.'
    }
  ],
};

export const getModulesByPhase = (phase) => MODULES.filter(m => m.phase === phase);
export const getModuleById = (id) => MODULES.find(m => m.id === id);

// ── Progressive Robot Parts: Each module unlocks a skill ──
export const ROBOT_PARTS = {
  'mod-1': { id: 'left-foot', label: 'Robot Basics', group: 'spark' },
  'mod-2': { id: 'right-foot', label: 'Component Knowledge', group: 'spark' },
  'mod-3': { id: 'left-leg', label: 'Sensor Systems', group: 'spark' },
  'mod-4': { id: 'right-leg', label: 'Actuator Control', group: 'build' },
  'mod-5': { id: 'lower-torso', label: 'Kinematics', group: 'build' },
  'mod-6': { id: 'upper-torso', label: 'Programming', group: 'build' },
  'mod-7': { id: 'left-arm', label: 'Control Systems', group: 'build' },
  'mod-8': { id: 'right-arm', label: 'Applications', group: 'master' },
  'mod-9': { id: 'head-shell', label: 'Automation', group: 'master' },
  'mod-10': { id: 'full-activation', label: 'Full Mastery', group: 'master' },
};

// ── Spin Wheel Bonus Content ──
export const SPIN_WHEEL_CONTENT = {
  default: [
    { id: 'fun-fact', label: '🎯 Fun Fact', type: 'fact', color: 'var(--wheel-teal)',
      content: 'The first industrial robot, Unimate, was installed at a GM plant in 1961 to lift hot metal parts from a die-casting machine.' },
    { id: 'pro-tip', label: '💡 Pro Tip', type: 'tip', color: 'var(--wheel-plum)',
      content: 'Always back up your robot programs before making changes. One wrong move can cost hours of reprogramming.' },
    { id: 'industry-story', label: '🏭 Industry Story', type: 'story', color: 'var(--wheel-rust)',
      content: 'Amazon uses over 750,000 robots in its warehouses. During peak seasons, these robots process millions of packages daily alongside human workers.' },
    { id: 'mini-challenge', label: '⚡ Mini Challenge', type: 'challenge', color: 'var(--wheel-wine)',
      content: 'Can you name 5 different types of sensors used in robotics and one application for each? Time yourself — 60 seconds!' },
    { id: 'career-insight', label: '🚀 Career Insight', type: 'career', color: 'var(--wheel-slate)',
      content: 'Robotics engineers are in high demand. Specializing in ROS, computer vision, or control systems can boost your salary by 25-40%.' },
    { id: 'pro-course', label: '👑 Pro Content', type: 'pro', color: 'var(--wheel-crimson)',
      content: 'After this course, explore advanced topics: Robot Programming with ROS2, PLC & Robot Integration, and Virtual Commissioning & Simulation.' },
  ],
};

// ── Table of Contents / Module Overviews ──
export const MODULE_OVERVIEWS = {};
MODULES.forEach(m => {
  MODULE_OVERVIEWS[m.id] = {
    title: m.title,
    subtitle: m.subtitle,
    phase: m.phase,
    duration: m.duration,
    difficulty: m.difficulty,
    summary: m.description,
    topics: m.topics,
    xpReward: m.xpReward,
  };
});

// ── Mastery Questions ──
export const MASTERY_QUESTIONS = {
  'mod-1': [
    { question: 'How did the introduction of robots fundamentally change the nature of manufacturing jobs?',
      options: ['It eliminated all human roles from production lines entirely', 'It shifted human roles from repetitive labor to supervision and programming', 'It made manufacturing more expensive with diminishing quality returns', 'It only affected the automotive sector with no other industry impact'],
      correct: 1 },
    { question: 'What is the most significant difference between a robot and a CNC machine?',
      options: ['A CNC machine is always larger than a robot system overall', 'A robot can be reprogrammed for multiple different tasks flexibly', 'A CNC machine uses more advanced software and sensor technology', 'A robot always moves faster than any CNC machine in operation'],
      correct: 1 },
    { question: 'Why are collaborative robots (cobots) growing faster than traditional industrial robots?',
      options: ['Cobots are cheaper to manufacture using simpler motor systems', 'Cobots can work safely alongside humans without extensive fencing', 'Cobots provide significantly higher payload capacity for heavy tasks', 'Cobots require no programming or setup of any kind before deployment'],
      correct: 1 },
    { question: 'Which factor most impacts a robot\'s degrees of freedom for a given application?',
      options: ['The brand and manufacturer of the specific robot hardware model', 'The complexity of motions and orientations the task requires', 'The color coding used in the robot safety certification labels', 'The geographic location where the robot will be installed at site'],
      correct: 1 },
    { question: 'What role does robotics play in Industry 4.0 smart manufacturing concepts?',
      options: ['Robotics is a small optional component added for marketing purposes', 'Robotics forms a critical pillar connecting physical production to digital systems', 'Robotics is being phased out in favor of fully manual production lines', 'Robotics only contributes to packaging at the very end of production'],
      correct: 1 },
  ],
};

// Generate default mastery questions for modules that don't have custom ones
MODULES.forEach(m => {
  if (!MASTERY_QUESTIONS[m.id]) {
    MASTERY_QUESTIONS[m.id] = [
      { question: `Which factor is most critical when applying ${m.topics[0]?.toLowerCase() || 'these concepts'} in real robotics settings?`,
        options: ['Understanding theoretical principles before any practical application', 'Balancing practical constraints with established engineering standards', 'Relying solely on manufacturer documentation for all decisions', 'Following identical procedures regardless of application differences'],
        correct: 1 },
      { question: `What common mistake do engineers make when working with ${m.topics[1]?.toLowerCase() || 'this topic'} for the first time?`,
        options: ['They invest too much time in careful preliminary safety analysis', 'They skip validation steps assuming default configurations are correct', 'They consult experienced colleagues before making critical decisions', 'They thoroughly document each parameter change in engineering logs'],
        correct: 1 },
      { question: `How does mastering ${m.topics[0]?.toLowerCase() || 'this concept'} directly improve robot system performance?`,
        options: ['It primarily reduces the initial capital investment for new equipment', 'It enables faster troubleshooting and optimized operational performance', 'It eliminates the requirement for regular preventive maintenance cycles', 'It removes the need for specialized operator training and certification'],
        correct: 1 },
      { question: `When integrating ${m.topics[Math.min(2, m.topics.length - 1)]?.toLowerCase() || 'advanced features'}, what should be verified first?`,
        options: ['That all cosmetic panel covers are properly installed and aligned', 'That system compatibility and safety interlocks are fully validated', 'That the workspace ambient temperature remains below normal levels', 'That documentation fonts match the company standard style formats'],
        correct: 1 },
      { question: `What differentiates an expert-level understanding of ${m.title.toLowerCase()} from beginner level?`,
        options: ['An expert can recite all textbook definitions from memory quickly', 'An expert applies concepts adaptively across varied real scenarios', 'An expert avoids all hands-on work preferring theoretical analysis', 'An expert relies exclusively on automated tools for every decision'],
        correct: 1 },
    ];
  }
});

// ── Practical Examples ──
export const PRACTICAL_EXAMPLES = {
  'mod-1': [
    { title: 'Spot Robots in the Wild', description: 'List 5 products you used today that were manufactured or assembled with the help of robots.' },
    { title: 'Robot Type Scavenger Hunt', description: 'Find YouTube videos of 3 different robot types (articulated, delta, SCARA) and explain why each type was chosen for its task.' },
    { title: 'History Timeline', description: 'Create a timeline of robotics history from 1961 (Unimate) to present day, highlighting 5 key milestones.' },
  ],
  'mod-2': [
    { title: 'Label a Robot Diagram', description: 'Sketch a 6-axis robot and label every component: joints, links, motors, sensors, and controller connections.' },
    { title: 'Component Failure Scenarios', description: 'For each major component, describe what would happen if it failed and how you would diagnose the issue.' },
    { title: 'Design a Robot System', description: 'Choose an application (warehouse, hospital, or farm) and list which components your robot would need.' },
  ],
  'mod-3': [
    { title: 'Sensor Matching Challenge', description: 'Given 5 different robot tasks, select the most appropriate sensor for each and justify your choice.' },
    { title: 'Build a Sensor Comparison Chart', description: 'Create a table comparing range, accuracy, cost, and best use case for 6 different sensor types.' },
    { title: 'Sensor Fusion Concept', description: 'Describe how combining data from two different sensors (e.g., ultrasonic + IR) improves robot navigation.' },
  ],
};

// Generate default practical examples for modules without custom ones
MODULES.forEach(m => {
  if (!PRACTICAL_EXAMPLES[m.id]) {
    PRACTICAL_EXAMPLES[m.id] = [
      { title: `Hands-On ${m.topics[0]} Exercise`, description: `Create a detailed diagram or flowchart explaining how ${m.topics[0]?.toLowerCase()} works in a real robotics application.` },
      { title: `Real-World ${m.title} Case Study`, description: `Research and document a real company that applies ${m.title.toLowerCase()} concepts. Note their challenges and solutions.` },
      { title: `Teach-Back Challenge`, description: `Explain ${m.topics[Math.min(1, m.topics.length - 1)]?.toLowerCase()} to someone unfamiliar with robotics. Teaching reinforces understanding.` },
    ];
  }
});

// ── Leaderboard Competitors ──
export const LEADERBOARD_COMPETITORS = [
  { id: 'c1', name: 'Priya S.', initial: 'P', course: 'Robotics', xp: 5480, streak: 21, level: 8 },
  { id: 'c2', name: 'Marcus T.', initial: 'M', course: 'Robotics', xp: 4920, streak: 14, level: 7 },
  { id: 'c3', name: 'Yuki W.', initial: 'Y', course: 'Robotics', xp: 3870, streak: 9, level: 6 },
  { id: 'c4', name: 'Jordan K.', initial: 'J', course: 'Robotics', xp: 2100, streak: 5, level: 4 },
  { id: 'c5', name: 'Sam R.', initial: 'S', course: 'Robotics', xp: 1780, streak: 3, level: 3 },
  { id: 'c6', name: 'Dana L.', initial: 'D', course: 'Robotics', xp: 1450, streak: 2, level: 3 },
  { id: 'c7', name: 'Ali M.', initial: 'A', course: 'Robotics', xp: 3200, streak: 11, level: 5 },
  { id: 'c8', name: 'Lena F.', initial: 'L', course: 'Robotics', xp: 2800, streak: 8, level: 5 },
  { id: 'c9', name: 'Ravi P.', initial: 'R', course: 'Robotics', xp: 4100, streak: 16, level: 6 },
  { id: 'c10', name: 'Mia C.', initial: 'M', course: 'Robotics', xp: 3600, streak: 12, level: 5 },
  { id: 'c11', name: 'Noah B.', initial: 'N', course: 'Robotics', xp: 1200, streak: 4, level: 2 },
  { id: 'c12', name: 'Zara H.', initial: 'Z', course: 'Robotics', xp: 950, streak: 2, level: 2 },
  { id: 'c13', name: 'Tao W.', initial: 'T', course: 'Robotics', xp: 4400, streak: 18, level: 7 },
  { id: 'c14', name: 'Ines G.', initial: 'I', course: 'Robotics', xp: 2650, streak: 7, level: 4 },
  { id: 'c15', name: 'Oscar D.', initial: 'O', course: 'Robotics', xp: 1800, streak: 6, level: 3 },
];

// ── Catalog card gradients ──
export const CATALOG_GRADIENTS = {
  'mod-1': 'linear-gradient(135deg, #667eea, #764ba2)',
  'mod-2': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  'mod-3': 'linear-gradient(135deg, #43e97b, #38f9d7)',
  'mod-4': 'linear-gradient(135deg, #f093fb, #f5576c)',
  'mod-5': 'linear-gradient(135deg, #667eea, #764ba2)',
  'mod-6': 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'mod-7': 'linear-gradient(135deg, #fccb90, #d57eeb)',
  'mod-8': 'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'mod-9': 'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'mod-10': 'linear-gradient(135deg, #ffd700, #ff6d00)',
};

// ── Catalog ratings ──
export const CATALOG_RATINGS = {};
MODULES.forEach(m => {
  CATALOG_RATINGS[m.id] = +(4.4 + Math.random() * 0.6).toFixed(1);
});

// ── Skill Tree node positions (sequential layout) ──
export const SKILL_TREE_NODES = MODULES.map((m, i) => ({
  id: m.id,
  title: m.title,
  icon: BADGES[m.badge]?.icon || '📘',
  x: 10 + (i % 3) * 28,
  y: 15 + Math.floor(i / 3) * 22,
  prereqs: i > 0 ? [`mod-${i}`] : [],
}));

// ── Troubleshooting Scenarios (Feature 12) ──
export const TROUBLESHOOTING_SCENARIOS = [
  {
    id: 'ts-1',
    title: 'Robot Arm Not Moving',
    description: 'Operator presses start, but the robot does not move.',
    branches: [
      {
        name: 'Safety System',
        icon: '🛡️',
        checks: [
          { question: 'Is the safety gate closed?', answer: 'Yes — safety gate is latched.', isRootCause: false },
          { question: 'Is the emergency stop released?', answer: 'No — E-stop is still engaged!', isRootCause: true, explanation: 'The emergency stop button was pressed during maintenance and never released. Always check E-stop status before troubleshooting further.' },
        ]
      },
      {
        name: 'Sensor Input',
        icon: '📡',
        checks: [
          { question: 'Is the part-present sensor detecting a workpiece?', answer: 'Yes — sensor shows part detected.', isRootCause: false },
          { question: 'Is the controller receiving the start signal?', answer: 'Signal is present at the I/O board.', isRootCause: false },
        ]
      },
      {
        name: 'Controller',
        icon: '🖥️',
        checks: [
          { question: 'Is the controller powered on?', answer: 'Yes — controller displays are active.', isRootCause: false },
          { question: 'Is the robot in AUTO mode?', answer: 'No — robot is still in TEACH mode.', isRootCause: true, explanation: 'The robot was left in TEACH mode after programming. Switch to AUTO mode for production operation.' },
        ]
      },
    ],
    timeBonus: 60,
  },
  {
    id: 'ts-2',
    title: 'Robot Moving But Not Picking',
    description: 'Robot is moving through its cycle, but no product is picked up.',
    branches: [
      {
        name: 'Sensors',
        icon: '📡',
        checks: [
          { question: 'Is the part-detection sensor working?', answer: 'Sensor LED is flickering inconsistently.', isRootCause: true, explanation: 'The photoelectric sensor is misaligned — it detects the part intermittently. Realign the sensor beam to the correct height.' },
          { question: 'Is the sensor cable damaged?', answer: 'Cable appears intact with no visible damage.', isRootCause: false },
        ]
      },
      {
        name: 'Tooling',
        icon: '🦾',
        checks: [
          { question: 'Is the gripper receiving air pressure?', answer: 'Pressure gauge shows 4.5 bar — within range.', isRootCause: false },
          { question: 'Are the gripper fingers worn?', answer: 'Fingers show normal wear, grip pads intact.', isRootCause: false },
        ]
      },
      {
        name: 'Logic',
        icon: '💻',
        checks: [
          { question: 'Is the pick command executing at the right position?', answer: 'Position is correct per the taught points.', isRootCause: false },
          { question: 'Is the grip signal timing correct?', answer: 'Grip activates 200ms before reaching pick position!', isRootCause: true, explanation: 'The gripper closes too early — before the robot reaches the pick point. Adjust the grip activation to trigger at the pick position, not before.' },
        ]
      },
    ],
    timeBonus: 90,
  },
];

// ── Visual Identification Exercises (Feature 13) ──
export const VISUAL_ID_EXERCISES = {
  'mod-1': {
    title: 'Identify Robot Types',
    instruction: 'Drag the correct robot type name to each description.',
    items: [
      { id: 'v1', label: 'Articulated Robot', zone: 'zone-1', hint: '6+ axes, most common in automotive' },
      { id: 'v2', label: 'SCARA Robot', zone: 'zone-2', hint: 'Horizontal assembly, 4 axes' },
      { id: 'v3', label: 'Delta Robot', zone: 'zone-3', hint: 'Parallel links, high-speed picking' },
      { id: 'v4', label: 'Cartesian Robot', zone: 'zone-4', hint: 'X, Y, Z linear sliders' },
    ],
  },
  'mod-2': {
    title: 'Label Robot Components',
    instruction: 'Identify the key components of an industrial robot arm.',
    items: [
      { id: 'v1', label: 'Controller', zone: 'zone-1', hint: 'The "brain" of the cell' },
      { id: 'v2', label: 'Motor/Actuator', zone: 'zone-2', hint: 'Converts electricity to motion' },
      { id: 'v3', label: 'End Effector', zone: 'zone-3', hint: 'The hand/tool of the robot' },
      { id: 'v4', label: 'Encoder', zone: 'zone-4', hint: 'Tracks joint position' },
    ],
  },
  'mod-3': {
    title: 'Match Sensors to Applications',
    instruction: 'Drag the correct sensor to the matching description.',
    items: [
      { id: 'v1', label: 'Ultrasonic', zone: 'zone-1', hint: 'Distance via sound waves' },
      { id: 'v2', label: 'Vision', zone: 'zone-2', hint: 'Object recognition & inspection' },
      { id: 'v3', label: 'IMU', zone: 'zone-3', hint: 'Balance and orientation tracking' },
    ],
  },
  'mod-4': {
    title: 'Identify Robot Types',
    instruction: 'Drag the correct robot type name to each description.',
    items: [
      { id: 'v1', label: 'Articulated Robot', zone: 'zone-1', hint: '6+ axes, most common in automotive' },
      { id: 'v2', label: 'SCARA Robot', zone: 'zone-2', hint: 'Horizontal assembly, 4 axes' },
      { id: 'v3', label: 'Delta Robot', zone: 'zone-3', hint: 'Parallel links, high-speed picking' },
      { id: 'v4', label: 'Cartesian Robot', zone: 'zone-4', hint: 'X, Y, Z linear sliders' },
    ],
  },
};

// ── Role-Based Scenarios (Feature 11) ──
export const ROLE_SCENARIOS = {
  'safety-inspector': {
    role: 'Safety Inspector',
    icon: '🛡️',
    context: 'You are the lead Safety Inspector evaluating a new robotic welding cell before it goes live.',
    scenarios: [
      {
        situation: 'The welding cell has a robot arm, a rotary positioner, and a parts conveyor. The safety fencing has a gap near the conveyor entry point.',
        options: [
          { text: 'Approve — the gap is small enough to be safe', correct: false, feedback: 'Any gap in safety fencing can allow access to the hazard zone. ISO 10218 requires complete perimeter guarding.' },
          { text: 'Reject — install a light curtain at the conveyor gap', correct: true, feedback: 'Correct! A light curtain at the conveyor entry maintains material flow while preventing human entry into the hazard zone.' },
          { text: 'Approve — add a warning sign at the gap instead', correct: false, feedback: 'Warning signs alone don\'t prevent access. Physical or electronic safeguarding is required by safety standards.' },
        ],
      },
      {
        situation: 'During the system test, the emergency stop button on the teach pendant is pressed. The robot stops moving, but its servo motors remain energized for 2 seconds before cutting power.',
        options: [
          { text: 'Approve — 2 seconds is acceptable for servo discharge', correct: false, feedback: 'Safety standards require motive power to be immediately removed or safely controlled upon an E-stop.' },
          { text: 'Reject — an E-stop must immediately trigger a Stop Category 0 or 1', correct: true, feedback: 'Correct! An E-stop must immediately bring the robot to a safe, unpowered state (Stop Category 0) or a controlled stop followed by power removal (Stop Category 1).' },
          { text: 'Approve — as long as the robot doesn\'t move, it is safe', correct: false, feedback: 'A stopped robot with energized servos is still a severe hazard because a software glitch could cause sudden movement.' },
        ],
      },
      {
        situation: 'The cell uses a floor-mounted safety laser scanner. If an operator enters the scanner zone, the robot pauses. When the operator steps back out, the robot instantly auto-resumes full speed welding.',
        options: [
          { text: 'Approve — auto-resume maximizes production efficiency', correct: false, feedback: 'Auto-resuming an industrial robot after a human enters a primary hazard zone violates basic safety regulations.' },
          { text: 'Reject — manual reset is required after safeguarding is tripped', correct: true, feedback: 'Correct! If a safety device like a scanner or light curtain is tripped by a person, standard practice dictates a manual reset button (located safely outside the cell) must be pressed to resume production.' },
          { text: 'Approve — the scanner is fail-safe, so auto-resume is fine', correct: false, feedback: 'Even if the scanner is fail-safe, the system must ensure the area is truly clear via a conscious manual reset.' },
        ],
      },
      {
        situation: 'The robot welding torch requires manual tip changing every shift. The operator must reach through a light curtain to change the tip quickly.',
        options: [
          { text: 'Approve — the light curtain will safely stop the robot', correct: false, feedback: 'Relying solely on a light curtain for hands-on maintenance tasks is dangerous. Additional safety functions are required.' },
          { text: 'Reject — the robot must use Safe Standstill monitoring or Lockout/Tagout', correct: true, feedback: 'Correct! For tasks where the operator interacts directly with the EOAT, the system must guarantee the robot cannot move using certified Safe Standstill (a safety PLC function) or physical lockout.' },
          { text: 'Reject — install interlocked doors with key-exchange', correct: false, feedback: 'While secure, key-exchange interlocks severely hamper production efficiency for frequent, minor tasks like tip changes.' },
        ],
      }
    ],
  },
  'production-planner': {
    role: 'Production Planner',
    icon: '📋',
    context: 'You need to select the right robot and design the cell for a new production line task.',
    scenarios: [
      {
        situation: 'A food packaging line needs a robot to pick 120 items/minute, each weighing 200g, from a moving conveyor and place them into boxes.',
        options: [
          { text: 'Articulated robot — most flexible for any task', correct: false, feedback: 'Articulated robots are versatile but typically can\'t match the speed needed for 120 picks/minute lightweight operations.' },
          { text: 'Delta robot — optimized for high-speed lightweight picking', correct: true, feedback: 'Correct! Delta robots excel at high-speed pick-and-place of lightweight items — exactly what this application needs.' },
          { text: 'SCARA robot — good for horizontal assembly tasks', correct: false, feedback: 'SCARA robots are great for assembly but typically not fast enough for 120 picks/minute from a moving conveyor.' },
        ],
      },
      {
        situation: 'The new Delta robot needs an end-of-arm tool (EOAT) to pick up fragile chocolates without crushing them at high speed.',
        options: [
          { text: 'Mechanical jaw gripper — fast and reliable', correct: false, feedback: 'Mechanical jaws are harsh and would easily crush or mark the fragile chocolates.' },
          { text: 'Vacuum cup gripper with soft food-grade bellows', correct: true, feedback: 'Correct! Soft bellow vacuum cups distribute pressure evenly, are food-safe, and operate extremely fast without damaging the chocolates.' },
          { text: 'Magnetic gripper — no moving parts', correct: false, feedback: 'Chocolates are not magnetic! A magnetic gripper will not work here.' },
        ],
      },
      {
        situation: 'To achieve 120 picks per minute, the robot\'s vision system must locate the chocolates on the constantly moving conveyor. Where should the camera be mounted?',
        options: [
          { text: 'Fixed above the conveyor upstream of the robot (Conveyor Tracking)', correct: true, feedback: 'Correct! An upstream fixed camera captures part coordinates and sends them to the robot\'s conveyor tracking software perfectly.' },
          { text: 'Mounted directly on the robot\'s end effector', correct: false, feedback: 'A robot-mounted camera would suffer from extreme motion blur during high-speed Delta movements and would slow down the cycle time.' },
          { text: 'Fixed directly above the robot\'s picking zone', correct: false, feedback: 'The robot arm itself would block the camera\'s view of the incoming parts.' },
        ],
      },
      {
        situation: 'The production line plans to scale up to 240 items/minute next year. How should you prepare the cell architecture today?',
        options: [
          { text: 'Buy a larger, faster Delta robot today just to be safe', correct: false, feedback: 'Delta robots already operate near the physical limits of mechanics; finding one that does 240 picks/min alone is impractical.' },
          { text: 'Design the cell with space to add a second Delta robot and use load-balancing software', correct: true, feedback: 'Correct! Using two Delta robots running simultaneously with load-balancing (sharing the incoming camera data) is the standard industry strategy to scale speeds.' },
          { text: 'Switch to a SCARA robot which is better for future expansion', correct: false, feedback: 'SCARA robots are generally slower than Delta robots for pure pick-and-place operations.' },
        ],
      }
    ],
  },
  'maintenance-tech': {
    role: 'Maintenance Technician',
    icon: '🔧',
    context: 'You\'re called to diagnose an industrial robot that has repeatedly stopped during production.',
    scenarios: [
      {
        situation: 'The robot error log shows: "Axis 3 following error exceeded." The robot was running normally until 10 minutes ago. No changes were made to the program.',
        options: [
          { text: 'Replace the robot controller immediately', correct: false, feedback: 'A following error on a single axis typically points to a mechanical or motor issue on that specific joint, not the main controller.' },
          { text: 'Check axis 3 brake, motor, and encoder for mechanical or signal issues', correct: true, feedback: 'Correct! "Following error" means the actual encoder position doesn\'t match the commanded position — usually caused by a slipping brake, worn motor, or faulty encoder on that specific axis.' },
          { text: 'Restart the robot and hope the error clears', correct: false, feedback: 'Restarting without diagnosing the root cause risks severe mechanical damage and potential safety hazards.' },
        ],
      },
      {
        situation: 'During your physical inspection, you find that the motor for Axis 3 is extremely hot to the touch, and the internal brake is dragging and not fully releasing.',
        options: [
          { text: 'Apply grease to the brake pads to reduce friction', correct: false, feedback: 'Never lubricate robotic motor brakes! They rely on friction to safely hold the arm when power is lost.' },
          { text: 'Increase the motor current limit in the software to overcome the drag', correct: false, feedback: 'Increasing the current limit will simply burn out the motor faster and mask the mechanical failure.' },
          { text: 'Replace the motor/brake assembly immediately and recalibrate the axis', correct: true, feedback: 'Correct! A failing, dragging brake will burn out the motor and cause following errors. The entire assembly must be replaced.' },
        ],
      },
      {
        situation: 'After successfully installing the new motor on Axis 3, you power the robot on. However, the physical position of the arm no longer matches the position shown on the teach pendant.',
        options: [
          { text: 'Run the production program slowly until the robot learns its new position', correct: false, feedback: 'Robots do not "learn" positions automatically. Running it will cause major crashes.' },
          { text: 'Perform a mastering/calibration procedure for Axis 3 to establish the zero position', correct: true, feedback: 'Correct! Whenever a motor or encoder is replaced, the absolute position is lost. You must manually "master" or zero the axis using the manufacturer\'s procedure.' },
          { text: 'The new motor must be defective, replace it again', correct: false, feedback: 'The motor isn\'t defective; the controller simply lost the mechanical reference point during the swap.' },
        ],
      },
      {
        situation: 'You check the robot\'s maintenance logs out of curiosity and notice the gear lube in the Axis 3 reducer hasn\'t been changed in 18,000 hours of continuous operation.',
        options: [
          { text: 'Ignore it, grease lasts forever in modern robots', correct: false, feedback: 'Lubricants break down under extreme friction. Failure to replace grease leads to catastrophic gear failure.' },
          { text: 'Immediately drain and refill the gear lube, as the worn reducer likely caused the motor stress', correct: true, feedback: 'Correct! Old, degraded grease increases mechanical resistance (friction) dramatically, which forces the motor and brake to work harder, leading to the failure you just fixed.' },
          { text: 'Add a little water to thin out the old grease', correct: false, feedback: 'Adding water will cause rust and immediately destroy the metallic gear elements.' },
        ],
      }
    ],
  },
};

// ── Next-Skill Pipelines (Feature 9) ──
export const NEXT_SKILL_PIPELINES = [
  {
    id: 'pipeline-a',
    title: 'Robot Programming Fundamentals',
    description: 'Deep dive into ROS2, Python for robotics, motion planning algorithms, and real robot programming projects.',
    icon: '💻',
    suitedFor: 'Learners who want to write advanced robot software',
    duration: '40 hours',
    locked: true,
  },
  {
    id: 'pipeline-b',
    title: 'PLC & Robot Integration',
    description: 'Master PLC programming, robot-PLC communication, industrial protocols (EtherNet/IP, PROFINET), and complete cell integration.',
    icon: '🔗',
    suitedFor: 'Learners targeting automation engineer roles',
    duration: '35 hours',
    locked: true,
  },
  {
    id: 'pipeline-c',
    title: 'Virtual Commissioning & Simulation',
    description: 'Learn digital twins, virtual robot simulation, offline programming, and commissioning without physical hardware.',
    icon: '🌐',
    suitedFor: 'Learners interested in Industry 4.0 digital transformation',
    duration: '30 hours',
    locked: true,
  },
];
