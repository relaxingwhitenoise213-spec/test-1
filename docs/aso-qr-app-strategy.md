# ASO Strategy — iOS QR Code App
### Goal: grow from ~15–20 impressions/day to 300–600 impressions/day
*Prepared July 2026 · Target markets: US, UK, Germany, France, Japan, Vietnam, Thailand, Indonesia*

---

## 1. Executive summary

Your app is over a year old and getting 15–20 impressions/day. That number tells us one thing with near certainty: **the app is not ranking in the top 10 for a single keyword that anyone actually types.** At that level, impressions come almost entirely from brand-name searches and accidental browse traffic — not from search rankings.

The good news: 300–600 impressions/day is **not** a moonshot in this category. It does not require beating Gamma Play or TrendMicro on "qr code scanner." It requires ranking top 5–10 on **8–15 mid-volume and long-tail keywords** across **several storefronts**, which is exactly what a disciplined metadata + localization + ratings program achieves in 60–90 days.

The plan has four pillars:

1. **Reposition around what the iPhone camera can't do.** Since iOS 11 the native Camera scans QR codes, so pure "scan" intent is partially dead on iOS. The winning intents are: **generate/create**, **WiFi QR**, **scan from photo/screenshot**, **barcode + price lookup**, **safe/secure scanning** (quishing fear is a real, growing search driver), and **business/bulk use**.
2. **Deploy the verified metadata package in Section 3** — 9 localizations covering all 8 target storefronts, every field pre-checked against Apple's character limits.
3. **Exploit cross-locale indexing** (Section 3.1) — extra localizations index in your target storefronts for free, roughly doubling keyword coverage per market.
4. **Fix the ranking-velocity loop**: ratings prompts after successful scans, a small Apple Search Ads discovery budget to bootstrap rankings and harvest real search terms, and metadata iteration every 4–6 weeks.

Realistic trajectory (assuming current baseline and a functional, 4.0+-ratable app):

| Milestone | Timeline | Daily impressions |
|---|---|---|
| Metadata live: US, UK (en covers VN/TH/ID too) | Week 2–3 | 40–90 |
| DE, FR, JA + local VN/TH/ID localizations live | Week 5–6 | 120–220 |
| Ratings volume + ASA bootstrap compounding | Week 8–10 | 200–400 |
| Metadata v3 (data-driven iteration) | Week 12+ | 300–600+ |

---

## 2. Market analysis

### 2.1 The category

