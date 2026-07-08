# Replit Master Prompt — “Life in the UK Test 2026” app

This file gives you everything you need to rebuild this app on Replit with a
polished, iOS-style UI.

**How to use it (2 minutes):**

1. On Replit, create a new app and open the AI/Agent panel.
2. Upload `src/data/questions.json` from this repository into the new Replit
   project as **`data/questions.json`** (it contains all 150 questions,
   answers and explanations — the agent must not invent its own).
3. Copy everything inside the box below and send it as your first message.
4. When the agent finishes, run the acceptance checklist at the end of the
   prompt yourself before accepting the result.

---

## The master prompt (copy from here)

```text
ROLE
You are a senior product engineer and UI designer with 10+ years of experience
shipping polished, mobile-first apps. Work carefully, double-check every
requirement in this brief before declaring anything done, and do not invent
features or content that contradict it.

PRODUCT
Build “Life in the UK Test 2026” — a practice app for the official UK
citizenship/settlement test. It must feel like a native iOS app: fast,
beautiful, thumb-friendly, and usable one-handed on a phone. Desktop should
simply show a centered, max-width mobile-style layout.

TECH (keep it simple and reliable)
- React + Vite + TypeScript, single-page app. Tailwind CSS for styling.
- 100% client-side. NO backend, NO database, NO accounts, NO external APIs.
- All user data (attempts, per-question stats, mistakes) in localStorage.
- Make it an installable PWA (manifest + icons + correct theme-color) so it
  can be added to an iPhone home screen and open full-screen.

DATA — SINGLE SOURCE OF TRUTH
I have uploaded data/questions.json. It contains:
- meta.testFormat: { questions: 24, minutes: 45, passMark: 0.75 }
- meta.chapters: 5 chapters with ids: values, uk, history, society, government
- questions: an array of exactly 150 questions with this schema:
  {
    "id": "hist-01",             // unique, stable
    "chapter": "history",        // one of the 5 chapter ids
    "type": "single" | "multi" | "truefalse",
    "question": "…",
    "options": ["…", …],         // 4 options (2 for truefalse and some single)
    "answers": [1],              // indices into options; exactly 2 for multi
    "explanation": "…"
  }
Rules:
- Import this file as-is. NEVER rewrite, reword, add or remove questions.
- Validate it at startup (count = 150, indices in range) and fail loudly in
  dev if invalid.
- “multi” questions must show a “Select TWO answers” hint and require exactly
  two selections. Scoring is exact-set match: partially correct = wrong.
- Shuffle question order per session and option order per question
  (EXCEPT truefalse: always show True then False).

SCREENS & FLOWS
1) Home
   - App name, small badge “Updated for the 2026 test · 150 questions · Free”.
   - Primary CTA “Start a mock test”, secondary “Practise by chapter”.
   - Three stat tiles for the official format: 24 questions · 45 min · 75% to
     pass (18 of 24).
   - If the user has history: compact progress strip (questions answered,
     best mock score, mocks passed) and a banner linking to Mistakes when the
     mistakes list is not empty.
   - Chapter cards (5) with question counts.

2) Mock Test (exam simulation)
   - Intro screen stating the rules before the clock starts.
   - 24 questions sampled from the bank STRATIFIED by chapter (proportional to
     chapter sizes, largest-remainder rounding so it always sums to 24).
   - 45:00 countdown, always visible; turns red under 5 minutes; auto-submits
     at 0:00. No feedback during the test (like the real exam).
   - Free navigation Previous/Next, flag button per question, and a review
     grid showing answered/unanswered/flagged; jump by tapping a number.
   - Submit early allowed; if questions are unanswered, confirm first
     (“X unanswered questions will be marked incorrect”).
   - Quitting mid-test needs confirmation and discards the attempt.

3) Results (after mock or practice)
   - Animated score ring with percent and X of Y.
   - Mock: huge PASS (green) or FAIL (red) verdict; pass = correct/total ≥ 75%.
   - Per-chapter breakdown bars.
   - Full answer review: filter tabs All / Incorrect; each row expands to show
     the question, your answer, the correct answer, and the explanation.
   - Actions: retake / review mistakes / done.

4) Practice by chapter
   - Chapter list with lifetime accuracy bars.
   - Session setup: choose 10 / 25 / All questions.
   - INSTANT feedback mode: select → “Check answer” → options recolor (green
     correct, red your wrong pick, dashed-green missed correct), explanation
     card appears → “Next question”. Progress is saved even if the user quits
     mid-session (after a confirmation).

5) Mistakes
   - Every question ever answered wrong stays listed (with chapter badge and
     “missed N times” when > 1) until the user answers it correctly anywhere.
   - “Practise these questions” runs a feedback session over exactly that list.
   - Friendly empty state when the list is empty.

6) Progress
   - Tiles: questions answered, mock tests taken, best score, average score.
   - Accuracy-by-chapter bars with the hint “Aim for a steady 75%+ in every
     chapter before booking the real test.”
   - Recent sessions list (mode, chapter, score, Pass/Fail badge, relative
     time).
   - “Reset all progress” with a confirmation dialog. State clearly that data
     lives only in this browser.

DESIGN SYSTEM (this is what “nice UI” means — follow it exactly)
- Palette (light): background #F7F9FC, card #FFFFFF, text #10182B,
  primary royal blue #1D4ED8, red #C8102E (destructive/fail/timer-low),
  success green #1E7A4F, amber #B45309 for warnings/flags. Dark mode variants
  of all tokens, toggled by system preference + a manual toggle.
- Typography: system font stack (SF Pro on iOS). Bold, large question text
  (~22–24px), generous line-height. Numbers in tabular-nums.
- Shape: 12–16px corner radius on cards/buttons, soft borders and subtle
  shadows, no heavy skeuomorphism.
- Touch: every tappable target ≥ 44px tall; options are full-width rounded
  rows with a lettered chip (A–D); pressed/selected states are obvious.
- Motion: quick slide/fade between questions, animated progress bar and score
  ring; respect prefers-reduced-motion.
- Layout: safe-area insets respected (env(safe-area-inset-bottom)); sticky
  bottom action bar during sessions; content max-width ~672px centered.
- Accessibility: semantic roles (radiogroup/checkbox), visible focus rings,
  aria-live for feedback and low-time warnings, keyboard operable, WCAG AA
  contrast in both themes.

CORRECTNESS RULES (non-negotiable)
- Pass threshold: ceil(total * 0.75) — for 24 questions that is 18.
- Unanswered mock questions score as wrong.
- A question leaves the Mistakes list only when answered correctly.
- Timer must be computed from a deadline timestamp (endsAt - now), not by
  decrementing a counter, so it stays accurate if the tab sleeps.
- localStorage access must be wrapped in try/catch and never crash the app.
- No hydration/console errors, no dead buttons, no placeholder screens.

ACCEPTANCE CHECKLIST (test all of this yourself before finishing)
[ ] questions.json loads, validates, and all 150 questions are reachable.
[ ] Mock test: exactly 24 unique questions, all 5 chapters represented.
[ ] Timer counts down from 45:00, turns red at 4:59, auto-submits at 0:00.
[ ] Multi questions require exactly 2 picks; partial selection can’t submit
    in practice and scores wrong in mock.
[ ] Flag → review grid shows the flag; jumping via the grid works.
[ ] Early submit with unanswered questions asks for confirmation.
[ ] Results: correct percent, PASS at 18/24, FAIL at 17/24, explanations
    visible for every reviewed answer.
[ ] Practice feedback colors: green correct, red wrong pick, dashed green
    missed answer, explanation shown.
[ ] Mistakes list grows on wrong answers and shrinks on correct ones.
[ ] Progress survives a page reload; Reset clears everything after confirm.
[ ] Dark mode looks intentional everywhere; no unstyled flashes.
[ ] Lighthouse mobile: no console errors; layout has no horizontal scroll.

Build it completely. Do not stop at a skeleton. If anything in this brief is
ambiguous, choose the interpretation that best matches the official Life in
the UK test experience.
```

## (copy up to here)

---

## Notes for you (not part of the prompt)

- **Where the questions live:** `src/data/questions.json` in this repo — 150
  questions, 5 chapters (10 values / 6 uk / 60 history / 37 society /
  37 government), every one with an explanation. The same file powers the
  Next.js app in this repo, and its integrity is covered by unit tests.
- **Want a real App Store app instead of a PWA?** Replace the TECH section of
  the prompt with: “Expo (React Native) + TypeScript, expo-router, NativeWind
  for styling, AsyncStorage instead of localStorage; everything else in this
  brief applies unchanged.” Replit can scaffold Expo; you then build with
  EAS (`eas build --platform ios`) and submit with an Apple Developer account
  ($99/yr) via App Store Connect.
- **App Store review tip:** quiz apps are approved routinely, but include the
  disclaimer shown in this repo’s footer (“Unofficial study aid… not
  affiliated with the Home Office”) on your App Store listing and inside the
  app, and avoid using the official handbook’s text verbatim — the questions
  in `questions.json` are original wordings for exactly this reason.
