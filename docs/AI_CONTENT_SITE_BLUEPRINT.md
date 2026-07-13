# Blueprint: An AI-Powered Viral Magazine (bigodino.it model)

A complete plan for building and operating a bigodino.it-style content site —
a multi-category lifestyle/viral magazine (animals, entertainment/gossip,
wellness, food, curiosities) — where **an AI pipeline produces the articles**
and a human spends ~30–60 minutes a day reviewing instead of writing.

This blueprint is grounded in the stack already present in this repository
(Next.js 16.2.10 App Router with Cache Components, TypeScript, Tailwind v4,
Prisma/PostgreSQL) and the Claude API for generation.

---

## Table of contents

1. [What bigodino.it actually is](#1-what-bigodinoit-actually-is)
2. [The honest part: what works in 2026 and what gets you buried](#2-the-honest-part)
3. [System architecture](#3-system-architecture)
4. [Tech stack](#4-tech-stack)
5. [Data model (Prisma)](#5-data-model-prisma)
6. [The content pipeline, stage by stage](#6-the-content-pipeline-stage-by-stage)
7. [The generation call (Claude API)](#7-the-generation-call-claude-api)
8. [Publishing layer (Next.js)](#8-publishing-layer-nextjs)
9. [Automation & scheduling](#9-automation--scheduling)
10. [SEO & distribution](#10-seo--distribution)
11. [Monetization](#11-monetization)
12. [Legal & quality guardrails](#12-legal--quality-guardrails)
13. [Costs](#13-costs)
14. [Phased roadmap](#14-phased-roadmap)
15. [Proposed file map](#15-proposed-file-map)
16. [Environment variables](#16-environment-variables)
17. [What NOT to do](#17-what-not-to-do)

---

## 1. What bigodino.it actually is

Before copying a model, understand it:

- **Format**: an Italian women's/lifestyle online magazine. Categories like
  *Animali* (pets), *Spettacolo* (celebrity/TV gossip), *Benessere*
  (wellness), *Cucina* (recipes), *Moda*, *Viaggi*, plus viral curiosities.
- **Article shape**: short (400–900 words), one strong image up top, emotional
  or curiosity-driven headline, listicle or story structure, very light on
  original reporting.
- **Volume**: several new posts per day, every day. Volume + freshness is the
  strategy.
- **Traffic sources**: Google Search + **Google Discover** (the mobile feed —
  the big one for this content type) + Facebook page sharing + Pinterest.
- **Monetization**: display ads (programmatic), occasionally affiliate links
  and sponsored posts.

The business is: *cheap content in → ad impressions out*. Your twist is
replacing the "content farm of freelance bloggers" with an AI pipeline plus
one human editor (you).

---

## 2. The honest part

Acting as your expert here — these are the constraints that decide whether
this project earns money or dies in six months:

1. **Google does not penalize AI content; it penalizes *unhelpful* content
   at scale.** Since the March 2024 core update, "scaled content abuse"
   (mass-producing pages primarily to rank, regardless of whether a human or
   AI wrote them) is a spam policy. Sites that auto-published thousands of
   thin AI pages were deindexed. Sites that use AI *with editorial control,
   original angles, and real usefulness* rank fine.
   → **Design consequence**: the pipeline below has a human review gate and a
   quality rubric. Do not remove them "to scale faster" — that is the exact
   failure mode.

2. **Google Discover is a slot machine.** It can send 50k visits in a day and
   zero the next week. Treat it as upside, and build baseline traffic with
   evergreen search content (recipes, pet-care how-tos, wellness explainers)
   that ranks steadily.

3. **You still work — the job changes.** "I don't want to write every day"
   is achievable. "Nobody looks at the site" is not. Budget 30–60 min/day:
   approve/reject drafts, fix headlines, pick images, and one deeper pass
   weekly on analytics.

4. **Never rewrite competitors' articles.** Ingesting another outlet's story
   and paraphrasing it is (a) copyright-risky, (b) exactly what Google's
   systems demote, (c) beatable by anyone doing the same thing cheaper. Use
   *sources* (press releases, studies, official announcements, trends data,
   evergreen topics) — not other people's finished articles.

5. **The moat is niche + trust, not the pipeline.** Anyone can generate
   articles. Pick 2–3 categories to dominate first (e.g. *Animali* +
   *Cucina* are evergreen, low-YMYL, high-affiliate). Add gossip later —
   it's high-volume but time-sensitive and legally touchier.

---

## 3. System architecture

```
                          ┌─────────────────────────────────────────────┐
                          │                SOURCES                      │
                          │ RSS/press releases · Google Trends (IT)     │
                          │ evergreen keyword lists · seasonal calendar │
                          └──────────────────┬──────────────────────────┘
                                             │  cron: ingest (hourly/daily)
                                             ▼
                          ┌─────────────────────────────────────────────┐
                          │        TOPIC QUEUE  (TopicIdea rows)        │
                          │  dedupe vs existing articles · score/rank   │
                          └──────────────────┬──────────────────────────┘
                                             │  cron: generate (daily batch)
                                             ▼
                ┌────────────────────────────────────────────────────────┐
                │              GENERATION (Claude API)                   │
                │  1. research pass (web search tool) → verified brief   │
                │  2. writing pass (structured output) → draft article   │
                │  3. self-check pass → quality score + flags            │
                └──────────────────┬─────────────────────────────────────┘
                                   ▼
                ┌────────────────────────────────────────────────────────┐
                │        EDITORIAL QUEUE  (/admin, status=DRAFT)         │
                │  human: approve / edit / reject · pick image · schedule│
                └──────────────────┬─────────────────────────────────────┘
                                   │  publish (immediate or scheduled slots)
                                   ▼
                ┌────────────────────────────────────────────────────────┐
                │            NEXT.JS SITE (this repo's stack)            │
                │  cached pages ('use cache' + cacheTag) · sitemap · RSS │
                │  JSON-LD · OG images · revalidateTag on publish        │
                └──────────────────┬─────────────────────────────────────┘
                                   ▼
                ┌────────────────────────────────────────────────────────┐
                │   DISTRIBUTION: Google (Search/Discover) · Facebook    │
                │   Pinterest · newsletter — auto-post on publish        │
                └──────────────────┬─────────────────────────────────────┘
                                   ▼
                ┌────────────────────────────────────────────────────────┐
                │  ANALYTICS FEEDBACK: GA4/Plausible + Search Console    │
                │  → what performs → weight future topic selection       │
                └────────────────────────────────────────────────────────┘
```

Everything above the site is a set of cron-triggered jobs plus one admin UI.
There is no always-on server or queue infrastructure needed at MVP scale.

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.2.10** (already in repo) | App Router, Cache Components (`'use cache'`, `cacheTag`, `revalidateTag`) make a mostly-static, cheap-to-serve magazine. ⚠️ This version has breaking changes vs older Next.js — read `node_modules/next/dist/docs/` before implementing (per `AGENTS.md`). |
| Database | **PostgreSQL + Prisma** (Prisma already in repo) | Articles, topics, jobs. Hosted free tier: Neon or Supabase. |
| AI | **Claude API** (`@anthropic-ai/sdk`) | Generation, research (server-side web search tool), structured outputs. Default model `claude-opus-4-8`; Batch API for 50% off overnight generation runs. |
| Images | Stock APIs (Pexels/Pixabay — free with attribution norms) + `next/og` for social cards | Cheap, licensed. AI-generated images optional later (label them). |
| Hosting | Vercel (or any Node host) | Vercel Cron triggers the pipeline; ISR/cache serving is nearly free. |
| Ads | AdSense → Ezoic → Mediavine/Raptive as traffic grows | See §11. |
| Analytics | GA4 (required by most ad networks) + Search Console | Feedback loop into topic selection. |

> **Coexistence note**: this repository currently contains the Vocalis TTS
> app. The magazine is a different product — either start it as a fresh
> project generated from this blueprint, or replace the app routes here. Do
> not try to serve both from one App Router tree.

---

## 5. Data model (Prisma)

Extend `prisma/schema.prisma` (the existing `User`/`Role` models are reusable
for the admin login):

```prisma
enum ArticleStatus {
  DRAFT        // generated, awaiting review
  APPROVED     // reviewed, waiting for its publish slot
  PUBLISHED
  REJECTED
  ARCHIVED
}

enum TopicStatus {
  PENDING
  QUEUED       // selected for next generation batch
  GENERATED
  DISCARDED    // duplicate / low score / off-brand
}

model Category {
  id       String    @id @default(cuid())
  slug     String    @unique          // "animali", "cucina", "benessere"
  name     String
  tagline  String?
  articles Article[]
  topics   TopicIdea[]
}

model TopicIdea {
  id          String      @id @default(cuid())
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  title       String                   // working title / angle
  sourceUrl   String?                  // press release, study, trend page
  sourceKind  String                   // "rss" | "trends" | "evergreen" | "manual"
  keywords    String[]                 // target queries
  score       Float       @default(0)  // ranking for batch selection
  status      TopicStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  article     Article?

  @@index([status, score])
}

model Article {
  id           String        @id @default(cuid())
  topicId      String?       @unique
  topic        TopicIdea?    @relation(fields: [topicId], references: [id])
  categoryId   String
  category     Category      @relation(fields: [categoryId], references: [id])
  slug         String        @unique
  title        String
  excerpt      String                        // 1–2 sentence dek, used in cards + meta
  bodyMd       String                        // article body, Markdown
  heroImageUrl String?
  heroImageAlt String?
  heroImageCredit String?                    // "Foto: Pexels/Name" — keep attribution
  tags         String[]
  seoTitle     String
  seoDescription String
  status       ArticleStatus @default(DRAFT)
  qualityScore Float?                        // from the self-check pass
  qualityFlags String[]                      // e.g. ["unverified-claim:…"]
  aiModel      String?                       // provenance: model used
  sourceUrls   String[]                      // everything the research pass cited
  reviewedById String?
  publishedAt  DateTime?
  scheduledFor DateTime?                     // publish-slot scheduling
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([status, scheduledFor])
  @@index([categoryId, publishedAt])
}

model GenerationJob {
  id         String   @id @default(cuid())
  kind       String                     // "ingest" | "generate" | "publish"
  status     String                     // "running" | "ok" | "error"
  detail     String?                    // error text / counts
  costUsd    Float?                     // token spend, from usage fields
  startedAt  DateTime @default(now())
  finishedAt DateTime?
}
```

Design points:

- **`TopicIdea` is separate from `Article`** so deduplication, scoring and
  batch selection happen *before* you spend tokens.
- **Provenance fields** (`aiModel`, `sourceUrls`, `qualityFlags`) make the
  pipeline auditable — you'll want this for the legal posture in §12.
- **`scheduledFor`** lets one nightly batch feed a natural-looking publishing
  cadence (e.g. 08:00 / 12:30 / 17:00) instead of a robotic burst.

---

## 6. The content pipeline, stage by stage

### Stage 1 — Ingest (cron, hourly or daily)

Populate `TopicIdea` from three source types:

1. **Evergreen keyword lists** (your backbone, start here): hand-curate
   100–300 topics per category once — "perché il gatto impasta con le zampe",
   "ricetta tiramisù senza uova", seasonal food, dog breeds, houseplants.
   Cheap, zero legal risk, ranks for years. Store with `sourceKind:
   "evergreen"`.
2. **RSS / official sources**: press releases (ANSA topic feeds, ministry
   feeds for recalls/health advisories only if you go there), TV network
   press rooms for *Spettacolo*, pet-brand studies. The rule: **a source is
   raw material, never a finished article to rewrite.**
3. **Google Trends (Italy)**: daily trending searches filtered by your
   categories → time-sensitive topics with `score` boosted.

Dedup on insert: reject a `TopicIdea` whose title is near-duplicate of an
existing article or pending idea (start with normalized-trigram similarity in
Postgres — `pg_trgm` — before reaching for embeddings).

### Stage 2 — Select & brief (part of the generate cron)

Pick top-N `PENDING` ideas by `score` (mix: ~70% evergreen, ~30% trending).
For each, build a **brief**: category, angle, target keywords, target length,
tone, and the source URL(s) if any.

### Stage 3 — Generate (Claude, two or three calls per article)

1. **Research pass** (only for topics with a factual core): a call with the
   server-side web search tool that returns a *verified fact sheet* — claims
   with source URLs. Skip for pure-evergreen soft topics you trust the model
   on; never skip for anything health-, money- or person-related.
2. **Writing pass**: structured output → the full article object (title,
   slug, excerpt, body markdown, tags, SEO fields, image search queries).
   Grounded on the fact sheet: instruct it to use *only* facts from the brief
   and mark anything else as `[da verificare]`.
3. **Self-check pass** (cheap, same model, short output): score the draft
   against your rubric (originality of angle, factuality flags, headline
   quality, no clickbait-that-underdelivers) → `qualityScore` +
   `qualityFlags`. Drafts under threshold get auto-rejected before a human
   ever sees them.

### Stage 4 — Images

- Query Pexels/Pixabay with the image queries from the writing pass; store
  top candidates; editor picks in review UI (or auto-pick #1).
- Keep `heroImageCredit`. Serve via `next/image` with proper `sizes`.
- Minimum 1200px wide — required for Google Discover's large image treatment.

### Stage 5 — Human review (the gate that keeps you alive)

`/admin` queue showing drafts with quality score, flags, source list, image
candidates. Actions: **approve (+slot)** / **edit** / **reject with reason**.
Rejection reasons feed back into the prompt (append recurring failures to the
system prompt's "avoid" list).

Start at 100% review. After a few hundred articles you'll know which
category × sourceKind combos are reliably clean; you can then auto-approve
high-scoring evergreen drafts and keep reviewing the rest. **Never
auto-approve YMYL (health/money) or named-person content.**

### Stage 6 — Publish

A cron flips `APPROVED` → `PUBLISHED` when `scheduledFor` arrives, then
calls `revalidateTag('articles')` (+ the category tag) so the cached pages
regenerate, pings the sitemap, and fires distribution hooks (Facebook page
post, Pinterest pin, newsletter digest queue).

### Stage 7 — Feedback loop (weekly)

Pull Search Console + analytics: which categories/angles get impressions,
CTR, Discover traffic. Adjust topic scoring weights. Prune or improve pages
with impressions-but-no-clicks (headline problem) and zero-impression pages
older than 90 days (consolidate or delete — thin dead pages drag the site).

---

## 7. The generation call (Claude API)

Concrete TypeScript for the writing pass, matching this repo's stack
(`npm i @anthropic-ai/sdk zod`):

```ts
// src/lib/ai/generate-article.ts
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const ArticleDraft = z.object({
  title: z.string(),            // ≤ 70 chars, curiosity without clickbait
  slug: z.string(),
  excerpt: z.string(),          // 1–2 sentences
  bodyMd: z.string(),           // 500–900 words, markdown, H2 sections
  tags: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),   // ≤ 155 chars
  imageQueries: z.array(z.string()), // stock-photo search terms
  claimsNeedingVerification: z.array(z.string()),
});

const SYSTEM = `Sei un editor senior di un magazine italiano di lifestyle
(stile: caldo, curioso, mai sensazionalista). Scrivi in italiano corretto.
Regole non negoziabili:
- Usa SOLO i fatti presenti nel brief; non inventare citazioni, numeri o studi.
- Niente consigli medici/finanziari prescrittivi; per la salute, rimanda al veterinario/medico.
- Titolo: incuriosisce E mantiene la promessa nel testo.
- Struttura: attacco breve, 2–4 sezioni H2, chiusura utile (consiglio pratico o curiosità).
- Elenca in claimsNeedingVerification qualunque affermazione di cui non sei certo.`;

export async function generateArticle(brief: string) {
  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content: brief }],
    output_config: { format: zodOutputFormat(ArticleDraft) },
  });
  return {
    draft: response.parsed_output, // null if parsing failed — guard upstream
    usage: response.usage,         // persist token counts → GenerationJob.costUsd
  };
}
```

Notes that will save you debugging time:

- **Model**: `claude-opus-4-8` ($5 / $25 per million input/output tokens).
  It does not accept `temperature`/`top_p` — steer style via the system
  prompt. If you later want cheaper bulk generation, benchmark a smaller
  model on *your* rubric before switching; don't assume.
- **Research pass**: separate call with the `web_search_20260209` server
  tool (searches run on Anthropic's side, results come back with citations).
  Keep research and writing as two calls — the writing pass stays a clean
  structured-output request, and you get an auditable fact sheet in between.
- **Batch API**: for the nightly bulk run, submit all writing passes as one
  batch (`client.messages.batches.create`) — 50% price cut, results well
  within an overnight window. Key results by `custom_id` (they return in any
  order).
- **Prompt caching**: put the (long, stable) system prompt + style guide
  behind a `cache_control` breakpoint; per-article briefs go after it.
- **Track spend**: every response's `usage` gives exact token counts; write
  them to `GenerationJob`.

---

## 8. Publishing layer (Next.js)

This repo's Next.js (16.2.10) uses **Cache Components**. The magazine wants
almost everything cached until content changes:

```ts
// src/lib/db/articles.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getPublishedArticles(category?: string) {
  "use cache";
  cacheTag("articles", ...(category ? [`category:${category}`] : []));
  cacheLife("hours");
  return prisma.article.findMany({ where: { status: "PUBLISHED", /* … */ } });
}
```

```ts
// called from the publish cron / admin approve action
import { revalidateTag } from "next/cache";
revalidateTag("articles");
revalidateTag(`category:${article.category.slug}`);
```

Routes (see full map in §15): homepage, `/[category]`, `/[category]/[slug]`,
tag pages, `sitemap.ts`, `robots.ts`, RSS route. Per-article pages emit:

- `generateMetadata` → title/description/canonical/OG/Twitter,
  `robots: { "max-image-preview": "large" }` (Discover requirement),
- **JSON-LD `Article`** schema (`datePublished`, `dateModified`, `image`,
  `author` = your *publication*, not a fake persona — see §12),
- OG image via `next/og` (hero image + title overlay).

⚠️ Before implementing any of this, read the bundled guides —
`node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
and `…/15-route-handlers.md` — this Next.js version's conventions differ
from what most tutorials (and most AI assistants) assume.

---

## 9. Automation & scheduling

Three cron-triggered route handlers, each protected by a shared secret:

```ts
// src/app/api/cron/generate/route.ts
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // select topics → generate drafts → save with status=DRAFT
  return Response.json({ ok: true });
}
```

| Job | Schedule | Does |
|---|---|---|
| `/api/cron/ingest` | hourly | RSS + Trends → `TopicIdea` rows, dedup, score |
| `/api/cron/generate` | nightly (e.g. 02:00) | batch-generate N drafts (start N=5–10/day) |
| `/api/cron/publish` | every 15 min | flip due `APPROVED` → `PUBLISHED`, revalidate, distribute |

Trigger with Vercel Cron (`vercel.json` crons), or GitHub Actions
`schedule` + `curl` if you host elsewhere. Long generation runs that might
exceed serverless time limits: switch the generate job to *enqueue* a Batch
API job and have a second cron *collect* finished results — both calls are
then fast.

Your daily loop as the operator: open `/admin`, review the overnight drafts
(approve/fix/reject), assign publish slots. That's the "not writing every
day" promise kept — you're editing, not authoring.

---

## 10. SEO & distribution

- **Sitemap** (`sitemap.ts`) regenerated on publish; submit once in Search
  Console.
- **Google Discover optimization** (this content type lives or dies here):
  large hero images (≥1200px), `max-image-preview:large`, emotional-but-
  honest headlines, clear publish dates, an entity-focused site (few
  categories, consistently).
- **Internal linking**: every article links 2–4 older related articles
  (compute related-by-tags at publish time). This is your cheapest ranking
  lever.
- **RSS feed** at `/feed.xml` — needed for newsletter tooling and some
  syndication.
- **Facebook page** (bigodino's original growth channel): auto-post on
  publish via the Graph API; pets + food content still shares well in IT
  Facebook groups.
- **Pinterest**: auto-pin recipe/animal articles (long-lived referral
  traffic, near-zero effort once wired).
- **Newsletter** (later, month 3+): weekly digest of top posts — the only
  traffic channel you own outright.

---

## 11. Monetization

Phased, by traffic (monthly sessions):

| Stage | Network | Requirement | Expectation |
|---|---|---|---|
| 0 → 10k | **AdSense** | site approval | Low RPM; it's about proving the pipeline |
| 10k → 50k | **Ezoic** (or Mediavine *Journey*) | ~no minimum / 10k sessions | Programmatic header bidding, better RPM |
| 50k+ | **Mediavine** | 50k sessions | The real money tier for lifestyle content |
| 100k+ | **Raptive** | 100k pageviews | Alternative to Mediavine |

Reality check for the Italian market: display RPMs for lifestyle content are
roughly **€1–7 per 1000 pageviews** depending on niche and season (verify
against your own data — treat this as an order of magnitude, not a promise).
100k pageviews/month ≈ €100–700/month from display alone. This is why:

- **Affiliate is the multiplier**: Amazon.it links in pet-product roundups,
  kitchen tools inside recipes ("la pentola che uso") convert far better per
  visitor than display. Bake an affiliate-block component into the article
  template from day one.
- **Volume compounds**: 10 articles/week × a year = ~500 indexed pages; the
  evergreen ones keep earning.

Requirement for ads in the EU: a **Google-certified TCF consent management
platform** (CMP) — AdSense/ad networks require it for EEA traffic. Use a
certified CMP (e.g. Cookiebot, iubenda — iubenda is Italian and popular for
IT sites) rather than hand-rolling the banner.

---

## 12. Legal & quality guardrails

Non-negotiables for an AI-content site aimed at Italy/EU in 2026:

1. **Transparency**: the EU AI Act (and Italy's national AI law) impose
   disclosure duties around AI-generated content published to inform the
   public; the exemption path runs through **human editorial review and
   responsibility**. Your posture: (a) keep the human review gate, (b) add a
   site-level note — e.g. a *"Come scriviamo"* page stating articles are
   drafted with AI assistance and reviewed by an editor, (c) keep provenance
   fields per article. That is both the safe reading and good E-E-A-T.
2. **No fake authors.** Do not invent human personas with stock-photo
   headshots — it's the pattern every AI-content-farm exposé leads with.
   Byline as the publication or as your real editor identity.
3. **Copyright**: facts aren't copyrightable; *expression* is. Generate from
   facts/briefs, never from a competitor's article text. Images only from
   licensed sources (stock APIs) with credit stored and displayed.
4. **YMYL care**: wellness content must stay in "curiosity/lifestyle" lane —
   no diagnoses, dosages, or financial advice. The system prompt enforces
   it; the reviewer double-checks it; those categories never auto-approve.
5. **Named people (gossip)**: highest defamation risk. Only report what the
   person themselves published or a primary source (network press release)
   says, with the source linked. If you're not ready to check that
   consistently, delay the *Spettacolo* category.
6. **GDPR**: certified CMP (§11), privacy policy, cookie policy. iubenda
   generates all three for Italian sites cheaply.

---

## 13. Costs

Monthly, at a 10-articles/day cadence (~300/month):

| Item | Cost |
|---|---|
| Generation (writing pass, `claude-opus-4-8`, ~3k in / ~2.5k out per article) | ~$0.08/article → ~$24; **~$12 via Batch API** |
| Research pass (only ~half of articles, web search tool + larger input) | ~$10–25 |
| Self-check pass (short outputs) | ~$3–5 |
| Hosting (Vercel Hobby→Pro) | $0–20 |
| Postgres (Neon/Supabase free tier at this scale) | $0 |
| Images (Pexels/Pixabay APIs) | $0 |
| Domain | ~$1 |
| CMP (iubenda tier) | ~$5–10 |
| **Total** | **≈ $30–90/month** |

The pipeline is not the expensive part. The expensive part is the 6–12
months of consistent publishing before traffic compounds. Budget patience.

---

## 14. Phased roadmap

**Phase 0 — Decisions (weekend)**
Pick niche (recommend: *Animali* + *Cucina* first), domain, name. Write the
one-page editorial charter (tone, what you never publish) — it becomes the
system prompt.

**Phase 1 — MVP site + manual pipeline (week 1–2)**
- Prisma schema (§5), seed categories.
- Public routes: home, category, article, sitemap, robots, RSS, JSON-LD.
- `generateArticle()` (§7) runnable from a script; you review output in the
  DB/admin and publish manually.
- Ship with 15–20 approved articles *before* announcing the domain to
  crawlers — an empty magazine indexes badly.

**Phase 2 — Automation (week 3–4)**
- `/admin` review queue with approve/edit/reject + image picker.
- Cron routes (§9): ingest, nightly generate (start 5/day), publish slots.
- Search Console + analytics wired. AdSense application once ~30 articles
  are live.

**Phase 3 — Distribution & feedback (month 2–3)**
- Facebook page + auto-post, Pinterest for recipes/pets.
- Weekly feedback job: Search Console data → topic scores.
- Raise cadence toward 10/day only if review quality holds.

**Phase 4 — Scale & revenue (month 4+)**
- Ezoic/Journey when eligible; affiliate blocks in top pages.
- Selective auto-approve for proven evergreen segments.
- Consider a second language/market only after the first one earns.

---

## 15. Proposed file map

```
src/
  app/
    (site)/
      layout.tsx                     # magazine chrome: header, nav, footer
      page.tsx                       # homepage: hero + category strips
      [category]/page.tsx            # paginated category listing
      [category]/[slug]/page.tsx     # article page (+ generateMetadata, JSON-LD)
      tag/[tag]/page.tsx
      chi-siamo/page.tsx             # about + "come scriviamo" AI disclosure
    admin/
      layout.tsx                     # auth-gated (reuse existing User/Role)
      page.tsx                       # review queue (DRAFT list, scores, flags)
      articles/[id]/page.tsx         # edit / approve / schedule / pick image
      topics/page.tsx                # topic queue management
    api/
      cron/
        ingest/route.ts
        generate/route.ts
        publish/route.ts
      og/[slug]/route.tsx            # next/og social card
    sitemap.ts
    robots.ts
    feed.xml/route.ts
  lib/
    ai/
      client.ts                      # Anthropic client singleton
      prompts.ts                     # system prompt / editorial charter
      research.ts                    # web-search fact-sheet pass
      generate-article.ts            # structured writing pass (§7)
      quality-check.ts               # rubric scoring pass
    sources/
      rss.ts                         # feed ingestion
      trends.ts                      # Google Trends (IT) ingestion
      evergreen.ts                   # curated keyword seeding
      dedupe.ts
    images/
      stock.ts                       # Pexels/Pixabay search
    db.ts                            # Prisma client
    articles.ts                      # cached queries ('use cache' + cacheTag)
prisma/
  schema.prisma                      # §5 models added
vercel.json                          # cron schedules
```

---

## 16. Environment variables

```bash
DATABASE_URL=            # Postgres (Neon/Supabase)
ANTHROPIC_API_KEY=       # console.anthropic.com
CRON_SECRET=             # random string; checked by /api/cron/*
PEXELS_API_KEY=          # free at pexels.com/api
NEXT_PUBLIC_SITE_URL=    # https://yourdomain.it
FACEBOOK_PAGE_TOKEN=     # phase 3, auto-posting
GA_MEASUREMENT_ID=       # analytics
```

---

## 17. What NOT to do

A closing checklist of the failure modes that kill sites like this:

- ❌ **Mass-publish without review** — the "scaled content abuse" profile;
  Google's manual actions on this are site-wide.
- ❌ **Rewrite other outlets' articles** — legal + quality + demotion risk.
- ❌ **Launch 8 categories at once** — thin coverage everywhere, authority
  nowhere. Two categories, deep.
- ❌ **Fake human authors** with generated headshots and invented bios.
- ❌ **Publish 1,000 articles in week one** — unnatural velocity on a fresh
  domain is a spam signal; ramp gradually.
- ❌ **Unreviewed health/money/named-person content** — the categories where
  one bad article costs more than a year of ad revenue.
- ❌ **Skip the CMP** and paste raw AdSense into EU traffic.
- ❌ **Judge the project at month 2** — organic compounding is slow;
  commit to two quarters of consistent cadence before verdicts.

---

*Blueprint v1 — generated for this repository's stack (Next.js 16.2.10,
Prisma, Tailwind v4, TypeScript). Before writing code, read the bundled
framework docs in `node_modules/next/dist/docs/` as required by `AGENTS.md`.*
