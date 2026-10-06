// Eventi di tracciamento via dataLayer. Gli eventi restano nel browser finche' non c'e' consenso:
// GA4 e Meta Pixel vengono caricati da consent.js solo dopo l'accettazione (vedi README).
//
// Eventi:
//   cta_click             { cta, href }       clic su qualsiasi CTA (attributo data-cta)
//   form_start            { form }            primo input nel form contatti
//   generate_lead         { servizio }        invio riuscito (evento consigliato GA4) -> Meta: Lead
//   form_submit_error     { reason }
//   hero_fan_interaction, trait_interaction, facial_shape_chip  (interazioni con le demo)

window.dataLayer = window.dataLayer || [];
const consent = { analytics: false, marketing: false };

export function setTrackingConsent(next) { Object.assign(consent, next); }

export function track(event, params = {}) {
  window.dataLayer.push({ event, ...params });
  if (consent.analytics && typeof window.gtag === 'function') window.gtag('event', event, params);
  if (consent.marketing && typeof window.fbq === 'function') {
    if (event === 'generate_lead') window.fbq('track', 'Lead', params);
    else if (event === 'cta_click' && /whatsapp|phone|email|instagram/.test(params.cta || '')) window.fbq('track', 'Contact', params);
  }
}

export function initTracking() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-cta]');
    if (el) track('cta_click', { cta: el.dataset.cta, href: el.getAttribute('href') || '' });
  });
}
