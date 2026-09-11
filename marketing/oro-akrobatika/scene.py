"""Vektorines oro akrobatikos siluetu figuros ir juostos (SVG generatorius)."""
import math

# ---------------------------------------------------------------- primitives

def tapered(p1, p2, w1, w2):
    """Kūginė kapsulė tarp dviejų taškų (du apskritimai + liestinių keturkampis)."""
    (x1, y1), (x2, y2) = p1, p2
    r1, r2 = w1 / 2.0, w2 / 2.0
    dx, dy = x2 - x1, y2 - y1
    d = math.hypot(dx, dy)
    out = ['<circle cx="%.2f" cy="%.2f" r="%.2f"/>' % (x1, y1, r1),
           '<circle cx="%.2f" cy="%.2f" r="%.2f"/>' % (x2, y2, r2)]
    if d > abs(r1 - r2) + 1e-6:
        a = math.atan2(dy, dx)
        b = math.acos((r1 - r2) / d)
        pts = []
        for s in (1, -1):
            t = a + s * b
            pts.append((x1 + r1 * math.cos(t), y1 + r1 * math.sin(t)))
            pts.append((x2 + r2 * math.cos(t), y2 + r2 * math.sin(t)))
        poly = [pts[0], pts[1], pts[3], pts[2]]
        out.append('<polygon points="%s"/>' % ' '.join('%.2f,%.2f' % p for p in poly))
    return ''.join(out)


def _extend(a, b, dist):
    ax, ay = a
    bx, by = b
    d = math.hypot(bx - ax, by - ay) or 1.0
    return (bx + (bx - ax) / d * dist, by + (by - ay) / d * dist)


# ---------------------------------------------------------------- the athlete

W = dict(upper=(5.3, 4.3), fore=(4.3, 3.2), hand=(3.2, 1.8),
         thigh=(8.6, 6.2), shin=(6.2, 3.7), foot=(3.7, 1.2))


def athlete(j):
    """Vientisas siluetas iš sąnarių žemėlapio."""
    p = []
    # liemuo, kaklas, galva, kuodas
    p.append(tapered(j['neck'], j['pelvis'], 13.6, 11.2))
    p.append(tapered(j['neck'], j['head'], 4.8, 11.4))
    hx, hy = j['head']
    nx, ny = j['neck']
    d = math.hypot(hx - nx, hy - ny) or 1.0
    ux, uy = (hx - nx) / d, (hy - ny) / d
    p.append('<circle cx="%.2f" cy="%.2f" r="2.9"/>' % (hx + ux * 4.4 - uy * 2.4, hy + uy * 4.4 + ux * 2.4))
    for s in 'LR':
        p.append(tapered(j['neck'], j['sh' + s], 8.6, 5.4))
        p.append(tapered(j['pelvis'], j['hip' + s], 10.2, 8.6))
        p.append(tapered(j['sh' + s], j['el' + s], *W['upper']))
        p.append(tapered(j['el' + s], j['wr' + s], *W['fore']))
        p.append(tapered(j['wr' + s], _extend(j['el' + s], j['wr' + s], 4.2), *W['hand']))
        p.append(tapered(j['hip' + s], j['knee' + s], *W['thigh']))
        p.append(tapered(j['knee' + s], j['ank' + s], *W['shin']))
        p.append(tapered(j['ank' + s], j['toe' + s], *W['foot']))
    return ''.join(p)


