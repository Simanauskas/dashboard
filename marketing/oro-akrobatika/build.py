#!/usr/bin/env python3
"""Sugeneruoja A4 skrajute "Oro akrobatika ant juostu" (skrajute.html).

Vizualas - tikra renginio nuotrauka is assets/foto.webp, logotipas is
assets/logo.webp, registracijos QR kodas is assets/qr.png.
"""
import base64, io, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, 'assets')

W, H = 794, 1123            # A4 prie 96 dpi
PHOTO_BAND = 574            # kiek puslapio uzima nuotrauka
COPY_TOP = 590              # kur prasideda teksto blokas

# Nuotraukos iskirpimas: nukerpama tuscia juoda virsune ir grindu atspindys,
# kad apacioje liktu svytinti LED juosta - ji tampa riba tarp vaizdo ir teksto.
PHOTO_CROP_TOP = 139
PHOTO_CROP_BOTTOM = 800

INK = '#05070D'


def data_uri(img, fmt='WEBP', **kw):
    buf = io.BytesIO()
    img.save(buf, fmt, **kw)
    mime = {'WEBP': 'image/webp', 'PNG': 'image/png'}[fmt]
    return 'data:%s;base64,%s' % (mime, base64.b64encode(buf.getvalue()).decode())


def photo_uri():
    im = Image.open(os.path.join(A, 'foto.webp')).convert('RGB')
    im = im.crop((0, PHOTO_CROP_TOP, im.width, PHOTO_CROP_BOTTOM))
    return data_uri(im, 'WEBP', quality=94, method=6)


def logo_uri():
    im = Image.open(os.path.join(A, 'logo.webp')).convert('RGBA')
    im = im.crop(im.getbbox())          # nukerpami tusti pakrasciai
    return data_uri(im, 'PNG')


def qr_uri():
    im = Image.open(os.path.join(A, 'qr.png'))
    im = Image.alpha_composite(Image.new('RGBA', im.size, 'white'),
                               im.convert('RGBA')).convert('RGB')
    return data_uri(im, 'PNG')


