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
})
