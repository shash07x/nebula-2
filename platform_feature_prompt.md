# Developer Prompt — Learning Platform Feature Integration
## Platform: https://dist-2kp6gr6d1-shash07xs-projects.vercel.app/
## Source Frameworks: Applied Robotics Blueprint + SkillSprint Momentum

---

## CONTEXT

This is a learning platform for industrial robotics education. The platform needs to be upgraded to implement the **SkillSprint Loop** instructional framework and the **Applied Robotics Blueprint** course structure. The goal is to move the platform from a static content delivery system to a dynamic, adaptive learning engine.

The target learners are: **Technicians, Operators, and Junior Engineers** who need real-world application readiness — not memorisation.

---

## FEATURES TO ADD

### 1. THREE-PHASE LEARNING JOURNEY UI

Replace or upgrade the current course structure with a 3-phase progression system:

- **Phase 1: Spark** (Hours 1–12) — "I can do this."
  - Focus: Curiosity, confidence, safety basics, robot typing
  - Visual badge: Explorer (Safety Watcher)
  - Lock status: Unlocked by default

- **Phase 2: Build** (Hours 13–30) — "I'm getting better at this."
  - Focus: Tooling, sensors, programming logic, reach calculations
  - Visual badge: Operator (EOAT Selector)
  - Lock status: Unlocked after Phase 1 capstone

- **Phase 3: Master** (Hours 31–45) — "I can apply this confidently."
  - Focus: Integrated cell flow, error troubleshooting, industry capstones
  - Visual badge: Integrator (Workcell Thinker)
  - Lock status: Unlocked after Phase 2 capstone

**UI requirement:** Show a visual capability ramp (progress curve) on the dashboard that rises across all 3 phases. Each phase should display: hours allocated, current progress, and the learner's own confidence state.

---

### 2. SKILLSPRINT LOOP — 6-STAGE MODULE STRUCTURE

Every module on the platform must follow this 6-stage loop. Redesign the module player UI to show the learner which stage they are in:

| Stage | Name | UI Component |
|-------|------|-------------|
| 1 | **Hook** | Full-width scenario card with a real factory problem or "Can you solve this?" prompt |
| 2 | **Learn** | Micro-learning block (3–7 min max). Video or animated concept card with an immediate checkpoint question |
| 3 | **Practice** | Interactive guided exercise (drag-and-drop, labelling, or multiple choice with hints) |
| 4 | **Apply** | Scenario-based task card. Learner must make a decision and justify it |
| 5 | **Reflect** | "Where did you struggle?" prompt + instant AI-generated feedback. Confidence self-rating (1–5) |
| 6 | **Upgrade** | A harder variant of the same task. Completing this unlocks the next module and a badge |

Display a horizontal progress bar at the top of each module showing stages 1–6. The learner should always see where they are in the loop.

---

### 3. ADAPTIVE DIFFICULTY SYSTEM (Three Paths Per Module)

Each module must offer 3 learner paths. Auto-route the learner based on their diagnostic score, or let them manually select:

- **Beginner Path (Level 1):** Guided practice. Hints visible. Lower-risk tasks. Multiple choice with 3 clearly distinct options.
- **Intermediate Path (Level 2):** Assisted practice. Less guidance. Troubleshooting tasks. Learner must justify their answer.
- **Expert Path (Level 3):** Independent practice. Skip-basics option available. Open-ended scenario design tasks.

**Adaptive logic:** After each module, evaluate the learner's score, speed, and confidence rating. If they score >85% with high confidence, suggest upgrading path. If they score <60%, suggest the guided path for the next module. Show a gentle recommendation card — never force a downgrade without the learner's consent.

---

### 4. DIAGNOSTIC ASSESSMENT (ENTRY TEST)

Add a skill baseline assessment at onboarding (before any module begins):

- 8–12 questions covering: robot types, safety basics, component identification, and simple logic
- Results automatically route the learner to the correct starting phase and path
- Display a "Skill Baseline" summary card after completion showing: "You're starting at Phase 1, Intermediate Path"
- Store the baseline score and compare to end-of-phase scores to show growth

---

### 5. PROGRESS DASHBOARD — STREAKS, BADGES & MILESTONES

Build or upgrade the learner dashboard with the following elements:

