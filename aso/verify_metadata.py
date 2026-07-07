#!/usr/bin/env python3
# QA pass for Oran ASO metadata. Verifies Apple hard limits and duplicate tokens.
import unicodedata, re, sys

LIMITS = {"title": 30, "subtitle": 30, "keywords": 100, "promo": 170}

# locale -> fields
DATA = {
    "en-US": {
        "title": "Oran: AI Chatbot Assistant",
        "subtitle": "Ask Bot: Chat, Write & Art",
        "keywords": "writer,essay,homework,study,grammar,translate,image,generator,voice,pdf,answer,genius,personal,photo",
        "promo": "Meet Oran, your all-in-one AI chatbot. Chat, get instant answers, write anything and create stunning images. 20 free messages every day. Try Oran free!",
    },
    "en-GB": {
        "title": "Oran AI: Chatbot & Assistant",
        "subtitle": "Essay Writer, Art & Images",
        "keywords": "chat,bot,ask,homework,study,grammar,translate,voice,generator,pdf,answer,helper,personal,smart,code",
        "promo": "Meet Oran, your all-in-one AI chatbot and assistant. Ask anything, write faster and create stunning images. 20 free messages a day, no card needed.",
    },
    "fr-FR": {
        "title": "Oran : Chatbot IA Français",
        "subtitle": "Assistant, chat, art & image",
        "keywords": "écrire,traduction,générateur,devoirs,résumé,voix,grammaire,dessin,intelligence,artificielle,réponse",
        "promo": "Oran, votre chatbot IA tout-en-un. Posez vos questions, obtenez des réponses, rédigez et créez des images. 20 messages gratuits par jour. Essayez !",
    },
    "pt-BR": {
        "title": "Oran: Chatbot IA Português",
        "subtitle": "Assistente: chat, arte, imagem",
        "keywords": "brasil,escrever,redação,tradutor,gerador,tarefa,resumo,voz,gramática,desenho,inteligência,artificial",
        "promo": "Oran, seu chatbot de IA tudo-em-um. Pergunte tudo, receba respostas, escreva e crie imagens incríveis. 20 mensagens grátis por dia. Experimente!",
    },
    "pt-PT": {
        "title": "Oran: Chatbot IA Português",
        "subtitle": "Assistente: chat, arte, imagem",
        "keywords": "portugal,escrever,redação,tradutor,gerador,estudo,resumo,voz,gramática,inteligência,artificial,foto",
        "promo": "Oran, o seu chatbot de IA tudo-em-um. Pergunte tudo, receba respostas, escreva e crie imagens. 20 mensagens gratuitas por dia. Experimente!",
    },
}

def clen(s):
    # Apple counts Unicode characters; normalise to NFC so accents are 1 char.
    return len(unicodedata.normalize("NFC", s))

def tokens(s):
    return [t for t in re.split(r"[^0-9A-Za-zÀ-ÿ]+", s.lower()) if t]

ok = True
for loc, f in DATA.items():
    print(f"\n=== {loc} ===")
    for field in ("title", "subtitle", "keywords", "promo"):
        n = clen(f[field]); lim = LIMITS[field]
        flag = "OK " if n <= lim else "!!!"
        if n > lim: ok = False
        print(f"  [{flag}] {field:9} {n:>3}/{lim}")
    # keyword field must have no spaces
    if " " in f["keywords"]:
        print("  !!! keyword field contains a SPACE"); ok = False
    # duplicate token check within title+subtitle+keywords
    toks = tokens(f["title"]) + tokens(f["subtitle"]) + tokens(f["keywords"])
    seen, dups = set(), set()
    STOP = {"de","em","e","a","o","la","le","les","and","the","to","with","for"}
    for t in toks:
        if t in STOP: continue
        if t in seen: dups.add(t)
        seen.add(t)
    print(f"  indexed tokens ({len(set(t for t in toks if t not in STOP))} unique):",
          ", ".join(sorted(set(t for t in toks if t not in STOP))))
    if dups:
        print("  !!! DUPLICATE tokens wasting space:", ", ".join(sorted(dups))); ok = False

print("\nRESULT:", "ALL GOOD ✅" if ok else "PROBLEMS FOUND ❌")
sys.exit(0 if ok else 1)
