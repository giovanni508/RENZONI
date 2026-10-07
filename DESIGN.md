---
name: Erica Renzoni
description: "Il colore giusto ti accende. Armocromia a 16 stagioni e Facial Shape, messe in scena con il rituale dei drappi."
colors:
  c-lime: "#D8E348"
  c-teal: "#146C78"
  c-red: "#D31728"
  c-orange: "#E1800A"
  c-violet: "#975290"
  c-olive: "#707726"
  c-pink: "#DE9CBA"
  c-aqua: "#7DB3B3"
  c-yellow: "#DAD90F"
  c-rose: "#E797AA"
  c-lilac: "#8B8EA7"
  ink: "#0A0A0A"
  fabric: "#0E0E0E"
  ink-3: "#1E1D1C"
  greige: "#E2E2DA"
  paper: "#F1F1EB"
  text-2: "#3E3D37"
  text-inv: "#ECECE4"
  text-inv-2: "#B9B8AE"
  line: "rgb(10 10 10 / 0.16)"
  line-inv: "rgb(236 236 228 / 0.18)"
  error-inv: "#FF8C82"
typography:
  display:
    fontFamily: "'Bodoni Moda', 'Bodoni Fallback', 'Didot', Georgia, serif"
    fontSize: "clamp(2.65rem, 1.35rem + 5.2vw, 6rem)"
    fontWeight: 450
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Bodoni Moda', 'Bodoni Fallback', 'Didot', Georgia, serif"
    fontSize: "clamp(2.25rem, 1.35rem + 3.3vw, 4.6rem)"
    fontWeight: 450
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Bodoni Moda', 'Bodoni Fallback', 'Didot', Georgia, serif"
    fontSize: "clamp(1.35rem, 1.12rem + 0.85vw, 1.9rem)"
    fontWeight: 450
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body-lead:
    fontFamily: "'Montserrat', 'Montserrat Fallback', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.42vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "'Montserrat', 'Montserrat Fallback', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.14vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "'Montserrat', 'Montserrat Fallback', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Montserrat', 'Montserrat Fallback', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.16em"
  label-button:
    fontFamily: "'Montserrat', 'Montserrat Fallback', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  field: "2px"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4rem"
  s-9: "6rem"
  s-10: "8rem"
  gutter: "clamp(1rem, 0.35rem + 2.7vw, 4rem)"
  section-y: "clamp(5rem, 2.8rem + 8vw, 11rem)"
  container: "1440px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.greige}"
    typography: "{typography.label-button}"
    rounded: "{rounded.pill}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-light:
    backgroundColor: "{colors.greige}"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.pill}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.pill}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-ghost-light:
    backgroundColor: "transparent"
    textColor: "{colors.text-inv}"
    typography: "{typography.label-button}"
    rounded: "{rounded.pill}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-hover:
    backgroundColor: "{colors.c-lime}"
    textColor: "{colors.ink}"
  button-small:
    padding: "0.7em 1.25em"
    height: "44px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-inv}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "0.55em 1.15em"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.c-lime}"
    textColor: "{colors.ink}"
  chip-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.4em 1em"
    height: "44px"
  chip-light-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.greige}"
  input-field:
    backgroundColor: "rgb(236 236 228 / 0.05)"
    textColor: "{colors.text-inv}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.85em 1em"
    height: "52px"
  input-field-focus:
    backgroundColor: "rgb(236 236 228 / 0.08)"
  nav-bar:
    backgroundColor: "rgb(10 10 10 / 0.86)"
    textColor: "{colors.text-inv}"
    height: "64px"
  nav-bar-light:
    backgroundColor: "rgb(226 226 218 / 0.86)"
    textColor: "{colors.ink}"
    height: "64px"
  card-trait:
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 1rem + 2vw, 3rem)"
---

# Design System: Erica Renzoni

## Overview

**Creative North Star: "Il Rituale dei Drappi"**

Il sito è la consulenza messa in pagina. Come durante l'analisi, c'è un fondale neutro, il tessuto nero e la luce greige che vengono dal logo, e sopra si posano i colori, uno alla volta, vicino a chi guarda. Il colore è materia: drappi, cartoncini del ventaglio, campioni dal bordo a zig-zag, campi pieni delle stagioni. Non è mai decorazione d'interfaccia. L'unico colore che risponde al tocco è il giallo fluo.

