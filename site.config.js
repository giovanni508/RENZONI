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
  phoneDisplay: '[TELEFONO DA INSERIRE]', // come appare a schermo, es. 333 123 4567
  phoneHref: '+39[NUMERO]', // formato internazionale senza spazi, es. +393331234567
  whatsapp: '39[NUMERO]', // solo cifre con prefisso, es. 393331234567 (usato in https://wa.me/...)
  whatsappText: "Ciao Erica! Vorrei informazioni sull'analisi del colore.",

  // Social
  instagramUrl: 'https://www.instagram.com/[PROFILO]/',
  instagramHandle: '@[PROFILO]',

  // Dati legali (footer, privacy, cookie)
  legalName: 'Erica Renzoni',
  vat: '[P.IVA DA INSERIRE]',
  legalAddress: '[SEDE LEGALE DA INSERIRE]',
  privacyEmail: '[EMAIL PRIVACY DA INSERIRE]',
  policyUpdated: '[DATA ULTIMO AGGIORNAMENTO]',

  // Tempi di risposta mostrati nel form e nella conferma
  responseTime: '24/48 ore',
};