def build():
    html = (PAGE
            .replace('__FONTS__', open(os.path.join(HERE, 'fonts.css')).read())
            .replace('__PHOTO__', photo_uri())
            .replace('__LOGO__', logo_uri())
            .replace('__QR__', qr_uri())
            .replace('__BAND__', str(PHOTO_BAND))
            .replace('__COPYTOP__', str(COPY_TOP))
            .replace('__INK__', INK))
    out = os.path.join(HERE, 'skrajute.html')
    open(out, 'w').write(html)
    print('rasyta:', out, os.path.getsize(out) // 1024, 'KB')


PAGE = r'''<!doctype html>
<html lang="lt"><head><meta charset="utf-8">
<title>Oro akrobatika ant juostu - skrajute</title>
<style>
__FONTS__
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
html,body { background:#14161c; }
body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }

.page {
  position:relative; width:794px; height:1123px; overflow:hidden;
  background:__INK__; color:#fff; margin:0 auto; font-family:'Montserrat',sans-serif;
}

/* ---------- nuotrauka ---------- */
.photo {
  position:absolute; top:0; left:0; width:794px; height:__BAND__px;
  object-fit:cover; object-position:50% 0;
}
/* svelnus perejimas i juoda, kad LED juosta liktu matoma */
.fade {
  position:absolute; left:0; top:calc(__BAND__px - 26px); width:794px; height:26px;
  background:linear-gradient(to bottom, rgba(5,7,13,0) 0%, rgba(5,7,13,.55) 55%, __INK__ 100%);
}
/* vinjete, kad krastai susilietu su fonu */
.vignette {
  position:absolute; left:0; top:0; width:794px; height:__BAND__px;
  background:
    linear-gradient(to right, rgba(5,7,13,.72) 0%, rgba(5,7,13,0) 24%, rgba(5,7,13,0) 76%, rgba(5,7,13,.72) 100%),
    linear-gradient(to bottom, rgba(5,7,13,.55) 0%, rgba(5,7,13,0) 22%);
}

/* ---------- logotipas ---------- */
.logo { position:absolute; top:40px; right:52px; z-index:4; }
.logo img { width:208px; height:auto; display:block;
  filter:drop-shadow(0 4px 18px rgba(0,0,0,.85)); }

/* ---------- tekstas ---------- */
.copy { position:absolute; left:56px; right:56px; top:__COPYTOP__px; z-index:4; }
h1 {
  font-family:'Anton',sans-serif; font-weight:400; font-size:76px; line-height:.93;
  letter-spacing:.005em; text-transform:uppercase;
}
h1 .grad {
  background:linear-gradient(92deg,#16B394 0%,#31C3D6 46%,#3B62E8 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.sub {
  margin-top:14px; font-family:'Oswald',sans-serif; font-weight:500; font-size:22px;
  letter-spacing:.115em; text-transform:uppercase; color:#EAF2FF;
}
.place {
  margin-top:12px; font-weight:700; font-size:13.5px; letter-spacing:.17em;
  text-transform:uppercase; color:#A6BCDB;
}
.place .pin { color:#31C3D6; }
.rule {
  margin-top:16px; height:2px;
  background:linear-gradient(90deg,#16B394,#2F4FC8 58%,rgba(47,79,200,0));
}
.groups {
  margin-top:15px; font-family:'Oswald',sans-serif; font-weight:600; font-size:21px;
  letter-spacing:.05em; text-transform:uppercase; color:#fff;
}
.badge {
  margin-top:18px; display:flex; align-items:center; justify-content:center; gap:13px;
  height:58px; border-radius:29px;
  background:linear-gradient(96deg,#12A98C 0%,#1E8FBE 48%,#3350CE 100%);
  box-shadow:0 0 0 1px rgba(255,255,255,.14), 0 14px 40px rgba(28,86,200,.42);
}
.badge b {
  font-family:'Oswald',sans-serif; font-weight:700; font-size:24px; letter-spacing:.045em;
  text-transform:uppercase; color:#fff;
}
.badge .free {
  font-family:'Anton',sans-serif; font-size:28px; letter-spacing:.02em;
  text-transform:uppercase; color:#fff;
}

/* ---------- QR ---------- */
.reg { margin-top:20px; display:flex; align-items:center; gap:20px; }
.qr-card {
  width:120px; height:120px; flex:0 0 120px; border-radius:16px; background:#fff;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 10px 34px rgba(0,0,0,.55);
}
.qr-card img { width:95px; height:95px; display:block; }
.reg-txt h2 {
  font-family:'Anton',sans-serif; font-weight:400; font-size:33px; line-height:1;
  text-transform:uppercase; letter-spacing:.01em;
  background:linear-gradient(92deg,#16B394,#3B62E8);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.reg-txt p {
  margin-top:9px; font-size:14px; line-height:1.5; color:#B9C7DC; max-width:340px;
}
.reg-txt p b { font-weight:700; color:#fff; }
</style></head>
<body>
<div class="page">
  <img class="photo" src="__PHOTO__" alt="">
  <div class="vignette"></div>
  <div class="fade"></div>
  <div class="logo"><img src="__LOGO__" alt="RAI Academy"></div>
  <div class="copy">
    <h1>Oro akrobatika<br><span class="grad">ant juostų</span></h1>
    <div class="sub">Treniruotės vaikams ir paaugliams</div>
    <div class="place"><span class="pin">&#9679;</span>&nbsp; Šiaurės miestelis &nbsp;·&nbsp; Ogmios centras</div>
    <div class="rule"></div>
    <div class="groups">Renkamos naujokų ir pažengusių grupės</div>
    <div class="badge"><b>Pirmas pasibandymas</b><span class="free">Nemokamas!</span></div>
    <div class="reg">
      <div class="qr-card"><img src="__QR__" alt="Registracijos QR kodas"></div>
      <div class="reg-txt">
        <h2>Registracija</h2>
        <p>Nuskenuokite QR kodą telefono kamera ir užpildykite <b>registracijos formą</b>.</p>
      </div>
    </div>
  </div>
</div>
</body></html>'''

if __name__ == '__main__':
    build()
