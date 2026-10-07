// FACIAL SHAPE: una sagoma di viso che cambia forma mentre scorri; la sagoma tratteggiata
// la insegue come un modello che viene appoggiato, le linee rosse misurano fronte, zigomi e mandibola.
// (Nei testi niente "mascherine": Erica parla di "strumenti per la Facial Shape".)
// TODO(Erica): confermare l'elenco delle forme usate nella sua Facial Shape.
import { gsap, ScrollTrigger, reduced } from './motion.js';
import { track } from './tracking.js';

// Semi-larghezze: tw attaccatura dei capelli (y T+16), fw fronte (y 96), cw zigomi (y 150),
// jw mandibola (y 226), chw angoli del mento (y B-14). T/B: sommita' e mento.
// k: morbidezza per punto [sommita', attaccatura, fronte, zigomi, mandibola, angolo mento, mento].
const SHAPES = [
  { name: 'Ovale', T: 30, B: 292, tw: 46, fw: 67, cw: 74, jw: 56, chw: 26, k: [1, 1, 1.1, 1.1, 1, 1, 1] },
  { name: 'Tondo', T: 44, B: 280, tw: 44, fw: 76, cw: 88, jw: 76, chw: 36, k: [1, 1, 1.05, 1.1, 1.1, 1, 1.1] },
  { name: 'Quadrato', T: 40, B: 286, tw: 64, fw: 78, cw: 80, jw: 79, chw: 54, k: [0.9, 0.45, 0.7, 0.9, 0.35, 0.4, 0.8] },
  { name: 'Rettangolare', T: 20, B: 304, tw: 54, fw: 66, cw: 68, jw: 65, chw: 44, k: [0.9, 0.45, 0.8, 0.9, 0.4, 0.45, 0.8] },
  { name: 'Cuore', T: 36, B: 298, tw: 62, fw: 84, cw: 80, jw: 52, chw: 10, k: [0.8, 0.6, 0.9, 1, 1, 0.8, 0.25] },
  { name: 'Diamante', T: 30, B: 298, tw: 40, fw: 64, cw: 90, jw: 54, chw: 12, k: [1.1, 1, 0.9, 0.5, 0.9, 0.8, 0.35] },
  { name: 'Triangolo', T: 46, B: 288, tw: 26, fw: 50, cw: 68, jw: 86, chw: 60, k: [1, 1, 1, 1, 0.5, 0.5, 0.8] },
];

const C = 130;
function shapePath({ T, B, tw, fw, cw, jw, chw, k }) {
  // 12 punti in senso orario a partire dalla sommita' del capo
  const P = [
    [C, T], [C + tw, T + 16], [C + fw, 96], [C + cw, 150], [C + jw, 226], [C + chw, B - 14],
    [C, B], [C - chw, B - 14], [C - jw, 226], [C - cw, 150], [C - fw, 96], [C - tw, T + 16],
  ];
  const K = [k[0], k[1], k[2], k[3], k[4], k[5], k[6], k[5], k[4], k[3], k[2], k[1]];
  const n = P.length;
  const f = (v) => Math.round(v * 10) / 10;
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    const t1 = K[i] / 6, t2 = K[(i + 1) % n] / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t1, p1[1] + (p2[1] - p0[1]) * t1];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t2, p2[1] - (p3[1] - p1[1]) * t2];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

export function initFacial() {
  const section = document.querySelector('.facial');
  if (!section) return;
  const svg = section.querySelector('.face');
  const shape = svg.querySelector('.face__shape');
  const mask = svg.querySelector('.face__mask');
  const label = section.querySelector('[data-face-label]');
  const lines = {
    fore: svg.querySelector('.m--fore'),
    cheek: svg.querySelector('.m--cheek'),
    jaw: svg.querySelector('.m--jaw'),
  };
  const paths = SHAPES.map(shapePath);
  shape.setAttribute('d', paths[0]);
  mask.setAttribute('d', paths[0]);

  let current = 0;
  const setLabel = (i) => {
    if (label.textContent === SHAPES[i].name) return;
    label.textContent = SHAPES[i].name;
    if (!reduced) gsap.fromTo(label, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 });
  };
  const measures = (i, dur = 0.8) => {
    const s = SHAPES[i];
    const set = (el, hw) => gsap.to(el, { attr: { x1: C - hw, x2: C + hw }, duration: reduced ? 0 : dur, ease: 'drape', overwrite: true });
    set(lines.fore, s.fw); set(lines.cheek, s.cw); set(lines.jaw, s.jw);
  };
  const go = (i, dur = 0.9) => {
    current = i;
    gsap.to(shape, { morphSVG: paths[i], duration: reduced ? 0 : dur, ease: 'drape', overwrite: true });
    gsap.to(mask, { morphSVG: paths[i], duration: reduced ? 0 : dur * 1.25, delay: reduced ? 0 : 0.12, ease: 'drape', overwrite: true });
    measures(i, dur);
    setLabel(i);
    chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
  };

  // Pulsanti delle forme: per esplorare a mano (e con movimento ridotto)
  const wrap = document.createElement('div');
  wrap.className = 'face__chips';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Prova le forme del viso');
  const chips = SHAPES.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s.name;
    b.setAttribute('aria-pressed', String(i === 0));
    b.addEventListener('click', () => { st?.kill(); go(i); track('facial_shape_chip', { shape: s.name }); });
    wrap.append(b);
    return b;
  });
  section.querySelector('.facial__sticky').append(wrap);
  measures(0, 0);

  // Scorrendo, la sagoma attraversa le forme
  let st = null;
  if (!reduced) {
    st = ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 75%',
      onUpdate: (self) => {
        const i = Math.min(SHAPES.length - 1, Math.floor(self.progress * SHAPES.length * 0.9999));
        if (i !== current) go(i);
      },
    });
  }
}