**Top stats row:**
- % of course completed
- Current phase (Spark / Build / Master)
- Current path level (Beginner / Intermediate / Expert)
- Daily streak counter (days in a row with at least one completed module stage)

**Badge shelf:** Display earned badges visually:
- Level 1: Explorer (Safety Watcher) — earned at Phase 1 complete
- Level 2: Operator (EOAT Selector) — earned at Phase 2 complete
- Level 3: Integrator (Workcell Thinker) — earned at Phase 3 complete
- Module-specific micro-badges for each completed SkillSprint loop

**Progress chart:** A line/curve chart showing learner capability growth across time (hours spent vs. score average). This mirrors the 45-hour capability ramp concept.

**Milestones:**
- First module completed
- First Upgrade challenge completed
- First 3-day streak
- Phase 1 capstone submitted
- Portfolio first item added

---

### 6. MULTI-LAYER ASSESSMENT MODEL

Replace or supplement the current quiz system with 4 assessment layers:

| Layer | When | Format |
|-------|------|--------|
| **Diagnostic** | Before learning starts | Entry test (see Feature 4) |
| **Formative** | During each module (after Learn stage) | 1–3 quick checkpoint questions |
| **Performance** | End of each module (Upgrade stage) | Simulated task or decision scenario |
| **Mastery** | End of each phase | Capstone project or workcell design challenge |

**Grading note:** Scores should reward *reasoning quality*, not just correct answers. Where possible, require the learner to justify their selection. Display "Why this matters" feedback after every assessment answer.

---

### 7. CAPSTONE CHALLENGE MODULE

Add a dedicated Capstone page at the end of each phase. For the robotics course, the Phase 3 capstone should present:

**Title:** Design & Diagnose a Robotic Workcell

**Scenario:** A pick-and-place cell where the sensor detects the component, but the cycle fails to start.

**Learner must:**
1. Identify 3 possible reasons for the failure
2. Describe the full production cycle sequence
3. Point out one possible failure point
4. Explain the correct safe response before troubleshooting begins
5. Select the correct EOAT for the task
6. Map the sensor type needed for part detection

**Output:** The learner's completed capstone brief is saved to their **Portfolio** (see Feature 8).

---

### 8. LEARNER PORTFOLIO

Add a Portfolio section to the platform. Each learner accumulates tangible outputs as they progress:

- 1 Applied process flow (from a module Apply task)
- 1 Comprehensive safety checklist (from the Safety module)
- 1 EOAT selection matrix (from the Tooling module)
- 1 Complete mini capstone cell design (from the Phase 3 capstone)

**UI:** Card-based portfolio view. Each card shows: output type, date completed, module it came from, and a download/share option.

---

### 9. NEXT-SKILL PIPELINE (POST-COURSE UNLOCKS)

After the learner completes Phase 3 and the capstone, show them a "What's Next" screen with 3 unlockable course pipelines:

- **Pipeline A:** Robot Programming Fundamentals
- **Pipeline B:** PLC & Robot Integration
- **Pipeline C:** Virtual Commissioning & Simulation

Display each pipeline as a locked card that becomes clickable on capstone completion. Include a brief description of what each pipeline covers and who it's best suited for.

---

### 10. MODULE CONTENT — CORE TECHNICAL SEQUENCE

The platform should contain modules in this order (use these as content pages or sub-modules):

| Module | Topic | Hours | Key Content |
|--------|-------|-------|-------------|
| M1 | Introduction & Robot Value | 2 hrs | What robots do, industrial use cases, match applications to robot types |
| M2–M3 | Robot Types & System Anatomy | 4 hrs | Delta, SCARA, Articulated. Blank diagram identification exercise |
| M4 | Safety Foundations | 3 hrs | Pinch points, light curtains, emergency stops. Safety Inspector scenario |
| M5–M6 | Motion & Workspace | 5 hrs | Degrees of freedom, reach, payload limits. Reach calculation tasks |
| M7 | End-of-Arm Tooling (EOAT) | 3 hrs | Vacuum cups, magnetic tools, mechanical grippers. EOAT-to-product matching |
| M8 | Sensor Peripherals | 2 hrs | Photoelectric, proximity, vision basics. Sensor fault identification |
| M9 | Programming Logic | 4 hrs | Pseudo-code, wait states, signal actions. Flow-building sequence tasks |
| M10 | Workcell Integration & Capstone | 4 hrs | All modules converge. Full workcell design challenge |

