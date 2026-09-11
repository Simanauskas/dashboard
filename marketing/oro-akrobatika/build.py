#!/usr/bin/env python3
"""Sugeneruoja A4 skrajute "Oro akrobatika ant juostu" (skrajute.html)."""
import base64, os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S

HERE = os.path.dirname(os.path.abspath(__file__))
W, H = 794, 1123
FLOOR = 426
APEX_Y = -24

TEAL, BLUE, INK = '#13A48B', '#2F4FC8', '#05070D'


# --------------------------------------------------------- juostos geometrija
def _bez(p0, p1, p2, p3, t):
    u = 1 - t
    return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3


def _t_at_y(y):
    lo, hi = 0.0, 1.0
    L = FLOOR - APEX_Y
    for _ in range(40):
        mid = (lo + hi) / 2
        yy = _bez(APEX_Y, APEX_Y + L*0.44, APEX_Y + L*0.82, FLOOR, mid)
        if yy < y:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def ribbon_x(apex_x, spread, side, y):
    """Juostos x koordinate nurodytame aukstyje (side: -1 kaire, +1 desine)."""
    t = _t_at_y(y)
    return _bez(apex_x, apex_x + side*spread*0.06, apex_x + side*spread*0.64,
                apex_x + side*spread, t)


# --------------------------------------------------------------------- scena
def _f(y):
    """Juostos nuokrypio nuo asies dalis (0..1) nurodytame aukstyje."""
    return (ribbon_x(0, 1.0, 1, y))


def fit_hero(apex, pelvis_y, s, pose='split'):
    """Parenka juostos plotį ir figūros x taip, kad ranka ir pėda liestų juostas."""
    j = S.POSES[pose]
    wy = pelvis_y + j['wrL'][1] * s
    ty = pelvis_y + j['toeL'][1] * s
    wdx, tdx = j['wrL'][0] * s, j['toeL'][0] * s
    spread = (tdx - wdx) / (_f(wy) + _f(ty))
    x = apex - spread * _f(wy) - wdx
    return spread, x


