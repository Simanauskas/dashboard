# -*- coding: utf-8 -*-
"""RAI Academy – durų užrakinimo instrukcija, A4 portretas. python3 build_a4.py"""
import qrcode, qrcode.image.svg, io, base64
from playwright.sync_api import sync_playwright

URL = "https://www.youtube.com/shorts/rZugShEJiJ0"
qr = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M); qr.add_data(URL); qr.make(fit=True)
img = qr.make_image(fill_color="#16213E", back_color="white"); buf = io.BytesIO(); img.save(buf, format="PNG")
QR = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

N, O, G = "#16213E", "#F4A261", "#E8E8E8"
LED = "#2E9E5B"
def svg(inner): return f'<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">{inner}</svg>'
card = lambda x,y,r=0: f'<g transform="translate({x} {y}) rotate({r})"><rect width="34" height="22" rx="3" fill="{O}" stroke="{N}" stroke-width="2.2"/><rect x="4" y="5" width="9" height="7" rx="1.5" fill="{N}"/><rect x="4" y="15" width="20" height="2.4" rx="1.2" fill="{N}"/></g>'
cyl = lambda cx,cy,led=False: (f'<circle cx="{cx}" cy="{cy}" r="19" fill="{N}"/><circle cx="{cx}" cy="{cy}" r="13" fill="#fff"/><circle cx="{cx}" cy="{cy}" r="5" fill="{N}"/><rect x="{cx-2}" y="{cy}" width="4" height="9" fill="{N}"/>'
  + (f'<circle cx="{cx}" cy="{cy-25}" r="5" fill="{LED}" stroke="{N}" stroke-width="1.6"/><g stroke="{LED}" stroke-width="2" stroke-linecap="round"><path d="M{cx-12} {cy-32}l-4 -4M{cx+12} {cy-32}l4 -4M{cx} {cy-35}v-6"/></g>' if led else ''))