La voce è editoriale e sartoriale insieme. Bodoni Moda, a peso 450 e con il taglio ottico fissato per la lettura, porta i titoli e li chiude in corsivo; Montserrat, il carattere del wordmark, porta il testo e il maiuscolo spaziato di pulsanti, voci e controlli. La densità è ariosa: sezioni alte, colonne asimmetriche su 12, tanto vuoto quanto pieno. Il movimento ha un solo carattere, il tessuto che si posa: partenza decisa e atterraggio lungo, velature di colore che entrano da sinistra, fili che lo scroll cuce. Con movimento ridotto il sito resta completo e statico.

Rifiuto confermato dal contratto di direzione: il template beauty pastello. In pratica niente neutri crema o avorio, niente oro come ornamento, niente foto stock, niente griglie di card uguali. Pastelli e oro esistono solo come contenuto (un campione in palette, il drappo in lamé dei video), mai come atmosfera della pagina.

**Key Characteristics:**
- Due luci alternate sezione per sezione: tessuto nero fotografato e greige del logo.
- La palette vivida dei drappi solo negli elementi grafici; un solo accento d'interazione, il giallo fluo.
- Bodoni Moda 450 a taglio ottico fisso, con coda in corsivo; Montserrat per il testo e per il maiuscolo spaziato.
- Contenitori a spigolo vivo, controlli a pillola, campioni con bordo a zig-zag.
- Profondità da tono, texture e ritaglio; ombre solo sugli oggetti fisici.
- Movimento "silk": ingressi lunghi, velature da sinistra, fili cuciti; versione statica completa.
- Logo (firma monoline e wordmark Montserrat) solo in nero o greige, mai ricolorato né deformato.

## Colors

Neutri presi dal logo, colori presi dai drappi: un fondale quasi acromatico su cui la palette della Copertina appare come materia, e un solo giallo fluo che fa da interruttore.