def stage_svg():
    d = []
    d.append('<defs>')
    d.append(f'''
  <radialGradient id="haze" cx="50%" cy="4%" r="78%">
    <stop offset="0%" stop-color="#1d4f7a" stop-opacity=".62"/>
    <stop offset="38%" stop-color="#122a52" stop-opacity=".34"/>
    <stop offset="100%" stop-color="{INK}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="spot" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#2f7fae" stop-opacity=".42"/>
    <stop offset="60%" stop-color="#1a3f7d" stop-opacity=".16"/>
    <stop offset="100%" stop-color="#0a1330" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8fd4ff" stop-opacity=".20"/>
    <stop offset="70%" stop-color="#4f8fe0" stop-opacity=".05"/>
    <stop offset="100%" stop-color="#4f8fe0" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="silkMain" gradientUnits="userSpaceOnUse" x1="0" y1="{APEX_Y}" x2="0" y2="{FLOOR}">
    <stop offset="0%" stop-color="#ff3b52"/>
    <stop offset="34%" stop-color="#e01230"/>
    <stop offset="74%" stop-color="#a80a22"/>
    <stop offset="100%" stop-color="#6d0616"/>
  </linearGradient>
  <linearGradient id="silkFar" gradientUnits="userSpaceOnUse" x1="0" y1="{APEX_Y}" x2="0" y2="{FLOOR}">
    <stop offset="0%" stop-color="#c8283c"/>
    <stop offset="60%" stop-color="#8e0d20"/>
    <stop offset="100%" stop-color="#4d0410"/>
  </linearGradient>
  <linearGradient id="led" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#2ec7e8" stop-opacity=".25"/>
    <stop offset="22%" stop-color="#5ad7f0"/>
    <stop offset="52%" stop-color="#8b6cff"/>
    <stop offset="78%" stop-color="#c85ce8"/>
    <stop offset="100%" stop-color="#7b5cff" stop-opacity=".25"/>
  </linearGradient>
  <linearGradient id="reflect" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b5cff" stop-opacity=".26"/>
    <stop offset="45%" stop-color="#3a63d8" stop-opacity=".06"/>
    <stop offset="100%" stop-color="{INK}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="{INK}" stop-opacity="0"/>
    <stop offset="46%" stop-color="{INK}" stop-opacity=".72"/>
    <stop offset="100%" stop-color="{INK}" stop-opacity="1"/>
  </linearGradient>
  <filter id="b2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.6"/></filter>
  <filter id="b5" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="b14" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="b30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>
''')
    d.append('</defs>')

    # fonas + sceninis rukas
    d.append(f'<rect width="{W}" height="{H}" fill="{INK}"/>')
    d.append(f'<rect width="{W}" height="{FLOOR+150}" fill="url(#haze)"/>')
    d.append(f'<ellipse cx="504" cy="286" rx="330" ry="252" fill="url(#spot)"/>')
    d.append(f'<ellipse cx="188" cy="318" rx="198" ry="176" fill="url(#spot)" opacity=".5"/>')

    # sviesos pluostai is virsaus
    for cx, w_top, w_bot, op in ((500, 26, 200, 1.0), (205, 18, 148, .7), (690, 14, 118, .5)):
        d.append('<polygon points="%.0f,%.0f %.0f,%.0f %.0f,%.0f %.0f,%.0f" fill="url(#beam)" '
                 'opacity="%.2f" filter="url(#b14)"/>'
                 % (cx-w_top/2, -30, cx+w_top/2, -30, cx+w_bot/2, FLOOR+8, cx-w_bot/2, FLOOR+8, op))

    # --- juostos ir figuros, nuo tolimiausios iki artimiausios ---
    HERO_Y, HERO_S = 286, 2.5
    h_spread, h_x = fit_hero(520, HERO_Y, HERO_S)
    far = dict(apex=690, spread=54, width=8)
    mid = dict(apex=202, spread=76, width=11)
    hero = dict(apex=520, spread=h_spread, width=16)

    # tolima juosta + maza figura
    d.append(S.silk(far['apex'], APEX_Y, FLOOR, far['spread'], far['width'],
                    grad='silkFar', opacity=.30, blur='b2'))
    fy = 318
    px = ribbon_x(far['apex'], far['spread'], 1, fy - 47 * 0.95) - 0.25 * 0.95
    d.append(S.figure('hang', px, fy, 0.95, opacity=.30, fill='#05070d', blur='b2'))

    # vidurine juosta + figura
    d.append(S.silk(mid['apex'], APEX_Y, FLOOR, mid['spread'], mid['width'],
                    grad='silkFar', opacity=.62, blur='b2'))
    my = 292
    px = ribbon_x(mid['apex'], mid['spread'], -1, my - 47 * 1.45) - 0.25 * 1.45
    d.append(S.figure('hang', px, my, 1.45, opacity=.55, fill='#04060b', blur='b2'))

    # scenos svytejimas uz herojes
    d.append('<ellipse cx="520" cy="284" rx="152" ry="196" fill="#2f7fae" opacity=".20" filter="url(#b30)"/>')

    # pagrindine juosta + herojes figura (spagatas)
    d.append(S.silk(hero['apex'], APEX_Y, FLOOR, hero['spread'], hero['width']))
    d.append(S.figure('split', h_x, HERO_Y, HERO_S, fill='#000'))

    # grindys: LED juosta, atspindys, sesely
    d.append(f'<rect x="0" y="{FLOOR+90}" width="{W}" height="120" fill="{INK}" opacity=".55"/>')
    d.append(f'<rect x="26" y="{FLOOR+4}" width="{W-52}" height="20" fill="url(#led)" '
             f'opacity=".55" filter="url(#b14)"/>')
    d.append(f'<rect x="26" y="{FLOOR+9}" width="{W-52}" height="5" rx="2.5" fill="url(#led)"/>')
    d.append(f'<line x1="30" y1="{FLOOR+11.5}" x2="{W-30}" y2="{FLOOR+11.5}" stroke="#ffffff" '
             f'stroke-opacity=".55" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>')
    d.append(f'<rect x="0" y="{FLOOR+14}" width="{W}" height="78" fill="url(#reflect)"/>')

    # tamsinantis perejimas i teksto bloka
    d.append(f'<rect x="0" y="{FLOOR-6}" width="{W}" height="170" fill="url(#scrim)"/>')
    d.append(f'<rect x="0" y="{FLOOR+164}" width="{W}" height="{H-FLOOR-164}" fill="{INK}"/>')

    return ('<svg class="stage" viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg">%s</svg>'
            % (W, H, ''.join(d)))


# ---------------------------------------------------------------- logotipas
def logo_svg():
    """Tikras zenklas is assets/logo.png, arba vektorinis atkartojimas."""
    lg = os.path.join(HERE, 'assets', 'logo.png')
    if os.path.exists(lg):
        b = base64.b64encode(open(lg, 'rb').read()).decode()
        return ('<div class="logo"><img class="logo-img" '
                'src="data:image/png;base64,%s" alt="RAI Academy"></div>' % b)
    return '''
<div class="logo">
  <div class="logo-mark">RA<span class="logo-i">i</span></div>
  <div class="logo-sub">ACADEMY</div>
</div>'''


def qr_block():
    qr = os.path.join(HERE, 'assets', 'qr.png')
    if os.path.exists(qr):
        b = base64.b64encode(open(qr, 'rb').read()).decode()
        return f'<img class="qr-img" src="data:image/png;base64,{b}" alt="QR">'
    return ('<div class="qr-slot"><span>QR</span><small>assets/qr.png</small></div>')


