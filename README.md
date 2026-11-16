# Nokia 3310 – webrekonstruksjon

Mobiltilpasset, monokrom Nokia-inspirert simulator for iPhone og andre telefoner. Kjøres helt lokalt i nettleseren uten server eller innlogging.

## Funksjoner
- 84 × 48 pikslers LCD-canvas med oppskalert, skarp pikselgrafikk
- Navi-meny, C-knapp, opp/ned, tastatur og flertrykks tekstinntasting
- Snake II-inspirert spill med 2/4/6/8
- Lokale kontakter, huskelapper og utboks lagret på enheten
- `tel:` for å åpne iPhones ringefunksjon og `sms:` for å åpne Apples SMS-komponering
- Enkel lydsimulering via Web Audio

## Viktige iOS-begrensninger
Webapper kan ikke motta eller lese iPhones SMS, overta innkommende samtaler, erstatte iOS-telefonappen, tvinge systemets ringelyd eller fjerne iOS-funksjoner. En SMS åpnes i Apples meldingsapp og må bekreftes av brukeren. Utboks her er bare en lokal kladdhistorikk, **ikke** bekreftelse på sendt melding. Kontakter i simulatoren er ikke synkronisert med iOS-kontakter.

## Publisering
Legg `index.html`, `style.css`, `app.js`, `manifest.webmanifest` og `.github/workflows/pages.yml` i repoets rot og velg **Settings → Pages → GitHub Actions**. Åpne publisert side i Safari og bruk **Del → Legg til på Hjem-skjerm**.

## Status
Dette er en rekonstruksjon under utvikling, ikke en pikselperfekt kopi av original firmware. Flere menyvalg er demonstrasjoner eller utilgjengelige. Ringetoner er syntetiserte og ikke originalopptak.

## Versjon 0.8 – meny og iPhone-overlevering

- Kontaktliste med handlingene Ring, Send SMS, Rediger og Slett.
- Telefoninnstillinger med lagret velkomstmelding og valg for automatisk tastelås (innstillingen lagres, men automatisk tidsutløst låsing er ikke implementert).
- Valg for anropsvarsling og vibrering lagres lokalt. Webappen kan ikke overta iOS' faktiske ringe- eller vibrasjonsinnstillinger.
- Profil og tastelydvalg lagres lokalt.
- Innboks og anropslogg kan ikke leses fra iOS av en vanlig webapp.
- Testene er automatiske røyk-/syntakstester, ikke en historisk eller fysisk iPhone-verifikasjon.


## Versjon 0.9
- Lange menytekster ruller på 84 × 48 LCD.
- SMS-komponering lagrer en lokal kladd før iOS Meldinger åpnes. Dette er **ikke** bekreftelse på sending.
- Snake II pauses når webappen legges i bakgrunnen, og kan startes på nytt etter tap.
- Valgfri kort vibrasjon ved tastetrykk på enheter som støtter Vibration API (iOS Safari støtter normalt ikke dette).
- Hyppigere LCD-oppdatering for klokke og menyrulling.

Begrensninger: En PWA kan ikke lese iPhone-SMS, motta samtaler inne i appen eller overstyre systemringetonen. Designet er en rekonstruksjon, ikke en dokumentert pikselperfekt kopi av Nokia 3310.

## Versjon 1.0, rekonstruksjonsarbeid

- LCD-statusindikatorene er nå tegnet som piksler, i stedet for å være avhengige av Unicode-symboler som varierer mellom iPhone-versjoner.
- Menyvalg har tydelig invertert markering og scrollbar innenfor 84 × 48 piksler.
- Hold `0` inne i nummerfeltet for å skrive `+` til internasjonale numre.
- Kontakt-, notat- og kladdelagring håndterer nå også ugyldige lagrede datastrukturer.
- Forbedret skjermrammens materialeffekt, tastaturfokus og tilgjengelighet.
- Tester er utvidet med kontroller for disse egenskapene.

### Viktige begrensninger

Dette er fortsatt en simulator og **ikke en dokumentert piksel-for-piksel kopi** av en fysisk Nokia 3310. Ringetonene er syntetiserte tilnærminger, og flere menyvalg er demonstrasjoner eller mangler implementasjon. Safari tillater ikke at en webapp leser iPhones SMS-innboks, tar imot mobilanrop eller erstatter låseskjermen. `tel:` og `sms:` åpner systemfunksjoner og krever brukerens videre handling. Automatisk GitHub Actions-kontroll tester kode, ikke fysisk iPhone eller historisk autentisitet.

## Versjon 1.1: bitmap-LCD
- LCD-tekst rendres med en fast 5×7 pikselfont på 84×48-rutenettet. Dette reduserer forskjeller mellom Safari og andre nettlesere.
- Norske tegn Æ, Ø og Å er inkludert.
- Menytekster tegnes som inverterte bitmap-piksler med horisontal rulling ved lange navn.
- Grunnleggende syntaks- og regresjonstester kan kjøres med `node --check app.js && node tests/smoke.cjs`.

**Begrensninger:** Dette er en egen rekonstruert pikselfont, ikke dokumentert identisk med Nokias originale font. Webappen kan ikke lese innkommende SMS, overta telefonens ringeskjerm eller blokkere iOS-funksjoner. Test på fysisk iPhone og visuell referansekontroll gjenstår.


## Versjon 1.2 – enhetlig LCD-rendering

All skjermtekst gjengis nå med bitmap-rutiner på 84 × 48-rutenettet.
Menymarkeringen bruker samme font som øvrige skjermbilder, og ikonene
er tegnet som monokrome primitiver i stedet for operativsystemets emoji.
Dette er en teknisk konsistensforbedring, ikke en verifisert kopi av
Nokias originale ikonsett eller skjermfont.


## v1.3 – originalmodell 2000
Visuell rekonstruksjon av klassisk marineblå Nokia 3310 med sølvgrå front, mindre skjerm, sølvfargede ovale taster, vertikale høyttalerspor og C-knapp til venstre. Den ekstra ringeknappen er fjernet. LCD beholdes på 84×48 og gjengis uten CSS-filter eller bilineær utjevning. Dette er fortsatt en CSS-rekonstruksjon og ikke en eksakt industriell 3D-modell.


## v1.4 – Skarpere skjerm og ombygd front
LCD-logikken er fortsatt 84 × 48 historiske piksler, men rendres via en 672 × 384 piksel canvas (8× nærmeste nabo), for å unngå uklare tegn på Retina-skjermer. Front, sølvpanel, knapper og plassering er revidert. Dette er ikke en verifisert 1:1-modell.


## Versjon 1.5 – fotografibasert front
Telefonens synlige front er nå basert direkte på referansebildet brukeren lastet opp, ikke en fri CSS-illustrasjon. Den interaktive LCD-flaten og usynlige tastetrykksoner er lagt oppå fotografiet. Dette gir langt bedre formmessig likhet, men bildet har feilaktige bokstaver/tall på enkelte knapper og er derfor ikke en historisk korrekt gjengivelse av tastaturmerkingen. Tastaturfunksjonen følger standard 3310-logikk. LCD-en har 84 × 48 logiske piksler, tegnet til 672 × 384 uten interpolering. Skjermens plassering og trykksonene må fortsatt testes på fysisk iPhone.

## Versjon 1.6 – rullende hilsen
På startskjermen ruller teksten «Du er søt ❤️ suss Espen» kontinuerlig fra høyre mot venstre. Hjertet tegnes som et pikselikon på LCD-en. Menyer og tastatur fungerer som før.
