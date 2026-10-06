import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import site from './site.config.js';
import { renderSeasons, renderSeasonsNav, renderRibbon } from './src/data/render.js';

// 1) <!-- @include percorso [id=suffisso] -->  inserisce un file (es. il logo SVG) rendendo unici gli id.
// 2) <!-- @seasons -->, <!-- @seasons-nav -->, <!-- @ribbon -->  markup generato da src/data/seasons.js.
// 3) {{chiave}} -> valori di site.config.js (testo e attributi); {{chiave|url}} applica encodeURIComponent.
function siteData() {
  const blocks = { seasons: renderSeasons, 'seasons-nav': renderSeasonsNav, ribbon: renderRibbon };
  return {
    name: 'site-data',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        html = html.replace(/<!--\s*@include\s+(\S+)(?:\s+id=(\w+))?\s*-->/g, (m, file, suffix) => {
          let s = readFileSync(resolve(import.meta.dirname, file), 'utf8').trim();
          if (suffix) s = s.replace(/id="([^"]+)"/g, `id="$1-${suffix}"`).replace(/aria-labelledby="([^"]+)"/g, `aria-labelledby="$1-${suffix}"`);
          return s;
        });
        html = html.replace(/<!--\s*@(seasons-nav|seasons|ribbon)\s*-->/g, (m, key) => blocks[key]());
        return html.replace(/\{\{\s*(\w+)(\|url)?\s*\}\}/g, (m, key, enc) => {
          if (!(key in site)) return m;
          const v = String(site[key]);
          return enc ? encodeURIComponent(v) : v;
        });
      },
    },
  };
}

// Icone Phosphor inline: <i data-icon="whatsapp-logo" data-weight="light"></i> -> <svg ...> (aria-hidden).
function phosphorIcons() {
  const dir = resolve(import.meta.dirname, 'node_modules/@phosphor-icons/core/assets');
  const cache = new Map();
  const load = (name, weight) => {
    const key = `${name}:${weight}`;
    if (!cache.has(key)) {
      const file = weight === 'regular' ? `${dir}/regular/${name}.svg` : `${dir}/${weight}/${name}-${weight}.svg`;
      cache.set(key, readFileSync(file, 'utf8'));
    }
    return cache.get(key);
  };
  return {
    name: 'phosphor-icons',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<i data-icon="([\w-]+)"(?: data-weight="(\w+)")?(?: class="([^"]*)")?\s*><\/i>/g, (m, name, weight = 'light', cls = '') => {
          const classes = ['icon', cls].filter(Boolean).join(' ');
          return load(name, weight)
            .replace(/ width="[^"]*"| height="[^"]*"/g, '')
            .replace('<svg ', `<svg class="${classes}" aria-hidden="true" focusable="false" `);
        });
      },
    },
  };
}

// SEO: robots.txt e sitemap.xml generati dal dominio in site.config.js. Finche' il dominio e' un segnaposto
// ([DOMINIO-DA-INSERIRE]) il canonical non viene scritto e robots.txt resta valido senza la riga Sitemap.
function seoFiles() {
  const real = /^https?:\/\/[^[\]\s]+$/.test(site.siteUrl);
  const pages = ['/', '/privacy.html', '/cookie.html'];
  const robots = `User-agent: *\nAllow: /\n${real ? `\nSitemap: ${site.siteUrl}/sitemap.xml\n` : '\n# Imposta siteUrl in site.config.js per aggiungere la Sitemap\n'}`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p, i) => `  <url><loc>${site.siteUrl}${p}</loc><changefreq>${i ? 'yearly' : 'monthly'}</changefreq><priority>${i ? '0.2' : '1.0'}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  return {
    name: 'seo-files',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => (real ? html : html.replace(/\s*<link rel="canonical"[^>]*>/, '\n  <!-- canonical: imposta siteUrl in site.config.js -->')),
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') { res.setHeader('Content-Type', 'text/plain'); return res.end(robots); }
        if (req.url === '/sitemap.xml') { res.setHeader('Content-Type', 'application/xml'); return res.end(sitemap); }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig({
  plugins: [siteData(), phosphorIcons(), seoFiles()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        cookie: resolve(import.meta.dirname, 'cookie.html'),
      },
    },
  },
  server: { host: true, port: 5173 },
  preview: { port: 4173 },
});
