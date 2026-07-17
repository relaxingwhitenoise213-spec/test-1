# Build a DealSlide-Style Affiliate Deal Marketplace with Lovable

A complete, copy-paste guide to building an aggregator of online businesses for sale
(SaaS apps, YouTube channels, content sites, e-commerce stores) sourced from Flippa,
Empire Flippers, Motion Invest and others — monetized with affiliate/referral links —
using [Lovable](https://lovable.dev).

---

## 1. What you're building (and how it makes money)

[DealSlide.com](https://dealslide.com) is an **aggregator**: it consolidates ~45,000+
listings of online businesses for sale from 20+ brokers and marketplaces into one
searchable site. Users filter by monetization, source, price, niche and profit, save
listings to a watchlist, and get daily/weekly email alerts. DealSlide doesn't sell the
businesses itself — when a user clicks through to Flippa or a broker and transacts,
the referral programs pay out.

Your clone does the same thing:

```
Visitor → your site (browse/filter/watchlist) → clicks "View Deal"
       → lands on Flippa/Empire Flippers via YOUR referral link
       → they buy or sell a business → you get a % of the marketplace's fee
```

**Why this model is attractive:**

- You never touch the transaction, escrow, or due diligence.
- Referral payouts on business sales are large (see table below).
- The email list you build (alerts + newsletter) is a compounding asset.
- Curation is the product — you don't need all 45k listings, you need the 200 *good* ones.

**Reality check:** deals close slowly (weeks–months), and cookies/attribution windows
matter. Treat this as an SEO + newsletter business with high-ticket affiliate payouts,
not a quick-flip site.

---

## 2. Affiliate / referral programs to join (do this first)

Sign up **before** you build, because approval can take days and your links go into the
database from day one.

| Marketplace | Program | Payout | Notes |
|---|---|---|---|
| **Flippa** | [Flippa Referral Program](https://flippa.com/referral-program/) (via PartnerStack) | **20% of Flippa's revenue** from the referred user's first eligible transaction (buy, sell, or list) within **12 months** | Free to join, $5 minimum payout, monthly reconciliation. Flippa lists SaaS, YouTube channels, apps, e-com, content sites — your core inventory. |
| **Empire Flippers** | [EF Referral Program](https://empireflippers.com/referral-program/) | **20% of EF's commission** on a closed deal, **2-year cookie** | Application required. Average listing ~$1.2M; EF's example: a $1.2M deal ≈ **$29,000** to you. They also offer a [valuation-tool API for partners](https://empireflippers.com/referral-partner-valuation-tool-api/) — great lead magnet. |
| **Motion Invest** | Affiliate program (apply on their site) | % of deal fees | Smaller content sites, faster closes — good "starter deal" inventory. |
| **Acquire.com** | Partner/creator program — check their partners page or email them | varies | Strong SaaS inventory; startup listings under NDA can't be republished, so link to their search pages instead. |
| **FameSwap / similar** | Check current terms | varies | Extra source for YouTube channel & social account listings. |
| **Escrow.com** (secondary) | Affiliate program | % of escrow fees | Natural companion content: "how to buy safely." |
| **Beehiiv** (secondary) | Partner program | recurring % | If you run your deal newsletter on it, the "powered by" loop pays too. |

> ⚠️ **FTC compliance:** you must clearly disclose affiliate relationships. The guide's
> build prompts include a site-wide disclosure component and an `/affiliate-disclosure`
> page. Don't skip it — programs can (and do) ban non-compliant partners.
>
> ⚠️ **Branding:** don't name your site anything confusingly similar to "DealSlide,"
> "Flippa," etc. This guide uses the placeholder **DealScout** — replace it everywhere
> with your own name.

### How your affiliate link physically gets into the site (read this!)

You do **not** paste your affiliate link into every listing or button. The site stores
**one tracked link per marketplace** and routes every click through it:

```
"View deal →" button  →  /go/listing-slug (your site)
                          1. logs a click row (your analytics)
                          2. looks up the listing's marketplace
                          3. redirects through YOUR tracked link for that marketplace
                       →  visitor lands on Flippa/EF, attribution cookie is set
                       →  visitor transacts within the window → you get paid
```

Step by step:

1. **Get the link.** After approval, each program's dashboard shows your unique
   tracked URL (Flippa: in your PartnerStack dashboard; Empire Flippers: in your
   partner account). The exact format varies — copy it exactly as given.
2. **Paste it once.** In your finished app: **Admin → Sources tab → `affiliate_base_url`
   field** for that marketplace (the field is created in Step 2, the admin UI in
   Step 7). Until the admin panel exists, you can set it directly in Lovable's
   Cloud → Database panel on the `sources` rows.
3. **Every button earns automatically.** All "View deal" CTAs point to `/go/:slug`
   (built in Step 4), which redirects through the stored link. Change the link once in
   admin → every button on the site updates.
4. **Cookies do the earning.** The marketplace sets an attribution cookie when the
   visitor arrives through your link. Flippa credits 20% of its revenue on that user's
   first eligible transaction within 12 months; EF credits 20% of its commission for
   2 years. Because it's cookie-based, you're paid even if the visitor ends up buying a
   **different** business than the one they clicked.

**Deep links vs. homepage links — the one wrinkle:**

- *Best case:* your program supports **deep linking** (PartnerStack often has a link
  builder / custom links that can target any page on flippa.com). Then `/go/` can send
  the visitor to the exact listing page, fully tracked. Step 4b below adds an
  `affiliate_link_template` with a `{url}` placeholder for exactly this.
- *Fallback:* if only a fixed universal link is available, `/go/` sends visitors
  through it and they land on the marketplace's homepage/search. Slightly worse UX,
  but the cookie — the thing that pays you — is still set. Attribution beats landing
  precision.

---

## 3. Prerequisites checklist

- [ ] Lovable account on a **paid plan** (needed for custom domain; ~$25/mo tier is enough).
- [ ] Domain name purchased (~$12/yr) — you can buy/connect it inside Lovable.
- [ ] Flippa referral link (PartnerStack dashboard) — note whether your program allows
      **deep links** (appending a destination URL). If not, your buttons land on Flippa's
      homepage/search with your tracking — still credited.
- [ ] Empire Flippers referral partner application submitted.
- [ ] A free [Resend](https://resend.com) account (email alerts) — you'll add its API key
      to Lovable as a secret in Step 6.
- [ ] 20–30 seed listings collected by hand (title, price, revenue, profit, niche,
      source URL). Spend an hour browsing Flippa's SaaS + YouTube categories and EF's
      marketplace. You'll paste these in Step 2 or import via CSV in Step 7.

---

## 4. Architecture overview (what Lovable will generate)

Lovable builds a React + Tailwind frontend with **Lovable Cloud** as the backend
(managed Supabase under the hood: Postgres, auth, storage, edge functions, secrets,
scheduled jobs). You never leave the Lovable editor.

**Pages**

| Route | Purpose |
|---|---|
| `/` | Landing: hero + search, stats bar, featured deals, categories, email capture |
| `/browse` | All listings with full filter sidebar + sort + pagination |
| `/saas-for-sale`, `/youtube-channels-for-sale`, `/content-sites-for-sale`, `/ecommerce-for-sale` | SEO category landing pages (pre-filtered browse) |
| `/listing/:slug` | Listing detail + "View Deal" affiliate CTA |
| `/go/:slug` | Redirect route: logs the click, forwards to the affiliate URL |
| `/watchlist` | Logged-in user's saved deals |
| `/alerts` | Saved searches + email frequency |
| `/admin` | Role-protected: CRUD listings, CSV import, click analytics |
| `/about`, `/faq`, `/affiliate-disclosure`, `/privacy`, `/terms` | Trust & legal |

**Database tables**

- `listings` — the core: title, slug, description, category, niche, source, urls,
  asking_price, monthly_revenue, monthly_profit, multiples, age, status, badges.
- `sources` — flippa, empire_flippers, motion_invest… + your affiliate base link per source.
- `price_history` — enables "Price Drop" badges and watchlist change alerts.
- `watchlist_items` — user ↔ listing.
- `saved_searches` — filter JSON + frequency (daily/weekly) per user.
- `clicks` — one row per outbound affiliate click (your conversion analytics).
- `profiles` + `user_roles` — auth and admin gating.

---

## 5. The build — copy-paste prompts, in order

Rules that will save you credits and pain:

1. **One step per prompt.** Don't merge steps. Let each finish, click through the app,
   then continue.
2. Use **Build mode** (the default agent) for these prompts. Use **Chat mode** when you
   want to discuss/diagnose without changing code.
3. If something breaks: press "Try to Fix" **once**; if it persists, switch to Chat mode,
   paste the error, ask for a diagnosis, then apply the fix in Build mode. Use version
   history to revert bad steps — it's free.
4. After Step 2, ask Lovable to run its **security scan** whenever you touch tables or
   policies.

---

### Step 0 — Knowledge file (Settings → Knowledge)

Paste this into the project's Knowledge so every future prompt inherits it:

```text
PROJECT: DealScout — an aggregator of online businesses for sale (SaaS apps, YouTube
channels, content/blog sites, e-commerce stores, mobile apps, newsletters). We list
deals from marketplaces like Flippa, Empire Flippers, Motion Invest and Acquire.com and
send visitors to those marketplaces through our affiliate/referral links. We never
handle transactions ourselves.

BUSINESS RULES
- Every outbound listing link must go through our internal /go/:slug redirect so the
  click is logged before forwarding to the affiliate URL.
- Every page that contains affiliate links shows a short disclosure line:
  "DealScout is reader-supported. We may earn a commission when you visit a marketplace
  through our links — at no cost to you."
- Listings are curated by admins only; regular users can browse, save to watchlist,
  and create email alerts. There is no user-generated listing submission (yet).
- Prices are USD. Key metrics per listing: asking price, monthly revenue, monthly
  profit, profit multiple (asking price ÷ (monthly profit × 12)), business age.

DESIGN SYSTEM
- Feel: modern fintech/marketplace — think a cross between a stock screener and a
  premium deals site. Clean, data-dense but calm, generous whitespace.
- Light theme default with dark mode toggle. Primary: deep indigo (#4F46E5).
  Accent for deal metrics/success: emerald (#10B981). Warnings/price-drops: amber.
- Typography: Inter. Numbers in tabular figures. Cards with soft shadows, 12px radius.
- Every listing card and page must look complete with placeholder/seed data.

CONVENTIONS
- Mobile-first responsive. Loading skeletons on all data fetches. Friendly empty states.
- SEO matters: semantic HTML, one h1 per page, descriptive titles/meta per route.
- Keep components small and reusable: ListingCard, MetricBadge, SourceBadge,
  FilterSidebar, DisclosureBar are shared across pages.
```

### Step 1 — Foundation + landing page

```text
Create the foundation for DealScout, an aggregator of online businesses for sale.

Build ONLY the landing page and app shell for now (no backend yet):

1. Sticky top nav: logo "DealScout", links: Browse Deals, SaaS, YouTube Channels,
   Content Sites, E-commerce, and a "Sign in" button placeholder. Dark-mode toggle.
2. Hero: headline "Every online business for sale. One place." Subheadline about
   tracking SaaS, YouTube channels, content sites and e-commerce stores from the top
   marketplaces. A large search input (non-functional for now) and two CTA buttons:
   "Browse all deals" and "Get deal alerts".
3. Stats bar: "1,200+ live listings · 6 marketplaces tracked · updated daily"
   (static numbers for now).
4. "Featured deals" section: 6 hardcoded example listing cards. Each ListingCard shows:
   thumbnail placeholder, category icon + label (SaaS / YouTube / Content / E-com),
   title, one-line description, asking price (large, bold), monthly profit, profit
   multiple, business age, a SourceBadge (e.g. "Flippa", "Empire Flippers"), and a
   "View deal →" button. Include one card with a "Price drop" amber badge and one
   with a "New" badge.
5. "Browse by category" grid: SaaS, YouTube Channels, Content Sites, E-commerce,
   Mobile Apps, Newsletters — each with an icon and listing count placeholder.
6. "How it works" 3-step strip: We track the marketplaces → You filter & watchlist →
   Buy on the marketplace (we may earn a referral commission — include the disclosure
   line here).
7. Email capture band: "The best deals in your inbox, weekly." Input + button
   (non-functional for now).
8. Footer: About, FAQ, Affiliate Disclosure, Privacy, Terms, plus a small disclosure
   paragraph.

Add a thin DisclosureBar component ("DealScout is reader-supported…") that we can
reuse on listing pages. Make the whole page fully responsive.
```

**Check:** landing page renders, cards look dense-but-clean, dark mode works.

### Step 2 — Backend: schema + seed data

```text
Enable Lovable Cloud and set up the database for listings.

Tables:
1. sources: id, name, slug, website_url, affiliate_base_url (nullable), logo_url
   (nullable), created_at. Seed with: Flippa, Empire Flippers, Motion Invest,
   Acquire.com (affiliate_base_url can be a placeholder like https://flippa.com for now
   — I will update real referral links later from the admin panel).
2. listings: id, slug (unique), title, description, category (enum: saas, youtube,
   content, ecommerce, app, newsletter, other), niche (text, e.g. "AI tools", "fitness"),
   source_id (fk → sources), source_listing_url, asking_price (integer, USD),
   monthly_revenue (integer, nullable), monthly_profit (integer, nullable),
   profit_multiple (numeric, nullable), age_years (numeric, nullable),
   monetization (text, e.g. "subscriptions", "adsense", "affiliate", "sponsorships"),
   thumbnail_url (nullable), status (enum: active, sold, back_on_market, default active),
   is_featured (boolean default false), verified_revenue (boolean default false),
   created_at, updated_at.
3. price_history: id, listing_id (fk), price, recorded_at. Insert a row automatically
   (trigger) whenever a listing's asking_price changes.
4. clicks: id, listing_id (fk), clicked_at, referrer (text nullable),
   user_agent (text nullable).

Security: listings, sources and price_history are publicly readable. Only admins can
write them (we'll add roles in Step 5 — for now lock writes down entirely). clicks is
insert-only from the app, readable by no one publicly.

Seed 24 realistic sample listings spread across all categories and sources — e.g. an
AI writing SaaS ($84,000, $2,100/mo profit, 3.3x), a tech review YouTube channel
(420k subs, $65,000), a woodworking blog ($38,000), a pet supplies Shopify store
($120,000) — with varied prices from $8k to $900k, a few featured, one back_on_market,
one with a price drop in price_history.

Then replace the hardcoded featured cards on the landing page with the 6 featured
listings from the database, with loading skeletons and an error state.
```

**Check:** open Cloud → Database in Lovable and confirm tables + 24 rows; landing page now loads real data.

### Step 3 — Browse page with filters

```text
Build the /browse page: a filterable, sortable directory of all listings.

Layout: left FilterSidebar (collapsible drawer on mobile), right results grid of
ListingCards (3 cols desktop / 2 tablet / 1 mobile) with count ("214 deals") on top.

Filters (all combinable, reflected in URL query params so filtered views are shareable):
- Category (multi-select chips: SaaS, YouTube, Content, E-commerce, Apps, Newsletters)
- Source (multi-select: Flippa, Empire Flippers, Motion Invest, Acquire.com)
- Asking price (min/max inputs + quick ranges: <$10k, $10–50k, $50–250k, $250k+)
- Monthly profit (min input)
- Profit multiple (max input)
- Monetization (multi-select)
- Business age (min years)
- Status toggle: include sold / back-on-market
- Verified revenue only (switch)

Sort dropdown: Newest, Price low→high, Price high→low, Profit multiple low→high,
Monthly profit high→low. Pagination: 24 per page with a "Load more" button.

Top of page: keyword search input (searches title, description, niche) — wire the
landing-page hero search to navigate here with the query.

Also add category landing routes /saas-for-sale, /youtube-channels-for-sale,
/content-sites-for-sale, /ecommerce-for-sale that reuse the browse page pre-filtered,
each with its own h1, intro paragraph (2–3 sentences, SEO-friendly) and page title.

Add "New" badge for listings created in the last 7 days and "Price drop" badge when the
latest price_history entry is lower than a previous one. Empty state when no results:
friendly message + "Clear filters" button.
```

**Check:** combine 3+ filters, refresh the page (URL should preserve state), test mobile drawer.

### Step 4 — Listing detail + affiliate redirect + click tracking

```text
1. Build /listing/:slug — the listing detail page:
   - Breadcrumb (Browse → Category → Title). Title, SourceBadge, status badge,
     category, niche tags.
   - Metrics panel: asking price (hero number), monthly revenue, monthly profit,
     profit multiple, business age, monetization, verified-revenue indicator.
   - Description section, and a small price-history line chart if the listing has more
     than one price_history row.
   - Primary CTA (sticky on mobile): "View deal on {source name} →" pointing to
     /go/{slug}. Secondary: "Save to watchlist" (placeholder until Step 5).
   - The DisclosureBar under the CTA.
   - "Similar deals" strip: 4 listings from the same category.
   - SEO: title "{title} — {category} for sale | DealScout", meta description from the
     listing description.

2. Create the /go/:slug redirect: a route that (a) inserts a row into clicks with the
   listing id, referrer and user agent, then (b) immediately forwards the visitor to
   the listing's outbound URL. Outbound URL logic: if the listing's source has an
   affiliate_base_url, send the visitor there; otherwise fall back to the listing's
   source_listing_url. Never let a logging failure block the redirect — redirect
   first-class, log best-effort.

3. Every "View deal" button anywhere in the app must use /go/{slug} — update the
   ListingCard accordingly, opening in a new tab.
```

**Check:** click a deal card → you land on the marketplace; Cloud → Database → clicks has a new row.

### Step 4b — Wire in your real affiliate links (deep-link support)

Once you have your tracked links from PartnerStack / Empire Flippers (see
"How your affiliate link physically gets into the site" in section 2), run:

```text
Improve the /go/:slug affiliate redirect.

1. Add a nullable affiliate_link_template column to sources. It holds a URL containing
   the literal placeholder {url}, e.g. https://my-tracked-link.example/?dest={url}
   (I'll paste my real template from my affiliate dashboard).
2. Update /go/:slug resolution, in priority order:
   a. If the listing's source has affiliate_link_template → replace {url} with the
      URL-encoded source_listing_url and redirect there (tracked AND lands on the
      exact listing).
   b. Else if the source has affiliate_base_url → redirect there (tracked, lands on
      the marketplace's homepage/search — the attribution cookie still gets set).
   c. Else → redirect to source_listing_url directly (untracked fallback).
3. Click logging stays exactly as-is and must never block the redirect.
4. In the Sources admin tab (or the DB panel until Step 7), expose both fields with
   help text explaining the {url} placeholder, plus a "Test link" action that shows
   which of the three cases a sample listing resolves to and opens the resolved URL.
```

**Where to find your real values:** in PartnerStack look for "Links" / "Create link" —
if it lets you set a destination URL on flippa.com, that's your template (put `{url}`
where the destination goes). If it only gives you one fixed URL, paste that into
`affiliate_base_url` and leave the template empty. Same logic for any other program.

### Step 5 — Auth, roles, watchlist

```text
Add user accounts and a watchlist.

1. Enable email/password auth with a clean /auth page (sign in + sign up tabs).
   Create a profiles table (id, email, display_name, created_at) auto-populated on
   signup.
2. Roles done safely: a separate user_roles table (user_id, role enum: admin, user)
   and a security-definer function has_role() used by RLS policies — do NOT store the
   role on profiles and do NOT check roles client-side only. Make me an admin after I
   sign up (I'll give you my email — or add a note telling me how to set it in the
   database panel).
3. Watchlist: watchlist_items (user_id, listing_id, created_at, unique together).
   Heart/bookmark toggle on every ListingCard and listing page. Signed-out users who
   click it get sent to /auth with a friendly message.
4. /watchlist page: the user's saved listings as cards, newest first, with a "Price
   changed since you saved" indicator comparing current price to the price when saved
   (store price_at_save on the watchlist item).
5. Nav shows the user avatar/menu when signed in (Watchlist, Alerts, Sign out; plus
   Admin link only for admins).
6. Now lock down writes properly: only admins can insert/update/delete listings and
   sources. Users can only read their own watchlist rows. Run a security review of all
   RLS policies after this change.
```

**Check:** sign up, save/unsave deals, confirm the Admin link only shows for your admin user.

### Step 6 — Saved searches + email alerts

```text
Add deal alerts by email.

1. Table saved_searches: id, user_id, name, filters (jsonb — same shape as the /browse
   query params), frequency (enum: daily, weekly), is_active, created_at,
   last_sent_at (nullable).
2. On /browse, when any filter is active show a "🔔 Save this search" button (auth
   required) that names and saves the current filters. /alerts page lists the user's
   saved searches with frequency toggle, on/off switch, delete, and a "view results"
   link that reopens /browse with those filters.
3. Email sending via Resend (I'll provide the API key as a secret named
   RESEND_API_KEY). Create a scheduled edge function that runs daily: for each active
   saved search due by frequency, find listings created (or price-dropped) since
   last_sent_at that match the filters; if any, send a nicely formatted HTML email
   ("5 new SaaS deals under $50k") with up to 10 listing cards — title, price, profit,
   multiple, source — each linking to our /listing/:slug page (not directly to the
   marketplace). Update last_sent_at. No matches = no email.
4. Also wire the landing-page email capture band: it creates an account-less
   newsletter_subscribers row (email, created_at, confirmed boolean) — just store
   them for now.
5. Include an unsubscribe link in alert emails that flips is_active off via a tokened
   link.
```

**Check:** create a saved search, then in the admin/database panel add a matching listing, trigger the function manually (ask Lovable to add a "Run now" test button on /alerts for admins), confirm the email arrives.

### Step 7 — Admin panel

```text
Build /admin (admins only — redirect non-admins away).

Tabs:
1. Listings: table of all listings (search, filter by status/source), with create/edit
   in a side drawer form (all listing fields, auto-generate slug from title, compute
   profit_multiple automatically from asking price and monthly profit). Quick actions:
   feature/unfeature, mark sold, mark back-on-market, delete (with confirm). Editing
   asking_price must record the old price to price_history (verify the trigger works).
2. CSV import: upload a CSV with columns
   title,category,niche,source_slug,source_listing_url,asking_price,monthly_revenue,
   monthly_profit,age_years,monetization,description — show a preview table with
   per-row validation errors, then import valid rows. Provide a downloadable CSV
   template.
3. Sources: edit each source's affiliate_base_url and logo.
4. Analytics: cards for total clicks (7/30 days), clicks by source, top 10
   most-clicked listings, watchlist adds, newsletter subscriber count, and a simple
   clicks-per-day line chart for the last 30 days.
```

**Check:** import a 3-row CSV, edit a price, confirm price_history row + "Price drop" badge appears on /browse.

### Step 8 — Trust pages + SEO

```text
1. Create /about (what DealScout is, how we make money — honest and clear),
   /faq (8 questions: is it free, how do you earn, do you verify listings, can I list
   my business, etc.), /affiliate-disclosure (plain-English FTC-compliant disclosure),
   /privacy and /terms (standard, clearly marked as templates for me to review).
2. SEO pass: unique <title> + meta description per route, OpenGraph + Twitter card
   tags (with a default OG image), canonical URLs, robots.txt, and a sitemap that
   includes all static routes, category pages and listing pages. Add JSON-LD
   structured data: Organization on the homepage and Product (with offers.price) on
   listing pages.
3. Add a small "Last updated {date}" line on browse/category pages (freshness signal),
   and internal links: each category landing page links to the other categories and to
   5 recent listings in the footer area.
```

### Step 9 — Polish + launch prep

```text
Final pass before launch:
1. Audit mobile at 360px width: nav, filter drawer, cards, listing page, admin tables
   (tables can scroll horizontally). Fix anything cramped.
2. Loading skeletons everywhere data loads; friendly error states with retry.
3. 404 page with a "Browse deals" CTA. Redirect /listing/{unknown} to it.
4. Performance: lazy-load images, paginate queries (never fetch all listings), and
   index the columns used by filters (category, source_id, asking_price, status,
   created_at).
5. Run the full security scan and fix every finding. Summarize what data is public vs
   protected so I can review.
```

Then in Lovable: **Publish → connect your custom domain** (Settings → Domains), and
connect **GitHub sync** (Settings → GitHub) so you have a code backup from day one.

### Step 10 (optional) — AI extras

```text
Using Lovable AI, add an admin-only "Generate summary" button in the listing editor
that drafts a punchy 2-sentence listing description and a one-line "Why it's
interesting" note from the raw listing fields. Editable before saving, never
auto-published.
```

Other optional upgrades once live: Empire Flippers' partner **valuation-tool API** as a
"What's your business worth?" lead-capture widget; a `/sold` archive page (great SEO:
"what do YouTube channels sell for"); public price-drop RSS feed.

---

## 6. Populating listings (the honest part)

Your inventory workflow — **curation, not scraping**:

1. **Daily 15-minute loop:** open Flippa (filter: SaaS / YouTube / verified revenue),
   Empire Flippers' marketplace, Motion Invest's new listings. Cherry-pick 3–10 deals
   that meet your quality bar. Add via admin form or batch CSV.
2. **Write your own descriptions** (2–3 sentences). Don't copy broker copy verbatim —
   it's their content, and unique text is what makes your pages rank.
3. **Official data routes:** Empire Flippers exposes partner APIs; Flippa has saved-search
   email alerts you can mine manually; brokers will often discuss feeds/partnerships
   once you send them traffic (that's how aggregators like DealSlide scale).
4. **Don't scrape marketplaces against their ToS.** Beyond legal risk, it poisons the
   exact partner relationships that pay you. Aggregate facts (price, category, metrics),
   link out, add your own analysis.
5. **Maintenance:** once a week, mark sold/expired listings (dead outbound links kill
   trust and SEO). The `status` field + admin quick actions exist for this.

Your quality bar *is* the product. "12 hand-picked SaaS deals under $100k this week"
beats 4,000 stale rows.

---

## 7. Launch checklist

- [ ] Custom domain connected, HTTPS live
- [ ] Affiliate links tested end-to-end (click `/go/…` → marketplace page opens → click row logged)
- [ ] PartnerStack/EF dashboards show your test clicks
- [ ] Affiliate disclosure visible near every CTA + dedicated page
- [ ] Privacy policy & terms reviewed (they're templates — read them)
- [ ] Lovable security scan clean; RLS reviewed (public read on listings only)
- [ ] Google Search Console verified, sitemap submitted
- [ ] Analytics added (Plausible or GA4 — ask Lovable to add the snippet)
- [ ] Favicon + OG image set
- [ ] Seeded with at least 50 live, real listings before you tell anyone

---

## 8. Growth playbook (first 90 days)

1. **SEO pages first.** Your category pages target "saas businesses for sale",
   "youtube channels for sale", "blogs for sale" etc. Add one long-tail page per week
   ("AI SaaS under $50k for sale", "faceless YouTube channels for sale").
2. **Weekly deal newsletter.** "The 10 best online business deals this week" — the
   alerts feature builds the list for you. This is the asset; the site is the funnel.
3. **X/Twitter + LinkedIn deal drops.** One interesting listing per day with your
   take (price vs multiple vs niche). Screenshots of your own listing cards.
4. **Reddit/indie-hacker communities:** answer "where do I find SaaS to buy" questions
   genuinely; link when relevant. No spam.
5. **YouTube Shorts/TikTok:** 30-second "This YouTube channel is selling for $65k —
   here's the math" clips. The niche loves deal-breakdown content.
6. **Broker relationships:** once you can show outbound clicks in your analytics tab,
   email the smaller brokers about featured placements or better rev-share.

**Illustrative math** (not a promise): one referred Flippa buyer/month on a ~$25k deal
→ Flippa's fees ≈ $2k+ → your 20% ≈ $400+/mo. A single closed Empire Flippers referral
can pay five figures. The compounding lever is the email list.

---

## 9. Costs to run

| Item | Cost |
|---|---|
| Lovable paid plan | ~$25/mo (includes hosting + Cloud usage tier) |
| Domain | ~$12/yr |
| Resend email | Free tier (3k emails/mo) to start |
| **Total** | **≈ $26/mo** |

---

## 10. Troubleshooting Lovable (common snags)

- **A prompt did too much / broke things:** revert via version history, split the step
  into two smaller prompts.
- **Filters or queries feel wrong:** switch to Chat mode, ask "explain how the /browse
  query is built and why result X appears," then fix in Build mode.
- **RLS errors ("row level security policy violation"):** tell Lovable exactly who
  should read/write the table; ask it to re-run the security review. Never fix by
  making a table world-writable.
- **Emails not sending:** confirm `RESEND_API_KEY` secret is set, and that your
  sending domain is verified inside Resend (required to leave sandbox).
- **Keep the Knowledge file updated** whenever a rule changes (new source, new badge
  logic) — it's what keeps later prompts consistent.

---

## 11. Legal / policy notes (read once, save pain later)

- **Disclose** affiliate relationships clearly and near the links (FTC guides).
- **Don't republish** brokers' full listing descriptions or private/NDA data — facts +
  your own summary + link out.
- **Trademarks:** naming, logo and design must not imitate DealSlide, Flippa, etc.
  "Inspired by the model" is fine; confusingly similar is not.
- **No advice:** add a line that listings aren't vetted investment advice and buyers
  must do their own due diligence (the FAQ prompt covers this).
- **Program terms:** each referral program bans certain traffic (paid ads on their
  brand terms is a classic ban). Read the terms of each program you join.

---

*Placeholder name "DealScout" throughout — find your own name and replace it in the
Knowledge file and Step 1 prompt before you begin.*
