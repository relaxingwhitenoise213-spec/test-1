# ASO Strategy — iOS QR Code App
### Goal: grow from ~15–20 impressions/day to 300–600 impressions/day
*Prepared July 2026 · Target markets: US + UK (primary), with expansion recommendations*

---

## 1. Executive summary

Your app is over a year old and getting 15–20 impressions/day. That number tells us one thing with near certainty: **the app is not ranking in the top 10 for a single keyword that anyone actually types.** At that level, impressions come almost entirely from brand-name searches and accidental browse traffic — not from search rankings.

The good news: 300–600 impressions/day is **not** a moonshot in this category. It does not require beating Gamma Play or TrendMicro on "qr code scanner." It requires ranking top 5–10 on **8–15 mid-volume and long-tail keywords** across **several storefronts**, which is exactly what a disciplined metadata + localization + ratings program achieves in 60–90 days.

The plan has four pillars:

1. **Reposition around what the iPhone camera can't do.** Since iOS 11 the native Camera scans QR codes, so pure "scan" intent is partially dead on iOS. The winning intents are: **generate/create**, **WiFi QR**, **scan from photo/screenshot**, **barcode + price lookup**, **safe/secure scanning** (quishing fear is a real, growing search driver), and **business/bulk use**.
2. **Rebuild metadata for keyword coverage** (title, subtitle, 100-char keyword field), using cross-locale indexing to roughly double indexed keywords per storefront for free.
3. **Localize metadata into ~10 languages** — the single cheapest multiplier available. Each localized storefront is a new pool of impressions where competition on non-English long-tail is dramatically lower.
4. **Fix the ranking-velocity loop**: ratings prompts after successful scans, a small Apple Search Ads discovery budget to bootstrap rankings and harvest real search terms, and metadata iteration every 4–6 weeks.

Realistic trajectory (assuming current baseline and a functional, 4.0+-ratable app):

| Milestone | Timeline | Daily impressions |
|---|---|---|
| Metadata v2 live (US+UK) | Week 2–3 | 40–80 |
| Localization wave 1 (6 locales) live | Week 5–6 | 100–200 |
| Ratings volume + ASA bootstrap compounding | Week 8–10 | 200–400 |
| Metadata v3 (data-driven iteration) | Week 12+ | 300–600+ |

---

## 2. Market analysis

### 2.1 The category

