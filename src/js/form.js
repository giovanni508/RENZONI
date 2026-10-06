// FORM CONTATTI: validazione in linea, anti-spam (honeypot + tempo di compilazione + Turnstile opzionale),
// invio a un endpoint configurabile (VITE_FORM_ENDPOINT: Formspree, Web3Forms, funzione serverless, PHP),
// fallback mailto: se l'endpoint manca o fallisce, conferma animata con i prossimi passi.
import { gsap, reduced, getLenis } from './motion.js';
import { track } from './tracking.js';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY || ''; // es. Web3Forms (chiave pubblica per design)
const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITEKEY || '';
const FORMAT = (import.meta.env.VITE_FORM_FORMAT || 'form').toLowerCase(); // 'form' (urlencoded) | 'json'
const MIN_HUMAN_MS = 1800; // invii piu' rapidi = quasi certamente un bot

const RULES = {
  nome: (v) => v.trim().length >= 2 || 'Scrivi il tuo nome e cognome.',
  email: (v) => {
    const s = v.trim();
    if (!s) return 'Mi serve la tua email per risponderti.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) || "Controlla l'email: sembra incompleta (es. nome@esempio.it).";
  },
  telefono: (v) => !v.trim() || /^\+?[\d\s().-]{6,20}$/.test(v.trim()) || 'Il numero può contenere solo cifre, spazi e il prefisso +.',
  privacy: (v, el) => el.checked || 'Per inviare la richiesta serve il consenso al trattamento dei dati.',
};

