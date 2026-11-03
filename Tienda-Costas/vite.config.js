import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'FreshMix E-Commerce',
        short_name: 'FreshMix',
        description: 'Jugos naturales prensados en frío',
        theme_color: '#006e2b',
        background_color: '#fafaf4',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/demo/') || url.pathname.startsWith('/static/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'imagenes-freshmix',
              expiration: { maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url, request }) => request.method === 'GET' && url.pathname.includes('/productos'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-productos',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    })
  ],
  
  // ACÁ ESTÁ LA SOLUCIÓN AL ERROR DE REACT EN VITEST
  esbuild: {
    jsx: 'automatic',
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  
});