// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  // Unveränderliche statische Assets (Fonts, Icons, Loading-Frames, Texturen)
  // langfristig cachen - werden nicht überschrieben, neue Versionen bekommen
  // neue Dateinamen. Spart wiederholte Downloads bei erneuten Besuchen.
  routeRules: {
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/icons/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/loading/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/textures/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  modules: ['@nuxtjs/supabase', '@vite-pwa/nuxt'],
  supabase: {
    redirect: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'SWAIPE',
      short_name: 'SWAIPE',
      description: 'Errate ob Bild, Video, Audio oder Musik echt oder KI-generiert ist.',
      lang: 'de',
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#560000',
      background_color: '#ffffff',
    },
    pwaAssets: {
      // Als App-Icon (Homescreen) dient bewusst der letzte Frame der
      // Ladeanimation statt des Standard-Logos - so wirkt der Übergang vom
      // Icon zum Ladebildschirm stimmiger.
      image: 'public/icon_app.png',
      preset: {
        transparent: {
          sizes: [64, 192, 512],
          favicons: [[48, 'favicon.ico']],
        },
        // Bewusst KEIN maskable-Icon (leere sizes-Liste): Android beschneidet
        // Maskable-Icons immer auf eine Kreis-/Squircle-Sicherheitszone. Der
        // Schlüssel muss trotzdem vorhanden sein, sonst crasht der Assets-
        // Generator. Das "transparent"-Preset oben liefert stattdessen das
        // App-Icon unbeschnitten. icon_app.png hat (wie der Ladebildschirm)
        // bereits einen weissen Hintergrund, es wird also nichts transparent
        // gestanzt - der Name des Presets bezieht sich nur darauf, dass keine
        // Maskable-Beschneidung angewendet wird.
        maskable: {
          sizes: [],
        },
        apple: {
          sizes: [180],
          padding: 0.2,
          resizeOptions: { background: '#ffffff' },
        },
      },
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,woff,woff2,svg,png,webp,ico}'],
      // Schriften, Avatare und Loading-Frames sind schwer (~3.5 MB) und nicht
      // fürs App-Booten nötig - werden vom Precache ausgenommen, damit die
      // Installation nicht wie ein grosser Download wirkt, sondern (wie ein
      // Homescreen-Shortcut) sofort da ist. Sie laden stattdessen beim ersten
      // Gebrauch aus dem Netz und werden dann per runtimeCaching abgelegt.
      globIgnores: ['fonts/**', 'icons/avatare/**', 'loading/**'],
      // Wichtig für diese SSR-App: KEIN navigateFallback. Das Modul würde sonst
      // standardmässig alle Seitenaufrufe auf die gecachte Startseite umleiten
      // (SPA-Verhalten) - das kollidiert mit serverseitig gerenderten Seiten
      // (Login-Check, persönliche Daten) und führt zu falschen/alten Seiteninhalten.
      navigateFallback: undefined,
      runtimeCaching: [
        {
          urlPattern: ({ url }: { url: URL }) =>
            url.pathname.startsWith('/fonts/') ||
            url.pathname.startsWith('/icons/avatare/') ||
            url.pathname.startsWith('/loading/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'swaipe-lazy-assets',
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 24 * 60 * 60 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      title: 'SWAIPE',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/icon_swaipe.svg',
        },
        // Überschriften-Fonts werden auf praktisch jeder Seite sofort sichtbar
        // gebraucht (h1-h3 BarlowCondensed, h4 DotGothic16) - per Preload früher
        // anfordern statt erst nach dem Parsen des CSS.
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/BarlowCondensed-Medium.woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/DotGothic16-Regular.woff2',
          crossorigin: 'anonymous',
        },
      ],
      meta: [
        // mobile-web-app-capable: Standard-Tag für Chrome/Android
        { name: 'mobile-web-app-capable', content: 'yes' },
        // apple-mobile-web-app-*: iOS Safari kennt nur diese Variante, wird von Chrome
        // zwar als "deprecated" gemeldet, ist für Safari aber weiterhin nötig
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      ],
    },
  },
})