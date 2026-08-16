export default defineNuxtConfig({
  modules: ['vue-stripe/nuxt'],
  stripe: {
    publishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.NUXT_STRIPE_SECRET_KEY,
  },
})
