# Clover — App Store Optimization Strategy (iOS · US + UK)

**App:** Clover — Plant Identifier
**Platform:** iOS (Apple App Store)
**Markets:** United States (primary), United Kingdom
**Primary competitor benchmark:** PictureThis (Glority)
**Prepared as:** a senior ASO playbook — copy/paste the metadata, then work the ongoing loop.

> **How Apple search actually works (read this first — it changes everything).**
> Apple indexes keywords from **only** these fields: **App Name (30), Subtitle (30), the hidden Keyword field (100), and In‑App Purchase display names.** It does **NOT** index your long Description (that is a Google Play behaviour). So the entire ranking game on iOS is won inside ~160 characters + your IAP names + your ratings, velocity, and conversion. Every recommendation below is built around that reality.

---

## 1. The keyword-coverage multiplier most people miss

You can legally multiply your indexed keywords by adding **extra English localizations**, even though your app is in English. Apple indexes the keyword fields of *every* localization you enable, and English‑variant localizations show to US and UK users.

**Set up these localizations in App Store Connect (each gets its own Name/Subtitle/Keyword field):**

| Localization | Serves | Purpose |
|---|---|---|
| **English (U.S.)** — primary | US storefront | Core money keywords |
| **English (U.K.)** | UK storefront | UK spellings + *extra* index terms that also count in US search |
| **English (Australia)** | bonus | Pure keyword-expansion field — also indexes for US users |
| **English (Canada)** | bonus | Second keyword-expansion field |

> Net effect: instead of ~100 keyword-field characters, you get **~400** of indexable keyword space with zero risk. This is the single highest-leverage move in the whole plan — do it before anything else.

**Rules for the Keyword field (all localizations):**
- Comma-separated, **no spaces** (a space wastes a character).
- **Never repeat** a word already in your App Name or Subtitle — Apple already indexes those. Repetition is wasted space.
- Use **singular** only — Apple auto-stems plurals ("flower" covers "flowers").
- **Don't** include the word "app", your category name ("utilities"), or Apple-obvious stopwords ("the", "for").
- **Don't** put a competitor's trademark ("picturethis", "planta") in the field — it risks rejection under App Store Review Guideline 2.3.7 and doesn't reliably rank anyway.
- Apple **combines** words across commas, so single tokens are enough — you don't need to write the phrase "plant identifier" if "plant" is in the title and "identifier"/"scanner" is in a field.

---

## 2. Metadata — ready to paste (all counts verified ≤ limit)

### 2.1 English (U.S.) — PRIMARY

**App Name (24/30):**
```
Clover: Plant Identifier
```
**Subtitle (30/30):**
```
Identify Flowers, Trees & Care
```
**Keyword field (97/100):**
```
flower,tree,leaf,weed,mushroom,garden,botany,scanner,succulent,cactus,fungi,houseplant,fern,bloom
```
Why this wins: "Plant Identifier" is the #1 head term and it's in the *name* (heaviest weight). Subtitle captures "identify", "flowers", "trees", "care". The field then covers the entire long tail (weed ID, mushroom ID, succulent ID, houseplant care) without repeating a single word from the name/subtitle. Combined, you index for: *plant identifier, plant scanner, flower identifier, tree identifier, leaf identifier, weed identifier, mushroom identifier, plant care, garden scanner, botany scanner, succulent identifier, cactus identifier, houseplant care, fern identifier* — and more via cross-combination.

### 2.2 English (U.K.)

**App Name (24/30):**
```
Clover: Plant Identifier
```
**Subtitle (30/30):**
```
Flower, Tree & Weed Identifier
```
**Keyword field (96/100):**
```
wildflower,shrub,herb,foliage,nature,hiking,allotment,toadstool,identify,name,seedling,vine,moss
```
UK-specific choices: **"allotment"** and **"toadstool"** are high-intent British terms with near-zero US usage — cheap to rank for. UK subtitle leads with "Weed Identifier" (lawn/garden weed ID is a huge UK search cluster). British spelling is respected here ("foliage", "nature", "hiking" for wild plant ID on walks).

### 2.3 English (Australia) — keyword expansion (indexes for US too)

**Keyword field (96/100):**
```
care,disease,diagnosis,poisonous,edible,tropical,indoor,outdoor,species,grow,pest,detector,berry
```
This field is pure long-tail: *plant disease, plant diagnosis, poisonous plant, edible plant, indoor plant, plant pest, plant detector, plant species*. Reuse the US Name/Subtitle here.

### 2.4 English (Canada) — keyword expansion

**Keyword field (100/100):**
```
sick,dry,yellow,dying,watering,light,soil,repot,fertilizer,sunlight,collection,journal,reminder,wiki
```
Captures the **plant-care problem searches** that convert best: *why is my plant dying, yellow leaves, watering reminder, plant journal, plant collection, when to repot*. These are lower-volume but extremely high-intent and low-competition.

