import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

/**
 * Il sito è pubblicato su GitHub Pages sotto il path del repository, quindi
 * `base` deve corrispondere al nome del repo.
 *
 * Lo stesso `base` vale in dev, build e preview: `vite preview` gira con
 * command === 'serve' come il dev server, quindi renderlo condizionale
 * romperebbe il preview della build (gli asset finirebbero in 404).
 * Dev e preview servono quindi su http://localhost:PORT/<REPO>/.
 */
const REPO = 'fdi-2026-sapienza-ingegneria-elettronica';

export default defineConfig(() => ({
  base: `/${REPO}/`,
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: "AE·FIN — Palestra d'esame",
        short_name: 'AE·FIN',
        description:
          "Simulatore d'esame per Architettura degli Elaboratori (Fondamenti di Informatica, Sapienza).",
        lang: 'it',
        start_url: `/${REPO}/`,
        scope: `/${REPO}/`,
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
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