---

### 11. ROLE-BASED SCENARIOS

Add scenario cards within the Apply and Upgrade stages that assign the learner a specific industrial role:

- **Safety Inspector:** Identify all hazards in a workcell image. Rate risk levels.
- **Production Planner:** Select the correct robot for the task given payload, reach, and speed constraints.
- **Maintenance Technician:** Given an error log and symptoms, identify the most likely root cause.

Each role-based scenario must include: a context paragraph, a visual or diagram, 2–4 decision options, and feedback explaining why each option is correct or incorrect.

---

### 12. TROUBLESHOOTING GAME MECHANIC

Add interactive troubleshooting exercises (at least one per phase):

**Format:** Present an error event (e.g., "Robot is moving, but no product is picked."). Show 3 diagnostic branches: Sensors, Tooling, Logic. The learner must click through each branch, ask diagnostic questions, and identify the root cause.

**Scoring:** Points awarded for: correct root cause identified, correct order of checks, time taken (faster = bonus).

**Example trees to build:**
1. *"Operator presses start, but the robot does not move."* → Safety gate open / No part present / Robot fault / Controller not ready
2. *"Robot is moving, but no product is picked."* → Sensor misalignment / Gripper pressure / Sequence logic error

---

### 13. VISUAL IDENTIFICATION EXERCISE COMPONENT

Build a reusable component for visual identification tasks:

- Display an image of a robot, workcell, or component
- Show empty label boxes pointing to key parts
- Learner drags and drops the correct label to each part
- After submission: show correct labels, highlight errors, give explanation

**Use cases:** Robot anatomy labelling, safety hazard spotting, EOAT identification, sensor placement.

---

### 14. MOTIVATION & ENGAGEMENT SYSTEM

Implement the following engagement mechanics:

- **Streaks:** Count consecutive days the learner completes at least one module stage. Display on dashboard. Send a reminder notification (or banner) if streak is about to break.
- **Stars/Points:** Award points for: completing each stage (10pts), completing an Upgrade challenge (25pts), submitting a capstone (50pts), earning a badge (100pts). Display a running total.
- **Unlockables:** Expert path, Portfolio export, and Pipeline courses unlock progressively. Show locked items as visible-but-grayed cards.
- **Autonomy:** Allow learners to choose their task order within a phase (not across phases). Let them choose Beginner or Expert path at module start.
- **Repeat Without Shame:** Allow unlimited retries on all practice and performance tasks. Track best score only.

---

## DESIGN GUIDELINES

- Use a clean industrial/technical aesthetic consistent with the robotics theme
- Each module stage should feel like a new "scene" — not just another page of text
- Hook cards should feel bold and visually engaging (image + scenario question)
- Feedback messages should always explain the "why," not just "correct/incorrect"
- Mobile-responsive design required
- Accessibility: all interactive components must have keyboard navigation and ARIA labels

---

## TECHNOLOGY NOTES

- The platform is deployed on Vercel. It appears to use a modern JS framework (React/Next.js likely).
- All adaptive logic can be handled client-side with localStorage or a lightweight backend store — no need for a full ML system at this stage. Use score thresholds and simple rules.
- Scenario and troubleshooting content can be JSON-driven for easy content updates without code changes.

---

## PRIORITY ORDER (Suggested Implementation Sequence)

1. SkillSprint Loop module player UI (Feature 2) — most impactful structural change
2. Progress Dashboard + Badges (Feature 5) — immediate motivation boost
3. Three-Phase Learning Journey UI (Feature 1) — core navigation structure
4. Adaptive Difficulty System (Feature 3) — personalization layer
5. Diagnostic Assessment (Feature 4) — onboarding flow
6. Assessment Model overhaul (Feature 6) — replaces static quizzes
7. Visual Identification Component (Feature 13) — reusable interactive tool
8. Troubleshooting Game (Feature 12) — high engagement mechanic
9. Role-Based Scenarios (Feature 11) — content enrichment
10. Learner Portfolio (Feature 8) — output tracking
11. Capstone Module (Feature 7) — end-of-course experience
12. Next-Skill Pipeline (Feature 9) — post-completion retention

---

*End of prompt. All features are derived from the Applied Robotics Blueprint and SkillSprint Momentum framework documents.*
