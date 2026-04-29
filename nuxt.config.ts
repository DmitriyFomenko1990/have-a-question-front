export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  components: [
    {
      path: '~/shared/ui',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    apiBaseUrl: 'http://localhost:8000',
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  i18n: {
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    restructureDir: 'app',
    locales: [
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    langDir: 'locales',
  },
  typescript: {
    strict: true,
  },
})