export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const success = document.getElementById('form-success');
  const status = form.querySelector('.form__status');
  const submit = form.querySelector('.btn--submit');
  const label = submit.querySelector('.btn__label');
  const mailTo = form.dataset.mail || '';
  const openedAt = Date.now();
  let started = false;
  let sending = false;

  const errEl = (el) => document.getElementById(`${el.id}-err`);
  const validate = (el, show = true) => {
    const rule = RULES[el.name];
    if (!rule) return true;
    const res = rule(el.value, el);
    const ok = res === true;
    if (show) {
      const field = el.closest('.field');
      field.classList.toggle('is-invalid', !ok);
      field.classList.toggle('is-valid', ok && Boolean(el.type === 'checkbox' ? el.checked : el.value.trim()));
      el.setAttribute('aria-invalid', String(!ok));
      const err = errEl(el);
      if (err) err.textContent = ok ? '' : res;
    }
    return ok;
  };

  // Validazione: alla perdita del focus; dopo un errore, in tempo reale mentre si corregge.
  form.addEventListener('focusout', (e) => {
    const el = e.target;
    if (RULES[el.name] && el.type !== 'checkbox' && el.value.trim()) validate(el);
  });
  form.addEventListener('input', (e) => {
    if (!started) { started = true; track('form_start', { form: 'contatti' }); loadTurnstile(form); }
    const el = e.target;
    if (el.closest('.field')?.classList.contains('is-invalid')) validate(el);
  });
  form.addEventListener('change', (e) => { if (e.target.type === 'checkbox') validate(e.target); });

  // Le CTA con data-service preselezionano il servizio nel form
  document.querySelectorAll('[data-service]').forEach((a) => a.addEventListener('click', () => {
    const r = form.querySelector(`input[name="servizio"][value="${a.dataset.service}"]`);
    if (r) r.checked = true;
  }));

  const setLoading = (on) => {
    sending = on;
    submit.classList.toggle('is-loading', on);
    submit.setAttribute('aria-disabled', String(on));
    label.textContent = on ? 'Invio in corso' : 'Invia la richiesta';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    status.textContent = '';
    status.classList.remove('is-error');

    const fields = [...form.elements].filter((el) => RULES[el.name]);
    const invalid = fields.filter((el) => !validate(el));
    if (invalid.length) {
      invalid[0].focus();
      status.textContent = invalid.length === 1 ? 'Manca solo un dettaglio: controlla il campo evidenziato.' : `Controlla i ${invalid.length} campi evidenziati.`;
      status.classList.add('is-error');
      return;
    }

    const data = new FormData(form);
    const elapsed = Date.now() - openedAt;
    // Anti-spam: il campo trappola compilato o un invio istantaneo -> fingiamo il successo senza inviare.
    if (data.get('website') || elapsed < MIN_HUMAN_MS) { showSuccess(data); return; }
    data.delete('website');
    data.set('privacy', 'accettata');
    data.append('_elapsed_ms', String(elapsed));
    const subject = `Nuova richiesta dal sito: ${data.get('servizio') || 'consulenza'}`;
    data.append('_subject', subject); // Formspree
    data.append('subject', subject); // Web3Forms
    data.append('from_name', 'Sito Erica Renzoni'); // Web3Forms: mittente leggibile
    data.append('_page', location.href);
    if (ACCESS_KEY) data.append('access_key', ACCESS_KEY);

    if (!ENDPOINT) {
      // Nessun endpoint configurato: apriamo il client di posta con il messaggio gia' scritto.
      track('generate_lead', { servizio: data.get('servizio'), method: 'mailto' });
      location.href = mailtoHref(mailTo, data);
      showSuccess(data, true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, FORMAT === 'json'
        ? { method: 'POST', body: JSON.stringify(Object.fromEntries(data)), headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
        : { method: 'POST', body: new URLSearchParams(data), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      track('generate_lead', { servizio: data.get('servizio'), method: 'form' });
      showSuccess(data);
    } catch (err) {
      setLoading(false);
      status.classList.add('is-error');
      status.innerHTML = `Non sono riuscita a inviare il messaggio. Riprova tra poco oppure <a href="${mailtoHref(mailTo, data)}">mandamelo via email</a>.`;
      track('form_submit_error', { reason: String(err.message || err) });
    }
  });

  function showSuccess(data, viaMail = false) {
    const name = String(data.get('nome') || '').trim().split(/\s+/)[0];
    success.querySelector('[data-success-name]').textContent = name ? `, ${name}` : '';
    if (viaMail) {
      success.querySelector('p').textContent = 'Si è aperta la tua app di posta con il messaggio già pronto: premi invia e ti rispondo al più presto.';
    }
    const reveal = () => {
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      // il form era piu' alto della conferma: riportiamo la conferma in vista (soprattutto su mobile)
      const r = success.getBoundingClientRect();
      if (r.top < 80 || r.top > innerHeight * 0.6) {
        const y = r.top + window.scrollY - Math.max(96, innerHeight * 0.18);
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 1 });
        else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
      if (reduced) return;
      gsap.fromTo(success.querySelector('.success__sign'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'drape' });
      gsap.from(success.querySelectorAll('.success__title, .success p'), { y: 24, opacity: 0, duration: 1, stagger: 0.1, delay: 0.3 });
    };
    if (reduced) reveal();
    else gsap.to(form, { opacity: 0, y: -16, duration: 0.45, ease: 'power2.in', onComplete: reveal });
  }
}

function mailtoHref(to, data) {
  const lines = [
    `Nome: ${data.get('nome') || ''}`,
    `Email: ${data.get('email') || ''}`,
    `Telefono: ${data.get('telefono') || '-'}`,
    `Servizio: ${data.get('servizio') || '-'}`,
    `Come mi hai conosciuta: ${data.get('fonte') || '-'}`,
    '',
    String(data.get('messaggio') || ''),
  ];
  return `mailto:${to}?subject=${encodeURIComponent('Richiesta consulenza dal sito')}&body=${encodeURIComponent(lines.join('\n'))}`;
}

// Cloudflare Turnstile (opzionale): caricato solo se c'e' la chiave e solo quando si inizia a compilare.
let turnstileLoading = false;
function loadTurnstile(form) {
  if (!TURNSTILE_KEY || turnstileLoading) return;
  turnstileLoading = true;
  const box = form.querySelector('[data-turnstile]');
  box.hidden = false;
  window.onTurnstileLoad = () => window.turnstile.render(box, { sitekey: TURNSTILE_KEY, theme: 'dark', language: 'it' });
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
  s.async = true;
  document.head.append(s);
}
