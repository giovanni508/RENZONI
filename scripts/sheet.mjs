// Compone le schermate in fogli di contatto (2 colonne) per una revisione rapida. Uso: node scripts/sheet.mjs <prefisso> [colonne] [larghezza]
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import path from 'node:path';
const [prefix, cols = '2', width = '720'] = process.argv.slice(2);
const dir = path.resolve('.shots');
const files = readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.png') && !f.includes('sheet')).sort();
const C = +cols, W = +width;
for (let s = 0; s < files.length; s += C * 2) {
  const batch = files.slice(s, s + C * 2);
  const imgs = await Promise.all(batch.map((f) => sharp(path.join(dir, f)).resize({ width: W }).toBuffer({ resolveWithObject: true })));
  const H = Math.max(...imgs.map((i) => i.info.height));
  const rows = Math.ceil(imgs.length / C);
  const out = path.join(dir, `${prefix}sheet-${String(s / (C * 2)).padStart(2, '0')}.jpg`);
  await sharp({ create: { width: C * W + (C - 1) * 8, height: rows * H + (rows - 1) * 8, channels: 3, background: '#ff00aa' } })
    .composite(imgs.map((im, i) => ({ input: im.data, left: (i % C) * (W + 8), top: Math.floor(i / C) * (H + 8) })))
    .jpeg({ quality: 80 }).toFile(out);
  console.log(out, batch.join(' '));
}
