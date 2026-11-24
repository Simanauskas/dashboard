# -*- coding: utf-8 -*-
"""Generuoja RAI Academy taisyklių A3 PDF. Paleidimas: python3 build.py"""
import html
from playwright.sync_api import sync_playwright
from data import POLE, AIR, GENERAL

EXIT = [("💡","Išjunkite visas šviesas","įskaitant LED"),
 ("🎵","Išjunkite muziką","ir aparatūrą"),
 ("❄️","Išjunkite oro kondicionierių","ir kitus klimato įrenginius"),
 ("🧹","Palikite patalpas tvarkingas","inventorius vietoje, šiukšlės išmestos"),
 ("👀","Patikrinkite, ar nieko neliko","sales, koridorių, tualetus"),
 ("🚪","Užrakinkite duris","pagal prie išėjimo pateiktas instrukcijas")]
WARN = ("INVENTORIAUS PAŽEIDIMAI","SUDĖTINGI ELEMENTAI","ČIUŽINIAI","NUSILEIDIMAS","INVENTORIUS")
E = html.escape

def rule(e,t,b):
    w = " warn" if t in WARN else ""
    return f'<div class="rule{w}"><div class="ic">{e}</div><div class="tx"><h3>{E(t)}</h3><p>{E(b)}</p></div></div>'

def group(title, rules, n):
    return f'<section class="grp"><h2><i>{n}</i>{E(title)}</h2>{"".join(rule(*r) for r in rules)}</section>'

def page(d, fs):
    L = "".join(group(*g) for g in d["left"]); R = "".join(group(*g) for g in d["right"])
    gen = "".join(rule(*r) for r in GENERAL)
    ex = "".join(f'<div class="ex"><div class="eic">{e}</div><b>{E(a)}</b><span>{E(b)}</span></div>' for e,a,b in EXIT)
    return f'''<!doctype html><html lang="lt"><meta charset="utf-8"><style>
@page{{size:420mm 297mm;margin:0}}
*{{box-sizing:border-box;margin:0}}
html,body{{width:420mm;height:297mm}}
body{{font-family:'Inter',sans-serif;color:#16213E;background:#fff;display:flex;flex-direction:column;font-size:{fs}pt;overflow:hidden}}
header{{flex:none;height:24mm;padding:0 14mm;display:flex;align-items:center;justify-content:space-between;border-bottom:2.5mm solid #F4A261}}
.brand{{font-weight:800;font-size:18pt;letter-spacing:.3em;color:#F4A261;background:#16213E;padding:3mm 6mm;border-radius:3mm}}
h1{{font-weight:800;font-size:34pt;letter-spacing:-.01em;text-align:right;line-height:1}}
h1 small{{display:block;font-size:11pt;font-weight:600;letter-spacing:.25em;opacity:.7;margin-bottom:1.5mm}}
main{{flex:1 1 0;min-height:0;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:9mm;padding:5mm 14mm 0}}
.col{{display:flex;flex-direction:column;gap:3mm}}
.grp{{display:flex;flex-direction:column;gap:2mm}}
h2{{background:#16213E;color:#fff;font-size:1.25em;font-weight:800;letter-spacing:.06em;padding:1.8mm 4mm;border-radius:2mm;border-left:3mm solid #F4A261;display:flex;align-items:center;gap:3mm}}
h2 i{{font-style:normal;background:#F4A261;color:#16213E;width:7.5mm;height:7.5mm;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.95em}}
.rule{{background:#E8E8E8;border-radius:3mm;padding:1.6mm 3.2mm;display:flex;gap:3.2mm;align-items:center}}
.rule.warn{{border-left:2mm solid #F4A261}}
.ic{{flex:none;width:11mm;height:11mm;border-radius:50%;background:#F4A261;display:flex;align-items:center;justify-content:center;font-size:17pt;font-family:'Noto Color Emoji'}}
.tx h3{{font-size:1em;font-weight:800;letter-spacing:.04em;margin-bottom:.6mm}}
.tx p{{line-height:1.33;font-weight:500}}
.gen{{flex:none;padding:3mm 14mm 0}}
.gen h2{{margin-bottom:2mm}}
.gen .row{{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}}
.gen .rule{{align-items:flex-start;height:100%}}
.gen .ic{{margin-top:.5mm}}
footer{{flex:none;background:#16213E;color:#fff;margin:3.5mm 14mm 9mm;border-radius:4mm;border:1.2mm solid #F4A261;padding:3mm 6mm 3.5mm}}
footer h2{{background:none;border:0;padding:0;color:#F4A261;font-size:16pt;letter-spacing:.07em;margin-bottom:2.5mm}}
.exs{{display:grid;grid-template-columns:repeat(6,1fr);gap:3mm}}
.ex{{background:rgba(255,255,255,.09);border-radius:3mm;padding:2mm 2.5mm;display:grid;grid-template-columns:auto 1fr;column-gap:2.5mm;align-items:center}}
.ex .eic{{grid-row:1/3}}
.eic{{font-size:26pt;line-height:1.15;font-family:'Noto Color Emoji'}}
.ex b{{font-size:10pt;font-weight:800;color:#F4A261;line-height:1.2}}
.ex span{{font-size:8.5pt;opacity:.92;line-height:1.25}}
</style><body>
<header><div class="brand">RAI ACADEMY</div><h1><small>PATALPŲ TAISYKLĖS</small>{E(d["sub"])}</h1></header>
<main><div class="col">{L}</div><div class="col">{R}</div></main>
<section class="gen"><h2><i>4</i>BENDROSIOS PATALPŲ NAUDOJIMO TAISYKLĖS</h2><div class="row">{gen}</div></section>
<footer><h2>🔒 PRIEŠ IŠEIDAMI – PASKUTINIS IŠEINANTIS PATIKRINA:</h2><div class="exs">{ex}</div></footer>
</body></html>'''

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    for d in (POLE, AIR):
        fs = 14.0
        while True:
            pg = b.new_page(viewport={'width':1588,'height':1123})
            pg.set_content(page(d, fs)); pg.wait_for_timeout(300)
            over = pg.evaluate("document.querySelector('main').scrollHeight-document.querySelector('main').clientHeight")
            if over <= 0: break
            pg.close(); fs -= .25
            assert fs > 8
        print(d["file"], "font", fs)
        pg.pdf(path=d["file"], width="420mm", height="297mm", print_background=True, prefer_css_page_size=True)
        pg.close()
