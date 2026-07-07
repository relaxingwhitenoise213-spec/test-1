#!/usr/bin/env python3
# QA pass for the Deen app ASO metadata (US, UK, France, Arabic, Indonesian).
# Brand = "Deen". Verifies Apple hard limits, keyword-field hygiene, and duplicate
# tokens across Title + Subtitle + Keyword field.
import unicodedata, re, sys

TITLE, SUB, KW, PROMO = 30, 30, 100, 170

DATA = {
    "en-US": {
        "title": "Deen: Quran, Athan & Prayer",
        "subtitle": "Muslim Salah Times & Qibla",
        "keywords": "azan,adhan,namaz,islam,islamic,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,mosque,compass",
        "promo": "Deen brings accurate Athan and prayer times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion — free, every day.",
    },
    "en-GB": {
        "title": "Deen: Quran, Athan & Prayer",
        "subtitle": "Muslim Namaz Times & Qibla",
        "keywords": "azan,adhan,salah,salat,islam,islamic,dua,ramadan,hijri,calendar,tasbeeh,dhikr,surah,tajweed,masjid",
        "promo": "Deen brings accurate Athan and namaz times, the full Holy Quran with audio, and a precise Qibla compass. Your complete Muslim companion — free, every day.",
    },
    "fr-FR": {
        "title": "Deen: Coran, Adhan & Prière",
        "subtitle": "Horaires Salat, Qibla & Azan",
        "keywords": "mosquée,ramadan,douaa,dhikr,tasbih,mecque,sourate,tajwid,calendrier,boussole,islam,namaz,invocation",
        "promo": "Deen : horaires de prière et Adhan précis, le Coran en entier avec audio, et une boussole Qibla fiable. Votre compagnon musulman, gratuit, au quotidien.",
    },
    "ar": {
        "title": "دين: القرآن والأذان والقبلة",
        "subtitle": "مواقيت الصلاة والأذكار والدعاء",
        "keywords": "مسلم,قران,اذان,اسلام,رمضان,تسبيح,مصحف,تفسير,تلاوة,هجري,تقويم,بوصلة,مسجد,ختمة,زكاة,سبحة,سورة,صيام",
        "promo": "دين: مواقيت الصلاة والأذان بدقة، والقرآن الكريم كاملاً بصوت القرّاء، وبوصلة دقيقة للقبلة. رفيقك المسلم، مجانًا، كل يوم.",
    },
    "id": {
        "title": "Deen: Quran & Jadwal Sholat",
        "subtitle": "Muslim: Adzan, Kiblat & Doa",
        "keywords": "azan,waktu,shalat,islami,ramadhan,puasa,imsak,murottal,tajwid,kompas,alquran,tasbih,hijriah,dzikir",
        "promo": "Deen: jadwal sholat & adzan akurat, Al-Quran lengkap dengan audio, dan kompas arah kiblat. Teman Muslim Anda, gratis, sehari-hari.",
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
        print("  !!! DUPLICATE tokens:", ", ".join(dups)); ok = False
    else:
        print(f"  no duplicate tokens ({len([t for t in set(all_toks) if t not in STOP])} unique indexed tokens)")

print("\nRESULT:", "ALL GOOD ✅" if ok else "PROBLEMS FOUND ❌")
sys.exit(0 if ok else 1)
