// HERO WebGL (OGL, caricato a parte dopo il primo paint).
// Un solo passaggio a schermo intero:
//  1) campo di colore "seta": pieghe di luce nei colori dei drappi, vive negli angoli e lascia scuro il centro (testo)
//  2) i drappi fotografici della Copertina, con un'increspatura da tessuto e la spinta del puntatore/dito/giroscopio
// Il canvas sta dentro .hero__stage: il clip-path del "drappo che si solleva" vale anche per lui.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform vec2 uRes;      // dimensioni in px CSS
uniform float uTime;
uniform vec2 uMouse;    // px CSS (smussato)
uniform float uMouseOn; // 0..1
uniform float uOpen;    // avanzamento dello scroll dell'hero
uniform vec4 uDrape;    // rettangolo dei drappi in px CSS (x, y, w, h)
uniform sampler2D uTex;
uniform float uTexOn;
uniform float uQuality; // 1 desktop, 0 mobile (meno ottave)
varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    if (float(i) > 1.0 + uQuality * 2.0) break;
    v += a * noise(p); p *= 2.03; a *= 0.5;
  }
  return v;
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 uv = px / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // --- campo di colore: pieghe di seta ---
  vec2 m = vec2(uMouse.x / uRes.y, uMouse.y / uRes.y);
  float md = distance(q, m);
  float lift = exp(-md * md * 7.0) * uMouseOn;
  float n = fbm(q * 1.5 + vec2(t * 0.025, -t * 0.02));
  float w = fbm(q * 2.2 + n * 1.7 + vec2(-t * 0.018, t * 0.012) + (q - m) * lift * 0.6);
  float folds = sin((uv.x * 1.25 + uv.y * 0.95) * 6.5 + w * 5.2 - t * 0.22);
  float sheen = pow(0.5 + 0.5 * folds, 5.0);

  float d = clamp((uv.x + uv.y) * 0.5 + (w - 0.5) * 0.28, 0.0, 1.0);
  vec3 teal = vec3(0.078, 0.424, 0.471);
  vec3 lime = vec3(0.847, 0.890, 0.282);
  vec3 plum = vec3(0.510, 0.184, 0.416);
  vec3 red = vec3(0.827, 0.090, 0.157);
  vec3 orange = vec3(0.882, 0.502, 0.039);
  vec3 col = mix(teal, lime, smoothstep(0.02, 0.2, d) * (1.0 - smoothstep(0.24, 0.42, d)));
  col = mix(col, plum, smoothstep(0.36, 0.58, d));
  col = mix(col, red, smoothstep(0.6, 0.82, d));
  col = mix(col, orange, smoothstep(0.84, 1.0, d) * 0.55);

  float tl = 1.0 - smoothstep(0.05, 0.95, length(uv * vec2(1.0, 1.25)));
  float br = 1.0 - smoothstep(0.05, 0.95, length((uv - 1.0) * vec2(1.0, 1.25)));
  float mask = max(tl, br) * 0.92 + 0.08;
  float a = (sheen * 0.62 + n * 0.1 + lift * 0.42) * mask * 0.42 * (1.0 - uOpen * 0.7);
  vec4 field = vec4(col * a, a);

  // --- drappi della Copertina ---
  float sh = smoothstep(0.18, 1.0, uOpen); sh *= sh;
  vec4 r = uDrape;
  r.x -= r.z * 0.14 * sh;
  r.y -= r.w * 0.18 * sh;
  vec2 duv = (px - r.xy) / r.zw;
  float edge = smoothstep(0.1, 1.1, duv.x * 0.45 + duv.y);
  vec2 dir = normalize(vec2(1.0, 0.46));
  float wave = sin(dot(duv, dir) * 8.5 - t * 1.05) * 0.55 + sin(dot(duv, vec2(-0.42, 1.0)) * 12.0 + t * 0.7) * 0.25;
  vec2 offs = vec2(-dir.y, dir.x) * wave * 0.0055 * (0.35 + edge);
  vec2 mp = (uMouse - r.xy) / r.zw;
  vec2 dm = (duv - mp) * vec2(r.z / r.w, 1.0);
  float push = exp(-dot(dm, dm) * 18.0) * uMouseOn;
  offs += normalize(dm + 1e-4) * push * 0.012;
  vec2 tuv = duv + offs;
  vec4 tex = texture2D(uTex, clamp(tuv, 0.001, 0.999));
  float inside = step(0.0, tuv.x) * step(0.0, tuv.y) * step(tuv.x, 1.0) * step(tuv.y, 1.0);
  tex.rgb *= 1.0 + (wave * 0.07 - push * 0.08) * (0.5 + edge);
  tex *= inside * uTexOn;

  gl_FragColor = tex + field * (1.0 - tex.a);
}
`;

export async function createHeroGL(hero, canvas) {
  const mobile = matchMedia('(max-width: 767px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.35);
  let renderer;
  try {
    renderer = new Renderer({ canvas, dpr, alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.clearColor(0, 0, 0, 0);

  const drapesEl = hero.querySelector('.hero__drapes img');
  // flipY false: nello shader v=0 e' il bordo ALTO dell'immagine (coordinate schermo).
  const texture = new Texture(gl, { generateMipmaps: false, flipY: false, premultiplyAlpha: true, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    uniforms: {
      uRes: { value: [1, 1] },
      uTime: { value: 0 },
      uMouse: { value: [0, 0] },
      uMouseOn: { value: 0 },
      uOpen: { value: 0 },
      uDrape: { value: [0, 0, 1, 1] },
      uTex: { value: texture },
      uTexOn: { value: 0 },
      uQuality: { value: mobile ? 0 : 1 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  // Texture dei drappi: la stessa immagine gia' scaricata dal browser per il DOM.
  const img = new Image();
  img.decoding = 'async';
  img.src = drapesEl?.currentSrc || drapesEl?.src || '/assets/img/drapes.webp';
  try { await img.decode(); } catch { return null; }
  texture.image = img;
  program.uniforms.uTexOn.value = 1;

  const u = program.uniforms;
  let w = 1, h = 1;
  const resize = () => {
    const r = hero.getBoundingClientRect();
    w = r.width; h = Math.max(r.height, innerHeight);
    renderer.setSize(w, h);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    u.uRes.value = [w, h];
    // il rettangolo dei drappi segue l'impaginazione dell'elemento DOM (offset*: esclude le animazioni)
    const pic = hero.querySelector('.hero__drapes');
    u.uDrape.value = [pic.offsetLeft, pic.offsetTop, pic.offsetWidth, pic.offsetWidth * (600 / 1340)];
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(hero);

  // Puntatore, dito, giroscopio (Android: senza permessi; iOS: si usa il tocco)
  const target = { x: w * 0.25, y: h * 0.3 };
  const mouse = { x: target.x, y: target.y, on: 0, active: 0 };
  const onMove = (e) => {
    const r = hero.getBoundingClientRect();
    target.x = e.clientX - r.left; target.y = e.clientY - r.top;
    mouse.active = performance.now();
  };
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerdown', onMove, { passive: true });
  const onTilt = (e) => {
    if (e.gamma == null) return;
    target.x = w * (0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.45);
    target.y = h * (0.45 + Math.max(-1, Math.min(1, (e.beta - 45) / 40)) * 0.4);
    mouse.active = performance.now();
  };
  if (mobile && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    addEventListener('deviceorientation', onTilt, { passive: true });
  }

  // Loop: solo con l'hero visibile e la scheda attiva; qualita' adattiva se i frame rallentano.
  let raf = 0;
  let running = false;
  let last = performance.now();
  let slow = 0;
  const t0 = last;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(64, now - last);
    last = now;
    if (dt > 30) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 90 && renderer.dpr > 0.75) { renderer.dpr = Math.max(0.75, renderer.dpr - 0.25); resize(); slow = 0; }
    const idle = now - mouse.active > 2500;
    if (idle) {
      // deriva lenta quando nessuno interagisce (mobile, tastiera)
      const k = (now - t0) / 1000;
      target.x = w * (0.3 + Math.sin(k * 0.21) * 0.18);
      target.y = h * (0.35 + Math.cos(k * 0.17) * 0.16);
    }
    mouse.x += (target.x - mouse.x) * 0.06;
    mouse.y += (target.y - mouse.y) * 0.06;
    mouse.on += ((idle ? 0.35 : 1) - mouse.on) * 0.04;
    u.uMouse.value = [mouse.x, mouse.y];
    u.uMouseOn.value = mouse.on;
    u.uTime.value = (now - t0) / 1000;
    renderer.render({ scene: mesh });
  };
  const play = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
  const pause = () => { running = false; cancelAnimationFrame(raf); };

  let visible = true;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? play() : pause(); });
  io.observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? pause() : play()));
  play();

  return {
    setOpen(p) { u.uOpen.value = p; },
    destroy() { pause(); io.disconnect(); ro.disconnect(); removeEventListener('deviceorientation', onTilt); },
  };
}
