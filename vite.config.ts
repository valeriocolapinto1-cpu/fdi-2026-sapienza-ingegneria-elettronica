import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { ADSENSE_CLIENT, SITE_URL } from './src/lib/site';

/**
 * Il sito è servito dalla **radice** del suo host, non più da un sotto-path.
 *
 * Non è una preferenza estetica: `ads.txt` deve stare alla radice del dominio
 * perché Google lo trovi, e sotto `github.io/<repo>/` quella radice non è
 * nostra. Da qui il trasloco su Cloudflare Pages, dove `aefin.pages.dev` è un
 * dominio a tutti gli effetti (`pages.dev` sta nel Public Suffix List).
 *
 * Con `base: '/'` cadono anche i percorsi assoluti con il nome del repo dentro
 * — sparsi in `404.html`, nel manifest e nella sitemap — che erano l'ultimo
 * punto in cui il nome dell'ateneo compariva in un indirizzo.
 */

/**
 * I metadati assoluti di `index.html` (`og:url`, `og:image`) non possono
 * essere relativi: i crawler delle anteprime non risolvono `./` rispetto alla
 * pagina, e l'immagine resterebbe vuota. Invece di ripetere il dominio in
 * cinque punti, l'HTML scrive `%SITE_URL%` e lo sostituiamo qui, leggendolo
 * dalla stessa costante che usa l'applicazione.
 */
const siteUrlPlugin: Plugin = {
  name: 'aefin-site-url',
  transformIndexHtml: (html: string): string => html.replaceAll('%SITE_URL%', SITE_URL),
};

/**
 * `ads.txt`, generato **solo** quando il publisher ID esiste davvero.
 *
 * Non sta in `public/` con un segnaposto dentro, e la ragione è precisa: il
 * crawler di Google legge quel file alla lettera. Un `pub-XXXXXXXX` finto non
 * è un file «da riempire dopo» — è una dichiarazione sbagliata su chi può
 * vendere lo spazio pubblicitario di questo sito, e vale peggio del file
 * assente. Finché `ADSENSE_CLIENT` è vuoto il file non viene proprio scritto.
 *
 * `f08c47fec0942fa0` non è un valore inventato: è l'identificativo con cui
 * Google si presenta nello standard IAB, uguale per tutti i publisher.
 */
const adsTxtPlugin: Plugin = {
  name: 'aefin-ads-txt',
  generateBundle() {
    if (!ADSENSE_CLIENT.startsWith('pub-')) return;
    this.emitFile({
      type: 'asset',
      fileName: 'ads.txt',
      source: `google.com, ${ADSENSE_CLIENT}, DIRECT, f08c47fec0942fa0\n`,
    });
  },
};

export default defineConfig(() => ({
  base: '/',
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    preact(),
    tailwindcss(),
    siteUrlPlugin,
    adsTxtPlugin,
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AE·FIN — Palestra di Architettura degli Elaboratori',
        short_name: 'AE·FIN',
        description:
          'Teoria, esercizi svolti e prove di autovalutazione di Architettura degli Elaboratori.',
        lang: 'it',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0E1116',
        theme_color: '#0E1116',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // I font self-hostati sono file locali: entrano nel precache come il resto.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        /**
         * Fuori dal precache ciò che l'utente non apre mai:
         *
         * - `social.jpg` la scarica solo il crawler di WhatsApp o Telegram
         *   quando qualcuno incolla il link;
         * - `404.html` è una pagina autonoma servita da GitHub Pages per i
         *   percorsi sbagliati, e precaricarla la farebbe pure comparire al
         *   posto dell'app in certi scenari di navigazione offline.
         */
        globIgnores: ['**/social.*', '**/404.html'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
