// Font self-hosted, alleggeriti: sottoinsieme latino per l'italiano + assi variabili ridotti a quelli usati.
//
//   npm run fonts
//
// - Bodoni Moda (titoli): asse opsz completo e pesi 400-600. Il CSS fissa opsz ~28 e peso 450 sui titoli grandi:
//   all'ottica 96 i filetti diventano troppo sottili per gli schermi (si spezzano).
// - Bodoni Moda Italic: come sopra.
// - Montserrat (testi, etichette): pesi 400-600 (gli unici usati nel CSS).
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/assets/fonts');
mkdirSync(OUT, { recursive: true });
const NM = (p) => path.join(ROOT, 'node_modules', p);

// ASCII stampabile + lettere accentate italiane (e qualche europea per nomi propri) + tipografia.
let chars = '';
for (let c = 0x20; c <= 0x7e; c++) chars += String.fromCharCode(c);
chars += 'àèéìíòóùúÀÈÉÌÍÒÓÙÚâêîôûäëïöüçñÇÑßæœÆŒ';
chars += '’‘“”«»–—…·•€°×→←↑↓ ';

const jobs = [
  { src: '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2', out: 'bodoni-moda-latin-opsz-normal.woff2', axes: { wght: { min: 400, max: 600 } } },
  { src: '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2', out: 'bodoni-moda-latin-opsz-italic.woff2', axes: { wght: { min: 400, max: 600 } } },
  { src: '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2', out: 'montserrat-latin-wght-normal.woff2', axes: { wght: { min: 400, max: 600 } } },
];

for (const j of jobs) {
  const input = readFileSync(NM(j.src));
  const output = await subsetFont(input, chars, { targetFormat: 'woff2', variationAxes: j.axes });
  writeFileSync(path.join(OUT, j.out), output);
  console.log(j.out.padEnd(44), `${(input.length / 1024).toFixed(0)} KB -> ${(output.length / 1024).toFixed(0)} KB`);
}
