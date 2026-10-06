// Genera le immagini del sito a partire dai materiali originali (che restano intatti).
//
//   npm run images
//
// - drapes.{avif,webp,png}      drappi della Copertina (alto-sinistra) scontornati con canale alfa, per l'hero
// - fabric.{avif,jpg}           tessuto nero della Copertina reso ripetibile (texture di fondo)
// - og-image.jpg                immagine social 1200x630 (Open Graph / Twitter)
// - erica.{avif,webp,jpg}       ritratto PROVVISORIO di Erica (fotogramma del reel f3988), da sostituire
// - icone: favicon.svg/.ico, apple-touch-icon.png, icon-192/512.png (dalla firma E-R)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAT = path.resolve(ROOT, '../mateirali');
const IMG = path.join(ROOT, 'public/assets/img');
const PUB = path.join(ROOT, 'public');
mkdirSync(IMG, { recursive: true });

const COVER = path.join(MAT, 'Copertina report_.png');
const kb = (b) => (b.length / 1024).toFixed(0) + ' KB';
const out = async (pipeline, file) => { const buf = await pipeline.toBuffer(); writeFileSync(file, buf); console.log(path.relative(ROOT, file).padEnd(40), kb(buf)); };

// 1) Drappi alto-sinistra con maschera poligonale sfumata (il logo resta fuori dalla maschera).
{
  const W = 1340, H = 600;
  // Bordo inferiore del gruppo di drappi (coordinate della Copertina 1920x1080), con margine di tessuto nero.
  const poly = '0,0 1340,0 1340,0 540,384 300,548 222,600 148,598 0,458';
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><filter id="f" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <polygon points="${poly}" fill="#fff" filter="url(#f)"/></svg>`);
  // linear(): porta il nero del tessuto fotografato (#141313) al nero del sito (#0A0A0A) senza toccare i colori.
  const base = sharp(COVER).extract({ left: 0, top: 0, width: W, height: H }).linear(1.05, -10);
  const { data: rgb } = await base.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: polyA } = await sharp(mask).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  // Alfa = poligono x luminosita': il tessuto nero attorno ai drappi diventa trasparente (niente bordo
  // rettangolare sul fondo del sito), i drappi (bianco, lime, rosa, teal) restano pieni.
  const alpha = Buffer.alloc(W * H);
  const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  for (let i = 0; i < W * H; i++) {
    const m = Math.max(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) / 255;
    alpha[i] = Math.round(polyA[i] * smooth(0.07, 0.2, m));
  }
  const rgba = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  for (const [w, sfx] of [[W, ''], [780, '-m']]) {
    const s = sharp(rgba).resize({ width: w });
    await out(s.clone().avif({ quality: 58, effort: 7 }), path.join(IMG, `drapes${sfx}.avif`));
    await out(s.clone().webp({ quality: 80, alphaQuality: 90 }), path.join(IMG, `drapes${sfx}.webp`));
  }
}

// 2) Texture di tessuto nero ripetibile (riquadro in basso a sinistra della Copertina, solo tessuto).
//    Filtro passa-alto (originale - sfocatura) per togliere le variazioni di luce e tenere solo la trama,
//    poi specchiatura 2x2 per avere bordi continui. Il risultato e' una trama neutra da usare in sovrapposizione.
{
  const S = 256;
  const region = sharp(COVER).extract({ left: 120, top: 790, width: S, height: S }).greyscale();
  const { data: px } = await region.clone().raw().toBuffer({ resolveWithObject: true });
  const { data: blur } = await region.clone().blur(14).raw().toBuffer({ resolveWithObject: true });
  const hp = Buffer.alloc(S * S);
  for (let i = 0; i < hp.length; i++) hp[i] = Math.max(0, Math.min(255, 128 + (px[i] - blur[i]) * 2.2));
  const tile = await sharp(hp, { raw: { width: S, height: S, channels: 1 } }).png().toBuffer();
  const parts = [[tile, 0, 0], [await sharp(tile).flop().toBuffer(), S, 0], [await sharp(tile).flip().toBuffer(), 0, S], [await sharp(tile).flip().flop().toBuffer(), S, S]];
  const buf = await sharp({ create: { width: S * 2, height: S * 2, channels: 3, background: '#808080' } })
    .composite(parts.map(([input, left, top]) => ({ input, left, top }))).greyscale().png().toBuffer();
  await out(sharp(buf).jpeg({ quality: 62, mozjpeg: true }), path.join(IMG, 'fabric.jpg'));
  await out(sharp(buf).avif({ quality: 40, effort: 7 }), path.join(IMG, 'fabric.avif'));
}

// 3) Open Graph 1200x630 dalla Copertina (gia' contiene logo, drappi e ventaglio).
await out(sharp(COVER).resize(1200, 675).extract({ left: 0, top: 22, width: 1200, height: 630 }).jpeg({ quality: 84, mozjpeg: true }), path.join(PUB, 'og-image.jpg'));

// 4) Ritratto provvisorio: card finale del reel f3988 (Erica con la cornice arcobaleno).
{
  const src = path.join(MAT, 'f3988dafcafa4139933da4314be2fafd.mov');
  const png = path.join(tmpdir(), `erica-${process.pid}.png`);
  const TM = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '46.5', '-i', src, '-frames:v', '1', '-vf', TM, png]);
  const crop = sharp(png).extract({ left: 196, top: 0, width: 1000, height: 1100 });
  const buf = await crop.toBuffer();
  for (const [w, sfx] of [[800, ''], [480, '-m']]) {
    const s = sharp(buf).resize({ width: w });
    await out(s.clone().avif({ quality: 55, effort: 6 }), path.join(IMG, `erica${sfx}.avif`));
    await out(s.clone().webp({ quality: 78 }), path.join(IMG, `erica${sfx}.webp`));
    await out(s.clone().jpeg({ quality: 80, mozjpeg: true }), path.join(IMG, `erica${sfx}.jpg`));
  }
}

// 5) Icone dalla firma E-R: il nodo centrale (anelli della E e della R), tratto ingrossato per la leggibilita' a 16-32 px.
{
  const sign = readFileSync(path.join(ROOT, 'src/assets/logo/sign.svg'), 'utf8');
  const d = sign.match(/ d="([^"]+)"/)[1];
  // riquadro del nodo nelle coordinate del logo (pt PDF)
  const vb = '268 170 196 196';
  const icon = (bg, fg, sw, r) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">` +
    (bg ? `<rect x="268" y="170" width="196" height="196" rx="${r}" fill="${bg}"/>` : '') +
    `<path d="${d}" fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  // favicon.svg con supporto tema chiaro/scuro
  const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><style>rect{fill:#0a0a0a}path{stroke:#e2e2da}@media (prefers-color-scheme:light){rect{fill:#0a0a0a}}</style>` +
    `<rect x="268" y="170" width="196" height="196" rx="40"/><path d="${d}" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  writeFileSync(path.join(PUB, 'favicon.svg'), fav);
  const png = async (size, sw, r, file) => {
    const b = await sharp(Buffer.from(icon('#0a0a0a', '#e2e2da', sw, r)), { density: 72 * size / 196 * 4 }).resize(size, size).png().toBuffer();
    writeFileSync(path.join(PUB, file), b); console.log(file.padEnd(40), kb(b)); return b;
  };
  await png(180, 7, 0, 'apple-touch-icon.png');
  await png(192, 7, 0, 'icon-192.png');
  await png(512, 5, 0, 'icon-512.png');
  // favicon.ico (PNG incapsulato 32x32 + 16x16)
  const p32 = await sharp(Buffer.from(icon('#0a0a0a', '#e2e2da', 11, 36)), { density: 300 }).resize(32, 32).png().toBuffer();
  const p16 = await sharp(Buffer.from(icon('#0a0a0a', '#e2e2da', 14, 36)), { density: 300 }).resize(16, 16).png().toBuffer();
  const ico = (imgs) => {
    const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
    let offset = 6 + 16 * imgs.length; const dirs = [];
    for (const { size, data } of imgs) {
      const e = Buffer.alloc(16); e.writeUInt8(size, 0); e.writeUInt8(size, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
      e.writeUInt32LE(data.length, 8); e.writeUInt32LE(offset, 12); offset += data.length; dirs.push(e);
    }
    return Buffer.concat([header, ...dirs, ...imgs.map((i) => i.data)]);
  };
  const icoBuf = ico([{ size: 32, data: p32 }, { size: 16, data: p16 }]);
  writeFileSync(path.join(PUB, 'favicon.ico'), icoBuf); console.log('favicon.ico'.padEnd(40), kb(icoBuf));
  // anteprima di controllo (non pubblicata)
  if (process.env.ICON_PREVIEW) await sharp(Buffer.from(icon('#0a0a0a', '#e2e2da', 9, 40)), { density: 300 }).resize(256, 256).png().toFile(process.env.ICON_PREVIEW);
}
// 6) Tessuto nero "scuro" pronto all'uso (niente blend-mode): trama visibile ma sottile, base #0E0E0E.
{
  const hp = await sharp(path.join(IMG, 'fabric.jpg')).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = hp.info;
  const ob = Buffer.alloc(w * h);
  for (let i = 0; i < ob.length; i++) ob[i] = Math.max(0, Math.min(255, 15 + (hp.data[i] - 128) * 0.5));
  const buf = await sharp(ob, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  await out(sharp(buf).jpeg({ quality: 88, mozjpeg: true }), path.join(IMG, "fabric-dark.jpg"));
  await out(sharp(buf).avif({ quality: 45, effort: 7 }), path.join(IMG, 'fabric-dark.avif'));
}

// 7) Cartoncini del ventaglio: grana di stampa e luce REALI dei cartoncini fotografati nella Copertina,
//    applicate ai colori di marca; spicchi che partono dall'angolo come nella foto; bordo di cartone visibile.
{
  const FAN = path.join(IMG, 'fan');
  mkdirSync(FAN, { recursive: true });
  const S = 960; // calcolo a doppia risoluzione, poi riduzione a 480 px (bordi degli spicchi antialiasati)
  // campione uniforme di cartoncino stampato (rosa e giallo della Copertina) -> solo la variazione di luminosita'
  const grainOf = async (left, top, width, height) => {
    // passa-alto: resta solo la trama della carta stampata, senza ombre o sfumature di luce della foto
    const base = sharp(COVER).extract({ left, top, width, height }).resize(S, S, { kernel: 'lanczos3' }).greyscale();
    const { data } = await base.clone().raw().toBuffer({ resolveWithObject: true });
    const { data: soft } = await base.clone().blur(10).raw().toBuffer({ resolveWithObject: true });
    return Float32Array.from(data, (v, i) => (v - soft[i]) / 255);
  };
  const grains = [await grainOf(1350, 900, 90, 90), await grainOf(1680, 780, 120, 90), await grainOf(1070, 920, 120, 110)];
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  // [a, b, c] come in index.html (spicchio c vicino al bordo sinistro, poi a, poi b)
  const CARDS = [
    ['#D8E348', '#B7C21F', '#F4F4F0'], ['#975290', '#8B8EA7', '#C9B7E2'], ['#146C78', '#7DB3B3', '#2A9AA8'],
    ['#707726', '#7DB3B3', '#8B8EA7'], ['#E1800A', '#DAD90F', '#975290'], ['#DE9CBA', '#E797AA', '#D31728'], ['#D31728', '#E797AA', '#975290'],
  ];
  const edgeCol = hex('#E3DED2');
  const cutCol = hex('#A39C8F');
  for (const [n, [a, b, c]] of CARDS.entries()) {
    const cols = { a: hex(a), b: hex(b), c: hex(c) };
    const g = grains[n % grains.length];
    const px = Buffer.alloc(S * S * 4);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      // angolo dal vertice in basso a sinistra: 0 = lungo il bordo sinistro, 90 = lungo il bordo inferiore
      const ang = (Math.atan2(x + 0.5, S - y - 0.5) * 180) / Math.PI;
      const base = ang < 24 ? cols.c : ang < 58 ? cols.a : cols.b;
      const i = y * S + x;
      const light = 1 + g[i] * 3.4 - (x / S) * 0.06 - (y / S) * 0.05; // grana + luce radente come nella foto
      const dEdge = Math.min(x, y, S - 1 - x, S - 1 - y);
      // spessore del cartone: taglio in ombra (3 px), bordo chiaro (7 px), lieve ombra interna sul colore
      const col = dEdge < 3 ? cutCol : dEdge < 10 ? edgeCol : base;
      const k = dEdge < 10 ? 1 + g[i] * 1.2 : dEdge < 14 ? light * 0.9 : light;
      px[i * 4] = Math.max(0, Math.min(255, col[0] * k));
      px[i * 4 + 1] = Math.max(0, Math.min(255, col[1] * k));
      px[i * 4 + 2] = Math.max(0, Math.min(255, col[2] * k));
      px[i * 4 + 3] = 255;
    }
    const img = sharp(await sharp(px, { raw: { width: S, height: S, channels: 4 } }).resize(480, 480, { kernel: 'lanczos3' }).png().toBuffer());
    await out(img.clone().avif({ quality: 55, effort: 7 }), path.join(FAN, `card-${n}.avif`));
    await out(img.clone().webp({ quality: 80 }), path.join(FAN, `card-${n}.webp`));
  }
}

// 9) Ritratto provvisorio con passe-partout nero regolare (niente bande irregolari).
{
  for (const sfx of ['', '-m']) {
    const srcJpg = path.join(IMG, `erica${sfx}.jpg`);
    const trimmed = await sharp(srcJpg).trim({ background: '#000000', threshold: 28 }).toBuffer({ resolveWithObject: true });
    const pad = Math.round(trimmed.info.width * 0.06);
    const framed = await sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#0A0A0A' }).toBuffer({ resolveWithObject: true });
    const s = sharp(framed.data);
    await out(s.clone().avif({ quality: 55, effort: 6 }), path.join(IMG, `erica${sfx}.avif`));
    await out(s.clone().webp({ quality: 78 }), path.join(IMG, `erica${sfx}.webp`));
    await out(s.clone().jpeg({ quality: 80, mozjpeg: true }), path.join(IMG, `erica${sfx}.jpg`));
    console.log(`erica${sfx}: ${framed.info.width}x${framed.info.height}`);
  }
}
console.log('Immagini generate.', existsSync(path.join(IMG, 'drapes.avif')) ? '' : '(attenzione: drapes mancante)');
