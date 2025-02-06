// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: [
    '@/assets/css/main.css',
  ],

  app: {
    head: {
      title: 'editor',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  components: {
    dirs: [
      '~/components',
      '~/components/editor',
      '~/components/preview',
      '~/components/shared',
      '~/components/ui'
    ]
  },

  nitro: {
    preset: 'node'
  },

  // Отключаем SSR для страниц редактора
  ssr: false,

  devtools: { enabled: true },

  routeRules: {
    '/': { redirect: '/editor' }
  },

  compatibilityDate: '2025-02-05',

  // Добавим явные настройки для роутера
  router: {
    options: {
      strict: false
    }
  },

  experimental: {
    payloadExtraction: false
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      }
    }
  }
})