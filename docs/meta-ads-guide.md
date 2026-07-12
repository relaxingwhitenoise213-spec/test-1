# Meta Ads Launch Guide — Dropshipping to the USA on $30/day

Product economics assumed from your AliExpress listing: **product cost ≈ $26–31** (use your real landed cost = product + shipping + ~5% buffer; this guide assumes **$30 landed**). Landing page: Shopify. Market: USA. Budget: **$30/day**.

> Note: AliExpress bot-blocks automated access, so the exact product couldn't be opened. Everything below works for any product at this cost level — plug your product's specifics into the Angle Worksheet in section 3.

---

## 1. The math first — know your numbers or you're gambling

At a ~$30 landed cost you are NOT selling an impulse trinket. You need a $70–90 price point, which means a "considered purchase" — your ads and page must justify value, not just create impulse.

| Sell price | Fees (~2.9%+30¢) | Margin before ads | Breakeven CPA | Breakeven ROAS |
|---|---|---|---|---|
| $59.95 | ~$2.04 | ~$27.91 | $27.91 | 2.15 |
| **$79.95** | ~$2.62 | ~$47.33 | **$47.33** | **1.69** |
| $89.95 | ~$2.91 | ~$57.04 | $57.04 | 1.58 |

- **Price at $79.95 with free shipping** (or $84.95 if your page is strong). $59.95 is too thin — typical US dropshipping CPAs run $25–45, you'd be working for Meta.
- Memorize two numbers: **breakeven CPA ≈ $47** and **breakeven ROAS ≈ 1.7**. Every kill/scale decision below references them.
- Lift AOV from day one: "Buy 2, save 15%" bundle, shipping protection at checkout (+$3–4), and a post-purchase upsell (AfterSell/Zipify OCU). Getting AOV from $80 → $95 is the difference between breakeven and profitable at the same CPA.

**Reality check for $30/day in the USA:** purchase-optimized CPMs run ~$25–50. That's ~600–1,200 impressions/day → ~10–18 clicks/day → statistically **~2–4 sales/week** while learning. This budget works, but only if you judge results in 3–4 day windows, not daily, and you don't fragment it across multiple ad sets.

## 2. Foundation (do this before spending $1)

1. **Pixel + Conversions API**: install via the official **Facebook & Instagram app in Shopify**, set data sharing to **Maximum**. This gives you server-side purchase events (CAPI) automatically — non-negotiable for signal quality.
2. **Verify your domain** in Business Manager (Brand Safety → Domains).
3. **Test the funnel**: Events Manager → Test Events → complete a test order. Confirm PageView, ViewContent, AddToCart, InitiateCheckout, Purchase all fire **with values**.
4. **UTMs at the ad level**: `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` — so Shopify reports tell you which ad actually sold.
5. **Fix shipping before scaling**: AliExpress standard = 2–3 weeks to the US. US customers open disputes over that. Move fulfillment to **CJdropshipping / Zendrop / AutoDS private agent** (5–10 day US delivery) as soon as you have consistent sales, and show honest delivery times on the page. Slow shipping kills more dropshipping stores than bad ads do.
6. **New ad account hygiene**: verify the business, add a backup payment method, and don't launch 20 ads on day one — fresh accounts that go from 0 to aggressive get flagged. Start with the structure below and scale gradually.

## 3. Targeting — the 2026 truth from someone who's watched it change

Interest targeting is mostly dead. Meta's delivery system now finds buyers better than any interest stack, **if** you feed it clear creative. Your creative IS the targeting: an ad showing a dog owner using the product tells Meta "dog owners" better than any interest checkbox.

**Your setup:**
- Location: **United States only** (uncheck "people traveling in this location" if you want maximum purchase intent — optional)
- Age: 18–65+ unless the product clearly excludes young buyers (if it's a home/garage/kitchen item, 25–65+ is fine; don't slice thinner)
- Gender: All, unless the product is unambiguously gendered
- Detailed targeting: **EMPTY (broad)** with Advantage+ audience on
- Placements: **Advantage+ placements** (leave it alone)
- Language: leave default

