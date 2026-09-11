# Skrajutė: Oro akrobatika ant juostų

A4 skrajutė / plakatėlis oro akrobatikos ant juostų treniruotėms vaikams ir
paaugliams reklamuoti. Visa grafika (siluetai, juostos, scena, šviesos) –
vektorinė, sugeneruota SVG, todėl spausdinama bet kokiu dydžiu be kokybės
praradimo.

## Failai

| Failas | Kam |
|---|---|
| `skrajute-A4.pdf` | Spaudai (A4, 1 puslapis, be paraščių) |
| `skrajute-A4.png` | Socialiniams tinklams ir „Messenger“ (288 dpi) |
| `skrajute.html` | Sugeneruotas šaltinis, atsidaro naršyklėje |
| `build.py` | Generatorius: surenka HTML iš maketo ir grafikos |
| `scene.py` | Siluetų ir juostų SVG piešimas |
| `fonts.css` | Įkeltos „Anton“, „Oswald“, „Montserrat“ (su lietuviškomis raidėmis) |
| `assets/` | Čia dedami `qr.png` ir `logo.png` |

## Kaip įdėti tikrą QR kodą ir logotipą

1. Įkelkite failus į `assets/`:
   - `assets/qr.png` – registracijos QR kodas
   - `assets/logo.png` – RAI Academy logotipas (permatomu fonu)
2. Perkurkite skrajutę:

```bash
cd marketing/oro-akrobatika
python3 build.py
```

Jei `assets/qr.png` nėra, QR vietoje lieka punktyrinis langelis. Jei nėra
`assets/logo.png`, naudojamas vektorinis logotipo atkartojimas.

## Kaip iš naujo sugeneruoti PDF ir PNG

```bash
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
$CH --no-sandbox --hide-scrollbars --window-size=794,1123 \
    --force-device-scale-factor=3 --virtual-time-budget=5000 \
    --screenshot=skrajute-A4.png skrajute.html
$CH --no-sandbox --no-pdf-header-footer --virtual-time-budget=5000 \
    --print-to-pdf=skrajute-A4.pdf skrajute.html
```

Vietoj `$CH` tinka bet koks Chrome ar Chromium. Galima ir tiesiog atsidaryti
`skrajute.html` naršyklėje ir spausdinti į PDF (A4, be paraščių, su fono
grafika).

## Ką lengva pakeisti

- Tekstai – `build.py`, kintamasis `PAGE` (HTML maketas apačioje).
- Spalvos – `TEAL`, `BLUE`, `INK` `build.py` viršuje.
- Figūrų pozos – `scene.py`, žodynas `POSES` (sąnarių koordinatės).
- Juostų padėtis ir dydis – `stage_svg()` funkcija `build.py`.
