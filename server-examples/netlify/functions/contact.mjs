// Netlify Function: riceve il form e invia una email tramite Resend (https://resend.com).
//
// Installazione:
//  1. copia la cartella "netlify/functions" nella radice del progetto
//  2. su Netlify > Site settings > Environment variables imposta:
//       RESEND_API_KEY      chiave API di Resend (o adatta il codice al tuo provider email)
//       CONTACT_TO          email che riceve le richieste
//       CONTACT_FROM        mittente verificato su Resend, es. "Sito <sito@tuodominio.it>"
//       TURNSTILE_SECRET    (facoltativo) chiave segreta Cloudflare Turnstile
//  3. nel .env del progetto: VITE_FORM_ENDPOINT=/.netlify/functions/contact  e rifai la build
//
// Alternativa senza codice: Netlify Forms, Formspree o Web3Forms (vedi README).

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { ok: false });
  const f = new URLSearchParams(await req.text());
  const get = (k, max = 500) => (f.get(k) || '').trim().slice(0, max);

  if (get('website') || Number(get('_elapsed_ms')) < 1500) return json(200, { ok: true }); // bot

  if (process.env.TURNSTILE_SECRET) {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: get('cf-turnstile-response', 4096) }),
    }).then((x) => x.json()).catch(() => ({}));
    if (!r.success) return json(400, { ok: false, error: 'turnstile' });
  }

  const nome = get('nome', 80);
  const email = get('email', 120);
  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !get('privacy')) return json(422, { ok: false });

  const text = [
    `Nome: ${nome}`, `Email: ${email}`, `Telefono: ${get('telefono', 20) || '-'}`,
    `Servizio: ${get('servizio', 60) || '-'}`, `Come mi hai conosciuta: ${get('fonte', 60) || '-'}`,
    '', get('messaggio', 1500) || '-', '', `Privacy accettata il ${new Date().toLocaleString('it-IT')}`,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.CONTACT_FROM, to: process.env.CONTACT_TO, reply_to: email, subject: `Richiesta consulenza: ${nome}`, text }),
  });
  return res.ok ? json(200, { ok: true }) : json(502, { ok: false });
};
