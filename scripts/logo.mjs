// Estrae il logo vettoriale da mateirali/er.pdf (pagina 1) e genera SVG puliti e animabili.
//
//   npm run logo
//
// Output (src/assets/logo/):
//   logo.svg   firma + wordmark + sottotitolo, ogni lettera e' un <path> separato (per le animazioni)
//   sign.svg   solo la firma a linea continua (un unico tracciato)
//   logo.json  metadati (viewBox, bbox delle parti) usati dal markup
//
// Il tracciato della firma nel PDF e' UNO SOLO, con stroke 1pt e capi arrotondati: lo manteniamo
// identico (nessuna deformazione), applicando solo la trasformazione della pagina alle coordinate.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDF = path.resolve(ROOT, '../mateirali/er.pdf');
const OUT = path.join(ROOT, 'src/assets/logo');
mkdirSync(OUT, { recursive: true });

const tmpSvg = path.join(tmpdir(), `er-logo-${process.pid}.svg`);
execFileSync('pdftocairo', ['-svg', '-f', '1', '-l', '1', PDF, tmpSvg]);
const src = readFileSync(tmpSvg, 'utf8');
rmSync(tmpSvg, { force: true });

// --- path helpers -----------------------------------------------------------
// pdftocairo emette solo comandi assoluti M L C Z separati da spazi.
function parsePath(d) {
  const tok = d.trim().split(/[\s,]+/);
  const cmds = [];
  let i = 0;
  while (i < tok.length) {
    const c = tok[i++];
    const n = { M: 2, L: 2, C: 6, Z: 0 }[c];
    if (n === undefined) throw new Error(`Comando non gestito: ${c}`);
    cmds.push({ c, v: tok.slice(i, i + n).map(Number) });
    i += n;
  }
  return cmds;
}
const mapPts = (cmds, fn) => cmds.map(({ c, v }) => {
  const out = [];
  for (let k = 0; k < v.length; k += 2) out.push(...fn(v[k], v[k + 1]));
  return { c, v: out };
});
const fmt = (n) => (Math.round(n * 100) / 100).toString();
const toD = (cmds) => cmds.map(({ c, v }) => c + v.map(fmt).join(' ')).join('').replace(/ -/g, '-');
function bbox(cmds) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  let px = 0, py = 0;
  for (const { c, v } of cmds) {
    if (c === 'M' || c === 'L') { add(v[0], v[1]); px = v[0]; py = v[1]; }
    else if (c === 'C') {
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const u = 1 - t;
        add(u * u * u * px + 3 * u * u * t * v[0] + 3 * u * t * t * v[2] + t * t * t * v[4],
            u * u * u * py + 3 * u * u * t * v[1] + 3 * u * t * t * v[3] + t * t * t * v[5]);
      }
      px = v[4]; py = v[5];
    }
  }
  return { x0, y0, x1, y1 };
}
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });

// --- firma ------------------------------------------------------------------
const sm = src.match(/<path fill="none" stroke-width="([\d.]+)"[^>]*?d="([^"]+)" transform="matrix\(([^)]+)\)"\/>/);
if (!sm) throw new Error('Tracciato della firma non trovato nel PDF');
const [a, , , dm, e, f] = sm[3].split(',').map(Number);
const strokeW = Number(sm[1]) * Math.abs(a);
const sign = mapPts(parsePath(sm[2]), (x, y) => [a * x + e, dm * y + f]);
const signBox = bbox(sign);

// --- glifi -------------------------------------------------------------------
const glyphs = {};
for (const m of src.matchAll(/<g id="(glyph-\d+-\d+)">\s*<path d="([^"]*)"\/>\s*<\/g>/g)) glyphs[m[1]] = m[2];
const uses = [...src.matchAll(/<use xlink:href="#(glyph-(\d+)-\d+)" x="([\d.-]+)" y="([\d.-]+)"\/>/g)]
  .map((m) => ({ id: m[1], set: m[2], x: Number(m[3]), y: Number(m[4]) }));

