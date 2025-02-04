export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
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
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/blocks.js',
    '@/plugins/components',
    '@/plugins/firebase.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/firebase'
  ],

  firebase: {
    config: {
      apiKey: "AIzaSyBtyhVvhsZabNKtYCNWUYWVsTyHs1m_gOw",
      authDomain: "blockeditor-ab41b.firebaseapp.com",
      projectId: "blockeditor-ab41b",
      storageBucket: "blockeditor-ab41b.firebasestorage.app",
      messagingSenderId: "664484068128",
      appId: "1:664484068128:web:60cade9c3e81c6dbcd7545",
      measurementId: "G-VYG2QPG9W5"
    },
    services: {
      firestore: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