def build():
    css = open(os.path.join(HERE, 'fonts.css')).read()
    html = PAGE.replace('__FONTS__', css) \
               .replace('__STAGE__', stage_svg()) \
               .replace('__LOGO__', logo_svg()) \
               .replace('__QR__', qr_block())
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
html,body { background:#1a1c22; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page {
  position:relative; width:794px; height:1123px; overflow:hidden;
  background:#05070D; color:#fff; margin:0 auto;
  font-family:'Montserrat',sans-serif;
}
.stage { position:absolute; inset:0; width:794px; height:1123px; display:block; }

/* ---------- logotipas ---------- */
.logo { position:absolute; top:34px; left:0; right:0; text-align:center; z-index:3; }
.logo-img { height:86px; width:auto; display:inline-block; }
.logo-mark {
  font-family:'Montserrat',sans-serif; font-weight:300; font-size:55px; line-height:1;
  letter-spacing:.04em;
  background:linear-gradient(178deg,#16B394 0%,#1E8FA8 42%,#2F4FC8 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.logo-i { font-weight:300; }
.logo-sub {
  margin-top:6px; font-weight:600; font-size:11px; letter-spacing:.62em;
  text-indent:.62em; color:#3355CE;
}

/* ---------- tekstas ---------- */
.copy { position:absolute; left:56px; right:56px; top:520px; z-index:3; }
h1 {
  font-family:'Anton',sans-serif; font-weight:400; font-size:79px; line-height:.93;
  letter-spacing:.005em; text-transform:uppercase;
}
h1 .grad {
  background:linear-gradient(92deg,#16B394 0%,#31C3D6 46%,#3B62E8 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.sub {
  margin-top:15px; font-family:'Oswald',sans-serif; font-weight:500; font-size:22px;
  letter-spacing:.115em; text-transform:uppercase; color:#EAF2FF;
}
.place {
  margin-top:13px; font-weight:700; font-size:13.5px; letter-spacing:.17em;
  text-transform:uppercase; color:#A6BCDB;
}
.place .pin { color:#31C3D6; }
.rule {
  margin-top:18px; height:2px; width:100%;
  background:linear-gradient(90deg,#16B394,#2F4FC8 58%,rgba(47,79,200,0));
}
.groups {
  margin-top:17px; font-family:'Oswald',sans-serif; font-weight:600; font-size:21px;
  letter-spacing:.05em; text-transform:uppercase; color:#fff;
}
.badge {
  margin-top:19px; display:flex; align-items:center; justify-content:center; gap:13px;
  height:62px; border-radius:31px;
  background:linear-gradient(96deg,#12A98C 0%,#1E8FBE 48%,#3350CE 100%);
  box-shadow:0 0 0 1px rgba(255,255,255,.14), 0 14px 40px rgba(28,86,200,.42);
}
.badge b {
  font-family:'Oswald',sans-serif; font-weight:700; font-size:25px; letter-spacing:.045em;
  text-transform:uppercase; color:#fff;
}
.badge .free {
  font-family:'Anton',sans-serif; font-size:29px; letter-spacing:.02em; color:#fff;
  text-transform:uppercase;
}

/* ---------- QR ---------- */
.reg { margin-top:22px; display:flex; align-items:center; gap:21px; }
.qr-card {
  width:128px; height:128px; flex:0 0 128px; border-radius:17px; background:#fff;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 10px 34px rgba(0,0,0,.55);
}
.qr-img { width:109px; height:109px; display:block; image-rendering:pixelated; }
.qr-slot {
  width:109px; height:109px; border:2px dashed #9AA6BC; border-radius:10px; color:#66748C;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
}
.qr-slot span { font-family:'Anton',sans-serif; font-size:26px; color:#39475F; }
.qr-slot small { font-size:8px; letter-spacing:.03em; text-align:center; line-height:1.3; }
.reg-txt { padding-top:2px; }
.reg-txt h2 {
  font-family:'Anton',sans-serif; font-weight:400; font-size:34px; line-height:1;
  text-transform:uppercase; letter-spacing:.01em;
  background:linear-gradient(92deg,#16B394,#3B62E8);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.reg-txt p {
  margin-top:9px; font-weight:400; font-size:14px; line-height:1.5; color:#B9C7DC;
  max-width:330px;
}
.reg-txt p b { font-weight:700; color:#fff; }
</style></head>
<body>
<div class="page">
  __STAGE__
  __LOGO__
  <div class="copy">
    <h1>Oro akrobatika<br><span class="grad">ant juostų</span></h1>
    <div class="sub">Treniruotės vaikams ir paaugliams</div>
    <div class="place"><span class="pin">&#9679;</span>&nbsp; Šiaurės miestelis &nbsp;·&nbsp; Ogmios centras</div>
    <div class="rule"></div>
    <div class="groups">Renkamos naujokų ir pažengusių grupės</div>
    <div class="badge"><b>Pirmas pasibandymas</b><span class="free">Nemokamas!</span></div>
    <div class="reg">
      <div class="qr-card">__QR__</div>
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
