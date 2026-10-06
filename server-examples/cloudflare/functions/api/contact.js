// Cloudflare Pages Function: POST /api/contact -> email tramite Resend (o il provider che preferisci).
//
// Installazione:
//  1. copia la cartella "functions" nella radice del progetto pubblicato su Cloudflare Pages
//  2. in Pages > Settings > Environment variables imposta RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
//     e (consigliato, e' gratuito) TURNSTILE_SECRET + VITE_TURNSTILE_SITEKEY per l'anti-spam
//  3. nel .env del progetto: VITE_FORM_ENDPOINT=/api/contact  e rifai la build

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  const f = new URLSearchParams(await request.text());
  const get = (k, max = 500) => (f.get(k) || '').trim().slice(0, max);

  if (get('website') || Number(get('_elapsed_ms')) < 1500) return json(200, { ok: true }); // bot

  if (env.TURNSTILE_SECRET) {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: get('cf-turnstile-response', 4096), remoteip: request.headers.get('CF-Connecting-IP') || '' }),
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
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.CONTACT_FROM, to: env.CONTACT_TO, reply_to: email, subject: `Richiesta consulenza: ${nome}`, text }),
  });
  return res.ok ? json(200, { ok: true }) : json(502, { ok: false });
}
