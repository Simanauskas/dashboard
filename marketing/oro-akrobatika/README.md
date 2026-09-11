# Skrajutė: Oro akrobatika ant juostų

A4 skrajutė / plakatėlis oro akrobatikos ant juostų treniruotėms vaikams ir
paaugliams reklamuoti. Generuojama iš HTML, todėl tekstą ir maketą galima
keisti bet kada ir perkurti PDF bei PNG viena komanda.

## Failai

| Failas | Kam |
|---|---|
| `skrajute-A4.pdf` | Spaudai (A4, 1 puslapis, be paraščių) |
| `skrajute-A4.png` | Socialiniams tinklams ir „Messenger“ (288 dpi) |
| `skrajute.html` | Sugeneruotas šaltinis, atsidaro naršyklėje |
| `build.py` | Generatorius: maketas, nuotraukos apkarpymas, paveikslėlių įkėlimas |
| `fonts.css` | Įkeltos „Anton“, „Oswald“, „Montserrat“ (su lietuviškomis raidėmis) |
| `assets/foto.webp` | Renginio nuotrauka |
| `assets/logo.webp` | RAI Academy logotipas (permatomu fonu) |
| `assets/qr.png` | Registracijos QR kodas |

## Perkūrimas

```bash
cd marketing/oro-akrobatika
python3 build.py

CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
$CH --no-sandbox --hide-scrollbars --window-size=794,1123 \
    --force-device-scale-factor=3 --virtual-time-budget=6000 \
    --screenshot=skrajute-A4.png skrajute.html
$CH --no-sandbox --no-pdf-header-footer --virtual-time-budget=6000 \
    --print-to-pdf=skrajute-A4.pdf skrajute.html
```

Vietoj `$CH` tinka bet koks Chrome ar Chromium. Galima ir tiesiog atsidaryti
`skrajute.html` naršyklėje ir spausdinti į PDF (A4, be paraščių, su fono
grafika).

## Ką lengva pakeisti

- **Tekstai** – `build.py`, kintamasis `PAGE` (HTML maketas apačioje).
- **Nuotrauka** – pakeiskite `assets/foto.webp`. Apkarpymą valdo
  `PHOTO_CROP_TOP` ir `PHOTO_CROP_BOTTOM`: nukerpama tuščia juoda viršūnė ir
  grindų atspindys, kad apačioje liktų šviečianti LED juosta, kuri atskiria
  vaizdą nuo teksto.
- **Vaizdo aukštis** – `PHOTO_BAND`, teksto pradžia – `COPY_TOP`.
- **Spalvos** – gradientai `PAGE` stiliuose, fonas – `INK`.

## Pastabos

- Dabartinė nuotrauka yra 914 × 874 taškų. Per visą A4 plotį tai apie
  110 dpi, todėl spaudoje ji atrodys švelnoka. Jei turite originalą iš
  fotoaparato, įdėkite jį vietoj `assets/foto.webp` ir perkurkite.
- QR kodas skrajutėje užima 32 mm ir nuskaitomas. Užkoduotas adresas –
  `qrto.org/en-unready`. Prieš spausdinant verta patikrinti, ar ta nuoroda
  jau veda į registracijos formą.
