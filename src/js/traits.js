// LE 4 CARATTERISTICHE: micro-interazioni tattili con colori reali in OKLCH.
import { gsap, ScrollTrigger, reduced } from './motion.js';
import { track } from './tracking.js';

const WORDS = {
  value: ['Molto scuro', 'Scuro', 'Medio', 'Chiaro', 'Molto chiaro'],
  chroma: ['Molto smorzata', 'Smorzata', 'Media', 'Brillante', 'Molto brillante'],
  contrast: ['Basso', 'Medio basso', 'Medio', 'Medio alto', 'Alto'],
};

export function initTraits() {
  const section = document.querySelector('.traits');
  if (!section) return;
  let touched = false;
  const touch = (what) => {
    if (!touched) { touched = true; demo?.kill(); }
    track('trait_interaction', { trait: what });
  };

  // Sottotono: radiogroup Freddo/Caldo
  const art = section.querySelector('.trait--undertone');
  const radios = [...art.querySelectorAll('[role="radio"]')];
  const names = [...art.querySelectorAll('.pair__name')];
  const setUndertone = (val, focus = false) => {
    radios.forEach((r) => {
      const on = r.dataset.value === String(val);
      r.setAttribute('aria-checked', String(on));
      r.tabIndex = on ? 0 : -1;
      if (on && focus) r.focus();
    });
    gsap.to(art, { '--undertone': val, duration: reduced ? 0 : 0.9, ease: 'drape', overwrite: true });
    names.forEach((n) => { n.textContent = val ? n.dataset.warm : n.dataset.cool; });
  };
  radios.forEach((r) => {
    r.addEventListener('click', () => { touch('sottotono'); setUndertone(Number(r.dataset.value)); });
    r.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      touch('sottotono');
      setUndertone(Number(r.dataset.value) ? 0 : 1, true);
    });
  });
  setUndertone(0);

  // Slider: valore, intensita', contrasto
  const sliders = [...section.querySelectorAll('[data-control]')].map((input) => {
    const kind = input.dataset.control;
    const target = kind === 'contrast' ? section.querySelector('[data-trio]') : section.querySelector(`[data-scale="${kind}"]`);
    const prop = { value: '--v', chroma: '--s', contrast: '--k' }[kind];
    const update = () => {
      const v = input.value / 100;
      target.style.setProperty(prop, v.toFixed(3));
      input.setAttribute('aria-valuetext', WORDS[kind][Math.round(v * 4)]);
    };
    input.addEventListener('input', () => { touch(kind); update(); });
    update();
    return { input, update };
  });

  // Una piccola dimostrazione la prima volta che la sezione entra in vista (si ferma al primo tocco).
  let demo = null;
  if (!reduced) {
    ScrollTrigger.create({
      trigger: section.querySelector('.traits__grid'),
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (touched) return;
        demo = gsap.timeline({ delay: 0.3 })
          .call(() => setUndertone(1)).call(() => setUndertone(0), null, '+=1.3');
        sliders.forEach((s, i) => {
          const proxy = { v: 50 };
          const drive = () => { s.input.value = proxy.v; s.update(); };
          demo.to(proxy, { v: 82, duration: 0.7, ease: 'drape', onUpdate: drive }, 0.5 + i * 0.35)
            .to(proxy, { v: 50, duration: 0.8, ease: 'drape', onUpdate: drive }, 1.2 + i * 0.35);
        });
      },
    });
  }
}
