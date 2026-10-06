// Motore del movimento: GSAP + ScrollTrigger + Lenis, easing "da tessuto", reveal tipografici.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Un solo carattere di movimento: il tessuto che si posa (ease-out lunghi, leggera inerzia).
CustomEase.create('silk', '0.19,1,0.22,1');
CustomEase.create('drape', '0.65,0.05,0.36,1');
gsap.defaults({ ease: 'silk', duration: 1 });
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
export const reduced = root.classList.contains('reduced-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
export const saveData = root.classList.contains('save-data');
export const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const navHeight = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 64;
export const coarse = matchMedia('(pointer: coarse)').matches;
export { gsap, ScrollTrigger };

let lenis = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  // Su touch lo scroll resta nativo (piu' affidabile e leggero): Lenis solo con mouse/trackpad.
  if (reduced || coarse) return null;
  // caricato a parte: su mobile non viene nemmeno scaricato
  import('lenis').then(({ default: Lenis }) => {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // su touch lo scroll resta nativo: piu' affidabile su iOS
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  });
  return null;
}

/** Scroll verso un'ancora (con Lenis se attivo) e sposta il focus per chi usa tastiera e screen reader. */
export function scrollToTarget(target, { offset = 0, immediate = false } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const focus = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(el, { offset, immediate, duration: 1.4, onComplete: focus });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduced || immediate ? 'auto' : 'smooth' });
    setTimeout(focus, reduced ? 0 : 600);
  }
}

export function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (id === '#top') {
      lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    } else {
      scrollToTarget(el);
    }
    history.replaceState(null, '', id);
  });
}

/** Pulsanti "magnetici" (solo puntatore fine): seguono leggermente il cursore. */
export function magnetic() {
  if (reduced || !canHover) return;
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'silk' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'silk' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
