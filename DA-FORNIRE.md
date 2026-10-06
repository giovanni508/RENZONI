# Cose da fornire o confermare prima della pubblicazione

Tutti i segnaposto sono visibili nel sito come **[TESTO TRA PARENTESI QUADRE]**. In sviluppo (`npm run dev`) le parti da
confermare sono evidenziate in rosso.

## Dati e contatti (in `site.config.js`)
- [ ] Email per le richieste
- [ ] Telefono e numero WhatsApp (con prefisso, es. 39333…)
- [x] Instagram: **@ericarenzoni__** (unico social collegato al sito; Facebook e TikTok non vengono mostrati)
- [ ] Città e zona; indirizzo dello studio oppure "su appuntamento"; consulenze anche online o a domicilio?
- [x] Dominio del sito: **https://ericarenzoni.com** (impostato in `site.config.js`)
- [ ] Dati legali: nome o ragione sociale, **P.IVA**, sede legale, email per la privacy, data dell'informativa

## Contenuti
- [ ] **Foto ritratto professionale** di Erica (consigliata verticale 10:11, almeno 800 px). Ora c'è un ritratto **provvisorio**, preso dalla card finale del reel `f3988…` (Erica con la cornice arcobaleno)
- [x] **Formazione** (in "Chi sono"): diploma all'Italian Image Institute di Milano, Master in Luxury and Fashion Management (Il Sole 24 Ore), corsi di Armocromia, Body Shape & Facial Shape, Stile
- [ ] **Dove ricevi** le clienti (città, studio, a domicilio, online?): unico punto ancora aperto della bio
- [ ] Servizi: durata, prezzi (se vuoi mostrarli), cosa comprende ciascuna consulenza
- [ ] Testimonianze reali, con consenso, se vuoi una sezione recensioni (oggi assente di proposito)

## Da confermare con Erica
- [ ] **Nomenclatura delle 16 stagioni** (in `src/data/seasons.js`). Ora è quella più diffusa: Primavera Pura/Light/Warm/Bright, Estate Pura/Light/Cool/Soft, Autunno Puro/Deep/Warm/Soft, Inverno Puro/Deep/Cool/Bright
- [ ] **Palette dei 16 sottogruppi**: oggi sono dimostrative (il sito lo dice). Meglio sostituirle con quelle che usa Erica
- [ ] **Come funziona** (4 passaggi proposti):
  - contatto e risposta entro 24/48 ore;
  - appuntamento con luce naturale e viso struccato;
  - analisi con drappi colorati e metallici, più mascherine per la Facial Shape;
  - risultati. Cosa riceve la cliente: palette fisica? report digitale?
- [ ] **Forme del viso** mostrate nella Facial Shape: ovale, tondo, quadrato, rettangolare, cuore, diamante, triangolo
- [ ] Tempo di risposta "24/48 ore" (da brief)
- [ ] Testi delle didascalie della galleria

## Video e privacy
- [ ] **Liberatorie delle clienti** che compaiono nei video. Clip con volti: `drappo` (Cosa faccio), `sequenza`, `lame`, `lilla`, `viola`, `ventaglio` (galleria). In alternativa si sostituiscono con clip senza volto (`macro` è già pronta)
- [ ] Revisione legale di `privacy.html` e `cookie.html`

## Servizi tecnici
- [ ] Come ricevere le richieste del form: Formspree, Web3Forms, PHP sul tuo hosting, Netlify o Cloudflare (vedi README)
- [ ] (Facoltativo) Chiave Cloudflare Turnstile anti-spam
- [ ] (Facoltativo) ID di Google Analytics 4 e/o Meta Pixel