**Angle Worksheet** — answer these 4 questions about your product; they generate your ad angles:
1. WHO buys it? (be specific: "suburban homeowners 30–55", "car guys", "moms of toddlers")
2. What PAINFUL/ANNOYING MOMENT makes them need it? (the scene, not the demographic)
3. What's the "whoa" DEMO moment — the 2 seconds that make someone stop scrolling?
4. What's the #1 OBJECTION? (looks cheap? "does it actually work"? price?)

→ Angle 1 = the pain (problem → agitate → solve). Angle 2 = the demo/wow. Angle 3 = proof/objection killer (reviews, testimonial, "I was skeptical…").

## 4. Campaign structure for exactly $30/day

Do NOT split $30 across multiple ad sets — you'll starve all of them of signal.

```
Campaign: Sales objective  (name: [Product] - Test - US)
└── 1 Ad set — $30/day, broad (as in section 3)
    ├── Optimization: PURCHASE (never Add to Cart / clicks)
    ├── Attribution: 7-day click, 1-day view (default)
    └── 4–6 ads: 3 angles × 1–2 formats
```

- Turn ON Advantage+ creative enhancements except anything that mangles your product image (check previews).
- Schedule the campaign to start **midnight tonight**, not mid-day (even daily pacing).
- Advantage+ Shopping Campaign (ASC) is where winners go when you scale past ~$50–100/day — not where you test at $30/day, because it gives you less read on which creative/angle is working.

## 5. Creative — where 90% of your results come from

**Launch batch (4–6 ads):**
- 3 videos (one per angle): 15–30s, 9:16 vertical, shot-on-phone/UGC look, captions on, hook in the first 2 seconds
- 1–2 statics: clean product shot with a benefit headline, or a "review screenshot" style card (real reviews only)

**Video skeleton that works:** Hook (0–2s: the wow moment or the pain moment, visual + text overlay) → problem in one line → product demo, 2–3 fast benefit shots → social proof line ("30,000+ sold" only if true) → offer + CTA ("50% off launch week — free US shipping").

**Hook bank (fill in your product):**
- "I was today years old when I found out ___ exists"
- "Stop [doing painful thing] like it's 2015"
- "This is why your ___ [fails/hurts/takes forever]"
- "POV: you finally fixed ___ for under $80"
- "I almost didn't buy this because it looked like a gimmick…"
- "3 reasons ___ is blowing up in the US right now"
- Raw demo with a shocked reaction — no words, big text overlay

**Primary text formula:** one scroll-stopping line → 3 benefit bullets (✔) → offer line → link. Write one short version and one 3–4 paragraph mini-story version; let Meta rotate.

**Sourcing creative:** order the product to yourself TODAY (validates quality + shipping too) and film with a phone + CapCut. Or buy 2–3 UGC videos (Billo, Insense, ~$60–150 each). You may remix the supplier's own photos/footage; do NOT rip other stores' ads — that's a fast track to an account ban. Research first: **Meta Ad Library** → search the product name → any competitor ad running 30+ days is a working angle. Model it, don't copy it.

**Compliance (dropshipping accounts die here):** no personal-attribute call-outs ("YOUR back pain" → "back pain"), no health cure claims, no before/after body claims, no fake countdown scarcity, no celebrity footage.

## 6. Kill rules & reading the data ($30/day calibrated)

Give the campaign **72 hours untouched**. Then judge each ad after ~$10–12 of its own spend:

| Signal | Threshold | Action |
|---|---|---|
| Link CTR | < 1% after $10 spend | Kill ad — hook/creative problem |
| CPC (link) | > $2.50 sustained | Kill ad |
| Hook rate (3-sec plays ÷ impressions) | < 25% | Replace the first 2 seconds |
| $15 spent on one ad | 0 add-to-carts | Kill ad |
| ~$47 spent (breakeven CPA) | 0 purchases and < 2 initiate-checkouts | Kill ad |
| 3-day rolling ROAS (whole campaign) | < 1.3 after week 1 with no improving trend | Pause losers, launch a new 3-angle batch |

**Never edit a live ad/ad set (it resets learning).** Kill and launch new ads instead. Keep the campaign alive; swap creatives inside it.

**Diagnosis table:**

