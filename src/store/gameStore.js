import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MODULES } from '../data/courseData';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Player state
      playerName: 'Cadet',
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: null,

      // Progress
      completedModules: [],
      unlockedModules: ['mod-1'],
      currentPhase: 'spark',
      currentModule: null,
      currentStep: 0,

      // Gamification
      badges: [],
      stars: {},
      points: {},
      confidenceRatings: {},
      masteryResults: {},  // { [moduleId]: { score, total, passed, timestamp } }

      // Daily streak calendar (array of date strings)
      streakCalendar: [],

      // Pre/Post Assessment
      preAssessmentScores: null,   // { score, total, timePerQuestion[], level }
      postAssessmentScores: null,  // { score, total, level }
      diagnosticComplete: false,
      learnerTrack: 'beginner',
      recommendedModule: 'mod-1',

      // Progressive Robot Skill Tree
      robotParts: {},  // { 'left-foot': true, 'right-foot': true, ... }

      // Spin Wheel
      spinWheelHistory: [],       // [{ moduleId, segmentIndex, content }]
      unlockedBonusContent: [],   // ['module-segment-id', ...]

      // Quiz History (for recap)
      quizHistory: [],  // [{ moduleId, questions, answers, score, timestamp }]

      // Theme
      theme: 'light',

      // ── Actions ──

      setPlayerName: (name) => set({ playerName: name }),
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },
      initTheme: () => {
        document.documentElement.setAttribute('data-theme', get().theme);
      },

      addXP: (amount) => {
        const { xp, level } = get();
        const newXP = xp + amount;
        const xpForNextLevel = level * 150;
        if (newXP >= xpForNextLevel) {
          set({ xp: newXP - xpForNextLevel, level: level + 1 });
        } else {
          set({ xp: newXP });
        }
      },

      // Per-module step progress: { 'mod-1': [0, 1, 2], 'mod-2': [0] }
      moduleProgress: {},

      completeModule: (moduleId) => {
        const { completedModules, unlockedModules } = get();
        if (completedModules.includes(moduleId)) return;

        const newCompleted = [...completedModules, moduleId];
        set({ completedModules: newCompleted });

        // Auto-unlock next module (mod-1 → mod-2 → … → mod-10)
        const num = parseInt(moduleId.split('-')[1]);
        const nextId = `mod-${num + 1}`;
        if (!unlockedModules.includes(nextId)) {
          set({ unlockedModules: [...unlockedModules, nextId] });
        }
      },

      // Track per-module step completion
      markModuleStep: (moduleId, stepIndex) => {
        const { moduleProgress } = get();
        const steps = moduleProgress[moduleId] || [];
        if (!steps.includes(stepIndex)) {
          set({ moduleProgress: { ...moduleProgress, [moduleId]: [...steps, stepIndex] } });
        }
      },

      unlockModule: (moduleId) => {
        const { unlockedModules } = get();
        if (!unlockedModules.includes(moduleId)) {
          set({ unlockedModules: [...unlockedModules, moduleId] });
        }
      },

      earnBadge: (badgeId) => {
        const { badges } = get();
        if (!badges.includes(badgeId)) {
          set({ badges: [...badges, badgeId] });
        }
      },

      setStars: (moduleId, count) => {
        set({ stars: { ...get().stars, [moduleId]: count } });
      },

      setConfidence: (moduleId, rating) => {
        set({ confidenceRatings: { ...get().confidenceRatings, [moduleId]: rating } });
      },

      saveMasteryResult: (moduleId, result) => {
        set({ masteryResults: { ...get().masteryResults, [moduleId]: { ...result, timestamp: Date.now() } } });
      },

      setCurrentModule: (moduleId) => set({ currentModule: moduleId, currentStep: 0 }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setLearnerTrack: (track) => set({ learnerTrack: track, diagnosticComplete: true }),
      setDiagnosticComplete: (track, moduleId) => set({
        learnerTrack: track,
        diagnosticComplete: true,
        recommendedModule: moduleId,
      }),

      // ── Daily Streak ──
      updateStreak: () => {
        const { lastActive, streakCalendar } = get();
        const today = new Date().toDateString();
        if (lastActive === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newCalendar = [...streakCalendar, today].slice(-90); // keep last 90 days
        if (lastActive === yesterday) {
          set({ streak: get().streak + 1, lastActive: today, streakCalendar: newCalendar });
        } else {
          set({ streak: 1, lastActive: today, streakCalendar: newCalendar });
        }
      },

      // ── Pre/Post Assessment ──
      savePreAssessment: (data) => set({ preAssessmentScores: data }),
      savePostAssessment: (data) => set({ postAssessmentScores: data }),

      // ── Robot Parts ──
      unlockRobotPart: (partId) => {
        set({ robotParts: { ...get().robotParts, [partId]: true } });
      },

      // ── Spin Wheel ──
      addSpinResult: (result) => {
        const { spinWheelHistory, unlockedBonusContent } = get();
        set({
          spinWheelHistory: [...spinWheelHistory, result],
          unlockedBonusContent: [...new Set([...unlockedBonusContent, result.contentId])],
        });
      },

      // ── Quiz History (Recap) ──
      saveQuizResult: (result) => {
        set({ quizHistory: [...get().quizHistory, { ...result, timestamp: Date.now() }] });
      },

      // ── Phase progress helpers (now per-module step-based) ──
      // Steps 0-1 = Spark, Steps 2-3 = Build, Steps 4-6 = Master
      getPhaseProgress: (phase) => {
        const { moduleProgress } = get();
        const allModuleIds = Object.keys(moduleProgress);
        const stepRanges = { spark: [0, 1], build: [2, 3], master: [4, 5, 6] };
        const targetSteps = stepRanges[phase] || [];
        const totalPossible = 10 * targetSteps.length; // 10 modules × N steps
        if (totalPossible === 0) return 0;
        let done = 0;
        allModuleIds.forEach(id => {
          const steps = moduleProgress[id] || [];
          targetSteps.forEach(s => { if (steps.includes(s)) done++; });
        });
        return Math.round((done / totalPossible) * 100);
      },

      getTotalProgress: () => {
        const { completedModules } = get();
        return Math.round((completedModules.length / (MODULES?.length || 10)) * 100);
      },

      resetProgress: () => set({
        xp: 0, level: 1, streak: 0,
        completedModules: [], unlockedModules: ['mod-1'],
        currentPhase: 'spark', currentModule: null, currentStep: 0,
        badges: [], stars: {}, points: {}, confidenceRatings: {}, masteryResults: {},
        diagnosticComplete: false,
        streakCalendar: [],
        preAssessmentScores: null, postAssessmentScores: null,
        robotParts: {},
        spinWheelHistory: [], unlockedBonusContent: [],
        quizHistory: [],
        moduleProgress: {},
      })
    }),
    { name: 'nebula-2-store-v2' }
  )
);

export default useGameStore;

