// =====================================================================================
//  DATI DEL SITO: modifica qui contatti, social e dati legali.
//  Ogni valore viene inserito in index.html, privacy.html e cookie.html al posto di {{chiave}}
//  (vedi il plugin in vite.config.js). Dopo una modifica: `npm run dev` / `npm run build`.
//  Tutto cio' che e' tra [PARENTESI QUADRE] e' un segnaposto da sostituire.
// =====================================================================================

export default {
  name: 'Erica Renzoni',
  role: "Consulente d'immagine",

  // Sito pubblicato (serve per canonical, Open Graph, sitemap). Senza slash finale.
  siteUrl: 'https://ericarenzoni.com',

  // Zona in cui ricevi: compare in title/description, nei dati strutturati e nel footer.
  city: '[CITTÀ]',
  region: '[PROVINCIA/REGIONE]',
  address: '[INDIRIZZO STUDIO o "Su appuntamento"]',

  // Contatti
  email: '[EMAIL DA INSERIRE]', // es. ciao@ericarenzoni.com
  phoneDisplay: '346 699 7102', // come appare a schermo
  phoneHref: '+393466997102', // formato internazionale senza spazi (link tel:)
  whatsapp: '393466997102', // solo cifre con prefisso (usato in https://wa.me/...)
  whatsappText: "Ciao Erica! Vorrei informazioni sull'analisi del colore.",

  // Social
  // Erica usa solo Instagram (Facebook e TikTok non vanno collegati al sito)
  instagramUrl: 'https://www.instagram.com/ericarenzoni__/',
  instagramHandle: '@ericarenzoni__',

  // Dati legali (footer, privacy, cookie)
  legalName: 'Erica Renzoni',
  vat: '[P.IVA DA INSERIRE]',
  legalAddress: '[SEDE LEGALE DA INSERIRE]',
  privacyEmail: '[EMAIL PRIVACY DA INSERIRE]',
  policyUpdated: '[DATA ULTIMO AGGIORNAMENTO]',

  // Tempi di risposta mostrati nel form e nella conferma
  responseTime: '24/48 ore',
};
