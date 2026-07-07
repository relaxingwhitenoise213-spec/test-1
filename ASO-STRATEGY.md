# Clover — App Store Optimization Strategy v2 (iOS · US + UK)

**App:** Clover — Plant Identifier
**Platform:** iOS (Apple App Store)
**Markets:** United States (primary), United Kingdom · expansion: France, Germany, Netherlands, MENA/Arabic, Japan, Canada, Australia (§2)
**Benchmark competitor:** PictureThis (Glority) — ~4.6★, 1M+ US ratings, ~700k downloads/mo, ~$5M/mo revenue
**Version:** 2.0 — research-verified. *Changelog: v1 assumed en-AU/en-CA keyword fields index on the US storefront; the published AppTweak/Phiture/AppFollow cross-localization tests show the US actually indexes **en-US + es-MX** (plus AR, zh-Hans/Hant, FR, KO, PT-BR, RU, VI), and the UK indexes **en-GB + en-AU**. Section 1 and all metadata below are corrected accordingly.*

---

> **How Apple search actually works (this determines everything).**
> Apple indexes keywords from **only** these fields: **App Name (30 chars), Subtitle (30), the hidden Keyword field (100), and In-App Purchase display names.** It does **NOT** index the long Description (that's a Google Play behaviour). Ranking = (keyword relevance in those fields) × (download velocity) × (ratings volume/quality) × (conversion rate) × (engagement/retention). So the game is: maximize indexed coverage in ~160 characters per locale, then compound velocity and conversion.

---

## 1. Cross-localization: the verified keyword multiplier

Apple indexes the metadata of **secondary localizations** on each storefront. This is the highest-leverage free move available, but the pairs must be right:

| Storefront | Localizations Apple indexes there | What you do |
|---|---|---|
| 🇺🇸 **United States** | **en-US** (primary) + **es-MX** (secondary; also AR, zh-Hans, zh-Hant, FR, KO, PT-BR, RU, VI per ASO-industry tests) | Put your core terms in en-US; put a *second 100-char field of English long-tail* in **es-MX** — it indexes for US searches |
| 🇬🇧 **United Kingdom** | **en-GB** (primary) + **en-AU** (secondary) | en-GB carries UK core terms; **en-AU** becomes your second UK keyword field |
| 🇦🇺 Australia (bonus) | en-AU + en-GB | Already covered by the two fields above — free AU coverage |
| 🇨🇦 Canada (bonus) | en-CA + fr-CA (+ en-US per tests) | Optional en-CA + fr-CA fields = free Canadian coverage |
| 🇫🇷 France (expansion) | **fr-FR** (primary) + **en-US** (secondary) | Your en-US field already indexes in France; add a French fr-FR set (§2.6) to complete the pair — fr-FR is also a secondary index on the US storefront |
| 🇩🇪 Germany (expansion) | **de-DE** (primary) + **en-GB** (secondary) | German set (§2.8) carries the real local search volume; also covers Austria & Switzerland |
| 🇳🇱 Netherlands (expansion) | **nl-NL** (primary) + **en-GB** (secondary) | Dutch set (§2.9); en-GB already carries the heavy English search share there |
| 🇸🇦 MENA (expansion) | **ar** (primary) + **en-GB** (secondary) | Arabic set (§2.10) for Saudi/UAE/Egypt; ar is also a secondary index on the US storefront |
| 🇯🇵 Japan (expansion) | **ja** (primary) + **en-US** (secondary) | Japanese set (§2.11) — head term is 植物図鑑, not "plant identifier" |

**Net result:** ~200 indexable keyword-field characters per target market instead of 100, plus Name + Subtitle per locale. Zero policy risk — this is standard, documented practice.

**Rules for every Keyword field:**
- Comma-separated, **no spaces** (spaces waste characters).
- **Never repeat** a word already in that storefront's indexed Name/Subtitle *or* its paired secondary field — every duplicate is dead weight. (Watch stems too: "identify" duplicates "Identifier".)
- **Singular only** — Apple stems plurals ("flower" also matches "flowers").
- Apple **cross-combines** words between fields, so single tokens are enough ("weed" + "Identifier" in the subtitle ⇒ you're indexed for "weed identifier").
- No "app", no category words, no stopwords, and **no competitor trademarks** ("picturethis", "planta") — App Review Guideline 2.3.7 rejection risk, and it doesn't reliably rank anyway. (Bidding on competitor terms in Apple Search **Ads** is fine — see §7.)

---

## 2. Metadata — ready to paste (every count verified ≤ limit)

### 2.1 English (U.S.) — primary, indexes on 🇺🇸

**App Name (24/30)**
```
Clover: Plant Identifier
```
**Subtitle (30/30)**
```
Identify Flowers, Trees & Care
```
**Keyword field (97/100)**
```
flower,tree,leaf,weed,mushroom,garden,botany,scanner,succulent,cactus,fungi,houseplant,fern,bloom
```

### 2.2 Spanish (Mexico) — **secondary US index = your 2nd US keyword field**

**App Name:** keep `Clover: Plant Identifier` (brand consistency).
**Subtitle (30/30)** — all-new words, indexes in US:
```
Plant Health Check & Diagnosis
```
**Keyword field (97/100)** — English long-tail, high-intent "problem" searches:
```
sick,yellow,dying,watering,soil,repot,fertilizer,journal,reminder,poisonous,edible,pest,seed,vine
```
> Why English in a Spanish field? Because the **US storefront indexes this field for US users**. Bonus: it also serves the ~40M Spanish-speaking US users if you later add a couple of Spanish terms. This field captures: *plant sick, yellow leaves, plant dying, watering reminder, plant journal, poisonous plant, edible plant, plant pest, plant health check, plant diagnosis.* These problem-searches convert far better than head terms and are far less contested.

**Combined US index now covers:** plant identifier · plant scanner · flower/tree/leaf/weed/mushroom/succulent/cactus/houseplant/fern identifier · plant care · garden scanner · plant health check · plant diagnosis · yellow leaves · dying plant · watering reminder · poisonous/edible plant · plant pest — and every cross-combination.

### 2.3 English (U.K.) — primary, indexes on 🇬🇧

**App Name (24/30)**
```
Clover: Plant Identifier
```
**Subtitle (30/30)**
```
Flower, Tree & Weed Identifier
```
**Keyword field (95/100)** — note: no "identify" (stems into "Identifier" already in subtitle):
```
wildflower,shrub,herb,foliage,nature,hiking,allotment,toadstool,meadow,hedge,seedling,vine,moss
```
UK-specific picks: **allotment**, **toadstool**, **hedge(row)**, **meadow** are high-intent British terms with near-zero competition from US-optimized apps like PictureThis. Weed ID leads the UK subtitle — lawn/garden weed identification is a huge UK search cluster.

### 2.4 English (Australia) — **secondary UK index = your 2nd UK keyword field** (also primary for 🇦🇺)

**Keyword field (96/100)**
```
care,disease,diagnosis,poisonous,edible,berry,indoor,outdoor,species,grow,pest,detector,lawn,ivy
```
No overlap with the en-GB Name/Subtitle/field it pairs with. Adds for UK: *plant care, plant disease, lawn weed, ivy identifier, poisonous berry, indoor plant, plant detector.* Keep Name/Subtitle same as en-GB.

### 2.5 English (Canada) — full set for 🇨🇦

Canada's storefront indexes **en-CA + fr-CA + en-US** — your en-US Name/Subtitle/Keywords already rank in Canada, so this set is built to add *only new words* on top of them (checked: zero keyword-field overlap with en-US).

**App Name (24/30)**
```
Clover: Plant Identifier
```
**Subtitle (28/30)** — fresh indexed words *snap, photo, name*; the one repeat ("Plant") is accepted for conversion — the subtitle's first job is the tap:
```
Snap a Photo, Name Any Plant
```
**Keyword field (97/100)** — Canadian gardening intent (short seasons, hardiness, indoor growing):
```
frost,hardy,perennial,annual,bulb,vegetable,tomato,orchid,bonsai,wilting,mold,light,drainage,zone
```
Combined with the en-US index, Canada now covers: *plant identifier · flower/tree/weed/mushroom identifier · hardiness zone · frost hardy plant · perennial/annual identifier · vegetable garden · tomato disease (with fr-CA's `tomate`) · orchid/bonsai care · wilting plant · plant light · drainage.* Pairs with the fr-CA field (§2.7) for Québec.

### 2.6 French (fr-FR) — 🇫🇷 France storefront + secondary index on 🇺🇸 US

France indexes **fr-FR (primary) + en-US (secondary)** — so your English en-US field already works in France, and this French field completes the pair. Bonus: fr-FR is also one of the secondary locales indexed on the **US** storefront.

**App Name (30/30)**
```
Clover : Identification Plante
```
**Subtitle (28/30)**
```
Reconnaître Fleurs et Arbres
```
**Keyword field (100/100)** — no stem overlap with the French Name/Subtitle (*plante, identification, reconnaître, fleur, arbre* are already indexed there):
```
feuille,champignon,jardin,jardinage,herbe,mauvaise,soin,arrosage,maladie,cactus,botanique,succulente
```
Covers the French search clusters: *identification plante · reconnaître fleur/arbre · quelle est cette plante · champignon · mauvaise herbe · soin des plantes · arrosage · maladie plante · jardinage.*

> **Nuance from the localization tests:** Apple combines keywords into phrases **within** a locale, but **not between** locales. So each locale's field must be self-sufficient — don't rely on an English word in en-US pairing with a French word in fr-FR.

**Localize the creatives too, or conversion will undo the ranking:** French screenshot captions — 1. *« Identifiez n'importe quelle plante en quelques secondes »* · 2. *« Votre plante est malade ? Sachez-le immédiatement »* · 3. *« Ne tuez plus jamais une plante »*. Also localize the promotional text and the first 3 description lines.

### 2.7 French (Canada) (fr-CA) — 🇨🇦 bonus, pairs with en-CA

**Keyword field (96/100)** — Canadian French gardening terms, no accents needed in keyword fields (Apple matches both):
```
potager,semis,bouture,engrais,rempoter,succulente,orchidee,tomate,vivace,gel,interieur,exterieur
```
Note: *succulente* appearing in both fr-FR and fr-CA is fine — they index on **different storefronts** (France vs Canada). Duplicates only waste space within a single storefront's indexed set.

### 2.8 German (de-DE) — 🇩🇪 Germany (+ Austria & Switzerland storefronts)

Germany indexes **de-DE (primary) + en-GB (secondary)** — your en-GB set already ranks there; this adds the German layer, where nearly all real search volume lives ("pflanzen bestimmen" is the German head term, not "plant identifier").

**App Name (26/30)**
```
Clover: Pflanzen Bestimmen
```
**Subtitle (30/30)**
```
Blumen, Bäume & Pilze erkennen
```
**Keyword field (95/100)** — no stem overlap with the German Name/Subtitle (*pflanze, bestimmen, blume, baum, pilz, erkennen* already indexed there):
```
blatt,unkraut,garten,zimmerpflanze,gießen,krankheit,kaktus,sukkulente,botanik,moos,kraut,giftig
```
Covers: *pflanzen bestimmen · blumen/bäume/pilze erkennen · unkraut bestimmen (weeds) · zimmerpflanze (houseplant) · pflanzen krankheit · giftige pflanzen · gießen (watering).* Mushroom foraging ("Pilze sammeln") is culturally huge in Germany — keep the safety disclaimer prominent in the German description. Bonus reach: de-DE is also primary for the Austria and Switzerland storefronts.

### 2.9 Dutch (nl-NL) — 🇳🇱 Netherlands

Netherlands indexes **nl-NL (primary) + en-GB (secondary)**. Note: Dutch users search in English more than Germans do, so the en-GB set carries real weight here — the Dutch layer captures the rest.

**App Name (28/30)** — v2: the literal "Planten Herkennen" name was already taken on the App Store (names must be unique), so the name pivots to **plantenzoeker** ("plant finder"), itself a searched Dutch head term, and moves *herken* into the subtitle — zero keyword equity lost:
```
Clover: Plantenzoeker & Gids
```
**Subtitle (30/30)**
```
Herken Bloemen, Bomen, Onkruid
```
**Keyword field (99/100)** — no stem overlap with the Dutch Name/Subtitle:
```
blad,paddenstoel,tuin,tuinieren,kamerplant,verzorging,ziekte,cactus,vetplant,mos,kruid,giftig,water
```
Combined index: *plantenzoeker · planten herkennen (via "Plantenzoeker" + "Herken") · planten gids · bloemen/bomen herkennen · onkruid herkennen (weeds) · paddenstoel (mushroom) · kamerplant verzorging (houseplant care) · planten ziekte · giftige planten.*

Fallback names if this one is also taken (checked ≤30): `Clover: Herken Elke Plant` (25) — keeps *herken + plant* in the name; or `Clover – Planten & Bloemen ID` (29). If you use a fallback, swap the subtitle back to `Bloemen, Bomen & Onkruid Gids` (29/30) and re-check stem overlap.

### 2.10 Arabic (ar-SA) — 🇸🇦🇦🇪🇪🇬 Saudi Arabia, UAE, Egypt & MENA storefronts

Arabic storefronts index **Arabic (primary) + en-GB (secondary)**. Arabic is also one of the **secondary locales indexed on the US storefront** — so this field additionally serves Arabic-speaking users searching in Arabic in the US.

**App Name (21/30)** — "Clover: Identify Plants":
```
كلوفر: تحديد النباتات
```
**Subtitle (24/30)** — "Discover flowers and trees":
```
تعرف على الزهور والأشجار
```
**Keyword field (96/100)** — plant, leaf, mushroom, garden, grass/weed, cactus, watering, disease, gardening, tree, rose, seedling, fertilizer, soil, irrigation, planting, seed, care, fungi, poisonous:
```
نبات,ورقة,فطر,حديقة,عشب,صبار,سقي,مرض,بستنة,شجرة,وردة,نبتة,سماد,تربة,ري,زرع,بذرة,عناية,فطريات,سام
```
MENA-specific angles: indoor/succulent care dominates (Gulf climate → *صبار* cactus, *ري* irrigation, *سماد* fertilizer), and home-gardening content is booming in Saudi/UAE. **Screenshots must be mirrored RTL** with Arabic captions — Apple shows the Arabic product page when the device language is Arabic; unlocalized LTR screenshots crater conversion there.

> **Alternative play for ar:** because Arabic is indexed on the US storefront, some ASO teams fill the ar field with *English* keywords as a third US field instead. Recommendation: use real Arabic (above) — the MENA App Store is one of the fastest-growing plant-app markets, and the US already has two full fields (en-US + es-MX).

### 2.11 Japanese (ja) — 🇯🇵 Japan

Japan indexes **ja (primary) + en-US (secondary)** — your en-US set already ranks there; this adds the Japanese layer, which is where virtually all Japanese search volume lives. Critical mindset shift: Japanese users don't search "plant identifier" — the head term is **植物図鑑** (*plant zukan*, "picture-book/encyclopedia"), and **花の名前** ("flower name") is the intent phrase.

**App Name (20/30)** — "Clover: the zukan that tells you plant & flower names":
```
Clover：植物・花の名前がわかる図鑑
```
Indexes the whole Japanese head cluster: *植物図鑑 · 花の名前 · 植物 名前 · 花 図鑑 · 名前がわかる.*

**Subtitle (19/30)** — "Just take a photo — identifies trees, mushrooms & weeds too":
```
写真を撮るだけで木・キノコ・雑草も判定
```
Adds: *写真 (photo) · 木 (tree) · キノコ (mushroom) · 雑草 (weed) · 判定 (identify/judge).*

**Keyword field (95/100)** — no overlap with Name/Subtitle; covers houseplant, succulent, cactus, watering, disease, pest, gardening, garden, bonsai, moss, wild plants, diagnosis, hanakotoba, home vegetable garden, herb, sakura, autumn leaves, repotting:
```
観葉植物,多肉植物,サボテン,水やり,病気,害虫,ガーデニング,庭,盆栽,苔,樹木,野草,葉,識別,栽培,肥料,きのこ,山菜,花言葉,診断,カメラ,家庭菜園,野菜,ハーブ,桜,紅葉,植え替え
```
Japan-specific notes:
- **花言葉** (hanakotoba — the "language of flowers") is a massive adjacent search in Japan; if the app can show each flower's hanakotoba, feature it in Japanese screenshots — no Western competitor does this well.
- **きのこ/山菜** (mushroom & wild-vegetable foraging) is a big seasonal cluster (autumn) — same safety-disclaimer rule as Germany.
- **Both scripts matter:** キノコ (katakana, subtitle) and きのこ (hiragana, keywords) are indexed as different tokens — cover both.
- **盆栽 (bonsai), 苔 (moss), 桜 (sakura), 紅葉 (autumn foliage)** are cultural evergreens with dedicated audiences.
- Localize screenshots into Japanese with text-heavy captions — Japanese product pages convert better with more on-image text than Western ones.

### 2.12 Promotional Text (158/170) — updatable anytime, **no app review needed**
```
New: instant plant health check! Point your camera at any leaf to diagnose disease, get watering tips, and save every plant to your garden. Try it free today.
```
Not indexed — pure conversion. Rotate seasonally without a release: spring planting (Mar–May), "identify autumn mushrooms safely" (Sep–Oct), houseplant gifting (Dec).

---

## 3. Description — conversion copy (not indexed on iOS)

Only the **first ~3 lines** show before "more". Structure:

```
Clover turns your iPhone camera into a botanist. Point, snap, and know
any plant, flower, tree, weed, or mushroom in seconds — with expert-level
accuracy and care instructions for every species you find.

WHY GARDENERS CHOOSE CLOVER
• Instant ID — flowers, trees, houseplants, succulents, weeds, cacti & fungi
• Plant health scanner — diagnose disease & pests from a photo, get the cure
• Care guides — exact water, light & soil for every plant you own
• My Garden — build a living collection with watering reminders
• Works offline for the most common species

STAY SAFE OUTDOORS
Identify toxic plants and fungi to keep pets and kids safe. Important:
Clover is not a substitute for expert verification — never eat wild plants
or mushrooms based solely on an app identification.

TRY CLOVER FREE
Download free and identify your first plants at no cost. Clover Premium
unlocks unlimited IDs, disease diagnosis, and care reminders.

[Auto-renewing subscription disclosure + functional links to Privacy
Policy and Terms of Use (EULA) — REQUIRED when you sell subscriptions;
missing links are the #1 metadata rejection in this category.]
```

> Only make claims you can substantiate (species count, accuracy %, user count). Apple flags unverifiable superlatives, and PictureThis already owns "98% accuracy / 400,000 species" positioning — differentiate instead of imitating.

---

## 4. In-App Purchase names = extra indexed keywords + search cards

Apple indexes **IAP display names**, and up to 20 promoted IAPs can appear directly in search results as their own cards.

| Instead of | Use (indexed) |
|---|---|
| Premium Monthly | Plant Care & Disease Diagnosis — Monthly |
| Premium Yearly | Unlimited Plant Identifier — Yearly |
| Lifetime | Botanist Expert Plant ID — Lifetime |

Enable "Promote In-App Purchases" for at least the yearly plan.

---

## 5. Creatives — full copy deck (conversion feeds ranking)

**Icon:** one bold clover/leaf mark, no text, readable at 60px. Test 3 variants via **Product Page Optimization** (Apple's native A/B test): flat green leaf · camera-aperture-leaf hybrid · white clover on deep green.

**Screenshots — captions ready to use (first 2–3 decide your search-results tap-through; portrait; big type readable at thumbnail size):**

| # | US caption | UK caption | Visual |
|---|---|---|---|
| 1 | **Identify Any Plant in Seconds** | **Name Any Plant in Seconds** | Camera reticle over a flower + result card sliding up |
| 2 | **Is Your Plant Sick? Know Instantly** | **Is Your Plant Poorly? Know Instantly** | Leaf photo → diagnosis card with the cure |
| 3 | **Never Kill a Plant Again** | **Never Kill a Plant Again** | Watering-reminder UI, calendar view |
| 4 | **Weeds, Mushrooms & Trees Too** | **Weeds, Toadstools & Trees Too** | 3-up grid of ID results |
| 5 | **Your Garden, All in One Place** | **Your Allotment, In Your Pocket** | My Garden collection view |

**App Preview video (15–30s):** first 3 seconds must show *snap → instant result*. Autoplays muted — design for silent viewing, caption everything.

**In-App Events** (extra discovery surface in search + your page): "Spring Wildflower Week" · "Autumn Mushroom Safety Guide" · "Houseplant Rescue Challenge". Ship one per month for the freshness signal.

---

## 6. Beating PictureThis: flank, then climb

PictureThis's moat is ratings volume (1M+ US) and brand search. You don't out-muscle that in month one — you out-position it:

| Vector | PictureThis | Clover's opening |
|---|---|---|
| "plant identifier" head term | Dominant | Long game: page-1 presence first, top-3 later |
| Problem long-tail (*yellow leaves, plant sick, watering reminder*) | Under-optimized | **Own it now via the es-MX field** — high intent, low contest |
| UK-specific (*allotment, toadstool, hedge, meadow*) | Generic US metadata | **Open goal — take it via en-GB/en-AU** |
| Paywall reputation | Their 1★ reviews cite aggressive paywall & accidental subscriptions | Genuine free tier, transparent pricing — say it in screenshot #1 sub-caption: *"Free to start. No surprises."* |
| Freshness | Infrequent metadata changes | Monthly release + In-App Event cadence |

**Do this:** read PictureThis's recent 1★/2★ reviews monthly. Their complaint patterns (paywall surprise, subscription traps, wrong IDs on lookalike species) are your screenshot headlines, your review-response talking points, and your onboarding-design brief.

---

## 7. Apple Search Ads — small budget, outsized organic effect

ASA conversion data feeds your organic relevance signals, and download velocity lifts organic rank. A modest, surgical spend:

| Campaign | Match | Examples | Budget share |
|---|---|---|---|
| **Brand defense** | Exact | clover plant, clover identifier | 10% |
| **Generic core** | Exact | plant identifier, flower identifier, weed identifier, mushroom identifier | 40% |
| **Problem terms** | Exact | yellow leaves, plant disease, watering reminder | 20% |
| **Competitor** | Exact | picture this, picturethis plant (allowed in ASA; never in metadata) | 15% |
| **Discovery** | Broad + Search Match ON | mines new query data → feed winners back into keyword fields | 15% |

Start ~$1,500/mo US + £500/mo UK. The Discovery campaign is your cheapest keyword-research tool — harvest its search-terms report every two weeks.

---

## 8. Ratings engine — your fastest controllable ranking factor

- Trigger **`SKStoreReviewController`** only at a *moment of delight*: immediately after a **successful** identification (≥2 lifetime IDs, or after adding a plant to My Garden). Never on launch, never after an error. Apple caps prompts at 3/user/year — spend them well.
- **Respond to every review** in App Store Connect. Templates:
  - *Negative — wrong ID:* "Sorry we misread your ⟨plant⟩ — lookalike species are hard and we're improving weekly. Send the photo to support@clover.app and our botanist will identify it personally and feed the fix back into the model."
  - *Negative — pricing:* "You can keep identifying plants on the free tier — Premium only adds unlimited IDs and disease diagnosis. If anything felt unclear at sign-up, tell us at support@clover.app and we'll make it right."
  - *Positive:* thank them + mention one feature they haven't used ("if you add it to My Garden we'll remind you when to water it").
- Never buy reviews/installs — Apple detects and delists.

---

## 9. Rollout — first 90 days

**Week 0 — foundation**
- [ ] Add localizations: en-US, es-MX, en-GB, en-AU (+ en-CA optional); paste §2 metadata.
- [ ] Primary category **Education**, secondary **Lifestyle** (Education/Reference rank easier than Utilities for this intent; you can test Reference later).
- [ ] Rename + promote IAPs (§4).
- [ ] Ship screenshots 1–3 + preview video (§5); implement the review prompt (§8).
- [ ] Baseline all watchlist keywords (§10) in a rank tracker (AppTweak / MobileAction / AppFollow / Sensor Tower).

**Weeks 1–4 — measure & seed**
- [ ] Launch ASA campaigns (§7) with Discovery ON.
- [ ] First PPO icon test; first In-App Event.
- [ ] Respond to 100% of reviews.

**Weeks 5–8 — iterate**
- [ ] Harvest ASA search-terms; swap the bottom 3–4 performers out of each keyword field (metadata changes ship with an app version — batch them, and **change one variable per release** so you can attribute movement).
- [ ] Promote best-climbing mid-tail terms into a Subtitle; roll out winning PPO creatives.

**Weeks 9–12 — climb**
- [ ] With velocity + ratings up, re-test broader head-term emphasis in subtitles.
- [ ] Monthly In-App Event cadence locked in; second PPO test (screenshot order).

---

## 10. KPIs + keyword watchlist

Track weekly: keyword ranks (below) · Impressions → Product Page Views → Installs conversion · ratings count/velocity/average · D1/D7 retention · ASA tap-through & CPA.

A starter tracking sheet is included in this repo: **`aso-keyword-tracker.csv`**.

*Head (long game):* plant identifier · plant identification · plant app · plant scanner
*Mid (win in 4–8 wks):* flower identifier · tree identifier · weed identifier · mushroom identifier · leaf identifier · plant care · plant disease
*Problem long-tail (win fast, via es-MX field):* yellow leaves · plant sick · dying plant · watering reminder · plant journal · poisonous plant · edible plant
*UK-specific (win fast):* allotment · toadstool · wildflower identifier · hedge plant · lawn weed · meadow flower

---

## 11. Do-not-do list

- ❌ Competitor trademarks in metadata (2.3.7 rejection). ASA bidding on them is fine.
- ❌ Repeating words (or stems) across Name/Subtitle/Keyword fields *within the same storefront's indexed set*.
- ❌ Plurals, spaces, "app", stopwords in keyword fields.
- ❌ Unsubstantiated accuracy/medical/safety claims; always carry the wild-plant/fungi disclaimer.
- ❌ Changing five metadata variables in one release — you'll never know what moved rank.
- ❌ Fake reviews or incentivized installs.

---

### Summary
Own "Plant Identifier" in the **Name**; split your two US-indexed keyword fields so **en-US carries the ID-intent terms** and **es-MX carries the problem/care long-tail**; do the same for the UK with **en-GB (UK-specific terms: allotment, toadstool, hedge, meadow)** + **en-AU (care/disease terms)**. Don't fight PictureThis head-on — take the long-tail and UK gaps it ignores, run a small surgical ASA program to feed velocity and keyword data, grow ratings with a well-timed prompt, and iterate one metadata variable per release. That compounding loop — coverage → conversion → velocity → rank — is how you climb the head term.

**Sources for the cross-localization indexing model:**
[AppTweak — App Store localization: primary & secondary languages](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) · [MobileAction — territory-level keyword indexation](https://www.mobileaction.co/blog/app-store-cross-localization/) · [AppFollow — App Store keywords: countries & localizations](https://appfollow.io/app-store-keywords-localizations) · [aso.dev — cross-localization guide](https://aso.dev/metadata/cross-localization/) · [Apple — App Store localizations reference](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/)
