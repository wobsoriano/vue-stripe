// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY
    }
  }
})