### 2.5 Promotional Text (158/170) — updatable anytime, no review needed

```
New: instant plant health check! Point your camera at any leaf to diagnose disease, get watering tips, and save every plant to your garden. Try it free today.
```
Promo text sits above the description, is **not indexed**, but drives conversion. Swap it for seasonal hooks (spring planting, "identify autumn mushrooms safely", houseplant gifting at Christmas) without submitting an update.

---

## 3. Description — written for conversion, not keywords

The description doesn't rank you, so its only job is to **convert the visit into a download**. Front-load the first 3 lines (all that's visible before "more"). Structure:

```
Clover turns your iPhone camera into a botanist. Point, snap, and know
any plant, flower, tree, weed, or mushroom in seconds — with 95%+ accuracy
and care instructions for every species you find.

WHY 2 MILLION GARDENERS CHOOSE CLOVER
• Instant ID — flowers, trees, houseplants, succulents, weeds, cacti & fungi
• Plant health scanner — diagnose disease & pests from a photo, get the cure
• Care guides — exact water, light & soil for every plant you own
• My Garden — build a living collection with watering reminders
• Expert answers — ask a real botanist when the AI isn't sure
• Works offline for the most common species

IDENTIFY MORE THAN JUST PLANTS
Mushrooms, insects on your plants, and toxic species to keep pets & kids safe.

TRY CLOVER FREE
Download free and identify your first plants at no cost. Clover Premium
unlocks unlimited IDs, disease diagnosis, and reminders.
[subscription terms + links to Privacy Policy and Terms of Use]
```

> **Compliance note:** Apple requires functional links to your Privacy Policy and Terms (EULA) plus auto-renew disclosure when you mention subscriptions. Missing these is the #1 cause of metadata rejection for this app category.

---

## 4. In-App Purchase names = free extra indexed keywords

Apple indexes **IAP display names**. Name your subscriptions/products with keywords, not "Premium":

| Instead of | Use (indexed) |
|---|---|
| Premium Monthly | Plant Care & Disease Diagnosis — Monthly |
| Premium Yearly | Unlimited Plant Identifier — Yearly |
| Lifetime | Botanist Expert Plant ID — Lifetime |

Feature at least one IAP on your product page (App Store Connect → "Promote In‑App Purchases") — up to 20 can appear directly in search results as their own cards.

---

## 5. Visual conversion (the other half of ASO — this beats PictureThis on tap-through)

Rankings get you *seen*; creatives get you *installed*. Conversion rate feeds back into ranking, so this is not optional.

**App Icon**
- A single clover/leaf mark, bold, high-contrast, readable at 60px. Avoid text.
- Test 2–3 icons via **Product Page Optimization (PPO)** — Apple's native A/B test, free, statistically valid. Run a green-leaf vs. camera-lens-leaf vs. flower icon test.

**Screenshots (first 2–3 are what shows in search results — invest 80% of effort here)**
1. **Hero:** "Identify Any Plant in Seconds" — camera reticle over a flower + the result card. Caption sells the outcome, not the feature.
2. **Health scanner:** "Is My Plant Sick? Find Out Instantly" — a diagnosis card with the fix.
3. **Care reminders:** "Never Kill a Plant Again" — watering reminder UI.
4. Accuracy/trust: "Powered by 400,000+ species."
5. My Garden collection view.
- Use **portrait**, big legible captions (readable in the search grid thumbnail), consistent brand color band.
- Localize captions for UK (spelling + "allotment"/"garden" framing).

**App Preview Video (up to 3, 15–30s)**
- First 3 seconds must show the *snap → instant result* moment. Autoplays muted, so design for silent viewing with captions.

**In-App Events** (appear in search & on your product page)
- Seasonal events drive re-engagement + a discovery surface: "Spring Wildflower Week", "Autumn Mushroom Safety Guide", "Houseplant Rescue Challenge".

---

## 6. Competitive read: how to actually out-rank PictureThis

PictureThis is entrenched (huge ratings volume, brand searches). You will **not** beat it head-on for the term "plant identifier" in month one. The senior play is **flank, then climb**:

| Vector | PictureThis | Clover's opening |
|---|---|---|
| Head term "plant identifier" | Dominates (millions of ratings) | Long game — appear on page 1, don't expect #1 yet |
| Long-tail ("weed identifier", "mushroom identifier", "allotment") | Under-optimized | **Win these now** — low competition, real volume |
| UK-specific terms | Generic US metadata | **"allotment", "toadstool", UK weeds** are open |
| Ratings velocity | Slow to move for them | Your fastest lever — see §7 |
| Freshness | Infrequent copy changes | Ship updates + In-App Events monthly for the freshness signal |
| Price framing | Aggressive paywall (poor reviews mention it) | Position a genuine free tier — mine their 1‑star reviews for your screenshot copy |