- The global QR code market is ~$13B in 2025, growing ~20% CAGR; over 1 trillion QR scans projected worldwide in 2025, with scans up ~57% YoY across 50 countries ([QR Tiger](https://www.qrcode-tiger.com/qr-code-statistics-2022-q1), [QR Insights](https://www.qr-insights.com/blog/2025-09-19-global-qr-code-adoption-report-2025)).
- In the **US**, ~102.6M smartphone users are projected to scan QR codes in 2026 — roughly 1 in 3 Americans ([Wave Connect](https://wavecnct.com/blogs/qr-code-statistics)).
- In the **UK/Europe**, usage grew ~30% in 2025, with Germany and France on the same curve ([Scanova](https://scanova.io/blog/qr-code-statistics/)).
- **Asia-Pacific** holds ~60% of global QR payment volume. QR is a daily habit across Vietnam (VietQR), Thailand (PromptPay), and Indonesia (QRIS national standard). Japan — where the QR code was invented — combines high QR literacy with the strongest monetization in Asia ([Juniper Research](https://www.juniperresearch.com/research/fintech-payments/emerging-payments/qr-code-payments-research-report/), [CoinLaw](https://coinlaw.io/qr-code-payments-statistics/)).

### 2.2 The competitive reality on iOS

- Head terms ("qr code scanner", "qr scanner", "qr reader") are dominated by apps with 100M+ installs and hundreds of thousands of ratings (Gamma Play's QR & Barcode Scanner ~500M installs; TrendMicro's safe scanner; Kaspersky; plus Apple's own Camera/Code Scanner in Control Center) ([Uniqode](https://www.uniqode.com/blog/qr-code-basics/best-qr-code-scanner-apps), [Pageloot](https://pageloot.com/blog/best-qr-code-scanning-apps-comparison/)).
- **You will not out-rank these apps on head terms with 15 impressions/day. Don't try yet.** Head terms become reachable only after long-tail rankings build download velocity.
- ASO tool data consistently shows QR mid-tail terms sitting in the "green zone": e.g., "qr code scanner" difficulty ~9, "scan qr code" difficulty ~15 with healthy volume on some indices — meaning **mid-tail and long-tail variants are winnable even for small apps** with correct metadata ([ASOTools case studies](https://asotools.io/app-store-keywords/qr-code-scan), [ASO World case study — a QR scanner app grew visibility 40% through keyword optimization alone](https://asoworld.com/blog/case-study-how-a-qr-scanner-app-increase-40-visibility-by-keyword-optimization/)).
- English long-tail competition in **Vietnam, Thailand, and Indonesia** is far thinner than in the US/UK, and local-language competition is thinner still — these storefronts are the fastest impression wins in this plan.

### 2.3 Where the winnable demand is (intent map)

| Intent cluster | Why it's winnable | Example queries |
|---|---|---|
| **Generator / maker** | Native camera can't do it; huge web-search spillover | qr code generator, qr code maker, create qr code |
| **WiFi QR** | Airbnb hosts, cafés, offices; specific and underserved | wifi qr code, wifi qr code generator, share wifi |
| **Scan from image** | Native camera can't scan a screenshot | scan qr code from picture, qr from screenshot |
| **Barcode + price** | Shopping intent, different competitor set | barcode scanner, price checker, barcode reader |
| **Safety / anti-quishing** | Fast-growing fear-driven searches; TrendMicro validated the niche | safe qr scanner, qr link checker, secure qr reader |
| **Business / formats** | vCard, PDF, tickets, menus, inventory | vcard qr, menu qr code, inventory scanner |

---

## 3. Final metadata package — all 8 markets (verified, copy-paste ready)

> **How indexing works:** Apple indexes **Title (30 chars, heaviest weight) → Subtitle (30 chars) → Keyword field (100 chars, hidden)**. Never repeat a word across the three fields of one localization. Word *combinations* form across fields automatically ("wifi" in subtitle + "generator" in keywords ⇒ indexed for "wifi qr generator"). Use only whole words — abbreviations don't index.
>
> **Every string below was programmatically length-checked against Apple's limits (30/30/100).** The count is shown next to each field. Keyword fields use commas with **no spaces after commas** — that is intentional, it saves characters.

### 3.1 Which localization reaches which storefront

Per [Apple's official localization table](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/):

| Storefront | Primary localization | Also indexed |
|---|---|---|
| United States | English (U.S.) | Spanish (Mexico) + 8 more (Arabic, Chinese ×2, French, Korean, Portuguese-BR, Russian, Vietnamese) |
| United Kingdom | English (U.K.) | — (none) |
| Germany | German | English (U.K.) |
| France | French | English (U.K.) |
| Japan | Japanese | English (U.S.) |
| Vietnam | **English (U.K.)** | Vietnamese |
| Thailand | **English (U.K.)** | Thai |
| Indonesia | **English (U.K.)** | Indonesian |

Two consequences you should exploit:
- **Your English (U.K.) metadata works in six storefronts at once** (UK, DE, FR as secondary; VN, TH, ID as primary). It must carry your strongest English keyword set.
- **The US storefront indexes up to 9 extra localizations.** The es-MX block below is mandatory (free ~2× US keyword space); if you want more, fill Portuguese (Brazil) and Korean with additional English long-tail — but only after wave 1 is live.

### 3.2 The 9 localization blocks

#### English (U.S.) — for the US storefront
| Field | Content | Count |
|---|---|---|
| Title | `QR Code Scanner & Generator` | 27/30 |
| Subtitle | `Scan, Create WiFi & Barcodes` | 28/30 |
| Keywords | `maker,reader,photo,picture,screenshot,price,checker,safe,link,vcard,menu,ticket,pdf,label,inventory` | 99/100 |

#### Spanish (Mexico) — extra keywords indexed in the US (+ Mexico storefront)
| Field | Content | Count |
|---|---|---|
| Title | `Escáner QR – Lector de Código` | 29/30 |
| Subtitle | `Crear código QR, barras y WiFi` | 30/30 |
| Keywords | `generador,leer,escanear,gratis,coupon,voucher,event,url,web,tag,creator,business,digital,card` | 93/100 |

*(Mix of Spanish terms for the ~40M US Spanish speakers + leftover English terms that didn't fit in en-US — both index in the US.)*

#### English (U.K.) — for UK + Vietnam + Thailand + Indonesia (primary) and Germany + France (secondary)
| Field | Content | Count |
|---|---|---|
| Title | `QR Code Scanner & Generator` | 27/30 |
| Subtitle | `Scan, Create WiFi & Barcodes` | 28/30 |
| Keywords | `maker,reader,photo,screenshot,price,checker,safe,link,voucher,menu,ticket,pdf,label,boarding,pass` | 97/100 |

#### German — Germany storefront
| Field | Content | Count |
|---|---|---|
| Title | `QR-Code Scanner & Generator` | 27/30 |
| Subtitle | `QR & Barcode lesen, erstellen` | 29/30 |
| Keywords | `leser,wlan,foto,preis,sicher,gutschein,speisekarte,visitenkarte,etikett,kostenlos,link,bild,menü` | 96/100 |

*(Germans search "WLAN", not "wifi"; "QR-Code" with hyphen is correct German orthography; "lesen/erstellen" = read/create, the top German verb queries.)*

#### French — France storefront
| Field | Content | Count |
|---|---|---|
| Title | `Scanner QR Code & Code-Barres` | 29/30 |
| Subtitle | `Lecteur & Créateur QR, WiFi` | 27/30 |
| Keywords | `créer,générateur,gratuit,photo,prix,sécurisé,lien,menu,billet,carte,visite,étiquette,image,wifi` | 95/100 |

*(Covers "lecteur qr code", "créer un qr code", "code-barres", "carte de visite" — the top French intents.)*

#### Japanese — Japan storefront
| Field | Content | Count |
|---|---|---|
| Title | `QRコードリーダー・バーコードスキャナー` | 20/30 |
| Subtitle | `QRコード読み取り・作成、安全チェック` | 19/30 |
| Keywords | `無料,読み込み,写真,画像,スクショ,名刺,クーポン,チケット,在庫,url,リンク,メニュー,生成,wifi,カメラ,ワイファイ,会員証,領収書,価格,商品,連絡先` | 83/100 |

*(Top Japanese queries are 「QRコード読み取り」 and 「QRコードリーダー」 — both fully covered. Keywords add: free, import, photo, image, screenshot, business card, coupon, ticket, inventory, link, menu, generate, wifi (latin + katakana), camera, membership card, receipt, price, product, contacts.)*

#### Vietnamese — extra keywords indexed in Vietnam (on top of your en-GB)
| Field | Content | Count |
|---|---|---|
| Title | `Quét Mã QR & Mã Vạch – Tạo QR` | 29/30 |
| Subtitle | `Tạo QR WiFi, quét từ ảnh` | 24/30 |
| Keywords | `máy,quét,đọc,tạo,miễn phí,hình,giá,an toàn,liên kết,danh thiếp,vé,thẻ,menu,ảnh,mã vạch,wifi,web` | 95/100 |

*(Covers "quét mã qr" (scan QR), "tạo mã qr" (create QR), "mã vạch" (barcode), "quét từ ảnh" (scan from photo), "miễn phí" (free), "an toàn" (safe).)*

#### Thai — extra keywords indexed in Thailand (on top of your en-GB)
| Field | Content | Count |
|---|---|---|
| Title | `สแกน QR & บาร์โค้ด – สร้าง QR` | 29/30 |
| Subtitle | `สแกนคิวอาร์ สร้าง QR WiFi ฟรี` | 29/30 |
| Keywords | `เครื่อง,อ่าน,รูป,ภาพ,ราคา,ปลอดภัย,ลิงก์,เมนู,ตั๋ว,นามบัตร,ฟรี,คิวอาร์โค้ด,สร้าง,ส่วนลด` | 86/100 |

*(Covers "สแกน qr" (scan QR), "สร้าง qr" (create QR), "บาร์โค้ด" (barcode), "คิวอาร์โค้ด" (QR code spelled out in Thai), "ฟรี" (free), "ปลอดภัย" (safe), "ส่วนลด" (discount).)*

#### Indonesian — extra keywords indexed in Indonesia (on top of your en-GB)
| Field | Content | Count |
|---|---|---|
| Title | `Pemindai QR & Barcode: Pembuat` | 30/30 |
| Subtitle | `Pindai & Buat Kode QR, WiFi` | 27/30 |
| Keywords | `pembaca,gratis,foto,gambar,harga,aman,tautan,menu,tiket,kartu,nama,generator,barkod,kode,scan` | 93/100 |

*(Covers "pemindai qr" (QR scanner), "buat kode qr" (create QR), "pembaca" (reader), "kartu nama" (business card), "gratis" (free), "aman" (safe) — QRIS has made QR universal in Indonesia.)*

### 3.3 App name / brand

You asked for brand suggestions. Honest advice first: **at your size, a brandless keyword title (as written above) is the stronger play** — every branded character in the title displaces a ranking keyword, and nobody is searching your brand yet. The app's *display* identity can live in the icon and screenshots.

If you want a brand anyway, requirements: ≤6 characters, pronounceable, no trademark collisions. Candidates to check (verify availability in App Store search + a trademark search before committing — do not skip this):

- **Qrik** · **Skanio** · **QRPix** · **Kodee** · **Zcanr**

With e.g. "Qrik" the en-US title becomes `Qrik: QR Code Scanner & Maker` (29/30 — verified). Avoid names close to existing apps (Snapcode = Snapchat's, Scanova = existing QR company, QR Tiger, etc.).

### 3.4 Entry rules for App Store Connect (read before pasting)

1. Paste keyword fields **exactly as written** — no spaces after commas, no trailing comma.
2. Never add words like *app, free, best, top, iphone* to any keyword field — Apple ignores or already implies them; they waste characters.
3. Metadata changes only go live with an **app version release** — batch all 9 localizations into one submission.
4. Don't repeat a title/subtitle word inside the same localization's keyword field (cross-checking *between* localizations is fine and intended).
5. Keep the **What's New** and description keyword-natural — they don't drive App Store search index (description matters on Google Play, not iOS), so write them for humans and conversion.

---

## 4. Market prioritization within your 8

All 8 markets get metadata from day one (it's one submission). Where to focus *effort beyond metadata* (screenshots captions, ASA spend, review responses):

| Tier | Markets | Role | Screenshot captions localized? |
|---|---|---|---|
| 1 — Money | US, UK, Japan, Germany | Highest eCPM/IAP willingness; ASA spend goes here | Yes, immediately |
| 2 — Volume | Vietnam, Thailand, Indonesia | Fast impression + download velocity wins (thin competition, QR-payment cultures); velocity lifts rankings globally | Yes, wave 2 |
| 3 — Solid | France | Good monetization, moderate competition | Yes, wave 2 |

Expected contribution to the 300–600/day target: roughly 40–45% US+UK, 20–25% JP+DE+FR, 30–35% VN+TH+ID.

---

## 5. Conversion assets (impressions are useless if the page doesn't convert)

US App Store average conversion is ~8.6% blended; the impressions→install rate is ~3.8%, and utilities is one of the strongest-converting categories ([AppTweak benchmarks](https://www.apptweak.com/en/aso-blog/average-app-conversion-rate-per-category), [Adapty](https://adapty.io/blog/app-store-conversion-rate/), [Business of Apps](https://www.businessofapps.com/marketplace/app-store-optimization/research/app-store-optimization-statistics/)). Conversion also **feeds back into rankings** — Apple promotes listings that convert.

1. **Icon:** a bold, single QR motif with a scan-line or viewfinder accent. No text in the icon. A/B test via Product Page Optimization (PPO) — icon tests routinely move CVR 5–15%.
2. **Screenshots (first 3 decide everything — they show in search results):**
   - #1: "Scan any QR & barcode instantly" (viewfinder UI)
   - #2: "Create your own QR codes — WiFi, links, vCards" (generator UI)
   - #3: "Scan from photos & screenshots" or "Know before you tap — link safety check"
   - Caption text ≥ 60pt equivalent, readable at thumbnail size; localize captions per storefront (JA/DE first, then VN/TH/ID/FR).
3. **App preview video:** 15–20s, first 5 seconds = a scan happening. Autoplays muted in search results and materially lifts tap-through.
4. **Promotional text (170 chars, updatable without review):** use for seasonal hooks ("Back to school: share classroom WiFi with one QR").
5. **In-App Events:** run one monthly (e.g., "Safe Scanning Week"). Events get their own search impressions and can surface to lapsed users.
6. **Custom Product Pages:** one CPP per intent cluster (generator, wifi, safety) — pair each with matching Apple Search Ads ad groups.

---

## 6. Ratings & velocity engine

Rankings on iOS are driven by: keyword relevance × download velocity × conversion × rating quality. Metadata alone caps out without the other three.

1. **Ratings prompt (`SKStoreReviewController`)** immediately after the *third successful scan or first successful QR creation* — the peak-satisfaction moment. Never on launch. Target: **30+ new ratings/month per major storefront**.
2. **Apple Search Ads bootstrap — £150–300/month total:**
   - One **Discovery/broad campaign** (US+UK) to harvest actual search terms — better keyword research than any tool.
   - Exact-match campaigns on the 6–8 long-tail terms you most want to rank organically; a burst of paid installs on a term reliably lifts organic rank on that term for small apps. Note: ASA is not available in Vietnam — VN/TH/ID rely on organic velocity, which is fine given the thin competition.
3. **Respond to every review** in Tier-1 markets, especially ≤3★.
4. **Ship an update at least monthly** — each release is also your metadata iteration window.

---

## 7. 90-day roadmap

| Week | Action |
|---|---|
| 1 | Baseline audit: export current keyword rankings (AppTweak/Astro/AppFigures free tiers), current CVR from App Store Connect → Analytics. Screenshot redesign brief. |
| 2 | Submit **all 9 localization blocks from Section 3** + new screenshots + ratings prompt in one app update. |
| 3 | Launch ASA discovery campaign US+UK (£5–8/day). Localize screenshot captions for JA + DE. |
| 4–5 | Localize screenshot captions VN/TH/ID/FR. Launch first PPO icon test (US). |
| 6 | First data checkpoint: any keyword not moving into top 50 after 3 weeks gets swapped. Harvest ASA search-term report into metadata candidates. |
| 7–9 | First In-App Event. CPPs for generator + wifi + safety intents. Add pt-BR + ko localizations as extra US keyword space. |
| 10 | **Metadata v2** from real ranking data (swap under-performers per storefront). Second PPO test (screenshots). |
| 11–12 | Double ASA spend only on terms showing organic halo. Review milestone vs. 300–600 target; decide next push (head terms vs. more storefronts). |

**Cadence forever after:** metadata iteration every 4–6 weeks, one PPO test always running, one In-App Event monthly, keyword rank check weekly.

---

## 8. KPIs & honest expectations

Track weekly (App Store Connect + one ASO tool):

- Impressions/day **per storefront** (the headline metric)
- Keyword ranks for a fixed tracked set (~40 terms across the 8 markets)
- Impression→page-view (tap-through) and page-view→install CVR
- New ratings/week and average rating per storefront
- Organic installs/day (the metric that actually pays you)

**Honest caveats:**
- 20×–30× impression growth in 90 days is aggressive but attainable **because the baseline is so low** — the first 10× (to ~150–200/day) is the "easy" part (metadata + 8 storefronts); the last stretch to 500+ depends on velocity and ratings compounding.
- If the app currently rates below 4.0, fix the causes first — no ASO survives a 3★ average against 4.6★ competitors.
- Native camera cannibalization is real: if the app is scan-only today, **adding a generator is the single highest-ROI product change for ASO** in this category — the metadata above assumes the app can both scan and create; if it can't create yet, tell me and I'll re-cut the keyword sets (and prioritize shipping a basic generator).
- Japanese/Thai/Vietnamese keyword sets above are built from category knowledge and query-pattern research; after 3–4 weeks of live ranking data (or an AppTweak/MobileAction check on those storefronts), expect to swap 2–4 underperforming terms per locale. That iteration is normal and planned (week 6 + week 10).

---

## Sources

- [Apple — official App Store localizations table (primary/additional per country)](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/)
- [AppTweak — cross-localization on the App Store](https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store) · [MobileAction — territory-level keyword indexation](https://www.mobileaction.co/blog/app-store-cross-localization/) · [aso.dev — cross-localization guide](https://aso.dev/metadata/cross-localization/) · [AppFollow — keywords countries & localizations](https://appfollow.io/app-store-keywords-localizations)
- [ASOTools — "qr code scan" keyword research](https://asotools.io/app-store-keywords/qr-code-scan) · [scan qr code](https://asotools.io/app-store-keywords/scan-qr-code)
- [ASO World — QR scanner app +40% visibility case study](https://asoworld.com/blog/case-study-how-a-qr-scanner-app-increase-40-visibility-by-keyword-optimization/)
- [MobileAction — ASO keyword research 2026](https://www.mobileaction.co/blog/aso-keyword-research/)
- [Uniqode — best QR scanner apps 2026](https://www.uniqode.com/blog/qr-code-basics/best-qr-code-scanner-apps) · [Pageloot comparison](https://pageloot.com/blog/best-qr-code-scanning-apps-comparison/) · [QRCodeKIT](https://qrcodekit.com/news/best-qr-code-readers/)
- [Juniper Research — QR payments 2025–29](https://www.juniperresearch.com/research/fintech-payments/emerging-payments/qr-code-payments-research-report/) · [CoinLaw — QR payments stats](https://coinlaw.io/qr-code-payments-statistics/)
- [Wave Connect — QR statistics 2026](https://wavecnct.com/blogs/qr-code-statistics) · [Scanova](https://scanova.io/blog/qr-code-statistics/) · [QR Insights — 50-country adoption report](https://www.qr-insights.com/blog/2025-09-19-global-qr-code-adoption-report-2025)
- [AppTweak — conversion rate per category](https://www.apptweak.com/en/aso-blog/average-app-conversion-rate-per-category) · [Adapty — App Store CVR benchmarks](https://adapty.io/blog/app-store-conversion-rate/) · [Business of Apps — ASO statistics](https://www.businessofapps.com/marketplace/app-store-optimization/research/app-store-optimization-statistics/)
- [Apple Ads — keyword best practices](https://ads.apple.com/app-store/best-practices/keywords)
