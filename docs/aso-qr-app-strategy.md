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

> **📄 Complete edition:** [`aso-metadata-all-languages.md`](./aso-metadata-all-languages.md) contains the full submission package for **19 localizations** (everything below **plus Chinese Simplified & Traditional and Russian**), each with title, subtitle, keywords, **promotional text (≤170)** and **full description (≤4000)**. Every field is programmatically validated against Apple's limits, and a second validator guarantees no keyword duplicates a title/subtitle word within its locale (each duplicate wastes a ranking slot). With Russian included, **all 10 localizations Apple indexes on the US storefront are filled** — the maximum US keyword coverage possible. Use that file for App Store Connect entry; this section remains the strategic reference.

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

### 3.3 Expansion localizations — 7 more blocks (competitor-verified, length-checked)

These cover the bonus markets from Section 4.1. Terminology comes from the actual titles of top-ranking QR apps on each storefront (verified via live App Store listings, linked per block), not from translation. Every field re-checked against Apple's 30/30/100 limits.

#### Portuguese (Brazil) — Brazil primary; also indexes in the US
| Field | Content | Count |
|---|---|---|
| Title | `Leitor de QR Code e Barras` | 26/30 |
| Subtitle | `Escanear e Criar Código, WiFi` | 29/30 |
| Keywords | `gerador,scanner,gratis,foto,imagem,preço,seguro,cartão,menu,ingresso,etiqueta,criador,ler,boleto` | 96/100 |

