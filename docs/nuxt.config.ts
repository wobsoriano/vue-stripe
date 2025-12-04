export default defineNuxtConfig({
  extends: ['docus'],
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  site: {
    name: 'Vue Stripe',
    url: 'https://vue-stripe.dev',
  },
  sitemap: {
    // This setting is crucial for Nuxt Content integration
    strictNuxtContentPaths: true,
  },
})
