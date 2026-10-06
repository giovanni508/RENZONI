// Test end-to-end del form contatti (Chrome di sistema + playwright-core).
//
//   npm run test:form
//
// Costruisce una build di prova con un endpoint finto (https://form.test/submit), la serve sulla 4174
// e intercetta le richieste: verifica validazione, invio riuscito, errore del server, honeypot e dataLayer.
import { chromium } from 'playwright-core';
import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.shots');
mkdirSync(OUT, { recursive: true });
const ENDPOINT = 'https://form.test/submit';

execSync('npx vite build --outDir dist-test --emptyOutDir', { cwd: ROOT, stdio: 'ignore', env: { ...process.env, VITE_FORM_ENDPOINT: ENDPOINT } });
const server = spawn('npx', ['vite', 'preview', '--outDir', 'dist-test', '--port', '4174', '--strictPort'], { cwd: ROOT, shell: true });
// attende che il server di anteprima risponda (max 30 s)
for (let i = 0; i < 60; i++) {
  try { const r = await fetch('http://localhost:4174/'); if (r.ok) break; } catch { /* non ancora pronto */ }
  await new Promise((r) => setTimeout(r, 500));
}

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => existsSync(p));
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const results = [];
const check = (name, ok, extra = '') => { results.push(`${ok ? 'OK  ' : 'FAIL'} ${name}${extra ? ` (${extra})` : ''}`); };

async function run(label, { width, height, mobile }, mode) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  let hits = 0;
  let lastBody = '';
  await page.route(ENDPOINT, async (route) => {
    hits++;
    lastBody = decodeURIComponent((route.request().postData() || '').replaceAll('+', ' '));
    if (mode === 'error') return route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' });
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true}' });
  });
  await page.goto('http://localhost:4174/#contatti', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.locator('#contatti').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  if (mode === 'ok') {
    await page.click('.btn--submit');
    await page.waitForTimeout(300);
    const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.map((e) => e.name));
    check(`${label}: invio a vuoto mostra gli errori`, invalid.includes('nome') && invalid.includes('email') && invalid.includes('privacy'), invalid.join(','));
    const focused = await page.evaluate(() => document.activeElement?.name);
    check(`${label}: focus sul primo campo non valido`, focused === 'nome', focused);
    await page.screenshot({ path: path.join(OUT, `form-${label}-errori.png`), fullPage: false });

    await page.fill('#f-name', 'Giulia Bianchi');
    await page.fill('#f-email', 'giulia@');
    await page.locator('#f-phone').focus();
    await page.waitForTimeout(150);
    const emailErr = await page.textContent('#f-email-err');
    check(`${label}: email incompleta segnalata al blur`, /incompleta/.test(emailErr || ''), emailErr);
    await page.fill('#f-email', 'giulia@example.com');
    await page.waitForTimeout(100);
    const emailOk = await page.getAttribute('#f-email', 'aria-invalid');
    check(`${label}: errore email si corregge in tempo reale`, emailOk === 'false');
    await page.fill('#f-phone', '+39 333 123 4567');
    await page.click('label[for="s-facial"]');
    await page.fill('#f-msg', 'Vorrei capire se sono Autunno o Inverno.');
    await page.selectOption('#f-source', 'Instagram');
    await page.click('label[for="f-privacy"]');
    await page.click('.btn--submit');
    await page.waitForSelector('#form-success:not([hidden])', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1600);
    const successVisible = await page.isVisible('#form-success');
    const name = await page.textContent('[data-success-name]');
    check(`${label}: invio riuscito -> conferma animata`, successVisible && /Giulia/.test(name || ''), name);
    check(`${label}: una sola richiesta all'endpoint`, hits === 1, `richieste: ${hits}`);
    check(`${label}: payload completo`, /Giulia Bianchi/.test(lastBody) && /Facial Shape/.test(lastBody) && !/website=/.test(lastBody), '');
    const events = await page.evaluate(() => window.dataLayer.map((e) => e.event).filter(Boolean));
    check(`${label}: eventi dataLayer form_start + generate_lead`, events.includes('form_start') && events.includes('generate_lead'), events.join(','));
    await page.screenshot({ path: path.join(OUT, `form-${label}-successo.png`) });
  }

  if (mode === 'error') {
    await page.fill('#f-name', 'Marta Neri');
    await page.fill('#f-email', 'marta@example.com');
    await page.click('label[for="f-privacy"]');
    await page.click('.btn--submit');
    await page.waitForTimeout(1200);
    const status = await page.textContent('.form__status');
    const hasMail = await page.$('.form__status a[href^="mailto:"]');
    check(`${label}: errore server -> messaggio e alternativa email`, /Non sono riuscita/.test(status || '') && Boolean(hasMail), status);
    const btnLabel = await page.textContent('.btn__label');
    check(`${label}: pulsante torna utilizzabile`, /Invia la richiesta/.test(btnLabel || ''), btnLabel);
    await page.screenshot({ path: path.join(OUT, `form-${label}-errore-server.png`) });
  }

  if (mode === 'honeypot') {
    await page.fill('#f-name', 'Bot');
    await page.fill('#f-email', 'bot@example.com');
    await page.evaluate(() => { document.getElementById('f-website').value = 'http://spam.example'; });
    await page.click('label[for="f-privacy"]');
    await page.click('.btn--submit');
    await page.waitForTimeout(1200);
    check(`${label}: honeypot compilato -> nessun invio`, hits === 0, `richieste: ${hits}`);
  }
  await ctx.close();
}

try {
  await run('mobile', { width: 390, height: 844, mobile: true }, 'ok');
  await run('desktop', { width: 1440, height: 900, mobile: false }, 'ok');
  await run('desktop', { width: 1440, height: 900, mobile: false }, 'error');
  await run('mobile', { width: 390, height: 844, mobile: true }, 'honeypot');
} finally {
  await browser.close();
  server.kill();
  if (process.platform === 'win32') { try { execSync('npx kill-port 4174', { stdio: 'ignore' }); } catch { /* */ } }
}
console.log(results.join('\n'));
process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;
