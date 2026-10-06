// HERO: ventaglio interattivo (la parola "accende" prova i colori), trasformazione allo scroll
// (il logo entra nella navbar, il drappo nero si solleva verso l'angolo dei drappi e scopre la luce).
import { gsap, ScrollTrigger, reduced, saveData, canHover } from './motion.js';
import { setNavTheme, setNavBrand } from './nav.js';
import { track } from './tracking.js';

const hero = document.querySelector('.hero');

export function initHero() {
  if (!hero) return;
  settleIntro();
  initFan();
  if (!reduced) initScrollTransform();
  else setNavTheme('dark');
  // WebGL solo con mouse/trackpad su schermi ampi; su mobile la stessa idea in versione leggera (CSS).
  if (!reduced && !saveData && canHover && innerWidth >= 768) loadGL();
  else if (!reduced) initGlowFollow();
}

/* ------------------------------------------------------------------ ingresso */
function settleIntro() {
  // A fine coreografia CSS togliamo le animazioni (lo stato finale coincide con lo stile di base).
  const done = () => hero.classList.add('is-settled');
  if (reduced) return done();
  setTimeout(done, 3000);
}

/* ------------------------------------------------------------------ ventaglio */
let current = getComputedStyle(hero).getPropertyValue('--accent-word').trim() || '#D8E348';

export function setAccent(color) {
  const word = hero.querySelector('[data-accent]');
  if (!word || color === current) return;
  current = color;
  if (reduced) { hero.style.setProperty('--accent-word', color); return; }
  // il velo del nuovo colore entra da sinistra; a fine corsa diventa il colore di base
  gsap.killTweensOf(word);
  word.style.setProperty('--to', color);
  gsap.fromTo(word, { '--wipe': '100%' }, {
    '--wipe': '0%',
    duration: 0.7,
    ease: 'drape',
    onComplete: () => { hero.style.setProperty('--accent-word', color); gsap.set(word, { '--wipe': '100%' }); },
  });
}

function initFan() {
  const fan = hero.querySelector('.fan');
  if (!fan) return;
  const cards = [...fan.querySelectorAll('.fan__card')];
  // texture dei cartoncini: caricate ora (dopo l'immagine principale), applicate quando sono pronte
  Promise.all(cards.map((_, i) => {
    const im = new Image();
    im.src = `/assets/img/fan/card-${i}.webp`;
    return im.decode().catch(() => {});
  })).then(() => fan.classList.add('is-textured'));
  let demo = null;
  let used = false;

  const select = (card, { press = false, source = 'hover' } = {}) => {
    setAccent(card.dataset.color);
    if (press) {
      cards.forEach((c) => c.setAttribute('aria-pressed', String(c === card)));
    }
    if (!used && source !== 'demo') {
      used = true;
      fan.classList.add('is-used');
      demo?.kill();
      track('hero_fan_interaction', { color: card.dataset.color });
    }
  };

  // Tastiera: un solo punto di tabulazione, frecce per scorrere i cartoncini.
  cards.forEach((c, i) => c.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  fan.addEventListener('keydown', (e) => {
    const i = cards.indexOf(document.activeElement);
    if (i < 0) return;
    const dir = { ArrowRight: -1, ArrowUp: -1, ArrowLeft: 1, ArrowDown: 1 }[e.key];
    if (dir === undefined) return;
    e.preventDefault();
    const next = cards[(i + dir + cards.length) % cards.length];
    cards.forEach((c) => c.setAttribute('tabindex', c === next ? '0' : '-1'));
    next.focus();
    select(next, { source: 'key' });
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => select(card, { press: true, source: 'click' }));
    if (canHover) card.addEventListener('pointerenter', () => select(card));
    card.addEventListener('focus', () => select(card, { source: 'focus' }));
  });

  // Touch: trascinando il dito sul ventaglio si "sfogliano" i cartoncini.
  fan.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch' || !e.isPrimary) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.fan__card');
    if (el) select(el, { press: true, source: 'drag' });
  }, { passive: true });

  // Il ventaglio si apre di piu' quando il cursore si avvicina.
  if (canHover && !reduced) {
    const spread = gsap.quickTo(fan, '--spread', { duration: 0.9, ease: 'silk' });
    hero.addEventListener('pointermove', (e) => {
      const r = fan.getBoundingClientRect();
      const dx = (r.right - e.clientX) / innerWidth;
      const dy = (r.bottom - e.clientY) / innerHeight;
      const near = Math.max(0, 1 - Math.hypot(dx, dy) * 1.6);
      spread(1 + near * 0.32);
    });
    hero.addEventListener('pointerleave', () => spread(1));
  }

  // Piccola dimostrazione all'avvio: la parola prova due colori e torna al giallo fluo.
  if (!reduced) {
    const pick = (i) => () => {
      if (used) return;
      cards.forEach((c, k) => c.classList.toggle('is-demo', k === i));
      select(cards[i], { source: 'demo' });
    };
    demo = gsap.timeline({ delay: 2.7 })
      .call(pick(5)).call(pick(2), null, '+=1.1').call(pick(0), null, '+=1.1')
      .call(() => cards.forEach((c) => c.classList.remove('is-demo')), null, '+=0.6');
  }
}

