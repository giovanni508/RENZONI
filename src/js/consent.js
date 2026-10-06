// Banner cookie (TEMPLATE: far verificare a un legale) e caricamento condizionato di GA4 / Meta Pixel.
// - Senza VITE_GA4_ID e VITE_META_PIXEL_ID il sito usa solo storage tecnico: il banner non compare
//   (il link "Preferenze cookie" mostra comunque un'informativa breve).
// - Con gli ID impostati: niente script di terze parti finche' l'utente non accetta (Consent Mode v2).
// - In sviluppo, aggiungi ?cookie all'URL per vedere il banner.
import { setTrackingConsent } from './tracking.js';

const GA4 = import.meta.env.VITE_GA4_ID || '';
const PIXEL = import.meta.env.VITE_META_PIXEL_ID || '';
const KEY = 'er-consent-v1';
const MAX_AGE = 1000 * 60 * 60 * 24 * 180; // 6 mesi, poi si richiede di nuovo

const read = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    return s && Date.now() - s.time < MAX_AGE ? s : null;
  } catch { return null; }
};
const save = (state) => {
  const s = { ...state, time: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage non disponibile */ }
  return s;
};

let gaLoaded = false;
let pixelLoaded = false;
function loadScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}
function apply(state) {
  setTrackingConsent(state);
  if (GA4 && state.analytics && !gaLoaded) {
    gaLoaded = true;
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', GA4, { anonymize_ip: true });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4)}`);
  }
  if (PIXEL && state.marketing && !pixelLoaded) {
    pixelLoaded = true;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document);
    /* eslint-enable */
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
  }
}

export function initConsent() {
  const banner = document.querySelector('.cookie');
  if (!banner) return;
  const needed = Boolean(GA4 || PIXEL);
  const desc = banner.querySelector('.cookie__desc');
  const prefs = banner.querySelector('.cookie__prefs');
  const btnReject = banner.querySelector('[data-consent="reject"]');
  const btnCustom = banner.querySelector('[data-consent="custom"]');
  const btnAccept = banner.querySelector('[data-consent="accept"]');
  let state = read();
  if (state) apply(state);

  const hide = () => { banner.hidden = true; };
  const show = () => {
    if (!needed) {
      // modalita' informativa: nessun cookie di terze parti da gestire
      desc.innerHTML = 'Questo sito usa solo cookie e archiviazione tecnici, necessari al funzionamento. Nessun cookie di statistica o marketing. <a href="/cookie.html">Cookie policy</a>';
      btnReject.hidden = true;
      btnCustom.hidden = true;
      btnAccept.textContent = 'Ho capito';
    }
    if (state && prefs) {
      prefs.analytics.checked = Boolean(state.analytics);
      prefs.marketing.checked = Boolean(state.marketing);
    }
    banner.hidden = false;
    btnAccept.focus({ preventScroll: true });
  };

  const decide = (next) => { state = save(next); apply(state); hide(); };
  btnAccept.addEventListener('click', () => (needed ? decide({ analytics: true, marketing: true }) : hide()));
  btnReject.addEventListener('click', () => decide({ analytics: false, marketing: false }));
  btnCustom.addEventListener('click', () => {
    if (prefs.hidden) { prefs.hidden = false; btnCustom.textContent = 'Salva le scelte'; return; }
    decide({ analytics: prefs.analytics.checked, marketing: prefs.marketing.checked });
  });
  banner.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state) hide(); });
  document.querySelectorAll('[data-cookie-open]').forEach((b) => b.addEventListener('click', show));

  const forced = import.meta.env.DEV && new URLSearchParams(location.search).has('cookie');
  if ((needed && !state) || forced) show();
}