**Action:** read PictureThis's recent 1★/2★ reviews. The recurring complaints (paywall surprise, wrong IDs, subscription traps) are your **screenshot headlines and review-response talking points**. Turn their weaknesses into your positioning.

---

## 7. Ratings & velocity — the ranking factor you control fastest

Ratings volume + recency + your download-velocity are massive ranking inputs.

- Implement **`SKStoreReviewController`** (StoreKit review prompt) and trigger it at a **moment of delight** — right after a *successful* identification, never on launch or mid-task. Apple caps it at 3 prompts/year per user, so spend them well.
- Ask only users who did something positive (completed ≥2 IDs, added a plant to My Garden). Never prompt after an error.
- **Respond to reviews** in App Store Connect — especially negatives. Responses are public, show you care, and often flip 1★ → 4★.
- Run a **soft launch of copy via PPO** and only push the winning variant globally.

---

## 8. Category, and the rest of the product page

- **Primary category:** *Education* **or** *Reference* — both rank easier than the crowded *Utilities*/*Lifestyle* for this app, and match search intent. Test Education (broad reach) vs. Reference (higher intent).
- **Secondary category:** *Lifestyle* or *Utilities*.
- **Subtitle refresh:** you can change Name/Subtitle/Keywords only with an app version submission — batch metadata changes with each release and **change one variable at a time** so you can attribute ranking shifts.

---

## 9. Rollout plan — first 90 days

**Week 0 — foundation**
- [ ] Enable the 4 English localizations (US, UK, AU, CA) and paste all metadata from §2.
- [ ] Set primary category (Education) + secondary.
- [ ] Rename IAPs with keywords (§4) and promote one on the product page.
- [ ] Ship screenshots 1–3 + a 20s preview video.
- [ ] Implement `SKStoreReviewController` at the post-success moment.

**Weeks 1–4 — measure & seed**
- [ ] Track ranks daily for the target keyword set (§10) — baseline everything.
- [ ] Launch first **PPO icon test** + one screenshot-order test.
- [ ] Respond to 100% of reviews.
- [ ] Ship first **In-App Event** (seasonal).

**Weeks 5–8 — iterate on data**
- [ ] Promote your best-ranking mid-tail terms into the Subtitle; move losers out of the keyword field.
- [ ] Roll out the winning PPO creatives globally.
- [ ] Add a second preview video variant.

**Weeks 9–12 — climb the head terms**
- [ ] With ratings volume and velocity now higher, re-test putting a broader head term in the subtitle.
- [ ] Expand In-App Events cadence to monthly.
- [ ] Begin light Apple Search Ads on your *branded* + best long-tail terms to defend and to feed conversion data (even a small budget lifts organic via velocity).

---

## 10. KPIs & the keyword watchlist

**Track weekly (App Store Connect → App Analytics + a rank-tracker like AppTweak/Sensor Tower/AppFigures):**
- Keyword rankings for the watchlist (below)
- **Impressions → Product Page Views → Downloads** conversion rates (the funnel)
- Ratings count + average, and rate of new ratings
- Retention D1/D7 (Apple weights engaged apps)

**Keyword watchlist to monitor from day 1:**

*Head (long game):* plant identifier · plant identification · plant scanner · plant id
*Mid (win in 4–8 wks):* flower identifier · tree identifier · weed identifier · mushroom identifier · leaf identifier · plant care · plant disease
*Long-tail / UK (win fast):* succulent identifier · houseplant care · cactus identifier · allotment · toadstool · poisonous plant · edible plant · watering reminder · yellow leaves · plant journal

---

## 11. Do-not-do list (avoids rejection & wasted spend)

- ❌ Don't stuff competitor brand names in metadata (2.3.7 rejection risk).
- ❌ Don't repeat words across Name/Subtitle/Keyword field.
- ❌ Don't use plurals or spaces in the keyword field.
- ❌ Don't claim medical/safety guarantees for mushroom/toxicity ID — add a clear disclaimer ("not a substitute for expert verification; never eat wild plants/fungi based solely on the app"). This is both an ethics and a review-guideline safeguard.
- ❌ Don't buy fake reviews — Apple detects and delists.
- ❌ Don't change five metadata variables at once — you'll never know what moved the needle.

---

### One-paragraph summary
Put "Plant Identifier" in the **name**, own "identify / flowers / trees / weeds / care" in the **subtitle**, and blanket the long tail across **four English keyword fields (US, UK, AU, CA)** — quadrupling your indexed terms for free. Don't fight PictureThis for the head term on day one; **take the mid- and long-tail and the UK-specific terms** it ignores, then climb the head term as your **ratings velocity and conversion** (driven by great first-three screenshots and a well-timed review prompt) compound. Measure one change at a time, ship monthly with In-App Events for freshness, and let PPO pick your creatives with real data.