/* ------------------------------------------------------------------ scroll */
let glApi = null;
const glState = { open: 0 };

function initScrollTransform() {
  const stage = hero.querySelector('.hero__stage');
  const logo = hero.querySelector('.hero__logo');
  const copy = hero.querySelector('.hero__copy');
  const fan = hero.querySelector('.fan');
  const cue = hero.querySelector('.hero__scroll');
  const navLogo = document.querySelector('.nav__logo');
  const hem = hero.querySelector('.hero__hem');
  const hemPaths = hem ? [...hem.querySelectorAll('path')] : [];
  const cloth = { s: 2 };
  // Bordo del drappo: curva quadratica tra i due punti del taglio (x/W + y/H = s), che si gonfia verso la pagina
  // scoperta; la stessa curva disegna il ritaglio (clip-path: path) e l'orlo (ombre, fascia ripiegata, impunture).
  const HEM = [22, 11, 4, -9, -0.5, -12]; // distanza dal bordo di: ombre (3), fascia, filo, impunture
  const placeHem = (s) => {
    const W = hero.clientWidth;
    const H = hero.clientHeight;
    if (s >= 1.985) { stage.style.clipPath = 'none'; if (hem) hem.style.opacity = '0'; return; }
    if (s <= 0.015) { stage.style.clipPath = 'polygon(0 0, 0 0, 0 0)'; if (hem) hem.style.opacity = '0'; return; }
    const P1 = s >= 1 ? [W, H * (s - 1)] : [W * s, 0];
    const P2 = s >= 1 ? [W * (s - 1), H] : [0, H * s];
    const len = Math.hypot(W, H);
    const n = [H / len, W / len]; // normale verso la pagina scoperta (in basso a destra)
    const chord = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]);
    const bow = Math.min(90, chord * 0.075) * 2; // la curva si scosta di bow/2 al centro
    const C = [(P1[0] + P2[0]) / 2 + n[0] * bow, (P1[1] + P2[1]) / 2 + n[1] * bow];
    const f = (v) => v.toFixed(1);
    const pt = (p, d) => `${f(p[0] + n[0] * d)} ${f(p[1] + n[1] * d)}`;
    stage.style.clipPath = s >= 1
      ? `path('M0 0 L${W} 0 L${pt(P1, 0)} Q${pt(C, 0)} ${pt(P2, 0)} L0 ${H} Z')`
      : `path('M0 0 L${pt(P1, 0)} Q${pt(C, 0)} ${pt(P2, 0)} Z')`;
    if (!hem) return;
    hem.style.opacity = '1';
    hemPaths.forEach((p, i) => p.setAttribute('d', `M${pt(P1, HEM[i])} Q${pt(C, HEM[i])} ${pt(P2, HEM[i])}`));
  };


  // Spostamento del logo verso lo slot nella navbar (ricalcolato a ogni refresh/resize).
  const flight = () => {
    const a = logo.getBoundingClientRect();
    const b = navLogo.getBoundingClientRect();
    // il simbolo della navbar non ha il sottotitolo: allineiamo la larghezza del wordmark
    const scale = b.width / a.width;
    return { x: b.left - a.left, y: b.top - a.top - a.height * 0 , scale };
  };
  let f = { x: 0, y: 0, scale: 0.3 };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',
      pin: true,
      // la sezione successiva scorre SOTTO l'hero fissato: il drappo che si solleva la scopre mentre sale
      pinSpacing: false,
      scrub: 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: () => { gsap.set(logo, { clearProps: 'transform' }); },
      onRefresh: () => { f = flight(); },
      onUpdate: (self) => {
        const p = self.progress;
        setNavBrand(p > 0.42);
        setNavTheme(p > 0.9 ? 'light' : 'dark', { lock: p < 0.999 });
        glState.open = p;
        glApi?.setOpen(p);
        hero.classList.toggle('is-scrolling', p > 0.01);
      },
      onLeave: () => setNavTheme('light', { lock: false }),
      onEnterBack: () => setNavTheme('dark', { lock: true }),
    },
  });

  tl.to(copy, { y: () => -innerHeight * 0.12, opacity: 0, duration: 0.32, ease: 'power2.in' }, 0)
    .to(cue, { opacity: 0, duration: 0.12 }, 0)
    .to(fan, { xPercent: 45, yPercent: 55, rotate: 12, duration: 0.42, ease: 'power2.in' }, 0)
    .to(fan, { autoAlpha: 0, duration: 0.12 }, 0.3)
    .to(logo, {
      x: () => f.x,
      y: () => f.y,
      scale: () => f.scale,
      duration: 0.42,
      ease: 'power2.inOut',
      transformOrigin: '0% 0%',
    }, 0)
    .to(logo, { opacity: 0, duration: 0.04 }, 0.4)
    .to(cloth, {
      s: 0,
      duration: 0.82,
      ease: 'power1.inOut',
      onUpdate: () => placeHem(cloth.s),
    }, 0.18);
    // i drappi DOM (mobile e fallback) restano appoggiati sul drappo nero e vengono portati via con lui;
    // su desktop li muove lo shader (uOpen).

  // L'animazione del logo usa transformOrigin in alto a sinistra: il logo e la navbar si allineano sul bordo sinistro/alto.
  gsap.set(logo, { transformOrigin: '0% 0%' });
  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(stage, { clipPath: 'none' }));
}