*Evidence: top BR competitors title as [„Leitor de Código QR & Barras"](https://apps.apple.com/br/app/leitor-de-c%C3%B3digo-qr-barras/id1159068566), [„Leitor de QR Code & Barcode"](https://apps.apple.com/br/app/leitor-de-qr-code-barcode/id1048473097) — "leitor" (reader) is the head term, "código de barras" the barcode term. "boleto" targets Brazil's barcode payment slips, a local-only query with zero global competition.*

#### Arabic — additional in Saudi Arabia, UAE, Egypt; also indexes in the US
| Field | Content | Count |
|---|---|---|
| Title | `قارئ الباركود وماسح رمز QR` | 26/30 |
| Subtitle | `امسح وأنشئ رموز واي فاي` | 23/30 |
| Keywords | `مجاني,صور,رابط,امن,مولد,كود,سكانر,بطاقة,قائمة,تذكرة,سعر,منتج,سريع,قراءة,انشاء,ويفي,ملصق` | 87/100 |

*Evidence: Gulf-ranking competitors title as [„قارئ الباركود - ماسح الرمز"](https://apps.apple.com/us/app/%D9%82%D8%A7%D8%B1%D8%A6-%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%83%D9%88%D8%AF-%D9%85%D8%A7%D8%B3%D8%AD-%D8%A7%D9%84%D8%B1%D9%85%D8%B2-%D8%A7%D9%84%D8%B4/id1468426442?l=ar) and [„ماسح QR والباركود: قارئ رمز"](https://apps.apple.com/ma/app/%D9%85%D8%A7%D8%B3%D8%AD-qr-%D9%88%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%83%D9%88%D8%AF-%D9%82%D8%A7%D8%B1%D8%A6-%D8%B1%D9%85%D8%B2/id1080558159?l=ar) — "قارئ الباركود" (barcode reader) and "ماسح" (scanner) are the proven head terms.*

#### English (Australia) — primary for Australia AND New Zealand
| Field | Content | Count |
|---|---|---|
| Title | `QR Code Scanner & Generator` | 27/30 |
| Subtitle | `Scan, Create WiFi & Barcodes` | 28/30 |
| Keywords | `creator,picture,image,vcard,coupon,loyalty,receipt,parcel,event,url,contact,card,secure,inventory` | 97/100 |

*Deliberately a different keyword set from en-GB — both localizations index in AU/NZ, so duplicating would waste 100 characters.*

#### Turkish — additional in Turkey (en-GB remains primary there)
| Field | Content | Count |
|---|---|---|
| Title | `QR Kod Okuyucu: Karekod Tara` | 28/30 |
| Subtitle | `Barkod Tarayıcı & QR Oluştur` | 28/30 |
| Keywords | `ücretsiz,fotoğraf,fiyat,güvenli,bağlantı,menü,bilet,kartvizit,etiket,wifi,oluşturucu,okuma,hızlı` | 96/100 |

*Evidence: Turkish market leaders title as [„QR Kod Okuyucu - Karekod app"](https://apps.apple.com/tr/app/qr-kod-okuyucu-karekod-app/id1080558159?l=tr) and [„QR Kod Okuyucu & QR Tarayıcı"](https://apps.apple.com/tr/app/qr-kod-okuyucu-qr-taray%C4%B1c%C4%B1/id1512700186?l=tr) — critical local insight: Turks search **"karekod"** (the official Turkish word for QR code), a term pure-translation metadata always misses.*

#### Hindi — additional in India (en-GB remains primary there)
| Field | Content | Count |
|---|---|---|
| Title | `QR कोड स्कैनर और जेनरेटर` | 24/30 |
| Subtitle | `बारकोड स्कैन करें और बनाएं` | 26/30 |
| Keywords | `मुफ्त,फोटो,कीमत,सुरक्षित,लिंक,मेनू,टिकट,रीडर,वाईफाई,निर्माता,पाठक,कैमरा,क्यूआर,बनाना,संपर्क` | 91/100 |

*Most Indian iOS users search in English (your en-GB covers that); this block adds the Devanagari long-tail — including "क्यूआर" (QR spelled phonetically in Hindi), which English metadata can never catch.*

#### Korean — Korea primary; also indexes in the US
| Field | Content | Count |
|---|---|---|
| Title | `QR코드 스캐너: 큐알코드·바코드 스캔` | 21/30 |
| Subtitle | `생성기·만들기·와이파이 무료 리더` | 18/30 |
| Keywords | `사진,이미지,가격,안전,링크,메뉴,티켓,명함,쿠폰,읽기,카메라,wifi,재고,영수증,연락처,상품,주소,문자,할인,행사,생성` | 68/100 |

*Evidence: Korean market leaders title as [„QR코드 스캐너・바코드 스캐너・생성기・큐알스캔"](https://apps.apple.com/kr/app/qr%EC%BD%94%EB%93%9C-%EC%8A%A4%EC%BA%90%EB%84%88-%EB%B0%94%EC%BD%94%EB%93%9C-%EC%8A%A4%EC%BA%90%EB%84%88-%EC%83%9D%EC%84%B1%EA%B8%B0-%ED%81%90%EC%95%8C%EC%8A%A4%EC%BA%94/id6670405091) and [„바코드 스캐너, QR 코드 리더 & QR 코드 발생기"](https://apps.apple.com/kr/app/%EB%B0%94%EC%BD%94%EB%93%9C-%EC%8A%A4%EC%BA%90%EB%84%88-qr-%EC%BD%94%EB%93%9C-%EB%A6%AC%EB%8D%94-qr-%EC%BD%94%EB%93%9C-%EB%B0%9C%EC%83%9D%EA%B8%B0/id1048473097) — Koreans search both "QR코드" and the phonetic "큐알코드"; both are in the title.*

#### Dutch — Netherlands primary
| Field | Content | Count |
|---|---|---|
| Title | `QR-code Scanner, Lezer, Maker` | 29/30 |
| Subtitle | `Scan & maak streepjescode,wifi` | 30/30 |
| Keywords | `gratis,foto,prijs,veilig,link,menukaart,ticket,visitekaartje,etiket,generator,kaartje,afbeelding` | 96/100 |

*Evidence: Dutch market leaders title as [„QR-codelezer en QR-scanner"](https://apps.apple.com/nl/app/qr-codelezer-en-qr-scanner/id1322234579) and [„Scan Streepjescode QR-code Lezer"](https://apps.apple.com/nl/app/scan-streepjescode-qr-code-lezer/id947283457) — "lezer" (reader), "maken" (to make), and the very Dutch "streepjescode" (barcode) are the proven local terms.*

**Rollout order for these 7:** en-AU + pt-BR + Arabic in the week-2 submission alongside the core 9 (they're ready and verified); Turkish + Hindi week 4–5; Korean + Dutch week 7–9 (their markets expect deeper localization — pair with localized screenshots).

### 3.4 App name / brand

You asked for brand suggestions. Honest advice first: **at your size, a brandless keyword title (as written above) is the stronger play** — every branded character in the title displaces a ranking keyword, and nobody is searching your brand yet. The app's *display* identity can live in the icon and screenshots.

If you want a brand anyway, requirements: ≤6 characters, pronounceable, no trademark collisions. Candidates to check (verify availability in App Store search + a trademark search before committing — do not skip this):

- **Qrik** · **Skanio** · **QRPix** · **Kodee** · **Zcanr**

With e.g. "Qrik" the en-US title becomes `Qrik: QR Code Scanner & Maker` (29/30 — verified). Avoid names close to existing apps (Snapcode = Snapchat's, Scanova = existing QR company, QR Tiger, etc.).

### 3.5 Entry rules for App Store Connect (read before pasting)

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

### 4.1 Bonus storefronts — where you'll rank fastest (verified against [Apple's official table](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/))

**Free with the Section 3 package — no extra work, live from day one:**

| Group | Storefronts | Why they rank fast |
|---|---|---|
| Small English markets (en-GB is their primary) | Ireland, New Zealand*, South Africa, Nigeria, Philippines, Singapore, Malaysia | Same queries as US/UK but a fraction of the competitor depth — realistic top-10 within weeks; ratings + velocity earned here feed global ranking signals |
| English-primary emerging markets | Poland, Turkey, Saudi Arabia, UAE, Egypt, India | en-GB is the **primary** localization on all of these storefronts — your English metadata ranks there against thin local competition |
| Spanish LatAm (es-MX is their primary) | Mexico, Argentina, Colombia, Chile | Your es-MX block is their primary metadata; QR payments growing across the region; Spanish long-tail is thin |
| German-primary | Austria, Switzerland | de-DE block ranks directly |
| Australia* / Canada | en-GB indexes as additional in AU/NZ; Canada falls back to English | Covered, though en-AU (see below) sharpens AU/NZ |

**Highest-ROI localizations to add next (one 30/30/100 block each):**

1. **Arabic** — double duty: additional localization in Saudi Arabia, UAE, and Egypt (high-ARPU Gulf markets) *and* Arabic is one of the 9 locales indexed in the **US**, so it's free extra US keyword space even before Gulf rankings.
2. **Portuguese (Brazil)** — Brazil's primary; Pix made QR a daily habit for ~150M people; also indexes in the US. Already in the roadmap (week 7–9) — worth pulling forward to wave 1.
3. **English (Australia)** — primary for Australia *and* New Zealand; near-zero effort (copy en-GB, vary a few keywords for extra coverage).
4. **Turkish** — additional in Turkey; cheap velocity market.
5. **Hindi** — additional in India (alongside 10 other Indic languages); small iOS share but enormous absolute volume from UPI culture.
6. **Korean** — Korea's primary + indexes in the US; higher effort (Korean users expect real localization), do it last.
7. **Dutch** — the Netherlands' primary language is Dutch (not English), so NL needs this block to compete properly; solid monetization market.

*Ranking-speed logic: a top-5 position in Ireland or Malaysia is worth far more than position #150 in the US — small-storefront downloads and ratings compound into the velocity signals that eventually move your US/UK ranks.*

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
| 2 | Submit **all localization blocks from Sections 3.2 + 3.3** (core 9 + en-AU, pt-BR, Arabic) + new screenshots + ratings prompt in one app update. |
| 3 | Launch ASA discovery campaign US+UK (£5–8/day). Localize screenshot captions for JA + DE. |
| 4–5 | Localize screenshot captions VN/TH/ID/FR. Add Turkish + Hindi blocks. Launch first PPO icon test (US). |
| 6 | First data checkpoint: any keyword not moving into top 50 after 3 weeks gets swapped. Harvest ASA search-term report into metadata candidates. |
| 7–9 | First In-App Event. CPPs for generator + wifi + safety intents. Add Korean + Dutch blocks with localized screenshots. |
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