| Symptom | Meaning | Fix |
|---|---|---|
| CTR < 1% | Ad is boring | New hooks/angles |
| CTR 1.5%+, almost no ATC | Page or price mismatch with ad promise | Fix congruence, price anchoring, reviews |
| ATCs but no purchases | Checkout friction / shipping shock | Free shipping baked in, express pay buttons, trust badges |
| Sales but ROAS < 1.7 | Economics, not ads | Raise AOV (bundle/upsell), raise price, cut COGS via agent |

Cross-check Ads Manager ROAS against **Shopify orders** (UTMs + a "How did you hear about us?" post-purchase survey once volume grows). Ads Manager over- and under-reports in different windows; Shopify revenue is the truth.

## 7. Scaling path

A **winner** = an ad with 3+ purchases at CPA ≤ ~$47 over 3–4 days.

1. **$30 → $50 → $80/day:** raise the ad set budget **+20–30% every 48–72h** only while 3-day ROAS ≥ 2. Never double overnight at this account size.
2. **At ~$80–100/day:** duplicate the 1–2 winning ads into an **Advantage+ Sales campaign** at $50/day. Keep the original running. ASC becomes your scaler; the original campaign stays your testing lab ($20–30/day, new creative batch weekly).
3. **Horizontal:** new creators/hooks on the winning angle before new angles.
4. **Retargeting:** skip it at $30/day (Advantage+ already covers most of it). Add at $50+/day total: one ad set, $5–8/day, ViewContent+ATC last 14 days, exclude purchasers 180 days, creative = testimonial + objection-killer + honest urgency.

## 8. Landing page checklist (Shopify)

- **Congruence:** the page's first screen repeats the ad's angle and promise. Ad about the "wow demo" → GIF of that demo above the fold.
- Compare-at price anchoring ($129.95 ~~→~~ $79.95), but keep it believable.
- 30+ reviews with customer photos, 4.7–4.9★ (real/imported honestly — 5.0 looks fake).
- GIFs > text. Benefit-led bullets, not spec lists.
- 30-day money-back guarantee, shipping times stated, sticky add-to-cart on mobile, Shop Pay/PayPal/Apple Pay visible.
- Speed: hero image compressed, page loads < 3s on 4G. 90%+ of your traffic is mobile — design for the phone only.
- Bundle offer on the page (Buy 2 save 15%) + post-purchase upsell app.

## 9. Your first 14 days

- **Day 0:** Pixel/CAPI verified, test purchase done, product ordered to your house, 4–6 ads built, campaign scheduled for midnight. 
- **Days 1–3:** Hands off. No edits. Watch hook rate/CTR only.
- **Day 3–4:** First kills per section 6. If everything died: new angle batch (the offer/angle is wrong, not the algorithm).
- **Day 5–7:** 2–4 sales and ≥1 ad with CPA under ~$47 = you have a signal. Kill losers, add 2 new variations of the best hook.
- **Week 2:** ROAS ≥ 2 on 3-day rolling → start +20% budget bumps. ROAS 1.3–1.7 → fix AOV/page before adding budget. ROAS < 1 with 10+ sales' worth of data → the product/offer likely can't clear US CPAs; iterate the offer once, then move on. Kill products, not months.

## 10. The mistakes that kill every $30/day account

1. Splitting $30 across 3+ ad sets ("testing audiences") — you're testing noise.
2. Optimizing for Add to Cart or Link Clicks because purchases are slow. Cheap events, broke business.
3. Editing/restarting campaigns daily. Every touch resets learning.
4. Judging by yesterday instead of the 3-day rolling window.
5. Boosting posts / using the Traffic objective. Sales objective only.
6. Scaling a winner 3x overnight, then panicking when CPA doubles.
7. Ignoring AOV — at breakeven ROAS 1.7, a $15 AOV lift is pure profit.
8. Keeping 2–3 week AliExpress shipping while scaling — chargebacks will freeze your payouts.

---

**TL;DR:** Price at ~$79.95, breakeven CPA ≈ $47 / ROAS ≈ 1.7. One sales campaign, one broad US ad set at $30/day, 4–6 ads across 3 angles. Creative is the targeting. Don't touch anything for 72h, kill by the thresholds, judge on 3-day windows, scale +20% at ROAS ≥ 2, move winners into ASC at $80–100/day, and fix shipping speed before you scale.