/* ------------------------------------------------------------------ campo di colore (senza WebGL) */
// Versione leggera per mobile: il bagliore colorato segue il dito e l'inclinazione del telefono (Android).
function initGlowFollow() {
  const glow = hero.querySelector('.hero__glow');
  if (!glow) return;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.07;
    y += (ty - y) * 0.07;
    glow.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  hero.addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth - 0.5) * 70; ty = (e.clientY / innerHeight - 0.5) * 70; kick(); }, { passive: true });
  hero.addEventListener('pointerdown', (e) => { tx = (e.clientX / innerWidth - 0.5) * 70; ty = (e.clientY / innerHeight - 0.5) * 70; kick(); }, { passive: true });
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    addEventListener('deviceorientation', (e) => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30)) * 45;
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * 45;
      kick();
    }, { passive: true });
  }
}

/* ------------------------------------------------------------------ WebGL */
function loadGL() {
  const canvas = hero.querySelector('.hero__gl');
  if (!canvas) return;
  const start = () =>
    import('./hero-gl.js')
      .then(({ createHeroGL }) => createHeroGL(hero, canvas))
      .then((api) => {
        if (!api) return;
        glApi = api;
        api.setOpen(glState.open);
        hero.classList.add('gl-on');
      })
      .catch(() => { /* fallback statico: drappi in DOM + bagliore CSS */ });
  // Dopo il primo paint e l'ingresso: non ruba banda e CPU al caricamento iniziale.
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
  if (document.readyState === 'complete') idle(start, { timeout: 2500 });
  else addEventListener('load', () => idle(start, { timeout: 2500 }), { once: true });
}
