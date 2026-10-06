// Markup generato in fase di build (vedi plugin in vite.config.js): stagioni e nastro di swatch.
// Cosi' l'HTML finale contiene tutto il contenuto anche senza JavaScript (SEO, accessibilita').
import { SEASONS, RIBBON } from './seasons.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function renderSeasonsNav() {
  return SEASONS.map((s, i) =>
    `<li><a class="seasons__tab" href="#stagione-${s.id}" data-index="${i}"${i === 0 ? ' aria-current="true"' : ''}>${s.name}</a></li>`,
  ).join('\n            ');
}

export function renderSeasons() {
  return SEASONS.map((s, si) => `
          <article class="season" id="stagione-${s.id}" data-index="${si}" data-theme="${s.theme}" style="--season-bg:${s.bg};--season-ink:${s.ink}" aria-labelledby="s-${s.id}">
            <header class="season__head">
              <h3 class="season__name" id="s-${s.id}">${s.name}</h3>
              <p class="season__traits">${s.traits}</p>
              <p class="season__text">${s.text}</p>
            </header>
            <ul class="season__groups" role="list">${s.groups.map((g, gi) => `
              <li class="group" style="--g:${gi}">
                <h4 class="group__name">${s.name} <em>${esc(g.name)}</em></h4>
                <p class="group__gloss">${esc(g.gloss)}</p>
                <ul class="swatches" role="list" aria-label="Palette indicativa ${s.name} ${esc(g.name)}">${g.colors.map(([n, c], ci) =>
                  `<li class="swatch" style="--c:${c};--k:${ci}" aria-label="${esc(n)}"></li>`).join('')}</ul>
              </li>`).join('')}
            </ul>
          </article>`).join('');
}

export function renderRibbon() {
  const items = RIBBON.map(([n, c]) => `<li class="ribbon__item" style="--c:${c}"><span class="ribbon__chip"></span><span class="ribbon__name">${esc(n)}</span></li>`).join('');
  return `<ul class="ribbon__track" role="list">${items}</ul><ul class="ribbon__track" role="list" aria-hidden="true">${items}</ul>`;
}

export const SEASON_META = SEASONS.map(({ id, name, bg, ink, theme }) => ({ id, name, bg, ink, theme }));
