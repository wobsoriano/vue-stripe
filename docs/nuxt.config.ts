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
    urls: [
      '/',
      '/getting-started/introduction',
      '/getting-started/installation',
      '/getting-started/setup-application',
      '/core-concepts/elements',
      '/core-concepts/payment-element',
      '/core-concepts/express-checkout-element',
      '/core-concepts/link-authentication-element',
      '/core-concepts/address-element',
      '/core-concepts/card-elements',
      '/core-concepts/checkout',
      '/advance/service',
      '/advance/styling',
      '/advance/reference-instance',
      '/advance/mount-your-element',
      '/support/faqs',
      '/support/examples',
    ],
  },
})
