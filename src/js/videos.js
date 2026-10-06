// Video: caricamento pigro, riproduzione solo in vista, pausa fuori schermo, versioni mobile,
// rispetto di prefers-reduced-motion e Save-Data (resta il poster; si puo' avviare a mano).
import { reduced, saveData, canHover } from './motion.js';
import pauseSvg from '@phosphor-icons/core/assets/fill/pause-fill.svg?raw';
import playSvg from '@phosphor-icons/core/assets/fill/play-fill.svg?raw';

const mobile = matchMedia('(max-width: 767px)').matches;
const AV1 = 'video/webm; codecs="av01.0.05M.08"';

const asIcon = (svg) => svg.replace('<svg ', '<svg class="icon" aria-hidden="true" focusable="false" ');
const icons = { pause: asIcon(pauseSvg), play: asIcon(playSvg) };

function build(media) {
  if (media._video) return media._video;
  const id = media.dataset.video;
  const sfx = mobile ? '-m' : '';
  const v = document.createElement('video');
  v.className = 'media__video';
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('playsinline', '');
  v.setAttribute('muted', '');
  v.setAttribute('aria-hidden', 'true');
  v.setAttribute('tabindex', '-1');
  v.disablePictureInPicture = true;
  v.preload = 'auto';
  const s1 = document.createElement('source');
  s1.src = `/assets/video/${id}${sfx}.webm`;
  s1.type = AV1;
  const s2 = document.createElement('source');
  s2.src = `/assets/video/${id}${sfx}.mp4`;
  s2.type = 'video/mp4';
  if (v.canPlayType(AV1)) v.append(s1);
  v.append(s2);
  v.addEventListener('playing', () => media.classList.add('is-playing'));
  media.append(v);
  media._video = v;
  return v;
}

function addToggle(media) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'media__toggle';
  const set = (playing) => {
    b.innerHTML = playing ? icons.pause : icons.play;
    b.setAttribute('aria-label', playing ? 'Metti in pausa il video' : 'Riproduci il video');
  };
  set(false);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    const v = build(media);
    if (v.paused) { media.dataset.user = 'play'; media.classList.remove('is-paused'); v.play().catch(() => {}); }
    else { media.dataset.user = 'pause'; media.classList.add('is-paused'); v.pause(); }
  });
  media.append(b);
  media._setToggle = set;
}

const play = (media) => {
  if (media.dataset.user === 'pause') return;
  const v = build(media);
  const p = v.play();
  if (p) p.then(() => media._setToggle?.(true)).catch(() => {});
};
const stop = (media) => {
  const v = media._video;
  if (v && !v.paused) { v.pause(); media._setToggle?.(false); }
};

export function initVideos() {
  const all = [...document.querySelectorAll('.media[data-video]')];
  if (!all.length) return;
  const autoOK = !reduced && !saveData;
  all.forEach(addToggle);

  // Precarica la sorgente poco prima che entri in vista (solo se puo' partire da sola)
  const near = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      near.unobserve(en.target);
      if (autoOK) build(en.target);
    });
  }, { rootMargin: '60% 0px 60% 0px' });

  // Riproduce solo quando e' davvero visibile
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const m = en.target;
      const hoverOnly = m.hasAttribute('data-hover') && canHover;
      if (en.isIntersecting && en.intersectionRatio >= 0.45) {
        if (autoOK && !hoverOnly) play(m);
      } else {
        stop(m);
        m.classList.remove('is-playing');
      }
    });
  }, { threshold: [0, 0.45, 0.8] });

  all.forEach((m) => {
    near.observe(m);
    seen.observe(m);
    // Galleria su desktop: parte al passaggio del mouse o al focus della card
    if (m.hasAttribute('data-hover') && canHover) {
      const card = m.closest('.reel') || m;
      card.addEventListener('pointerenter', () => { if (!saveData) play(m); });
      card.addEventListener('pointerleave', () => { stop(m); });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) all.forEach(stop);
  });
}
