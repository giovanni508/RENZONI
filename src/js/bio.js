// CHI SONO e dettagli di scena: il ritratto si "posa" come una foto sul tavolo, la firma si disegna;
// la maschera a piega del video in "Cosa faccio" respira con lo scroll.
import { gsap, ScrollTrigger, reduced } from './motion.js';

export function initBio() {
  if (reduced) return;

  const portrait = document.querySelector('.bio__portrait');
  if (portrait) {
    gsap.fromTo(portrait, { rotate: -7, y: 80, opacity: 0 }, {
      rotate: -2, y: 0, opacity: 1, duration: 1.4,
      scrollTrigger: { trigger: portrait, start: 'top 85%', once: true },
    });
  }

  const sign = document.querySelector('.bio__sign');
  if (sign) {
    gsap.fromTo(sign, { strokeDasharray: '1 1', strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 2.4, ease: 'drape',
      scrollTrigger: { trigger: sign, start: 'top 90%', once: true },
    });
  }

  // Maschera a piega: morph lento tra due pieghe + leggero zoom del video, guidati dallo scroll
  const fold = document.querySelector('[data-fold]');
  const a = document.getElementById('fold-a');
  if (fold && a) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: fold, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    tl.to(a, { morphSVG: '#fold-b', ease: 'none' }, 0)
      .fromTo(fold, { '--zoom': 1.16 }, { '--zoom': 1.02, ease: 'none' }, 0)
      .fromTo(fold, { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0);
  }

  // Ingresso dei canali di contatto: uno dopo l'altro
  const channels = document.querySelectorAll('.channel');
  if (channels.length) {
    gsap.from(channels, { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: channels[0], start: 'top 88%', once: true } });
  }
}
