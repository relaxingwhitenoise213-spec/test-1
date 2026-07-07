#!/usr/bin/env python3
# QA pass for the Quran & Athan app ASO metadata (US, UK, Arabic, Indonesian).
# Verifies Apple hard limits, keyword-field hygiene, duplicate tokens, and computes
# the character budget left for the brand name in the 30-char Title.
import unicodedata, re, sys

SUB, KW, PROMO = 30, 100, 170          # subtitle, keyword field, promo text limits
TITLE = 30                             # title limit (tail + "Brand: ")

DATA = {
    "en-US": {
        "title_tail": "Quran & Athan",
        "subtitle": "Prayer Times, Qibla & Salah",
        "keywords": "azan,adhan,namaz,muslim,islam,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,mosque,compass",
        "promo": "Never miss a prayer. [App] brings accurate Athan and prayer times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion.",
    },
    "en-GB": {
        "title_tail": "Quran & Athan",
        "subtitle": "Prayer Times, Namaz & Qibla",
        "keywords": "azan,adhan,salah,salat,muslim,islam,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,masjid",
        "promo": "Never miss namaz. [App] brings accurate Athan and prayer times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion.",
    },
    "ar": {
        "title_tail": "القرآن والأذان",
        "subtitle": "مواقيت الصلاة، القبلة والأذكار",
        "keywords": "قران,اذان,مسلم,اسلام,دعاء,رمضان,تسبيح,مصحف,تفسير,تلاوة,هجري,تقويم,بوصلة,مسجد,ختمة,زكاة,سبحة,سورة",
        "promo": "لا تفوّت صلاة. [App] يقدّم لك مواقيت الصلاة والأذان بدقة، والقرآن الكريم كاملاً بصوت القرّاء، وبوصلة دقيقة للقبلة. رفيقك المسلم الكامل.",
    },
    "id": {
        "title_tail": "Quran & Adzan",
        "subtitle": "Jadwal Sholat, Kiblat & Doa",
        "keywords": "azan,waktu,shalat,muslim,islami,dzikir,ramadhan,puasa,imsak,murottal,tajwid,kompas,alquran,tasbih",
        "promo": "Jangan lewatkan sholat. [App] menghadirkan jadwal sholat & adzan akurat, Al-Quran lengkap dengan audio, dan kompas arah kiblat. Teman Muslim Anda sehari-hari.",
    },
}

def clen(s):
    return len(unicodedata.normalize("NFC", s))

def toks(s):
    return [t for t in re.split(r"[^\w]+", s, flags=re.UNICODE) if t and not t.isdigit()]

ok = True
for loc, f in DATA.items():
    print(f"\n=== {loc} ===")
    tail = clen(f["title_tail"]); budget = TITLE - tail - 2   # 2 chars for ": "
    print(f"  Title tail '{f['title_tail']}' = {tail} chars  ->  brand name budget: {budget} chars (title = 'Brand: {f['title_tail']}')")
    for field, lim in (("subtitle", SUB), ("keywords", KW), ("promo", PROMO)):
        n = clen(f[field]); flag = "OK " if n <= lim else "!!!"
        if n > lim: ok = False
        print(f"  [{flag}] {field:9} {n:>3}/{lim}")
    if " " in f["keywords"]:
        print("  !!! keyword field contains a SPACE"); ok = False
    all_toks = toks(f["title_tail"]) + toks(f["subtitle"]) + toks(f["keywords"])
    seen, dups = set(), set()
    STOP = {"and","the","to","with","for","dan","la","و","في","ال"}
    for t in all_toks:
        if t in STOP: continue
        if t in seen: dups.add(t)
        seen.add(t)
    if dups:
        print("  !!! DUPLICATE tokens (title/subtitle/keywords):", ", ".join(dups)); ok = False
    else:
        print(f"  no duplicate tokens across title+subtitle+keywords "
              f"({len([t for t in set(all_toks) if t not in STOP])} unique indexed tokens)")

print("\nRESULT:", "ALL GOOD ✅" if ok else "PROBLEMS FOUND ❌")
sys.exit(0 if ok else 1)
