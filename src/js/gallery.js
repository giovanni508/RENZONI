// GALLERIA: su desktop la sezione si ferma e i reel scorrono in orizzontale con lo scroll;
// su mobile resta un carosello nativo con scroll-snap (piu' naturale col pollice).
import { gsap, reduced } from './motion.js';

export function initGallery() {
  const section = document.querySelector('.gallery');
  if (!section || reduced) return;
  const pin = section.querySelector('.gallery__pin');
  const viewport = section.querySelector('.gallery__viewport');
  const track = section.querySelector('.gallery__track');
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', () => {
    section.classList.add('is-enhanced');
    const distance = () => {
      const cs = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return Math.max(0, track.scrollWidth - inner);
    };
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin,
        start: 'top top',
        end: () => `+=${Math.max(innerHeight * 0.6, distance() * 1.1)}`,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    // i reel entrano leggermente sfalsati: come cartoncini appoggiati uno dopo l'altro
    gsap.from(track.querySelectorAll('.reel'), {
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.08,
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(track, { clearProps: 'x' }); section.classList.remove('is-enhanced'); };
  });
}
