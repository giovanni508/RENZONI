// Schermate di verifica con il Chrome di sistema (playwright-core, nessun browser da scaricare).
//
//   npm run shots                         # http://localhost:5173, larghezze 390 768 1440
//   npm run shots -- --url http://localhost:4173 --widths 360,390,768,1024,1440,1920 --full
//
// Salva in ./.shots/: hero dopo l'ingresso, hero a meta' trasformazione, e (con --full) l'intera pagina
// scorrendo davvero (cosi' le animazioni legate allo scroll si attivano).
import { chromium } from 'playwright-core';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const URL = arg('url', 'http://localhost:5173/');
const WIDTHS = arg('widths', '390,768,1440').split(',').map(Number);
const FULL = args.includes('--full');
const OUT = path.resolve(ROOT, arg('out', '.shots'));
const ONLY = arg('only', '');
const REDUCED = args.includes('--reduced');
const PREFIX = REDUCED ? 'rm-' : '';
mkdirSync(OUT, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

const heights = { 360: 740, 390: 844, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });

for (const w of WIDTHS) {
  const h = heights[w] || 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  if (!ONLY || ONLY === 'hero') await page.screenshot({ path: path.join(OUT, `${PREFIX}${w}-hero.png`) });

  // a meta' della trasformazione dell'hero
  if (!ONLY || ONLY === 'hero') {
    await page.mouse.wheel(0, h * 0.55);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(OUT, `${PREFIX}${w}-hero-mid.png`) });
  }

  if (FULL) {
    // scorre tutta la pagina a passi, fotografando ogni schermata
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    let y = 0;
    let i = 0;
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    while (y < total && i < 60) {
      await page.mouse.wheel(0, h * 0.9);
      await page.waitForTimeout(1300);
      y = await page.evaluate(() => window.scrollY);
      await page.screenshot({ path: path.join(OUT, `${PREFIX}${w}-scroll-${String(i).padStart(2, '0')}.png`) });
      i++;
      const atEnd = await page.evaluate(() => Math.ceil(window.scrollY + innerHeight) >= document.documentElement.scrollHeight - 2);
      if (atEnd) break;
    }
  }
  console.log(`${w}x${h}`, logs.length ? `\n  ${logs.join('\n  ')}` : 'nessun errore in console');
  await ctx.close();
}
await browser.close();
