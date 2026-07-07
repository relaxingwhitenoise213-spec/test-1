# Oran — Full ASO Package (US · UK · France · Portugal/Brazil)

App: **AI Chatbot – Oran** · App Store ID `6761107995` · Developer: YACER ABDELAZIZ Y BOUCHEMA
Category: Productivity / Utilities · iOS 16+ · Free with subscriptions (weekly / monthly / yearly)

This folder is a ready-to-paste App Store Optimization (ASO) kit for four markets in
four languages. Everything here is character-counted against Apple's hard limits and
QA-checked by `verify_metadata.py` (run it any time you edit a field).

---

## 1. Why you get 0–5 impressions/day (the diagnosis)

Your impressions are almost zero outside a couple of installs because of **four fixable
problems**, in order of impact:

1. **No local-language listings.** This is the big one. On the App Store, a user in France
   searches *"chatbot IA"*, a user in Brazil searches *"assistente de IA"*. If your listing
   only has **English (U.S.)** metadata, France/Brazil/Portugal fall back to your *English*
   text and you are **not indexed for a single local-language keyword**. Result: ~0 impressions
   in every non-English market. Adding French and Portuguese localizations is the single
   biggest lever you have.
2. **Weak / missing subtitle + keyword field.** The subtitle (30 chars) and the hidden
   keyword field (100 chars) each carry the *same* search weight as each other and together
   are most of your discoverability. If the subtitle is empty or salesy ("Your smart friend")
   and the keyword field isn't filled with 100 useful characters, you're leaving ~130
   indexed characters on the table.
3. **A brand-new app with no ranking signals.** Apple ranks partly on installs, ratings,
   retention and tap-through. A fresh app starts at the bottom for competitive head terms
   ("ai chatbot"). You climb by (a) winning **long-tail** combinations first, and
   (b) accumulating ratings. This kit front-loads long-tail combos so you rank for
   *something* in week one.
4. **The name doesn't do enough keyword work.** "AI Chatbot – Oran" is okay, but the title
   is your highest-weighted field — every token in it should earn its place.

## 2. How Apple search actually works (the 3 rules this kit is built on)

- **Only 3 fields are indexed for search:** the **Title** (highest weight), the **Subtitle**,
  and the **Keyword field**. Plus your developer name and in-app-purchase display names.
  **The description is NOT indexed** on iOS — it's purely for conversion. (This is different
  from Google Play, where the description *is* indexed.)
- **Apple auto-combines single words across all three fields.** You do **not** write phrases.
  Put `image` in one field and `generator` in another and Apple indexes "image generator"
  for you. So we use **single, comma-separated words** and never repeat a word — a repeated
  word gives **zero** extra weight and just wastes space.
- **Each storefront is indexed independently.** Your English (U.K.) keywords don't help the
  U.S. and vice-versa — which is *good news*: it means you get a fresh 30+30+100 characters
  for every locale you add. Use them all.

## 3. Field limits (memorise these)

| Field | Limit | Indexed for search? | Editable without app review? |
|---|---|---|---|
| App Name / Title | **30** | ✅ highest weight | No (needs a version update) |
| Subtitle | **30** | ✅ | No (needs a version update) |
| Keyword field (hidden) | **100** | ✅ | No (needs a version update) |
| Promotional text | **170** | ❌ | **Yes — change anytime** |
| Description | **4000** | ❌ (conversion only) | No (needs a version update) |

## 4. What's in this folder

| File | What it is |
|---|---|
| `keyword-research.md` | Market + competitor analysis and the keyword universe per locale, with rationale. |
| `metadata-en-US.md` | Ready-to-paste United States listing (English U.S.). |
| `metadata-en-GB.md` | Ready-to-paste United Kingdom listing (English U.K.). |
| `metadata-fr-FR.md` | Ready-to-paste France listing (French). |
| `metadata-pt-BR.md` | Ready-to-paste **Brazil** listing (Portuguese – Brazil). |
| `metadata-pt-PT.md` | Ready-to-paste **Portugal** listing (Portuguese – Portugal). |
| `verify_metadata.py` | QA script: checks every field length + duplicate tokens. Run before you submit. |