- The global QR code market is ~$13B in 2025, growing ~20% CAGR; over 1 trillion QR scans projected worldwide in 2025, with scans up ~57% YoY across 50 countries ([QR Tiger](https://www.qrcode-tiger.com/qr-code-statistics-2022-q1), [QR Insights](https://www.qr-insights.com/blog/2025-09-19-global-qr-code-adoption-report-2025)).
- In the **US**, ~102.6M smartphone users are projected to scan QR codes in 2026 — roughly 1 in 3 Americans ([Wave Connect](https://wavecnct.com/blogs/qr-code-statistics)).
- In the **UK/Europe**, usage grew ~30% in 2025 ([Scanova](https://scanova.io/blog/qr-code-statistics/)).
- QR **payments** dominate in Asia-Pacific (~60% of global QR payment volume); India's UPI processes ~1.8B QR transactions monthly; Brazil's Pix processed 42B transactions in 2024 ([Juniper Research](https://www.juniperresearch.com/research/fintech-payments/emerging-payments/qr-code-payments-research-report/), [CoinLaw](https://coinlaw.io/qr-code-payments-statistics/)).

### 2.2 The competitive reality on iOS

- Head terms ("qr code scanner", "qr scanner", "qr reader") are dominated by apps with 100M+ installs and hundreds of thousands of ratings (Gamma Play's QR & Barcode Scanner ~500M installs; TrendMicro's safe scanner; Kaspersky; plus Apple's own Camera/Code Scanner in Control Center) ([Uniqode](https://www.uniqode.com/blog/qr-code-basics/best-qr-code-scanner-apps), [Pageloot](https://pageloot.com/blog/best-qr-code-scanning-apps-comparison/)).
- **You will not out-rank these apps on head terms with 15 impressions/day. Don't try yet.** Head terms become reachable only after long-tail rankings build download velocity.
- ASO tool data consistently shows QR mid-tail terms sitting in the "green zone": e.g., "qr code scanner" difficulty ~9, "scan qr code" difficulty ~15 with healthy volume on some indices — meaning **mid-tail and long-tail variants are winnable even for small apps** with correct metadata ([ASOTools case studies](https://asotools.io/app-store-keywords/qr-code-scan), [ASO World case study — a QR scanner app grew visibility 40% through keyword optimization alone](https://asoworld.com/blog/case-study-how-a-qr-scanner-app-increase-40-visibility-by-keyword-optimization/)).

### 2.3 Where the winnable demand is (intent map)

| Intent cluster | Why it's winnable | Example queries |
|---|---|---|
| **Generator / maker** | Native camera can't do it; huge web-search spillover | qr code generator, qr code maker, create qr code, qr creator |
| **WiFi QR** | Airbnb hosts, cafés, offices; specific and underserved | wifi qr code, wifi qr code generator, share wifi |
| **Scan from image** | Native camera can't scan a screenshot | scan qr code from picture, qr from screenshot, scan qr from photo |
| **Barcode + price** | Shopping intent, different competitor set | barcode scanner, price checker, barcode reader |
| **Safety / anti-quishing** | Fast-growing fear-driven searches; TrendMicro validated the niche | safe qr scanner, qr link checker, secure qr reader |
| **Business / formats** | vCard, PDF, tickets, menus, inventory | vcard qr, qr code for business, menu qr code, inventory scanner |

---

## 3. Metadata strategy — US storefront

> Apple indexes: **Title (30 chars, heaviest weight) → Subtitle (30 chars) → Keyword field (100 chars, hidden)**. Never repeat a word across the three — repetition wastes characters and adds nothing. Word *combinations* are formed across fields automatically (e.g., "wifi" in subtitle + "generator" in keywords ⇒ indexed for "wifi generator").

Replace `Brandname` with your actual brand (keep it short — every brand character steals a keyword character).

**Title (≤30):**
```
Brandname: QR Code Scanner ·Gen
```
or if the brand is long, drop to:
```
QR Code Scanner & Generator ·B
```
Core tokens to own in the title: `qr`, `code`, `scanner`, `generator` (or `maker`).

**Subtitle (≤30):**
```
Scan & Create WiFi, Barcode
```
Tokens added: `scan`, `create`, `wifi`, `barcode`.

**Keyword field (100 chars — no spaces after commas, no plurals of already-used words, no "app/free/best" (wasted), no words already in title/subtitle):**
```
maker,reader,creator,photo,picture,screenshot,price,checker,link,safe,vcard,menu,ticket,pdf,inventory
```
(98 chars — verify in App Store Connect.)

**This combination indexes you for (non-exhaustive):** qr code scanner, qr code generator, qr code maker, qr reader, wifi qr code, wifi qr code generator, scan qr code from photo/picture/screenshot, barcode scanner, barcode price checker, safe qr scanner, qr link checker, vcard qr code, menu qr code, ticket scanner, pdf qr code, inventory barcode scanner…

**Free doubling trick (US):** the US storefront also indexes the **Spanish (Mexico)** localization. Fill es-MX title/subtitle/keywords with a *second set* of English keywords you couldn't fit (plus Spanish terms — there are ~40M Spanish speakers in the US):
```
es-MX title:    Escáner QR – Lector de Código
es-MX subtitle: Crear código QR y barras
es-MX keywords: coupon,voucher,label,tag,card,event,url,web,codigo,escanear,generador,lector,barras
```

## 4. Metadata strategy — UK storefront

The UK storefront indexes **English (U.K.)** and also **English (Australia)** — same doubling trick applies.

**en-GB** — mirror the US structure but localize vocabulary where search behaviour differs and use the second locale for a different long-tail set:

```
en-GB title:    Brandname: QR Code Scanner ·Gen
en-GB subtitle: Scan & Create WiFi, Barcode
en-GB keywords: maker,reader,photo,screenshot,price,checker,safe,link,voucher,boarding,pass,ticket,menu
```
```
en-AU keywords: creator,picture,vcard,pdf,inventory,label,event,card,url,secure,parcel,loyalty,receipt
```
UK-specific notes: "voucher" outperforms "coupon"; boarding passes, rail tickets, NHS-era familiarity means UK users have high QR literacy; pub/restaurant menu QR usage remains sticky.

---

## 5. Which markets to target (my recommendation as if my £3,000 depended on it)

**Keep US + UK as your money markets** — highest ad eCPMs and IAP willingness — but understand: they are also the most competitive. The fastest route to your impression goal is **metadata localization into 8–12 storefronts**. It costs almost nothing (metadata-only translation, ~£30–60/locale via a service like AppTweak's or a translator on Upwork; do NOT machine-translate keywords — keyword *research* per locale matters more than translation).

**Tier 1 — do in Wave 1 (weeks 3–5):**

| Market | Locale | Why |
|---|---|---|
| Germany | de-DE | QR usage +30% in 2025, high monetization, weaker local competition on long-tail |
| France | fr-FR | Same profile as DE |
| Spain + LatAm spillover | es-ES (es-MX already done) | One translation covers many storefronts |
| Italy | it-IT | Low competition, decent monetization |
| Brazil | pt-BR | **Pix made QR a daily habit for ~150M people** — enormous volume, modest eCPM but great for download velocity, which lifts your rankings everywhere |
| Mexico | es-MX | Already covered by the US trick; verify keywords are genuinely researched for MX |

**Tier 2 — Wave 2 (weeks 6–9):**

| Market | Locale | Why |
|---|---|---|
| India | en-IN + hi | ~1.8B QR transactions/month via UPI; iOS share is small but absolute numbers are large; strong velocity play |
| Indonesia | id | QRIS national standard; fast-growing iOS base |
| Japan | ja | QR was invented there (Denso Wave); high monetization; requires real native keyword research |
| Turkey | tr | Cheap downloads, good velocity |
| Canada / Australia | en-CA/fr-CA, en-AU | Nearly free (English reuse + fr-CA), decent monetization |

**Skip for now:** China (requires local entity/ICP realities and the payment-app duopoly makes standalone QR apps irrelevant there), South Korea (KakaoPay dominance, high localization bar).

**Expected split of your 300–600 target:** roughly 40–50% US+UK, 25–30% EU locales, 25–30% BR/IN/ID velocity markets.

---

## 6. Conversion assets (impressions are useless if the page doesn't convert)

US App Store average conversion is ~8.6% blended; the impressions→install rate is ~3.8%, and utilities is one of the strongest-converting categories — in North America utility apps hit an IPM of ~12.4 in paid contexts ([AppTweak benchmarks](https://www.apptweak.com/en/aso-blog/average-app-conversion-rate-per-category), [Adapty](https://adapty.io/blog/app-store-conversion-rate/), [Business of Apps](https://www.businessofapps.com/marketplace/app-store-optimization/research/app-store-optimization-statistics/)). Conversion also **feeds back into rankings** — Apple promotes listings that convert.

1. **Icon:** a bold, single QR motif with a scan-line or viewfinder accent. No text in the icon. A/B test via Product Page Optimization (PPO) — icon tests routinely move CVR 5–15%.
2. **Screenshots (first 3 decide everything — they show in search results):**
   - #1: "Scan any QR & barcode instantly" (viewfinder UI)
   - #2: "Create your own QR codes — WiFi, links, vCards" (generator UI)
   - #3: "Scan from photos & screenshots" or "Know before you tap — link safety check"
   - Caption text ≥ 60pt equivalent, readable at thumbnail size; localize captions per storefront.
3. **App preview video:** 15–20s, first 5 seconds = a scan happening. Autoplays muted in search results and materially lifts tap-through.
4. **Promotional text (170 chars, updatable without review):** use for seasonal hooks ("Back to school: share classroom WiFi with one QR").
5. **In-App Events:** run one monthly (e.g., "Safe Scanning Week"). Events get their own search impressions and can surface to lapsed users.
6. **Custom Product Pages:** one CPP per intent cluster (generator, wifi, safety) — pair each with matching Apple Search Ads ad groups.

---

## 7. Ratings & velocity engine

Rankings on iOS are driven by: keyword relevance × download velocity × conversion × rating quality. Metadata alone caps out without the other three.

1. **Ratings prompt (`SKStoreReviewController`)** immediately after the *third successful scan or first successful QR creation* — the peak-satisfaction moment. Never on launch. Target: from whatever you have now to **30+ new ratings/month per major storefront**. Rating count is a visible conversion factor and a ranking input.
2. **Apple Search Ads bootstrap — £150–300/month total (well inside a £3,000 engagement):**
   - One **Discovery/broad campaign** to harvest actual search terms people use to find you (this is your best keyword-research data, better than any tool).
   - Exact-match campaigns on the 6–8 long-tail terms you most want to rank organically; a burst of paid installs on a term reliably lifts organic rank on that term for small apps.
3. **Respond to every review** in money markets, especially ≤3★ — replies measurably improve re-rating behaviour.
4. **Ship an update at least monthly** — release cadence correlates with ranking freshness, and each release lets you iterate keywords.

---

## 8. 90-day roadmap

| Week | Action |
|---|---|
| 1 | Baseline audit: export current keyword rankings (AppTweak/Astro/AppFigures free tiers work), current CVR from App Store Connect → Analytics → Metrics. Screenshot redesign brief. |
| 2 | Submit **Metadata v2** (US en-US + es-MX, UK en-GB + en-AU) + new screenshots + ratings prompt in an app update. |
| 3 | Launch ASA discovery campaign (£5–8/day). Start localization keyword research for Wave 1. |
| 4–5 | Ship **Wave 1 localization** (de, fr, es-ES, it, pt-BR). Launch first PPO icon test. |
| 6 | First data checkpoint: any keyword not moving into top 50 after 3 weeks gets swapped. Harvest ASA search-term report into metadata candidates. |
| 7–9 | **Wave 2 localization** (en-IN/hi, id, ja, tr, en-CA/fr-CA/en-AU). First In-App Event. CPPs for generator + wifi + safety intents. |
| 10 | **Metadata v3** from real ranking data. Second PPO test (screenshots). |
| 11–12 | Double ASA spend only on terms showing organic halo. Review milestone vs. 300–600 target; decide Tier-2 push vs. US head-term push. |

**Cadence forever after:** metadata iteration every 4–6 weeks, one PPO test always running, one In-App Event monthly, keyword rank check weekly.

---

## 9. KPIs & honest expectations

Track weekly (App Store Connect + one ASO tool):

- Impressions/day per storefront (the headline metric)
- Keyword ranks for a fixed tracked set (~40 terms)
- Impression→page-view (tap-through) and page-view→install CVR
- New ratings/week and average rating
- Organic installs/day (the metric that actually pays you)

**Honest caveats:**
- 20×–30× impression growth in 90 days is aggressive but attainable in this category **because the baseline is so low** — the first 10× (to ~150–200/day) is the "easy" part (metadata + localization); the last stretch to 500+ depends on velocity and ratings compounding.
- If the app currently rates below 4.0, fix the causes first — no ASO survives a 3★ average in a category where competitors have 4.6+.
- Native camera cannibalization is real: build the roadmap (and the metadata) around generator/photo-scan/safety features. If the app is scan-only today, **adding a generator is the single highest-ROI product change for ASO** in this category.

---

## Sources

- [ASOTools — "qr code scan" keyword research](https://asotools.io/app-store-keywords/qr-code-scan) · [scan qr code](https://asotools.io/app-store-keywords/scan-qr-code)
- [ASO World — QR scanner app +40% visibility case study](https://asoworld.com/blog/case-study-how-a-qr-scanner-app-increase-40-visibility-by-keyword-optimization/)
- [MobileAction — ASO keyword research 2026](https://www.mobileaction.co/blog/aso-keyword-research/)
- [Uniqode — best QR scanner apps 2026](https://www.uniqode.com/blog/qr-code-basics/best-qr-code-scanner-apps) · [Pageloot comparison](https://pageloot.com/blog/best-qr-code-scanning-apps-comparison/) · [QRCodeKIT](https://qrcodekit.com/news/best-qr-code-readers/)
- [Juniper Research — QR payments 2025–29](https://www.juniperresearch.com/research/fintech-payments/emerging-payments/qr-code-payments-research-report/)
- [Wave Connect — QR statistics 2026](https://wavecnct.com/blogs/qr-code-statistics) · [Scanova](https://scanova.io/blog/qr-code-statistics/) · [CoinLaw — QR payments stats](https://coinlaw.io/qr-code-payments-statistics/) · [QR Insights — 50-country adoption report](https://www.qr-insights.com/blog/2025-09-19-global-qr-code-adoption-report-2025)
- [AppTweak — conversion rate per category](https://www.apptweak.com/en/aso-blog/average-app-conversion-rate-per-category) · [Adapty — App Store CVR benchmarks](https://adapty.io/blog/app-store-conversion-rate/) · [Business of Apps — ASO statistics](https://www.businessofapps.com/marketplace/app-store-optimization/research/app-store-optimization-statistics/)
- [Apple Ads — keyword best practices](https://ads.apple.com/app-store/best-practices/keywords) · [MobileAction — Search Popularity](https://www.mobileaction.co/glossary/what-is-search-popularity-apple-search-ads/)
