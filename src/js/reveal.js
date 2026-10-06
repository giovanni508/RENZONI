// Reveal tipografici: le righe dei titoli risalgono dalla piega (maschera per riga).
// SplitText lavora solo quando l'elemento sta per entrare in vista (niente lavoro di layout all'avvio);
// l'animazione parte poi con ScrollTrigger. aria: 'none' -> nessun aria-label (vietato sui <p>):
// le righe sono semplici contenitori e il testo resta letto normalmente dagli screen reader.
import { gsap, reduced } from './motion.js';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

function split(el, opts) {
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    aria: 'none',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: opts.y,
        duration: opts.d,
        stagger: opts.s,
        delay: opts.delay || 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
  });
}

export function initReveal(scope = document) {
  if (reduced) return;
  const opts = new Map();
  scope.querySelectorAll('[data-split]').forEach((el) => opts.set(el, { y: 108, d: 1.15, s: 0.09 }));
  scope.querySelectorAll('[data-reveal-lines] p').forEach((el, i) => opts.set(el, { y: 100, d: 1, s: 0.06, delay: (i % 2) * 0.12 }));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      split(en.target, opts.get(en.target));
    });
  }, { rootMargin: '0px 0px 35% 0px' });
  opts.forEach((_, el) => io.observe(el));
}