> **Portuguese — which one?** You said "Portuguese". There are **two separate storefronts**:
> **Brazil** (≈200M people, huge App Store volume — this is where impressions explode fastest)
> and **Portugal** (≈10M). They are independent listings, so I built **both** (`pt-BR` and
> `pt-PT`). If you only do one, **do Brazil first** — it's the bigger win by far.

## 5. How to apply it (App Store Connect, step by step)

1. Go to **App Store Connect → your app → (left) the language dropdown near the top of the
   App Store tab).**
2. For each market, click **+ Add Language** and add: **English (U.K.)**, **French (France)**,
   **Portuguese (Brazil)**, **Portuguese (Portugal)**. (English (U.S.) already exists.)
3. In each language, paste the four fields from that market's file: **Name, Subtitle,
   Promotional Text, Description**, and the **Keywords** field (Keywords lives under the
   *App Information / this version* keyword box).
4. Upload localized **screenshots** (captions are provided in each file — translated screenshots
   convert far better than English ones shown to a French/Brazilian user).
5. Add the **Terms of Use** and **Privacy Policy** URLs where `[your URL]` appears in the
   descriptions — Apple **rejects** auto-renewable-subscription apps without the subscription
   text + these two links. (This kit already includes the required subscription disclosure text.)
6. Submit a new version for review. Keyword/subtitle/title changes only take effect when the
   version is **approved and released**.

## 6. The bonus lever most people miss — Spanish in the U.S.

The **U.S. storefront indexes BOTH English (U.S.) *and* Spanish (Mexico)** metadata. Adding an
**es-MX** localization gives you a *second* title + subtitle + 100-char keyword field that also
ranks in the United States — effectively **doubling** your U.S. keyword coverage and reaching
~40M+ U.S. Hispanic users. It's the highest-ROI extra locale for U.S. impressions. You didn't ask
for Spanish so I didn't build it, but say the word and I'll add `metadata-es-MX.md`.

(Same mechanic elsewhere: Canada indexes English + French, Switzerland indexes German/French/Italian, etc.)

## 7. In-app purchase names are indexed too

Apple indexes your **subscription/IAP display names**. Instead of "Weekly Plan", name them with
keywords, e.g. **"Oran Pro — AI Chat & Images"**, **"Oran Pro — AI Writer & Art"**. Free extra
indexed keywords. (Change in App Store Connect → Subscriptions → Localization.)

## 8. Your first-30-days ranking plan

- **Week 1:** Ship all localizations above. Turn on an in-app **rating prompt** (StoreKit
  `SKStoreReviewController` / `requestReview`) right after a user gets a great answer — ratings
  are a top-3 ranking factor and you're starting from a low base.
- **Week 1–2:** Localize your **screenshots** (biggest driver of impression→install; Apple also
  ranks tap-through). First 2 screenshots matter most.
- **Every ~2–3 weeks:** Re-check which keywords bring impressions (App Store Connect →
  **Analytics → Search terms**, and the free tiers of AppTweak / Appfigures / Sensor Tower).
  Swap out any keyword that isn't converting for a new long-tail one. ASO is iterative — the
  first keyword set is a strong hypothesis, not a one-time job.
- **Ongoing:** Use **Promotional Text** (editable anytime, no review) for campaigns/seasonal hooks.
- **Later:** Add **es-MX** (see §6) and consider **Custom Product Pages** for paid traffic.

## 9. Two things I deliberately did NOT do (so Apple doesn't reject you)

- **No competitor trademarks** in Title/Subtitle/Keywords (no "ChatGPT", "GPT", "Gemini",
  "Claude", "Grok", "DeepSeek", "Copilot"). Apple rejects metadata that uses other brands'
  trademarks (Guideline 4.1 / 5.2), and it can trigger takedowns. Competitors who stuff these
  are risking removal. The descriptions say "the latest AI models" instead — same message, safe.
- **No fake claims / keyword spam** in the description. It's written to convert *and* to pass review.

---

*Run `python3 aso/verify_metadata.py` after any edit — it fails loudly if a field is over the
limit, has a duplicate token, or has a stray space in the keyword field.*
