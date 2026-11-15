# Nokia 3310 Retro

Mobiltilpasset retro-webapp med Nokia-inspirert grensesnitt, knapper, flertrykks tekstinntasting, telefonnummer og spillbar Snake II.

## Funksjoner
- Meny og tastatur, inkludert fysisk tastatur på datamaskin
- Snake II-inspirert spill med poeng, kollisjon og omstart
- Skriv SMS med flertrykksknapper, og åpne iOS SMS-komponist med mottaker og tekst
- Ring med `tel:`-lenke
- Lokal telefonbok (kun på denne enheten/nettleseren)

## Viktige iOS-begrensninger
Webappen kan ikke lese innkommende SMS, håndtere innkommende telefonsamtaler eller erstatte iOS-låseskjerm/hjemskjerm. SMS-lenken åpner iOS Meldinger og må bekreftes der. Ringelenken åpner telefonappen. Original Nokia-ringetone er ikke inkludert.

## GitHub Pages
Push til `main`, gå til **Settings → Pages → Build and deployment → Source: GitHub Actions**. Arbeidsflyten publiserer nettstedet. På iPhone: åpne nettsiden i Safari og velg **Del → Legg til på Hjem-skjerm**.

## Lokal test
Åpne `index.html` i nettleser eller kjør `python3 -m http.server 8000` i prosjektmappen.