POSES = {
    # priekinis špagatas ant juostų, kairė ranka viršuje (kaip nuotraukoje)
    'split': dict(
        pelvis=(0, 0), neck=(1.5, -25), head=(3, -34),
        shL=(-5.5, -23.5), elL=(-8.5, -35.5), wrL=(-9.5, -48),
        shR=(8, -22.5), elR=(18.5, -16.5), wrR=(29, -12),
        hipL=(-5, 2), kneeL=(13, 7.5), ankL=(30, 11), toeL=(36.5, 12.5),
        hipR=(5, 2), kneeR=(-5, 18), ankR=(-13, 33), toeR=(-16.5, 39),
    ),
    # apversta "žvaigždė" — kojos plačiai, galva žemyn
    'invert': dict(
        pelvis=(0, 0), neck=(0, 24), head=(0, 33),
        shL=(-6.5, 22.5), elL=(-11, 11.5), wrL=(-13.5, 0.5),
        shR=(6.5, 22.5), elR=(11, 11.5), wrR=(13.5, 0.5),
        hipL=(-5, -2), kneeL=(-19, -12), ankL=(-32, -21), toeL=(-38, -25),
        hipR=(5, -2), kneeR=(19, -12), ankR=(32, -21), toeR=(38, -25),
    ),
    # kabėjimas ant juostos, viena koja sulenkta
    'hang': dict(
        pelvis=(0, 0), neck=(0, -25), head=(0.5, -34),
        shL=(-6, -23), elL=(-8, -35), wrL=(-8.5, -47),
        shR=(6, -23), elR=(8.5, -35), wrR=(9, -47),
        hipL=(-5, 2), kneeL=(-7, 20), ankL=(-6, 38), toeL=(-6, 44.5),
        hipR=(5, 2), kneeR=(10, 18), ankR=(18, 31), toeR=(21.5, 36),
    ),
    # "mėnulis" — kūnas horizontaliai, kojos sulenktos
    'arch': dict(
        pelvis=(0, 0), neck=(-3, -25), head=(-6, -33.5),
        shL=(-8.5, -22), elL=(-16, -31), wrL=(-24, -39),
        shR=(-4, -24.5), elR=(4, -33), wrR=(11, -41),
        hipL=(-4, 3), kneeL=(11, 10), ankL=(6, 25), toeL=(2, 30),
        hipR=(5, 2.5), kneeR=(20, 6), ankR=(30, 16), toeR=(34, 21),
    ),
}


def figure(pose, x, y, scale, rot=0, opacity=1.0, fill='#000', blur=None):
    f = ' filter="url(#%s)"' % blur if blur else ''
    return ('<g transform="translate(%.1f,%.1f) rotate(%.1f) scale(%.4f)" fill="%s" '
            'fill-opacity="%.3f"%s>%s</g>'
            % (x, y, rot, scale, fill, opacity, f, athlete(POSES[pose])))


# ---------------------------------------------------------------- the silks

def silk(ax, ay, floor, spread, width, grad='silkMain', opacity=1.0, blur=None):
    """Dvi juostos, krentančios nuo ax,ay iki grindų, su audinio klodais apačioje."""
    L = floor - ay
    parts = []
    f = ' filter="url(#%s)"' % blur if blur else ''
    parts.append('<g opacity="%.3f"%s>' % (opacity, f))
    for s in (-1, 1):
        bx = ax + s * spread
        d = ('M %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f'
             % (ax, ay,
                ax + s * spread * 0.06, ay + L * 0.44,
                ax + s * spread * 0.64, ay + L * 0.82,
                bx, floor))
        parts.append('<path d="%s" fill="none" stroke="url(#%s)" stroke-width="%.1f" '
                     'stroke-linecap="round"/>' % (d, grad, width))
        parts.append(_pool(bx, floor, s, width * 3.4, width * 0.62, grad))
    parts.append('</g>')
    return ''.join(parts)


def _pool(px, floor, dirn, w, h, grad):
    p = ('M 0 0 C %.1f %.1f, %.1f %.1f, %.1f %.1f C %.1f %.1f, %.1f %.1f, 0 %.1f Z'
         % (w * 0.22, -h * 1.15, w * 0.68, -h * 0.85, w, -h * 0.1,
            w * 0.74, h * 0.35, w * 0.34, h * 0.75, h * 0.55))
    return ('<g transform="translate(%.1f,%.1f) scale(%d,1)" fill="url(#%s)">'
            '<path d="%s"/></g>' % (px, floor, dirn, grad, p))
