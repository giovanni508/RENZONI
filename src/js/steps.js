// COME FUNZIONA: un filo che si cuce scorrendo; i bottoni dei passaggi si "chiudono" quando il filo li raggiunge.
import { ScrollTrigger, reduced } from './motion.js';

export function initSteps() {
  const wrap = document.querySelector('.steps__wrap');
  if (!wrap) return;
  const steps = [...wrap.querySelectorAll('.step')];
  if (reduced) {
    wrap.style.setProperty('--sew', 1);
    steps.forEach((s) => s.classList.add('is-sewn'));
    return;
  }
  const horizontal = () => matchMedia('(min-width: 900px)').matches;
  let marks = [];
  const measure = () => {
    const knots = steps.map((s) => s.querySelector('.step__knot'));
    marks = knots.map((k) => (horizontal() ? k.offsetLeft + s0(k).left : k.offsetTop + s0(k).top) / (horizontal() ? wrap.offsetWidth : wrap.offsetHeight));
  };
  // posizione del bottone rispetto al contenitore del filo
  const s0 = (k) => {
    const step = k.closest('.step');
    return { left: step.offsetLeft, top: step.offsetTop };
  };
  wrap.style.setProperty('--sew', 0);
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 78%',
    end: 'bottom 62%',
    scrub: 0.6,
    onRefresh: measure,
    onUpdate: (self) => {
      const p = self.progress;
      wrap.style.setProperty('--sew', p.toFixed(4));
      steps.forEach((s, i) => s.classList.toggle('is-sewn', p >= (marks[i] ?? i / steps.length) - 0.01));
    },
  });
}
