#!/usr/bin/env python3
# QA pass for the Quran & Athan app ASO metadata (US, UK, Arabic, Indonesian).
# NO-BRAND (descriptive keyword) titles. Verifies Apple hard limits, keyword-field
# hygiene, and duplicate tokens across Title + Subtitle + Keyword field.
import unicodedata, re, sys

TITLE, SUB, KW, PROMO = 30, 30, 100, 170

DATA = {
    "en-US": {
        "title": "Muslim Prayer: Quran & Athan",
        "subtitle": "Namaz, Salah Times & Qibla",
        "keywords": "azan,adhan,islam,islamic,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,mosque,compass,koran",
        "promo": "Never miss a prayer. Get accurate Athan and prayer times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion.",
    },
    "en-GB": {
        "title": "Muslim Prayer: Quran & Athan",
        "subtitle": "Salah, Namaz Times & Qibla",
        "keywords": "azan,adhan,islam,islamic,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,masjid,salat,eid",
        "promo": "Never miss namaz. Get accurate Athan and prayer times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion.",
    },
    "ar": {
        "title": "مسلم: القرآن والأذان والقبلة",
        "subtitle": "مواقيت الصلاة والأذكار والدعاء",
        "keywords": "قران,اذان,اسلام,رمضان,تسبيح,مصحف,تفسير,تلاوة,هجري,تقويم,بوصلة,مسجد,ختمة,زكاة,سبحة,سورة,صيام,يس,مكة",
        "promo": "لا تفوّت صلاة. مواقيت الصلاة والأذان بدقة، والقرآن الكريم كاملاً بصوت القرّاء، وبوصلة دقيقة للقبلة. رفيقك المسلم الكامل كل يوم.",
    },
    "id": {
        "title": "Muslim: Quran & Jadwal Sholat",
        "subtitle": "Adzan, Kiblat, Doa & Dzikir",
        "keywords": "azan,waktu,shalat,islami,ramadhan,puasa,imsak,murottal,tajwid,kompas,alquran,tasbih,hijriah,yasin",
        "promo": "Jangan lewatkan sholat. Jadwal sholat & adzan akurat, Al-Quran lengkap dengan audio, dan kompas arah kiblat. Teman Muslim Anda sehari-hari.",
    },
}

def clen(s): return len(unicodedata.normalize("NFC", s))
def toks(s): return [t for t in re.split(r"[^\w]+", s, flags=re.UNICODE) if t and not t.isdigit()]

ok = True
for loc, f in DATA.items():
    print(f"\n=== {loc} ===")
    for field, lim in (("title", TITLE), ("subtitle", SUB), ("keywords", KW), ("promo", PROMO)):
        n = clen(f[field]); flag = "OK " if n <= lim else "!!!"
        if n > lim: ok = False
        print(f"  [{flag}] {field:9} {n:>3}/{lim}")
    if " " in f["keywords"]:
        print("  !!! keyword field contains a SPACE"); ok = False
    all_toks = toks(f["title"]) + toks(f["subtitle"]) + toks(f["keywords"])
    seen, dups = set(), set()
    STOP = {"and","the","to","with","for","dan","la","و","في","ال"}
    for t in all_toks:
        if t in STOP: continue
        if t in seen: dups.add(t)
        seen.add(t)
    if dups:
        print("  !!! DUPLICATE tokens (title/subtitle/keywords):", ", ".join(dups)); ok = False
    else:
        print(f"  no duplicate tokens ({len([t for t in set(all_toks) if t not in STOP])} unique indexed tokens)")

print("\nRESULT:", "ALL GOOD ✅" if ok else "PROBLEMS FOUND ❌")
sys.exit(0 if ok else 1)
