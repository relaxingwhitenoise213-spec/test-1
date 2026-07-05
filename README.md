# Vocalis — Text-to-Speech Studio

A modern, production-ready text-to-speech web application built with Next.js 16,
React 19, TypeScript and Tailwind CSS v4. Convert text into natural speech with a
clean, accessible studio — dark/light mode, live text analytics, voice controls,
history, dashboard, and a pluggable multi-provider engine.

> **Runs with zero configuration.** Out of the box, Vocalis uses your browser's
> built-in **Web Speech API** — no API keys, no database, no accounts required.
> Cloud providers (OpenAI, ElevenLabs) and the full SaaS data layer activate
> when you add their credentials.

---

## Features

- **Studio** — large editor with live character / word / sentence / paragraph
  counts, estimated duration, autosave, undo/redo, copy / paste / clear.
- **Voice engine (adapter pattern)** — switch between the browser engine and
  cloud providers. Search voices, filter by language, favorite, and preview.
- **Playback & export** — play / pause / resume / stop with progress for browser
  voices; a full audio player (waveform seek, speed, loop, volume, share,
  download) for cloud audio in MP3 / WAV / OGG / AAC.
- **History** — every generation is saved (locally by default): search, sort,
  filter, favorite, rename, delete, and re-load into the studio.
- **Dashboard** — totals, characters used, quota, an activity chart, and recent
  activity.
- **Settings** — theme, provider status, data export and deletion.
- **Production concerns** — SEO metadata + Open Graph + JSON-LD, sitemap /
  robots / manifest, WCAG-minded accessibility (skip link, focus rings, ARIA,
  reduced-motion), keyboard shortcuts, security headers & CSP, request
  validation and rate limiting, error / 404 / loading / empty states.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/⌘ + Enter` | Generate speech |
| `Ctrl/⌘ + Z` / `Ctrl/⌘ + Shift + Z` | Undo / redo text |
| `Space` | Play / pause (browser voice) |
| `Esc` | Stop playback |

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS v4, shadcn-style primitives |
| Animation | Framer Motion |
| Icons | Lucide |
| Validation | Zod |
| Notifications | Sonner |
| Testing | Vitest (unit) + Playwright (E2E) |
| Database (optional) | Prisma + PostgreSQL |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — app runs without it
npm run dev                  # http://localhost:3000
```

That's it. Open the studio and start generating speech with your browser's
voices.

### Scripts

```bash
npm run dev            # dev server
npm run build          # production build
npm run start          # start production server
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # unit tests (Vitest)
npm run test:coverage  # unit tests + coverage
npm run test:e2e       # end-to-end tests (Playwright)
```

---

## Adding cloud TTS providers

Cloud providers are enabled purely by setting a server-side environment
variable. Keys are never sent to the browser — synthesis happens in the
`/api/tts` route handler.

```bash
# .env.local
OPENAI_API_KEY="sk-..."          # enables OpenAI TTS
ELEVENLABS_API_KEY="..."         # enables ElevenLabs
```

Restart the dev server, pick the provider in the studio's **Voice & settings**
panel, and generated audio becomes downloadable.

### Adding a new provider

The engine follows the open/closed principle. To add Google, Azure or Polly:

1. Implement the `ServerTTSProvider` interface in
   `src/lib/tts/providers/<name>.ts`.
2. Register it in `src/lib/tts/registry.ts`.
3. Add its metadata to `src/config/providers.ts`.

No other code changes are required — the UI, API and history adapt automatically.

---

## Architecture

```
src/
├─ app/                     # App Router: pages, API routes, SEO route files
│  ├─ api/tts/route.ts      # POST — synthesize (validated, rate-limited)
│  ├─ api/voices/route.ts   # GET  — list provider voices
│  ├─ dashboard | history | settings
│  ├─ sitemap.ts | robots.ts | manifest.ts
│  └─ layout.tsx | page.tsx | error.tsx | not-found.tsx | loading.tsx
├─ components/
│  ├─ ui/                   # reusable primitives (button, card, slider, …)
│  ├─ layout/               # header, footer, theme toggle, page shell
│  ├─ studio/               # editor, voice panel, audio player, studio shell
│  ├─ dashboard/ history/ settings/ seo/
│  └─ providers.tsx         # theme + history + toaster context
├─ hooks/                   # speech synthesis, undo, local storage, shortcuts…
├─ lib/
│  ├─ tts/                  # provider contracts, adapters, registry
│  ├─ env.ts                # zod-validated environment
│  ├─ rate-limit.ts | text-stats.ts | utils.ts
├─ config/                  # site + provider configuration
└─ types/                   # shared domain types
prisma/                     # full SaaS schema + seed (optional)
e2e/                        # Playwright specs
```

### Data persistence

The running app stores history and preferences in the browser
(`localStorage`) so it works instantly and privately. For a multi-user SaaS
deployment, a complete PostgreSQL schema is provided in
[`prisma/schema.prisma`](prisma/schema.prisma) covering users, accounts,
sessions, generations, audio files, API keys, favorites, settings, usage logs,
analytics, notifications, subscriptions and invoices.

To enable the database layer:

```bash
npm install prisma @prisma/client
npm install -D tsx
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

Then swap the `HistoryProvider` (localStorage) for Prisma-backed API routes.

---

## Environment variables

See [`.env.example`](.env.example) for the full list. All server variables are
**optional** and validated at boot in `src/lib/env.ts`. Groups:

- **App** — `NEXT_PUBLIC_APP_URL`
- **TTS** — `OPENAI_API_KEY`, `ELEVENLABS_API_KEY` (+ model overrides)
- **Database** — `DATABASE_URL`
- **Auth** — `AUTH_SECRET`, OAuth client IDs/secrets
- **Storage** — Cloudinary / AWS S3
- **Billing** — Stripe keys

---

## Security

- Strict security headers + Content-Security-Policy (`next.config.ts`)
- Zod validation on every API request body and query
- Fixed-window rate limiting on the synthesis endpoint
- Secrets kept server-side; `poweredByHeader` disabled
- Filesystem-safe filename slugging for downloads

---

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. (Optional) add the environment variables you need from `.env.example`.
4. Deploy — no extra configuration required.

The default build produces a fully static studio plus two serverless route
handlers, so it deploys cleanly on Vercel's free tier.

---

## Scope note

This project ships a **complete, working core** (studio, browser + cloud TTS,
history, dashboard, settings, SEO, security, tests) that runs from the first
`npm run dev`. The broader SaaS surface described in the product brief —
authentication, Stripe billing, the admin console and multi-tenant persistence —
is represented by the production-grade Prisma schema and environment scaffolding
so it can be wired up incrementally without re-architecting.

---

## License

MIT
