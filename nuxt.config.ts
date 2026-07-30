// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@vite-pwa/nuxt'],
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
      image: 'public/icon_swaipe.svg',
      preset: {
        transparent: {
          sizes: [64, 192, 512],
          favicons: [[48, 'favicon.ico']],
        },
        maskable: {
          sizes: [512],
          padding: 0.3,
          resizeOptions: { background: '#ffda00' },
        },
        apple: {
          sizes: [180],
          padding: 0.3,
          resizeOptions: { background: '#ffda00' },
        },
      },
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,woff,woff2,svg,png,webp,ico}'],
      navigateFallbackDenylist: [/^\/api\//],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
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
      title: 'SWAIPE',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/icon_swaipe.svg',
        },
      ],
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      ],
    },
  },
})