// I glifi vuoti (spazi) non hanno tracciato: li saltiamo.
const letters = (set) => uses.filter((u) => u.set === set && glyphs[u.id]?.trim()).map((u) => {
  const cmds = mapPts(parsePath(glyphs[u.id]), (x, y) => [x + u.x, y + u.y]);
  return { cmds, box: bbox(cmds) };
});
const word = letters('0'); // ERICA RENZONI
const sub = letters('1');  // CONSULENTE D'IMMAGINE

let all = signBox;
for (const l of [...word, ...sub]) all = union(all, l.box);
const PAD = 2;
const vb = [all.x0 - PAD, all.y0 - PAD, all.x1 - all.x0 + PAD * 2, all.y1 - all.y0 + PAD * 2].map(fmt);

// --- scrittura --------------------------------------------------------------
const letterPaths = (arr, cls) => arr.map((l, i) => `<path class="${cls}" style="--i:${i}" d="${toD(l.cmds)}"/>`).join('\n    ');
const signD = toD(sign);

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-labelledby="er-logo-t">
  <title id="er-logo-t">Erica Renzoni, consulente d'immagine</title>
  <path class="lg-sign" d="${signD}" fill="none" stroke="currentColor" stroke-width="${fmt(strokeW)}" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
  <g class="lg-word" fill="currentColor">
    ${letterPaths(word, 'lg-l')}
  </g>
  <g class="lg-sub" fill="currentColor">
    ${letterPaths(sub, 'lg-s')}
  </g>
</svg>
`;
writeFileSync(path.join(OUT, 'logo.svg'), logoSvg);

const sp = 1.5;
const signVb = [signBox.x0 - sp, signBox.y0 - sp, signBox.x1 - signBox.x0 + sp * 2, signBox.y1 - signBox.y0 + sp * 2].map(fmt);
writeFileSync(path.join(OUT, 'sign.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${signVb.join(' ')}" fill="none" stroke="currentColor" stroke-width="${fmt(strokeW)}" stroke-linecap="round" stroke-linejoin="round"><path d="${signD}"/></svg>\n`);

// Sprite di <symbol> per gli usi statici (navbar, footer, conferma form): niente animazione per lettera,
// tracciati uniti. Il tratto della firma usa vector-effect non-scaling-stroke con spessore regolabile via
// --sw (default 1px): a piccole dimensioni (navbar) resta leggibile, nelle grandi resta sottile come l'originale.
const wordAll = union(word.reduce((acc, l) => union(acc, l.box), word[0].box), signBox);
const mp = 3;
const markVb = [wordAll.x0 - mp, wordAll.y0 - mp, wordAll.x1 - wordAll.x0 + mp * 2, wordAll.y1 - wordAll.y0 + mp * 2].map(fmt);
const signPath = `<path d="${signD}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="stroke-width:var(--sw,1px)"/>`;
const merged = (arr) => `<path fill="currentColor" d="${arr.map((l) => toD(l.cmds)).join('')}"/>`;
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="er-logo" viewBox="${vb.join(' ')}">${signPath}${merged(word)}${merged(sub)}</symbol>
  <symbol id="er-logo-mark" viewBox="${markVb.join(' ')}">${signPath}${merged(word)}</symbol>
  <symbol id="er-sign" viewBox="${signVb.join(' ')}"><path d="${signD}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" pathLength="1" style="stroke-width:var(--sw-u,1.6)"/></symbol>
</svg>
`;
writeFileSync(path.join(OUT, 'sprite.svg'), sprite);

const box = (b) => ({ x: +fmt(b.x0), y: +fmt(b.y0), w: +fmt(b.x1 - b.x0), h: +fmt(b.y1 - b.y0) });
const meta = {
  viewBox: vb.map(Number), signViewBox: signVb.map(Number), markViewBox: markVb.map(Number), strokeWidth: +fmt(strokeW),
  sign: box(signBox),
  word: box(word.reduce((acc, l) => union(acc, l.box), word[0].box)),
  sub: box(sub.reduce((acc, l) => union(acc, l.box), sub[0].box)),
  letters: word.length, subLetters: sub.length,
  colors: { ink: '#040606', greige: '#E2E2DA' },
};
writeFileSync(path.join(OUT, 'logo.json'), JSON.stringify(meta, null, 2) + '\n');
console.log('logo.svg', (logoSvg.length / 1024).toFixed(1) + ' KB', meta);
