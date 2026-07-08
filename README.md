# Life in the UK Test — practice app

A polished, mobile-first practice app for the official **Life in the UK
Test** (the UK citizenship / settlement exam), built with Next.js 16,
React 19, TypeScript and Tailwind CSS v4.

> **Unofficial study aid.** Not affiliated with the Home Office. Study the
> official handbook *Life in the United Kingdom: A Guide for New Residents*
> and book the real test on GOV.UK.

---

## What's inside

- **150 original practice questions** across all five official handbook
  chapters, every one with an explanation
  (`src/data/questions.json` — reusable in any other app):

  | Chapter | Questions |
  | --- | --- |
  | Values and Principles of the UK | 10 |
  | What is the UK? | 6 |
  | A Long and Illustrious History | 60 |
  | A Modern, Thriving Society | 37 |
  | The UK Government, the Law and Your Role | 37 |

- **Mock test** in the real exam format: 24 questions stratified across
  chapters, a 45-minute countdown that auto-submits at zero, flagging, a
  review grid, early submit with confirmation, and a pass mark of 75%
  (18 of 24) — with a full answer review and explanations at the end.
- **Practice by chapter** with instant feedback: pick 10 / 25 / all
  questions, check each answer, read the explanation, keep going.
- **Mistakes list**: every question you get wrong anywhere stays on the list
  until you answer it correctly. Drill exactly those questions.
- **Progress**: mock history with Pass/Fail badges, best/average scores and
  per-chapter accuracy bars. Everything is stored privately in
  `localStorage` — no accounts, no backend.
- **Question types** mirror the real test: single answer, true/false and
  “select TWO answers” (scored as an exact match, like the real thing).
- **Production concerns**: PWA manifest + generated app icons (installable
  on an iPhone home screen), SEO metadata + JSON-LD, sitemap/robots, dark
  mode, reduced-motion support, WCAG-minded semantics and focus management,
  strict security headers/CSP.

Also in the repo: [`REPLIT_MASTER_PROMPT.md`](REPLIT_MASTER_PROMPT.md) — a
ready-to-paste master prompt (plus the question bank) for rebuilding this
app on Replit, including an Expo/React Native variant for a native iOS build.

---

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

### Scripts

```bash
npm run dev            # dev server
npm run build          # production build
npm run start          # serve the production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # unit tests (Vitest)
npm run test:e2e       # end-to-end tests (Playwright)
```

---

## Architecture

```
src/
├─ data/questions.json        # the 150-question bank (single source of truth)
├─ lib/
│  ├─ questions.ts            # zod-validated bank loading + chapter helpers
│  ├─ quiz.ts                 # pure engine: stratified sampling, shuffling,
│  │                          #   exact-match scoring, pass rules, clock
│  ├─ progress.ts             # attempt/stat aggregation (pure)
│  └─ utils.ts                # cn, relative time, id generation
├─ hooks/
│  ├─ use-local-storage.ts    # SSR-safe persisted state
│  └─ use-progress.tsx        # attempts, per-question stats, mistakes list
├─ components/
│  ├─ quiz/                   # runner, results, screens, cards, score ring
│  ├─ layout/ ui/ seo/        # shell + primitives
│  └─ providers.tsx           # theme + progress + toaster
└─ app/
   ├─ (site)/                 # header/footer pages: home, practice, mistakes, progress
   ├─ (session)/              # distraction-free: mock-test, practice/[chapter],
   │                          #   mistakes/review
   └─ icon.tsx apple-icon.tsx manifest.ts sitemap.ts robots.ts
```

Design decisions worth knowing:

- **The bank is data, the engine is pure.** `questions.json` is validated
  with zod at import; the quiz engine takes an injectable RNG so sampling
  and shuffling are deterministic under test.
- **Exam accuracy.** Mock tests allocate questions per chapter with
  largest-remainder rounding (always exactly 24, every chapter represented),
  unanswered questions score as wrong, and the timer is computed from a
  deadline timestamp so it stays honest if the tab sleeps.
- **Route groups** give quiz sessions a chrome-free, full-screen layout
  while normal pages keep the site header and footer.

## Testing

- **Unit (Vitest):** bank integrity (exactly 150 questions, unique ids,
  valid answer indices, explanations everywhere, types consistent), engine
  behaviour (stratification, exact-set scoring, 18/24 pass boundary,
  selection rules), and progress aggregation.
- **E2E (Playwright):** home render, full practice flow (gated check button,
  feedback, quit-and-save), mock test flow (timer, review grid, early submit
  confirmation, marked results) and the progress empty state.

## Deployment

Fully static output — deploys to Vercel (or any Node host) with zero
configuration: import the repo and deploy.

## License

MIT
