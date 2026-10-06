// Avvio dell'interattivita' (caricato DOPO il primo paint da main.js: l'ingresso dell'hero e' tutto CSS).
// Subito: movimento di base, hero, sezioni "fissate" (in ordine di pagina) e navbar.
// Poi, a browser libero: tutto il resto (vedi deferred.js).
import { initSmoothScroll, initAnchors } from './motion.js';
import { initHero } from './hero.js';
import { initSeasons } from './seasons.js';
import { initGallery } from './gallery.js';
import { initNav } from './nav.js';
import { initTracking } from './tracking.js';

export function start() {
  initSmoothScroll();
  initAnchors();
  initHero();
  initSeasons();
  initGallery();
  initNav();
  initTracking();

  const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1800 }) : setTimeout(fn, 400));
  let started = false;
  const go = () => { if (started) return; started = true; idle(() => import('./deferred.js').then((d) => d.initDeferred())); };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, go, { once: true, passive: true }));
  if (document.readyState === 'complete') go();
  else addEventListener('load', go, { once: true });
}