door = f'<rect x="4" y="4" width="112" height="82" rx="4" fill="none" stroke="{N}" stroke-width="2.4" stroke-dasharray="1 0"/>'
ARROW = lambda d: f'<path d="{d}" fill="none" stroke="{O}" stroke-width="4" stroke-linecap="round" marker-end="url(#a)"/>'
DEFS = f'<defs><marker id="a" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="{O}"/></marker></defs>'
ill = {
 1: svg(DEFS + f'<line x1="22" y1="2" x2="22" y2="22" stroke="{N}" stroke-width="2.4" stroke-dasharray="3 3"/><rect x="14" y="2" width="16" height="10" rx="3" fill="{N}"/>' + card(5,24) + ARROW("M42 40 C62 22 70 28 80 40") + cyl(94,52)),
 2: svg(cyl(48,48,True) + f'<g transform="translate(92 48)"><circle r="19" fill="#fff" stroke="{N}" stroke-width="3"/><rect x="-4" y="-25" width="8" height="5" fill="{N}"/><path d="M0 0V-12M0 0L8 5" stroke="{N}" stroke-width="3" stroke-linecap="round"/><text y="33" text-anchor="middle" font-family="Inter" font-weight="800" font-size="13" fill="{N}">30 s</text></g>'),
 3: svg(f'<line x1="22" y1="2" x2="22" y2="22" stroke="{N}" stroke-width="2.4" stroke-dasharray="3 3"/><rect x="14" y="2" width="16" height="10" rx="3" fill="{N}"/>' + card(5,24) + ARROW("M50 35 C60 20 54 14 40 22") + cyl(88,48) + f'<path d="M88 17 A31 31 0 0 1 119 48" fill="none" stroke="{O}" stroke-width="4" stroke-linecap="round" marker-end="url(#a)"/>' + DEFS),
 4: svg(DEFS + f'<rect x="20" y="4" width="46" height="82" rx="3" fill="#fff" stroke="{N}" stroke-width="3"/><rect x="56" y="40" width="14" height="5" rx="2.5" fill="{N}" transform="translate(-6 0)"/><circle cx="50" cy="42" r="3.5" fill="{N}"/>' + ARROW("M80 42 H108") + f'<circle cx="95" cy="68" r="14" fill="{LED}"/><path d="M88 68l5 5 10-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
 5: svg(DEFS + f'<path d="M85 30 A30 30 0 1 0 90 62" fill="none" stroke="{N}" stroke-width="7" stroke-linecap="round"/><path d="M70 26 L96 24 L88 48 z" fill="{N}"/><circle cx="60" cy="46" r="13" fill="{O}"/><text x="60" y="52" text-anchor="middle" font-family="Inter" font-weight="800" font-size="16" fill="{N}">1×</text>'),
}
steps = [
 ("🪪", "Vidinėje pusėje ant durų kabo spynos aktyvavimo kortelė ant sutraukiamo laikiklio. <b>Atidarykite duris ir išėję pritraukite kortelę prie išorėje esančio spynos cilindro išorinės pusės.</b>"),
 ("🟢", '<b class="g">Kortelė aktyvuos spyną ir užsidegs žalias signalas.</b> <u>Spyna bus aktyvi 30 sekundžių</u>'),
 ("🔑", "Per ta laiką turite spėti <b>sugrąžinti kortelę prie laikiklio ir palikti ją kabėti vidinėje durų pusėje, uždaryti duris ir pasukti cilindrą</b> (kaip suktumėte raktą spynoje), <b>kol išgirsite, kad spyna užsirakino.</b>"),
 ("🚪", "<b>Patraukite rankeną ir patikrinkite, ar durys užsirakino.</b>"),
 ("🔄", "<i>Jei nespėjote/nepavyko - <b class='r'>pakartokite procedūrą.</b></i>"),
]
cards = "".join(f'<div class="step"><div class="n">{i}</div><div class="ic">{e}</div><p>{t}</p><div class="il">{ill[i]}</div></div>' for i,(e,t) in enumerate(steps,1))

HTML = f'''<!doctype html><html lang="lt"><meta charset="utf-8"><style>
@page{{size:A4;margin:0}} *{{box-sizing:border-box;margin:0}}
html,body{{width:210mm;height:297mm}}
body{{font-family:'Inter';color:{N};background:#fff;display:flex;flex-direction:column;overflow:hidden;font-size:10.5pt}}
header{{flex:none;height:20mm;padding:0 12mm;display:flex;align-items:center;justify-content:space-between;border-bottom:2.2mm solid {O}}}
.brand{{font-weight:800;font-size:13pt;letter-spacing:.3em;color:{O};background:{N};padding:2.4mm 5mm;border-radius:2.5mm}}
header small{{font-weight:600;font-size:9pt;letter-spacing:.25em;opacity:.7}}
.wrap{{flex:1;display:flex;flex-direction:column;gap:2.8mm;padding:4mm 12mm 7mm;min-height:0}}
h1{{font-weight:800;font-size:23pt;line-height:1.05;letter-spacing:-.01em}}
.last{{background:{N};color:#fff;border-radius:3.5mm;border:1mm solid {O};padding:4mm 5mm;display:flex;gap:4.5mm;align-items:center}}
.last .ic{{background:{O};width:15mm;height:15mm;font-size:24pt}}
.last p{{font-weight:700;font-size:11pt;line-height:1.35}} .last u{{text-decoration-color:{O};text-decoration-thickness:.7mm;text-underline-offset:1mm}}
h2{{background:{N};color:#fff;font-size:12pt;font-weight:800;letter-spacing:.06em;padding:2.4mm 4.5mm;border-radius:2mm;border-left:3mm solid {O}}}
.ic{{flex:none;width:13mm;height:13mm;border-radius:50%;background:{O};display:flex;align-items:center;justify-content:center;font-size:21pt;font-family:'Noto Color Emoji'}}
.steps{{display:flex;flex-direction:column;gap:2.4mm}}
.step{{background:{G};border-radius:3mm;padding:1.8mm 3.2mm;display:flex;align-items:center;gap:3.2mm}}
.step.warn{{border-left:2mm solid {O}}}
.n{{flex:none;width:8mm;height:8mm;border-radius:50%;background:{N};color:{O};font-weight:800;display:flex;align-items:center;justify-content:center;font-size:11pt}}
.step p{{flex:1;line-height:1.38;font-weight:500}}
.step b{{font-weight:800}} .g{{color:{LED}}} .r{{color:#C0392B}} u{{text-decoration-color:{O};text-decoration-thickness:.6mm;text-underline-offset:.8mm}}
.il{{flex:none;width:28mm;height:19mm;background:#fff;border-radius:2.5mm;display:flex;align-items:center;justify-content:center;padding:1.5mm}}
.il svg{{width:100%;height:100%}}
.note{{background:{G};border-left:2mm solid {O};border-radius:3mm;padding:2.4mm 4mm;display:flex;gap:4mm;align-items:center}}
.note p{{line-height:1.4;font-style:italic;font-weight:500}}
.call{{background:{G};border-radius:3mm;padding:2.4mm 4mm;display:flex;gap:4mm;align-items:center}}
.call p{{line-height:1.4;font-style:italic;font-weight:500}} .call b{{font-weight:800;font-style:italic}} .tel{{white-space:nowrap}}
.bottom{{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:6mm}}
.thx b{{display:block;font-size:20pt;font-weight:800}} .thx span{{display:block;font-weight:800;color:{N};opacity:.8;margin-top:1mm;font-size:11pt}}
.vid{{display:flex;align-items:center;gap:5mm;background:{N};color:#fff;border-radius:4mm;border:1mm solid {O};padding:3mm 4.5mm}}
.vid h3{{font-size:15pt;font-weight:800;color:{O};line-height:1.15;max-width:48mm}} .vid .emo{{font-family:'Noto Color Emoji';font-size:24pt;display:block;margin-bottom:1mm}}
.vid img{{width:34mm;height:34mm;background:#fff;padding:2.2mm;border-radius:2mm;image-rendering:pixelated}}
</style><body>
<header><div class="brand">RAI ACADEMY</div><small>PATALPŲ TAISYKLĖS</small></header>
<div class="wrap">
<h1>DURŲ UŽRAKINIMO INSTRUKCIJA</h1>
<div class="last"><div class="ic">🔒</div><p><u>Paskutinis asmuo, išeinantis iš patalpų turi įsitikinti, kad patalpas palieka tvarkingas ir užrakintas.</u> Taip pat patikrinus, ar visur išjungtos šviesos ir kiti elektros prietaisai.</p></div>
<h2>IŠMANIOSIOS SPYNOS NAUDOJIMOSI INSTRUKCIJA</h2>
<div class="steps">{cards}</div>
<div class="note"><div class="ic">⚠️</div><p>Palikus patalpas atrakintas ir įvykus apiplėšimui, atsakingas bus laikomas asmuo, kuris paskutinis naudojosi patalpomis. Įspėjame, kad patalpose yra įrengtos vaizdo stebėjimo kameros, todėl bet kuriuo metu galime patikrinti, kas lankosi patalpose ir ar nėra užsiimama jokia draudžiama veikla</p></div>
<div class="call"><div class="ic">📞</div><p>Jei kyla sunkumų ar neaiškumų dėl spynos naudojimo ar nepavyksta užrakinti, <b>nepalikite patalpų atrakintų</b> - skambinkite <span class="tel">+37068307066</span> arba <span class="tel">+37064149556</span></p></div>
<div class="bottom"><div class="thx"><b>Dėkojame!</b><span>RAI Academy Administracija</span></div>
<div class="vid"><h3><span class="emo">🎬</span>DEMONSTRACINIS VIDEO:</h3><img src="{QR}"></div></div>
</div></body></html>'''

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_page(viewport={'width':794,'height':1123}); pg.set_content(HTML); pg.wait_for_timeout(400)
    print("overflow px:", pg.evaluate("document.querySelector('.wrap').scrollHeight-document.querySelector('.wrap').clientHeight"))
    pg.pdf(path="RAI_Academy_Duru_uzrakinimo_instrukcija_A4.pdf", format="A4", print_background=True, prefer_css_page_size=True)
