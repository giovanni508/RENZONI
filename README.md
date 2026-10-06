# Erica Renzoni · sito one-page

Landing di Erica Renzoni, consulente d'immagine: armocromia con il metodo a 16 stagioni e Facial Shape.
Obiettivo: generare richieste di consulenza (form, WhatsApp, Instagram, telefono, email).

Stack: **Vite 8** + HTML/CSS/JavaScript vanilla, **GSAP 3** (ScrollTrigger, SplitText, MorphSVG), **Lenis** (scroll morbido solo
desktop), **OGL** (WebGL dell'hero, solo desktop). Nessun framework: il risultato è una cartella `dist/` statica che va su qualsiasi hosting.

---

## 1. Avvio rapido

Requisiti: Node.js 20 o superiore. Per rigenerare video e immagini serve anche **ffmpeg** (e `pdftocairo` per il logo).

```bash
npm install
```

```bash
npm run dev
```

Apre il sito su http://localhost:5173. In sviluppo i contenuti da completare sono evidenziati con un bordo rosso tratteggiato.

```bash
npm run build
```

Crea la versione da pubblicare in `dist/`.

```bash
npm run preview
```

Mostra la build di `dist/` su http://localhost:4173.

---

## 2. Dove si modifica cosa

| Cosa | Dove |
|---|---|
| Contatti, social, città, dominio, P.IVA, dati legali | `site.config.js` (un solo file, vale per tutte le pagine) |
| Testi delle sezioni | `index.html` (ogni sezione è commentata) |
| 16 stagioni: nomi, descrizioni, palette, colori di fondo | `src/data/seasons.js` |
| Nastro di colori (marquee) | `RIBBON` in `src/data/seasons.js` |
| Clip video (quali, da che secondo, ritaglio) | `scripts/media.config.mjs`, poi `npm run media` |
| Ritratto di Erica | sostituisci `public/assets/img/erica.(avif\|webp\|jpg)` ed `erica-m.*` (proporzione 10:11) |
| Informativa privacy e cookie | `privacy.html`, `cookie.html` (template da far verificare a un legale) |
| Colori, font, spazi, movimento | `src/styles/tokens.css` |
| Endpoint del form, statistiche | file `.env` (vedi punto 4 e 5) |

I valori di `site.config.js` entrano nell'HTML al posto dei segnaposto `{{chiave}}` durante `dev` e `build`.
Tutto ciò che è tra **[PARENTESI QUADRE]** è un segnaposto da sostituire.

---

## 3. Media: video, immagini, logo, font

Gli originali restano intatti in `../mateirali/` e **non vanno mai copiati in `public/`** (i video originali pesano 60–210 MB).
Le versioni per il web si rigenerano con gli script:

```bash
npm run assets
```

Esegue in sequenza:

- `npm run logo`: estrae dal PDF il logo vettoriale (`src/assets/logo/`). La firma resta un unico tracciato, così si può animare.
- `npm run fonts`: crea i font self-hosted alleggeriti (sottoinsieme per l'italiano, assi variabili ridotti) in `public/assets/fonts/`.
- `npm run images`: drappi della Copertina scontornati per l'hero, texture del tessuto nero, immagine social OG 1200×630, favicon e icone, ritratto provvisorio.
- `npm run media`: taglia, ritaglia e codifica le clip (H.264 + AV1, versioni desktop e mobile, poster AVIF/WebP/JPG) in `public/assets/video/`. I video HDR dell'iPhone vengono convertiti in SDR.

Per cambiare una clip modifica `scripts/media.config.mjs`. Per ciascuna clip indichi file sorgente, secondo di inizio, durata, ritaglio e fotogramma del poster. Poi rilancia `npm run media` (puoi passare anche solo alcune clip, es. `npm run media -- lilla`).

> **Liberatorie**: in tutte le clip della galleria e in quella di "Cosa faccio" compaiono volti di clienti. Pubblicale solo con una
> liberatoria firmata, oppure sostituiscile. La clip `macro` mostra solo drappi e mani, senza volti, ed è già pronta.

---

## 4. Form contatti

Il form valida in tempo reale, ha un campo trappola anti-bot e un controllo sul tempo di compilazione, e si può
collegare a Cloudflare Turnstile. Invia a un **endpoint configurabile**:

1. Copia `.env.example` in `.env`.
2. Imposta `VITE_FORM_ENDPOINT`, poi rifai `npm run build`.

| Servizio | VITE_FORM_ENDPOINT | Note |
|---|---|---|
| **Formspree** | `https://formspree.io/f/xxxxxxx` | crea il form su formspree.io e indica l'email di destinazione |
| **Web3Forms** | `https://api.web3forms.com/submit` | imposta anche `VITE_FORM_ACCESS_KEY` |
| **Hosting PHP** (Aruba, Register, SiteGround…) | `/contact.php` | copia `server-examples/contact.php` in `dist/` e compila le prime righe |
| **Netlify** | `/.netlify/functions/contact` | vedi `server-examples/netlify/` (email tramite Resend) |
| **Cloudflare Pages** | `/api/contact` | vedi `server-examples/cloudflare/` |

- **Formato**: per default il form invia `application/x-www-form-urlencoded`. Per un'API che vuole JSON imposta `VITE_FORM_FORMAT=json`.
- **Senza endpoint**: il form apre l'app di posta di chi scrive con il messaggio già compilato (fallback `mailto:`), indirizzato all'email di `site.config.js`.
- **Turnstile (consigliato, gratuito)**: imposta `VITE_TURNSTILE_SITEKEY` e la chiave segreta lato server.
- **Preselezione del servizio**: i pulsanti "Scopri la tua stagione" e "Prenota la Facial Shape" scelgono già il servizio giusto nel form.

Test automatico del form (validazione, invio, errore server, honeypot, eventi):

```bash
npm run test:form
```

---

## 5. Statistiche, Meta Pixel e cookie

Gli eventi vengono sempre scritti in `window.dataLayer`:

- `cta_click`: clic su qualunque CTA (attributo `data-cta`);
- `form_start`: primo input nel form;
- `generate_lead`: invio riuscito (in Meta Pixel diventa `Lead`);
- `form_submit_error`;
- interazioni con le demo.

Restano nel browser finché non c'è consenso.

- Senza ID configurati il sito **non usa cookie di terze parti** e il banner non compare. Il link "Preferenze cookie" mostra un'informativa breve.
- Con `VITE_GA4_ID` e/o `VITE_META_PIXEL_ID` nel `.env`, compare il banner (Accetta, Rifiuta, Personalizza). Gli script si caricano **solo dopo il consenso** (Consent Mode v2 per GA4). In sviluppo puoi vederlo aggiungendo `?cookie` all'URL.
- Ricorda di aggiornare `cookie.html` se attivi questi strumenti.

---

## 6. Pubblicazione

La cartella da pubblicare è sempre `dist/` (dopo `npm run build`).

- **Netlify**: nuovo sito da Git oppure trascinando `dist/`. Build command `npm run build`, publish directory `dist`. Le variabili `VITE_*` vanno in *Site settings → Environment variables*.
- **Vercel**: framework "Vite", output `dist`, variabili in *Project settings → Environment variables*.
- **Cloudflare Pages**: build command `npm run build`, output `dist`.
- **Hosting classico (FTP)**: esegui `npm run build` sul tuo computer e carica il **contenuto** di `dist/` nella cartella pubblica (es. `public_html`), più `contact.php` se usi il form PHP.

Prima di pubblicare imposta `siteUrl` in `site.config.js`. Servono per il canonical, per `sitemap.xml` e `robots.txt` (generati in build) e per l'immagine social.

---

## 7. Qualità (misurata in sviluppo)

- **Lighthouse mobile**: Performance 95, Accessibilità 100, Best Practices 100, SEO 100.
- **Lighthouse desktop**: 100 / 100 / 100 / 100. CLS 0, LCP mobile 2,4 s.
- **Primo paint indipendente dal JavaScript**: l'ingresso dell'hero (firma che si disegna, titolo, drappi, ventaglio) è tutto CSS. L'interattività si carica dopo il primo frame, il resto a browser libero.
- **`prefers-reduced-motion`**: versione statica completa, senza scroll fissati, parallax né video in autoplay. Le stagioni diventano blocchi di colore impilati.
- **Save-Data**: niente autoplay dei video e niente WebGL; restano i poster e la riproduzione manuale.
- **Video**: si caricano solo vicino alla vista, si mettono in pausa fuori schermo e hanno un pulsante pausa/play.
- **Accessibilità**: tastiera (ventaglio con le frecce, menu con focus trap ed ESC), skip link, etichette reali nel form, errori annunciati.

Schermate di verifica a più larghezze, salvate in `.shots/`:

```bash
npm run shots -- --widths 360,390,768,1024,1440,1920 --full
```

---

## 8. Struttura

```
sito/
├─ index.html, privacy.html, cookie.html
├─ site.config.js            contatti e dati del sito
├─ vite.config.js            plugin: dati del sito, icone Phosphor inline, robots/sitemap
├─ src/
│  ├─ main.js                bootstrap minimo (dopo il primo paint carica js/app.js)
│  ├─ js/                    hero, hero-gl (WebGL), seasons, traits, facial, steps, gallery, form, consent, tracking…
│  ├─ styles/                tokens, base, chrome (nav, footer…), hero, sections, form, legal
│  ├─ data/                  16 stagioni + markup generato in build
│  └─ assets/logo/           logo SVG estratto dal PDF
├─ public/assets/            font, immagini, video ottimizzati
├─ scripts/                  pipeline media, logo, font, immagini, screenshot, test del form
└─ server-examples/          handler del form (PHP, Netlify, Cloudflare)
```

---

## 9. Cose da fornire o confermare

Vedi l'elenco completo in `DA-FORNIRE.md`.
