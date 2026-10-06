// Moduli caricati a browser libero (dopo il primo paint): non servono per la prima schermata.
// Qui vivono anche i plugin piu' pesanti (SplitText, MorphSVG), cosi' il JS iniziale resta leggero.
import { gsap, ScrollTrigger, magnetic } from './motion.js';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { initReveal } from './reveal.js';
import { initTraits } from './traits.js';
import { initFacial } from './facial.js';
import { initSteps } from './steps.js';
import { initBio } from './bio.js';
import { initVideos } from './videos.js';
import { initForm } from './form.js';
import { initConsent } from './consent.js';

gsap.registerPlugin(MorphSVGPlugin);

export function initDeferred() {
  initTraits();
  initFacial();
  initSteps();
  initBio();
  initReveal();
  magnetic();
  initVideos();
  initForm();
  initConsent();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
