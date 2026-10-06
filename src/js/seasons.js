// 16 STAGIONI
// - Desktop (>= 900 px): la sezione si ferma e "cambia stagione" mentre scorri: fondo, inchiostro, palette.
// - Mobile: niente blocco dello scroll. Le stagioni scorrono in colonna con tutti i testi, il fondo
//   della sezione passa da un colore all'altro e le voci restano fisse in alto.
// - Senza JS o con movimento ridotto: quattro blocchi colorati uno sotto l'altro.
import { gsap, ScrollTrigger, reduced, getLenis } from './motion.js';
import { setNavTheme } from './nav.js';

export function initSeasons() {
  const section = document.querySelector('.seasons');
  if (!section || reduced) return;
  const pin = section.querySelector('.seasons__pin');
  const top = section.querySelector('.seasons__top');
  const nav = section.querySelector('.seasons__nav');
  const panels = [...section.querySelectorAll('.season')];
  const tabs = [...section.querySelectorAll('.seasons__tab')];
  if (!panels.length) return;

  const data = panels.map((p) => ({
    bg: p.style.getPropertyValue('--season-bg').trim(),
    ink: p.style.getPropertyValue('--season-ink').trim(),
    theme: p.dataset.theme || 'light',
  }));
  const paint = (i, dur = 0.9) => gsap.to(section, { '--season-bg': data[i].bg, '--season-ink': data[i].ink, duration: dur, ease: 'drape', overwrite: 'auto' });
  const markTab = (i) => tabs.forEach((t, k) => (k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
  const swatchIn = (scope, dir = 1) => gsap.fromTo(scope.querySelectorAll('.swatch'),
    { yPercent: -28 * dir, opacity: 0, rotate: () => gsap.utils.random(-4, 4) },
    { yPercent: 0, opacity: 1, rotate: 0, duration: 0.95, delay: 0.2, stagger: { each: 0.01 }, ease: 'silk', overwrite: true });

  const mm = gsap.matchMedia();

  /* ---------------------------------------------------------------- desktop: sezione fissata */
  mm.add('(min-width: 900px)', () => {
    section.classList.add('is-enhanced');
    gsap.set(section, { '--season-bg': data[0].bg, '--season-ink': data[0].ink });
    gsap.set(panels, { autoAlpha: 0 });
    gsap.set(panels[0], { autoAlpha: 1 });
    markTab(0);
    let active = 0;
    let inView = false;

    const show = (i, dir = 1) => {
      if (i === active) return;
      const prev = panels[active];
      const next = panels[i];
      active = i;
      paint(i);
      if (inView) setNavTheme(data[i].theme, { lock: true });
      markTab(i);
      gsap.killTweensOf(prev.querySelectorAll('*'));
      gsap.to(prev, { autoAlpha: 0, duration: 0.35, ease: 'power2.in', overwrite: true });
      gsap.to(prev.querySelectorAll('.swatch'), { yPercent: 22 * dir, duration: 0.35, ease: 'power2.in', stagger: 0.004, overwrite: true });
      gsap.killTweensOf(next);
      gsap.set(next, { autoAlpha: 1 });
      gsap.fromTo(next.querySelector('.season__name'), { yPercent: 45 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.12, overwrite: true });
      gsap.fromTo(next.querySelectorAll('.season__traits, .season__text, .group__name, .group__gloss'),
        { y: 14 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.2, stagger: 0.035, overwrite: true });
      swatchIn(next, dir);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      pin,
      start: 'top top',
      end: () => `+=${Math.round(innerHeight * 2.6)}`,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => show(Math.min(panels.length - 1, Math.floor(self.progress * panels.length * 0.9999)), self.direction),
      onToggle: (self) => {
        inView = self.isActive;
        setNavTheme(inView ? data[active].theme : 'light', { lock: inView });
      },
    });

    const onTab = (e) => {
      const i = tabs.indexOf(e.currentTarget);
      e.preventDefault();
      e.stopPropagation();
      const y = st.start + ((i + 0.5) / panels.length) * (st.end - st.start);
      const lenis = getLenis();
      lenis ? lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    };
    tabs.forEach((t) => t.addEventListener('click', onTab));

    return () => {
      tabs.forEach((t) => t.removeEventListener('click', onTab));
      section.classList.remove('is-enhanced');
      gsap.set(panels, { clearProps: 'all' });
      gsap.set(section, { clearProps: '--season-bg,--season-ink' });
    };
  });

  /* ---------------------------------------------------------------- mobile: flusso continuo */
  mm.add('(max-width: 899px)', () => {
    section.classList.add('is-flow');
    // le voci diventano figlie dirette del contenitore alto, cosi' possono restare fisse durante la sezione
    pin.insertBefore(nav, top.nextSibling);
    gsap.set(section, { '--season-bg': data[0].bg, '--season-ink': data[0].ink });
    markTab(0);
    let active = 0;
    let inView = false;
    const triggers = panels.map((panel, i) => ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => {
        if (!self.isActive || i === active) return;
        active = i;
        paint(i, 0.8);
        markTab(i);
        if (inView) setNavTheme(data[i].theme, { lock: true });
      },
    }));
    const whole = ScrollTrigger.create({
      trigger: section,
      start: () => `top ${parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) / 2}px`,
      end: 'bottom top',
      onToggle: (self) => { inView = self.isActive; setNavTheme(inView ? data[active].theme : 'light', { lock: inView }); },
    });
    const reveals = panels.map((panel) => ScrollTrigger.create({
      trigger: panel.querySelector('.season__groups'),
      start: 'top 88%',
      once: true,
      onEnter: () => swatchIn(panel),
    }));
    return () => {
      [...triggers, whole, ...reveals].forEach((t) => t.kill());
      top.append(nav);
      section.classList.remove('is-flow');
      gsap.set(section, { clearProps: '--season-bg,--season-ink' });
    };
  });
}
