# Product

<!-- impeccable:product-schema 1 -->

> Record ricavato dal brief del cliente senza intervista (su richiesta esplicita: "procedi senza aspettare").
> I fatti marcati **[inferito]** vanno confermati con Erica.

## Platform

web

## Stack

Delegato (brief: "Vite + HTML/CSS/JS vanilla, GSAP + ScrollTrigger, Lenis, OGL solo per lo shader dell'hero").
Scelto: Vite 8, JavaScript vanilla a moduli, GSAP 3 (ScrollTrigger, SplitText, MorphSVG, CustomEase), Lenis (solo desktop),
OGL (WebGL hero, solo desktop). Build statica in `dist/`, deploy su qualsiasi hosting statico.

## Users

- Donne (e persone) che seguono Erica su Instagram e arrivano al sito dal link in bio, quasi sempre da smartphone. **[inferito dal brief: "la maggior parte dei contatti arrivera' da smartphone/Instagram"]**
- Persone che cercano "armocromia" / "analisi del colore" / "consulente d'immagine" nella zona di Erica ([CITTÀ] da fornire).
- Il loro compito: capire cosa fa Erica e come si svolge la consulenza, convincersi che fa per loro, chiedere informazioni o prenotare.

## Product Purpose

Sito one-page che genera richieste di consulenza (form, WhatsApp, Instagram, telefono, email).
Successo = richieste inviate dal form e clic sui canali diretti (eventi `generate_lead`, `cta_click`).

## Positioning

Erica fa analisi del colore con il metodo a 16 stagioni (4 macrostagioni x 4 sottogruppi), usando drappi colorati
e metallici vicino al viso, e la Facial Shape: misura la forma del viso con mascherine per consigliare taglio di capelli,
accessori e forma degli occhiali. Il brand esiste gia': firma monoline E-R + wordmark Montserrat, Copertina su tessuto nero
con drappi e cartoncini colorati.

## Operating Context

- Consulenze dal vivo con drappi colorati, drappi in lame' oro/argento (test dei metalli), cornici colorate attorno al viso (visibili nei reel).
- Comunicazione attuale: reel Instagram con sottotitoli, tono diretto e caldo, dà del "tu" ("E tu? Vorresti scoprire quali sono i tuoi colori? Scrivimi in direct").
- Tempo di risposta dichiarato nel brief: 24/48 ore.

## Capabilities and Constraints

- Servizi: Analisi del colore (armocromia, 16 stagioni), Facial Shape. Prezzi, durata, luogo e modalita' della consulenza: **non forniti**.
- Nomenclatura dei 16 sottogruppi e palette: indicative, **da validare con Erica**.
- Passaggi "Come funziona": proposta plausibile, **da confermare con Erica**.
- Forme del viso nella Facial Shape (ovale, tondo, quadrato, rettangolare, cuore, diamante, triangolo): **da confermare**.
- Lingua: italiano. Logo solo nero o bianco, mai deformato ne' ricolorato.

## Brand Commitments

- Logo vettoriale ufficiale (er.pdf): firma a linea continua + "ERICA RENZONI" + "CONSULENTE D'IMMAGINE"; versioni nero `#040606` e bianco.
- Neutri: nero tessuto, greige `#E2E2DA` (fondo del logo nel PDF), bianco. Palette dai drappi della Copertina.
- Font: Montserrat (wordmark e testi, vincolo di marca) + una serif display elegante per i titoli (richiesta del brief).
- Concetto guida: "Il colore giusto ti accende."

## Evidence on Hand

- `../mateirali/Copertina report_.png` (moodboard), `er.pdf`, `er-02.png`, `er-03.png`, 3 animazioni del logo, 9 reel di consulenze.
- **Assenti (non inventare)**: testimonianze, recensioni, prezzi, numeri, certificazioni, anni di esperienza, foto ritratto professionale, contatti, citta', P.IVA.
- Nei reel compaiono volti di clienti: servono liberatorie prima della pubblicazione.

## Product Principles

1. Ogni sezione accompagna verso il contatto: CTA chiara, canali diretti a un tocco, form breve.
2. Mostrare il metodo, non descriverlo: drappi veri, colori veri, strumenti da toccare.
3. Il colore e' il protagonista, i testi restano sobri e leggibili.
4. Nessuna affermazione non verificata: cio' che manca e' un segnaposto dichiarato.

## Accessibility & Inclusion

WCAG 2.1 AA come requisito del brief: contrasto, focus visibile, navigazione da tastiera, form con etichette reali,
`prefers-reduced-motion` (versione statica completa), nessun contenuto essenziale solo in animazione.
