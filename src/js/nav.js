// Navbar: tema chiaro/scuro in base alla sezione sotto, sfondo dopo l'hero, voce attiva,
// menu mobile accessibile (focus trap, ESC) e barra CTA mobile.
import { gsap, ScrollTrigger, getLenis, reduced, navHeight } from './motion.js';

const nav = document.querySelector('.nav');
const toggle = nav?.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const bar = document.querySelector('[data-cta-bar]');
let themeLock = null; // l'hero e le stagioni possono imporre il tema mentre sono attivi

export function setNavTheme(theme, { lock } = {}) {
  if (lock !== undefined) themeLock = lock ? theme : null;
  const t = themeLock || theme;
  if (nav && nav.dataset.navTheme !== t) nav.dataset.navTheme = t;
}
export function setNavBrand(on) { nav?.classList.toggle('has-brand', on); }

export function initNav() {
  if (!nav) return;
  const hero = document.querySelector('.hero');

  // Sfondo pieno appena si lascia la cima della pagina
  ScrollTrigger.create({
    start: 8,
    end: 'max',
    onToggle: (self) => nav.classList.toggle('is-solid', self.isActive),
  });

  // Tema in base alla sezione che passa sotto la barra
  document.querySelectorAll('[data-nav]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: () => `top ${navHeight() / 2}px`,
      end: () => `bottom ${navHeight() / 2}px`,
      onToggle: (self) => { if (self.isActive) setNavTheme(section.dataset.nav); },
    });
  });

  // Logo nella barra quando l'hero e' alle spalle (con movimento ridotto: senza la transizione dell'hero)
  if (reduced && hero) {
    ScrollTrigger.create({ trigger: hero, start: 'bottom 40%', onToggle: (s) => setNavBrand(s.isActive) });
  }

  // Voce di menu attiva
  const links = [...nav.querySelectorAll('.nav__links a')];
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) links.forEach((l) => l.toggleAttribute('aria-current', l === a));
        else a.removeAttribute('aria-current');
      },
    });
  });

  initMenu();
  initBar(hero);
}

function initMenu() {
  if (!toggle || !menu) return;
  const label = toggle.querySelector('[data-label]');
  const focusables = () => [...menu.querySelectorAll('a, button'), toggle];
  let open = false;

  const set = (state) => {
    open = state;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Chiudi il menu' : 'Apri il menu';
    nav.classList.toggle('menu-open', open);
    const lenis = getLenis();
    if (open) {
      menu.hidden = false;
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      if (!reduced) {
        gsap.fromTo(menu, { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' }, { clipPath: 'polygon(0 0, 200% 0, 0 200%, 0 200%)', duration: 0.9, ease: 'drape' });
        gsap.from(menu.querySelectorAll('.menu__links li, .menu__cta, .menu__contacts'), { y: 28, opacity: 0, duration: 0.9, stagger: 0.05, delay: 0.2 });
      }
      menu.querySelector('a')?.focus({ preventScroll: true });
    } else {
      const done = () => { menu.hidden = true; };
      lenis?.start();
      document.documentElement.style.overflow = '';
      if (reduced) done();
      else gsap.to(menu, { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)', duration: 0.6, ease: 'power3.in', onComplete: done });
    }
  };

  toggle.addEventListener('click', () => set(!open));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { set(false); toggle.focus(); }
    if (e.key === 'Tab') {
      const f = focusables();
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches && open) set(false); });
}

// Barra CTA mobile: compare dopo l'hero, sparisce sopra i contatti e il footer.
function initBar(hero) {
  if (!bar) return;
  const contact = document.getElementById('contatti');
  let pastHero = false;
  let nearContact = false;
  const update = () => {
    const show = pastHero && !nearContact;
    bar.classList.toggle('is-visible', show);
    if (show) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
  };
  const after = document.getElementById('armocromia') || hero;
  if (after) ScrollTrigger.create({ trigger: after, start: 'top 85%', end: 'max', onToggle: (s) => { pastHero = s.isActive; update(); } });
  if (contact) ScrollTrigger.create({ trigger: contact, start: 'top 85%', end: 'max', onToggle: (s) => { nearContact = s.isActive; update(); } });
}
