// Pipeline video: taglia, ritaglia, ridimensiona, toglie l'audio e codifica le clip del sito.
//
//   npm run media                 # tutte le clip
//   npm run media -- drappo lilla # solo alcune clip (per id)
//
// Per ogni clip produce in public/assets/video/:
//   <id>.mp4 / <id>-m.mp4     H.264 (universale, faststart)
//   <id>.webm / <id>-m.webm   AV1 (piu' leggero: Chrome, Firefox, Edge, Safari con decodifica hardware)
//   <id>.jpg / .webp / .avif  poster (desktop) + <id>-m.* (mobile)
// Le sorgenti HDR (HLG / BT.2020, iPhone) vengono convertite in SDR BT.709 con tone-mapping.
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CLIPS, ENCODE } from './media.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.resolve(ROOT, '../mateirali');
const OUT = path.join(ROOT, 'public/assets/video');
mkdirSync(OUT, { recursive: true });

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`${cmd} fallito:\n${r.stderr?.slice(-2000)}`);
  return r.stdout;
};

const probe = (file) => {
  const j = JSON.parse(run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,color_transfer,color_range,pix_fmt', '-of', 'json', file]));
  const s = j.streams[0];
  return { w: s.width, h: s.height, hlg: s.color_transfer === 'arib-std-b67', fullRange: s.color_range === 'pc' || /yuvj/.test(s.pix_fmt) };
};

// HLG -> lineare -> BT.709 con tone-mapping Hable (verificato a occhio: colori naturali, pelle corretta).
const TONEMAP = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';

const even = (n) => Math.round(n / 2) * 2;
const kb = (f) => (statSync(f).size / 1024).toFixed(0) + ' KB';

function filters(info, clip, outW) {
  const f = [];
  if (clip.crop) f.push(`crop=${clip.crop.w}:${clip.crop.h}:${clip.crop.x}:${clip.crop.y}`);
  const cw = clip.crop ? clip.crop.w : info.w;
  const ch = clip.crop ? clip.crop.h : info.h;
  const outH = even((ch / cw) * outW);
  f.push(`scale=${outW}:${outH}:flags=lanczos${info.fullRange && !info.hlg ? ':in_range=pc:out_range=tv' : ''}`);
  if (info.hlg) f.push(TONEMAP);
  else f.push('format=yuv420p');
  f.push(`fps=${ENCODE.fps}`);
  return { vf: f.join(','), outH };
}

async function processClip(clip) {
  const src = path.join(SRC_DIR, clip.src);
  if (!existsSync(src)) throw new Error(`Sorgente mancante: ${src}`);
  const info = probe(src);
  const report = [];
  for (const [i, outW] of clip.widths.entries()) {
    const sfx = i === 0 ? '' : '-m';
    const { vf, outH } = filters(info, clip, outW);
    const base = path.join(OUT, `${clip.id}${sfx}`);
    const common = ['-v', 'error', '-y', '-ss', String(clip.start), '-t', String(clip.dur), '-i', src, '-vf', vf, '-an', '-map_metadata', '-1'];

    run('ffmpeg', [...common, '-c:v', 'libx264', '-preset', ENCODE.h264.preset, '-crf', String(ENCODE.h264.crf + (i ? 1 : 0)),
      '-profile:v', 'high', '-level:v', '4.0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-color_primaries', 'bt709',
      '-color_trc', 'bt709', '-colorspace', 'bt709', `${base}.mp4`]);
    run('ffmpeg', [...common, '-c:v', 'libsvtav1', '-preset', String(ENCODE.av1.preset), '-crf', String(ENCODE.av1.crf + (i ? 2 : 0)),
      '-pix_fmt', 'yuv420p', '-g', '120', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', `${base}.webm`]);

    // Poster: stesso trattamento colore, fotogramma scelto.
    const png = `${base}.poster.png`;
    run('ffmpeg', ['-v', 'error', '-y', '-ss', String(clip.poster), '-i', src, '-frames:v', '1', '-vf', vf.replace(/,fps=\d+$/, ''), png]);
    const img = sharp(png);
    await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}.jpg`);
    await img.clone().webp({ quality: 72 }).toFile(`${base}.webp`);
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
    (await import('node:fs')).rmSync(png);

    report.push(`${clip.id}${sfx} ${outW}x${outH}  mp4 ${kb(`${base}.mp4`)}  webm ${kb(`${base}.webm`)}  poster avif ${kb(`${base}.avif`)}`);
  }
  return report;
}

const only = process.argv.slice(2);
const list = only.length ? CLIPS.filter((c) => only.includes(c.id)) : CLIPS;
const t0 = Date.now();
const results = await Promise.all(list.map((c) => processClip(c).catch((e) => [`ERRORE ${c.id}: ${e.message}`])));
console.log(results.flat().join('\n'));
console.log(`Fatto in ${((Date.now() - t0) / 1000).toFixed(0)} s. Clip con volti di clienti (servono liberatorie): ${list.filter((c) => c.faces).map((c) => c.id).join(', ')}`);