### Primary
- **Giallo Fluo** (#D8E348, `--c-lime`): l'unico accento d'interazione. Riempie i pulsanti al passaggio, i chip selezionati, la casella privacy spuntata, i bottoni cuciti di "Come funziona", il blocco Instagram della galleria al passaggio, il tondo WhatsApp, la selezione del testo e lo skip link; accompagna il focus (alone degli slider, bordo dei campi). È anche il colore a riposo della parola-accento dell'hero. Testo ink sopra di esso: 14.1:1.

### Secondary
La palette dei drappi, campionata dalla Copertina. Colore materico: vive nei cartoncini del ventaglio, nel bagliore dell'hero, nei campioni e nei diagrammi, mai nel testo corrente o nell'interfaccia.
- **Verde Petrolio** (#146C78): cartoncino del ventaglio, bagliore freddo dell'hero, tratteggio della sagoma nel diagramma della Facial Shape (4.7:1 su greige, valido come grafica).
- **Rosso Drappo** (#D31728): cartoncino, bagliore caldo in basso a destra dell'hero, linee di misura del viso (4.1:1 su greige).
- **Arancio** (#E1800A) e **Viola Malva** (#975290): cartoncini e campo di bagliore (il viola solo su mobile, dove il bagliore sostituisce il WebGL).
- **Verde Oliva** (#707726) e **Rosa Orchidea** (#DE9CBA): cartoncini del ventaglio.
- **Acqua Polvere** (#7DB3B3), **Giallo Acido** (#DAD90F), **Rosa Peonia** (#E797AA), **Lilla Ardesia** (#8B8EA7): toni secondari nelle terne di colore che accompagnano ogni cartoncino.

### Neutral
- **Nero Tessuto** (#0A0A0A, `--ink`, alias `--text`): testo su chiaro (15.2:1 su greige), pulsante pieno, card scura del sottotono, fili e bottoni dei passi, cursore degli slider.
- **Nero Trama** (#0E0E0E): base di ogni superficie di tessuto fotografato (hero, galleria, contatti, menu, footer), sempre sotto la texture `fabric-dark.jpg` ripetuta a 512px. Nel CSS è un valore letterale, non una custom property.
- **Nero Carbone** (#1E1D1C, `--ink-3`): pannelli scuri rialzati (banner cookie) e fondo dei video prima del caricamento.
- **Greige Luce Naturale** (#E2E2DA, `--greige`): il fondo del logo nel PDF e la luce del sito. Fondo della pagina e delle sezioni chiare, testo dei pulsanti pieni, colore del logo e della firma sul nero.
- **Carta** (#F1F1EB, `--paper`): la seconda luce chiara, per non affiancare due sezioni greige (Caratteristiche, Come funziona); anello attorno al cursore degli slider.
- **Grafite Calda** (#3E3D37, `--text-2`): testo secondario su chiaro, didascalie, nomi dei campioni (8.4:1 su greige, 9.6:1 su carta).
- **Greige Chiaro** (#ECECE4, `--text-inv`): testo su nero (16.3:1 sul tessuto).
- **Greige Polvere** (#B9B8AE, `--text-inv-2`): testo secondario su nero, sottotitolo dell'hero, etichette dei canali, aiuti dei campi (9.7:1 sul tessuto).
- **Filo Scuro** (rgb(10 10 10 / 0.16), `--line`) e **Filo Chiaro** (rgb(236 236 228 / 0.18), `--line-inv`): i fili di separazione, sempre da 1px.
- **Corallo d'Errore** (#FF8C82): stato d'errore dei campi, solo sul nero (8.6:1 sul tessuto), sempre con un pallino e un messaggio scritto.

### Named Rules
**The One Lime Rule.** Il giallo fluo è l'unico colore che segnala interazione: velo dei pulsanti, chip e caselle selezionati, bottoni cuciti, compagno del focus, tondo WhatsApp. Nessun altro colore dei drappi indica mai uno stato.

**The Drapes Are Matter Rule.** I colori dei drappi vivono negli elementi grafici (cartoncini, bagliore, campioni, campi delle stagioni, diagrammi), mai nel testo corrente, nelle etichette o nelle cornici d'interfaccia. Unica eccezione: la parola-accento del titolo dell'hero, che "prova" il colore scelto nel ventaglio usandone una tinta schiarita leggibile sul nero (viola #B77AB2 invece di #975290, 6.1:1 invece di 3.7:1; rosso #F0303F invece di #D31728, 4.9:1).

**The Lime Is a Fill on Light Rule.** Su greige e carta il giallo fluo compare solo come riempimento dietro testo ink, mai come testo o filo: lì renderebbe 1.07:1. Sul tessuto nero può essere anche testo o filo (asterisco dei campi obbligatori, corsivo del footer al passaggio, tratto dell'indicatore di scroll).

## Typography

**Display Font:** Bodoni Moda (con 'Bodoni Fallback', Georgia a metriche corrette, poi Didot, Georgia, serif)
**Body Font:** Montserrat (con 'Montserrat Fallback', Arial a metriche corrette, poi Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Montserrat in maiuscolo spaziato; nessun mono.

**Character:** Il contrasto alto del Bodoni è il gesto sartoriale, con l'asse ottico fissato a un taglio da lettura (`'opsz' 28`, 32 per i display, 20 per i titoli minori) invece di seguire la dimensione: a quella grandezza le aste sottili restano visibili anche sui fondi pieni delle stagioni; Montserrat, il carattere del wordmark e vincolo di marca, è la mano pulita che spiega. Il corsivo del Bodoni è l'unica enfasi del sistema.

### Hierarchy
- **Display** (450, opsz 32, clamp(2.65rem, 1.35rem + 5.2vw, 6rem), limitato a 10.5vh nell'hero; 1.02; -0.03em): il titolo dell'hero su due righe e la grande chiamata del footer (fino a 6rem, interlinea 1, -0.025em). Ogni riga risale da una piega.
- **Headline** (450, opsz 28, clamp(2.25rem, 1.35rem + 3.3vw, 4.6rem), 1.06, -0.02em): un titolo per sezione, `text-wrap: balance`, larghezza da 12 a 18ch (di solito 12–14ch).
- **Title** (450, opsz 20, clamp(1.35rem, 1.12rem + 0.85vw, 1.9rem), 1.15, -0.01em): titoli delle card, dei passi, delle voci della Facial Shape.
- **Body Lead** (Montserrat 400, clamp(1.1rem, 1rem + 0.42vw, 1.35rem), 1.55): il paragrafo d'apertura di ogni sezione, massimo 34em, `text-wrap: pretty`.
- **Body** (Montserrat 400, clamp(1rem, 0.97rem + 0.14vw, 1.0625rem), 1.65): testo corrente, massimo 62ch. I campi dei form restano a 16px fissi.
- **Body Small** (Montserrat 400, 0.875rem, 1.55): didascalie, testi delle card, note, footer.
- **Label** (Montserrat 600, 0.6875rem, 0.16em, maiuscolo): estremi degli slider, nomi dei campioni, etichette dei canali, chip delle forme del viso. Gamma osservata: 0.6875–0.75rem, peso 500–600, spaziatura 0.14–0.22em (fino a 0.1em nelle schede delle stagioni su schermi stretti); le voci della navbar usano 0.72rem, 500, 0.18em.
- **Label Button** (Montserrat 600, 0.8125rem, 0.14em, maiuscolo; 0.75rem nei pulsanti piccoli): tutti i pulsanti.
- **Varianti di display:** il nome della macrostagione (Bodoni corsivo 450, opsz 32, clamp(3.4rem, 1.6rem + 6.8vw, 6rem), 0.95, -0.035em), le voci del menu mobile (Bodoni clamp(2rem, 8vw, 3.5rem), al passaggio diventano corsive), l'etichetta della forma del viso (Bodoni corsivo, fino a 2.4rem).

### Named Rules
**The Italic Coda Rule.** Ogni headline di sezione e ogni display in Bodoni chiude in corsivo: una parola o l'ultima frase ("L'armocromia, *drappo dopo drappo.*", "Sono *Erica.*", "ti *accende*."). Mai tutto il titolo in corsivo, mai il grassetto: il Bodoni resta a 450 e la sua sola enfasi è il corsivo. I titoli minori in Bodoni (card, passi, conferma, cookie) restano in tondo.

**The Spaced Capitals Rule.** Il maiuscolo esiste solo in Montserrat, sempre spaziato (da 0.1 a 0.22em), piccolo (0.6875–0.8125rem) e a peso 500–600, ed è riservato a pulsanti, navigazione, controlli e nomi dei campioni. Mai in Bodoni, mai come occhiello sopra un titolo.

## Layout

Una pagina sola, verticale, a sezioni piene. Contenitore massimo 1440px centrato, margini laterali fluidi (`gutter`, da 1rem a 4rem) che rispettano le safe area. Ogni sezione respira con un padding verticale fluido (`section-y`, da 5rem a 11rem). La scala degli spazi ha base 4px (da 0.25rem a 8rem): 0.5–1rem dentro i componenti, 1.5–2rem tra gli elementi di un blocco, 3–4rem tra i blocchi, 6rem prima della griglia del footer.

Mobile first, a colonna singola. Da 900px le composizioni passano a una griglia di 12 colonne con spazio pari al gutter, sempre asimmetriche: testo 1–6 e video 8–12 (Cosa faccio), diagramma 1–5 e testo 7–12 (Facial Shape), ritratto 2–5 e testo 7–11 (Chi sono), introduzione 1–5 fissa a lato e form 7–12 (Contatti). Le quattro caratteristiche formano un mosaico 7/5 sopra 5/7. I passi passano da una colonna con filo verticale a quattro colonne con filo orizzontale.

Le sezioni-scena vivono di scroll. L'hero (100svh) resta fermo mentre il drappo nero si solleva in diagonale e scopre la sezione che sale da sotto. Le stagioni si fermano su desktop e cambiano nello stesso spazio; su mobile scorrono in colonna con le schede fisse in alto. La galleria scorre in orizzontale (guidata dallo scroll su desktop, a scatto nativo su mobile). Colonne laterali fisse per il diagramma del viso e per l'introduzione dei contatti.

Breakpoint: 640px (CTA nella navbar), 768px (navbar da 64 a 72px, hero desktop), 900px (griglie a 12 colonne, sezioni fissate, barra CTA mobile nascosta), 1100px (voci di navigazione al posto del burger). Correzioni per schermi bassi (altezza fino a 720px e 640px) e stretti (fino a 399px). Nessun elemento può allargare la pagina: le sezioni ritagliano l'overflow orizzontale senza rompere lo sticky, e i fondi a tutta larghezza delle stagioni si estendono oltre il contenitore senza scroll orizzontale.

### Named Rules
**The Empty Column Rule.** Da 900px ogni composizione a due parti (testo e immagine, testo e strumento) usa la griglia a 12 colonne e lascia almeno una colonna vuota fra le parti (6+5, 5+6, 4+5): mai una divisione 6+6 a filo.

## Elevation & Depth

Il sistema è piatto per principio e profondo per materia. La profondità non viene dalle ombre ma da tre fonti: l'alternanza di due luci (tessuto nero e greige), la texture fotografica del tessuto sulle superfici scure, e i ritagli che sollevano o rivelano (il drappo nero dell'hero che si solleva lungo un taglio curvo, con l'orlo ripiegato, il filo d'impuntura tratteggiato e un'ombra a tre strati sulla sezione che scopre, il menu che scende come un drappo, la sagoma a piega del video). Le barre fisse (navbar dopo lo scroll, barra CTA mobile) usano un velo traslucido all'86–90% con sfocatura di 14px per restare leggibili sopra contenuti che cambiano; non è un materiale decorativo.

### Shadow Vocabulary
- **Cartoncino a riposo** (`box-shadow: -1px 1px 1px rgb(0 0 0 / 0.6), -4px 5px 8px -2px rgb(0 0 0 / 0.5), -16px 18px 30px -10px rgb(0 0 0 / 0.65)`): i cartoncini del ventaglio appoggiati sul tessuto, luce dall'alto a destra. Il primo strato è il contatto, il secondo stacca ogni cartoncino da quello sotto, il terzo lo posa sul tessuto.
- **Cartoncino sollevato** (`box-shadow: -1px 1px 2px rgb(0 0 0 / 0.55), -6px 8px 12px -3px rgb(0 0 0 / 0.45), -18px 22px 34px -10px rgb(0 0 0 / 0.78)`): il cartoncino scelto.
- **Orlo del drappo** (tre tratti SVG neri lungo la curva del taglio: 8px al 20%, 24px al 9%, 52px al 4.5%): l'ombra che il drappo dell'hero, sollevandosi, proietta sulla sezione sotto. Sopra l'ombra corrono la fascia ripiegata (#1F1E1C, 18px), il filo del bordo (#45433F, 1.6px) e l'impuntura tratteggiata (#8E8B81, 1.3px, 7/6).
- **Stampa appoggiata** (`box-shadow: 0 1px 2px rgb(10 10 10 / 0.14), 0 30px 60px -30px rgb(10 10 10 / 0.55)`): il ritratto, una stampa fotografica col suo bordo bianco (Carta, 10–20px) posata e ruotata di -2°. L'ombra di contatto disegna i bordi sul greige, quella lunga la stacca dal tavolo.
- **Pannello sospeso** (`box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.6)`): il banner cookie, l'unico elemento d'interfaccia sospeso.

### Named Rules
**The Objects Cast Shadows Rule.** Proiettano ombra solo gli oggetti fisici posati sulla scena (i cartoncini del ventaglio, il ritratto stampato): ombre morbide, lunghe, con spread negativo. Sezioni, card, campi e navigazione sono piatti e si separano con tono, texture e fili da 1px.

**The Two Lights Rule.** Le sezioni alternano due luci: il tessuto nero fotografato (hero, galleria, contatti, footer, menu) e la luce greige o carta (tutte le altre). Il campo delle stagioni è l'unico fondo che prende un colore pieno, e lo cambia con lo scroll.

## Shapes

Due geometrie convivono: il rettangolo sartoriale e il cerchio della mano. Contenitori e media hanno spigolo vivo (0). I controlli che si premono sono pillole (999px) o cerchi (50% su un quadrato: pausa del video 44px, icone dei canali 48px, tondo WhatsApp 52px, bottoni dei passi 19px, cursore degli slider 26px). Campi di testo e casella privacy hanno appena 2px, i cartoncini del ventaglio 1px. Linee e bordi sono fili da 1px; l'unica eccezione è l'anello di 3px attorno al cursore degli slider.

Le forme sartoriali ricorrenti: il bordo a zig-zag delle forbici (campioni e giunzioni di sezione), la sagoma irregolare a piega del tessuto (l'unico contenitore non rettangolare), i tagli diagonali dei drappi (hero, menu), il quarto di cerchio del ventaglio, il ritratto posato a -2°, il filo tratteggiato 6/6. La firma monoline è l'unica linea curva libera.

### Named Rules
**The Sharp Container Rule.** Contenitori, card, media e pannelli hanno spigolo vivo; ciò che si preme è una pillola o un cerchio; i campi hanno 2px. Mai una card arrotondata, mai una pillola come contenitore.

**The Pinking Shears Rule.** Ogni campione di colore (swatch delle stagioni, nastro, coppie del sottotono, scale di valore e intensità) è un rettangolo 3:4 con il bordo inferiore rifilato a zig-zag (denti da 10px, maschera `--pinked`). Le sezioni che chiudono un campo pieno (stagioni, galleria) finiscono con la stessa rifilatura a denti da 20px. I campioni non si arrotondano mai; gli unici cerchi colorati sono le tinte di pelle, occhi e capelli del contrasto, che non rappresentano tessuto.

## Components

Sartoriali e tattili: si toccano come stoffa e cartoncino, rispondono con un velo di giallo fluo.

### Buttons
- **Shape:** pillola (999px), altezza minima 52px (44px nella variante piccola), padding 0.9em 1.6em (0.7em 1.25em), etichetta Label Button in maiuscolo, icona Phosphor opzionale a destra (1.25em).
- **Pieno:** ink con testo greige; l'azione principale sulle sezioni chiare.
- **Chiaro:** greige con testo ink; l'azione principale sul tessuto nero (hero, contatti, menu, barra mobile, navbar in tema scuro).
- **Hover / Focus:** al passaggio un velo giallo fluo entra da sinistra (parte fuori campo, inclinato di -12°, e si raddrizza in 520ms silk), testo e bordo passano a ink, l'icona scorre di 3px; alla pressione scala 0.98. Con puntatore fine le azioni principali sono lievemente magnetiche (seguono il cursore al 22% in orizzontale e al 30% in verticale, 0.6s silk). Focus: contorno 2px nel colore del testo, offset 4px, che segue la pillola.
- **Fantasma / Fantasma chiaro:** trasparente con bordo 1px (ink al 38% sul chiaro, greige al 42% sul nero); l'azione secondaria accanto alla principale.
- **Invio del form:** in attesa, un filo tratteggiato si cuce e si scuce sotto l'etichetta (1.2s drape, in loop).
- **Tondo WhatsApp:** cerchio 52px giallo fluo con icona ink nella barra CTA mobile.

### Chips
- **Style:** pillola, altezza 44px, bordo 1px. Sul nero (servizio nel form): testo greige chiaro a 0.875rem, bordo greige al 32%. Sul chiaro (forme del viso): Label in maiuscolo, bordo Filo Scuro.
- **State:** sul nero il selezionato si riempie di giallo fluo con testo ink a peso 600; sul chiaro si riempie di ink con testo greige. Al passaggio il bordo si fa pieno, alla pressione scala 0.97, al focus contorno 2px nel colore del testo con offset 3px.
- **Interruttore (freddo/caldo):** binario a pillola con filo chiaro e 4px di aria, un cursore greige che scorre sotto la voce attiva, testo attivo ink.

### Cards / Containers
- **Corner Style:** spigolo vivo (0).
- **Background:** ogni card di un gruppo ha la sua luce: le quattro caratteristiche alternano nero, greige e due carte tinte (calda e fredda) in un mosaico 7/5 sopra 5/7. Mai card uguali in fila.
- **Shadow Strategy:** nessuna ombra (vedi Elevation & Depth).
- **Border:** nessuno; un filo da 1px solo sul blocco finale della galleria e sul banner cookie.
- **Internal Padding:** clamp(1.5rem, 1rem + 2vw, 3rem); altezza minima 420px (460px da 900px); testo in alto, strumento in basso.

### Inputs / Fields
- **Style:** sul tessuto nero, fondo greige al 5%, bordo 1px greige al 30%, raggio 2px, altezza 52px, testo a 16px. Etichetta sopra il campo (Montserrat 500, 0.875rem), "facoltativo" in Greige Polvere, asterisco obbligatorio in giallo fluo.
- **Focus:** bordo giallo fluo, fondo all'8%, alone di 3px giallo fluo al 28%. Al passaggio il bordo sale al 50%.
- **Error / Disabled:** errore con bordo e messaggio in Corallo d'Errore preceduto da un pallino; campo valido con bordo giallo fluo al 55%. Casella privacy quadrata da 24px a 2px di raggio, spuntata in giallo fluo con segno ink. Il select usa la freccia Phosphor.
- **Slider:** binario 1px nel colore del testo, cursore tondo ink da 26px con anello carta di 3px e filo ink; al focus un alone giallo fluo di 5px, trascinando cresce a 1.15. Area di tocco alta 44px.

### Navigation
- **Style:** barra fissa alta 64px (72px da 768px), trasparente sull'hero; dopo lo scroll compare un velo (ink o greige all'86%, sfocatura 14px, filo inferiore al 10%). Il tema scuro o chiaro segue la sezione che passa sotto.
- **Typography / States:** voci Montserrat 500, 0.72rem, 0.18em, maiuscolo. Al passaggio e sulla voce attiva una linea da 1px si stende da sinistra (420ms silk) e si ritira verso destra. Il logo della navbar compare solo quando quello dell'hero ci "vola" dentro con lo scroll.
- **Mobile:** burger a due fili (il secondo al 70%) che ruotano in una X (±35°). Il menu è un drappo di tessuto nero che scende in diagonale (0.9s drape), con voci Bodoni grandi che al passaggio diventano corsive, poi la CTA chiara e i contatti diretti. Sotto 900px una barra CTA fissa (pillola greige e tondo WhatsApp) sale dopo l'hero.

### Il Ventaglio (signature)
I cartoncini della Copertina, in basso a destra nell'hero. Sette cartoncini quadrati (clamp(112px, 8vw + 64px, 270px); su mobile clamp(104px, 30vw, 132px)) ruotano attorno all'angolo in basso a destra a passi di 12°, da -36° a +36°, e si aprono un po' di più quando il cursore si avvicina. Ogni cartoncino è una stampa con grana e bordo di cartone sopra il suo colore pieno. Al primo paint è un quarto di cerchio in tre spicchi di colore disegnato in CSS; la stampa (WebP da 480px, circa 5 KB) arriva dopo il caricamento della pagina, così non contende la banda all'immagine principale. Sceglierne uno (passaggio, clic, trascinamento su touch, frecce da tastiera con un solo punto di tabulazione) fa "provare" il colore alla parola-accento del titolo: il nuovo colore la ricopre da sinistra in 0.7s drape. Il cartoncino indicato (passaggio o focus) si solleva di 14px e 18px verso l'alto a sinistra; quello scelto resta sollevato con l'ombra sollevata. Il suggerimento "Prova un colore" (Label con un filo) sparisce al primo uso.

### Campioni e nastro (signature)
Rettangoli 3:4 con bordo a zig-zag, in griglie da 3 per sottogruppo con 6px di spazio, e un filo interno al 14% dell'inchiostro che tiene i colori pallidi. Nelle stagioni i campioni cadono in posizione con una leggera rotazione casuale (±4°) che si raddrizza (0.95s silk). Il nastro di campioni sotto "Cosa faccio" è l'unico marquee del sito: 48s lineare, sfumato ai bordi, fermo con movimento ridotto.

### Campo delle stagioni (signature)
Il fondo della sezione è il colore della macrostagione e cambia con lo scroll (0.9s drape) insieme all'inchiostro: nero sui fondi chiari, greige chiaro sull'Inverno. Su desktop la sezione si ferma e le stagioni si avvicendano nello stesso spazio; su mobile scorrono in colonna con le schede fisse in alto; senza JS o con movimento ridotto diventano quattro blocchi pieni impilati. Le schede sono Label in maiuscolo con una linea da 1px che si stende; la voce attiva passa al peso 700. Colori di fondo e palette delle 16 stagioni sono dati di contenuto, non token di sistema.

### Filo e bottoni (signature)
"Come funziona" è una cucitura: un filo tratteggiato (6px pieno, 6px vuoto, ink al 28%) che lo scroll ripassa in ink pieno, e per ogni passo un bottone a due fori (19px, filo 1px ink, fondo carta) che si riempie di giallo fluo e cresce a 1.12 quando il filo lo raggiunge. Lo stesso filo è il caricamento del pulsante d'invio e l'indicatore di scroll dell'hero (filo da 1px con un tratto giallo fluo che scende, 2.4s drape).

### Media a piega
Il video di "Cosa faccio" è ritagliato da una sagoma di tessuto a bordi irregolari che si deforma con lo scroll mentre l'immagine rientra dallo zoom. I reel della galleria sono 9:16 a spigolo vivo, partono al passaggio e crescono a 1.02 (700ms silk). Il pulsante pausa è un cerchio da 44px, ink al 55% con sfocatura, visibile al passaggio.

### Canali diretti
Righe alte almeno 64px con un filo inferiore: icona Phosphor in un cerchio da 48px con filo, nome del canale in Label su Greige Polvere, valore in Body. Al passaggio il cerchio si riempie di giallo fluo con icona ink.

### Logo e firma
Firma monoline (tratto nel colore del testo, 0.9–1.2px) e wordmark Montserrat, dal file vettoriale ufficiale. Solo ink o greige, sempre via colore del testo, scalati in modo uniforme. Nell'hero la firma si disegna (1.4s drape) e le lettere entrano una a una; allo scroll il logo vola nella navbar. La firma da sola chiude la bio e la conferma d'invio.

### Icone
Phosphor in SVG inline nel colore del testo, sempre decorative accanto a un testo; peso light di default, thin sopra i 40px (voci della Facial Shape, blocco Instagram, freccia del footer). Dimensione base 1.25rem (1.25em dentro i pulsanti).

### Named Rules
**The Drape Wipe Rule.** Il colore e i cambi di scena entrano da sinistra come un drappo posato: il velo dei pulsanti, la parola-accento, il menu in diagonale, le linee sotto le voci. Ingressi in silk (cubic-bezier(0.19, 1, 0.22, 1)), cambi di scena in drape (cubic-bezier(0.65, 0.05, 0.36, 1)), uscite che accelerano.

## Do's and Don'ts

### Do:
- **Do** usare il giallo fluo (#D8E348) come unico segnale d'interazione: velo dei pulsanti, chip e caselle selezionati, bottoni cuciti, compagno del focus.
- **Do** chiudere ogni headline di sezione e ogni display in Bodoni con una coda in corsivo, a peso 450 con taglio ottico fisso, interlinea 1.02–1.06, spaziatura negativa (-0.02/-0.03em), `text-wrap: balance`, 12–18ch.
- **Do** alternare tessuto nero (#0E0E0E con la texture del tessuto) e luce greige o carta tra le sezioni, e lasciare il fondo a colore pieno solo al campo delle stagioni.
- **Do** tagliare ogni campione di colore in 3:4 con il bordo a zig-zag (`--pinked`).
- **Do** usare la tinta schiarita di un colore dei drappi (almeno 4.5:1) quando diventa testo sul nero, come la parola-accento dell'hero.
- **Do** tenere i controlli (pulsanti, chip, campi, interruttore, slider, pulsanti tondi) ad almeno 44px di altezza, i pulsanti a 52px, i link testuali ad almeno 40px, e un focus visibile (2px, offset 3–4px) su ogni elemento.
- **Do** muovere tutto con le due curve di casa: silk (cubic-bezier(0.19, 1, 0.22, 1)) per ingressi e hover, drape (cubic-bezier(0.65, 0.05, 0.36, 1)) per i cambi di scena; uscite che accelerano (power2.in).
- **Do** scrivere le coreografie d'ingresso come keyframe solo "from", così lo stato finale coincide con lo stile di base e con movimento ridotto il sito resta completo e statico.
- **Do** usare icone Phosphor inline nel colore del testo, peso light, thin sopra i 40px.

### Don't:
- **Don't** ricolorare o deformare il logo: firma e wordmark solo in nero (#040606 del file ufficiale o l'inchiostro #0A0A0A) o in bianco/greige, scalati in modo uniforme; mai in giallo fluo, mai in un colore dei drappi.
- **Don't** usare il giallo fluo come testo o filo su greige o carta (1.07:1): sul chiaro è solo un riempimento dietro testo ink.
- **Don't** usare un colore dei drappi diverso dal giallo fluo per stati d'interazione, né per testo corrente, etichette o cornici d'interfaccia.
- **Don't** lasciare l'asse ottico del Bodoni in automatico sui titoli grandi: oltre i 60px le aste sottili diventano capelli e sui fondi pieni delle stagioni il titolo non si legge più. Il taglio ottico resta fisso (28; 32 per i display; 20 per i titoli minori) e il peso a 450.
- **Don't** aggiungere un terzo carattere, usare il Bodoni in grassetto o in maiuscolo, o mettere un occhiello in maiuscolo spaziato sopra un titolo.
- **Don't** arrotondare contenitori, card, media o campioni: la pillola e il cerchio sono solo per i controlli.
- **Don't** dare ombre alle superfici d'interfaccia (sezioni, card, campi, navigazione): la profondità viene da tono, texture, ritaglio e fili da 1px.
- **Don't** scaldare i neutri di pagina verso crema o avorio (la famiglia resta il greige del logo, tonalità OKLCH 99–107°, croma fino a 0.014), né usare l'oro come ornamento (filetti, cornici, foglia): oro e pastelli entrano solo come contenuto, cioè un campione in palette o il drappo in lamé dei video.
- **Don't** usare foto stock o immagini generiche: le immagini sono solo la Copertina, il tessuto e i momenti veri delle consulenze.
- **Don't** comporre griglie di card informative identiche (icona, titolo, testo ripetuti): ogni contenitore di un gruppo cambia luce, proporzione o strumento, come le quattro caratteristiche. La pellicola di reel 9:16 è un formato video, non una griglia di card.
