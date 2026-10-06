// Erica Renzoni - bootstrap minimo.
// Il primo paint non aspetta il JavaScript: l'ingresso dell'hero (firma, titolo, drappi, ventaglio) e' CSS.
// L'interattivita' (GSAP, scroll, ventaglio, form...) parte appena la pagina e' caricata, oppure subito
// alla prima interazione (tocco, rotella, tasto) se arriva prima: cosi' l'immagine principale si dipinge
// senza attendere il JavaScript.
const root = document.documentElement;
if (import.meta.env.DEV) root.classList.add('is-dev');
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// fine ingresso garantita anche se il JS arrivasse tardi o le animazioni non partissero (scheda in background)
setTimeout(() => document.querySelector('.hero')?.classList.add('is-settled'), root.classList.contains('reduced-motion') ? 0 : 3000);

let booted = false;
const boot = () => {
  if (booted) return;
  booted = true;
  import('./js/app.js').then((m) => m.start());
};
['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((t) => addEventListener(t, boot, { once: true, passive: true }));
if (document.readyState === 'complete') requestAnimationFrame(boot);
else {
  addEventListener('load', () => requestAnimationFrame(boot), { once: true });
  setTimeout(boot, 3500); // rete lenta: non aspettiamo oltre
}
